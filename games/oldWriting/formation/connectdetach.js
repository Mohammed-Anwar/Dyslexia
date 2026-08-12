/**
 * Game 6: Letter Reversal Defense
 * Logic: Sort visually reversible letters (b, d, p, q) into matching color buckets with unique anchor icons.
 * Dyslexia Focus: Directly targeting orthographic reversal tendencies.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let itemsPlaced = 0;

    const THEME_COLOR = "#3CB371"; // Green theme

    const gameData = [
        {
            bins: [
                { id: "b", label: "b", icon: "🦇", hint: "Bat before ball" },
                { id: "d", label: "d", icon: "🚪", hint: "Doorknob then door" }
            ],
            letters: ["b", "d", "d", "b", "b", "d"],
            instruction: "Sort the 'b' and 'd' letters into the correct bins."
        },
        {
            bins: [
                { id: "p", label: "p", icon: "🐷", hint: "Pig pointing down" },
                { id: "q", label: "q", icon: "👑", hint: "Queen's hair" }
            ],
            letters: ["p", "q", "p", "p", "q", "q"],
            instruction: "Sort the 'p' and 'q' letters. Watch the tails!"
        },
        {
            bins: [
                { id: "b", label: "b", icon: "🦇", hint: "Bat" },
                { id: "d", label: "d", icon: "🚪", hint: "Door" },
                { id: "p", label: "p", icon: "🐷", hint: "Pig" },
                { id: "q", label: "q", icon: "👑", hint: "Queen" }
            ],
            letters: ["b", "q", "d", "p", "d", "b", "q", "p"],
            instruction: "The ultimate challenge! Sort all four letters."
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
        itemsPlaced = 0;
        
        stage.innerHTML = `
            <style>
                .reversal-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    user-select: none;
                }
                .header-stats {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .instruction-box {
                    background: #F0FFF4;
                    border-left: 5px solid ${THEME_COLOR};
                    padding: 15px 25px;
                    border-radius: 8px;
                    color: #22543D;
                    font-size: 1.1rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .bins-area {
                    display: flex;
                    gap: 30px;
                    margin-top: 10px;
                    justify-content: center;
                    width: 100%;
                    flex-wrap: wrap;
                }
                .sort-bin {
                    width: 140px;
                    height: 180px;
                    background: white;
                    border: 4px solid #E2E8F0;
                    border-radius: 20px 20px 10px 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    transition: all 0.3s;
                    box-shadow: 0 8px 0 #E2E8F0;
                }
                .bin-header {
                    background: ${THEME_COLOR};
                    color: white;
                    width: 100%;
                    text-align: center;
                    padding: 10px;
                    border-radius: 14px 14px 0 0;
                    font-size: 2rem;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                }
                .bin-body {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    color: #718096;
                    text-align: center;
                    padding: 10px;
                }
                
                .letters-pool {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    justify-content: center;
                    padding: 25px;
                    background: #EDF2F7;
                    border-radius: 20px;
                    min-height: 120px;
                    width: 100%;
                    box-sizing: border-box;
                    margin-top: 20px;
                }
                
                .draggable-letter {
                    width: 60px;
                    height: 60px;
                    background: white;
                    border: 2px solid #CBD5E0;
                    border-radius: 12px;
                    font-size: 2.5rem;
                    font-weight: 600;
                    color: #2D3748;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: grab;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    touch-action: none;
                    z-index: 10;
                    font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; /* Dyslexia friendly fallback */
                }
                .draggable-letter:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }
            </style>

            <div class="reversal-container">
                <div class="header-stats">
                    <span>Round: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <div class="instruction-box">${data.instruction}</div>
                
                <div class="bins-area" id="bins-area">
                    ${data.bins.map(b => `
                        <div class="sort-bin" id="bin-${b.id}" data-id="${b.id}">
                            <div class="bin-header">
                                <span>${b.label}</span>
                                <span style="font-size: 1.5rem">${b.icon}</span>
                            </div>
                            <div class="bin-body">${b.hint}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="letters-pool" id="letters-pool"></div>
            </div>
        `;

        const pool = document.getElementById('letters-pool');
        const shuffledLetters = [...data.letters].sort(() => Math.random() - 0.5);

        shuffledLetters.forEach((letterChar, idx) => {
            const letterEl = document.createElement('div');
            letterEl.className = 'draggable-letter';
            letterEl.innerText = letterChar;
            letterEl.id = `letter-${idx}`;
            pool.appendChild(letterEl);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(letterEl, (x, y, el) => {
                    let matched = false;
                    
                    data.bins.forEach(b => {
                        const binEl = document.getElementById(`bin-${b.id}`);
                        const rect = binEl.getBoundingClientRect();
                        
                        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                            if (letterChar === b.id) {
                                handleMatch(el, binEl, x, y);
                                matched = true;
                            } else {
                                handleMismatch(el, binEl);
                                matched = true;
                            }
                        }
                    });

                    if (!matched && el.resetPosition) el.resetPosition();
                });
            }
        });
    }

    function handleMatch(letter, bin, x, y) {
        letter.style.display = 'none'; // visually drop it inside
        score += 15;
        itemsPlaced++;
        
        if (window.GameHub) {
            window.GameHub.playSound('correct');
            window.GameHub.triggerVFX(x, y);
        }

        // Visual pop on bin
        bin.style.transform = "translateY(5px)";
        bin.style.boxShadow = "0 3px 0 #E2E8F0";
        setTimeout(() => {
            bin.style.transform = "none";
            bin.style.boxShadow = "0 8px 0 #E2E8F0";
        }, 150);

        if (itemsPlaced === gameData[currentLevel].letters.length) {
            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.querySelector('.reversal-container').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Reversal Master!", `You've conquered the tricky letters! Final Score: ${score}`);
                    }
                }
            }, 800);
        }
    }

    function handleMismatch(letter, bin) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        
        letter.style.borderColor = "#F56565";
        letter.style.color = "#C53030";
        letter.style.backgroundColor = "#FFF5F5";
        
        // Shake bin
        bin.style.transform = "translateX(-5px)";
        setTimeout(() => bin.style.transform = "translateX(5px)", 100);
        setTimeout(() => bin.style.transform = "none", 200);

        setTimeout(() => {
            if (letter.resetPosition) letter.resetPosition();
            letter.style.borderColor = "#CBD5E0";
            letter.style.color = "#2D3748";
            letter.style.backgroundColor = "white";
        }, 500);
    }
})();