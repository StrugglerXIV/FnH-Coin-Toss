import { playCoinFlipVideo, removeOverlay, showCoinChoiceDialog } from '../utils/media.js';

export function setupSocketListeners() {
    game.socket.on("module.FnH-Coin-Toss", (data) => {
        if (data.type === "showCoinChoiceDialog" && game.user.id === data.userId) {
            showCoinChoiceDialog();
        } else if (data.type === "playCoinFlipVideo") {
            playCoinFlipVideo(data.resultTotal, data.senderId, data.playerChoice, true);
        } else if (data.type === "removeOverlay") {
            removeOverlay();
        }
    });
}
