const puppeteer = require("puppeteer");

const websites = require("./websites");
const scrappers = require("./scrappers");
const { SYSTEMS } = require("./app");
const firestoreService = require("firestore-export-import");
const firebaseConfig = require("./config.js");
const serviceAccount = require("./serviceAccount.json");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
  });
  const page = await browser.newPage();
  let apps = {};

  for (let i = 0; i < websites.length; i++) {
    const website = websites[i];

    if (scrappers[website.scrapper]) {
      websiteName = website.name.replace("_", " ");
      console.log("Scrapping data for " + websiteName);
      const keystrokes = await scrappers[website.scrapper](page, website.url);
      apps[websiteName] = {};
      apps[websiteName]["shortcuts"] = parseKeystrokes(keystrokes);
      apps[websiteName]["icon"] = website.icon;
    } else {
      console.log("No scrapper found for " + websiteName);
    }
  }
  console.log("apps", apps);

  await browser.close();

  await jsonToFirestore(apps);
})();

const parseKeystrokes = (keystrokes) => {
  Object.keys(keystrokes).map((system) => {
    if (keystrokes[system].length === 0) {
      delete keystrokes[system];
    }
  });
  return keystrokes;
};

// JSON To Firestore
const jsonToFirestore = async (apps) => {
  try {
    console.log("Initialzing Firebase");
    await firestoreService.initializeApp(
      serviceAccount,
      firebaseConfig.databaseURL
    );
    console.log("Firebase Initialized");

    await firestoreService.restore({ apps });
    console.log("Upload Success");
  } catch (error) {
    console.log(error);
  }
};
