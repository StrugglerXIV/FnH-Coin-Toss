import { coinFlip } from './coinFlip.js';

export function playCoinFlipVideo(resultTotal, senderId, playerChoice, isGlobal) {
    const videoHeads = "modules/FnH-Coin-Toss/assets/Heads.mp4";
    const videoTails = "modules/FnH-Coin-Toss/assets/Tails.mp4";
    const videoToPlay = resultTotal === 1 ? videoHeads : videoTails;

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const videoElement = document.createElement("video");
    videoElement.src = videoToPlay;
    videoElement.autoplay = true;
    overlay.appendChild(videoElement);
    document.body.appendChild(overlay);

    videoElement.addEventListener("ended", () => {
        finalizeVideo(senderId, isGlobal);
    });

    overlay.addEventListener("click", () => {
        finalizeVideo(senderId, isGlobal);
    });
}

export function showCoinChoiceDialog() {
    new Dialog({
        title: "Choose Heads or Tails",
        content: `
          <div style="display: flex; justify-content: space-around;">
            <img src="modules/FnH-Coin-Toss/assets/Heads.png" id="heads-choice" />
            <img src="modules/FnH-Coin-Toss/assets/Tails.png" id="tails-choice" />
          </div>
        `,
        buttons: {},
        render: (html) => {
            html.find("#heads-choice").click(() => {
                coinFlip("heads");
                ui.notifications.info("You chose Heads.");
            });

            html.find("#tails-choice").click(() => {
                coinFlip("tails");
                ui.notifications.info("You chose Tails.");
            });
        }
    }).render(true);
}

export function removeOverlay() {
    const existingOverlay = document.querySelector('.overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
}

function finalizeVideo(senderId, isGlobal) {
    if (game.user.id === senderId || isGlobal) {
        removeOverlay();
        game.socket.emit("module.FnH-Coin-Toss", { type: "removeOverlay" });
    }
}
