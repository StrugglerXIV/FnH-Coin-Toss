// scripts/media.js

window.FnHCoinToss = window.FnHCoinToss || {};

FnHCoinToss.showCoinChoiceDialog = function () {
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

FnHCoinToss.playCoinFlipVideo = function (resultTotal, senderId, playerChoice, isGlobal) {
    const videoHeads = "modules/FnH-Coin-Toss/assets/Heads.mp4";
    const videoTails = "modules/FnH-Coin-Toss/assets/Tails.mp4";
    const videoToPlay = resultTotal === 1 ? videoHeads : videoTails;
    const resultText = resultTotal === 1 ? "Heads" : "Tails";
    const guessedCorrectly = (resultText.toLowerCase() === playerChoice.toLowerCase());

    console.log(`Video to play: ${videoToPlay}`);
    console.log(`Guessed correctly: ${guessedCorrectly}`);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const videoElement = document.createElement("video");
    videoElement.src = videoToPlay;
    videoElement.autoplay = true;
    videoElement.classList.add("videoElement");

    overlay.appendChild(videoElement);
    document.body.appendChild(overlay);

    function sendChatMessage() {
        const message = guessedCorrectly 
            ? "Your body surges in adrenaline, you are now hasted."
            : "Your mind cannot handle this much terror.";
        
        ChatMessage.create({ speaker: ChatMessage.getSpeaker(), content: message });
    }

    videoElement.addEventListener("ended", () => {
        sendChatMessage();
        FnHCoinToss.removeOverlay();
        game.socket.emit("module.FnH-Coin-Toss", { type: "removeOverlay" });
    });

    videoElement.addEventListener("error", () => {
        console.error("Error playing video:", videoElement.src);
        FnHCoinToss.removeOverlay();
    });
};

FnHCoinToss.removeOverlay = function () {
    const existingOverlay = document.querySelector('.overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
};

FnHCoinToss.closeDialog = function () {
    const dialog = document.querySelector(".dialog");
    if (dialog) {
        dialog.remove();
    }
};
