//node build-win

const { app, BrowserView, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const jsonfile = require('jsonfile')
const mkdirp = require('mkdirp')
const fs = require('fs')

ipcMain.handle('quit-app', () => {
  app.quit()
})

const config = {
  path: app.getPath('userData'),
  fileUi: 'app-settings-ui.json',
  fileSideMenu: 'app-settings-menu.json',
  fileService: 'ServiceConfig/'
}

var settingsUi = {}
function setupStyle() {
  const settingUiFileName = path.join(config.path, config.fileService + config.fileUi)
  try {
    settingsUi = jsonfile.readFileSync(settingUiFileName)
  } catch (error) {
    settingsUi = {
      titleBarStyle:{
        color: '#fc2c6c',
        colorHover: '#fc84a4'
      },
      sidebarStyle:{
        backColor: '#334',
        borderColor: '#fc2c6c'
      }
    }
    mkdirp.sync(path.dirname(settingUiFileName))
    jsonfile.writeFileSync(settingUiFileName, settingsUi)
  }
}
ipcMain.handle('read-titlebar-style', () => {
  return settingsUi.titleBarStyle
})
const settingServiceFilePath = path.join(config.path, config.fileService)
ipcMain.handle('get-service-path', () => {
  return settingServiceFilePath
})

let window

//const startup = require('./components/startup')

const createWindow = () => {
  //setupStyle()

  let windowState = {
    x: 0,
    t: 0,
    width: 800,
    height: 600,
    defaultWidth: 800,
    defaultHeight: 600
  }

  window = new BrowserWindow({
    'x': windowState.x,
    'y': windowState.y,
    'width': windowState.width,
    'height': windowState.height,
    'minWidth': 500,
    'minHeight': 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
    //autoHideMenuBar: true,
    //titleBarStyle: 'hidden',
    //show: false
    show: true
  })

  if (app.isPackaged) {
    window.loadURL(`file://${__dirname}/../index.html`);
  } else {
    window.loadURL('http://localhost:3000/index.html');
  }
  // Open the DevTools.
  window.webContents.openDevTools()

  /*window.on("resize", () => {
    window.webContents.send('hook-resize')
  })*/
  window.once("ready-to-show", () => {
    //startup.startup(window)
    window.show()
  })
}

ipcMain.handle('find', async (event, target) => {
  try {
    const files = await fs.promises.readdir(target)
    return files.filter(file => file.match('\.csv'))
  } catch (err) {
    console.log(err)
    return []
  }
})

const reader = async (rs) => {
  var array = []
  for await (const chunk of rs) {
    console.log(chunk);
    array.push(chunk)
  }
  return array
};
const readStream = async (target) => {
  const rs = fs.createReadStream(target, { encoding: 'utf8' });
  return await reader(rs);
}
ipcMain.handle('res', async (event, target) => {
  try{
    const res = await readStream(target)
    return res
  } catch (err) {
    console.log(err)
    return ''
  }
})

app.whenReady().then(() => {
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}).then(createWindow)
//app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

