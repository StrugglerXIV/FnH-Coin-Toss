import { showCoinChoiceDialog } from '../utils/media.js';

export function addChatCommand() {
    Hooks.on('chatMessage', (chatLog, messageText) => {
        if (messageText === "/coinflip") {
            showCoinChoiceDialog();
            return false; // Prevents message from being sent to chat
        }
    });
}
