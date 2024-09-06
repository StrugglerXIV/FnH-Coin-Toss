Hooks.once('ready', () => {
  console.log("FnH Coin Toss Module Loaded!");

  // Listen for the socket event for coin flip and overlay removal
  game.socket.on("module.FnH-Coin-Toss", (data) => {
    if (data.type === "coinFlip") {
      playCoinFlipVideo(data.resultTotal, data.senderId);
    } else if (data.type === "removeOverlay") {
      removeOverlay();
    }
  });
});

// Function to handle the coin flip
function coinFlip() {
  let roll = new Roll('1d2').evaluate({ async: false });
  let resultTotal = roll.total;

  // Broadcast the result to all players
  game.socket.emit("module.FnH-Coin-Toss", {
    type: "coinFlip",
    resultTotal: resultTotal,
    senderId: game.user.id // Send the ID of the user who initiated the coin flip
  });

  playCoinFlipVideo(resultTotal, game.user.id);
}

// Function to display the video
function playCoinFlipVideo(resultTotal, senderId) {
  let videoHeads = "modules/FnH-Coin-Toss/assets/Heads.mp4";
  let videoTails = "modules/FnH-Coin-Toss/assets/Tails.mp4";

  let videoToPlay = resultTotal === 1 ? videoHeads : videoTails;
  let resultText = resultTotal === 1 ? "Heads" : "Tails";

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

  // Function to send the chat message
  function sendChatMessage() {
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: `The coin flip result is: <strong>${resultText}</strong>`
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
  // Only remove overlay if it exists in the document
  let overlay = document.querySelector('div[style*="fixed"]'); // Assumes overlay uses fixed positioning
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

// Chat command to trigger the coin flip
Hooks.on('chatMessage', (chatLog, messageText, chatData) => {
  if (messageText === "/coinflip") {
    coinFlip();
    return false;  // Prevent the default chat behavior
  }
});
