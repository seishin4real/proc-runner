import { DialogController } from 'aurelia-dialog';
import { customElement } from 'aurelia-framework';

@customElement('config-modal')
export class ConfigModalComponent {
  constructor(private _dialogController: DialogController) { }

  display = 'settings';

  async save() {
    this._dialogController.ok();
  }

  cancel() {
    this._dialogController.cancel();
  }
}
