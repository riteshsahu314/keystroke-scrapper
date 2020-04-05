const { APPS } = require("./app");

module.exports = [
  {
    name: APPS.GOOGLE_CHROME,
    url: "https://support.google.com/chrome/answer/157179?hl=en",
    scrapper: "getGoogleChromeKeystrokes"
  },
  {
    name: APPS.VS_CODE,
    url: "https://www.arungudelli.com/microsoft/visual-studio-code-keyboard-shortcut-cheat-sheet-windows-mac-linux/",
    scrapper: "getVSCodeKeystrokes"
  },
  {
    name: APPS.XFCE,
    url: "http://xahlee.info/linux/linux_xfce_keyboard_shortcuts.html",
    scrapper: "getXfceKeystrokes"
  }
];
