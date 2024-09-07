// Hook into Foundry's 'ready' event
Hooks.once('ready', () => {
  console.log("FnH Coin Toss Module Loaded!");

  // Function to monitor actor's HP
  function monitorActorHP(actor) {
      let previousHp = actor.system.attributes.hp.value;

      Hooks.on('updateActor', (actorDoc, updateData, options, userId) => {
          // Only monitor HP changes
          if (actorDoc.id === actor.id) {
              let newHp = getProperty(updateData, "system.attributes.hp.value");
              if (newHp !== undefined) {
                  console.log(`Actor: ${actor.name} HP updated. New HP: ${newHp}`);
                  console.log(`Actor: ${actor.name} Previous HP: ${previousHp}`);

                  if (newHp === 0 && previousHp > 0) {
                      console.log(`${actor.name} has reached 0 HP.`);

                      // Get the user controlling this actor
                      let user = game.users.find(u => u.character?.id === actor.id);
                      if (user && user.active) {
                          console.log(`${user.name} is the owner and is active. Triggering coin flip...`);

                          // Trigger coin choice dialog for the player
                          game.socket.emit("module.FnH-Coin-Toss", {
                              type: "showCoinChoiceDialog",
                              userId: user.id
                          });
                      }
                  }

                  previousHp = newHp;
              }
          }
      });
  }

  // Monitor all player-owned actors
  game.actors.forEach(actor => {
      if (actor.hasPlayerOwner) {
          console.log(`Monitoring HP for player-controlled character: ${actor.name}`);
          monitorActorHP(actor);
      }
  });

  // Listen for socket events related to the coin toss
  game.socket.on("module.FnH-Coin-Toss", (data) => {
      console.log("Received socket event:", data);

      if (data.type === "showCoinChoiceDialog" && game.user.id === data.userId) {
          showCoinChoiceDialog();
      } else if (data.type === "playCoinFlipVideo") {
          playCoinFlipVideo(data.resultTotal, data.senderId, data.playerChoice, true);
      } else if (data.type === "removeOverlay") {
          removeOverlay();
      }
  });
});

  // Remove overlay after video ends or is clicked
  function removeOverlay() {
    const existingOverlay = document.querySelector('.overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
}

// Function to initiate the coin flip
async function coinFlip(playerChoice) {
  let roll = await new Roll('1d2').evaluate({ async: true });
  let resultTotal = roll.total;

  console.log("Coin flip result:", resultTotal);

  // Send the result to all players to show the video
  game.socket.emit("module.FnH-Coin-Toss", {
      type: "playCoinFlipVideo",
      resultTotal: resultTotal,
      senderId: game.user.id,
      playerChoice: playerChoice
  });

  // Show the video for the local player immediately
  playCoinFlipVideo(resultTotal, game.user.id, playerChoice, false);
}

// Function to play the coin flip video
function playCoinFlipVideo(resultTotal, senderId, playerChoice, isGlobal) {
  console.log("Playing coin flip video:", { resultTotal, senderId, playerChoice, isGlobal });

  const videoHeads = "modules/FnH-Coin-Toss/assets/Heads.mp4";
  const videoTails = "modules/FnH-Coin-Toss/assets/Tails.mp4";
  const videoToPlay = resultTotal === 1 ? videoHeads : videoTails;
  const resultText = resultTotal === 1 ? "Heads" : "Tails";
  const guessedCorrectly = (resultText.toLowerCase() === playerChoice.toLowerCase());

  console.log(`Video to play: ${videoToPlay}`);
  console.log(`Video result: ${resultText}`);
  console.log(`Guessed correctly: ${guessedCorrectly}`);

  // Create overlay for the video
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const videoElement = document.createElement("video");
  videoElement.src = videoToPlay;
  videoElement.autoplay = true;
  videoElement.classList.add("videoElement");

  // Add event listener for video errors
  videoElement.addEventListener("error", (e) => {
      console.error("Error loading video:", e);
  });

  overlay.appendChild(videoElement);
  document.body.appendChild(overlay);

  // Chat message based on the result
  function sendChatMessage() {
      const message = guessedCorrectly 
          ? "Your body surges in adrenaline, you are now hasted."
          : "Your mind cannot handle this much terror.";
      
      ChatMessage.create({ speaker: ChatMessage.getSpeaker(), content: message });
  }

  // Ensure message is sent only once
  let messageSent = false;
  function finalize() {
      if (!messageSent) {
          sendChatMessage();
          messageSent = true;
      }
      removeOverlay();
  }

  // When the video ends, finalize and clean up
  videoElement.addEventListener("ended", () => {
    console.log("Video ended");
    if (game.user.id === senderId || isGlobal) {
        finalize();
        // Notify other players to remove the overlay
        game.socket.emit("module.FnH-Coin-Toss", { type: "removeOverlay" });
    }
});

// Allow clicking the overlay to remove it early
overlay.addEventListener("click", () => {
  console.log("Overlay clicked");
  if (game.user.id === senderId || isGlobal) {
      finalize();
      // Notify other players to remove the overlay
      game.socket.emit("module.FnH-Coin-Toss", { type: "removeOverlay" });
  }
});
}

// Function to show the coin choice dialog
function showCoinChoiceDialog() {
new Dialog({
    title: "Choose Heads or Tails",
    content: `
      <div class="dialog-size">
        <div style="display: flex; justify-content: space-around;">
          <img src="modules/FnH-Coin-Toss/assets/Heads.png" id="heads-choice" class="cursor-pointer" />
          <img src="modules/FnH-Coin-Toss/assets/Tails.png" id="tails-choice" class="cursor-pointer" />
        </div>
      </div>
    `,
    buttons: {},
    render: (html) => {
        html.find("#heads-choice").click(() => {
            coinFlip("heads");
            ui.notifications.info("You chose Heads.");
            closeDialog();
        });

        html.find("#tails-choice").click(() => {
            coinFlip("tails");
            ui.notifications.info("You chose Tails.");
            closeDialog();
        });
    }
}).render(true);
}

// Function to close the coin choice dialog
function closeDialog() {
const dialog = document.querySelector('.dialog');
if (dialog) {
    dialog.remove();
}
}

// Add a chat command to trigger the coin flip manually
Hooks.on('chatMessage', (chatLog, messageText, chatData) => {
if (messageText === "/coinflip") {
    showCoinChoiceDialog();
    return false; // Prevents the message from being sent to chat
}
});
