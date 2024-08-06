console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function() {
  console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
});

Hooks.on("ready", function() {
  console.log("This code runs once core initialization is ready and game data is available.");
});


Hooks.on("getSceneControlButtons", (controls) => {
  if (game.user.isGM) {
      const basictools = controls.find((x) => x["name"] == "token").tools;
      basictools.push(
          {
              button: true,
              visible: true,
              icon: "Test Icon",
              name: "Test Icon",
              title: "Test Icon",
              onClick: () => {},
          },
      );
  }
});