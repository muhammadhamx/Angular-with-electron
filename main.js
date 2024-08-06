const electron = require('electron');
const url = require('url');
const path = require('path');
const electronReload = require('electron-reload');

const {app,BrowserWindow, Menu , screen} = electron;

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    awaitWriteFinish: true,
  });
}


let mainWindow;
let splashScreen;

app.on('ready', function(){
  
  // Getting the full size screen 
  const {width, height} = screen.getPrimaryDisplay().workAreaSize;

  //create a new Splash Screen
  splashScreen = new BrowserWindow({
    width:600, 
    height:500,
    resizable: false,
    frame: false,
    webPreferences:{ 
      nodeIntegration: true,
      contextIsolation: false
     }
  });

  splashScreen.loadURL(url.format({
    pathname: path.join(__dirname,'src/splash.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Main Window
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    // fullscreen: true,
    resizable: false,
    show: false, // Don't show the main window until it's ready
    webPreferences: {
      nodeIntegration: true
    }
  });

  // mainWindow.loadURL(url.format(({
  //   pathname: path.join(__dirname,'dist/electron/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // })));
  mainWindow.loadURL('http://localhost:4200');

  mainWindow.once('ready-to-show',()=>{
    splashScreen.close();
    mainWindow.show();
    electronReload(__dirname + '/app');
  });

  //working same but is more effetient than above
  // mainWindow.once('did-finish-load',()=>{
  //   splashScreen.close();
  //   mainWindow.show();
  // });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainMenu.on('closed', function (){
    app.quit()
  })

})

// Making a costum Menu lable template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label: 'Add Items',
      },
      {
        label: 'Clear Items'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      },
      {
        label: 'FullScreen',
        accelerator: process.platform == 'darwin' ? 'Ctrl+Command+F' : 'F11',
        click(){
          mainWindow.setFullScreen(!mainWindow.isFullScreen())
        }
      },
      
    ]
  },

]

// If macOS, add empty object to menu
if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
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

