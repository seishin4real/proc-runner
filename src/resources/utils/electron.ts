const { remote } = (window as any).nodeRequire('electron');

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

export const pickDirectory = (title, message, defaultPath) => new Promise<string>((resolve, reject) => {
  const { dialog } = remote;
  dialog.showOpenDialog(
    remote.getCurrentWindow(),
    {
      properties: ['openDirectory'],
      title,
      message,
      defaultPath
    },
    filePaths => filePaths ? resolve(filePaths[0]) : reject(new Error('no-selection'))
  );
});
