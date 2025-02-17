// Constants and Variables
let display = document.getElementById('display');
let history = document.getElementById('history');
let memory = 0;
let lastResult = 0;
let isRadianMode = true;
let isDarkTheme = true;

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setupTheme();
    setupShortcuts();
});

// Theme Management
function setupTheme() {
    document.body.classList.add('theme-dark');
    updateThemeButton();
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('theme-light');
    document.body.classList.toggle('theme-dark');
    updateThemeButton();
}

function updateThemeButton() {
    const themeBtn = document.getElementById('theme-btn');
    themeBtn.innerHTML = isDarkTheme ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
}

// Mode Management
function toggleMode() {
    isRadianMode = !isRadianMode;
    const modeBtn = document.getElementById('mode-btn');
    modeBtn.textContent = isRadianMode ? 'RAD' : 'DEG';
}

// Tab Management
function switchTab(tabName) {
    document.querySelectorAll('.button-set').forEach(set => {
        set.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`.${tabName}-buttons`).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Display Management
function appendToDisplay(value) {
    if (display.value === 'Error') {
        display.value = '';
    }
    display.value += value;
}

function clearDisplay() {
    display.value = '';
    history.textContent = '';
}

function deleteLastChar() {
    display.value = display.value.slice(0, -1);
}

// Basic Operations
function calculate() {
    try {
        let expression = display.value
            .replace('×', '*')
            .replace('÷', '/')
            .replace('π', 'Math.PI')
            .replace('e', 'Math.E');
        
        history.textContent = display.value + ' =';
        lastResult = eval(expression);
        display.value = formatNumber(lastResult);
    } catch (error) {
        display.value = 'Error';
    }
}

// Scientific Functions
function calculateFactorial() {
    try {
        const num = parseInt(display.value);
        if (num < 0) throw new Error('Invalid input');
        let result = 1;
        for (let i = 2; i <= num; i++) result *= i;
        history.textContent = `fact(${display.value})`;
        display.value = formatNumber(result);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateTrigFunction(func) {
    try {
        let num = parseFloat(display.value);
        if (!isRadianMode) {
            num = num * Math.PI / 180;
        }
        const result = Math[func](num);
        history.textContent = `${func}(${display.value})`;
        display.value = formatNumber(result);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateSin() { calculateTrigFunction('sin'); }
function calculateCos() { calculateTrigFunction('cos'); }
function calculateTan() { calculateTrigFunction('tan'); }
function calculateSinh() { calculateTrigFunction('sinh'); }
function calculateCosh() { calculateTrigFunction('cosh'); }
function calculateTanh() { calculateTrigFunction('tanh'); }

function calculateInverseTrigFunction(func) {
    try {
        const num = parseFloat(display.value);
        let result = Math[func](num);
        if (!isRadianMode) {
            result = result * 180 / Math.PI;
        }
        history.textContent = `${func}(${display.value})`;
        display.value = formatNumber(result);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateAsin() { calculateInverseTrigFunction('asin'); }
function calculateAcos() { calculateInverseTrigFunction('acos'); }
function calculateAtan() { calculateInverseTrigFunction('atan'); }

function calculatePower() {
    appendToDisplay('^');
}

function calculateSquare() {
    try {
        const num = parseFloat(display.value);
        history.textContent = `sqr(${display.value})`;
        display.value = formatNumber(num * num);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateCube() {
    try {
        const num = parseFloat(display.value);
        history.textContent = `cube(${display.value})`;
        display.value = formatNumber(Math.pow(num, 3));
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateRoot(n) {
    try {
        const num = parseFloat(display.value);
        if (n === 2) history.textContent = `√(${display.value})`;
        else history.textContent = `${n}√(${display.value})`;
        display.value = formatNumber(Math.pow(num, 1/n));
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateSquareRoot() { calculateRoot(2); }
function calculateCubeRoot() { calculateRoot(3); }

// Advanced Mathematical Functions
function calculateLog() {
    try {
        const num = parseFloat(display.value);
        if (num <= 0) throw new Error('Invalid input');
        history.textContent = `log(${display.value})`;
        display.value = formatNumber(Math.log10(num));
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateLn() {
    try {
        const num = parseFloat(display.value);
        if (num <= 0) throw new Error('Invalid input');
        history.textContent = `ln(${display.value})`;
        display.value = formatNumber(Math.log(num));
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateExp() {
    try {
        const num = parseFloat(display.value);
        history.textContent = `exp(${display.value})`;
        display.value = formatNumber(Math.exp(num));
    } catch (error) {
        display.value = 'Error';
    }
}

// Constants
function calculatePi() {
    display.value = Math.PI;
}

function calculateEuler() {
    display.value = Math.E;
}

function calculateRandom() {
    display.value = Math.random();
}

// Memory Functions
function updateMemoryIndicator() {
    const indicator = document.getElementById('memory-indicator');
    indicator.textContent = memory !== 0 ? 'M' : '';
}

function memoryAdd() {
    try {
        memory += parseFloat(display.value) || 0;
        updateMemoryIndicator();
    } catch (error) {
        display.value = 'Error';
    }
}

function memorySubtract() {
    try {
        memory -= parseFloat(display.value) || 0;
        updateMemoryIndicator();
    } catch (error) {
        display.value = 'Error';
    }
}

function memoryRecall() {
    display.value = memory.toString();
}

function memoryClear() {
    memory = 0;
    updateMemoryIndicator();
}

// Utility Functions
function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return Number(num.toFixed(8)).toString();
}

function updateDateTime() {
    const timestamp = document.getElementById('timestamp');
    const now = new Date();
    timestamp.textContent = `UTC: ${now.toISOString().slice(0, 19).replace('T', ' ')}`;
}

// Conversion Functions
const conversions = {
    length: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344
    },
    mass: {
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.45359237,
        oz: 0.028349523125
    },
    temperature: {
        C: value => value,
        F: value => (value - 32) * 5/9,
        K: value => value - 273.15
    }
};

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (/[\d+\-*/.=]/.test(key)) {
        event.preventDefault();
        if (key === '=') {
            calculate();
        } else {
            appendToDisplay(key);
        }
    }
    
    if (key === 'Enter') {
        event.preventDefault();
        calculate();
    }
    
    if (key === 'Escape') {
        event.preventDefault();
        clearDisplay();
    }
    
    if (key === 'Backspace') {
        event.preventDefault();
        deleteLastChar();
    }
});

// Setup keyboard shortcuts help
function setupShortcuts() {
    const shortcuts = [
        { key: 'Enter/=', description: 'Calculate result' },
        { key: 'Escape', description: 'Clear display' },
        { key: 'Backspace', description: 'Delete last character' },
        { key: '0-9', description: 'Input numbers' },
        { key: '+ - * /', description: 'Basic operations' },
        { key: 'm', description: 'Memory recall' },
        { key: 'p', description: 'Input π' },
        { key: 'e', description: 'Input e' }
    ];

    const content = document.getElementById('shortcuts-content');
    content.innerHTML = shortcuts.map(s => 
        `<div><strong>${s.key}</strong>: ${s.description}</div>`
    ).join('');
}

function toggleShortcuts() {
    const content = document.getElementById('shortcuts-content');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
}