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

function prepareExpression(val) {
    if (!val) return "";
    return val
        .replace(/(^|[-+*/(])\s*-(\d+(\.\d+)?)\s*\^/g, '$1(-$2)^')
        .replace(/\^/g, '**');
}

function addValue(value) {
    if (isErrorMessage()) {
        clearErrorState();
        display.value = (value === "^") ? "0^" : value;
        return;
    }
    let current = display.value ? display.value.trim() : "0";
    if (value === "^" && (current === "0" || current === "")) {
        display.value = "0^";
        return;
    }
    if (current === "0") {
        if ("+-*/.^".includes(value)) {
            display.value = "0" + value;
        } else {
            display.value = value;
        }
    } else {
        display.value = current + value;
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
        let originalExpr = display.value;
        let expression = prepareExpression(display.value);
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
        let finalResult = parseFloat(result.toPrecision(12)).toString();
        display.value = finalResult;
        addHistoryEntry(originalExpr, finalResult);
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
        let originalExpr = display.value + "%";
        let expression = prepareExpression(display.value);
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
            let finalResult = parseFloat(decimalPercent.toPrecision(12)).toString();
            display.value = finalResult;
            addHistoryEntry(originalExpr, finalResult);
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
        let expression = prepareExpression(display.value);
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
        let originalExpr = "√(" + display.value + ")";
        let expression = prepareExpression(display.value);
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
            let finalResult = parseFloat(sqrtVal.toPrecision(12)).toString();
            display.value = finalResult;
            addHistoryEntry(originalExpr, finalResult);
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
        let originalExpr = "(" + display.value + ")²";
        let expression = prepareExpression(display.value);
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
            let finalResult = parseFloat(sqVal.toPrecision(12)).toString();
            display.value = finalResult;
            addHistoryEntry(originalExpr, finalResult);
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

/* ---------- Calculation History Panel Logic ---------- */

let calculationHistory = [];
try {
    calculationHistory = JSON.parse(localStorage.getItem("calc_history") || "[]");
} catch {
    calculationHistory = [];
}

function addHistoryEntry(expression, result) {
    if (!expression || !result || isErrorMessage()) return;
    let formattedExpr = expression.replace(/\*/g, '×').replace(/\//g, '÷');
    calculationHistory.unshift({ expression: formattedExpr, result: result });
    if (calculationHistory.length > 50) {
        calculationHistory.pop();
    }
    try {
        localStorage.setItem("calc_history", JSON.stringify(calculationHistory));
    } catch {}
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById("historyList");
    if (!list) return;
    if (calculationHistory.length === 0) {
        list.innerHTML = '<li class="history-empty">No calculations yet</li>';
        return;
    }
    list.innerHTML = calculationHistory.map((item, index) => `
        <li class="history-item" onclick="recallHistory(${index})" title="Click to recall this result">
            <div class="history-expr">${item.expression} =</div>
            <div class="history-res">${item.result}</div>
        </li>
    `).join("");
}

function recallHistory(index) {
    if (calculationHistory[index]) {
        clearErrorState();
        display.value = calculationHistory[index].result;
    }
}

function clearHistory() {
    calculationHistory = [];
    try {
        localStorage.removeItem("calc_history");
    } catch {}
    renderHistory();
}

function toggleHistoryPanel() {
    const panel = document.getElementById("historyPanel");
    if (panel) {
        panel.hidden = !panel.hidden;
    }
}

const historyToggle = document.getElementById("historyToggle");
if (historyToggle) {
    historyToggle.addEventListener("click", toggleHistoryPanel);
}

const closeHistoryBtn = document.getElementById("closeHistoryBtn");
if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener("click", toggleHistoryPanel);
}

const clearHistoryBtn = document.getElementById("clearHistoryBtn");
if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", clearHistory);
}

renderHistory();