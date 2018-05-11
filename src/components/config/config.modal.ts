import { autoinject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { computedFrom, customElement } from 'aurelia-framework';
import { ProjectsComponent } from 'components/config/projects/projects';
import { SettingsComponent } from 'components/config/settings/settings';
import { find as _find } from 'lodash';
import { ProcessService } from 'services/process.service';
import { StoreService } from 'services/store.service';
import { PROJECTS_MODIFIED, SETTINGS_MODIFIED } from 'shared/events';
import { Process, Project, Settings } from 'shared/models';

@customElement('config-modal')
@autoinject()
export class ConfigModalComponent {
  constructor(
    private _dialogController: DialogController,
    private _ea: EventAggregator,
    private _procManager: ProcessService,
    private _store: StoreService
  ) {
    this.settings = this.copy(_store.getSettings());
    this.projects = this.copy(_store.getProjects());
  }

  display = 'projects';
  settings: Settings;
  projects: Project[];
  projectsComponent: ProjectsComponent;
  settingsComponent: SettingsComponent;

  @computedFrom('display') get projectsStyle() { return { display: this.display === 'projects' ? 'flex' : 'none' }; }
  @computedFrom('display') get settingsStyle() { return { display: this.display === 'settings' ? 'flex' : 'none' }; }

  activate(proc?: Process) {
    if (proc) { this.procFocus(proc); }
  }

  save() {
    this.projectsComponent.merge(this._store.getProjects());
    this.settingsComponent.merge(this._store.getSettings());

    this._ea.publish(PROJECTS_MODIFIED);
    this._ea.publish(SETTINGS_MODIFIED);

    this.foldProjects();

    this._dialogController.ok();
  }

  cancel() {
    this._dialogController.cancel();
  }

  addProject() {
    this.projects.push(this._procManager.newProject());
  }

  private foldProjects() {
    this.projects.forEach(p => {
      p.meta.isCollapsed = true;
      p.procs.forEach(proc => proc.meta.isCollapsed = true);
    });
  }

  private procFocus(proc) {
    this.display = 'projects';

    let cProc = <Process>null;
    const cProject = _find(this.projects, (project: Project) =>
      project.procs &&
      project.procs.length &&
      (cProc = _find(project.procs, p => p.id === proc.id)) !== undefined);

    if (cProject) { cProject.meta.isCollapsed = false; }
    if (cProc) { cProc.meta.isCollapsed = false; }
  }

  private copy(obj) {
    const replacer = (key, value) => key !== 'meta' ? value : { isCollapsed: true };
    return JSON.parse(JSON.stringify(obj, replacer));
  }

}
