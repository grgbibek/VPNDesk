const electron = require('electron')
// Module to control application life.
const {app, BrowserWindow, Menu, ipcMain} = electron;

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let addWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 320, height: 350})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  //google developer tools
  // mainWindow.toggleDevTools();

  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert menu
  Menu.setApplicationMenu(mainMenu);

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

//handle create add window
function createAddWindow(){
  // Create the browser window.
  addWindow = new BrowserWindow(
    {
       width: 450,
       height: 530,
       title: ' Protection is not active'
     }
     )

  // and load the index.html of the app.
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  //Garbage collection handle
  addWindow.on('close',function(){
    addWindow = null;
  });
}

//Catch item from addWindow.html
ipcMain.on('item:login', function(e,switcher){
  //sending to index.html
  if (switcher){
    createAddWindow();
    mainWindow.close();
  }


})

//Create menu template
const mainMenuTemplate = [
  {
  label:'File',
  submenu: [
    {
      label: 'Quit',
      accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      click(){
        app.quit();
        }
     }
   ]
  }
];

//If mac, add empty object to menu,so that the menu works perfectly fine
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({}); //the unshift function is used to push an object in the beginning (in here pushing in the beginning of the mainMenuTemplate)
}

if (process.env.MODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label:'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item,focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
