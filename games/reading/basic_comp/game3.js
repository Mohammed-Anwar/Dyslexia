/**
 * Game: Tree & Branches (General Idea vs. Sub-details)
 * Filename: tree_branches.js
 * Logic: Drag specific details (leaves) to the correct main idea (tree trunk).
 * Dyslexia Focus: Organizational processing and hierarchical classification.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let itemsPlaced = 0;

    const gameData = [
        {
            trunks: [
                { id: "ocean", label: "Ocean", icon: "🌊", color: "#BEE3F8" },
                { id: "desert", label: "Desert", icon: "🏜️", color: "#FEEBC8" }
            ],
            leaves: [
                { id: "l1", label: "Shark", icon: "🦈", belongsTo: "ocean" },
                { id: "l2", label: "Cactus", icon: "🌵", belongsTo: "desert" },
                { id: "l3", label: "Whale", icon: "🐋", belongsTo: "ocean" },
                { id: "l4", label: "Camel", icon: "🐪", belongsTo: "desert" },
                { id: "l5", label: "Coral", icon: "🪸", belongsTo: "ocean" },
                { id: "l6", label: "Sand", icon: "⏳", belongsTo: "desert" }
            ],
            instruction: "Sort the details to the right environment."
        },
        {
            trunks: [
                { id: "sky", label: "Sky", icon: "☁️", color: "#E0F2FE" },
                { id: "garden", label: "Garden", icon: "🏡", color: "#DCFCE7" }
            ],
            leaves: [
                { id: "l1", label: "Cloud", icon: "☁️", belongsTo: "sky" },
                { id: "l2", label: "Flower", icon: "🌻", belongsTo: "garden" },
                { id: "l3", label: "Sun", icon: "☀️", belongsTo: "sky" },
                { id: "l4", label: "Dirt", icon: "🪴", belongsTo: "garden" },
                { id: "l5", label: "Bird", icon: "🐦", belongsTo: "sky" },
                { id: "l6", label: "Worm", icon: "🪱", belongsTo: "garden" }
            ],
            instruction: "Where do these things belong?"
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
                .tree-game-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Open Sans', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    user-select: none;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .instruction {
                    background: #F7FAFC;
                    padding: 10px 20px;
                    border-radius: 10px;
                    border: 1px solid #E2E8F0;
                    color: #2D3748;
                }
                .trunks-area {
                    display: flex;
                    gap: 40px;
                    margin-top: 20px;
                    width: 100%;
                    justify-content: center;
                }
                .trunk {
                    width: 180px;
                    height: 220px;
                    border: 3px dashed #CBD5E0;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 20px;
                    position: relative;
                    transition: all 0.3s;
                }
                .trunk-icon { font-size: 3rem; margin-bottom: 10px; }
                .trunk-label { font-weight: 800; font-size: 1.2rem; color: #2D3748; }
                
                .leaves-area {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    justify-content: center;
                    padding: 20px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    min-height: 120px;
                    width: 100%;
                }
                .leaf {
                    width: 80px;
                    height: 80px;
                    background: #F0FFF4;
                    border: 2px solid #C6F6D5;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: grab;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    touch-action: none;
                }
                .leaf-content {
                    transform: rotate(45deg);
                    font-size: 2rem;
                }
                .leaf:active { cursor: grabbing; }
            </style>

            <div class="tree-game-container">
                <div class="header">
                    <span>Round: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>
                <div class="instruction">${data.instruction}</div>
                
                <div class="trunks-area" id="trunks-area">
                    ${data.trunks.map(t => `
                        <div class="trunk" id="trunk-${t.id}" data-id="${t.id}" style="background-color: ${t.color}">
                            <div class="trunk-icon">${t.icon}</div>
                            <div class="trunk-label">${t.label}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="leaves-area" id="leaves-area">
                    <!-- Leaves will be added here -->
                </div>
            </div>
        `;

        const leavesArea = document.getElementById('leaves-area');
        const shuffledLeaves = [...data.leaves].sort(() => Math.random() - 0.5);

        shuffledLeaves.forEach(leafData => {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.id = leafData.id;
            leaf.innerHTML = `<div class="leaf-content">${leafData.icon}</div>`;
            leavesArea.appendChild(leaf);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(leaf, (x, y, el) => {
                    let dropped = false;
                    data.trunks.forEach(t => {
                        const trunkEl = document.getElementById(`trunk-${t.id}`);
                        const rect = trunkEl.getBoundingClientRect();
                        
                        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                            if (leafData.belongsTo === t.id) {
                                handleMatch(el, trunkEl, x, y);
                                dropped = true;
                            } else {
                                handleMismatch(el);
                                dropped = true;
                            }
                        }
                    });
                    if (!dropped && el.resetPosition) el.resetPosition();
                });
            }
        });
    }

    function handleMatch(leaf, trunk, x, y) {
        leaf.style.display = 'none';
        score += 10;
        itemsPlaced++;
        
        if (window.GameHub) {
            window.GameHub.playSound('correct');
            window.GameHub.triggerVFX(x, y);
        }

        // Visual feedback on trunk
        trunk.style.transform = "scale(1.05)";
        setTimeout(() => trunk.style.transform = "scale(1)", 200);

        // Check if level complete
        if (itemsPlaced === gameData[currentLevel].leaves.length) {
            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.querySelector('.tree-game-container').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Master Organizer!", `You've correctly categorized all details. Final Score: ${score}`);
                    }
                }
            }, 1000);
        }
    }

    function handleMismatch(leaf) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        leaf.style.borderColor = "#F56565";
        leaf.style.background = "#FFF5F5";
        setTimeout(() => {
            if (leaf.resetPosition) leaf.resetPosition();
            leaf.style.borderColor = "#C6F6D5";
            leaf.style.background = "#F0FFF4";
        }, 500);
    }
})();