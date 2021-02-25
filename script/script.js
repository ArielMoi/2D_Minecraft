
const boxDivs = document.querySelectorAll('.box');

function landScapeMaker(material ,rowStart = 1, rowEnd = 20, columnStart = 1, columnEnd = 25){
    for (let row = rowStart; row <= rowEnd; row++){
        for (let column = columnStart; column <= columnEnd; column++){
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


const materialObj = {
    'axe': ['leaves', 'wood'],
    'picaxe': ['rock'],
    'shovel': ['soil', 'grass']
}

const axe = document.querySelector('.axe');
const picaxe = document.querySelector('.picaxe');
const shovel = document.querySelector('.shovel');
const game = document.querySelector('.game-grid');

const inventory = {};



function collectMaterial(tool, material, event){
    if (materialObj[tool].includes(material)){
        console.log(materialObj[tool])
        inventory[material] ? inventory[material] += 1 : inventory[material] = 1;
        event.target.classList.remove(material);
    }
}

axe.addEventListener('click', () => {
    game.addEventListener('click', (event) => {
        collectMaterial('axe', event.target.classList[1], event);
    })
})

picaxe.addEventListener('click', () => {
    game.addEventListener('click', (event) => {
        collectMaterial('picaxe', event.target.classList[1], event);
    })
})

shovel.addEventListener('click', () => {
    game.addEventListener('click', (event) => {
        collectMaterial('shovel', event.target.classList[1], event);
    })
})

// inventory