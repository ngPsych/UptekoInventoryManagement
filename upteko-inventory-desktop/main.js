const { app, BrowserWindow, screen } = require('electron')
const path = require('path')

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    let mainWindow = new BrowserWindow({
        width: width,
        height: height,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        fullscreen: false,
        frame: true
    })

    mainWindow.loadFile('index.html')

    mainWindow.on('closed', function() {
        mainWindow = null
    })

}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    if (mainWindow === null) createWindow()
})