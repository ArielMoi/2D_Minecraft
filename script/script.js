// creating variables for continue use

const axe = document.querySelector('.axe');
const picaxe = document.querySelector('.picaxe');
const shovel = document.querySelector('.shovel');

const game = document.querySelector('.game-grid');

const grassInventory = document.querySelector('.inventory .grass');
const rockInventory = document.querySelector('.inventory .rock');
const soilInventory = document.querySelector('.inventory .soil');
const leavesInventory = document.querySelector('.inventory .leaves');
const woodInventory = document.querySelector('.inventory .wood');

const resetButton = document.querySelector('.tool-box--right-side button');
const entrenceScreen = document.querySelector('.entrence-screen');
const modifyScreen = document.querySelector('.modify-window');
const instructionScreen = document.querySelector('.instruction-window');
const [instructionsButton, modifyWorldButton, startModifyGameButton, startGameButton] = document.querySelectorAll('.entrence-screen button');
const modifyWorldInputs = document.querySelectorAll('input');
const openMainScreen = document.querySelectorAll('.tool-box--right-side .btn')[1];

const inventory = {};
const objOfBoxes = {};

let material;
let currentTool;
let currentMaterial;

// refrence to which tool and what he can harvest 
const materialObj = {
    'axe': ['leaves', 'wood'],
    'picaxe': ['rock'],
    'shovel': ['soil', 'grass']
}

// functions
// create 2d grid for the game
function landScapeMaker(material, rowStart = 1, rowEnd = 20, columnStart = 1, columnEnd = 25) {
    for (let row = rowStart; row <= rowEnd; row++) {
        for (let column = columnStart; column <= columnEnd; column++) {
            objOfBoxes[`${row}.${column}`].classList.add(material);
        }
    }
}

// basic world builder with set positions
function landMaker() {
    landScapeMaker('grass', 14, 14, 1, 25)
    landScapeMaker('soil', 15, 20, 1, 25);
    landScapeMaker('cloud', 5, 5, 9, 13);
    landScapeMaker('cloud', 4, 4, 10, 13);
    landScapeMaker('cloud', 3, 3, 10, 11);
}

// x for future random location generator
function treeMaker(x = 20) {
    landScapeMaker('wood', 10, 13, x, x);
    landScapeMaker('leaves', 7, 9, x - 1, x + 1);
}

function rockMaker(x = 2, double = false) {
    double
        ?
        landScapeMaker('rock', 12, 13, x, x) :
        landScapeMaker('rock', 13, 13, x, x);
}

function bushMaker(x = 5) {
    landScapeMaker('leaves', 13, 13, x, x + 2);
    landScapeMaker('leaves', 12, 12, x + 1, x + 1);
}

// permanent set
function basicWorldMaker() {
    landMaker();
    treeMaker();
    rockMaker(13, true);
    rockMaker();
    bushMaker();
}

//cleaner for reset option
function worldCleaner(columnEnd = 25) {
    for (let row = 1; row <= 13; row++) {
        for (let column = 1; column <= columnEnd; column++) {
            objOfBoxes[`${row}.${column}`].classList[1] &&
                objOfBoxes[`${row}.${column}`].classList.remove(`${objOfBoxes[`${row}.${column}`].classList[1]}`);
        }
    }
    landMaker();
}

//collect material functions (gamr function of harvesting with a tool)
function collectMaterial(event) {
    material = event.target.classList[1];
    if (tool == 'shovel') { // limit shovel to collect only the higher layer of soil (first layer)
        let [row, column] = [event.target.style.gridRow.slice(0, -6) - 1, parseInt(event.target.style.gridColumn.slice(0, -7))]; // location of one box above
        if (objOfBoxes[`${row}.${column}`].classList.length == 1) { // check if there is material in the one box above // prevent coolecting soil from under ground
            if (materialObj[tool].includes(material)) {
                inventory[material] ? inventory[material] += 1 : inventory[material] = 1;
                event.target.classList.remove(material);
                updateInventory() // updated the written amount
            }
        }
    } else {
        if (materialObj[tool].includes(material)) {
            inventory[material] ? inventory[material] += 1 : inventory[material] = 1;
            event.target.classList.remove(material);
            updateInventory()
        }
    }
}

