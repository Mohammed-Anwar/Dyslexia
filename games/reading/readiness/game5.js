/**
 * Game 5: Categorization Station (تحديد العلاقات بين الأشياء)
 * Filename: games/read_d1_g5.js
 * Logic: Drag items into the correct categories (e.g., Hot vs Cold, Big vs Small).
 * Dyslexia Focus: Categorization and abstract reasoning.
 */

(function() {
    let currentLevel = 1;
    const totalLevels = 15;
    let score = 0;

    const gameData = [
        {
            categoryA: { name: "Hot", icon: "🔥", color: "#FEEBC8" },
            categoryB: { name: "Cold", icon: "❄️", color: "#E0F2FE" },
            items: [
                { icon: "☀️", belongsTo: "Hot" },
                { icon: "☕", belongsTo: "Hot" },
                { icon: "🍦", belongsTo: "Cold" },
                { icon: "🧊", belongsTo: "Cold" },
                { icon: "🌋", belongsTo: "Hot" },
                { icon: "⛄", belongsTo: "Cold" }
            ]
        },
        {
            categoryA: { name: "Big", icon: "🐘", color: "#E2E8F0" },
            categoryB: { name: "Small", icon: "🐜", color: "#F7FAFC" },
            items: [
                { icon: "🐳", belongsTo: "Big" },
                { icon: "🐭", belongsTo: "Small" },
                { icon: "🏢", belongsTo: "Big" },
                { icon: "🐝", belongsTo: "Small" },
                { icon: "🚢", belongsTo: "Big" },
                { icon: "🐞", belongsTo: "Small" }
            ]
        },
        {
            categoryA: { name: "Fly", icon: "☁️", color: "#EBF8FF" },
            categoryB: { name: "Swim", icon: "🌊", color: "#E0F2F1" },
            items: [
                { icon: "🦅", belongsTo: "Fly" },
                { icon: "🐠", belongsTo: "Swim" },
                { icon: "🚁", belongsTo: "Fly" },
                { icon: "🦈", belongsTo: "Swim" },
                { icon: "🦋", belongsTo: "Fly" },
                { icon: "🐙", belongsTo: "Swim" }
            ]
        }
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        
        currentLevel = 1;
        score = 0;
        loadLevel(stage);
    };

    function loadLevel(stage) {
        // Cycle through gameData based on level
        const setIndex = Math.floor((currentLevel - 1) / 5) % gameData.length;
        const currentData = gameData[setIndex];
        
        // Pick a random item from the current set
        const currentItem = currentData.items[Math.floor(Math.random() * currentData.items.length)];

        stage.innerHTML = `
            <style>
                .game-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 10px;
                    font-family: system-ui, -apple-system, sans-serif;
                    animation: fadeIn 0.5s ease;
                }

                .instruction-text {
                    font-size: 1.3rem;
                    color: #2D3748;
                    font-weight: 700;
                    text-align: center;
                }

                .level-indicator {
                    font-size: 14px;
                    font-weight: bold;
                    color: #718096;
                    background: #EDF2F7;
                    padding: 4px 12px;
                    border-radius: 20px;
                }

                .buckets-container {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    gap: 20px;
                    margin-top: 10px;
                }

                .bucket {
                    flex: 1;
                    height: 150px;
                    border: 3px dashed #CBD5E0;
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .bucket-icon { font-size: 40px; margin-bottom: 5px; }
                .bucket-label { font-weight: bold; color: #4A5568; }

                .item-source {
                    width: 120px;
                    height: 120px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    border: 4px solid #EDF2F7;
                    margin: 20px 0;
                }

                .draggable-item {
                    font-size: 60px;
                    cursor: grab;
                    touch-action: none;
                    z-index: 100;
                }

                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); }
                }
            </style>

            <div class="game-wrapper">
                <div class="level-indicator">Level ${currentLevel} / ${totalLevels}</div>
                <div class="instruction-text">Where does this belong?</div>

                <div class="item-source">
                    <div id="drag-item" class="draggable-item" data-belongs="${currentItem.belongsTo}">${currentItem.icon}</div>
                </div>

                <div class="buckets-container">
                    <div class="bucket" id="bucket-A" data-name="${currentData.categoryA.name}" style="background: ${currentData.categoryA.color}">
                        <div class="bucket-icon">${currentData.categoryA.icon}</div>
                        <div class="bucket-label">${currentData.categoryA.name}</div>
                    </div>
                    <div class="bucket" id="bucket-B" data-name="${currentData.categoryB.name}" style="background: ${currentData.categoryB.color}">
                        <div class="bucket-icon">${currentData.categoryB.icon}</div>
                        <div class="bucket-label">${currentData.categoryB.name}</div>
                    </div>
                </div>
            </div>
        `;

        const dragEl = document.getElementById('drag-item');
        const bucketA = document.getElementById('bucket-A');
        const bucketB = document.getElementById('bucket-B');

        if (window.GameHub?.utils?.makeDraggable) {
            window.GameHub.utils.makeDraggable(dragEl, (x, y, element) => {
                const rectA = bucketA.getBoundingClientRect();
                const rectB = bucketB.getBoundingClientRect();
                const targetName = element.dataset.belongs;

                const inA = (x > rectA.left && x < rectA.right && y > rectA.top && y < rectA.bottom);
                const inB = (x > rectB.left && x < rectB.right && y > rectB.top && y < rectB.bottom);

                if (inA && targetName === bucketA.dataset.name) {
                    handleSuccess(element, bucketA, stage, x, y);
                } else if (inB && targetName === bucketB.dataset.name) {
                    handleSuccess(element, bucketB, stage, x, y);
                } else {
                    handleFailure(element);
                }
            });
        }
    }

    function handleSuccess(element, bucket, stage, x, y) {
        element.style.display = "none";
        bucket.style.transform = "scale(1.1)";
        bucket.style.borderColor = "#48BB78";
        
        score++;
        if (window.GameHub) {
            window.GameHub.triggerVFX(x, y);
            window.GameHub.playSound('correct');
        }

        setTimeout(() => {
            if (currentLevel < totalLevels) {
                currentLevel++;
                loadLevel(stage);
            } else {
                if (window.GameHub?.showComplete) {
                    window.GameHub.showComplete("Categorization Expert!", "You sorted all items perfectly!");
                }
            }
        }, 1000);
    }

    function handleFailure(element) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        element.style.transition = "transform 0.3s ease";
        
        if (element.resetPosition) {
            element.resetPosition();
        } else {
            element.style.transform = "translate3d(0,0,0)";
        }
    }
})();