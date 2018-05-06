import { defaultSettings, Process, Project, Settings } from './models';
import { Store } from './store';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class StoreService {
  constructor(private _store: Store) {
    _store.preWriteFn = this.cleanup;
  }

  getSettings() {
    return this._store.get('settings') || defaultSettings;
  }

  saveSettings(settings: Settings) {
    this._store.set('settings', settings);
  }

  getProjects() {
    return this._store.get('projects') || [];
  }

  saveProjects(projects: Project[]) {
    this._store.set('projects', projects);
  }

  private cleanup(model: any) {
    const result = Object.assign({}, model);

    result.projects = <Project[]>model.projects.map(project => ({
      title: project.title,
      id: project.id,
      procs: !project.procs || !project.procs.length ? [] : <Process[]>project.procs.map(proc => ({
        id: proc.id,
        title: proc.title,
        command: proc.command,
        args: proc.args,
        path: proc.path,
        startMarker: proc.startMarker,
        errorMarkers: proc.errorMarkers,
        progressMarkers: proc.progressMarkers,
        isBatch: proc.isBatch
      }))
    }));

    return result;
  }

}
