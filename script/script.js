
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

//land
landScapeMaker('soil', 15, 20, 1, 25);

// tree
landScapeMaker('wood', 10, 13, 20, 20);

// tree leaved
landScapeMaker('leaves', 7, 9, 19, 21);

// rock
landScapeMaker('rock', 12, 13, 15, 15);
landScapeMaker('rock', 13, 13, 2, 2);

// bush
landScapeMaker('leaves', 13, 13, 5, 7);
landScapeMaker('leaves', 12, 12, 6, 6);

// cloud
landScapeMaker('cloud', 5, 5, 9, 13);
landScapeMaker('cloud', 4, 4, 10, 13);
landScapeMaker('cloud', 3, 3, 10, 11);