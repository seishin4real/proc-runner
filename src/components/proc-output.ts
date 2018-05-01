import { OUTPUT_INITIALIZED } from '../events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { customElement } from 'aurelia-framework';
import { Process } from 'models';

@customElement('proc-output')
export class ProcOutputComponent {
  constructor(ea: EventAggregator) {
    ea.publish(OUTPUT_INITIALIZED, this);
  }

  current: Process = null;
  procs: { [key: string]: Process } = {};

  focus(process: Process): void {
    let po = this.procs[process.id];
    if (!po) { this.procs[process.id] = po = process; }

    this.current = po;
  }
}
