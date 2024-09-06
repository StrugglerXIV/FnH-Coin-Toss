Hooks.once('ready', () => {
  console.log("FnH Coin Toss Module Loaded!");
});

// Function to handle the coin flip
function coinFlip() {
  let roll = new Roll('1d2');
  roll.roll({async: true}).then(result => {
    let resultTotal = result.total;

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

    videoElement.addEventListener("ended", () => {
      document.body.removeChild(overlay);
    });

    overlay.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: `The coin flip result is: <strong>${resultText}</strong>`
    });
  });
}

// Chat command to trigger the coin flip
Hooks.on('chatMessage', (chatLog, messageText, chatData) => {
  if (messageText === "/coinflip") {
    coinFlip();
    return false;  // Prevent the default chat behavior
  }
});
