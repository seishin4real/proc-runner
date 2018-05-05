import * as events from './events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { ChildProcess } from 'child_process';
import { ProcOutputComponent } from 'components/proc-output';
import { Guid } from 'guid-typescript';
import { compact as _compact, find as _find, findIndex as _findIndex, flatten as _flatten } from 'lodash';
import {
  MessageType,
  Process,
  ProcessMeta,
  ProcState,
  Project,
  ProjectMeta
  } from 'models';
import { moveInArray, showNotification } from 'resources';
import { StoreService } from 'store.service';

const anyWin = window as any;
const { spawn } = anyWin.nodeRequire('child_process');
const psTree = anyWin.nodeRequire('ps-tree');

@autoinject()
export class ProcManager {
  constructor(
    private _ea: EventAggregator,
    private _store: StoreService
  ) {
    _ea.subscribe(events.PROJECT_START, this.projectStart.bind(this));
    _ea.subscribe(events.PROJECT_RESET, this.projectReset.bind(this));
    _ea.subscribe(events.PROJECT_STOP, this.projectStop.bind(this));
    _ea.subscribe(events.PROC_START, this.procStart.bind(this));
    _ea.subscribe(events.PROC_RESET, this.procReset.bind(this));
    _ea.subscribe(events.PROC_STOP, this.procStop.bind(this));

    _ea.subscribe(events.PROJECTS_MODIFIED, () => this._store.saveProjects(this.projects));
    _ea.subscribe(events.APP_CLOSING, () => this.killProcesses(() => this._ea.publish(events.APP_FINISHED)));

    _ea.subscribeOnce(events.OUTPUT_INITIALIZED, output => this._output = output);

    _ea.subscribe(events.PROC_MOVED, this.moveProc.bind(this));
    _ea.subscribe(events.PROC_DELETED, this.deleteProc.bind(this));
    _ea.subscribe(events.PROJECT_MOVED, this.moveProject.bind(this));
    _ea.subscribe(events.PROJECT_DELETED, this.deleteProject.bind(this));
  }

  private _output: ProcOutputComponent;

  projects: Project[];

  getProjects(): Project[] {
    return this.projects = this._store.getProjects()
      .map(this.initializeMeta.bind(this));
  }

  addProject() {
    this.projects.push(<Project>{
      id: Guid.raw(),
      title: 'new project',
      procs: [],
      meta: this.initializeProjectMeta(null, false)
    });
  }

  addProcess(project: Project) {
    project.procs.push(<Process>{
      id: Guid.raw(),
      title: 'new process',
      command: 'npm.cmd',
      args: 'run',
      path: '',
      startMarker: '',
      errorMarkers: [],
      isBatch: false,
      meta: this.initializeProcMeta(null, false)
    });
  }

  showProcessOutput(process: Process): void {
    this._output.proc = process;
  }

  killProcesses(callback: () => void) {
    const kills = _flatten(_compact(this.projects.map(project => !this.projectHasItems(project) ? null : project.procs.map(proc => {
      if (!proc.meta.proc) { return Promise.resolve(); }
      return this.procStop(proc);
    }))));

    Promise.all(kills).then(callback).catch(e => console.log(e));
  }

  unfoldProject(proc: Process) {
    const project = _find(this.projects, (proj: Project) => _findIndex(proj.procs, p => p.id === proc.id) !== -1);
    project.meta.isCollapsed = false;
  }

  //#region project

  private projectStart(project: Project) { this.processBatchProject(project, 'Start'); }

  private projectReset(project: Project) { this.processBatchProject(project, 'Reset'); }

  private projectStop(project: Project) { this.processBatchProject(project, 'Stop'); }

  private processBatchProject(project: Project, action: string) {
    if (!this.projectHasItems(project)) { return; }

    for (let i = 0; i < project.procs.length; i++) {
      const proc = project.procs[i];
      if (proc.isBatch) { this['proc' + action](proc); }
    }
  }

  private projectHasItems(project: Project): boolean {
    if (project.procs && project.procs.length) {
      return true;
    }
    //todo show info - no proc to run
    return false;
  }

  private initializeMeta(project: Project) {
    const isCollapsed = true;
    this.initializeProjectMeta(project, isCollapsed);
    project.meta.isCollapsed = isCollapsed;

    if (!project.procs || !project.procs.length) { return project; }

    for (let i = 0; i < project.procs.length; i++) {
      this.initializeProcMeta(project.procs[i], isCollapsed);
      project.procs[i].meta.isCollapsed = isCollapsed;
    }
    return project;
  }

