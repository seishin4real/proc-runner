const { remote } = (window as any).nodeRequire('electron');

export class ElectronDialog {
  static confirm(title, message) {
    const { dialog } = remote;
    const choice = dialog.showMessageBox(remote.getCurrentWindow(),
      {
        type: 'question',
        buttons: ['Yes', 'No'],
        title,
        message
      });

    return choice === 0;
  }
}
