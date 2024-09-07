// scripts/utils/hpMonitor.js

FnHCoinToss.monitorActorHP = function(actor) {
    let previousHp = actor.system.attributes.hp.value;

    Hooks.on('updateActor', (actorDoc, updateData) => {
        let newHp = getProperty(updateData, "system.attributes.hp.value");
        if (newHp !== undefined && newHp === 0 && previousHp > 0) {
            console.log(`${actor.name} has reached 0 HP.`);

            let user = game.users.find(u => u.character?.id === actor.id);
            if (user && user.active) {
                console.log(`${user.name} is the owner and is active. Triggering coin flip...`);

                // Trigger coin choice dialog for the player
                game.socket.emit("module.FnH-Coin-Toss", {
                    type: "showCoinChoiceDialog",
                    userId: user.id
                });
            }
        }
        previousHp = newHp;
    });
};

FnHCoinToss.monitorAllPlayerActors = function() {
    game.actors.forEach(actor => {
        if (actor.hasPlayerOwner) {
            console.log(`Monitoring HP for player-controlled character: ${actor.name}`);
            FnHCoinToss.monitorActorHP(actor);
        }
    });
};
