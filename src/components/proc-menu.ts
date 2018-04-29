import { Process, Project } from './procs';
import { bindable, containerless, customElement } from 'aurelia-framework';

@containerless()
@customElement('proc-menu')
export class ProcMenuComponent {
  @bindable() project: Project;
  @bindable() item: Process;

  start() {
    console.log('start', this.project ? 'project' : 'process');    
  }

  restart() {
    console.log('restart', this.project ? 'project' : 'process');    
  }

  stop() {
    console.log('stop', this.project ? 'project' : 'process');    
  }
} 
