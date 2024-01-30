const { app, BrowserWindow, screen } = require('electron');
const url = require('url');
const path = require('path');

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    let mainWindow = new BrowserWindow({
        width: width,
        height: height,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
        fullscreen: false,
        autoHideMenuBar: true,
    });

    const startPath = path.join(__dirname, 'app/build/index.html');

    mainWindow.loadFile(startPath)

    mainWindow.on('closed', function() {
        mainWindow = null
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function() {
    if (mainWindow === null) createWindow()
});