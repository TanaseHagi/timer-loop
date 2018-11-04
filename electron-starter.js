const { app, BrowserWindow } = require('electron');

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 300, height: 500, alwaysOnTop: true });

    // and load the index.html of the app.
    // win.loadFile('index.html');
    win.loadURL("http://localhost:3000");
    // win.webContents.openDevTools();
}

app.on('ready', createWindow);
