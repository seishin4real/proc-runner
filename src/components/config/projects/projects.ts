import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, customElement } from 'aurelia-framework';
import { find as _find, findIndex as _findIndex, sortBy as _sortBy } from 'lodash';
import { PROJECT_DELETED, PROJECT_MOVED } from 'shared/events';
import { moveInArray } from 'shared/func.move-in-array';
import { Process, Project } from 'shared/models';

@customElement('projects')
export class ProjectsComponent {
  constructor(ea: EventAggregator) {
    ea.subscribe(PROJECT_MOVED, this.moveProject.bind(this));
    ea.subscribe(PROJECT_DELETED, this.deleteProject.bind(this));
  }
  @bindable() model: Project[];

  merge(sProjects: Project[]) {
    for (let i = sProjects.length - 1; i >= 0; i--) {
      this.deleteOrModifyProject(sProjects, sProjects[i]);
    }
    this.addNewProjects(sProjects);
    console.log('this.model', this.model);
    console.log('before', sProjects);

    _sortBy(sProjects, sProject => _findIndex(this.model, { id: sProject.id })).forEach((project, idx) => {
      sProjects[idx] = project;
    });
    console.log('after', sProjects);
  }

  private deleteOrModifyProject(sProjects: Project[], sProject: Project) {
    const project = _find(this.model, { id: sProject.id });

    if (!project) {
      sProjects.splice(_findIndex(sProjects, { id: sProject.id }));
      return;
    }

    sProject.title = project.title;

    const sProcs = sProject.procs;
    if (!sProcs || !sProcs.length) { return; }

    const procs = project.procs;

    for (let j = sProcs.length - 1; j >= 0; j--) {
      this.deleteOrModifyProc(sProcs, sProcs[j], procs);
    }
    this.addNewProcs(sProcs, procs);
    sProject.procs = _sortBy(sProcs, sProc => _findIndex(procs, { id: sProc.id }));
  }
  private addNewProjects(sProjects: Project[]) {
    this.model.forEach(project => {
      if (_findIndex(sProjects, { id: project.id }) !== -1) { return; }
      sProjects.push(project);
    });
  }

  private deleteOrModifyProc(sProcs: Process[], sProc: Process, procs: Process[]) {
    const proc = _find(procs || [], { id: sProc.id });

    if (!proc) {
      sProcs.splice(_findIndex(sProcs, { id: sProc.id }));
      return;
    }

    sProc.title = proc.title;
    sProc.command = proc.command;
    sProc.args = proc.args;
    sProc.path = proc.path;
    sProc.startMarker = proc.startMarker;
    sProc.errorMarkers = proc.errorMarkers;
    sProc.progressMarkers = proc.progressMarkers;
    sProc.isBatch = proc.isBatch;
    sProc.isMute = proc.isMute;
  }
  private addNewProcs(sProcs: Process[], procs: Process[]) {
    procs.forEach(proc => {
      if (_findIndex(sProcs, { id: proc.id }) !== -1) { return; }
      sProcs.push(proc);
    });
  }

  private moveProject({ project, step }) {
    const pIdx = _findIndex(this.model, { id: project.id });

    if (step === -1 && pIdx === 0) { return; }

    if (step === 1 && pIdx === this.model.length - 1) { return; }

    moveInArray(this.model, pIdx, pIdx + step);
  }

  private deleteProject(project) {
    const pIdx = _findIndex(this.model, { id: project.id });

    this.model.splice(pIdx, 1);
  }
}
