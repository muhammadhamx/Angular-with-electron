const electron = require('electron');
const url = require('url');
const path = require('path');
const wifi = require('node-wifi');

const { app, BrowserWindow, Menu, screen } = electron;

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    awaitWriteFinish: true,
  });
}

let mainWindow;
let splashScreen;
let wifiStatus = 'Checking...';

function updateWifiStatus() {
  wifi.getCurrentConnections((err, currentConnections) => {
    if (err) {
      wifiStatus = 'Error';
    } else if (currentConnections.length === 0) {
      wifiStatus = 'Not Connected';
    } else {
      wifiStatus = 'Connected';
    }
    buildMenu();
  });
}

function buildMenu() {
  const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Add Items',
        },
        {
          label: 'Clear Items'
        },
        {
          label: 'Quit',
          accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click() {
            app.quit();
          }
        },
        {
          label: 'FullScreen',
          accelerator: process.platform == 'darwin' ? 'Ctrl+Command+F' : 'F11',
          click() {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        },
      ]
    },
    {
      label: 'Wi-Fi Status',
      submenu: [
        {
          label: `Status: ${wifiStatus}`,
          enabled: false
        },
        {
          label: 'Refresh Status',
          click() {
            updateWifiStatus();
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({});
  }

  if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
      label: 'Developer',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        }
      ]
    });
  }

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

app.on('ready', function () {
  wifi.init({
    iface: null // choose a random wifi interface if set to null
  });

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  splashScreen = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  splashScreen.loadURL(url.format({
    pathname: path.join(__dirname, 'src/splash.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL('http://localhost:4200');

  mainWindow.once('ready-to-show', () => {
    splashScreen.close();
    mainWindow.show();
  });

  buildMenu();
  updateWifiStatus();
  setInterval(updateWifiStatus, 10000);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// app.on('ready', function(){
  
//   // Getting the full size screen 
//   const {width, height} = screen.getPrimaryDisplay().workAreaSize;

//   //create a new window
//   mainWindow = new BrowserWindow({
//     width:width, 
//     height:height,
//     resizable: false,
//     frame: false,
//     webPreferences:{ nodeIntegration: true }
//   });
// // Load the file into electron
  
// mainWindow.loadURL(url.format({
//     pathname: path.join(__dirname,'dist/electron/index.html'),
//     protocol: 'file:',
//     slashes: true
//   }))

//   // Building the Menu from the temlate
//   const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
//   Menu.setApplicationMenu(mainMenu)
// })

// //creating new Window
// function createAddWindows(){
//   addWin = new BrowserWindow({
//     width: 300,
//     height: 200
//   });
//   // Load the file into electron
//   addWin.loadURL(url.format({
//       pathname: path.join(__dirname,'src/addwin.html'),
//       protocol: 'file:',
//       slashes: true
//     }))
//     addWin.on('close', function(){
//       addWin = null
//     })
// }

