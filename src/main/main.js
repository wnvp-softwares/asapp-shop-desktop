const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  // Crea la ventana del navegador.
  const win = new BrowserWindow({
    width: 1400,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false 
    }
  });

  //win.setMenu(null);
  win.loadFile(path.join(__dirname, 'interfaces', 'dashboard.html'));

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});