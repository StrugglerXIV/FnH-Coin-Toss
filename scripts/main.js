// scripts/main.js

// Initialize the global namespace
window.FnHCoinToss = window.FnHCoinToss || {};

// Once Foundry is ready, initialize the module
Hooks.once('ready', () => {
    console.log("FnH Coin Toss Module Loaded!");

    // Initialize various parts of the module
    FnHCoinToss.monitorAllPlayerActors();
    FnHCoinToss.setupSocketListeners();
    FnHCoinToss.addChatCommand();
});
