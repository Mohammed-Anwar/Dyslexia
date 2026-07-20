/**
 * Game: Portal Sort (Reality vs. Fantasy)
 * Filename: portal_sort.js
 * Logic: Identify if a scenario is Real World (Door) or Fantasy (Magic Portal).
 * Dyslexia Focus: Separating literal and figurative concepts.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const gameData = [
        {
            scenario: "A dragon breathing fire to cook breakfast.",
            isReality: false,
            icon: "🐉",
            hint: "Have you ever seen a real dragon at the zoo?",
            explanation: "That's Fantasy! Dragons are magical creatures from stories."
        },
        {
            scenario: "A dog barking at the mail carrier.",
            isReality: true,
            icon: "🐕",
            hint: "Does this happen in our world?",
            explanation: "That's Reality! Dogs bark at things in real life."
        },
        {
            scenario: "A car flying through the clouds like a bird.",
            isReality: false,
            icon: "🚗",
            hint: "Do cars have wings and feathers?",
            explanation: "That's Fantasy! Cars drive on roads in the real world."
        },
        {
            scenario: "An apple falling from a tree to the ground.",
            isReality: true,
            icon: "🍎",
            hint: "Is this how nature works?",
            explanation: "That's Reality! Gravity makes things fall down."
        },
        {
            scenario: "A talking cat that wears a hat and monocle.",
            isReality: false,
            icon: "🐈",
            hint: "Can cats speak human languages?",
            explanation: "That's Fantasy! Animals only talk in cartoons and books."
        },
        {
            scenario: "Rain falling from the sky on a cloudy day.",
            isReality: true,
            icon: "🌧️",
            hint: "Does this happen outside your window?",
            explanation: "That's Reality! Rain is a part of our natural weather."
        },
        {
            scenario: "A boy finding a golden lamp with a genie inside.",
            isReality: false,
            icon: "🧞",
            hint: "Are genies real or made up?",
            explanation: "That's Fantasy! Genies are part of fairy tales."
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
                .portal-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 700px;
                    margin: 0 auto;
                }
                .header-stats {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .card-to-sort {
                    background: white;
                    border: 4px solid #E2E8F0;
                    padding: 20px;
                    border-radius: 20px;
                    text-align: center;
                    width: 250px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    z-index: 10;
                    transition: transform 0.3s ease;
                }
                .card-icon { font-size: 4rem; margin-bottom: 10px; }
                .card-text { font-size: 1.1rem; font-weight: 600; color: #2D3748; line-height: 1.4; }

                .portals-row {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    gap: 40px;
                    margin-top: 20px;
                }
                .portal-zone {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                    padding: 20px;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 4px dashed transparent;
                }
                
                /* Reality Door Styling */
                .reality-door {
                    background: #F0FFF4;
                    border-color: #9AE6B4;
                }
                .reality-door:hover {
                    background: #C6F6D5;
                    transform: translateY(-5px);
                }
                .door-graphic {
                    font-size: 5rem;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
                }

                /* Fantasy Portal Styling */
                .fantasy-portal {
                    background: #FAF5FF;
                    border-color: #D6BCFA;
                }
                .fantasy-portal:hover {
                    background: #E9D8FD;
                    transform: translateY(-5px);
                }
                .portal-graphic {
                    font-size: 5rem;
                    animation: spin 10s linear infinite;
                    filter: drop-shadow(0 0 10px #B794F4);
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .portal-label {
                    font-weight: 800;
                    font-size: 1.2rem;
                    text-transform: uppercase;
                }

                .feedback-msg {
                    min-height: 60px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 1.1rem;
                    margin-top: 10px;
                }

                .wrong-shake {
                    animation: shake 0.5s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            </style>

            <div class="portal-container">
                <div class="header-stats">
                    <span>Level: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>

                <div class="card-to-sort" id="mainCard">
                    <div class="card-icon">${data.icon}</div>
                    <div class="card-text">${data.scenario}</div>
                </div>

                <div class="portals-row">
                    <div class="portal-zone reality-door" id="doorBtn">
                        <div class="door-graphic">🚪</div>
                        <div class="portal-label" style="color: #2F855A;">Real World</div>
                    </div>
                    
                    <div class="portal-zone fantasy-portal" id="portalBtn">
                        <div class="portal-graphic">🌀</div>
                        <div class="portal-label" style="color: #6B46C1;">Magic Portal</div>
                    </div>
                </div>

                <div id="feedback" class="feedback-msg"></div>
            </div>
        `;

        const doorBtn = document.getElementById('doorBtn');
        const portalBtn = document.getElementById('portalBtn');
        const mainCard = document.getElementById('mainCard');
        const feedback = document.getElementById('feedback');

        const handleChoice = (isRealitySelected, e) => {
            const isCorrect = isRealitySelected === data.isReality;
            
            if (isCorrect) {
                score++;
                feedback.style.color = "#2F855A";
                feedback.innerHTML = `✨ ${data.explanation}`;
                mainCard.style.transform = isRealitySelected ? "translateX(-150px) scale(0) rotate(-20deg)" : "translateX(150px) scale(0) rotate(20deg)";
                mainCard.style.opacity = "0";
                
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
                            window.GameHub.showComplete("Portal Master!", `Final Score: ${score}. You know the difference between what's real and what's magic!`);
                        }
                    }
                }, 2000);
            } else {
                mainCard.classList.add('wrong-shake');
                feedback.style.color = "#C53030";
                feedback.innerHTML = `Wait! ${data.hint}`;
                
                if (window.GameHub) window.GameHub.playSound('wrong');
                
                setTimeout(() => {
                    mainCard.classList.remove('wrong-shake');
                }, 500);
            }
        };

        doorBtn.onclick = (e) => handleChoice(true, e);
        portalBtn.onclick = (e) => handleChoice(false, e);
    }
})();