  private initializeProjectMeta(project: Project, isCollapsed: boolean): ProjectMeta {
    const m = { isCollapsed };

    if (project) { project.meta = m; }
    return m;
  }

  private initializeProcMeta(proc: Process, isCollapsed): ProcessMeta {
    const m = {
      state: ProcState.idle,
      buffer: [],
      isCollapsed
    };
    if (proc) { proc.meta = m; }
    return m;
  }

  private moveProject({ project, step }) {
    const pIdx = _findIndex(this.projects, (p: Project) => p.id === project.id);

    if (step === -1 && pIdx === 0) { return; }

    if (step === 1 && pIdx === this.projects.length - 1) { return; }

    moveInArray(this.projects, pIdx, pIdx + step);
  }
  private deleteProject(project) {
    const pIdx = _findIndex(this.projects, (p: Project) => p.id === project.id);

    this.projects.splice(pIdx, 1);
  }

  //#endregion

  //#region process

  private procStart(proc: Process) {
    if (proc.meta.proc) {
      this._output.appendProcBuffer(proc, MessageType.info, 'Process already running.');
      return;
    }
    this._output.proc = proc;
    proc.meta.state = ProcState.starting;
    // this._output.appendProcBuffer(item, MessageType.info, `Running ${item.command} ${item.args} @ ${item.path}`);

    const cmd = <ChildProcess>spawn(proc.command, proc.args ? proc.args.split(' ') : [], {
      cwd: proc.path,
      windowsHide: true,
      detached: false
    });
    proc.meta.proc = cmd;

    cmd.stdout.on('data', this.handleProcMessages(proc, MessageType.data).bind(this));
    cmd.stderr.on('data', this.handleProcMessages(proc, MessageType.error).bind(this));
  }

  private handleProcMessages(proc, messageType) {
    return (msg: Uint8Array) => this.handleMessages(proc, messageType, msg);
  }

  private handleMessages(proc: Process, messageType: MessageType, data: Uint8Array) {
    const msg = data.toString();
    this._output.appendProcBuffer(proc, messageType, msg);

    if (msg.indexOf(proc.startMarker) !== -1) {
      proc.meta.state = ProcState.running;
      this._output.appendProcBuffer(proc, MessageType.success, 'Process is running.');
      //todo show notification
      showNotification('info', proc.title, 'Process is running.');
    }

    else if (_findIndex(proc.errorMarkers, m => msg.indexOf(m) !== -1) !== -1) {
      this._output.appendProcBuffer(proc, MessageType.error, 'Process errored.');
      this.procStop(proc);
      showNotification('error', proc.title, 'Process errored.');
    }

    else if (_findIndex(proc.progressMarkers, m => msg.indexOf(m) !== -1) !== -1) {
      this._output.appendProcBuffer(proc, MessageType.info, 'Progress!!');
      showNotification('info', proc.title, 'Process is running.');
    }
  }

  private procReset(proc: Process) {
    //todo fix
    this.procStop(proc);
    this.procStart(proc);
  }

  private procStop(proc: Process): Promise<void> {
    if (!proc.meta.proc) { return Promise.resolve(); }

    return new Promise((resolve, reject) => {
      proc.meta.state = ProcState.stopping;
      this.killProc(proc.meta.proc.pid, () => {
        proc.meta.state = ProcState.idle;
        proc.meta.proc = null;
        this._output.appendProcBuffer(proc, MessageType.info, 'Process closed.');
        showNotification('info', proc.title, 'Process closed.');
        resolve();
      });
    });
  }

  private killProc(pid, callback = () => { }) {
    psTree(pid, (err, children) => {
      [pid]
        .concat(children.map((p) => p.PID))
        .forEach(tpid => {
          try { process.kill(tpid, 'SIGKILL'); }
          catch (ex) { }
        });
      callback();
    });
  }

  private moveProc({ proc, step }) {
    let pIdx = -1;
    const project = _find(this.projects, (proj: Project) => (pIdx = _findIndex(proj.procs, p => p.id === proc.id)) !== -1);

    if (step === -1 && pIdx === 0) { return; }

    if (step === 1 && pIdx === project.procs.length - 1) { return; }

    moveInArray(project.procs, pIdx, pIdx + step);
  }
  private deleteProc(proc: Process) {
    let pIdx = -1;
    const project = _find(this.projects, (proj: Project) => (pIdx = _findIndex(proj.procs, p => p.id === proc.id)) !== -1);
    console.log('delete proc', project, pIdx);

    project.procs.splice(pIdx, 1);
  }

  //#endregion
}
