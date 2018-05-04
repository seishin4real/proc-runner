import { ConfigModalComponent } from './config/config.modal';
import { CONFIG_SAVED } from '../events';
import { DialogService, DialogSettings } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, customElement } from 'aurelia-framework';
import { Project } from 'models';
import { ProcManager } from 'proc.manager';

@customElement('procs')
@autoinject()
export class ProcsComponent {
  constructor(
    private _procManager: ProcManager,
    private _dialogService: DialogService,
    ea: EventAggregator,
  ) {
    this.loadProjects();
    ea.subscribe(CONFIG_SAVED, this.reloadProjects.bind(this));
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

  private loadProjects() {
    this.projects = this._procManager.getProjects();
  }

  private reloadProjects() {
    this._procManager.killProcesses(this.loadProjects.bind(this));
  }
}
