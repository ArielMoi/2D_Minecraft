const boxDivs = document.querySelectorAll('.box');

function landScapeMaker(material, rowStart = 1, rowEnd = 20, columnStart = 1, columnEnd = 25) {
    for (let row = rowStart; row <= rowEnd; row++) {
        for (let column = columnStart; column <= columnEnd; column++) {
            objOfBoxes[`${row}.${column}`].classList.add(material);
        }
    }
}

// giving each div a specific location, and creating obj of boxes.
let indexOfBox = 0;
const objOfBoxes = {};
for (let row = 1; row <= 20; row++) { //starts counting from one for easier number reading (20 and 25 instead of 19 24)
    for (let column = 1; column <= 25; column++) {
        boxDivs[indexOfBox].style.row = row;
        boxDivs[indexOfBox].style.column = column;
        objOfBoxes[`${row}.${column}`] = boxDivs[indexOfBox];
        indexOfBox++;
    }
}


// creating base world:
// upper land - grass
landScapeMaker('grass', 14, 14, 1, 25);

landScapeMaker('soil', 15, 20, 1, 25);

landScapeMaker('wood', 10, 13, 20, 20);

landScapeMaker('leaves', 7, 9, 19, 21);

landScapeMaker('rock', 12, 13, 15, 15);
landScapeMaker('rock', 13, 13, 2, 2);

landScapeMaker('leaves', 13, 13, 5, 7);
landScapeMaker('leaves', 12, 12, 6, 6);

landScapeMaker('cloud', 5, 5, 9, 13);
landScapeMaker('cloud', 4, 4, 10, 13);
landScapeMaker('cloud', 3, 3, 10, 11);

// to limit tool use to his value
const materialObj = {
    'axe': ['leaves', 'wood'],
    'picaxe': ['rock'],
    'shovel': ['soil', 'grass']
}


// creating variables for continue use
const axe = document.querySelector('.axe');
const picaxe = document.querySelector('.picaxe');
const shovel = document.querySelector('.shovel');
const game = document.querySelector('.game-grid');

const axeChecker = document.querySelector('.axe input');
const picaxeChecker = document.querySelector('.picaxe input');
const shovelChecker = document.querySelector('.shovel input');

const grassInventory = document.querySelector('.inventory .grass');
const rockInventory = document.querySelector('.inventory .rock');
const soilInventory = document.querySelector('.inventory .soil');
const leavesInventory = document.querySelector('.inventory .leaves');
const woodInventory = document.querySelector('.inventory .wood');

const inventory = {};

//collect material
function collectMaterial(tool, material, event) {
    if (materialObj[tool].includes(material)) {
        inventory[material] ? inventory[material] += 1 : inventory[material] = 1;
        event.target.classList.remove(material);
        updateInventory()
    }
}

function fromEventCollectMaterialAxe(event) {
    collectMaterial('axe', event.target.classList[1], event);
}

function fromEventCollectMaterialShovel(event) {
    collectMaterial('shovel', event.target.classList[1], event);
}

function fromEventCollectMaterialPicaxe(event) {
    collectMaterial('picaxe', event.target.classList[1], event);
}


// event listners for tool choise -> collects only the matching material
axe.addEventListener('click', (e) => {
    removeOtherEventListeners()
    game.addEventListener('click', fromEventCollectMaterialAxe);
})

picaxe.addEventListener('click', () => {
    removeOtherEventListeners()
    game.addEventListener('click', fromEventCollectMaterialPicaxe)
})

shovel.addEventListener('click', () => {
    removeOtherEventListeners()
    game.addEventListener('click', fromEventCollectMaterialShovel)
})


// inventory updates the html element to show amount
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

// functions to put material
function putMaterial(event) {
    if (inventory[material]) {
        if (event.target.classList.length == 1) {
            event.target.classList.add(material)
            inventory[material] -= 1;
            updateInventory();
        }
    }
}

function forEventPutMaterialGrass(event){
    putMaterial(event, 'grass');
}

function forEventPutMaterialWood(event){
    putMaterial(event, 'wood');
}

function forEventPutMaterialRock(event){
    putMaterial(event, 'rock');
}

function forEventPutMaterialSoil(event){
    putMaterial(event, 'soil');
}

function forEventPutMaterialLeaves(event){
    putMaterial(event, 'leaves');
}

function removeOtherEventListeners() {
    game.removeEventListener('click', fromEventCollectMaterialPicaxe)
    game.removeEventListener('click', fromEventCollectMaterialAxe)
    game.removeEventListener('click', fromEventCollectMaterialShovel)
    game.addEventListener('click', forEventPutMaterialGrass)
    game.addEventListener('click', forEventPutMaterialWood)
    game.addEventListener('click', forEventPutMaterialRock)
    game.addEventListener('click', forEventPutMaterialSoil)
    game.addEventListener('click', forEventPutMaterialLeaves)
}


grassInventory.addEventListener('click', (event) => {
    removeOtherEventListeners()
    material = 'grass';
    game.addEventListener('click', putMaterial());
})


woodInventory.addEventListener('click', (event) => {
    removeOtherEventListeners()
    material = 'wood';
    game.addEventListener('click', putMaterial);
})



rockInventory.addEventListener('click', (event) => {
    removeOtherEventListeners()
    material = 'rock';
    game.addEventListener('click', putMaterial);
})


soilInventory.addEventListener('click', (event) => {
    removeOtherEventListeners()
    material = 'soil';
    game.addEventListener('click', putMaterial);
})


leavesInventory.addEventListener('click', (event) => {
    removeOtherEventListeners()
    material = 'leaves';
    game.addEventListener('click', putMaterial);
})

// reset button
const resetButton = document.querySelector('.tool-box--right-side button');

resetButton.addEventListener('click', () => {
    location.reload();
})

// console.log(resetButton)