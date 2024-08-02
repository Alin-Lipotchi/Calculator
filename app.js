// Variables

const mainResultElement = document.querySelector(".main-result");
const secondaryResultValueElement = document.querySelector(".secondary-result .value");
const secondaryResultOperatorElement = document.querySelector(".secondary-result .operator");
const buttonsArr = document.querySelectorAll(".buttons button");

let calculation = 0;
let mainResultArr = [];
let mainResultNum = 0;
let isFloat = false;
let isNumberPressed = false;
let lastOperation = 0; // 0 - none, 1 - sum, 2 -subtract, 3 - multiply, 4 - divide, 5 - percent
let operationObj = {
    sum : 1,
    subtract: 2,
    multiply: 3,
    divide: 4,
    percent: 5
}

// Functions
// Reset

const reset = (isClrEql) => {
    mainResultNum = 0;
    mainResultArr = [];
    mainResultElement.textContent = 0;
    isFloat = false;
    isNumberPressed = false;
    if(isClrEql) {
        lastOperation = 0;
        secondaryResultValueElement.textContent = "";
        secondaryResultOperatorElement.textContent = "";
    }
}

// Operation Functions

const makeSum = () => {
    calculation += mainResultNum;
}

const makeSubtract = () => {
    calculation -= mainResultNum;
 }

const makeMultiply = () => {
    calculation *= mainResultNum;
}

const makeDivide = () => {
    calculation /= mainResultNum;
}

const makePercent = () => {
    calculation = Math.abs((calculation * mainResultNum) / 100);
}

const switchOperation = () => {
    switch(lastOperation) {
        case 1: makeSum(); break;
        case 2: makeSubtract(); break;
        case 3: makeMultiply(); break;
        case 4: makeDivide(); break;
        case 5: makePercent(); break;
    }
}

// Build Functions

const addDigit = e => {
    e.preventDefault();
    if(mainResultArr.length < 14) {
        if(e.target.value === "dot") {
            if(!isFloat) {
                mainResultArr.push(".");
                isFloat = true;
            }
        } else {
            mainResultArr.push(e.target.value);
            isNumberPressed = true;
        }
        mainResultElement.textContent = mainResultArr.join("");
    }
}

const applyOperator = e => {
    e.preventDefault();
    mainResultNum = +mainResultArr.join("");
    if(e.target.value === "clear") { // CLEAR
        calculation = 0;
        reset(true);

    } else if(e.target.value === "equal") { // EQUAL
        if(mainResultArr.join("") !== "." && mainResultArr.join("") !== "-" && mainResultArr.join("") !== "-.") // this check that the number is not an empty dot (.), comma (.) or comma and dot (-.)
        if(lastOperation) {
            switchOperation();
            reset(true);
            mainResultElement.textContent = +`${calculation}`.split("").slice(0,13).join(""); // this limits the result length to 13 digits
            calculation = 0;
        }

    } else {
        if(!mainResultArr.length && e.target.value === "subtract") { // this part allows to use negative numbers
            mainResultArr.push("-");
            mainResultElement.textContent = "-";
        }
        if(isNumberPressed) { 
            secondaryResultOperatorElement.textContent = e.target.textContent.toLowerCase();
            if(lastOperation) {
                switchOperation();
                lastOperation = operationObj[e.target.value];
                secondaryResultValueElement.textContent = calculation;
                reset();
            } else {
                lastOperation = operationObj[e.target.value];
                secondaryResultValueElement.textContent = mainResultNum;
                calculation = mainResultNum;
                reset();
            }
        }
    }
}

// Event Listeners

buttonsArr.forEach(e => {
    if(e.dataset.type === "number") {
        e.addEventListener("click", addDigit);
    } else {
        e.addEventListener("click", applyOperator);
    }
});



// Keyboard 
// Variables

keyboardDigitsObj = {
    "1":"1", "2":"2", "3":"3", "4":"4", "5":"5", "6":"6", "7":"7", "8":"8", "9":"9", "0":"0", ".":"." 
}

keyboardOperationObj = {
    "Enter":"equal", "Backspace":"clear", "+":"sum", "-":"subtract", "*":"multiply", "/":"divide", "%":"percent"
}

const addDigitByKeypress = e => {
    if(mainResultArr.length < 14) {
        if(e === ".") {
            if(!isFloat) {
                mainResultArr.push(".");
                isFloat = true;
            }
        } else {
            mainResultArr.push(e);
            isNumberPressed = true;
        }
        mainResultElement.textContent = mainResultArr.join("");
    }
}

const applyOperatorByKeypress = (e, symbol) => {
    mainResultNum = +mainResultArr.join("");
    if(e === "clear") { // CLEAR
        calculation = 0;
        reset(true);

    } else if(e === "equal") { // EQUAL
        if(mainResultArr.join("") !== "." && mainResultArr.join("") !== "-" && mainResultArr.join("") !== "-.") // this check that the number is not an empty dot (.), comma (.) or comma and dot (-.)
        if(lastOperation) {
            switchOperation();
            reset(true);
            mainResultElement.textContent = +`${calculation}`.split("").slice(0,13).join(""); // this limits the result length to 13 digits
            calculation = 0;
        }

    } else {
        if(!mainResultArr.length && e === "subtract") { // this part allows to use negative numbers
            mainResultArr.push("-");
            mainResultElement.textContent = "-";
        }
        if(isNumberPressed) { 
            secondaryResultOperatorElement.textContent = symbol;
            if(lastOperation) {
                switchOperation();
                lastOperation = operationObj[e];
                secondaryResultValueElement.textContent = calculation;
                reset();
            } else {
                lastOperation = operationObj[e];
                secondaryResultValueElement.textContent = mainResultNum;
                calculation = mainResultNum;
                reset();
            }
        }
    }
}

// Event Listener

window.addEventListener("keydown", e => {
    if(keyboardDigitsObj[e.key] !== undefined) addDigitByKeypress(keyboardDigitsObj[e.key]);     
    if(keyboardOperationObj[e.key] !== undefined) applyOperatorByKeypress(keyboardOperationObj[e.key], e.key);
    }
);

// known issues
// 0.3 - 0.2