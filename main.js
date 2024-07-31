const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow, Menu} = electron;

let mainWindow;
let addWin
// Listen for app to be ready 
app.on('ready', function(){
  //create a new window
  mainWindow = new BrowserWindow({});
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
  });
  // Load the file into electron
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname,'dist/electron/index.html'),
      protocol: 'file:',
      slashes: true
    }))
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
  }
]