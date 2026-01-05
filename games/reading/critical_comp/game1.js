/**
 * Game: Proof Lens (Fact vs. Opinion)
 * Filename: proof_lens.js
 * Logic: Identify if a statement is a Fact (Camera/Visible) or an Opinion (Heart/Feelings).
 * Dyslexia Focus: Developing critical discernment and logical categorization.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const gameData = [
        {
            statement: "The sun is a star.",
            isFact: true,
            hint: "Can we prove this with science?",
            explanation: "That's a Fact! Scientists can see and measure the sun."
        },
        {
            statement: "Pizza is the most delicious food.",
            isFact: false,
            hint: "Does everyone in the world agree?",
            explanation: "That's an Opinion! Some people might prefer tacos."
        },
        {
            statement: "Dogs have four legs.",
            isFact: true,
            hint: "Can you see and count them?",
            explanation: "That's a Fact! You can see and count the legs."
        },
        {
            statement: "Blue is the prettiest color.",
            isFact: false,
            hint: "Is this a feeling or a rule?",
            explanation: "That's an Opinion! Someone else might love red."
        },
        {
            statement: "Water freezes at 0 degrees Celsius.",
            isFact: true,
            hint: "Can we test this with a thermometer?",
            explanation: "That's a Fact! It's a scientific measurement."
        },
        {
            statement: "The movie was way too long.",
            isFact: false,
            hint: "Would a clock say it's 'too' long, or just 'long'?",
            explanation: "That's an Opinion! One person might find it exciting."
        },
        {
            statement: "Elephants are the largest land animals.",
            isFact: true,
            hint: "Can we weigh them and compare?",
            explanation: "That's a Fact! We can measure their size."
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
                .lens-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 25px;
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
                .statement-box {
                    background: white;
                    border: 4px solid #EDF2F7;
                    padding: 30px;
                    border-radius: 20px;
                    text-align: center;
                    font-size: 1.5rem;
                    color: #2D3748;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    width: 100%;
                    min-height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .instruction-text {
                    color: #718096;
                    font-style: italic;
                    text-align: center;
                }
                .options-row {
                    display: flex;
                    gap: 30px;
                    width: 100%;
                    justify-content: center;
                }
                .lens-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                    padding: 25px;
                    background: white;
                    border: 4px solid #E2E8F0;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    width: 180px;
                }
                .lens-card:hover {
                    transform: scale(1.05);
                    border-color: #63B3ED;
                }
                .lens-card.fact-btn:hover { border-color: #4299E1; background: #EBF8FF; }
                .lens-card.opinion-btn:hover { border-color: #F687B3; background: #FFF5F7; }
                
                .lens-card.correct { background: #C6F6D5; border-color: #48BB78; }
                .lens-card.wrong { background: #FED7D7; border-color: #F56565; }

                .lens-icon { font-size: 4rem; }
                .lens-label { font-weight: 800; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px; }
                
                .feedback-overlay {
                    margin-top: 10px;
                    padding: 10px 20px;
                    border-radius: 10px;
                    display: none;
                    text-align: center;
                    font-weight: 500;
                }
            </style>

            <div class="lens-container">
                <div class="header-stats">
                    <span>Card: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>

                <div class="instruction-text">"Use the Camera for things we can prove, use the Heart for feelings."</div>

                <div class="statement-box" id="statement">
                    "${data.statement}"
                </div>

                <div class="options-row" id="options">
                    <div class="lens-card fact-btn" id="factBtn">
                        <div class="lens-icon">📷</div>
                        <div class="lens-label" style="color: #3182CE;">Fact</div>
                    </div>
                    <div class="lens-card opinion-btn" id="opinionBtn">
                        <div class="lens-icon">❤️</div>
                        <div class="lens-label" style="color: #D53F8C;">Opinion</div>
                    </div>
                </div>

                <div id="feedback" class="feedback-overlay"></div>
            </div>
        `;

        const factBtn = document.getElementById('factBtn');
        const opinionBtn = document.getElementById('opinionBtn');
        const feedback = document.getElementById('feedback');
        const optionsRow = document.getElementById('options');

        const handleChoice = (isFactSelected, e) => {
            const isCorrect = isFactSelected === data.isFact;
            const selectedCard = isFactSelected ? factBtn : opinionBtn;

            optionsRow.style.pointerEvents = 'none';
            
            if (isCorrect) {
                score++;
                selectedCard.classList.add('correct');
                feedback.style.display = 'block';
                feedback.style.color = '#2F855A';
                feedback.innerHTML = `✨ ${data.explanation}`;
                
                if (window.GameHub) {
                    window.GameHub.playSound('correct');
                    window.GameHub.triggerVFX(e.clientX, e.clientY);
                }
            } else {
                selectedCard.classList.add('wrong');
                feedback.style.display = 'block';
                feedback.style.color = '#C53030';
                feedback.innerHTML = `Try again! Hint: ${data.hint}`;
                
                if (window.GameHub) window.GameHub.playSound('wrong');
                
                setTimeout(() => {
                    selectedCard.classList.remove('wrong');
                    optionsRow.style.pointerEvents = 'auto';
                }, 1200);
                return;
            }

            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(stage);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Sharp Eye!", `You scored ${score} out of ${gameData.length}. You're a Proof Lens Expert!`);
                    }
                }
            }, 2000);
        };

        factBtn.onclick = (e) => handleChoice(true, e);
        opinionBtn.onclick = (e) => handleChoice(false, e);
    }
})();