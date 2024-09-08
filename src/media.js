import { coinFlip } from './coinFlip.js';

let messageSent = false; // Flag to track if the message has been sent

export function showCoinChoiceDialog() {
    console.log("FnHCoinToss: Coin flip function is loaded");
    // Reset the messageSent flag when a new dialog is opened
    messageSent = false;
    
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

export function playCoinFlipVideo(resultTotal, senderId, playerChoice, isGlobal) {
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

    videoElement.addEventListener("ended", () => {
        if (!messageSent) {
            sendChatMessage(guessedCorrectly);
            messageSent = true; // Set the flag to true to avoid multiple messages
        }
        removeOverlay();
        game.socket.emit("module.FnH-Coin-Toss", { type: "removeOverlay" });
    });

    videoElement.addEventListener("error", () => {
        console.error("Error playing video:", videoElement.src);
        removeOverlay();
    });
}

export function removeOverlay() {
    const existingOverlay = document.querySelector('.overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
}

export function closeDialog() {
    const dialog = document.querySelector(".dialog");
    if (dialog) {
        dialog.remove();
    }
}

// Function to handle sending the message
function sendChatMessage(guessedCorrectly) {
    const gm = game.users.find(user => user.isGM);

    if (gm) {
        const message = guessedCorrectly 
            ? "Your body surges in adrenaline, you are now hasted."
            : "Your mind cannot handle this much terror.";

        ChatMessage.create({
            speaker: {
                alias: gm.name // Display the GM's name
            },
            content: message
        });
    } else {
        console.error("No GM user found.");
    }
}
