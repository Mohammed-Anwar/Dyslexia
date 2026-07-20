/**
 * Game 6: Letter Train (تحديد ترتيب الحرف داخل الكلمة)
 * Filename: games/read_d1_g6.js
 * Logic: Identify if the target sound is at the Start, Middle, or End of the word train.
 * Dyslexia Focus: Sequential processing and spatial awareness.
 */

(function() {
    let currentLevel = 1;
    const totalLevels = 15;
    let score = 0;

    // Data for the levels: Word, Target Letter, and its Position (0: Start, 1: Middle, 2: End)
    const gameData = [
        { word: "CAT", target: "C", pos: 0, label: "Start" },
        { word: "DOG", target: "G", pos: 2, label: "End" },
        { word: "PIG", target: "I", pos: 1, label: "Middle" },
        { word: "SUN", target: "S", pos: 0, label: "Start" },
        { word: "BED", target: "E", pos: 1, label: "Middle" },
        { word: "HAT", target: "T", pos: 2, label: "End" },
        { word: "FISH", target: "F", pos: 0, label: "Start" },
        { word: "FROG", target: "R", pos: 1, label: "Middle" },
        { word: "DUCK", target: "K", pos: 2, label: "End" },
        { word: "LAMP", pos: 0, target: "L", label: "Start" },
        { word: "MILK", pos: 3, target: "K", posType: 2, label: "End" }, // Simple logic for end
        { word: "STAR", pos: 1, target: "T", label: "Middle" },
        { word: "CAKE", pos: 0, target: "C", label: "Start" },
        { word: "BIRD", pos: 1, target: "I", label: "Middle" },
        { word: "SHIP", pos: 2, target: "P", label: "End" }
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        
        currentLevel = 1;
        score = 0;
        loadLevel(stage);
    };

    function loadLevel(stage) {
        const data = gameData[currentLevel - 1];

        stage.innerHTML = `
            <style>
                .game-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    animation: fadeIn 0.5s ease;
                }

                .instruction-text {
                    font-size: 1.4rem;
                    color: #2D3748;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 5px;
                }

                .target-prompt {
                    font-size: 1.1rem;
                    color: #4A5568;
                    margin-bottom: 20px;
                }

                .target-letter {
                    color: #4A90E2;
                    font-size: 2rem;
                    font-weight: 900;
                }

                .train-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 40px;
                }

                .train-car {
                    width: 100px;
                    height: 80px;
                    background: #EDF2F7;
                    border: 3px solid #CBD5E0;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .train-car:hover {
                    transform: scale(1.05);
                    border-color: #4A90E2;
                }

                .train-car.selected {
                    background: #4A90E2;
                    border-color: #2B6CB0;
                    color: white;
                }

                .train-label {
                    font-size: 0.9rem;
                    font-weight: bold;
                    margin-top: 5px;
                    color: #718096;
                }

                .train-car.selected .train-label {
                    color: white;
                }

                .engine {
                    font-size: 40px;
                    margin-right: 10px;
                }

                .level-indicator {
                    font-size: 14px;
                    font-weight: bold;
                    color: #718096;
                    background: #EDF2F7;
                    padding: 6px 16px;
                    border-radius: 20px;
                }

                .word-display {
                    font-size: 2.5rem;
                    font-weight: 800;
                    letter-spacing: 5px;
                    color: #2D3748;
                    background: white;
                    padding: 10px 30px;
                    border-radius: 15px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    margin-bottom: 20px;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            </style>

            <div class="game-wrapper">
                <div class="level-indicator">Level ${currentLevel} / ${totalLevels}</div>
                <div class="instruction-text">Where do you hear the sound?</div>
                <div class="target-prompt">Find the letter <span class="target-letter">${data.target}</span> in:</div>
                
                <div class="word-display">${data.word}</div>

                <div class="train-container">
                    
                    <div class="train-car" data-pos="0">
                        <div style="font-size: 24px;">📦</div>
                        <div class="train-label">START</div>
                    </div>
                    <div class="train-car" data-pos="1">
                        <div style="font-size: 24px;">📦</div>
                        <div class="train-label">MIDDLE</div>
                    </div>
                    <div class="train-car" data-pos="2">
                        <div style="font-size: 24px;">📦</div>
                        <div class="train-label">END</div>
                    </div>
                </div>
            </div>
        `;

        const cars = stage.querySelectorAll('.train-car');

        cars.forEach(car => {
            car.onclick = (e) => {
                const selectedPos = parseInt(car.dataset.pos);
                
                // Determine actual position index for comparison
                // Simple logic: if target is at index 0 it's START, if at last it's END, else MIDDLE
                const wordArr = data.word.split('');
                const actualIndex = wordArr.indexOf(data.target);
                let actualPos;
                
                if (actualIndex === 0) actualPos = 0;
                else if (actualIndex === wordArr.length - 1) actualPos = 2;
                else actualPos = 1;

                if (selectedPos === actualPos) {
                    car.classList.add('selected');
                    score++;
                    
                    if (window.GameHub) {
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                        window.GameHub.playSound('correct');
                    }

                    setTimeout(() => {
                        if (currentLevel < totalLevels) {
                            currentLevel++;
                            loadLevel(stage);
                        } else {
                            if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("Conductor Master!", `You mastered the word train! Score: ${score}/15`);
                            }
                        }
                    }, 1000);
                } else {
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    car.style.animation = "shake 0.4s ease";
                    car.style.borderColor = "#F56565";
                    car.style.background = "#FFF5F5";
                    
                    setTimeout(() => {
                        car.style.animation = "";
                        car.style.borderColor = "#CBD5E0";
                        car.style.background = "#EDF2F7";
                    }, 400);
                }
            };
        });
    }
})();