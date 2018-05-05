const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const Store = require('./src/store.electron.js');
const storeDefaults = require('./src/store.default.js');

require('electron-reload')(path.join(__dirname, 'dist'), { electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd') });
const app = electron.app

const store = new Store(storeDefaults);

app.on('window-all-closed', function () {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function () {
  let { width, height } = store.get('windowBounds');

  var mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    icon: path.join(__dirname, 'dist', 'favicon.ico'),
    width,
    height
    // frame: false
  });
  
  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});
