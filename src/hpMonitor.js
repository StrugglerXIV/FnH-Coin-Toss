export function monitorActorHP(actor) {
    let previousHp = actor.system.attributes.hp.value;

    Hooks.on('updateActor', (actorDoc, updateData) => {
        let newHp = getProperty(updateData, "system.attributes.hp.value");
        if (newHp !== undefined) {
            if (newHp === 0 && previousHp > 0) {
                console.log(`${actor.name} has reached 0 HP.`);

                let user = game.users.find(u => u.character?.id === actor.id);
                if (user && user.active) {
                    game.socket.emit("module.FnH-Coin-Toss", {
                        type: "showCoinChoiceDialog",
                        userId: user.id
                    });
                }
            }
            previousHp = newHp;
        }
    });
}

export function monitorAllPlayerActors() {
    game.actors.forEach(actor => {
        if (actor.hasPlayerOwner) {
            monitorActorHP(actor);
        }
    });
}
