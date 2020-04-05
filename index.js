const puppeteer = require("puppeteer");

const websites = require("./websites");
const scrappers = require("./scrappers");
const { SYSTEMS } = require("./app");
const firestoreService = require('firestore-export-import');
const firebaseConfig = require('./config.js');
const serviceAccount = require('./serviceAccount.json');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false
  });
  const page = await browser.newPage();
  let allKeystrokes = [];

  for (let i = 0; i < websites.length; i++) {
    const website = websites[i];
    
    if (scrappers[website.scrapper]) {
      console.log("Scrapping data for " + website.name);
      const keystrokes = await scrappers[website.scrapper](page, website.url);
      allKeystrokes.push(keystrokes);
    } else {
      console.log("No scrapper found for " + website.name);
    }
  }

  await browser.close();

  const data = modifyDataToStoreInFirebase(allKeystrokes);
  await jsonToFirestore(data);
})();

const modifyDataToStoreInFirebase = data => {
  newData = {};
  Object.values(SYSTEMS).forEach(system => {
    newData[system] = {};
  });

  data.forEach(item => {
    item.forEach(shortcutDetails => {
      if (!newData[shortcutDetails.system][shortcutDetails.app]) {
        newData[shortcutDetails.system][shortcutDetails.app] = [];
      }
      
      newData[shortcutDetails.system][shortcutDetails.app].push({
        category: shortcutDetails.category,
        description: shortcutDetails.description,
        shortcut: shortcutDetails.shortcut,
      });
    })
  })

  return newData;
}


// JSON To Firestore
const jsonToFirestore = async (data) => {
  try {
    console.log('Initialzing Firebase');
    await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL);
    console.log('Firebase Initialized');

    await firestoreService.restore({ keystrokes: data });
    console.log('Upload Success');
  }
  catch (error) {
    console.log(error);
  }
};
