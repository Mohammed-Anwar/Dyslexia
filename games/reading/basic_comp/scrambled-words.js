/**
 * Game 8: Word Magnets (Sentence Building)
 * Filename: games/read_d1_g8.js
 * Logic: Snap words onto a rail to build a sentence. Color-code nouns and verbs.
 * Dyslexia Focus: Syntactic structure and sentence framing.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let correctlyPlaced = 0;

    const gameData = [
        {
            sentence: "The cat jumps high",
            words: [
                { text: "The", type: "other", order: 0 },
                { text: "cat", type: "noun", order: 1 },
                { text: "jumps", type: "verb", order: 2 },
                { text: "high", type: "other", order: 3 }
            ]
        },
        {
            sentence: "Big dogs bark loudly",
            words: [
                { text: "Big", type: "other", order: 0 },
                { text: "dogs", type: "noun", order: 1 },
                { text: "bark", type: "verb", order: 2 },
                { text: "loudly", type: "other", order: 3 }
            ]
        },
        {
            sentence: "Birds fly in sky",
            words: [
                { text: "Birds", type: "noun", order: 0 },
                { text: "fly", type: "verb", order: 1 },
                { text: "in", type: "other", order: 2 },
                { text: "sky", type: "noun", order: 3 }
            ]
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
        correctlyPlaced = 0;
        
        stage.innerHTML = `
            <style>
                .sentence-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    color: #2D3748;
                }
                .game-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #E2E8F0;
                }
                .legend {
                    display: flex;
                    gap: 15px;
                }
                .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; }
                .dot { width: 10px; height: 10px; border-radius: 50%; }
                .dot.noun { background: #4299E1; }
                .dot.verb { background: #F6AD55; }

                .instruction-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 10px 0;
                    text-align: center;
                }

                .magnetic-rail {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    padding: 25px;
                    background: #F7FAFC;
                    border: 3px dashed #CBD5E0;
                    border-radius: 16px;
                    min-height: 120px;
                    width: 100%;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                }
                .word-slot {
                    min-width: 100px;
                    height: 60px;
                    border-bottom: 3px solid #E2E8F0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: border-color 0.3s;
                }
                .magnet-pool {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-top: 30px;
                    justify-content: center;
                    padding: 20px;
                    background: #EDF2F7;
                    border-radius: 16px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .magnet {
                    padding: 10px 20px;
                    background: white;
                    border: 2px solid #E2E8F0;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: grab;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    touch-action: none;
                    z-index: 10;
                    user-select: none;
                }
                .magnet.noun { border-bottom: 5px solid #4299E1; }
                .magnet.verb { border-bottom: 5px solid #F6AD55; }
                .magnet.other { border-bottom: 5px solid #718096; }

                .magnet.correct { 
                    cursor: default; 
                    box-shadow: none; 
                    border-color: #48BB78;
                    background: #F0FFF4;
                    transform: none !important;
                }
                
                .shaking {
                    animation: shakeMagnet 0.4s ease-in-out;
                }

                @keyframes shakeMagnet {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            </style>

            <div class="sentence-container">
                <div class="game-header">
                    <div style="font-size: 0.9rem; color: #718096;">Sentence ${currentLevel + 1} of ${gameData.length}</div>
                    <div class="legend">
                        <div class="legend-item"><div class="dot noun"></div> Noun</div>
                        <div class="legend-item"><div class="dot verb"></div> Verb</div>
                    </div>
                    <div style="font-weight: 800; color: #2B6CB0;">Score: ${score}</div>
                </div>

                <div class="instruction-title">Snap the words to the rail in order!</div>

                <div class="magnetic-rail">
                    ${data.words.map((_, i) => `<div class="word-slot" id="slot-${i}" data-order="${i}"></div>`).join('')}
                </div>

                <div class="magnet-pool" id="magnet-pool"></div>
            </div>
        `;

        const pool = document.getElementById('magnet-pool');
        const shuffledWords = [...data.words].sort(() => Math.random() - 0.5);

        shuffledWords.forEach(wData => {
            const magnet = document.createElement('div');
            magnet.className = `magnet ${wData.type}`;
            magnet.innerText = wData.text;
            pool.appendChild(magnet);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(magnet, (x, y, el) => {
                    let foundSlot = null;
                    
                    data.words.forEach((_, i) => {
                        const slot = document.getElementById(`slot-${i}`);
                        const rect = slot.getBoundingClientRect();
                        
                        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                            foundSlot = { element: slot, order: i };
                        }
                    });

                    if (foundSlot) {
                        if (wData.order === foundSlot.order) {
                            snapToRail(el, foundSlot.element, x, y);
                        } else {
                            handleWrongSnap(el);
                        }
                    } else {
                        if (el.resetPosition) el.resetPosition();
                    }
                });
            }
        });
    }

    function snapToRail(magnet, slot, x, y) {
        // Prevent double snapping
        if (magnet.classList.contains('correct')) return;

        magnet.classList.add('correct');
        magnet.style.position = 'static';
        magnet.style.transform = 'none';
        
        slot.innerHTML = '';
        slot.appendChild(magnet);
        slot.style.borderBottomColor = "#48BB78";
        
        score += 25;
        correctlyPlaced++;

        if (window.GameHub) {
            window.GameHub.playSound('correct');
            window.GameHub.triggerVFX(x, y);
        }

        if (correctlyPlaced === gameData[currentLevel].words.length) {
            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.querySelector('.sentence-container').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Sentence Architect!", `You built all sentences perfectly! Final Score: ${score}`);
                    }
                }
            }, 1200);
        }
    }

    function handleWrongSnap(magnet) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        magnet.classList.add('shaking');
        magnet.style.borderColor = "#F56565";
        
        setTimeout(() => {
            magnet.classList.remove('shaking');
            magnet.style.borderColor = "#E2E8F0";
            if (magnet.resetPosition) magnet.resetPosition();
        }, 500);
    }
})();