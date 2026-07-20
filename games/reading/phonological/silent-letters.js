/**
 * Game: Ghost Letters (Silent Letters)
 * Filename: ghost_letters.js
 * Logic: Silent letters are shown as "ghosts" (transparent). Tapping them makes them disappear.
 * Dyslexia Focus: Visualizing and memorizing irregular spelling patterns.
 */

(function() {
    let currentLevel = 0;
    let ghostsFound = [];

    const gameData = [
        { word: "KNIGHT", silentIndices: [0, 3, 4], display: "KNIGHT", instruction: "Find the 3 silent ghosts in KNIGHT!" },
        { word: "WRIST", silentIndices: [0], display: "WRIST", instruction: "Which letter is silent in WRIST?" },
        { word: "LAMB", silentIndices: [3], display: "LAMB", instruction: "The B is a ghost! Tap it." },
        { word: "GHOST", silentIndices: [1], display: "GHOST", instruction: "Find the silent H!" },
        { word: "KNEE", silentIndices: [0], display: "KNEE", instruction: "Tap the silent K." },
        { word: "COMB", silentIndices: [3], display: "COMB", instruction: "Tap the silent B." },
        { word: "WRITE", silentIndices: [0], display: "WRITE", instruction: "Find the ghost at the start!" },
        { word: "GNOME", silentIndices: [0, 4], display: "GNOME", instruction: "Two ghosts here! G and E." },
        { word: "WALK", silentIndices: [2], display: "WALK", instruction: "The L is silent. Tap it!" },
        { word: "CASTLE", silentIndices: [3], display: "CASTLE", instruction: "Find the silent T in the middle." }
    ];

    const totalLevels = gameData.length;

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 0;
        loadLevel(stage);
    };

    function speak(text) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 0.8;
        window.speechSynthesis.speak(utter);
    }

    function loadLevel(stage) {
        const data = gameData[currentLevel];
        ghostsFound = [];
        
        stage.innerHTML = `
            <style>
                /* Page wrapper centers the game both vertically and horizontally */
                .game-stage {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 60vh;
                    padding: 20px;
                    box-sizing: border-box;
                }
                .ghost-container {
                    max-width: 820px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 28px;
                    padding: 24px;
                    font-family: 'OpenDyslexic', 'Helvetica Neue', Arial, sans-serif;
                    box-sizing: border-box;
                }
                .instruction-box {
                    background: #EBF4FF;
                    padding: 16px 22px;
                    border-radius: 16px;
                    border: 2px solid #63B3ED;
                    text-align: center;
                    font-size: 1.1rem;
                    color: #2B6CB0;
                    width: 100%;
                }
                .word-display {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #F7FAFC; /* lighter, more readable */
                    padding: 30px 40px;
                    border-radius: 18px;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
                    gap: 8px;
                    width: 100%;
                    justify-content: center;
                }
                .letter-box {
                    font-size: 3.6rem;
                    font-weight: 900;
                    color: #2D3748;
                    position: relative;
                    cursor: default;
                    transition: all 0.3s ease;
                    padding: 6px 8px;
                }
                .is-ghost {
                    opacity: 0.45;
                    cursor: pointer;
                    filter: none;
                    color: #718096;
                }
                .is-ghost:hover {
                    opacity: 0.75;
                    transform: scale(1.08);
                }
                .ghost-vanished {
                    opacity: 0 !important;
                    transform: translateY(-30px) scale(0.6) !important;
                    width: 0;
                    margin: 0;
                    pointer-events: none;
                    transition: all 0.4s ease;
                }
                .btn-next {
                    padding: 12px 34px;
                    font-size: 1.05rem;
                    background: #ED64A6;
                    color: white;
                    border: none;
                    border-radius: 40px;
                    cursor: pointer;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(6px);
                    transition: all 0.25s ease;
                }
                .btn-next.show {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0);
                }
            </style>

            <div class="game-stage">
              <div class="ghost-container">
                <div class="status-row">
                    <div class="level-indicator">Level ${currentLevel + 1} / ${totalLevels}</div>
                </div>

                <div class="instruction-box">
                    <strong>Level ${currentLevel + 1}:</strong><br>
                    ${data.instruction}
                </div>

                <div class="word-display" id="word-display">
                    <!-- Letters generated by JS -->
                </div>

                <button id="next-btn" class="btn-next">Spooky! Next Word →</button>
              </div>
            </div>
        `;

        const display = document.getElementById('word-display');
        const nextBtn = document.getElementById('next-btn');

        data.display.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'letter-box';
            span.innerText = char;

            if (data.silentIndices.includes(index)) {
                span.classList.add('is-ghost');
                span.onclick = (e) => {
                    if (ghostsFound.includes(index)) return;
                    
                    ghostsFound.push(index);
                    span.classList.add('ghost-vanished');
                    
                    if (window.GameHub) {
                        window.GameHub.playSound('correct');
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                    }

                    if (ghostsFound.length === data.silentIndices.length) {
                        setTimeout(() => {
                            speak(data.word);
                            nextBtn.classList.add('show');
                        }, 600);
                    }
                };
            }

            display.appendChild(span);
        });

        // Intro sound
        setTimeout(() => speak(data.word), 500);

        nextBtn.onclick = () => {
            if (currentLevel < totalLevels - 1) {
                currentLevel++;
                loadLevel(stage);
            } else {
                if (window.GameHub?.showComplete) {
                    window.GameHub.showComplete("Ghost Hunter!", "You found all the silent letters!");
                }
            }
        };
    }
})();