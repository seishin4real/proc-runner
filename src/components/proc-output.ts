import { OUTPUT_INITIALIZED } from '../events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { customElement } from 'aurelia-framework';
import { debounce as _debounce } from 'lodash';
import { MessageType, Process } from 'models';

@customElement('proc-output')
export class ProcOutputComponent {
  constructor(ea: EventAggregator) {
    ea.publish(OUTPUT_INITIALIZED, this);
    this.updateScrollPos = _debounce(this.debouncedUpdateScrollPos.bind(this), this.scrollUpdateDebounce);
  }

  private readonly scrollUpdateDebounce = 250;
  private updateScrollPos: any;

  proc: Process = null;
  list: Element;

  appendProcBuffer(proc: Process, type: MessageType, message: any) {
    let css = '';
    if (type === MessageType.info) { css = 'is-info'; }
    else if (type === MessageType.success) { css = 'is-success'; }
    else if (type === MessageType.data) { message = this.processMessage(message); }
    else if (type === MessageType.error) { message = this.processMessage(message); css = 'is-danger'; }

    proc.meta.buffer.push(`<div class="notification ${css}">${message}</div>`);
    this.updateScrollPos();
  }

  attached() {
    this.updateScrollPos();
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

  private debouncedUpdateScrollPos() {
    if (!this.list) { return; }

    const bs = this.list.querySelectorAll('div.b');
    const last = bs[bs.length - 1];
    if (!last) { return; }

    last.scrollIntoView();
  }
}
