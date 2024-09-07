// scripts/socketListeners.js

window.FnHCoinToss = window.FnHCoinToss || {};

FnHCoinToss.setupSocketListeners = function () {
    game.socket.on("module.FnH-Coin-Toss", (data) => {
        console.log("Received socket event:", data);

        if (data.type === "showCoinChoiceDialog" && game.user.id === data.userId) {
            FnHCoinToss.showCoinChoiceDialog();
        } else if (data.type === "playCoinFlipVideo") {
            FnHCoinToss.playCoinFlipVideo(data.resultTotal, data.senderId, data.playerChoice, true);
        } else if (data.type === "removeOverlay") {
            FnHCoinToss.removeOverlay();
        }
    });
};
