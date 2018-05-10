import { CurrentSettings } from 'services/store.service';

const { remote, ipcRenderer } = (window as any).nodeRequire('electron');
//const electron = (window as any).nodeRequire('electron');

export const confirm = (title, message) => new Promise((resolve, reject) => {
  const { dialog } = remote;
  const choice = dialog.showMessageBox(
    remote.getCurrentWindow(),
    {
      type: 'question',
      buttons: ['Yes', 'No'],
      title,
      message
    }
  );
  resolve(choice === 0);
});

export const pickDirectory = (title, message, defaultPath) => new Promise<string>((resolve, reject) =>
  remote.dialog.showOpenDialog(
    remote.getCurrentWindow(),
    {
      properties: ['openDirectory'],
      title,
      message,
      defaultPath
    },
    filePaths => filePaths ? resolve(filePaths[0]) : reject(new Error('no-selection'))
  )
);

export const showNotificationIf = (condition: boolean, type: 'info' | 'warning' | 'success' | 'error', title: string, message: string) => {
  if (condition) {
    showNotification(type, title, message);
  }
};

export const showNotification = (type: 'info' | 'warning' | 'success' | 'error', title: string, message: string) => {
  const ns = CurrentSettings.notifications;

  ipcRenderer.send('electron-toaster-message', {
    title,
    type,
    message,
    width: 440,
    timeout: ns.timeout * 1000,
    positionX: ns.positionX,
    positionY: ns.positionY,
    marginX: ns.marginX || 5,
    marginY: ns.marginY || 5,
  });
};

