/**
 * Game 11: Vowel Pattern Manipulation (Vowel spelling)
 * Logic: Swap or add a single vowel tile to transform a word's structure (e.g., hop -> hope).
 * Dyslexia Focus: Mastering silent 'e' and vowel team spelling rules visually.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const THEME_COLOR = "#FF4500";

    const gameData = [
        {
            startWord: ["H", "O", "P"],
            targetWord: "HOPE",
            blanks: 1,
            options: ["A", "E", "I", "U"],
            hint: "Add the 'Magic E' to make the vowel say its name!"
        },
        {
            startWord: ["C", "A", "N"],
            targetWord: "CANE",
            blanks: 1,
            options: ["E", "O", "I", "Y"],
            hint: "Make it a walking CANE using a silent letter at the end."
        },
        {
            startWord: ["R", "A", "N"],
            targetWord: "RAIN",
            blanks: 1, // Insert blank inside the word
            insertAfterIndex: 0, // R _ A N -> wait, let's just use blanks at specific spots
            isInternal: true,
            layout: ["R", "A", "", "N"], // custom layout
            options: ["I", "O", "E", "U"],
            hint: "When two vowels go walking, the first does the talking. Make RAIN."
        }
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
        
        let slotsHTML = '';
        if (data.layout) {
            slotsHTML = data.layout.map((char, i) => {
                if (char === "") return `<div class="word-slot drop-zone" id="slot-${i}" data-filled="false"></div>`;
                return `<div class="word-slot static-char">${char}</div>`;
            }).join('');
        } else {
            slotsHTML = data.startWord.map(char => `<div class="word-slot static-char">${char}</div>`).join('');
            for(let i=0; i<data.blanks; i++) {
                slotsHTML += `<div class="word-slot drop-zone" id="slot-end-${i}" data-filled="false"></div>`;
            }
        }

        stage.innerHTML = `
            <style>
                .vowel-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 700px;
                    margin: 0 auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .hint-box {
                    background: #FFF5F5;
                    border: 2px solid ${THEME_COLOR};
                    padding: 15px 25px;
                    border-radius: 12px;
                    color: #C05621;
                    font-size: 1.2rem;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .word-builder {
                    display: flex;
                    gap: 15px;
                    margin: 40px 0;
                    padding: 30px;
                    background: #EDF2F7;
                    border-radius: 20px;
                    min-width: 300px;
                    justify-content: center;
                }
                
                .word-slot {
                    width: 70px;
                    height: 90px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3.5rem;
                    font-weight: bold;
                    border-radius: 12px;
                    text-transform: uppercase;
                }
                
                .static-char {
                    background: white;
                    color: #2D3748;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    border: 2px solid #CBD5E0;
                }
                
                .drop-zone {
                    background: #E2E8F0;
                    border: 4px dashed #A0AEC0;
                    color: transparent;
                    transition: all 0.2s;
                }
                .drop-zone.hover {
                    background: #FEFCBF;
                    border-color: #D69E2E;
                }
                
                .tile-tray {
                    display: flex;
                    gap: 20px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                
                .vowel-tile {
                    width: 70px;
                    height: 90px;
                    background: ${THEME_COLOR};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3.5rem;
                    font-weight: bold;
                    border-radius: 12px;
                    cursor: grab;
                    box-shadow: 0 6px 0 #C05621, 0 8px 10px rgba(0,0,0,0.1);
                    touch-action: none;
                    user-select: none;
                }
                .vowel-tile:active {
                    cursor: grabbing;
                    transform: translateY(4px);
                    box-shadow: 0 2px 0 #C05621, 0 4px 5px rgba(0,0,0,0.1);
                }
            </style>

            <div class="vowel-container">
                <div class="header">
                    <span>Level: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <div class="hint-box">
                    <span>💡</span> ${data.hint}
                </div>
                
                <div class="word-builder" id="word-builder">
                    ${slotsHTML}
                </div>

                <div class="tile-tray" id="tray">
                    ${data.options.sort(() => Math.random() - 0.5).map((opt, i) => `
                        <div class="vowel-tile" id="tile-${i}" data-letter="${opt}">${opt}</div>
                    `).join('')}
                </div>
            </div>
        `;

        setupDrag(stage);
    }

    function setupDrag(stage) {
        const tiles = stage.querySelectorAll('.vowel-tile');
        const dropZones = stage.querySelectorAll('.drop-zone');
        
        tiles.forEach(tile => {
            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(tile, (x, y, el) => {
                    let dropped = false;
                    
                    dropZones.forEach(zone => {
                        const rect = zone.getBoundingClientRect();
                        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                            if (zone.dataset.filled === "false") {
                                handleDrop(el, zone);
                                dropped = true;
                            }
                        }
                    });

                    if (!dropped && el.resetPosition) {
                        el.resetPosition();
                    }
                });
            }
        });
    }

    function handleDrop(tile, zone) {
        const letter = tile.dataset.letter;
        
        // Visually lock tile into zone
        tile.style.position = 'static';
        tile.style.transform = 'none';
        tile.style.boxShadow = 'none';
        tile.style.cursor = 'default';
        tile.onmousedown = null;
        tile.ontouchstart = null;
        
        zone.style.border = 'none';
        zone.style.background = 'transparent';
        zone.appendChild(tile);
        zone.dataset.filled = "true";
        
        if (window.GameHub) window.GameHub.playSound('click');

        checkWinCondition();
    }

    function checkWinCondition() {
        const builder = document.getElementById('word-builder');
        const data = gameData[currentLevel];
        
        // Extract current word
        let currentWord = "";
        builder.childNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
                if (node.classList.contains('static-char')) {
                    currentWord += node.innerText.trim();
                } else if (node.classList.contains('drop-zone')) {
                    if (node.dataset.filled === "true") {
                        currentWord += node.innerText.trim();
                    }
                }
            }
        });

        if (currentWord.length === data.targetWord.length) {
            if (currentWord === data.targetWord) {
                score += 20;
                if (window.GameHub) {
                    window.GameHub.playSound('correct');
                    const rect = builder.getBoundingClientRect();
                    window.GameHub.triggerVFX(rect.left + rect.width/2, rect.top + rect.height/2);
                }

                // TTS read out the word
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(data.targetWord);
                    window.speechSynthesis.speak(utterance);
                }

                setTimeout(() => {
                    if (currentLevel < gameData.length - 1) {
                        currentLevel++;
                        loadLevel(document.querySelector('.vowel-container').parentElement);
                    } else {
                        if (window.GameHub?.showComplete) {
                            window.GameHub.showComplete("Master Speller!", `You completed all vowel swaps! Final Score: ${score}`);
                        }
                    }
                }, 1500);
            } else {
                if (window.GameHub) window.GameHub.playSound('wrong');
                builder.style.animation = "shake 0.4s";
                setTimeout(() => builder.style.animation = "none", 400);
                
                // Reset drop zones
                setTimeout(() => {
                    loadLevel(document.querySelector('.vowel-container').parentElement);
                }, 800);
            }
        }
    }
})();