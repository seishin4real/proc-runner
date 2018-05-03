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

  procChanged(v: Process) {
    console.log('v', v);
    
  }
  
  public appendProcBuffer(proc: Process, type: MessageType, message: any) {
    console.log('message', message);

    if (type === MessageType.info) {
      proc.meta.buffer.push(`<h4 class="title is-4">${message}</h4>`);
    } else if (type === MessageType.data) {
      proc.meta.buffer.push('<div class="notification is-primary">' + message.replace(/\r\n/ig, '<br>') + '</div>');
    } else if (type === MessageType.data_error) {
      proc.meta.buffer.push('<div class="notification is-danger">' + message.replace(/\r\n/ig, '<br>') + '</div>');
    }
  }

}
