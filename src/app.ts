import { APP_CLOSING, APP_FINISHED, PROJECTS_MODIFIED } from './events';
import './styles/index.sass';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';

const { remote } = (window as any).nodeRequire('electron');

@autoinject()
export class App {
  constructor(ea: EventAggregator) {
    document.addEventListener('keydown', function (e) {
      if (e.which === 123) {
        remote.getCurrentWindow().toggleDevTools();
      } else if (e.which === 116) {
        location.reload();
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
