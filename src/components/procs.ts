import { APP_OPEN_CONFIG, CONFIG_SAVED } from '../events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, customElement } from 'aurelia-framework';
import { Project } from 'models';
import { ProcManager } from 'proc.manager';

@customElement('procs')
@autoinject()
export class ProcsComponent {
  constructor(
    private _procManager: ProcManager,
    private _ea: EventAggregator,
  ) {
    this.loadProjects();
    _ea.subscribe(CONFIG_SAVED, this.reloadProjects.bind(this));
  }

  projects: Project[];

  showOutput(p) {
    this._procManager.showProcessOutput(p);
  }

  openConfig() {
    this._ea.publish(APP_OPEN_CONFIG);
  }

  private loadProjects() {
    this.projects = this._procManager.getProjects();
  }

  private reloadProjects() {
    this._procManager.killProcesses(this.loadProjects.bind(this));
  }
}
