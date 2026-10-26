let display = document.getElementById("display");

function isErrorMessage() {
    return (
        display.value === "Error" ||
        display.value === "Cannot divide by zero" ||
        display.value === "Cannot square root negatives"
    );
}

function setErrorMessage(msg) {
    display.classList.add("error-text");
    display.value = msg;
}

function clearErrorState() {
    display.classList.remove("error-text");
}

function addValue(value) {
    if (isErrorMessage()) {
        clearErrorState();
        display.value = (value === "^") ? "0^" : value;
        return;
    }
    if (display.value === "0" && value === "^") {
        display.value = "0^";
    } else if (display.value === "0") {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    clearErrorState();
    display.value = "0";
}

function calculate() {
    try {
        if (isErrorMessage()) {
            clearDisplay();
            return;
        }
        let expression = display.value.replace(/\^/g, '**');
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!isFinite(result)) {
            setErrorMessage("Cannot divide by zero");
            return;
        }
        if (isNaN(result)) {
            if (/\/0/.test(expression) || /0\s*\*\*\s*-/.test(expression) || /\/\s*\(/.test(expression)) {
                setErrorMessage("Cannot divide by zero");
            } else {
                setErrorMessage("Error");
            }
            return;
        }

        clearErrorState();
        display.value = parseFloat(result.toPrecision(12)).toString();
    } catch {
        setErrorMessage("Error");
    }
}

function percentage() {
    try {
        if (isErrorMessage()) {
            clearDisplay();
            return;
        }
        if (display.value === "") {
            return;
        }
        let expression = display.value.replace(/\^/g, '**');
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (!isFinite(result)) {
            setErrorMessage("Cannot divide by zero");
            return;
        }
        if (typeof result === "number" && !isNaN(result)) {
            clearErrorState();
            let decimalPercent = result / 100;
            display.value = parseFloat(decimalPercent.toPrecision(12)).toString();
        }
    } catch {
        setErrorMessage("Error");
    }
}

function toggleSign() {
    try {
        if (isErrorMessage()) {
            clearDisplay();
            return;
        }
        if (display.value === "" || display.value === "0") {
            return;
        }
        let expression = display.value.replace(/\^/g, '**');
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (!isFinite(result)) {
            setErrorMessage("Cannot divide by zero");
            return;
        }
        if (typeof result === "number" && !isNaN(result)) {
            clearErrorState();
            let toggled = result * -1;
            display.value = parseFloat(toggled.toPrecision(12)).toString();
        }
    } catch {
        setErrorMessage("Error");
    }
}

function squareRoot() {
    try {
        if (isErrorMessage()) {
            clearDisplay();
            return;
        }
        if (display.value === "") {
            return;
        }
        let expression = display.value.replace(/\^/g, '**');
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (!isFinite(result)) {
            setErrorMessage("Cannot divide by zero");
            return;
        }
        if (typeof result === "number" && !isNaN(result)) {
            if (result < 0) {
                setErrorMessage("Cannot square root negatives");
                return;
            }
            clearErrorState();
            let sqrtVal = Math.sqrt(result);
            display.value = parseFloat(sqrtVal.toPrecision(12)).toString();
        }
    } catch {
        setErrorMessage("Error");
    }
}

function square() {
    try {
        if (isErrorMessage()) {
            clearDisplay();
            return;
        }
        if (display.value === "") {
            return;
        }
        let expression = display.value.replace(/\^/g, '**');
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (!isFinite(result)) {
            setErrorMessage("Cannot divide by zero");
            return;
        }
        if (typeof result === "number" && !isNaN(result)) {
            clearErrorState();
            let sqVal = Math.pow(result, 2);
            display.value = parseFloat(sqVal.toPrecision(12)).toString();
        }
    } catch {
        setErrorMessage("Error");
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
        if (isErrorMessage()) {
            clearDisplay();
        } else {
            display.value = display.value.slice(0, -1) || "0";
        }
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