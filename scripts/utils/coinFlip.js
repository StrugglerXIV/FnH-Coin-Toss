// scripts/utils/coinFlip.js

FnHCoinToss.coinFlip = async function(playerChoice) {
    let roll = await new Roll('1d2').evaluate({ async: true });
    let resultTotal = roll.total;

    console.log("Coin flip result:", resultTotal);

    // Send the result to all players to show the video
    game.socket.emit("module.FnH-Coin-Toss", {
        type: "playCoinFlipVideo",
        resultTotal: resultTotal,
        senderId: game.user.id,
        playerChoice: playerChoice
    });

    // Show the video for the local player immediately
    FnHCoinToss.playCoinFlipVideo(resultTotal, game.user.id, playerChoice, false);
};
