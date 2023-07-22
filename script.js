window.onload = function(){

}

var woundMatrix = [
    [[4], [5], [5], [6], [6], [6, 4], [6, 5], [6, 6], [], []], 
    [[4], [4], [5], [5], [6], [6], [6, 4], [6, 5], [6, 6], []], 
    [[3], [4], [4], [5], [5], [6], [6], [6, 4], [6, 5], [6, 6]],
    [[3], [3], [4], [4], [5], [5], [6], [6], [6, 4], [6, 5]],
    [[3], [3], [3], [4], [4], [5], [5], [6], [6], [6, 4]],
    [[3], [3], [3], [3], [4], [4], [5], [5], [6], [6]], 
    [[3], [3], [3], [3], [3], [4], [4], [5], [5], [6]], 
    [[3], [3], [3], [3], [3], [3], [4], [4], [5], [5]],
    [[3], [3], [3], [3], [3], [3], [3], [4], [4], [5]],
    [[3], [3], [3], [3], [3], [3], [3], [3], [4], [4]]]

var attacker_dices = document.getElementById("attacker_dices");
var attacker_fight_value = document.getElementById("attacker_fight_value");
var attacker_strength_value = document.getElementById("attacker_strength_value");
var attacker_defence_value = document.getElementById("attacker_defence_value");
var attacker_minus_on_dice = document.getElementById("attacker_minus_on_dice");

var defender_dices = document.getElementById("defender_dices");
var defender_fight_value = document.getElementById("defender_fight_value");
var defender_strength_value = document.getElementById("defender_strength_value");
var defender_defence_value = document.getElementById("defender_defence_value");
var defender_minus_on_dice = document.getElementById("defender_minus_on_dice");

var attacker_dices_visual = document.getElementById("defender_defence_value");
var defender_dices_visual = document.getElementById("defender_defence_value");

var resolve_method_is_coin_toss = document.getElementById("resolve_method_is_coin_toss");
var winner_dices = document.getElementById("winner_dices");
var reroll_on_one = document.getElementById("reroll_on_one");



var attackerWins = false;

function rollDice(){
    return Math.floor(Math.random() * 6) + 1;
}

function getRandomNumber(cap){
    return Math.floor(Math.random() * cap);
}

function getFightPhaseState(){
    return{
        attacker: {
            dices: parseInt(attacker_dices.value),
            fight_value: parseInt(attacker_fight_value.value),
            strength_value: parseInt(attacker_strength_value.value),
            defence_value: parseInt(attacker_defence_value.value),
            minus_on_dice: parseInt(attacker_minus_on_dice.value),
        },
        defender: {
            dices: parseInt(defender_dices.value),
            fight_value: parseInt(defender_fight_value.value),
            strength_value: parseInt(defender_strength_value.value),
            defence_value: parseInt(defender_defence_value.value),
            minus_on_dice: parseInt(defender_minus_on_dice.value),
        },
        resolve_method_is_coin_toss: resolve_method_is_coin_toss.checked,
        winner_dices: parseInt(winner_dices.value)
    }
}


