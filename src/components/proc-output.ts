import { OUTPUT_INITIALIZED } from '../events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { customElement } from 'aurelia-framework';
import { MessageType, Process } from 'models';

@customElement('proc-output')
export class ProcOutputComponent {
  constructor(ea: EventAggregator) {
    ea.publish(OUTPUT_INITIALIZED, this);
  }

  proc: Process = null;

  public appendProcBuffer(proc: Process, type: MessageType, message: any) {
    let css = '';
    if (type === MessageType.info) { css = 'is-info'; }
    else if (type === MessageType.success) { css = 'is-success'; }
    else if (type === MessageType.data) { message = this.processMessage(message); }
    else if (type === MessageType.error) { message = this.processMessage(message); css = 'is-danger'; }

    proc.meta.buffer.push(`<div class="notification ${css}">${message}</div>`);
  }

  private processMessage(input: string) {
    return '<span>' + input
      .replace(/\t/ig, '&nbsp;&nbsp;')
      .replace(/\r/ig, '')
      .replace(/\n/ig, '<br>')
      .replace(/\u001B\[0\m/g, '</span><span class="c-white">')
      .replace(/\u001B\[3[7|9]m/g, '</span><span class="c-white">')
      .replace(/\u001B\[30m/g, '</span><span class="c-black">')
      .replace(/\u001B\[31m/g, '</span><span class="c-red">')
      .replace(/\u001B\[32m/g, '</span><span class="c-green">')
      .replace(/\u001B\[33m/g, '</span><span class="c-yellow">')
      .replace(/\u001B\[34m/g, '</span><span class="c-blue">')
      .replace(/\u001B\[35m/g, '</span><span class="c-purple">')
      .replace(/\u001B\[36m/g, '</span><span class="c-cyan">')
      .replace(/\u001B\[[0-9]+m/g, '')
      + '</span>';
  }
}
