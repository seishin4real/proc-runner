import { autoinject, customElement } from 'aurelia-framework';
import { Project } from 'models';
import { ProcManager } from 'proc.manager';

@customElement('procs')
@autoinject()  
export class ProcsComponent {
  constructor(private _procManager: ProcManager) {
    this.projects = this._procManager.getProjects();
  }

  projects: Project[];

  showOutput(p) {
    this._procManager.showProcessOutput(p);
  }
}
