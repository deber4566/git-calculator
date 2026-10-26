let display = document.getElementById("display");

function addValue(value) {
    if (display.value === "0" && value === "^") {
        display.value = "0^";
    } else if (display.value === "0") {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    display.value = "0";
}

function calculate() {
    try {
        let expression = display.value.replace(/\^/g, '**');
        display.value = Function(
            '"use strict"; return (' + expression + ')'
        )();
    } catch {
        display.value = "Error";
    }
}

function percentage() {
    try {
        if (display.value === "Error" || display.value === "") {
            return;
        }
        let expression = display.value.replace(/\^/g, '**');
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (typeof result === "number" && !isNaN(result)) {
            let decimalPercent = result / 100;
            display.value = parseFloat(decimalPercent.toPrecision(12)).toString();
        }
    } catch {
        display.value = "Error";
    }
}

function toggleSign() {
    try {
        if (display.value === "Error" || display.value === "" || display.value === "0") {
            return;
        }
        let expression = display.value.replace(/\^/g, '**');
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (typeof result === "number" && !isNaN(result)) {
            let toggled = result * -1;
            display.value = parseFloat(toggled.toPrecision(12)).toString();
        }
    } catch {
        display.value = "Error";
    }
}

function squareRoot() {
    try {
        if (display.value === "Error" || display.value === "") {
            return;
        }
        let expression = display.value.replace(/\^/g, '**');
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (typeof result === "number" && !isNaN(result)) {
            if (result < 0) {
                display.value = "Error";
                return;
            }
            let sqrtVal = Math.sqrt(result);
            display.value = parseFloat(sqrtVal.toPrecision(12)).toString();
        }
    } catch {
        display.value = "Error";
    }
}

function square() {
    try {
        if (display.value === "Error" || display.value === "") {
            return;
        }
        let expression = display.value.replace(/\^/g, '**');
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (typeof result === "number" && !isNaN(result)) {
            let sqVal = Math.pow(result, 2);
            display.value = parseFloat(sqVal.toPrecision(12)).toString();
        }
    } catch {
        display.value = "Error";
    }
}

document.addEventListener("keydown", function (event) {
    const key = event.key;

    if ("0123456789+-*/.^".includes(key)) {
        addValue(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "%") {
        event.preventDefault();
        percentage();
    } else if (key === "Escape") {
        clearDisplay();
    } else if (key === "Backspace") {
        display.value = display.value.slice(0, -1) || "0";
    }
});

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "Switch to Light Mode";
    } else {
        themeToggle.textContent = "Switch to Dark Mode";
    }
});