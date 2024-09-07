// scripts/chatCommands.js

window.FnHCoinToss = window.FnHCoinToss || {};

Hooks.once('ready', () => {
    FnHCoinToss.addChatCommand();
});

FnHCoinToss.addChatCommand = function () {
    Hooks.on('chatMessage', (chatLog, messageText) => {
        if (messageText === "/coinflip") {
            FnHCoinToss.showCoinChoiceDialog();
            return false; // Prevents the message from being sent to chat
        }
    });
};
