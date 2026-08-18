/**
 * Game: The Sound Builder (Arranging Letters by Sound)
 * Filename: sound_builder.js
 * Logic: User drags letters into boxes in the exact phoneme-by-phoneme order heard. Digraphs are grouped.
 * Dyslexia Focus: Phoneme sequencing, working memory, and recognizing digraphs (two letters, one sound).
 */

(function() {
    let currentLevel = 0;
    let placedCount = 0;

    const gameData = [
        // Standard single-letter phonemes
        { word: "CAT", letters: ["C", "A", "T"], instruction: "Listen to CAT. Drag the sounds in order." },
        { word: "DOG", letters: ["D", "O", "G"], instruction: "Build the word DOG, sound by sound." },
        { word: "FROG", letters: ["F", "R", "O", "G"], instruction: "Four sounds! F-R-O-G." },
        
        // Advanced: Digraphs (Two letters representing one sound)
        { word: "SHIP", letters: ["SH", "I", "P"], instruction: "Advanced: Listen to SH-I-P. Sometimes two letters make one sound!" },
        { word: "FISH", letters: ["F", "I", "SH"], instruction: "Advanced: F-I-SH. Look for the letters that make the 'SH' sound together." },
        { word: "CHOP", letters: ["CH", "O", "P"], instruction: "Advanced: CH-O-P. Find the two letters that make the 'CH' sound!" },
        { word: "MATH", letters: ["M", "A", "TH"], instruction: "Advanced: M-A-TH. Find the 'TH' sound at the end!" },
        { word: "DUCK", letters: ["D", "U", "CK"], instruction: "Advanced: D-U-CK. 'C' and 'K' team up to make one sound here." }
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
        placedCount = 0;
        
        // Shuffle letters for the choice area
        const shuffledLetters = [...data.letters].sort(() => Math.random() - 0.5);

        stage.innerHTML = `
            <style>
                .builder-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
                }
                .instruction-box {
                    background: #FFF5F7;
                    padding: 15px 25px;
                    border-radius: 20px;
                    border: 2px solid #FEB2B2;
                    text-align: center;
                    font-size: 1.2rem;
                    color: #9B2C2C;
                    max-width: 500px;
                    font-weight: bold;
                }
                .target-slots {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                }
                .slot {
                    width: 80px;
                    height: 100px;
                    border: 3px dashed #CBD5E0;
                    border-radius: 15px;
                    background: #F7FAFC;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.2rem; /* Adjusted slightly so digraphs fit well */
                    font-weight: bold;
                    color: #2D3748;
                    transition: all 0.3s;
                }
                .slot.filled {
                    border-style: solid;
                    border-color: #4299E1;
                    background: white;
                    animation: popIn 0.3s ease-out;
                }
                .choices-area {
                    display: flex;
                    gap: 20px;
                    margin-top: 40px;
                    padding: 20px;
                    background: #EDF2F7;
                    border-radius: 20px;
                    min-height: 120px;
                    align-items: center;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .letter-tile {
                    width: 70px;
                    height: 70px;
                    background: white;
                    border: 2px solid #E2E8F0;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem; /* Adjusted for two letters */
                    font-weight: bold;
                    cursor: grab;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    touch-action: none;
                    user-select: none;
                }
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .btn-next {
                    margin-top: 20px;
                    padding: 12px 30px;
                    background: #48BB78;
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s;
                }
                .btn-next.show {
                    opacity: 1;
                    pointer-events: auto;
                }
                .status-row {
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                }
                .level-indicator {
                    background: #EDF2F7;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-weight: bold;
                    color: #4A5568;
                }
            </style>

            <div class="game-stage">
              <div class="builder-container">
                <div class="status-row">
                    <div class="level-indicator">Level ${currentLevel + 1} / ${totalLevels}</div>
                </div>

                <div class="instruction-box">${data.instruction}</div>

                <div class="target-slots" id="slots-container">
                    <!-- Slots generated here -->
                </div>

                <div class="choices-area" id="choices-container">
                    <!-- Letter tiles generated here -->
                </div>

                <button id="next-btn" class="btn-next">Well Done! Next →</button>
              </div>
            </div> 
        `;

        const slotsContainer = document.getElementById('slots-container');
        const choicesContainer = document.getElementById('choices-container');
        const nextBtn = document.getElementById('next-btn');

        // Create Slots based on the phoneme groupings, not individual letters
        data.letters.forEach(() => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slotsContainer.appendChild(slot);
        });

        // Create Letter/Digraph Tiles
        shuffledLetters.forEach((char) => {
            const tile = document.createElement('div');
            tile.className = 'letter-tile';
            tile.innerText = char;
            choicesContainer.appendChild(tile);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(tile, (x, y, element) => {
                    const targetSlot = slotsContainer.children[placedCount];
                    if (!targetSlot) return; // Prevent errors if all slots are filled
                    
                    const rect = targetSlot.getBoundingClientRect();
                    const isInside = (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom);

                    // Check if the placed tile matches the current expected sound block
                    if (isInside && element.innerText === data.letters[placedCount]) {
                        // Correct placement
                        targetSlot.innerText = element.innerText;
                        targetSlot.classList.add('filled');
                        element.style.display = 'none';
                        placedCount++;
                        
                        if (window.GameHub) {
                            window.GameHub.playSound('correct');
                            window.GameHub.triggerVFX(x, y);
                        }

                        if (placedCount === data.letters.length) {
                            speak(data.word);
                            nextBtn.classList.add('show');
                        }
                    } else if (isInside) {
                        // Wrong placement or order
                        if (window.GameHub) window.GameHub.playSound('wrong');
                        if (element.resetPosition) element.resetPosition();
                    }
                });
            } else {
                // Fallback for click if no drag utility is provided
                tile.onclick = () => {
                    if (tile.innerText === data.letters[placedCount]) {
                        const targetSlot = slotsContainer.children[placedCount];
                        targetSlot.innerText = tile.innerText;
                        targetSlot.classList.add('filled');
                        tile.style.visibility = 'hidden';
                        placedCount++;
                        
                        if (placedCount === data.letters.length) {
                            speak(data.word);
                            nextBtn.classList.add('show');
                        }
                    } else {
                        tile.style.background = "#FED7D7";
                        setTimeout(() => tile.style.background = "white", 300);
                    }
                };
            }
        });

        nextBtn.onclick = () => {
            if (currentLevel < totalLevels - 1) {
                currentLevel++;
                loadLevel(stage);
            } else {
                if (window.GameHub?.showComplete) {
                    window.GameHub.showComplete("Master Builder!", "You can sequence sounds and digraphs perfectly!");
                }
            }
        };

        // Automatically read the word when the level loads
        setTimeout(() => speak(data.word), 500);
    }
})();