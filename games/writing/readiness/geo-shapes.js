/**
 * Game: Geometric Shape Matching (Shape Sorter)
 * Filename: the_director.js
 * Logic: Drag 2D shapes into their corresponding holes based on angles.
 * Dyslexia Focus: Visual discrimination of geometric forms.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let matchedCount = 0;

    const gameData = [
        {
            title: "Basic Shapes",
            description: "Match the shapes to their outlines. Look closely at the corners!",
            shapes: [
                { id: "square", icon: "■", color: "#4299E1", label: "Square" },
                { id: "triangle", icon: "▲", color: "#F6AD55", label: "Triangle" },
                { id: "circle", icon: "●", color: "#F687B3", label: "Circle" }
            ],
            explanation: "Excellent! Recognizing sharp corners vs. curves is the first step in letter decoding."
        },
        {
            title: "Complex Polygons",
            description: "These shapes have more sides! Can you find where they fit?",
            shapes: [
                { id: "pentagon", icon: "⬠", color: "#48BB78", label: "Pentagon" },
                { id: "hexagon", icon: "⬢", color: "#9F7AEA", label: "Hexagon" },
                { id: "diamond", icon: "◆", color: "#F56565", label: "Diamond" }
            ],
            explanation: "Fantastic! Identifying complex angles builds the visual stamina needed for reading long words."
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
        matchedCount = 0;

        stage.innerHTML = `
            <style>
                .sorter-container {
                    display: flex; flex-direction: column; align-items: center; gap: 20px;
                    padding: 20px; font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 800px; margin: 0 auto; user-select: none;
                }
                .header-stats { display: flex; justify-content: space-between; width: 100%; font-weight: bold; color: #4A5568; }
                
                .sorter-layout {
                    display: flex; flex-direction: column; gap: 40px; align-items: center; 
                    background: white; padding: 40px; border-radius: 20px; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 4px solid #EDF2F7; width: 100%;
                }

                .holes-container {
                    display: flex; justify-content: space-around; width: 100%; gap: 20px;
                }

                .hole {
                    width: 100px; height: 100px; border-radius: 15px;
                    background: #E2E8F0; border: 4px dashed #CBD5E0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 60px; color: rgba(203, 213, 224, 0.5);
                    transition: all 0.3s;
                }

                .hole.highlight { border-color: #4299E1; background: #EBF8FF; }

                .shapes-bench {
                    display: flex; justify-content: space-around; width: 100%; 
                    padding: 20px; background: #F7FAFC; border-radius: 15px; min-height: 120px;
                }

                .draggable-shape {
                    width: 80px; height: 80px; font-size: 60px; cursor: grab;
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.1s; z-index: 10;
                }
                .draggable-shape:active { cursor: grabbing; transform: scale(1.1); }

                .feedback-box { min-height: 50px; text-align: center; font-weight: 600; font-size: 1.2rem; }
                .btn-next { padding: 12px 35px; background: #48BB78; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; display: none; }
            </style>

            <div class="sorter-container">
                <div class="header-stats">
                    <span>Level: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>
                <div style="text-align: center;">
                    <h2 style="margin: 0; color: #2D3748;">${data.title}</h2>
                    <p style="color: #718096;">${data.description}</p>
                </div>

                <div class="sorter-layout">
                    <div class="holes-container">
                        ${data.shapes.map(s => `<div class="hole" data-id="${s.id}">${s.icon}</div>`).join('')}
                    </div>

                    <div class="shapes-bench" id="bench">
                        ${data.shapes.map(s => `
                            <div class="draggable-shape" data-id="${s.id}" style="color: ${s.color};">
                                ${s.icon}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div id="feedback" class="feedback-box"></div>
                <button id="nextBtn" class="btn-next">Next Level →</button>
            </div>
        `;

        setupDragging(stage);
    }

    function setupDragging(stage) {
        const draggables = stage.querySelectorAll('.draggable-shape');
        const holes = stage.querySelectorAll('.hole');
        const feedback = stage.querySelector('#feedback');
        const nextBtn = stage.querySelector('#nextBtn');
        const data = gameData[currentLevel];

        draggables.forEach(item => {
            item.onmousedown = function(event) {
                const rect = item.getBoundingClientRect();
                let shiftX = event.clientX - rect.left;
                let shiftY = event.clientY - rect.top;

                item.style.position = 'fixed';
                item.style.zIndex = 1000;
                document.body.append(item);

                function moveAt(clientX, clientY) {
                    item.style.left = clientX - shiftX + 'px';
                    item.style.top = clientY - shiftY + 'px';
                }

                moveAt(event.clientX, event.clientY);

                function onMouseMove(event) {
                    moveAt(event.clientX, event.clientY);
                }

                document.addEventListener('mousemove', onMouseMove);

                item.onmouseup = function(e) {
                    document.removeEventListener('mousemove', onMouseMove);
                    item.onmouseup = null;

                    const iRect = item.getBoundingClientRect();
                    const iCenterX = iRect.left + iRect.width / 2;
                    const iCenterY = iRect.top + iRect.height / 2;

                    let droppedCorrectly = false;

                    holes.forEach(hole => {
                        const hRect = hole.getBoundingClientRect();
                        if (iCenterX > hRect.left && iCenterX < hRect.right &&
                            iCenterY > hRect.top && iCenterY < hRect.bottom) {
                            
                            if (hole.dataset.id === item.dataset.id) {
                                // Snap and Lock
                                score += 10;
                                matchedCount++;
                                droppedCorrectly = true;
                                
                                hole.style.background = item.style.color;
                                hole.style.color = "white";
                                hole.style.borderStyle = "solid";
                                hole.style.borderColor = "transparent";
                                item.remove();

                                if (window.GameHub) {
                                    window.GameHub.playSound('correct');
                                    window.GameHub.triggerVFX(e.clientX, e.clientY);
                                }
                                
                                feedback.style.color = "#2F855A";
                                feedback.innerText = "Perfect fit!";
                            }
                        }
                    });

                    if (!droppedCorrectly) {
                        // Return to bench
                        item.style.position = 'static';
                        stage.querySelector('#bench').append(item);
                        feedback.style.color = "#E53E3E";
                        feedback.innerText = "That shape doesn't go there. Check the angles!";
                        if (window.GameHub) window.GameHub.playSound('wrong');
                    }

                    if (matchedCount === data.shapes.length) {
                        feedback.style.color = "#2F855A";
                        feedback.innerText = data.explanation;
                        nextBtn.style.display = "block";
                        nextBtn.onclick = () => {
                            if (currentLevel < gameData.length - 1) {
                                currentLevel++;
                                loadLevel(stage);
                            } else if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("Shape Master!", `Final Score: ${score}. You're great at spotting differences!`);
                            }
                        };
                    }
                };
            };

            item.ondragstart = function() { return false; };
        });
    }
})();