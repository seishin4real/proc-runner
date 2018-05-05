//@ts-check
//https://github.com/s-a/electron-toaster
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipc = require('electron').ipcMain;
const _find = require('lodash').find;


const showToaster = function (currentWindow, msg) {
  const self = this;

  this.window = new BrowserWindow({
    width: msg.width,
    title: msg.title || 'toaster',
    // icon: __dirname + '/icon.png',
    transparent: true,
    frame: false,
    show: false,
    //center: true
    skipTaskbar: true,
    alwaysOnTop: true
  });


  let timer, height, width;
  const [x, y] = currentWindow.getPosition();
  const display = electron.screen.getDisplayNearestPoint({ x, y });

  this.window.on('closed', function () {
    try {
      clearTimeout(timer);
      self.window = null;
    } catch (e) { }
  });

  var moveWindow = function (yOffset, done) {
    try {
      const x = msg.positionX === 'left' ? msg.marginX
        : msg.positionX === 'right' ? display.size.width - width - msg.marginX
          : (display.size.width - width) / 2;

      const y = msg.positionY === 'top' ? msg.marginX - height + yOffset
        : display.size.height - msg.marginX - yOffset;

      self.window.setPosition(x, y);
    } catch (e) { } finally {
      done();
    }
  };

  let i = 0;
  const slideUp = function (cb) {
    if (i < height) {
      i += Math.round(height / 10);
      timer = setTimeout(function () {
        moveWindow(i, function () {
          if (i === Math.round(height / 10)) { // show after first pos set to avoid flicker.
            self.window.show();
            if (msg.focus === undefined || msg.focus) {
              // if (currentWindow) { currentWindow.focus(); }
              try { if (!currentWindow.isDestroyed) { currentWindow.focus(); } }
              catch (e) {
                console.log(e);
              }
            }
          }
          slideUp(cb);
        });
      }, 1);
    } else {
      cb();
    }
  };

  const htmlFile = (msg.htmlFile || `file://${__dirname}/default.html`) +
    '?title=' + encodeURIComponent(msg.title || '') +
    '&message=' + encodeURIComponent(msg.message || '') +
    '&detail=' + encodeURIComponent(msg.detail || '') +
    '&type=' + encodeURIComponent(msg.type || '') +
    '&timeout=' + (msg.timeout || 5000);
  this.window.loadURL(htmlFile);

  this.window.webContents.on('did-finish-load', function () {
    if (self.window) {
      const size = self.window.getSize();
      width = size[0];
      height = size[1];
      slideUp(function () { });
    }
  });
};

const Toaster = function () {
  return this;
};


Toaster.prototype.init = function (currentWindow) {
  ipc.on('electron-toaster-message', function (event, msg) {
    showToaster(currentWindow, msg);
  });
};


module.exports = Toaster;
