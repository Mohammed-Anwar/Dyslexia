/**
 * Game: Element Spacing (The Gap Master)
 * Filename: the_director.js
 * Logic: Adjust the distance between objects to match a target reference.
 * Dyslexia Focus: Developing awareness of word and letter spacing (preventing crowding).
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const gameData = [
        {
            title: "Equal Gaps",
            description: "Slide the middle stars so the gaps between all three are exactly the same!",
            items: ["⭐", "⭐", "⭐"],
            targetGap: 140,
            tolerance: 20,
            explanation: "Spot on! Even spacing helps our eyes track lines of text."
        },
        {
            title: "Wide vs. Narrow",
            description: "The reference shows wide spacing. Move the balloons to match!",
            items: ["🎈", "🎈"],
            targetGap: 280,
            tolerance: 20,
            explanation: "Great job! Wide spacing prevents letters from 'blurring' together."
        },
        {
            title: "The Triple Jump",
            description: "Space out these three frogs perfectly. Don't let them get crowded!",
            items: ["🐸", "🐸", "🐸"],
            targetGap: 160,
            tolerance: 15,
            explanation: "Perfect! Keeping letters separated makes sounds easier to identify."
        },
        {
            title: "Tight Squeeze",
            description: "These cars need a specific close gap. Match the reference!",
            items: ["🚗", "🚗", "🚗"],
            targetGap: 100,
            tolerance: 10,
            explanation: "Precision! This helps you spot differences in similar words."
        },
        {
            title: "The Long Road",
            description: "Move the rocket far away from the moon!",
            items: ["🌙", "🚀"],
            targetGap: 350,
            tolerance: 25,
            explanation: "Wonderful! Large spaces help us identify sentence boundaries."
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
                .spacing-container {
                    display: flex; flex-direction: column; align-items: center; gap: 15px;
                    padding: 20px; font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 900px; margin: 0 auto; user-select: none;
                }
                .status-bar {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    color: #718096;
                    font-weight: bold;
                    padding: 0 5px;
                    margin-bottom: 5px;
                }
                
                .workspace {
                    display: flex; flex-direction: column; gap: 20px; align-items: center; 
                    background: white; padding: 40px; border-radius: 20px; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 4px solid #EDF2F7; width: 100%;
                    box-sizing: border-box;
                }

                .reference-box {
                    padding: 15px; background: #F7FAFC; border: 2px solid #E2E8F0;
                    border-radius: 12px; width: 100%; text-align: center; 
                    overflow: hidden; box-sizing: border-box;
                }
                .ref-label { font-size: 0.8rem; color: #718096; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
                
                .display-row {
                    display: flex; justify-content: center; align-items: center;
                    height: 100px; position: relative; width: 100%;
                }

                .interactive-area {
                    width: 100%; height: 140px; background: #FFF; border: 2px dashed #CBD5E0;
                    border-radius: 15px; position: relative; margin-top: 10px;
                    overflow: hidden; box-sizing: border-box;
                }

                .draggable-item {
                    position: absolute; font-size: 50px; cursor: ew-resize;
                    top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center;
                    width: 70px; height: 70px;
                    z-index: 10;
                }

                .static-item { 
                    font-size: 50px; position: absolute; top: 50%; transform: translateY(-50%); 
                    width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;
                    border: 2px solid #E2E8F0; border-radius: 50%; background: #F7FAFC;
                }

                .feedback-box { min-height: 40px; text-align: center; font-weight: 600; font-size: 1.1rem; margin-top: 10px; }
                .btn-check { 
                    padding: 12px 35px; background: #4299E1; color: white; border: none; 
                    border-radius: 12px; cursor: pointer; font-weight: bold; margin-top: 10px; 
                    transition: background 0.2s; z-index: 20; 
                }
                .btn-check:hover:not(:disabled) { background: #3182CE; }
                .btn-check:disabled { opacity: 0.5; cursor: not-allowed; }
                
                .success-highlight {
                    border-color: #48BB78 !important;
                    background-color: #F0FFF4 !important;
                }
            </style>

            <div class="spacing-container">
                <div class="status-bar">
                    <span>Level: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>
                <div style="text-align: center;">
                    <h2 style="margin: 0; color: #2D3748;">${data.title}</h2>
                    <p style="color: #718096; font-size: 0.95rem;">${data.description}</p>
                </div>

                <div class="workspace">
                    <div class="reference-box">
                        <div class="ref-label">Target Spacing (Goal)</div>
                        <div class="display-row">
                            ${data.items.map((icon, i) => `
                                <span style="position: absolute; left: ${50 + (i * data.targetGap)}px; font-size: 50px; opacity: 0.15; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;">${icon}</span>
                            `).join('')}
                        </div>
                    </div>

                    <div class="interactive-area" id="gameArea">
                        <div class="static-item" style="left: 50px;" title="Anchor item">${data.items[0]}</div>
                        ${data.items.slice(1).map((icon, i) => `
                            <div class="draggable-item" data-index="${i+1}" style="left: ${150 + (i * 100)}px;">${icon}</div>
                        `).join('')}
                    </div>
                    
                    <button id="checkBtn" class="btn-check">Check Spacing</button>
                    <div id="feedback" class="feedback-box"></div>
                </div>
            </div>
        `;

        setupSpacingLogic(stage);
    }

    function setupSpacingLogic(stage) {
        const area = stage.querySelector('#gameArea');
        const draggables = stage.querySelectorAll('.draggable-item');
        const checkBtn = stage.querySelector('#checkBtn');
        const feedback = stage.querySelector('#feedback');
        const data = gameData[currentLevel];

        draggables.forEach(item => {
            const startDrag = (event) => {
                event.preventDefault();
                const areaRect = area.getBoundingClientRect();
                const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
                const itemRect = item.getBoundingClientRect();
                let shiftX = clientX - itemRect.left;

                const onMove = (moveEvent) => {
                    const currentX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
                    let newLeft = currentX - areaRect.left - shiftX;
                    
                    // Boundary checks: 5px padding to prevent icons half-clipping
                    const minL = 5;
                    const maxL = areaRect.width - 75; // 70 width + 5 padding
                    
                    if (newLeft < minL) newLeft = minL;
                    if (newLeft > maxL) newLeft = maxL;
                    
                    item.style.left = newLeft + 'px';
                    feedback.innerText = ""; 
                };

                const endDrag = () => {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', endDrag);
                    document.removeEventListener('touchmove', onMove);
                    document.removeEventListener('touchend', endDrag);
                };

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', endDrag);
                document.addEventListener('touchmove', onMove, { passive: false });
                document.addEventListener('touchend', endDrag);
            };

            item.onmousedown = startDrag;
            item.ontouchstart = startDrag;
        });

        checkBtn.addEventListener('click', (e) => {
            const positions = [50]; 
            draggables.forEach(d => {
                positions.push(parseInt(d.style.left));
            });

            // Always compare based on sorted order so user can drag any item anywhere
            positions.sort((a, b) => a - b);

            let allCorrect = true;
            for (let i = 1; i < positions.length; i++) {
                const actualGap = positions[i] - positions[i-1];
                if (Math.abs(actualGap - data.targetGap) > data.tolerance) {
                    allCorrect = false;
                    break;
                }
            }

            if (allCorrect) {
                score += 20;
                feedback.style.color = "#48BB78";
                feedback.innerText = "✓ Perfect! Next challenge loading...";
                checkBtn.disabled = true;
                area.classList.add('success-highlight');
                
                if (window.GameHub) {
                    window.GameHub.playSound('correct');
                    window.GameHub.triggerVFX(e.clientX, e.clientY);
                }

                setTimeout(() => {
                    if (currentLevel < gameData.length - 1) {
                        currentLevel++;
                        loadLevel(stage);
                    } else if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Spacing Expert!", `Final Score: ${score}. Great eyes!`);
                    }
                }, 2000);
            } else {
                feedback.style.color = "#E53E3E";
                feedback.innerText = "Not quite. Match the positions of the shadows!";
                if (window.GameHub) window.GameHub.playSound('wrong');
                
                checkBtn.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(5px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 200 });
            }
        });
    }
})();