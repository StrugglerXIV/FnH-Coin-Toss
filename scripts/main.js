import { monitorAllPlayerActors } from './utils/hpMonitor.js';
import { setupSocketListeners } from './events/eventHandlers.js';
import { addChatCommand } from './events/chatCommands.js';

Hooks.once('ready', () => {
    console.log("FnH Coin Toss Module Loaded!");

    // Monitor HP for all player-owned actors
    monitorAllPlayerActors();

    // Setup socket listeners for coin toss events
    setupSocketListeners();

    // Add custom chat commands
    addChatCommand();
});
