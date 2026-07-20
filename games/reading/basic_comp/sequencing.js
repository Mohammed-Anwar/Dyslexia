/**
 * Game: Story Slides (Sequencing Events)
 * Filename: story_slides.js
 * Logic: Drag panels from a comic strip into the correct chronological order.
 * Dyslexia Focus: Temporal sequencing and narrative logic.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let correctlyPlaced = 0;

    const gameData = [
        {
            storyTitle: "Growing a Flower",
            panels: [
                { id: "p1", order: 0, icon: "🌱", text: "Plant seed" },
                { id: "p2", order: 1, icon: "💧", text: "Water it" },
                { id: "p3", order: 2, icon: "☀️", text: "Sun shines" },
                { id: "p4", order: 3, icon: "🌻", text: "Flower blooms" }
            ]
        },
        {
            storyTitle: "Baking a Cake",
            panels: [
                { id: "p1", order: 0, icon: "🥣", text: "Mix batter" },
                { id: "p2", order: 1, icon: "🔥", text: "Bake in oven" },
                { id: "p3", order: 2, icon: "🍰", text: "Add frosting" },
                { id: "p4", order: 3, icon: "🍴", text: "Eat a slice" }
            ]
        },
        {
            storyTitle: "Building a Snowman",
            panels: [
                { id: "p1", order: 0, icon: "❄️", text: "Roll snow" },
                { id: "p2", order: 1, icon: "🥕", text: "Add nose" },
                { id: "p3", order: 2, icon: "🧣", text: "Put on scarf" },
                { id: "p4", order: 3, icon: "☃️", text: "Finished!" }
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
                .story-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .game-header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .story-title {
                    font-size: 1.5rem;
                    color: #2D3748;
                    margin: 10px 0;
                }
                .drop-zones {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                }
                .slot {
                    width: 130px;
                    height: 160px;
                    border: 3px dashed #CBD5E0;
                    border-radius: 15px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #F7FAFC;
                    position: relative;
                }
                .slot-number {
                    position: absolute;
                    top: 5px;
                    left: 10px;
                    font-size: 0.8rem;
                    color: #A0AEC0;
                    font-weight: bold;
                }
                .panel-pool {
                    display: flex;
                    gap: 15px;
                    margin-top: 40px;
                    padding: 20px;
                    background: #EDF2F7;
                    border-radius: 20px;
                    min-height: 180px;
                    width: 100%;
                    justify-content: center;
                }
                .panel {
                    width: 120px;
                    height: 150px;
                    background: white;
                    border: 2px solid #E2E8F0;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: grab;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    touch-action: none;
                    z-index: 10;
                }
                .panel-icon { font-size: 3rem; }
                .panel-text { font-size: 0.8rem; font-weight: bold; color: #718096; margin-top: 5px; }
                .panel.correct { border-color: #48BB78; background: #F0FFF4; cursor: default; }
            </style>

            <div class="story-container">
                <div class="game-header">
                    <span>Story ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>
                <h2 class="story-title">${data.storyTitle}</h2>
                <p>Drag the panels into the correct order (1 to 4).</p>

                <div class="drop-zones">
                    ${[0, 1, 2, 3].map(i => `
                        <div class="slot" id="slot-${i}" data-order="${i}">
                            <span class="slot-number">${i + 1}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="panel-pool" id="panel-pool">
                    <!-- Panels loaded here -->
                </div>
            </div>
        `;

        const pool = document.getElementById('panel-pool');
        const shuffledPanels = [...data.panels].sort(() => Math.random() - 0.5);

        shuffledPanels.forEach(pData => {
            const panel = document.createElement('div');
            panel.className = 'panel';
            panel.id = pData.id;
            panel.innerHTML = `
                <div class="panel-icon">${pData.icon}</div>
                <div class="panel-text">${pData.text}</div>
            `;
            pool.appendChild(panel);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(panel, (x, y, el) => {
                    let matched = false;
                    [0, 1, 2, 3].forEach(i => {
                        const slot = document.getElementById(`slot-${i}`);
                        const rect = slot.getBoundingClientRect();
                        
                        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                            if (pData.order === i) {
                                snapToSlot(el, slot, x, y);
                                matched = true;
                            } else {
                                handleWrongOrder(el);
                                matched = true;
                            }
                        }
                    });
                    if (!matched && el.resetPosition) el.resetPosition();
                });
            }
        });
    }

    function snapToSlot(panel, slot, x, y) {
        panel.classList.add('correct');
        panel.style.position = 'static';
        panel.style.transform = 'none';
        slot.innerHTML = '';
        slot.appendChild(panel);
        panel.style.cursor = 'default';
        panel.onmousedown = null; // Disable further dragging

        score += 20;
        correctlyPlaced++;

        if (window.GameHub) {
            window.GameHub.playSound('correct');
            window.GameHub.triggerVFX(x, y);
        }

        if (correctlyPlaced === 4) {
            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.querySelector('.story-container').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Master Storyteller!", `You've sequenced all stories perfectly! Final Score: ${score}`);
                    }
                }
            }, 1200);
        }
    }

    function handleWrongOrder(panel) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        panel.style.borderColor = "#F56565";
        setTimeout(() => {
            if (panel.resetPosition) panel.resetPosition();
            panel.style.borderColor = "#E2E8F0";
        }, 500);
    }
})();