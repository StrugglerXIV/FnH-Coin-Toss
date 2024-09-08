import { showCoinChoiceDialog } from './media.js';
import { playCoinFlipVideo, removeOverlay } from './media.js';

export function setupSocketListeners() {
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
}
