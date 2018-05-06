const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const Store = require('./src/store.electron.js');
const storeDefaults = require('./src/store.default.js');
require('electron-reload')(path.join(__dirname, 'dist'), { electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd') });
const { app } = electron;
const Toaster = require('./src/toaster/toastr.js');
const toaster = new Toaster();

app.setAppUserModelId('com.seishin.proc-runner');

const store = new Store(storeDefaults);

app.on('window-all-closed', function () {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function () {
  let { width, height } = store.get('windowBounds');

  let mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    icon: path.join(__dirname, 'dist', 'favicon.ico'),
    width,
    height
  });

  toaster.init(mainWindow);

  mainWindow.webContents.openDevTools();
  // mainWindow.setMenu(null);

  //todo move to app & debounce
  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});
