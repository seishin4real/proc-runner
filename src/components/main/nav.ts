import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, customElement } from 'aurelia-framework';
import { ProcessService } from 'services/process.service';
import { StoreService } from 'services/store.service';
import { APP_OPEN_CONFIG, PROJECTS_MODIFIED } from 'shared/events';
import { Project } from 'shared/models';

@customElement('nav')
@autoinject()
export class NavComponent {
  constructor(
    private _procManager: ProcessService,
    private _ea: EventAggregator,
    private _store: StoreService,
  ) {
    this.projects = this._procManager.getProjects();

    _ea.subscribe(PROJECTS_MODIFIED, this.refreshProjects.bind(this));
  }

  projects: Project[];

  refreshProjects() {
    this.projects = null;
    setTimeout(() => this.projects = this._store.getProjects(), 0);
  }
  showOutput(p) {
    this._procManager.showProcessOutput(p);
  }

  openConfig() {
    this._ea.publish(APP_OPEN_CONFIG);
  }
}
