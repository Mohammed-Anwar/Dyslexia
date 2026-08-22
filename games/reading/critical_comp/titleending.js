/**
 * Game: The Director (Suggesting a Title or Alternative Ending)
 * Filename: the_director.js
 * Logic: Read a story setup and select the best 'Final Scene' (ending) from three options.
 * Dyslexia Focus: Predictive skills and creative empathy, reducing pattern-guessing through randomization.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let shuffledGameData = []; // لتخزين المراحل بعد ترتيبها عشوائياً

    // البيانات الأساسية (تمت إضافة الأمثلة الجديدة)
    const gameData = [
        {
            story: "Leo the Lion found a tiny mouse trapped under a heavy branch. Leo used his big paw to lift the branch and let the mouse go free.",
            options: [
                { icon: "🤝", label: "Leo and the mouse become best friends.", isCorrect: true },
                { icon: "🍕", label: "Leo decides to order a pepperoni pizza.", isCorrect: false },
                { icon: "🚲", label: "The mouse buys a bicycle and rides away.", isCorrect: false }
            ],
            hint: "Think about how characters usually feel after someone helps them!",
            explanation: "That's a great ending! Helping others often leads to new friendships."
        },
        {
            story: "Maya spent all afternoon planting seeds in her garden. She watered them every day and made sure they had plenty of sunlight.",
            options: [
                { icon: "🌻", label: "Beautiful flowers grow tall and bright.", isCorrect: true },
                { icon: "⛸️", label: "Maya goes ice skating on a frozen lake.", isCorrect: false },
                { icon: "🍫", label: "Maya finds a giant bar of chocolate in the dirt.", isCorrect: false }
            ],
            hint: "What happens to seeds when they get water and sun?",
            explanation: "Perfect! Your hard work in the garden resulted in beautiful flowers."
        },
        {
            story: "The clouds turned grey and a cold wind began to blow. Sam forgot to bring his umbrella when he walked to the park.",
            options: [
                { icon: "🏠", label: "Sam runs home quickly before the rain starts.", isCorrect: true },
                { icon: "🍦", label: "Sam eats a melting ice cream cone.", isCorrect: false },
                { icon: "☀️", label: "Sam puts on sunglasses and a sun hat.", isCorrect: false }
            ],
            hint: "What would you do if you saw dark clouds and had no umbrella?",
            explanation: "That's a smart choice! Sam stayed dry by heading home."
        },
        {
            story: "Toby the dog saw a big, juicy bone sitting on the kitchen counter. He jumped as high as he could, but it was just out of reach.",
            options: [
                { icon: "😴", label: "Toby gives up and takes a long nap.", isCorrect: true },
                { icon: "🚀", label: "Toby builds a rocket ship to go to Mars.", isCorrect: false },
                { icon: "📚", label: "Toby starts reading a book about history.", isCorrect: false }
            ],
            hint: "If a dog can't reach a treat after trying hard, what might he do next?",
            explanation: "That's a realistic ending! Sometimes we just need a rest after trying our best."
        },
        {
            story: "Lily found a dusty old map in her attic. It had a big red 'X' marked deep inside the dark forest behind her house.",
            options: [
                { icon: "💎", label: "Lily finds a hidden treasure chest!", isCorrect: true },
                { icon: "🦷", label: "Lily goes to the dentist for a check-up.", isCorrect: false },
                { icon: "🧹", label: "Lily decides to sweep the kitchen floor.", isCorrect: false }
            ],
            hint: "What do people usually find when they follow a map to a red X?",
            explanation: "Bravo! The map led Lily straight to a magnificent treasure."
        },
        // --- الأمثلة الجديدة ---
        {
            story: "The boy planted a small seed. He watered it every day. The sun shined on it.",
            options: [
                { icon: "🌹", label: "A beautiful flower blooms.", isCorrect: true },
                { icon: "🍕", label: "A hot pizza arrives on a plate.", isCorrect: false },
                { icon: "🚗", label: "A red car drives quickly by.", isCorrect: false }
            ],
            hint: "What grows from a seed when it gets water and sunlight?",
            explanation: "Great job! Seeds grow into beautiful plants and flowers."
        },
        {
            story: "The girl’s balloon flew away into a tall tree. She was sad. Her tall dad came to help.",
            options: [
                { icon: "🎈", label: "Dad reaches the balloon and gives it back.", isCorrect: true },
                { icon: "📖", label: "Dad sits down to read a big book.", isCorrect: false },
                { icon: "🏊‍♀️", label: "The girl goes swimming in the pool.", isCorrect: false }
            ],
            hint: "How can the tall dad solve the problem with the tree?",
            explanation: "Awesome! Her dad used his height to reach the balloon and made her happy again."
        }
    ];

    // دالة لترتيب المصفوفات عشوائياً (Fisher-Yates Shuffle)
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 0;
        score = 0;
        
        // أخذ نسخة من المراحل وترتيبها عشوائياً في كل مرة تبدأ فيها اللعبة
        shuffledGameData = shuffleArray([...gameData]); 
        
        loadLevel(stage);
    };

    function loadLevel(stage) {
        const data = shuffledGameData[currentLevel];
        
        // ترتيب الخيارات (الأزرار) عشوائياً لهذه المرحلة تحديداً
        const shuffledOptions = shuffleArray([...data.options]);
        
        stage.innerHTML = `
            <style>
                .director-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 25px;
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
                .story-board {
                    background: #FFFBEB;
                    border: 4px solid #F6AD55;
                    border-radius: 20px;
                    padding: 30px;
                    width: 100%;
                    position: relative;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                .story-board::before {
                    content: '🎬 STORY SETUP';
                    position: absolute;
                    top: -15px;
                    left: 20px;
                    background: #F6AD55;
                    color: white;
                    padding: 2px 12px;
                    border-radius: 5px;
                    font-weight: bold;
                    font-size: 0.8rem;
                }
                .story-text {
                    font-size: 1.3rem;
                    color: #2D3748;
                    line-height: 1.6;
                    margin: 0;
                }
                .options-title {
                    font-weight: 800;
                    color: #718096;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    width: 100%;
                }
                .scene-card {
                    background: white;
                    border: 3px solid #E2E8F0;
                    border-radius: 15px;
                    padding: 15px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.2s;
                    text-align: center;
                }
                .scene-card:hover {
                    transform: translateY(-5px);
                    border-color: #F6AD55;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .scene-card.correct {
                    background: #C6F6D5;
                    border-color: #48BB78;
                }
                .scene-card.wrong {
                    background: #FED7D7;
                    border-color: #F56565;
                }
                .scene-icon { font-size: 3.5rem; }
                .scene-label { font-size: 0.95rem; font-weight: 600; color: #4A5568; }
                
                .feedback-tray {
                    min-height: 60px;
                    width: 100%;
                    text-align: center;
                    padding: 15px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s;
                }
            </style>

            <div class="director-container">
                <div class="header-stats">
                    <span>Scene: ${currentLevel + 1} / ${shuffledGameData.length}</span>
                    <span>Score: ${score}</span>
                </div>

                <div class="story-board">
                    <p class="story-text">${data.story}</p>
                </div>

                <div class="options-title">Select the Final Scene:</div>

                <div class="options-grid" id="options">
                    ${shuffledOptions.map((opt, idx) => `
                        <div class="scene-card" onclick="makeChoice(${idx}, ${opt.isCorrect})">
                            <div class="scene-icon">${opt.icon}</div>
                            <div class="scene-label">${opt.label}</div>
                        </div>
                    `).join('')}
                </div>

                <div id="feedback" class="feedback-tray"></div>
            </div>
        `;

        window.makeChoice = (idx, isCorrect) => {
            const cards = document.querySelectorAll('.scene-card');
            const feedback = document.getElementById('feedback');
            const selectedCard = cards[idx];
            const optionsGrid = document.getElementById('options');

            if (isCorrect) {
                score++;
                optionsGrid.style.pointerEvents = 'none';
                selectedCard.classList.add('correct');
                feedback.style.color = "#2F855A";
                feedback.style.background = "#F0FFF4";
                feedback.innerHTML = `🎬 Cut! ${data.explanation}`;
                
                if (window.GameHub) {
                    window.GameHub.playSound('correct');
                    const rect = selectedCard.getBoundingClientRect();
                    window.GameHub.triggerVFX(rect.left + rect.width/2, rect.top + rect.height/2);
                }

                setTimeout(() => {
                    if (currentLevel < shuffledGameData.length - 1) {
                        currentLevel++;
                        loadLevel(stage);
                    } else {
                        if (window.GameHub?.showComplete) {
                            window.GameHub.showComplete("Master Director!", `Score: ${score}. You have a great eye for story endings!`);
                        }
                    }
                }, 2500);
            } else {
                selectedCard.classList.add('wrong');
                feedback.style.color = "#C53030";
                feedback.style.background = "#FFF5F5";
                feedback.innerHTML = `Hmm, that scene feels out of place. ${data.hint}`;
                
                if (window.GameHub) window.GameHub.playSound('wrong');
                
                setTimeout(() => {
                    selectedCard.classList.remove('wrong');
                }, 1200);
            }
        };
    }
})();