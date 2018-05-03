import * as events from './events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { ChildProcess } from 'child_process';
import { ProcOutputComponent } from 'components/proc-output';
import { Guid } from 'guid-typescript';
import { MessageType, Process, ProcState, ProcStateStrings, Project } from 'models';
import { Store } from 'store';

const anyWin = window as any;
const { spawn } = anyWin.nodeRequire('child_process');
const psTree = anyWin.nodeRequire('ps-tree');

@autoinject()
export class ProcManager {
  constructor(
    private _ea: EventAggregator,
    private _store: Store
  ) {
    _ea.subscribe(events.PROJECT_START, this.projectStart.bind(this));
    _ea.subscribe(events.PROJECT_RESET, this.projectReset.bind(this));
    _ea.subscribe(events.PROJECT_STOP, this.projectStop.bind(this));
    _ea.subscribe(events.PROC_START, this.procStart.bind(this));
    _ea.subscribe(events.PROC_RESET, this.procReset.bind(this));
    _ea.subscribe(events.PROC_STOP, this.procStop.bind(this));
    _ea.subscribe(events.PROJECTS_MODIFIED, this.projectsModified.bind(this));

    _ea.subscribeOnce(events.OUTPUT_INITIALIZED, output => this._output = output);
    _ea.subscribeOnce(events.APP_CLOSING, this.killProcesses.bind(this));
  }

  projects: Project[];
  private _output: ProcOutputComponent;

  getProjects(): Project[] {
    return this.projects = this._store.get('projects')
      .map(this.initializeMeta.bind(this));
  }

  showProcessOutput(process: Process): void {
    this._output.proc = process;
  }

  private projectsModified() {
    const copy = this.projects.slice();
    this.removeMeta(copy);
    this._store.set('projects', copy);
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
    if (!project.procs || !project.procs.length) { return project; }

    for (let i = 0; i < project.procs.length; i++) {
      project.procs[i].meta = {
        state: ProcState.idle,
        buffer: []
      };
    }
    // console.log('project', project);
    return project;
  }

  private removeMeta(projects: Project[]) {
    for (let p = 0; p < projects.length; p++) {
      const { procs } = projects[p];
      if (!procs || !procs.length) { continue; }

      for (let i = 0; i < procs.length; i++) {
        const proc = procs[i];
        delete proc.meta;
      }
    }
  }

  private killProcesses() {
    let hadChildren = false;
    for (let p = 0; p < this.projects.length; p++) {
      const project = this.projects[p];

      if (!this.projectHasItems(project)) { continue; }

      hadChildren = true;
      for (let i = 0; i < project.procs.length; i++) {
        this.procStop(project.procs[i]);//todo przerobić na promisy. Promise.all(this._ea.publish(events.APP_FINISHED))
      }

      // for (let i = 0; i < this.projects.length; i++) {
      //   const { procs } = this.projects[i];


      //   const { meta } = this.projects[i].procs;
      //   const { pid } = meta.proc;
      //   this.killProc(pid, () => this._ea.publish(events.APP_FINISHED));
      // }
    }
    if (!hadChildren) {
      this._ea.publish(events.APP_FINISHED);
    }
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

    cmd.stdout.on('data', (data: Uint8Array) => {
      const str = data.toString();
      this._output.appendProcBuffer(proc, MessageType.data, str);

      if (str.indexOf('Running at http://localhost') != -1) {
        proc.meta.state = ProcState.running;
      }//todo move & change (idea: proc started string from config)
    });

    cmd.stderr.on('data', (data: Uint8Array) => {
      const str = data.toString();
      this._output.appendProcBuffer(proc, MessageType.data_error, data);
    });
  }

  private procReset(proc: Process) {
    this.procStop(proc);
    this.procStart(proc);
  }

  private procStop(proc: Process) {
    if (!proc.meta.proc) { return; }
    
    proc.meta.state = ProcState.stopping;
    this.killProc(proc.meta.proc.pid);
    this._output.appendProcBuffer(proc, MessageType.info, 'Process closed.');
    proc.meta.state = ProcState.idle;
    proc.meta.proc = null;
  }

  private killProc(pid, callback = () => { }) {
    psTree(pid, (err, children) => {
      [pid]
        .concat(children.map((p) => p.PID))
        .forEach(tpid => {
          try { process.kill(tpid, 'SIGKILL') }
          catch (ex) { }
        });
      callback();
    });
  };

  //#endregion
}
