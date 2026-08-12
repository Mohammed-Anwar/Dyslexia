/**
 * Game 9: Phoneme to Written Grapheme (Audio Workbench)
 * Logic: Listen to a sound, assemble the matching letter using pre-cut stroke parts.
 * Dyslexia Focus: Connecting auditory processing with physical letter creation.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let piecesPlaced = 0;

    const THEME_COLOR = "#3CB371";

    const gameData = [
        {
            soundText: "tuh", // Phonetic spelling for synthesis
            letterLabel: "t",
            parts: [
                { id: "stem", label: "Tall Line" },
                { id: "cross", label: "Short Line" }
            ],
            instruction: "Listen to the sound, then build the letter!"
        },
        {
            soundText: "buh",
            letterLabel: "b",
            parts: [
                { id: "stem", label: "Tall Line" },
                { id: "curve", label: "Right Curve" }
            ],
            instruction: "What letter makes this sound? Build it."
        },
        {
            soundText: "eh",
            letterLabel: "e",
            parts: [
                { id: "dash", label: "Small Dash" },
                { id: "big_curve", label: "Big Left Curve" }
            ],
            instruction: "Build the vowel."
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
        piecesPlaced = 0;
        
        stage.innerHTML = `
            <style>
                .workbench-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
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
                .audio-btn {
                    background: ${THEME_COLOR};
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 0 #22543D;
                    transition: transform 0.1s, box-shadow 0.1s;
                }
                .audio-btn:active {
                    transform: translateY(4px);
                    box-shadow: 0 0 0 #22543D;
                }
                
                .workspace-split {
                    display: flex;
                    gap: 30px;
                    width: 100%;
                    margin-top: 20px;
                }
                
                .blueprint-zone {
                    flex: 1;
                    background: white;
                    border: 4px dashed #CBD5E0;
                    border-radius: 20px;
                    min-height: 250px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .blueprint-hint {
                    font-size: 10rem;
                    color: #EDF2F7;
                    font-family: 'Comic Sans MS', cursive;
                    user-select: none;
                }

                .parts-tray {
                    width: 180px;
                    background: #EDF2F7;
                    border-radius: 20px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    align-items: center;
                }
                
                .stroke-piece {
                    width: 100px;
                    background: white;
                    border: 2px solid #A0AEC0;
                    padding: 10px;
                    border-radius: 10px;
                    text-align: center;
                    font-weight: 600;
                    color: #4A5568;
                    cursor: grab;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    touch-action: none;
                }
            </style>

            <div class="workbench-container">
                <div class="header">
                    <span>Task: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <p style="color: #718096; font-weight: 600;">${data.instruction}</p>
                
                <button class="audio-btn" id="play-audio">
                    <span>🔊</span> Play Sound
                </button>

                <div class="workspace-split">
                    <div class="blueprint-zone" id="blueprint">
                        <div class="blueprint-hint">${data.letterLabel}</div>
                    </div>
                    <div class="parts-tray" id="tray">
                        <!-- Pieces injected here -->
                    </div>
                </div>
            </div>
        `;

        setupInteractions(stage, data);
    }

    function setupInteractions(stage, data) {
        const audioBtn = document.getElementById('play-audio');
        const tray = document.getElementById('tray');
        const blueprint = document.getElementById('blueprint');

        // TTS setup
        audioBtn.onclick = () => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(data.soundText);
                utterance.rate = 0.8; // Slow down slightly for clarity
                window.speechSynthesis.speak(utterance);
            }
        };

        const shuffledParts = [...data.parts].sort(() => Math.random() - 0.5);

        shuffledParts.forEach((part, idx) => {
            const piece = document.createElement('div');
            piece.className = 'stroke-piece';
            piece.innerText = part.label;
            piece.id = `piece-${idx}`;
            tray.appendChild(piece);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(piece, (x, y, el) => {
                    const rect = blueprint.getBoundingClientRect();
                    
                    // If dropped anywhere inside the blueprint zone
                    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                        el.style.position = 'static';
                        el.style.transform = 'none';
                        el.style.border = `2px solid ${THEME_COLOR}`;
                        el.style.background = "#F0FFF4";
                        el.style.color = "#22543D";
                        blueprint.appendChild(el);
                        
                        // Disable dragging once placed
                        el.onmousedown = null;
                        el.ontouchstart = null;
                        el.style.cursor = 'default';

                        score += 15;
                        piecesPlaced++;
                        
                        if (window.GameHub) window.GameHub.playSound('click');

                        checkLevelComplete();
                    } else {
                        if (el.resetPosition) el.resetPosition();
                    }
                });
            }
        });
    }

    function checkLevelComplete() {
        const data = gameData[currentLevel];
        if (piecesPlaced === data.parts.length) {
            
            const bp = document.getElementById('blueprint');
            bp.style.backgroundColor = "#F0FFF4";
            bp.style.borderColor = THEME_COLOR;
            
            if (window.GameHub) {
                window.GameHub.playSound('correct');
                const rect = bp.getBoundingClientRect();
                window.GameHub.triggerVFX(rect.left + rect.width/2, rect.top + rect.height/2);
            }

            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.querySelector('.workbench-container').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Sound Smith!", `You built the letters perfectly! Final Score: ${score}`);
                    }
                }
            }, 1200);
        }
    }
})();