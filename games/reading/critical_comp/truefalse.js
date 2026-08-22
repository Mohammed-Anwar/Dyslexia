/**
 * Game: The Judge (Making True/False Judgments)
 * Filename: the_judge.js
 * Logic: Read a short text, then decide if a claim is True (Gavel) or False (X) based on the text.
 * Dyslexia Focus: Reading comprehension, validation, and evidence-based reading.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    // تم دمج الأمثلة الجديدة التي تعتمد على "النص المقروء"
    const gameData = [
        // --- القصة الأولى: دراجة سام ---
        {
            story: "Sam has a red bike. He rides it to the park.",
            claim: "Sam has a blue bike.",
            isTrue: false,
            hint: "Read the story again. What color is Sam's bike?",
            explanation: "False! The story says he has a RED bike."
        },
        {
            story: "Sam has a red bike. He rides it to the park.",
            claim: "Sam goes to the park.",
            isTrue: true,
            hint: "Where does he ride his bike in the story?",
            explanation: "True! The story tells us he goes to the park."
        },
        // --- القصة الثانية: الحيوانات الأليفة ---
        {
            story: "The cat is sleeping on the bed. The dog is playing outside.",
            claim: "The cat is playing.",
            isTrue: false,
            hint: "Look at what the cat is doing in the story.",
            explanation: "False! The cat is sleeping. It's the dog that is playing."
        },
        {
            story: "The cat is sleeping on the bed. The dog is playing outside.",
            claim: "The dog is outside.",
            isTrue: true,
            hint: "Where is the dog located in the text?",
            explanation: "True! The story says the dog is playing outside."
        },
        // --- مثال إضافي للتدريب ---
        {
            story: "Emma loves apples. She eats a green apple every morning.",
            claim: "Emma eats a red apple.",
            isTrue: false,
            hint: "What color is the apple Emma eats?",
            explanation: "False! She eats a GREEN apple."
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
                .court-room {
                    background: #F7FAFC;
                    border: 8px solid #718096;
                    border-radius: 20px;
                    padding: 30px;
                    width: 100%;
                    text-align: center;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .story-box {
                    background: #FEFCBF; /* لون أصفر فاتح مريح للعين للمساعدة في القراءة */
                    border-left: 6px solid #D69E2E;
                    padding: 15px;
                    border-radius: 8px;
                    font-size: 1.3rem;
                    color: #2D3748;
                    text-align: left;
                    line-height: 1.5;
                }
                .claim-text {
                    font-size: 1.5rem;
                    color: #1A202C;
                    font-weight: 700;
                    margin-top: 10px;
                    background: white;
                    padding: 15px;
                    border-radius: 12px;
                    border: 2px dashed #CBD5E0;
                }
                .verdict-row {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    margin-top: 15px;
                }
                .judgment-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: transform 0.2s, filter 0.2s;
                    width: 120px;
                    background: white;
                    padding: 15px;
                    border-radius: 15px;
                    border: 3px solid #E2E8F0;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .judgment-btn:hover {
                    transform: scale(1.08);
                    border-color: #A0AEC0;
                }
                .judgment-btn:active {
                    transform: scale(0.95);
                }
                .gavel-icon { font-size: 4rem; }
                .x-icon { font-size: 4rem; }
                .btn-label {
                    font-weight: 900;
                    font-size: 1.2rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .feedback-box {
                    min-height: 60px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 1.2rem;
                    padding: 15px;
                    border-radius: 12px;
                    width: 100%;
                    display: none;
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
                    ${data.story ? `<div class="story-box">📖 <strong>Story:</strong><br>${data.story}</div>` : ''}
                    
                    <div class="claim-text" id="claim">🤔 <strong>Claim:</strong><br>"${data.claim}"</div>
                    
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
                feedback.style.display = "block";
                feedback.style.color = "#2F855A";
                feedback.style.background = "#F0FFF4";
                feedback.innerHTML = `Order in the court! ✨ ${data.explanation}`;
                
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
                            window.GameHub.showComplete("Fair Judge!", `Final Score: ${score}. Great reading skills!`);
                        }
                    }
                }, 3000); // زيادة الوقت قليلاً ليقرأ الطفل الشرح
            } else {
                feedback.style.display = "block";
                feedback.style.color = "#C53030";
                feedback.style.background = "#FFF5F5";
                feedback.innerHTML = `Wait! Review the evidence: ${data.hint}`;
                
                if (window.GameHub) window.GameHub.playSound('wrong');
                
                // اهتزاز الشاشة عند الإجابة الخاطئة
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