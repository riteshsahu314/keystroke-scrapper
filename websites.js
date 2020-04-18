const { APPS } = require("./app");

module.exports = [
  {
    name: APPS.GOOGLE_CHROME,
    url: "https://support.google.com/chrome/answer/157179?hl=en",
    scrapper: "getGoogleChromeKeystrokes",
    icon: "https://firebasestorage.googleapis.com/v0/b/keystroke-33f90.appspot.com/o/images%2Ficons%2Fgoogle-chrome.svg?alt=media"
  },
  {
    name: APPS.VS_CODE,
    url: "https://www.arungudelli.com/microsoft/visual-studio-code-keyboard-shortcut-cheat-sheet-windows-mac-linux/",
    scrapper: "getVSCodeKeystrokes",
    icon: "https://firebasestorage.googleapis.com/v0/b/keystroke-33f90.appspot.com/o/images%2Ficons%2Fvisual-studio-code.svg?alt=media"
  },
  {
    name: APPS.XFCE,
    url: "http://xahlee.info/linux/linux_xfce_keyboard_shortcuts.html",
    scrapper: "getXfceKeystrokes",
    icon: "https://firebasestorage.googleapis.com/v0/b/keystroke-33f90.appspot.com/o/images%2Ficons%2Fxfce.svg?alt=media"
  }
];
