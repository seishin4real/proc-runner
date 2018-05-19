const isDev = process.mainModule.filename.indexOf('app.asar') === -1;
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const Store = require('./src/electron/store.electron.js');
const storeDefaults = require('./src/store.default.js');
if (isDev) {
  require('electron-reload')(path.join(__dirname, 'dist'), { electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd') });
}
const { app } = electron;
const Toaster = require('./src/electron/toaster.electron.js');
const toaster = new Toaster();

app.setAppUserModelId('com.seishin.proc-runner');

const store = new Store(storeDefaults);

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {
  let { width, height } = store.get('windowBounds');
  let resizeTimeout = null;

  let mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    icon: path.join(__dirname, 'dist', 'favicon.ico'),
    width,
    height
  });

  toaster.init(mainWindow);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.setMenu(null);
  }

  mainWindow.on('resize', () => {
    if (resizeTimeout) { clearTimeout(resizeTimeout); }
    resizeTimeout = setTimeout(saveNewSize, 1000);
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  function saveNewSize() {
    let { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  }
});
