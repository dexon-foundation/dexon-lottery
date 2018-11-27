const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1200, height: 900})

  win.loadURL(url.format({
    pathname: `${__dirname}/build/index.html`,
    protocol: 'file:',
    slashes: true
  }))

}

app.on('ready', createWindow)