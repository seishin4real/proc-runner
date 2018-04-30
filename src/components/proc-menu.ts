import { Process, Project } from './procs';
import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, containerless, customElement } from 'aurelia-framework';

@containerless()
@customElement('proc-menu')
export class ProcMenuComponent {
  constructor(private _ea: EventAggregator) {}

  @bindable() project: Project;
  @bindable() item: Process;

  isAll = false;
  state: 'idle' | 'starting' | 'running' | 'stopping' = 'idle';


  toggleAll() {
    this.isAll = !this.isAll;
  }
  start() {
    this._ea.publish('proc-start', this.project || this.item);
    this.state = 'starting'; setTimeout(() => this.state = 'running', 2000);
  }

  restart() {
    this._ea.publish('proc-reset', this.project || this.item);
    this.state = 'stopping'; setTimeout(() => this.state = 'starting', 2000); setTimeout(() => this.state = 'running', 4000);
  }

  stop() {
    this._ea.publish('proc-stop', this.project || this.item);   
    this.state = 'stopping'; setTimeout(() => this.state = 'idle', 2000);
  }
} 
