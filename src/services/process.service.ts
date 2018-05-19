import { StoreService } from './store.service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { ChildProcess } from 'child_process';
import { ProcOutputComponent } from 'components/main/proc-output';
import { showNotification, showNotificationIf } from 'electron/utils.electron';
import { Guid } from 'guid-typescript';
import { compact as _compact, find as _find, findIndex as _findIndex, flatten as _flatten } from 'lodash';
import * as events from 'shared/events';
import {
  MessageType,
  Process,
  ProcessMeta,
  ProcState,
  Project,
  ProjectMeta
  } from 'shared/models';

const anyWin = window as any;
const { spawn } = anyWin.nodeRequire('child_process');
const psTree = anyWin.nodeRequire('ps-tree');

@autoinject()
export class ProcessService {
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

    _ea.subscribe(events.APP_CLOSING, () => this.processesKill(() => this._ea.publish(events.APP_FINISHED)));

    _ea.subscribeOnce(events.OUTPUT_INITIALIZED, output => this._output = output);
  }

  private _output: ProcOutputComponent;

  projects: Project[];

  getProjects(): Project[] {
    this.projects = this._store.getProjects();
    this.projects.forEach(project => this.initializeMeta(project));
    return this.projects;
  }

  newProject() {
    return <Project>{
      id: Guid.raw(),
      title: 'new project',
      procs: [],
      meta: this.initializeProjectMeta(null, false)
    };
  }

  newProcess() {
    return <Process>{
      id: Guid.raw(),
      title: 'new process',
      command: '',
      args: '',
      path: '',
      startMarker: '',
      errorMarkers: [],
      progressMarkers: [],
      isBatch: false,
      isMute: false,
      meta: this.initializeProcMeta(null, false)
    };
  }

  showProcessOutput(process: Process): void {
    this._output.proc = process;
  }

  //#region project

  private initializeMeta(project: Project) {
    const isCollapsed = true;
    this.initializeProjectMeta(project, isCollapsed);
    project.meta.isCollapsed = isCollapsed;

    if (!project.procs || !project.procs.length) { return project; }

    for (let i = 0; i < project.procs.length; i++) {
      this.initializeProcMeta(project.procs[i], isCollapsed);
      project.procs[i].meta.isCollapsed = isCollapsed;
    }
  }

  private initializeProjectMeta(project: Project, isCollapsed: boolean): ProjectMeta {
    const m = { isCollapsed };

    if (project) { project.meta = m; }
    return m;
  }

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
    showNotification('warning', 'Ooops!', 'No procs to run in batch');
    return false;
  }

  //#endregion

  //#region process

  private initializeProcMeta(proc: Process, isCollapsed): ProcessMeta {
    const m = {
      state: ProcState.idle,
      buffer: [],
      isCollapsed
    };
    if (proc) { proc.meta = m; }
    return m;
  }

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
    cmd.on('exit', () => {
      proc.meta.state = ProcState.idle;
      proc.meta.proc = null;
      this._output.appendProcBuffer(proc, MessageType.info, 'Process finished.');
      showNotificationIf(!proc.isMute, 'success', this.getNotificationTitle(proc), 'Process finished.');
    });
  }

  private handleProcMessages(proc, messageType) {
    return (msg: Uint8Array) => this.handleMessages(proc, messageType, msg);
  }

  private handleMessages(proc: Process, messageType: MessageType, data: Uint8Array) {
    const msg = data.toString();
    this._output.appendProcBuffer(proc, messageType, msg);
    let markerId = -1;
    if (proc.meta.state !== ProcState.running && msg.indexOf(proc.startMarker) !== -1) {
      proc.meta.state = ProcState.running;
      const message = 'Process started successfully.';

      this._output.appendProcBuffer(proc, MessageType.success, message);
      showNotificationIf(!proc.isMute, 'success', this.getNotificationTitle(proc), message);
    }

    else if ((markerId = _findIndex(proc.errorMarkers, m => msg.indexOf(m) !== -1)) !== -1) {
      let message = proc.errorMarkers[markerId];
      if (proc.meta.state !== ProcState.running) {
        this.procStop(proc);
        message += ' Process killed.';
      }

      this._output.appendProcBuffer(proc, MessageType.error, message);
      showNotificationIf(!proc.isMute, 'error', this.getNotificationTitle(proc), message);
    }

    else if ((markerId = _findIndex(proc.progressMarkers, m => msg.indexOf(m) !== -1)) !== -1) {
      const message = proc.progressMarkers[markerId];
      this._output.appendProcBuffer(proc, MessageType.info, 'Process reported progress: ' + message);
      showNotificationIf(!proc.isMute, 'success', this.getNotificationTitle(proc), message);
    }
  }

  private getNotificationTitle(proc: Process) {
    const { project } = this.findProjectByProc(proc);
    return `${project.title}: ${proc.title}`;
  }

  private procReset(proc: Process) {
    this.procStop(proc)
      .then(_ => this.procStart(proc));
  }

  private procStop(proc: Process): Promise<void> {
    if (!proc.meta.proc) { return Promise.resolve(); }

    return new Promise((resolve, reject) => {
      proc.meta.state = ProcState.stopping;
      this.procKill(proc.meta.proc.pid, () => {
        proc.meta.state = ProcState.idle;
        proc.meta.proc = null;
        this._output.appendProcBuffer(proc, MessageType.info, 'Process stopped.');
        showNotificationIf(!proc.isMute, 'info', this.getNotificationTitle(proc), 'Process stopped.');
        resolve();
      });
    });
  }

  private procKill(pid, callback = () => { }) {
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

  private processesKill(callback: () => void) {
    const kills = _flatten(_compact(this.projects.map(project => !this.projectHasItems(project) ? null : project.procs.map(proc => {
      if (!proc.meta.proc) { return Promise.resolve(); }
      return this.procStop(proc);
    }))));

    Promise.all(kills).then(callback).catch(e => console.log(e));
  }

  private findProjectByProc(proc: Process) {
    let procIdx = -1;
    const project = _find(this.projects, (proj: Project) => (procIdx = _findIndex(proj.procs, p => p.id === proc.id)) !== -1);
    return { project, procIdx };
  }

  //#endregion
}
