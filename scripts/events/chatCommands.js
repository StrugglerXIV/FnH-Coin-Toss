// scripts/events/chatCommands.js

FnHCoinToss.addChatCommand = function() {
    Hooks.on('chatMessage', (chatLog, messageText, chatData) => {
        if (messageText.trim().toLowerCase() === "/coinflip") {
            FnHCoinToss.showCoinChoiceDialog();
            return false; // Prevents the message from being sent to chat
        }
    });
};
