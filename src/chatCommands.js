import { showCoinChoiceDialog } from './media.js';

Hooks.once('ready', () => {
    addChatCommand();
});

export function addChatCommand() {
    Hooks.on('chatMessage', (chatLog, messageText) => {
        if (messageText === "/coinflip") {
            showCoinChoiceDialog();
            return false; // Prevents the message from being sent to chat
        }
    });
}
