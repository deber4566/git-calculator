let display = document.getElementById("display");

function isErrorString(val) {
    return (
        val === "Error" ||
        val === "Cannot divide by zero" ||
        val === "Cannot square root negatives"
    );
}

function isErrorMessage() {
    return isErrorString(display.value);
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
    if (isErrorMessage()) {
        clearDisplay();
        return;
    }
    let originalExpr = display.value;
    try {
        let expression = prepareExpression(display.value);
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (result === Infinity || result === -Infinity) {
            const errorMsg = "Cannot divide by zero";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
            return;
        }
        if (Number.isNaN(result)) {
            let errorMsg = "Error";
            if (/\/0/.test(expression) || /0\s*\*\*\s*-/.test(expression) || /\/\s*\(/.test(expression)) {
                errorMsg = "Cannot divide by zero";
            }
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
            return;
        }
        if (typeof result !== "number") {
            const errorMsg = "Error";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
            return;
        }

        clearErrorState();
        let finalResult = parseFloat(result.toPrecision(12)).toString();
        display.value = finalResult;
        addHistoryEntry(originalExpr, finalResult);
    } catch {
        const errorMsg = "Error";
        setErrorMessage(errorMsg);
        addHistoryEntry(originalExpr, errorMsg, true);
    }
}

function percentage() {
    if (isErrorMessage()) {
        clearDisplay();
        return;
    }
    if (display.value === "") {
        return;
    }
    let originalExpr = display.value + "%";
    try {
        let expression = prepareExpression(display.value);
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (result === Infinity || result === -Infinity) {
            const errorMsg = "Cannot divide by zero";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
            return;
        }
        if (typeof result === "number" && !Number.isNaN(result)) {
            clearErrorState();
            let decimalPercent = result / 100;
            let finalResult = parseFloat(decimalPercent.toPrecision(12)).toString();
            display.value = finalResult;
            addHistoryEntry(originalExpr, finalResult);
        } else {
            const errorMsg = "Error";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
        }
    } catch {
        const errorMsg = "Error";
        setErrorMessage(errorMsg);
        addHistoryEntry(originalExpr, errorMsg, true);
    }
}

function toggleSign() {
    if (isErrorMessage()) {
        clearDisplay();
        return;
    }
    if (display.value === "" || display.value === "0") {
        return;
    }
    let originalExpr = display.value;
    try {
        let expression = prepareExpression(display.value);
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (result === Infinity || result === -Infinity) {
            const errorMsg = "Cannot divide by zero";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
            return;
        }
        if (typeof result === "number" && !Number.isNaN(result)) {
            clearErrorState();
            let toggled = result * -1;
            display.value = parseFloat(toggled.toPrecision(12)).toString();
        } else {
            const errorMsg = "Error";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
        }
    } catch {
        const errorMsg = "Error";
        setErrorMessage(errorMsg);
        addHistoryEntry(originalExpr, errorMsg, true);
    }
}

function squareRoot() {
    if (isErrorMessage()) {
        clearDisplay();
        return;
    }
    if (display.value === "") {
        return;
    }
    let originalExpr = "√(" + display.value + ")";
    try {
        let expression = prepareExpression(display.value);
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (result === Infinity || result === -Infinity) {
            const errorMsg = "Cannot divide by zero";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
            return;
        }
        if (typeof result === "number" && !Number.isNaN(result)) {
            if (result < 0) {
                const errorMsg = "Cannot square root negatives";
                setErrorMessage(errorMsg);
                addHistoryEntry(originalExpr, errorMsg, true);
                return;
            }
            clearErrorState();
            let sqrtVal = Math.sqrt(result);
            let finalResult = parseFloat(sqrtVal.toPrecision(12)).toString();
            display.value = finalResult;
            addHistoryEntry(originalExpr, finalResult);
        } else {
            const errorMsg = "Error";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
        }
    } catch {
        const errorMsg = "Error";
        setErrorMessage(errorMsg);
        addHistoryEntry(originalExpr, errorMsg, true);
    }
}

function square() {
    if (isErrorMessage()) {
        clearDisplay();
        return;
    }
    if (display.value === "") {
        return;
    }
    let originalExpr = "(" + display.value + ")²";
    try {
        let expression = prepareExpression(display.value);
        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();
        if (result === Infinity || result === -Infinity) {
            const errorMsg = "Cannot divide by zero";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
            return;
        }
        if (typeof result === "number" && !Number.isNaN(result)) {
            clearErrorState();
            let sqVal = Math.pow(result, 2);
            let finalResult = parseFloat(sqVal.toPrecision(12)).toString();
            display.value = finalResult;
            addHistoryEntry(originalExpr, finalResult);
        } else {
            const errorMsg = "Error";
            setErrorMessage(errorMsg);
            addHistoryEntry(originalExpr, errorMsg, true);
        }
    } catch {
        const errorMsg = "Error";
        setErrorMessage(errorMsg);
        addHistoryEntry(originalExpr, errorMsg, true);
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

function escapeHtml(str) {
    if (typeof str !== "string") return String(str);
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function addHistoryEntry(expression, result, isError = false) {
    if (!expression || !result) return;
    if (isErrorString(expression)) return;

    let formattedExpr = expression.replace(/\*/g, '×').replace(/\//g, '÷');
    calculationHistory.unshift({
        expression: formattedExpr,
        result: result,
        isError: Boolean(isError || isErrorString(result))
    });
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
    list.innerHTML = calculationHistory.map((item, index) => {
        const isErr = Boolean(item.isError || isErrorString(item.result));
        const itemClass = isErr ? "history-item history-item-error" : "history-item";
        const titleText = isErr ? "Click to recall this error" : "Click to recall this result";
        return `
        <li class="${itemClass}" onclick="recallHistory(${index})" title="${titleText}">
            <div class="history-expr">${escapeHtml(item.expression)} =</div>
            <div class="history-res">${escapeHtml(item.result)}</div>
        </li>
    `;
    }).join("");
}

function recallHistory(index) {
    const item = calculationHistory[index];
    if (item) {
        if (item.isError || isErrorString(item.result)) {
            setErrorMessage(item.result);
        } else {
            clearErrorState();
            display.value = item.result;
        }
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