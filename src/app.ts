import { ConfigModalComponent } from './components/config/config.modal';
import { APP_CLOSING, APP_FINISHED, APP_OPEN_CONFIG } from './events';
import { StoreService } from './store.service';
import './styles/index.sass';
import { DialogSettings } from 'aurelia-dialog';
import { DialogService } from 'aurelia-dialog/dist/commonjs/dialog-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Process, Settings } from 'models';

const { remote } = (window as any).nodeRequire('electron');

@autoinject()
export class App {
  constructor(
    ea: EventAggregator,
    store: StoreService,
    private _dialogService: DialogService
  ) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        remote.getCurrentWindow().toggleDevTools();
      } else if (e.ctrlKey && e.key === 'r') {
        location.reload(); //doesn't work
      }
    });

    window.addEventListener('beforeunload', (e) => {
      ea.publish(APP_CLOSING);
      e.returnValue = true;
    });

    ea.subscribe(APP_FINISHED, () => {
      remote.getCurrentWindow().destroy();
    });

    ea.subscribe(APP_OPEN_CONFIG, this.appOpenConfig.bind(this));

    App.updateSettings(store.getSettings());
  }

  private static _settings: Settings;
  static get Settings(): Settings {
    return App._settings;
  }

  static updateSettings(settings: any) {
    App._settings = settings;
  }

  appOpenConfig(proc?: Process) {
    const dialogConfig = <DialogSettings>{
      viewModel: ConfigModalComponent,
      model: proc
    };
    this._dialogService.open(dialogConfig).whenClosed(result => {
      if (result.wasCancelled) { return; }
      //TODO: save config
      //todo: show notification
    });
  }

}
