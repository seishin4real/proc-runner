import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { PROJECTS_MODIFIED, SETTINGS_MODIFIED } from 'shared/events';
import { defaultSettings, Process, Project, Settings } from 'shared/models';
import { Store } from 'shared/store';

export const CurrentSettings = <Settings>{};

@autoinject()
export class StoreService {
  constructor(
    private _store: Store,
    ea: EventAggregator
  ) {
    _store.preWriteFn = this.cleanup;
    ea.subscribe(SETTINGS_MODIFIED, this.saveSettings.bind(this));
    ea.subscribe(PROJECTS_MODIFIED, this.saveProjects.bind(this));

    CurrentSettings.notifications = this.getSettings();
  }

  // private static _settings: Settings;

  private _settings: Settings;
  private _projects: Project[];

  // static get Settings(): Settings { return StoreService._settings; }
  // static updateSettings(settings: any) { StoreService._settings = settings; }

  getSettings() {
    return this._settings || (this._settings = this._store.get('settings') || defaultSettings);
  }

  saveSettings(settings: Settings) {
    this._store.set('settings', settings);
  }

  getProjects() {
    return this._projects || (this._projects = this._store.get('projects') || []);
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
