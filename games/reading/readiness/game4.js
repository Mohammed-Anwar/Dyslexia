/**
 * Game 3: Linking Shapes (Mystery Identification)
 * Filename: games/read_d1_g3.js
 * Logic: Identify a partially hidden shape and drag the matching full shape to the target.
 * Features: 15 levels of progression with random rotation masking.
 */

(function() {
    let currentLevel = 1;
    const totalLevels = 15;
    let score = 0;

    // --- ADJUSTABLE ROTATION SETTINGS ---
    const minRotation = -25; // Minimum degrees
    const maxRotation = 25;  // Maximum degrees
    
    const shapes = [
        { icon: '⭐', name: 'Star' },
        { icon: '🍎', name: 'Apple' },
        { icon: '🏠', name: 'House' },
        { icon: '🚗', name: 'Car' },
        { icon: '🦋', name: 'Butterfly' },
        { icon: '🎈', name: 'Balloon' },
        { icon: '🌻', name: 'Flower' },
        { icon: '🍦', name: 'Ice Cream' },
        { icon: '🌙', name: 'Moon' },
        { icon: '☀️', name: 'Sun' },
        { icon: '🐶', name: 'Dog' },
        { icon: '🐱', name: 'Cat' },
        { icon: '🚀', name: 'Rocket' },
        { icon: '✈️', name: 'Plane' },
        { icon: '🍔', name: 'Burger' }
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        
        currentLevel = 1;
        score = 0;
        loadLevel(stage);
    };

    function loadLevel(stage) {
        const currentShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomRotation = Math.floor(Math.random() * (maxRotation - minRotation + 1)) + minRotation;

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

                .game-header {
                    text-align: center;
                    width: 100%;
                }

                .instruction-text {
                    font-size: 1.2rem;
                    color: #2D3748;
                    margin-bottom: 10px;
                    font-weight: 600;
                }

                .level-indicator {
                    font-size: 14px;
                    font-weight: bold;
                    color: #718096;
                    background: #EDF2F7;
                    padding: 4px 12px;
                    border-radius: 20px;
                    display: inline-block;
                }

                .target-zone {
                    width: 120px;
                    height: 120px;
                    border: 4px dashed #CBD5E0;
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #F8FAFC;
                    font-size: 14px;
                    color: #A0AEC0;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .mystery-container {
                    position: relative;
                    width: 140px;
                    height: 140px;
                    background: white;
                    border-radius: 50%;
                    border: 4px solid #EDF2F7;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .mystery-icon {
                    font-size: 90px;
                    transform: translateY(-15px);
                }

                .mystery-mask {
                    position: absolute;
                    bottom: -15px;
                    left: -10%;
                    width: 120%;
                    height: 60%;
                    background: linear-gradient(135deg, #4A90E2, #357ABD);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 28px;
                    transform-origin: center;
                    box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
                }

                .choices-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    width: 100%;
                    justify-items: center;
                    margin-top: 10px;
                }

                .draggable-shape {
                    width: 90px;
                    height: 90px;
                    background: white;
                    border: 2px solid #E2E8F0;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 45px;
                    cursor: grab;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    user-select: none;
                    z-index: 10;
                    touch-action: none;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .draggable-shape:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>

            <div class="game-wrapper">
                <div class="game-header">
                    <div class="instruction-text">What is hidden behind the wave?</div>
                    <div class="level-indicator">Level ${currentLevel} / ${totalLevels}</div>
                </div>
                
                <div id="drop-target" class="target-zone">
                    <span>Drag match here</span>
                </div>

                <div class="mystery-container">
                    <div class="mystery-icon">${currentShape.icon}</div>
                    <div class="mystery-mask" style="transform: rotate(${randomRotation}deg)">?</div>
                </div>

                <div class="choices-container" id="choices"></div>
            </div>
        `;

        const choicesContainer = document.getElementById('choices');
        const targetZone = document.getElementById('drop-target');

        // Logic for distractors
        const otherShapes = shapes.filter(s => s.name !== currentShape.name);
        const levelChoices = [currentShape, ...otherShapes.sort(() => Math.random() - 0.5).slice(0, 3)];
        const shuffledChoices = levelChoices.sort(() => Math.random() - 0.5);

        shuffledChoices.forEach(shape => {
            const el = document.createElement('div');
            el.className = 'draggable-shape';
            el.innerHTML = shape.icon;
            el.dataset.name = shape.name;
            choicesContainer.appendChild(el);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(el, (x, y, element) => {
                    const targetRect = targetZone.getBoundingClientRect();
                    const isInside = (
                        x > targetRect.left && 
                        x < targetRect.right && 
                        y > targetRect.top && 
                        y < targetRect.bottom
                    );

                    if (isInside && element.dataset.name === currentShape.name) {
                        handleSuccess(element, targetZone, currentShape, stage, x, y);
                    } else {
                        handleFailure(element);
                    }
                });
            } else {
                // Fallback for simple click if GameHub is not yet ready or draggable is missing
                el.onclick = (e) => {
                    if (shape.name === currentShape.name) {
                        handleSuccess(el, targetZone, currentShape, stage, e.clientX, e.clientY);
                    } else {
                        handleFailure(el);
                    }
                };
            }
        });
    }

    function handleSuccess(element, targetZone, currentShape, stage, x, y) {
        element.style.display = "none"; 
        targetZone.innerHTML = `<div style="font-size:60px; animation: bounceIn 0.5s;">${currentShape.icon}</div>`;
        targetZone.style.borderColor = "#48BB78";
        targetZone.style.background = "#F0FFF4";
        
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
                    window.GameHub.showComplete("Shape Detective!", `You identified all 15 hidden shapes!`);
                }
            }
        }, 1200);
    }

    function handleFailure(element) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        element.style.borderColor = "#F56565";
        element.style.background = "#FFF5F5";
        
        if (element.resetPosition) {
            element.resetPosition();
        } else {
            element.style.transform = "translate3d(0,0,0)";
        }

        setTimeout(() => {
            element.style.borderColor = "#E2E8F0";
            element.style.background = "white";
        }, 500);
    }
})();