import { autoinject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { customElement } from 'aurelia-framework';
import { Store } from 'store';

@customElement('config-modal')
@autoinject()  
export class ConfigModalComponent {
  constructor(
    private _dialogController: DialogController,
    private _store: Store
  ) {
    this.settings = this._store.get('settings');
    this.projects = this._store.get('projects');
   }

  display = 'settings';
  settings: any;
  projects: any;

  async save() {
    this._dialogController.ok();
  }

  cancel() {
    this._dialogController.cancel();
  }
}
