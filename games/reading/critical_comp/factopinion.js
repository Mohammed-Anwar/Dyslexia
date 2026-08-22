/**
 * Game: Proof Lens (Fact vs. Opinion)
 * Filename: proof_lens.js
 * Logic: Identify if a statement is a Fact (Camera/Visible) or an Opinion (Heart/Feelings).
 * Dyslexia Focus: Developing critical discernment and logical categorization.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    // تم تحديث البيانات بناءً على المستويات التربوية المحددة
    const gameData = [
        // --- الأساسي: الحيوانات ---
        {
            statement: "Cats have a long tail.",
            isFact: true,
            hint: "Can we look at a cat and see its tail?",
            explanation: "That's a Fact! We can see and measure the tail."
        },
        {
            statement: "Cats are the best pets.",
            isFact: false,
            hint: "Does everyone agree? What about dog lovers?",
            explanation: "That's an Opinion! Some people prefer dogs or birds."
        },
        // --- الأساسي: الطعام ---
        {
            statement: "Ice cream is cold.",
            isFact: true,
            hint: "Can we test this with a thermometer?",
            explanation: "That's a Fact! A thermometer will show it is cold."
        },
        {
            statement: "Ice cream is yummy.",
            isFact: false,
            hint: "Does everyone like the same flavors?",
            explanation: "That's an Opinion! Someone might not like sweet things."
        },
        // --- الأساسي: المدرسة ---
        {
            statement: "We read books at school.",
            isFact: true,
            hint: "Can we take a picture of students reading?",
            explanation: "That's a Fact! We can prove it by looking at a classroom."
        },
        {
            statement: "Reading is very hard.",
            isFact: false,
            hint: "Is it hard for everyone, or just a feeling?",
            explanation: "That's an Opinion! Some people might find it easy."
        },
        // --- المتقدم: الترفيه ---
        {
            statement: "The movie is two hours long.",
            isFact: true,
            hint: "Can we measure this with a clock?",
            explanation: "That's a Fact! We can time the movie exactly."
        },
        {
            statement: "The movie is very funny.",
            isFact: false,
            hint: "Will everyone laugh at the same jokes?",
            explanation: "That's an Opinion! Humor is a personal feeling."
        },
        // --- المتقدم: الطقس والفصول ---
        {
            statement: "The sun is yellow.",
            isFact: true,
            hint: "Can we look and see the color?",
            explanation: "That's a Fact! We can observe its color with our eyes."
        },
        {
            statement: "Summer is the best season.",
            isFact: false,
            hint: "Do some people like snow better?",
            explanation: "That's an Opinion! People have different favorite seasons."
        },
        // --- المتقدم: الألعاب والرياضة ---
        {
            statement: "A basketball is round.",
            isFact: true,
            hint: "Can we see and touch its shape?",
            explanation: "That's a Fact! We can prove its shape is round."
        },
        {
            statement: "Basketball is a fun game.",
            isFact: false,
            hint: "Does everyone like playing sports?",
            explanation: "That's an Opinion! Some people might prefer drawing or reading."
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
            }, 2500); // زدنا وقت الانتظار قليلاً ليتمكن الطفل من قراءة الشرح براحة
        };

        factBtn.onclick = (e) => handleChoice(true, e);
        opinionBtn.onclick = (e) => handleChoice(false, e);
    }
})();