const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow, Menu} = electron;

let mainWindow;
let addWin
// Listen for app to be ready 
app.on('ready', function(){
  //create a new window
  mainWindow = new BrowserWindow({
    width:1000, height:800,
    webPreferences:{ nodeIntegration: true }
  });
// Load the file into electron
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'dist/electron/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // Building the Menu from the temlate
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu)
})

//creating new Window
function createAddWindows(){
  addWin = new BrowserWindow({
    width: 300,
    height: 200
  });
  // Load the file into electron
  addWin.loadURL(url.format({
      pathname: path.join(__dirname,'src/addwin.html'),
      protocol: 'file:',
      slashes: true
    }))
    addWin.on('close', function(){
      addWin = null
    })
}

// Making a costum Menu lable template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label: 'Add Items',
        click(){
          createAddWindows()
        }
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
      }
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