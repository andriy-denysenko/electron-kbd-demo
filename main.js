const {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  globalShortcut,
  nativeImage,
  Tray,
} = require("electron");

const appTitle = "Keyboard Shortcut Demo";
const trayTooltip = appTitle;
const isMac = process.platform === "darwin";

let win = null;
let tray;

const menu = new Menu();
menu.append(
  new MenuItem({
    label: "Electron",
    submenu: [
      {
        role: "help",
        accelerator:
          process.platform === "darwin" ? "Alt+Cmd+I" : "Alt+Shift+I",
        click: () => {
          console.log("Local keyboard shortcut!");
        },
      },
    ],
  })
);

Menu.setApplicationMenu(menu);

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // Prevent quitting on window closing
  // Taken from https://stackoverflow.com/questions/42988166/show-and-hide-main-window-on-electron
  win.on("close", (event) => {
    if (app.quitting) {
      win = null;
    } else {
      event.preventDefault();
      win.hide();
    }
  });

  win.loadFile("index.html");

  // Listen to before-input-event to intercept keypresses in the browser window
  win.webContents.on("before-input-event", (event, input) => {
    if (input.control && input.key.toLowerCase() === "i") {
      console.log("Pressed Control+I");
      event.preventDefault();
    }
  });
}

function doQuit() {
  console.log("Quitting!");
  app.quit();
}

function toggleWinVisible() {
  if (win === null) {
    createWindow();
  } else {
    console.log(`win === ${win}`);
  }
}

app
  .whenReady()
  .then(createWindow)
  .then(() => {
    globalShortcut.register("CommandOrControl+Q", () => {
      doQuit();
    });

    globalShortcut.register("Alt+CommandOrControl+Q", () => {
      toggleWinVisible();
    });

    const icon = nativeImage.createFromPath("./tray.png");
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      // { role: 'fileMenu' }
      {
        label: "Show window",
        click: async () => {
          toggleWinVisible();
        },
      },
      { type: "separator" },
      isMac ? { role: "close" } : { role: "quit" },
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip(trayTooltip);
    tray.setTitle(appTitle);
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => (app.quitting = true));
