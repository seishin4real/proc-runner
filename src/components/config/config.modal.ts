import { autoinject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { customElement } from 'aurelia-framework';
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
    store: StoreService
  ) {
    this.settings = store.getSettings();
    this.projects = store.getProjects();
   }

  display = 'settings';
  settings: Settings;
  projects: Project[];

  activate(proc?: Process) {
    if (proc) {
      this.display = 'projects';
      proc.meta.isCollapsed = false;
      this._procManager.unfoldProject(proc);
    }
  }

  save() {
    this._ea.publish(PROJECTS_MODIFIED);
    this._ea.publish(SETTINGS_MODIFIED);

    this.foldProjects();

    this._dialogController.ok();
  }

  addProject() {
    this._procManager.addProject();
  }

  private foldProjects() {
    this.projects.forEach(p => {
      p.meta.isCollapsed = true;
      p.procs.forEach(proc => proc.meta.isCollapsed = true);
    });
  }
}
