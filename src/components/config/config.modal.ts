import { App } from '../../app';
import { CONFIG_SAVED, PROJECTS_MODIFIED } from '../../events';
import { autoinject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { customElement } from 'aurelia-framework';
import { Process, Project, Settings } from 'models';
import { ProcManager } from 'proc.manager';
import { StoreService } from 'store.service';

@customElement('config-modal')
@autoinject()
export class ConfigModalComponent {
  constructor(
    private _dialogController: DialogController,
    private _store: StoreService,
    private _ea: EventAggregator,
    private _procManager: ProcManager,
  ) {
    this.settings = this._store.getSettings();
    this.projects = _procManager.projects;
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

  close() {
    App.updateSettings(this.settings);
    this._store.saveSettings(this.settings);
    this._ea.publish(PROJECTS_MODIFIED);
    this._ea.publish(CONFIG_SAVED);
    this._dialogController.ok();
  }

  addProject() {
    this._procManager.addProject();
  }
}
