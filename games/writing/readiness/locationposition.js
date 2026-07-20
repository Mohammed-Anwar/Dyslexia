/**
 * Game: Object Positioning (Spatial Compass)
 * Filename: the_director.js
 * Logic: Place a character 'Above', 'Below', 'Left', or 'Right' of an object.
 * Dyslexia Focus: Developing spatial orientation to prevent letter flipping (p/q, b/d).
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let feedbackEl = null;

    const gameData = [
        {
            targetObject: "The Tree",
            character: "The Bird",
            icon: "🐦",
            baseObjectIcon: "🌳",
            commands: [
                { position: "above", text: "Place the Bird ABOVE the Tree." },
                { position: "below", text: "Move the Bird BELOW the Tree." },
                { position: "left", text: "Put the Bird to the LEFT of the Tree." },
                { position: "right", text: "Set the Bird to the RIGHT of the Tree." }
            ],
            explanation: "Great orientation! Understanding 'Above' and 'Below' helps us see the difference between 'b' and 'p'."
        },
        {
            targetObject: "The House",
            character: "The Cat",
            icon: "🐱",
            baseObjectIcon: "🏠",
            commands: [
                { position: "left", text: "Place the Cat to the LEFT of the House." },
                { position: "above", text: "Put the Cat ABOVE the House." },
                { position: "right", text: "Move the Cat to the RIGHT of the House." },
                { position: "below", text: "Sit the Cat BELOW the House." }
            ],
            explanation: "Spot on! Mastering Left and Right helps us distinguish 'b' from 'd'."
        }
    ];

    let currentCommandIndex = 0;

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 0;
        score = 0;
        loadLevel(stage);
    };

    function loadLevel(stage) {
        const data = gameData[currentLevel];
        currentCommandIndex = 0;

        stage.innerHTML = `
            <style>
                .spatial-container {
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
                .audio-command-box {
                    background: #F0FFF4;
                    border: 3px solid #68D391;
                    border-radius: 15px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    cursor: pointer;
                    transition: transform 0.2s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .audio-command-box:hover {
                    transform: scale(1.02);
                }
                .play-icon {
                    font-size: 2rem;
                }
                .game-board {
                    position: relative;
                    width: 400px;
                    height: 400px;
                    background: #F7FAFC;
                    border: 4px dashed #CBD5E0;
                    border-radius: 24px;
                    margin: 20px 0;
                }
                .base-object {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 80px;
                    z-index: 1;
                }
                .drop-zone {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s;
                    border: 2px dashed #CBD5E0;
                    background: rgba(255,255,255,0.5);
                }
                .zone-above { top: 20px; left: 150px; }
                .zone-below { bottom: 20px; left: 150px; }
                .zone-left { top: 150px; left: 20px; }
                .zone-right { top: 150px; right: 20px; }
                
                .active-zone { border: 2px solid rgba(66, 153, 225, 0.3); background: rgba(66, 153, 225, 0.05); }

                .character-token {
                    font-size: 60px;
                    cursor: grab;
                    z-index: 10;
                    transition: transform 0.1s;
                    position: absolute;
                    bottom: -80px;
                    left: 170px;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .character-token:active { cursor: grabbing; }
                
                .feedback-box {
                    min-height: 50px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                .btn-next {
                    padding: 12px 35px;
                    background: #48BB78;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: bold;
                    display: none;
                }
            </style>

            <div class="spatial-container">
                <div class="header-stats">
                    <span>Level: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>

                <div class="audio-command-box" id="speakerBox">
                    <span class="play-icon">🔊</span>
                    <h3 id="commandText" style="margin: 0; color: #2F855A;">Click to hear command</h3>
                </div>

                <div class="game-board" id="gameBoard">
                    <div class="base-object">${data.baseObjectIcon}</div>
                    
                    <div class="drop-zone zone-above" data-pos="above"></div>
                    <div class="drop-zone zone-below" data-pos="below"></div>
                    <div class="drop-zone zone-left" data-pos="left"></div>
                    <div class="drop-zone zone-right" data-pos="right"></div>

                    <div id="character" class="character-token">${data.icon}</div>
                </div>

                <div id="feedback" class="feedback-box"></div>
                <button id="nextBtn" class="btn-next">Next Challenge →</button>
            </div>
        `;

        feedbackEl = document.getElementById('feedback');
        setupSpatialLogic();
    }

    function setupSpatialLogic() {
        const char = document.getElementById('character');
        const board = document.getElementById('gameBoard');
        const zones = document.querySelectorAll('.drop-zone');
        const speaker = document.getElementById('speakerBox');
        const cmdText = document.getElementById('commandText');
        const nextBtn = document.getElementById('nextBtn');
        const data = gameData[currentLevel];

        const playCommand = () => {
            const cmd = data.commands[currentCommandIndex];
            cmdText.innerText = cmd.text;
            if (window.GameHub?.speak) {
                window.GameHub.speak(cmd.text);
            }
        };

        speaker.onclick = playCommand;
        
        char.onmousedown = function(event) {
            const charRect = char.getBoundingClientRect();
            let shiftX = event.clientX - charRect.left;
            let shiftY = event.clientY - charRect.top;

            char.style.position = 'fixed';
            char.style.zIndex = 1000;
            char.style.width = charRect.width + 'px';
            char.style.height = charRect.height + 'px';

            function moveAt(clientX, clientY) {
                char.style.left = clientX - shiftX + 'px';
                char.style.top = clientY - shiftY + 'px';
            }

            moveAt(event.clientX, event.clientY);

            function onMouseMove(event) {
                moveAt(event.clientX, event.clientY);
            }

            document.addEventListener('mousemove', onMouseMove);

            char.onmouseup = function(e) {
                document.removeEventListener('mousemove', onMouseMove);
                char.onmouseup = null;

                const cRect = char.getBoundingClientRect();
                let foundZone = null;

                zones.forEach(zone => {
                    const zRect = zone.getBoundingClientRect();
                    // Simple center-point collision for better accuracy
                    const cx = cRect.left + cRect.width / 2;
                    const cy = cRect.top + cRect.height / 2;
                    
                    if (cx > zRect.left && cx < zRect.right && cy > zRect.top && cy < zRect.bottom) {
                        foundZone = zone;
                    }
                });

                if (foundZone && foundZone.dataset.pos === data.commands[currentCommandIndex].position) {
                    score += 10;
                    if (window.GameHub) {
                        window.GameHub.playSound('correct');
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                    }
                    
                    currentCommandIndex++;
                    feedbackEl.style.color = "#2F855A";
                    feedbackEl.innerText = "Excellent positioning!";

                    // Snap to zone inside the board
                    const boardRect = board.getBoundingClientRect();
                    const zRect = foundZone.getBoundingClientRect();
                    
                    char.style.position = 'absolute';
                    char.style.left = (zRect.left - boardRect.left + (zRect.width - cRect.width) / 2) + 'px';
                    char.style.top = (zRect.top - boardRect.top + (zRect.height - cRect.height) / 2) + 'px';
                    board.appendChild(char);

                    if (currentCommandIndex < data.commands.length) {
                        setTimeout(playCommand, 1000);
                    } else {
                        feedbackEl.innerText = data.explanation;
                        nextBtn.style.display = "block";
                    }
                } else {
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    feedbackEl.style.color = "#E53E3E";
                    feedbackEl.innerText = "Try again! Place it exactly in the box.";
                    
                    // Reset to start
                    char.style.position = 'absolute';
                    char.style.left = '170px';
                    char.style.top = 'unset';
                    char.style.bottom = '-80px';
                    board.appendChild(char);
                }
            };
        };

        char.ondragstart = function() { return false; };

        nextBtn.onclick = () => {
            if (currentLevel < gameData.length - 1) {
                currentLevel++;
                loadLevel(board.parentElement.parentElement);
            } else {
                if (window.GameHub?.showComplete) {
                    window.GameHub.showComplete("Spatial Expert!", `Score: ${score}. You have a great sense of direction!`);
                }
            }
        };

        setTimeout(playCommand, 500);
    }
})();