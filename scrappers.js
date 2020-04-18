const { APPS, SYSTEMS } = require("./app");

const initializeKeystrokes = () => {
  let keystrokes = {};
  Object.keys(SYSTEMS).map((system) => {
    keystrokes[SYSTEMS[system]] = [];
  });
  return keystrokes;
};

const getGoogleChromeKeystrokes = async (page, url) => {
  await page.goto(url);
  let keystrokes = initializeKeystrokes();

  const chromeKeystrokes = await page.evaluate(
    (keystrokes, SYSTEMS) => {
      const systems = document.querySelectorAll(
        ".article-content-container .cc > h2"
      );

      for (let i = 0; i < systems.length; i++) {
        const system = systems[i];
        const systemName = system.innerText;

        let collapses = [];
        let systemItemsContainer = system.nextElementSibling;
        do {
          collapses = systemItemsContainer.querySelectorAll(".zippy-overflow");
          if (collapses.length <= 0) {
            systemItemsContainer = systemItemsContainer.nextElementSibling;
          }
        } while (collapses.length <= 0);

        collapses.forEach((collapse) => {
          const shortcuts = collapse.querySelectorAll("tr");
          const category = collapse.previousElementSibling.innerText;
          for (let i = 1; i < shortcuts.length; i++) {
            const rowItems = shortcuts[i].querySelectorAll("td");
            let keystroke = {
              category: category,
              description: rowItems[0].innerText,
              shortcut: rowItems[1].innerText,
            };

            if (systemName == "Windows and Linux") {
              keystrokes[SYSTEMS.WINDOWS].push(keystroke);

              keystrokes[SYSTEMS.LINUX].push(keystroke);
            } else if (systemName == "Mac") {
              keystrokes[SYSTEMS.MAC].push(keystroke);
            }
          }
        });
      }
      return keystrokes;
    },
    keystrokes,
    SYSTEMS,
  );

  return chromeKeystrokes;
};

const getVSCodeKeystrokes = async (page, url) => {
  await page.goto(url);
  let keystrokes = initializeKeystrokes();

  const vsCodeKeystrokes = await page.evaluate(
    (keystrokes, SYSTEMS) => {
      const rows = document.querySelectorAll(".table-responsive tr");
      console.log(rows);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const description = row.querySelector(".column-1").innerText;
        const windowKeystroke = row.querySelector(".column-2").innerText;
        const macKeystroke = row.querySelector(".column-3").innerText;
        const linuxKeystroke = row.querySelector(".column-4").innerText;
        let category = row.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.querySelector(
          "span"
        ).innerText;

        category = category.replace(":", "");

        let keystroke = {
          category: category,
          description: description,
        };

        keystrokes[SYSTEMS.WINDOWS].push({
          ...keystroke,
          shortcut: windowKeystroke.replace(/\n/g, ""),
        });

        keystrokes[SYSTEMS.MAC].push({
          ...keystroke,
          shortcut: macKeystroke.replace(/\n/g, ""),
        });

        keystrokes[SYSTEMS.LINUX].push({
          ...keystroke,
          shortcut: linuxKeystroke.replace(/\n/g, ""),
        });
      }

      return keystrokes;
    },
    keystrokes,
    SYSTEMS
  );

  return vsCodeKeystrokes;
};

const getXfceKeystrokes = async (page, url) => {
  await page.goto(url);
  let keystrokes = initializeKeystrokes();

  const xfceKeystrokes = await page.evaluate(
    (keystrokes, SYSTEMS) => {
      const categories = document.querySelectorAll("main h2");
      for (let i = 0; i < 4; i++) {
        const category = categories[i];

        let ul = category.nextElementSibling;

        while (ul.tagName === "UL") {
          const rows = ul.querySelectorAll("li");
          rows.forEach((row) => {
            const shortcutText = row.innerText;
            const shortcut = shortcutText.substr(
              0,
              shortcutText.lastIndexOf("→") - 1
            );
            const description = shortcutText.substr(
              shortcutText.lastIndexOf("→") + 2
            );
            keystrokes[SYSTEMS.LINUX].push({
              category: category.innerText,
              description,
              shortcut,
            });
          });

          ul = ul.nextElementSibling;
        }
      }

      return keystrokes;
    },
    keystrokes,
    SYSTEMS
  );

  return xfceKeystrokes;
};

module.exports = {
  getGoogleChromeKeystrokes,
  getVSCodeKeystrokes,
  getXfceKeystrokes,
};
