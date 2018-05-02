import * as events from './events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { ChildProcess } from 'child_process';
import { ProcOutputComponent } from 'components/proc-output';
import { Guid } from 'guid-typescript';
import { Process, ProcState, ProcStateStrings, Project } from 'models';
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
    this._output.focus(process);
  }

  private projectsModified() {
    const copy = this.projects.slice();
    this.removeMeta(copy);
    this._store.set('projects', copy);
  }

  //#region project 

  private projectStart(item: Project) { this.processBatchProject(item, 'Start'); }

  private projectReset(item: Project) { this.processBatchProject(item, 'Reset'); }

  private projectStop(item: Project) { this.processBatchProject(item, 'Stop'); }

  private processBatchProject(item: Project, action: string) {
    if (!this.projectHasItems(item)) { return; }

    for (let i = 0; i < item.items.length; i++) {
      const proc = item.items[i];
      if (proc.isBatch) { this['proc' + action](proc); }
    }
  }

  private projectHasItems(item: Project): boolean {
    if (item.items && item.items.length) {
      return true;
    }
    //todo show info - no proc to run
    return false;
  }

  private initializeMeta(project: Project) {
    if (project.items && project.items.length) {
      for (let i = 0; i < project.items.length; i++) {
        project.items[i].meta = {
          state: ProcState.idle,
          buffer: []
        };
      }
    }

    return project;
  }

  private removeMeta(projects: Project[]) {
    for (let p = 0; p < projects.length; p++) {
      const { items } = projects[p];
      if (!items || !items.length) { continue; }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        delete item.meta;
      }
    }
  }

  private killProcesses() {
    const procs = this._output.procs;
    const keys = Object.keys(procs);

    for (let i = 0; i < keys.length; i++) {
      const { meta } = procs[keys[i]];
      const { pid } = meta.proc;
      this.killProc(pid, () => this._ea.publish(events.APP_FINISHED));
    }
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

  //#region process

  private procStart(item: Process) {
    this._output.focus(item);
    item.meta.state = ProcState.starting;
    this.appendProcBuffer(item, MessageType.info, `Starting ${item.command} ${item.args} @ ${item.path}`);
    // setTimeout(() => this.spawnProcess(item), 0);
    const cmd = <ChildProcess>spawn(item.command, item.args ? item.args.split(' ') : [], {
      cwd: item.path,
      windowsHide: true,
      detached: false
    });
    item.meta.proc = cmd;

    cmd.stdout.on('data', (data: Uint8Array) => {
      const str = data.toString();
      this.appendProcBuffer(item, MessageType.data, str);

      if (str.indexOf('Running at http://localhost') != -1) {
        item.meta.state = ProcState.running;
      }
    });

    cmd.stderr.on('data', (data) => {
      this.appendProcBuffer(item, MessageType.data_error, data);
    });
  }

  private procReset(item: Process) {
    this.procStop(item);
    this.procStart(item);
  }

  private procStop(item: Process) {
    item.meta.state = ProcState.stopping;
    this.killProc(item.meta.proc.pid);
    this.appendProcBuffer(item, MessageType.info, 'Process closed.');
    item.meta.state = ProcState.idle;
  }

  private appendProcBuffer(proc: Process, type: MessageType, message: any) {
    console.log('message', message);
    if (type === MessageType.info) {
      proc.meta.buffer.push(`<h3>${message}</h3>`);
    } else if (type === MessageType.data) {
      proc.meta.buffer.push('<div class="notification is-primary">' + message.replace(/\r\n/ig, '<br>') + '</div>');
    } else if (type === MessageType.data_error) {
      proc.meta.buffer.push('<div class="notification is-danger">' + message.replace(/\r\n/ig, '<br>') + '</div>');
    }
  }

  //#endregion

}

enum MessageType {
  info,
  data, data_error
}
