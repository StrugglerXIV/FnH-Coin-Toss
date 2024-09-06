Hooks.once('ready', () => {
  console.log("FnH Coin Toss Module Loaded!");

  // Listen for the socket event for coin flip and overlay removal
  game.socket.on("module.FnH-Coin-Toss", (data) => {
    if (data.type === "coinFlip") {
      playCoinFlipVideo(data.resultTotal, data.senderId, data.playerChoice);
    } else if (data.type === "removeOverlay") {
      removeOverlay();
    }
  });
});

// Function to handle the coin flip and player's choice
function coinFlip(playerChoice) {
  let roll = new Roll('1d2').evaluate({ async: false });
  let resultTotal = roll.total;

  // Broadcast the result to all players
  game.socket.emit("module.FnH-Coin-Toss", {
    type: "coinFlip",
    resultTotal: resultTotal,
    senderId: game.user.id,
    playerChoice: playerChoice  // Send the player's choice
  });

  playCoinFlipVideo(resultTotal, game.user.id, playerChoice);
}

// Function to display the video
function playCoinFlipVideo(resultTotal, senderId, playerChoice) {
  let videoHeads = "modules/FnH-Coin-Toss/assets/Heads.mp4";
  let videoTails = "modules/FnH-Coin-Toss/assets/Tails.mp4";

  let videoToPlay = resultTotal === 1 ? videoHeads : videoTails;
  let resultText = resultTotal === 1 ? "Heads" : "Tails";
  let guessedCorrectly = (resultText.toLowerCase() === playerChoice.toLowerCase());

  // Create a dark overlay and the full-screen video element
  let overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.zIndex = "10000";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  let videoElement = document.createElement("video");
  videoElement.src = videoToPlay;
  videoElement.autoplay = true;
  videoElement.style.maxWidth = "90%";
  videoElement.style.maxHeight = "90%";

  overlay.appendChild(videoElement);
  document.body.appendChild(overlay);

  // Function to send the chat message based on the result
  function sendChatMessage() {
    let message = guessedCorrectly 
      ? "Your body surges in adrenaline, you are now hasted."
      : "Your mind can not handle this much terror.";

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: message
    });
  }

  // Function to remove the overlay
  function removeOverlay() {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }

  // Handle video end and overlay click
  let messageSent = false;
  function finalize() {
    if (!messageSent) {
      sendChatMessage();
      messageSent = true;
    }
    removeOverlay();
  }

  videoElement.addEventListener("ended", () => {
    if (game.user.id === senderId) {
      finalize();
      // Notify other clients to remove their overlay
      game.socket.emit("module.FnH-Coin-Toss", { type: "removeOverlay" });
    }
  });

  overlay.addEventListener("click", () => {
    if (game.user.id === senderId) {
      finalize();
      // Notify other clients to remove their overlay
      game.socket.emit("module.FnH-Coin-Toss", { type: "removeOverlay" });
    }
  });
}

// Ensure the `removeOverlay` function is defined in the global scope
function removeOverlay() {
  let overlay = document.querySelector('div[style*="fixed"]');
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

// Function to create a popup for heads or tails choice
function showCoinChoiceDialog() {
  new Dialog({
    title: "Choose Heads or Tails",
    content: `
      <div style="display: flex; justify-content: space-around;">
        <img src="modules/FnH-Coin-Toss/assets/Heads.png" id="heads-choice" style="cursor: pointer; max-width: 150px;" />
        <img src="modules/FnH-Coin-Toss/assets/Tails.png" id="tails-choice" style="cursor: pointer; max-width: 150px;" />
      </div>
    `,
    buttons: {},  // No buttons because we will handle image clicks
    render: (html) => {
      html.find("#heads-choice").click(() => {
        // Player chose heads
        coinFlip("heads");
        ui.notifications.info("You chose Heads.");
        closeDialog();  // Close the dialog after the choice
      });

      html.find("#tails-choice").click(() => {
        // Player chose tails
        coinFlip("tails");
        ui.notifications.info("You chose Tails.");
        closeDialog();  // Close the dialog after the choice
      });
    }
  }).render(true);
}

// Function to close the dialog
function closeDialog() {
  let dialog = document.querySelector('.dialog');
  if (dialog) {
    dialog.remove();
  }
}

// Chat command to trigger the coin flip choice dialog
Hooks.on('chatMessage', (chatLog, messageText, chatData) => {
  if (messageText === "/coinflip") {
    showCoinChoiceDialog();
    return false;  // Prevent the default chat behavior
  }
});
