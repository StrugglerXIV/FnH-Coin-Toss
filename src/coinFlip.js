import { playCoinFlipVideo } from './media.js';

export async function coinFlip(playerChoice) {
    try {
        // Roll a die to simulate coin flip (1d2)
        let roll = await new Roll('1d2').evaluate({ async: true });
        let resultTotal = roll.total;

        // Send the result to all players to show the video
        game.socket.emit("module.FnH-Coin-Toss", {
            type: "playCoinFlipVideo",
            resultTotal: resultTotal,
            senderId: game.user.id,
            playerChoice: playerChoice
        });

        // Show the video for the local player immediately
        playCoinFlipVideo(resultTotal, game.user.id, playerChoice, false);
    } catch (error) {
        console.error("Error during coin flip:", error);
    }
}
