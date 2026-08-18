/**
 * Game: Sound Match
 * Filename: sound_match.js
 * Logic: User hears a word with a tricky starting phoneme and matches it with an image/word starting with the same sound.
 * Dyslexia Focus: Phonemic awareness through sound-to-sound matching (concrete) rather than spelling rules (abstract).
 */

(function() {
    let currentLevel = 0;

    const gameData = [
        { 
            targetWord: "Unicorn", 
            targetImage: "🦄", // Can be replaced with an actual image path
            instruction: "Listen closely... Yyy-Unicorn. Which one starts with the same sound?",
            explanation: "Great! 'Yellow' starts with the same 'Y' sound as 'Unicorn'.",
            options: [
                { word: "Yellow", image: "🟨", isCorrect: true },
                { word: "Umbrella", image: "☂️", isCorrect: false }
            ]
        },
        { 
            targetWord: "Union", 
            targetImage: "🤝",
            instruction: "Listen: Yyy-Union... Which word is its sound brother?",
            explanation: "Awesome! 'Yo-yo' starts with the same sound.",
            options: [
                { word: "Under", image: "⬇️", isCorrect: false },
                { word: "Yo-yo", image: "🪀", isCorrect: true }
            ]
        },
        { 
            targetWord: "One", 
            targetImage: "1️⃣",
            instruction: "Listen to the word: Www-One. Which one starts with the exact same sound?",
            explanation: "Correct! 'Watermelon' starts with the hidden 'W' sound found in 'One'.",
            options: [
                { word: "Watermelon", image: "🍉", isCorrect: true },
                { word: "Orange", image: "🍊", isCorrect: false }
            ]
        },
        { 
            targetWord: "Use", 
            targetImage: "🛠️",
            instruction: "Listen: Yyy-Use... Which word has the same starting sound?",
            explanation: "Champion! 'Yogurt' starts with the same sound.",
            options: [
                { word: "Yogurt", image: "🍦", isCorrect: true },
                { word: "Up", image: "⬆️", isCorrect: false }
            ]
        }
    ];

    const totalLevels = gameData.length;

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 0;
        loadLevel(stage);
    };

    // Text-to-Speech function for reading words aloud
    function speakWord(text) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 0.8;
        window.speechSynthesis.speak(utter);
    }

    function loadLevel(stage) {
        const data = gameData[currentLevel];
        
        stage.innerHTML = `
            <style>
                .sound-match-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Comic Sans MS', 'Chalkboard SE', Arial, sans-serif;
                }
                .instruction-box {
                    background: #EBF8FF;
                    padding: 20px;
                    border-radius: 20px;
                    border: 3px solid #63B3ED;
                    text-align: center;
                    font-size: 1.0rem;
                    font-weight: bold;
                    color: #2B6CB0;
                    max-width: 600px;
                }
                .target-card {
                    background: #FEFCBF;
                    padding: 30px 60px;
                    border-radius: 20px;
                    box-shadow: 0px 8px 0px #ECC94B;
                    text-align: center;
                    cursor: pointer;
                    transition: transform 0.2s;
                    border: 3px solid #FAF089;
                }
                .target-card:hover {
                    transform: scale(1.05);
                }
                .target-image {
                    font-size: 4rem;
                    line-height: 1;
                    margin-bottom: 10px;
                }
                .target-word {
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: #744210;
                }
                .options-container {
                    display: flex;
                    gap: 30px;
                    justify-content: center;
                    width: 100%;
                }
                .option-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: white;
                    padding: 20px;
                    border: 4px solid #E2E8F0;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-width: 150px;
                }
                .option-card:hover {
                    transform: translateY(-8px);
                    border-color: #4299E1;
                    box-shadow: 0px 8px 15px rgba(66, 153, 225, 0.2);
                }
                .option-card.correct {
                    background: #C6F6D5;
                    border-color: #48BB78;
                }
                .option-card.wrong {
                    background: #FED7D7;
                    border-color: #F56565;
                }
                .option-image {
                    font-size: 3rem;
                }
                .option-text {
                    font-size: 1.0rem;
                    font-weight: bold;
                    color: #4A5568;
                    margin-top: 10px;
                }
                .feedback-text {
                    height: 30px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #4A5568;
                    text-align: center;
                }
                .status-row {
                    display: flex;
                    width: 100%;
                    justify-content: center;
                    margin-bottom: -15px;
                }
                .level-indicator {
                    background: #EDF2F7;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    color: #4A5568;
                    font-size: 1.1rem;
                }
            </style>

            <div class="sound-match-container">
                <div class="status-row">
                    <div class="level-indicator">Level ${currentLevel + 1} of ${totalLevels}</div>
                </div>

                <div class="instruction-box">
                    ${data.instruction}
                </div>

                <div class="target-card" id="target-card">
                    <div class="target-image">${data.targetImage}</div>
                    <div class="target-word">${data.targetWord}</div>
                </div>
                
                <div class="feedback-text" id="feedback">Click the cards to hear their sounds!</div>

                <div class="options-container" id="options">
                    <!-- Options generated by JS -->
                </div>
            </div>
        `;

        const targetCard = document.getElementById('target-card');
        const optionsContainer = document.getElementById('options');
        const feedback = document.getElementById('feedback');

        // Pronounce target word on click
        targetCard.onclick = () => {
            speakWord(data.targetWord);
        };

        // Generate option cards
        data.options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.innerHTML = `
                <div class="option-image">${opt.image}</div>
                <div class="option-text">${opt.word}</div>
            `;
            
            card.onclick = (e) => {
                speakWord(opt.word); // Read the selected word aloud

                if (opt.isCorrect) {
                    card.classList.add('correct');
                    feedback.innerText = data.explanation;
                    feedback.style.color = "#2F855A";
                    
                    if (window.GameHub) {
                        window.GameHub.playSound('correct');
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                    }
                    
                    // Disable cards after correct answer
                    Array.from(optionsContainer.children).forEach(c => c.style.pointerEvents = 'none');
                    targetCard.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        if (currentLevel < totalLevels - 1) {
                            currentLevel++;
                            loadLevel(stage);
                        } else {
                            if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("Well Done!", "You are a sound matching expert!");
                            } else {
                                feedback.innerText = "🎉 Congrats! You finished the game!";
                            }
                        }
                    }, 4000); // Give enough time to read the explanation
                } else {
                    card.classList.add('wrong');
                    feedback.innerText = "Try again! The sounds don't match.";
                    feedback.style.color = "#C53030";
                    
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    
                    setTimeout(() => {
                        card.classList.remove('wrong');
                        feedback.innerText = "Click the cards to hear their sounds!";
                        feedback.style.color = "#4A5568";
                    }, 1500);
                }
            };
            
            optionsContainer.appendChild(card);
        });

        // Automatically read the target word when the level starts
        setTimeout(() => speakWord(data.targetWord), 800);
    }
})();