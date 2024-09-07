// scripts/utils/media.js

FnHCoinToss.playCoinFlipVideo = function(resultTotal, senderId, playerChoice, isGlobal) {
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
            // Only send the message if the player is the one who initiated the coin flip
            if (game.user.id === senderId || isGlobal) {
                sendChatMessage();
            }
            messageSent = true;
        }
        FnHCoinToss.removeOverlay();
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
};

FnHCoinToss.showCoinChoiceDialog = function() {
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
                FnHCoinToss.coinFlip("heads");
                ui.notifications.info("You chose Heads.");
                FnHCoinToss.closeDialog();
            });

            html.find("#tails-choice").click(() => {
                FnHCoinToss.coinFlip("tails");
                ui.notifications.info("You chose Tails.");
                FnHCoinToss.closeDialog();
            });
        }
    }).render(true);
};

FnHCoinToss.closeDialog = function() {
    const dialog = document.querySelector('.dialog');
    if (dialog) {
        dialog.remove();
    }
};

FnHCoinToss.removeOverlay = function() {
    const existingOverlay = document.querySelector('.overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
};