// inventory update the html element to show amount
function updateInventory() {
    for (let [material, amount] of Object.entries(inventory)) {
        switch (material) {
            case 'grass':
                grassInventory.innerHTML = `<h4>${amount}</h4>`;
                break;
            case 'rock':
                rockInventory.innerHTML = `<h4>${amount}</h4>`;
                break;
            case 'soil':
                soilInventory.innerHTML = `<h4>${amount}</h4>`;
                break;
            case 'leaves':
                leavesInventory.innerHTML = `<h4>${amount}</h4>`;
                break;
            case 'wood':
                woodInventory.innerHTML = `<h4>${amount}</h4>`;
                break;
        }
    }
}

// functions to put material on game grid (the player bulding)
function putMaterial(event) {
    if (inventory[material]) {
        if (event.target.classList.length == 1) {
            event.target.classList.add(material)
            inventory[material] -= 1;
            updateInventory();
        }
    }
}

//short cut to remove listeners
function removeOtherEventListeners() {
    game.removeEventListener('click', collectMaterial)
    game.removeEventListener('click', putMaterial)
}

// background resetter. (to delete illusions of pickes on other elements)
function backgroundReset() {
    axe.classList.contains('red') && axe.classList.remove('red');
    axe.classList.contains('blue') && axe.classList.remove('blue');
    picaxe.classList.contains('red') && picaxe.classList.remove('red');
    picaxe.classList.contains('blue') && picaxe.classList.remove('blue');
    shovel.classList.contains('red') && shovel.classList.remove('red');
    shovel.classList.contains('blue') && shovel.classList.remove('blue');
    grassInventory.style.opacity = 0.85;
    woodInventory.style.opacity = 0.85;
    soilInventory.style.opacity = 0.85;
    leavesInventory.style.opacity = 0.85;
    rockInventory.style.opacity = 0.85;
}

// change visibility of html elements
function toggleElementsHidder(el, hide = true) {
    hide
        ?
        el.style.visibility = 'hidden' :
        el.style.visibility = 'visible'
}


function randomLocation(arr, bush = false) {
    ///// generate location to be use as index. to pull from array remaining locations and use the to randomize world
    let location = Math.floor(Math.random() * arr.length);
    bush
        ?
        arr.splice((location-1), 3) :
        arr.splice(location, 1);
    return location; //// BUG !!!!! dont splice the right elements
}

// randomize world maker. works with the modify option of the game and pull from input the amount of elements.
let notExistedLocaions;
function randomWorldMaker(trees = 1, rocks = 1, bushes = 1) {
    trees <= 1 || rocks <= 1 || bushes <= 1 ?
        notExistedLocaions = [...Array(24).keys()] :
        notExistedLocaions = [...Array(49).keys()]; // creating list of location on x grid (columns) 
    notExistedLocaions.shift(); // deletes 0
    notExistedLocaions.shift(); // deletes 1 // to prevent element sitting to close to the starts

    //adjust grid to containe bigger worls
    game.style.gridTemplateColumns = 'repeat(50, 1fr)'
    game.style.width = '1600px';
    game.style.margin = 0;

    worldCleaner(); //clears deafults
    boxGameCreator(1, 20, 25, 50) //creating more boxes and putting them on the grid.
    landScapeMaker('grass', 14, 14, 1, 50) // creating land for the world
    landScapeMaker('soil', 15, 20, 1, 50);

    for (let i = 1; i <= trees; i++) { // creating elements for the world (for amount of user choice)
        let location = randomLocation(notExistedLocaions);
        console.log(notExistedLocaions[location] +'\n' + notExistedLocaions)
        treeMaker(notExistedLocaions[location]); 
    }
    for (let i = 1; i <= rocks; i++) {
        let location = randomLocation(notExistedLocaions);
        console.log(notExistedLocaions[location] +'\n' + notExistedLocaions)
        rockMaker(notExistedLocaions[location]);
    }
    for (let i = 1; i <= bushes; i++) {
        let location = randomLocation(notExistedLocaions, true);
        console.log(notExistedLocaions[location] +'\n' + notExistedLocaions)
        bushMaker(notExistedLocaions[location]);
    }
}

// creating divs. giving them a specific location(row and column), and creating obj of boxes. for future play and positions options.
let indexOfBox = 0;

