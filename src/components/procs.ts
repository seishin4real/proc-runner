import { ConfigModalComponent } from './config/config.modal';
import { DialogService, DialogSettings } from 'aurelia-dialog';
import { autoinject, customElement } from 'aurelia-framework';
import { Project } from 'models';
import { ProcManager } from 'proc.manager';

@customElement('procs')
@autoinject()  
export class ProcsComponent {
  constructor(
    private _procManager: ProcManager,
    private _dialogService: DialogService
  ) {
    this.projects = this._procManager.getProjects();
  }

  projects: Project[];

  showOutput(p) {
    this._procManager.showProcessOutput(p);
  }

  openConfig() {
    this._dialogService.open(<DialogSettings>{
      viewModel: ConfigModalComponent,
      model: { projects: this.projects }
    }).whenClosed(result => {
      if (result.wasCancelled) { return; }
      //TODO: save config
      //todo: show notification
    });
  }
}
