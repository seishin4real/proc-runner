import { CONFIG_SAVED } from '../../events';
import { autoinject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { customElement } from 'aurelia-framework';
import { Store } from 'store';

@customElement('config-modal')
@autoinject()  
export class ConfigModalComponent {
  constructor(
    private _dialogController: DialogController,
    private _store: Store,
    private _ea: EventAggregator,
  ) {
    this.settings = this._store.get('settings');
    this.projects = this._store.get('projects');
   }

  display = 'settings';
  settings: any;
  projects: any;

  async save() {
    this._store.set('settings', this.settings);
    this._store.set('projects', this.projects);
    this._ea.publish(CONFIG_SAVED);
    this._dialogController.ok();
  }

  cancel() {
    this._dialogController.cancel();
  }
}
