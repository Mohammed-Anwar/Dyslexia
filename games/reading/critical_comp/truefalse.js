/**
 * Game: The Judge (Making True/False Judgments)
 * Filename: the_judge.js
 * Logic: Read a claim and decide if it is True (Gavel) or False (X) based on logic and evidence.
 * Dyslexia Focus: Validation and evidence-based reading.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const gameData = [
        {
            claim: "Fire is freezing cold to the touch.",
            isTrue: false,
            hint: "Think about what happens when you get close to a campfire.",
            explanation: "False! Fire is actually very hot, not cold."
        },
        {
            claim: "A library is a place where people go to borrow books.",
            isTrue: true,
            hint: "What is the main purpose of a library building?",
            explanation: "True! Libraries are filled with books for everyone to share."
        },
        {
            claim: "Fish use their lungs to breathe air above the water.",
            isTrue: false,
            hint: "Do fish stay underwater or walk on land?",
            explanation: "False! Fish use gills to breathe underwater."
        },
        {
            claim: "An elephant is much bigger than a tiny mouse.",
            isTrue: true,
            hint: "Compare the size of these two animals in your mind.",
            explanation: "True! Elephants are one of the largest land animals."
        },
        {
            claim: "The moon shines brightly because it is a ball of fire.",
            isTrue: false,
            hint: "Does the moon make its own light like the sun?",
            explanation: "False! The moon reflects light from the sun; it's made of rock."
        },
        {
            claim: "Vegetables like carrots and broccoli are types of food.",
            isTrue: true,
            hint: "Can you eat these items for dinner?",
            explanation: "True! They are healthy plants that we eat."
        },
        {
            claim: "Trees grow their roots high up in the clouds.",
            isTrue: false,
            hint: "Where do you see the bottom of a tree?",
            explanation: "False! Roots grow deep down into the soil."
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
                .judge-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .header-stats {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .court-room {
                    background: #F7FAFC;
                    border: 8px solid #718096;
                    border-radius: 20px;
                    padding: 40px;
                    width: 100%;
                    text-align: center;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
                }
                .claim-text {
                    font-size: 1.6rem;
                    color: #2D3748;
                    font-weight: 600;
                    margin-bottom: 20px;
                    line-height: 1.4;
                }
                .verdict-row {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    margin-top: 20px;
                }
                .judgment-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: transform 0.2s, filter 0.2s;
                    width: 150px;
                }
                .judgment-btn:hover {
                    transform: scale(1.1);
                }
                .judgment-btn:active {
                    transform: scale(0.95);
                }
                .gavel-icon {
                    font-size: 5rem;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
                }
                .x-icon {
                    font-size: 5rem;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
                }
                .btn-label {
                    font-weight: 900;
                    font-size: 1.3rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .feedback-box {
                    min-height: 60px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 1.2rem;
                    padding: 15px;
                    border-radius: 12px;
                    width: 100%;
                }
                .btn-disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }
            </style>

            <div class="judge-container">
                <div class="header-stats">
                    <span>Case: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>

                <div class="court-room">
                    <div class="claim-text" id="claim">"${data.claim}"</div>
                    
                    <div class="verdict-row" id="controls">
                        <div class="judgment-btn" id="trueBtn">
                            <div class="gavel-icon">🔨</div>
                            <div class="btn-label" style="color: #2F855A;">TRUE</div>
                        </div>
                        <div class="judgment-btn" id="falseBtn">
                            <div class="x-icon">❌</div>
                            <div class="btn-label" style="color: #C53030;">FALSE</div>
                        </div>
                    </div>
                </div>

                <div id="feedback" class="feedback-box"></div>
            </div>
        `;

        const trueBtn = document.getElementById('trueBtn');
        const falseBtn = document.getElementById('falseBtn');
        const feedback = document.getElementById('feedback');
        const controls = document.getElementById('controls');

        const processJudgment = (userChoice, e) => {
            const isCorrect = userChoice === data.isTrue;

            if (isCorrect) {
                score++;
                controls.classList.add('btn-disabled');
                feedback.style.color = "#2F855A";
                feedback.style.background = "#F0FFF4";
                feedback.innerHTML = `Order in the court! ${data.explanation}`;
                
                if (window.GameHub) {
                    window.GameHub.playSound('correct');
                    window.GameHub.triggerVFX(e.clientX, e.clientY);
                }

                setTimeout(() => {
                    if (currentLevel < gameData.length - 1) {
                        currentLevel++;
                        loadLevel(stage);
                    } else {
                        if (window.GameHub?.showComplete) {
                            window.GameHub.showComplete("Fair Judge!", `Final Score: ${score}. Your judgments are based on great evidence!`);
                        }
                    }
                }, 2500);
            } else {
                feedback.style.color = "#C53030";
                feedback.style.background = "#FFF5F5";
                feedback.innerHTML = `Wait! Review the evidence: ${data.hint}`;
                
                if (window.GameHub) window.GameHub.playSound('wrong');
                
                // Shake the court room
                document.querySelector('.court-room').animate([
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(5px)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 300 });
            }
        };

        trueBtn.onclick = (e) => processJudgment(true, e);
        falseBtn.onclick = (e) => processJudgment(false, e);
    }
})();