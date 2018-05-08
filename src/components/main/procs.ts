import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, customElement } from 'aurelia-framework';
import { ProcessService } from 'services/process.service';
import { APP_OPEN_CONFIG } from 'shared/events';
import { Project } from 'shared/models';

@customElement('procs')
@autoinject()
export class ProcsComponent {
  constructor(
    private _procManager: ProcessService,
    private _ea: EventAggregator,
  ) {
    this.loadProjects();
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

}
