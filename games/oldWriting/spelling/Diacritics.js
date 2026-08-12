/**
 * Game 13: Diacritics & Accent Marking (Diacritics)
 * Logic: Drag dots, accents, or diacritics onto exact letter positions.
 * Dyslexia Focus: Developing precision in orthographic marking and secondary symbol placement.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const THEME_COLOR = "#FF4500";

    const gameData = [
        {
            baseWord: "cafe",
            targetIndex: 3, // Position over 'e'
            diacriticSymbol: "´",
            correctMark: "é",
            options: ["´", "~", "¨", "^"],
            hint: "Drag the acute accent to make it a CAFÉ."
        },
        {
            baseWord: "pinata",
            targetIndex: 2, // Position over 'n'
            diacriticSymbol: "~",
            correctMark: "ñ",
            options: ["´", "~", "¨", "`"],
            hint: "Drag the tilde over the correct letter to make PIÑATA."
        },
        {
            baseWord: "naive",
            targetIndex: 2, // Position over 'i'
            diacriticSymbol: "¨",
            correctMark: "ï",
            options: ["´", "~", "¨", "`"],
            hint: "Drag the diaeresis (two dots) to separate the vowel sounds in NAÏVE."
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
        
        stage.innerHTML = `
            <style>
                .accent-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
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
                
                .word-canvas {
                    display: flex;
                    margin-top: 50px;
                    padding: 40px;
                    background: #F7FAFC;
                    border-radius: 20px;
                    border: 2px dashed #CBD5E0;
                    position: relative;
                }
                
                .letter-wrapper {
                    position: relative;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .base-letter {
                    font-size: 6rem;
                    font-weight: 500;
                    color: #2D3748;
                    line-height: 1;
                    padding: 0 5px;
                }
                
                /* The invisible target above the correct letter */
                .accent-target {
                    position: absolute;
                    top: -30px;
                    width: 40px;
                    height: 40px;
                    border: 2px dotted #A0AEC0;
                    border-radius: 8px;
                    background: rgba(255, 69, 0, 0.05);
                    opacity: 0.5;
                    transition: all 0.2s;
                    z-index: 1;
                }
                .accent-target.pulse {
                    border-color: ${THEME_COLOR};
                    background: rgba(255, 69, 0, 0.2);
                    opacity: 1;
                }
                
                .marks-tray {
                    display: flex;
                    gap: 20px;
                    background: white;
                    padding: 20px 40px;
                    border-radius: 50px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                
                .diacritic-piece {
                    font-size: 3rem;
                    font-weight: bold;
                    color: #E53E3E;
                    cursor: grab;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #FFF5F5;
                    border-radius: 50%;
                    border: 2px solid #FEB2B2;
                    touch-action: none;
                    z-index: 10;
                }
                .diacritic-piece:active {
                    cursor: grabbing;
                    transform: scale(1.2);
                }
                
                .hint-text {
                    color: #718096;
                    font-size: 1.1rem;
                    font-weight: 500;
                }
            </style>

            <div class="accent-container">
                <div class="header">
                    <span>Word: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <div class="hint-text">${data.hint}</div>
                
                <div class="word-canvas" id="canvas">
                    ${data.baseWord.split('').map((char, i) => `
                        <div class="letter-wrapper">
                            ${i === data.targetIndex ? `<div class="accent-target" id="target-box"></div>` : ''}
                            <span class="base-letter" id="char-${i}">${char}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="marks-tray" id="tray">
                    ${data.options.sort(() => Math.random() - 0.5).map((mark, i) => `
                        <div class="diacritic-piece" id="mark-${i}" data-mark="${mark}">${mark}</div>
                    `).join('')}
                </div>
            </div>
        `;

        setupDraggableAccents(stage, data);
    }

    function setupDraggableAccents(stage, data) {
        const pieces = stage.querySelectorAll('.diacritic-piece');
        const targetBox = document.getElementById('target-box');
        const canvas = document.getElementById('canvas');

        pieces.forEach(piece => {
            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(piece, (x, y, el) => {
                    const rect = targetBox.getBoundingClientRect();
                    
                    // Allow generous drop zone around the precise box
                    if (x > rect.left - 20 && x < rect.right + 20 && y > rect.top - 20 && y < rect.bottom + 20) {
                        
                        if (el.dataset.mark === data.diacriticSymbol) {
                            handleSuccess(el, data);
                        } else {
                            handleMistake(el);
                        }
                    } else {
                        if (el.resetPosition) el.resetPosition();
                    }
                });
            }
        });
    }

    function handleSuccess(piece, data) {
        score += 25;
        if (window.GameHub) window.GameHub.playSound('correct');
        
        const targetBox = document.getElementById('target-box');
        const charSpan = document.getElementById(`char-${data.targetIndex}`);
        
        // Visual snap and replace
        piece.style.display = 'none';
        targetBox.style.display = 'none';
        
        charSpan.innerText = data.correctMark;
        charSpan.style.color = THEME_COLOR;
        charSpan.style.transform = "scale(1.2)";
        charSpan.style.display = "inline-block";
        charSpan.style.transition = "all 0.3s";
        
        if (window.GameHub) {
            const rect = charSpan.getBoundingClientRect();
            window.GameHub.triggerVFX(rect.left + rect.width/2, rect.top + rect.height/2);
        }

        setTimeout(() => charSpan.style.transform = "scale(1)", 300);

        setTimeout(() => {
            if (currentLevel < gameData.length - 1) {
                currentLevel++;
                loadLevel(document.querySelector('.accent-container').parentElement);
            } else {
                if (window.GameHub?.showComplete) {
                    window.GameHub.showComplete("Precision Marker!", `Great job adding accents! Final Score: ${score}`);
                }
            }
        }, 1500);
    }

    function handleMistake(piece) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        piece.style.backgroundColor = "#FFF5F5";
        piece.style.borderColor = "#E53E3E";
        piece.style.color = "#C53030";
        
        const targetBox = document.getElementById('target-box');
        targetBox.classList.add('pulse');
        setTimeout(() => targetBox.classList.remove('pulse'), 400);

        setTimeout(() => {
            if (piece.resetPosition) piece.resetPosition();
            piece.style.backgroundColor = "#FFF5F5";
            piece.style.borderColor = "#FEB2B2";
            piece.style.color = "#E53E3E";
        }, 500);
    }
})();