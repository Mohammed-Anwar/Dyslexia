/**
 * Game 10: Picture-Word Encoding (Label Crafter)
 * Logic: Click letter keys on a high-contrast virtual keyboard to label an image.
 * Dyslexia Focus: Translating visual concept memory into structured spelling.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let currentWordState = [];

    const THEME_COLOR = "#3CB371";
    
    // High contrast QWERTY simplified
    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    const gameData = [
        { image: "🐱", word: "CAT", hint: "Meow!" },
        { image: "🍎", word: "APPLE", hint: "Red and crunchy." },
        { image: "☀️", word: "SUN", hint: "Hot and bright." },
        { image: "🚗", word: "CAR", hint: "It goes beep beep." }
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 0;
        score = 0;
        loadLevel(stage);
    };

    function loadLevel(stage) {
        const data = gameData[currentLevel];
        currentWordState = Array(data.word.length).fill('');
        
        stage.innerHTML = `
            <style>
                .encoding-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                
                .image-display {
                    font-size: 6rem;
                    background: white;
                    width: 180px;
                    height: 180px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
                    border: 4px solid #EDF2F7;
                    margin-bottom: 10px;
                }

                .slots-container {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .letter-slot {
                    width: 50px;
                    height: 60px;
                    border-bottom: 5px solid #CBD5E0;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #2D3748;
                    padding-bottom: 5px;
                }
                
                /* Keyboard Styles */
                .keyboard {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: center;
                    width: 100%;
                    background: #2D3748;
                    padding: 20px;
                    border-radius: 15px;
                }
                .key-row {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                }
                .key-btn {
                    background: white;
                    border: none;
                    border-radius: 8px;
                    width: 40px;
                    height: 50px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #2D3748;
                    cursor: pointer;
                    box-shadow: 0 4px 0 #A0AEC0;
                    transition: transform 0.1s, box-shadow 0.1s;
                }
                .key-btn:active {
                    transform: translateY(4px);
                    box-shadow: 0 0 0 #A0AEC0;
                }
                .action-key {
                    background: #F6AD55;
                    color: white;
                    box-shadow: 0 4px 0 #C05621;
                    width: 80px;
                }
                
                .hint-text {
                    color: #718096;
                    font-style: italic;
                    margin-top: -10px;
                }
            </style>

            <div class="encoding-container">
                <div class="header">
                    <span>Image: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <div class="image-display">${data.image}</div>
                <div class="hint-text">Hint: ${data.hint}</div>
                
                <div class="slots-container" id="word-slots">
                    ${currentWordState.map((_, i) => `<div class="letter-slot" id="slot-${i}"></div>`).join('')}
                </div>

                <div class="keyboard" id="keyboard"></div>
            </div>
        `;

        renderKeyboard();
    }

    function renderKeyboard() {
        const kbContainer = document.getElementById('keyboard');
        
        keyboardLayout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'key-row';
            
            row.forEach(letter => {
                const btn = document.createElement('button');
                btn.className = 'key-btn';
                btn.innerText = letter;
                btn.onclick = () => handleKeyPress(letter);
                rowDiv.appendChild(btn);
            });
            kbContainer.appendChild(rowDiv);
        });

        // Add backspace and clear
        const actionRow = document.createElement('div');
        actionRow.className = 'key-row';
        actionRow.innerHTML = `
            <button class="key-btn action-key" onclick="handleBackspace()">⌫ Del</button>
            <button class="key-btn action-key" onclick="handleClear()">Clear</button>
        `;
        kbContainer.appendChild(actionRow);
    }

    window.handleKeyPress = function(letter) {
        const emptyIndex = currentWordState.findIndex(char => char === '');
        if (emptyIndex !== -1) {
            currentWordState[emptyIndex] = letter;
            document.getElementById(`slot-${emptyIndex}`).innerText = letter;
            if (window.GameHub) window.GameHub.playSound('click');
            
            // Check if word is complete
            if (!currentWordState.includes('')) {
                checkWord();
            }
        }
    };

    window.handleBackspace = function() {
        // Find last non-empty index
        for (let i = currentWordState.length - 1; i >= 0; i--) {
            if (currentWordState[i] !== '') {
                currentWordState[i] = '';
                document.getElementById(`slot-${i}`).innerText = '';
                if (window.GameHub) window.GameHub.playSound('click');
                break;
            }
        }
    };

    window.handleClear = function() {
        currentWordState.fill('');
        currentWordState.forEach((_, i) => document.getElementById(`slot-${i}`).innerText = '');
        if (window.GameHub) window.GameHub.playSound('click');
    };

    function checkWord() {
        const data = gameData[currentLevel];
        const typedWord = currentWordState.join('');
        
        if (typedWord === data.word) {
            score += 20;
            
            // Visual success feedback
            currentWordState.forEach((_, i) => {
                const slot = document.getElementById(`slot-${i}`);
                slot.style.color = THEME_COLOR;
                slot.style.borderBottomColor = THEME_COLOR;
            });

            if (window.GameHub) {
                window.GameHub.playSound('correct');
                const slotsRect = document.getElementById('word-slots').getBoundingClientRect();
                window.GameHub.triggerVFX(slotsRect.left + slotsRect.width/2, slotsRect.top);
            }
            
            // Disable keyboard temporarily
            document.getElementById('keyboard').style.pointerEvents = 'none';

            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.querySelector('.encoding-container').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Master Speller!", `You labeled all the pictures! Final Score: ${score}`);
                    }
                }
            }, 1200);
        } else {
            // Wrong word feedback
            if (window.GameHub) window.GameHub.playSound('wrong');
            
            const slotsContainer = document.getElementById('word-slots');
            slotsContainer.style.transform = "translateX(-10px)";
            
            currentWordState.forEach((_, i) => {
                const slot = document.getElementById(`slot-${i}`);
                slot.style.color = "#E53E3E";
                slot.style.borderBottomColor = "#E53E3E";
            });

            setTimeout(() => slotsContainer.style.transform = "translateX(10px)", 100);
            setTimeout(() => slotsContainer.style.transform = "none", 200);
            
            // Auto clear after error
            setTimeout(() => {
                handleClear();
                currentWordState.forEach((_, i) => {
                    const slot = document.getElementById(`slot-${i}`);
                    slot.style.color = "#2D3748";
                    slot.style.borderBottomColor = "#CBD5E0";
                });
            }, 800);
        }
    }
})();