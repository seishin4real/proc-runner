import { APP_CLOSING, APP_FINISHED } from './events';
import './styles/index.sass';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';

const { remote } = (window as any).nodeRequire('electron');

@autoinject()
export class App {
  constructor(ea: EventAggregator) {
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
