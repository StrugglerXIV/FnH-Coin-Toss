export async function coinFlip(playerChoice) {
    let roll = await new Roll('1d2').evaluate({ async: true });
    let resultTotal = roll.total;

    game.socket.emit("module.FnH-Coin-Toss", {
        type: "playCoinFlipVideo",
        resultTotal: resultTotal,
        senderId: game.user.id,
        playerChoice: playerChoice
    });

    return resultTotal;
}
