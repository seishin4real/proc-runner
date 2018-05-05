import { CONFIG_SAVED, PROJECTS_MODIFIED } from '../../events';
import { autoinject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { customElement } from 'aurelia-framework';
import { ProcManager } from 'proc.manager';
import { Store } from 'store';

@customElement('config-modal')
@autoinject()
export class ConfigModalComponent {
  constructor(
    private _dialogController: DialogController,
    private _store: Store,
    private _ea: EventAggregator,
    private _procManager: ProcManager,
  ) {
    this.settings = this._store.get('settings');
    this.projects = _procManager.projects;
   }

  display = 'settings';
  settings: any;
  projects: any;

  close() {
    this._store.set('settings', this.settings);
    this._ea.publish(PROJECTS_MODIFIED);
    this._ea.publish(CONFIG_SAVED);
    this._dialogController.ok();
  }

  addProject() {
    this._procManager.addProject();
  }
}
