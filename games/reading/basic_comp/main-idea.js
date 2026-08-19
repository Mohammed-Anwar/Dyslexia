/**
 * Game: The Umbrella (Identifying the Main Idea)
 * Filename: the_umbrella.js
 * Logic: Select the 'main idea' image or word that covers the supporting details/clues.
 * Dyslexia Focus: Synthesizing information, identifying hierarchy, and reducing reading load via TTS.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    // TTS Function for reading clues aloud
    window.speakText = function(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85; 
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("Text-to-Speech not supported in this browser.");
        }
    };

    // Array Shuffler to randomize option positions
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    const gameData = [
        // --- BASIC LEVELS (Visual / Emojis) ---
        {
            type: "visual",
            details: ["🍎", "🍌", "🍇"],
            options: [
                { icon: "🍎", label: "Just an Apple", isMain: false },
                { icon: "🧺", label: "Fruit", isMain: true },
                { icon: "🥦", label: "Vegetables", isMain: false }
            ],
            instruction: "Look at the Apple, Banana, and Grapes. Which 'Umbrella' covers them all?"
        },
        {
            type: "visual",
            details: ["🐶", "🐱", "🐹"],
            options: [
                { icon: "🐾", label: "Pets", isMain: true },
                { icon: "🦁", label: "Wild Animals", isMain: false },
                { icon: "🦴", label: "Dog Toys", isMain: false }
            ],
            instruction: "Which category fits these three animals?"
        },
        {
            type: "visual",
            details: ["🚗", "🚲", "✈️"],
            options: [
                { icon: "🛠️", label: "Tools", isMain: false },
                { icon: "⛽", label: "Gas", isMain: false },
                { icon: "🚦", label: "Transportation", isMain: true }
            ],
            instruction: "Car, Bike, Plane... What is the big idea?"
        },

        // --- ADVANCED LEVELS (Text Clues) ---
        {
            type: "text",
            clues: [
                "It has four legs.",
                "It eats grass.",
                "It gives us milk."
            ],
            options: [
                { icon: "🐄", label: "A cow", isMain: true },
                { icon: "🐦", label: "A bird", isMain: false },
                { icon: "🐍", label: "A snake", isMain: false }
            ],
            instruction: "Read the clues or listen to them. What is the umbrella idea?"
        },
        {
            type: "text",
            clues: [
                "You see desks.",
                "You read books.",
                "You listen to a teacher."
            ],
            options: [
                { icon: "🏫", label: "A school", isMain: true },
                { icon: "🏞️", label: "A park", isMain: false },
                { icon: "🛏️", label: "A bedroom", isMain: false }
            ],
            instruction: "Where are you?"
        },
        {
            type: "text",
            clues: [
                "The sun is very hot.",
                "You go to the beach.",
                "You eat ice cream."
            ],
            options: [
                { icon: "☀️", label: "Summer", isMain: true },
                { icon: "⛄", label: "Winter", isMain: false },
                { icon: "🌙", label: "Night", isMain: false }
            ],
            instruction: "What time of year is it?"
        },
        {
            type: "text",
            clues: [
                "It has many pages.",
                "It has pictures.",
                "You read it before bed."
            ],
            options: [
                { icon: "📖", label: "A book", isMain: true },
                { icon: "📺", label: "A TV", isMain: false },
                { icon: "🪑", label: "A chair", isMain: false }
            ],
            instruction: "What object is this?"
        },
        {
            type: "text",
            clues: [
                "He wears a white coat.",
                "He works in a hospital.",
                "He helps sick people."
            ],
            options: [
                { icon: "👨‍⚕️", label: "A doctor", isMain: true },
                { icon: "🧑‍🌾", label: "A farmer", isMain: false },
                { icon: "👨‍✈️", label: "A pilot", isMain: false }
            ],
            instruction: "Who is this person?"
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
        
        let detailsContent = '';
        if (data.type === "visual") {
            detailsContent = `
                <div class="details-row">
                    ${data.details.map(d => `<div class="detail-item">${d}</div>`).join('')}
                </div>
            `;
        } else if (data.type === "text") {
            detailsContent = `
                <div class="clues-container">
                    ${data.clues.map((clue, index) => `
                        <div class="clue-box">
                            <span class="clue-number">${index + 1}.</span>
                            <span class="clue-text">${clue}</span>
                            <button class="tts-button" onclick="window.speakText('${clue.replace(/'/g, "\\'")}')" aria-label="Listen to clue">🔊</button>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        stage.innerHTML = `
            <style>
                .umbrella-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 35px; /* Increased overall gap */
                    padding: 30px 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                }
                .header-stats {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    max-width: 500px;
                    font-weight: bold;
                    color: #4A5568;
                    margin-bottom: 10px;
                }
                .instruction-box {
                    background: #EBF4FF;
                    border-left: 5px solid #3182CE;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 1.1rem;
                    color: #2C5282;
                    max-width: 500px;
                    width: 100%;
                    margin-top: 10px;
                }
                
                /* Visual Level Styles */
                .details-row {
                    display: flex;
                    gap: 20px;
                    background: #F7FAFC;
                    padding: 25px;
                    border-radius: 20px;
                    border: 2px solid #EDF2F7;
                    margin: 15px 0;
                }
                .detail-item {
                    font-size: 4rem;
                    background: white;
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 15px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }

                /* Text Clues Level Styles */
                .clues-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px; /* Increased gap between clues */
                    width: 100%;
                    max-width: 500px;
                    margin: 15px 0;
                }
                .clue-box {
                    display: flex;
                    align-items: center;
                    background: #F7FAFC;
                    padding: 15px 20px;
                    border-radius: 12px;
                    border: 2px solid #E2E8F0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .clue-number {
                    font-weight: bold;
                    color: #4A5568;
                    margin-right: 15px;
                    font-size: 1.2rem;
                }
                .clue-text {
                    flex-grow: 1;
                    font-size: 1.1rem;
                    color: #2D3748;
                    font-weight: 500;
                }
                .tts-button {
                    background: #EDF2F7;
                    border: none;
                    border-radius: 50%;
                    width: 45px; /* Slightly larger for easier clicking */
                    height: 45px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .tts-button:hover {
                    background: #E2E8F0;
                    transform: scale(1.05);
                }
                .tts-button:active {
                    transform: scale(0.95);
                }

                /* Options Styles */
                .options-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 20px; /* Increased gap between options */
                    margin-top: 15px;
                }
                .option-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding: 20px 15px; /* Added more padding */
                    background: white;
                    border: 3px solid #E2E8F0;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: 130px;
                }
                .option-card:hover {
                    transform: translateY(-5px);
                    border-color: #4299E1;
                    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
                }
                .option-card.correct {
                    background: #C6F6D5;
                    border-color: #48BB78;
                }
                .option-card.wrong {
                    background: #FED7D7;
                    border-color: #F56565;
                }
                .option-icon { font-size: 3rem; }
                .option-label { font-weight: bold; color: #4A5568; font-size: 0.95rem; text-align: center; }
                
                .umbrella-svg {
                    width: 60px;
                    height: 60px;
                    fill: #3182CE;
                    margin-bottom: -20px;
                }
            </style>

            <div class="umbrella-container">
                <div class="header-stats">
                    <span>Level: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>

                <svg class="umbrella-svg" viewBox="0 0 24 24">
                    <path d="M12,2C17.5,2 22,6.5 22,12C22,12.5 21.5,13 21,13C20.5,13 20,12.5 20,12C20,7.6 16.4,4 12,4C7.6,4 4,7.6 4,12C4,12.5 3.5,13 3,13C2.5,13 2,12.5 2,12C2,6.5 6.5,2 12,2M11,13V19C11,19.6 11.4,20 12,20C12.6,20 13,19.6 13,19V13H11M12,22C10.3,22 9,20.7 9,19C9,18.4 9.4,18 10,18C10.6,18 11,18.4 11,19C11,19.6 11.4,20 12,20C12.6,20 13,19.6 13,19C13,18.4 13.4,18 14,18C14.6,18 15,18.4 15,19C15,20.7 13.7,22 12,22Z" />
                </svg>

                <div class="instruction-box">${data.instruction}</div>

                ${detailsContent}

                <div class="options-container" id="options">
                    <!-- Options generated here -->
                </div>
            </div>
        `;

        const optionsDiv = document.getElementById('options');
        
        // Shuffle the options before rendering them
        const randomizedOptions = shuffleArray(data.options);

        randomizedOptions.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.innerHTML = `
                <div class="option-icon">${opt.icon}</div>
                <div class="option-label">${opt.label}</div>
            `;

            card.onclick = (e) => {
                // Stop any reading audio when an answer is selected
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();

                if (opt.isMain) {
                    score++;
                    card.classList.add('correct');
                    if (window.GameHub) {
                        window.GameHub.playSound('correct');
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                    }
                    
                    // Disable clicking while progressing
                    optionsDiv.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        if (currentLevel < gameData.length - 1) {
                            currentLevel++;
                            loadLevel(stage);
                        } else {
                            if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("The Big Picture!", `Final Score: ${score}. You're a Main Idea Master!`);
                            }
                        }
                    }, 1500);
                } else {
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    card.classList.add('wrong');
                    setTimeout(() => card.classList.remove('wrong'), 500);
                }
            };

            optionsDiv.appendChild(card);
        });
    }
})();