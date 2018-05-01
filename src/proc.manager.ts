import * as events from './events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { ProcOutputComponent } from 'components/proc-output';
import { Guid } from 'guid-typescript';
import { Process, Project } from 'models';
import { Store } from 'store';

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
  }

  projects: Project[];
  private _output: ProcOutputComponent;

  getProjects(): Project[] {
    // this.projects = this._store.get('projects');

    // const projects = this.projects;
    // for (let p = 0; p < projects.length; p++) {
    //   const project = projects[p];
    //   const { items } = project;

    //   if (!project.id) { project.id = Guid.raw(); }

    //   if (!items || !items.length) { continue; }

    //   for (let i = 0; i < items.length; i++) {
    //     const item = items[i];
    //     if (!item.id) { item.id = Guid.raw(); }
    //   }
    // }
    // this._ea.publish(events.PROJECTS_MODIFIED);
    // return this.projects;
    return this.projects = this._store.get('projects');
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

  private projectStart(item: Project) {
    if (!item.items || !item.items.length) {
      //todo show info - no proc to run
      return;
    }
    for (let i = 0; i < item.items.length; i++) {
      const proc = item.items[i];

    }

  }

  private projectReset(item: Project) {
    console.log('reset', item);

  }

  private projectStop(item: Project) {
    console.log('stop', item);

  }

  private removeMeta(projects) {
    for (let p = 0; p < projects.length; p++) {
      const { items } = projects[p];
      if (!items || !items.length) { continue; }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        delete item.meta;
      }
    }
  }

  //#endregion

  //#region process
  private procStart(item: Process) {
    console.log('start', item);

  }

  private procReset(item: Process) {
    console.log('reset', item);

  }

  private procStop(item: Process) {
    console.log('stop', item);

  }

  //#endregion

}
