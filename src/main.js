import { monitorAllPlayerActors } from './hpMonitor.js';
import { setupSocketListeners } from './socketListeners.js';
import { addChatCommand } from './chatCommands.js';

Hooks.once('ready', () => {
    console.log("FnH Coin Toss Module Loaded!");

    // Initialize various parts of the module
    monitorAllPlayerActors();
    setupSocketListeners();
    addChatCommand();
});