function boxGameCreator(rowStart = 1, rowEnd = 20, columnStart = 1, columnEnd = 25) { //starts counting from one for easier number reading (20 and 25 instead of 19 24)
    for (let row = rowStart; row <= rowEnd; row++) {
        for (let column = columnStart; column <= columnEnd; column++) {
            let box = document.createElement('div');
            box.classList.add('box');
            game.appendChild(box);
            box.style.gridRow = row;
            box.style.gridColumn = column;
            objOfBoxes[`${row}.${column}`] = box;
            indexOfBox++;
        }
    }
}

// GAME PLAY -!!-

// making the base world
boxGameCreator(); // creating divs
basicWorldMaker(); // creating basic world with one of each element

// event listners for tool choise -> collects only the matching material
axe.addEventListener('click', (e) => {
    tool = 'axe'; // updates the currrent tool
    removeOtherEventListeners(); //clears other event listners
    backgroundReset(); // clears clicked effect from other items
    e.currentTarget.classList.add('blue') // make clicked effect on current item 
    game.addEventListener('click', collectMaterial); //activate material collection
})

picaxe.addEventListener('click', (e) => {
    tool = 'picaxe'
    removeOtherEventListeners()
    backgroundReset();
    e.currentTarget.classList.add('blue');
    game.addEventListener('click', collectMaterial);
})

shovel.addEventListener('click', (e) => {
    tool = 'shovel';
    removeOtherEventListeners()
    backgroundReset();
    e.currentTarget.classList.add('blue')
    game.addEventListener('click', collectMaterial)
})


// event listners for putting material
grassInventory.addEventListener('click', (event) => {
    removeOtherEventListeners() // clears other event listners
    material = 'grass'; // updates the material used
    backgroundReset(); //clears clicked effect on others
    grassInventory.style.opacity = 1; // identicate the item as clicked
    game.addEventListener('click', putMaterial); // activate material collection
})

woodInventory.addEventListener('click', (event) => {
    removeOtherEventListeners()
    material = 'wood';
    backgroundReset();
    woodInventory.style.opacity = 1;
    game.addEventListener('click', putMaterial);
})

rockInventory.addEventListener('click', (event) => {
    removeOtherEventListeners()
    material = 'rock';
    backgroundReset();
    rockInventory.style.opacity = 1;
    game.addEventListener('click', putMaterial);
})

soilInventory.addEventListener('click', (event) => {
    removeOtherEventListeners()
    material = 'soil';
    backgroundReset();
    soilInventory.style.opacity = 1;
    game.addEventListener('click', putMaterial);
})

leavesInventory.addEventListener('click', (event) => {
    removeOtherEventListeners()
    material = 'leaves';
    backgroundReset();
    leavesInventory.style.opacity = 1;
    game.addEventListener('click', putMaterial);
})


// reset button event listener
resetButton.addEventListener('click', () => {
    for (let material of Object.keys(inventory)) { // calibrate inventory
        inventory[material] = 0;
    }
    updateInventory(); // update amount showen to player.
    worldCleaner();
    basicWorldMaker();
})

// entrence screen
startGameButton.addEventListener('click', () => {
    toggleElementsHidder(entrenceScreen);
    toggleElementsHidder(modifyScreen);
    toggleElementsHidder(instructionScreen);
})


let instructionsToggler = 0; // to toggle open and close instructions window
instructionsButton.addEventListener('click', () => {
    instructionsToggler % 2 == 0 ?
        toggleElementsHidder(instructionScreen, false) :
        toggleElementsHidder(instructionScreen);
    instructionsToggler++;
})

let modifyToggler = 0; // to toggle open and close modify window
modifyWorldButton.addEventListener('click', () => {
    modifyToggler % 2 == 0 ?
        toggleElementsHidder(modifyScreen, false) :
        toggleElementsHidder(modifyScreen);
    modifyToggler++;
})

startModifyGameButton.addEventListener('click', () => {
    toggleElementsHidder(entrenceScreen);
    toggleElementsHidder(modifyScreen);
    toggleElementsHidder(instructionScreen);
    randomWorldMaker(modifyWorldInputs[0].value, modifyWorldInputs[1].value, modifyWorldInputs[2].value)
})

openMainScreen.addEventListener('click', () => {
    startGameButton.innerHTML = 'return to game'
    toggleElementsHidder(entrenceScreen, false);
})