import environment from './environment';
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import * as Bluebird from 'bluebird';
const anyWin = window as any;

const { remote, ipcRenderer } = anyWin.nodeRequire('electron');

Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    .feature(PLATFORM.moduleName('resources/index'))
    .feature(PLATFORM.moduleName('aurelia-bulma-bridge/index'))
    ;

  const mainWindow = remote.getCurrentWindow();

  ipcRenderer.on('notification-shim', (e, msg) => {
    mainWindow.webContents.executeJavaScript(`
      ipcRenderer.send('electron-toaster-message', {
          title: '${msg.title}',
          message: '${msg.options.body}',
          width: 440
      });
    `);
  });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