function simulateFightPhase(){
    let state = getFightPhaseState();
    console.log(state);

    let attackerDiceRollsResults = [];
    let defenderDiceRollResults = [];


    
    for(let i = 0; i < state.attacker.dices; i++){
        attackerDiceRollsResults.push(rollDice());
    }

    for(let i = 0; i < state.defender.dices; i++){
        defenderDiceRollResults.push(rollDice());
    }

    console.log("before minus transformation");
    console.log(attackerDiceRollsResults);
    console.log(defenderDiceRollResults);

    let seenAttacker = [];
    for(let i = 0; i < state.attacker.minus_on_dice; i++){
        let position = getRandomNumber(defenderDiceRollResults.length);

        while(seenAttacker.includes(position)){
            position = getRandomNumber(defenderDiceRollResults.length);
        }

        if(attackerDiceRollsResults[position] > 1){
            attackerDiceRollsResults[position] = attackerDiceRollsResults[position] - 1; 
        }

        seenAttacker.push(position);
    }

    let seenDefender = [];
    for(let i = 0; i < state.defender.minus_on_dice; i++){
        let position = getRandomNumber(defenderDiceRollResults.length);

        while(seenDefender.includes(position)){
            position = getRandomNumber(defenderDiceRollResults.length);
        }
        if(defenderDiceRollResults[position] > 1){
            defenderDiceRollResults[position] = defenderDiceRollResults[position] - 1; 
        }

        seenDefender.push(position);
    }

    console.log("After minus transformation");
    console.log(attackerDiceRollsResults);
    console.log(defenderDiceRollResults);

    let highestAttackerRoll = attackerDiceRollsResults.reduce((a, b) => { return Math.max(a, b) });
    let highestDefenderRoll = defenderDiceRollResults.reduce((a, b) => { return Math.max(a, b) });

    console.log("attacker");
    console.log(attackerDiceRollsResults);
    console.log(highestAttackerRoll)

    console.log("defender");
    console.log(defenderDiceRollResults);
    console.log(highestDefenderRoll)

    if(highestAttackerRoll > highestDefenderRoll){
        attackerWins = true;
    } else if (highestAttackerRoll < highestDefenderRoll){
        attackerWins = false;
    } else {
        if(state.attacker.fight_value > state.defender.fight_value){
            attackerWins = true;
        } else if(state.attacker.fight_value < state.defender.fight_value){
            attackerWins = false
        } else {
            if(state.resolve_method_is_coin_toss){
                let diceRoll = rollDice();

                if([1, 2, 3].includes(diceRoll)){
                    attackerWins = true;
                } else {
                    attackerWins = false;
                }

            } else {
                // 33/66

                let diceRoll = rollDice();

                if([1,2].includes(diceRoll)){
                    attackerWins = true;
                } else {
                    attackerWins = false;
                }
            }
        }
    }

    var winnerstate;
    var loserstate;
    console.log(state);


    if(attackerWins){
        console.log("attacker won fight");
        // Fill states
        winnerstate = state.attacker;
        loserstate = state.defender;
    } else {
        console.log("defender won fight");
        // Fill states
        winnerstate = state.defender;
        loserstate = state.attacker;
    }
    console.log("states");
    console.log(winnerstate);
    console.log(loserstate)

    let rolls = [];
    let woundValues = woundMatrix[winnerstate.strength_value][loserstate.defence_value];
    console.log("Wound values are " + woundValues + " as a result of winner strength: " + winnerstate.strength_value + " and defender defence: " + loserstate.defence_value)

    for(let i = 0; i < state.winner_dices; i++){
        rolls.push(rollDice());
    }

    console.log("winner rolls: " + rolls);

    if(woundValues.length == 0){
        console.log("impossible, model can't be killed");
    } else if(woundValues.length == 1){

        rolls = rolls.map(roll => roll >= woundValues[0]).filter(roll => roll == true);


        if(rolls.length >= 1){
            console.log("Succes: model is killed");
        } else {
            console.log("Failed: model is alive");
            console.log("double check (must be 0): " + rolls.length);
        }
    } else {
        for(let i = 0; i < woundValues.length; i++){

            if(rolls.length == 0){
                console.log("Failed: model is alive");
                return;
            }

            rolls = rolls.map(roll => roll >= woundValues[i]).filter(roll => roll == true);

            console.log("winner rolls that passes: " + rolls);

            let newRolls = [];

            rolls.forEach(roll => {
                newRolls.push(rollDice());
            });

            rolls = newRolls;

            console.log("Winner rerolls for next wound value: " + rolls);
        }

        if(rolls.length != 0){
            console.log("Succes: model is killed");
        }
        // let killed = true;

        // for(let i = 0;  i < rolls.length; i++){
        //     console.log("role " + i + " with roll " + rolls[i] + " vs wound value " + woundValues[i]);
        //     if(rolls[i] < woundValues[i]){
        //         killed = false;
        //     }
        // }

        // console.log("model is killed: " + killed);
    }



    /**
    M diceroll from the winner
    Strength and defence (input) 
	Roll equal or higher than position in strength/defence matrix (wound chart)
	with multiple numbers, repeat until no more numbers
	There could be bonus where you reroll when you have a 1 (always on)
	There could be bonus where you can get +1 on the wound roll

Pass wound - enemy model is dead
     */




}