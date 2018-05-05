import { ConfigModalComponent } from './components/config/config.modal';
import { APP_CLOSING, APP_FINISHED, APP_OPEN_CONFIG } from './events';
import './styles/index.sass';
import { DialogSettings } from 'aurelia-dialog';
import { DialogService } from 'aurelia-dialog/dist/commonjs/dialog-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Process } from 'models';
import { ProcManager } from 'proc.manager';

const { remote } = (window as any).nodeRequire('electron');

@autoinject()
export class App {
  constructor(
    ea: EventAggregator,
    private _dialogService: DialogService,
    private _procManager: ProcManager,
  ) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        remote.getCurrentWindow().toggleDevTools();
      } else if (e.ctrlKey && e.key === 'r') {
        location.reload(); //doesn't work
      }
    });


    // remote.getCurrentWindow().on('close', () => {
    //   console.log('close');

    // });

    window.addEventListener('beforeunload', (e) => {
      ea.publish(APP_CLOSING);
      e.returnValue = true;
    });

    ea.subscribe(APP_FINISHED, () => {
      remote.getCurrentWindow().destroy();
    });

    ea.subscribe(APP_OPEN_CONFIG, this.appOpenConfig.bind(this));
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
  // tryCloseWindow() {
  //   this.closeWindow();
  // }

  // minimizeWindow() {
  //   var window: Electron.BrowserWindow = remote.getCurrentWindow();
  //   window.minimize();
  // }

  // maximizeWindow() {
  //   var window: Electron.BrowserWindow = remote.getCurrentWindow();
  //   if (window.isMaximized()) { window.unmaximize(); }
  //   else { window.maximize(); }
  // }

  // closeWindow() {
  //   var window: Electron.BrowserWindow = remote.getCurrentWindow();
  //   window.close();
  // }

  // showHelp() {
  //   remote.getCurrentWindow().webContents.openDevTools();
  // }
}
