document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    const expressionDisplay = document.querySelector('.expression');
    const resultDisplay = document.querySelector('.result');
    const historyList = document.querySelector('.history-list');
    let currentInput = '';
    let operator = null;
    let previousInput = '';
    let memory = 0;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;
            const action = button.getAttribute('data-action');

            if (button.classList.contains('number')) {
                if (currentInput === '0' && buttonText !== '.') {
                    currentInput = buttonText;
                } else {
                    currentInput += buttonText;
                }
                updateDisplay();
            } else if (button.classList.contains('decimal')) {
                if (!currentInput.includes('.')) {
                    currentInput += '.';
                }
                updateDisplay();
            } else if (button.classList.contains('operator')) {
                if (currentInput !== '') {
                    if (previousInput !== '') {
                        calculate();
                    }
                    operator = buttonText;
                    previousInput = currentInput;
                    currentInput = '';
                }
                updateDisplay();
            } else if (button.classList.contains('equal')) {
                if (previousInput !== '' && currentInput !== '' && operator !== null) {
                    calculate();
                    operator = null;
                    previousInput = '';
                }
                updateDisplay();
            } else if (button.classList.contains('clear')) {
                currentInput = '';
                previousInput = '';
                operator = null;
                updateDisplay();
            } else if (button.classList.contains('delete')) {
                currentInput = currentInput.slice(0, -1);
                updateDisplay();
            } else if (button.classList.contains('function')) {
                handleFunction(action);
                updateDisplay();
            } else if (button.classList.contains('memory')) {
                handleMemory(action);
                updateDisplay();
            }
        });
    });

    function updateDisplay() {
        expressionDisplay.textContent = `${previousInput} ${operator || ''} ${currentInput}`;
        resultDisplay.textContent = currentInput || '0';
    }

    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }

        currentInput = result.toString();
        previousInput = '';
        addToHistory(`${previousInput} ${operator} ${current} = ${result}`);
    }

    function handleFunction(action) {
        let result;
        const value = parseFloat(currentInput);

        if (isNaN(value)) return;

        switch (action) {
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'exp':
                result = Math.pow(value, 2);
                break;
            case 'sin':
                result = Math.sin(value);
                break;
            case 'cos':
                result = Math.cos(value);
                break;
            case 'tan':
                result = Math.tan(value);
                break;
            default:
                return;
        }

        currentInput = result.toString();
        addToHistory(`${action}(${value}) = ${result}`);
    }

    function handleMemory(action) {
        const value = parseFloat(currentInput);

        if (isNaN(value)) return;

        switch (action) {
            case 'mc':
                memory = 0;
                break;
            case 'mr':
                currentInput = memory.toString();
                break;
            case 'm+':
                memory += value;
                break;
            case 'm-':
                memory -= value;
                break;
            default:
                return;
        }

        addToHistory(`Memory ${action}: ${value}`);
    }

    function addToHistory(expression) {
        const li = document.createElement('li');
        li.textContent = expression;
        historyList.appendChild(li);
        historyList.scrollTop = historyList.scrollHeight;
    }

    // Keyboard support
    window.addEventListener('keydown', (e) => {
        const key = e.key;

        if (/[\d.]/.test(key)) {
            document.querySelector(`button[data-key="${key}"]`).click();
        } else if (/[\+\-\*\/\%]/.test(key)) {
            document.querySelector(`button[data-key="${key}"]`).click();
        } else if (key === 'Enter' || key === '=') {
            document.querySelector('.equal').click();
        } else if (key === 'Backspace' || key === 'Delete') {
            document.querySelector('.delete').click();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            document.querySelector('.clear').click();
        } else if (key === 'm') {
            document.querySelector('.memory[data-action="mc"]').click();
        } else if (key === 'r') {
            document.querySelector('.memory[data-action="mr"]').click();
        } else if (key === 'p') {
            document.querySelector('.memory[data-action="m+"]').click();
        } else if (key === 'n') {
            document.querySelector('.memory[data-action="m-"]').click();
        } else if (key === 'q') {
            document.querySelector('.function[data-action="sqrt"]').click();
        } else if (key === 'e') {
            document.querySelector('.function[data-action="exp"]').click();
        } else if (key === 's') {
            document.querySelector('.function[data-action="sin"]').click();
        } else if (key === 'c') {
            document.querySelector('.function[data-action="cos"]').click();
        } else if (key === 't') {
            document.querySelector('.function[data-action="tan"]').click();
        }
    });

    // Add data-key attributes to buttons for keyboard support
    buttons.forEach(button => {
        const key = button.textContent;
        button.setAttribute('data-key', key);
    });
});
