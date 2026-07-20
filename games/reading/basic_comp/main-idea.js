/**
 * Game: The Umbrella (Identifying the Main Idea)
 * Filename: the_umbrella.js
 * Logic: Select the 'main idea' image (the umbrella) that covers three supporting detail images.
 * Dyslexia Focus: Synthesizing information and identifying hierarchy.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const gameData = [
        {
            details: ["🍎", "🍌", "🍇"],
            options: [
                { icon: "🍎", label: "Just an Apple", isMain: false },
                { icon: "🧺", label: "Fruit", isMain: true },
                { icon: "🥦", label: "Vegetables", isMain: false }
            ],
            instruction: "Look at the Apple, Banana, and Grapes. Which 'Umbrella' covers them all?"
        },
        {
            details: ["🐶", "🐱", "🐹"],
            options: [
                { icon: "🐾", label: "Pets", isMain: true },
                { icon: "🦁", label: "Wild Animals", isMain: false },
                { icon: "🦴", label: "Dog Toys", isMain: false }
            ],
            instruction: "Which category fits these three animals?"
        },
        {
            details: ["🚗", "🚲", "✈️"],
            options: [
                { icon: "🛠️", label: "Tools", isMain: false },
                { icon: "⛽", label: "Gas", isMain: false },
                { icon: "🚦", label: "Transportation", isMain: true }
            ],
            instruction: "Car, Bike, Plane... What is the big idea?"
        },
        {
            details: ["👕", "👖", "👗"],
            options: [
                { icon: "🧵", label: "Sewing", isMain: false },
                { icon: "👕", label: "Clothes", isMain: true },
                { icon: "🎒", label: "Bags", isMain: false }
            ],
            instruction: "What do we call all of these things together?"
        },
        {
            details: ["🎷", "🎸", "🎹"],
            options: [
                { icon: "📻", label: "Radio", isMain: false },
                { icon: "🎶", label: "Instruments", isMain: true },
                { icon: "🎧", label: "Listening", isMain: false }
            ],
            instruction: "Look at the Sax, Guitar, and Piano. What is the umbrella idea?"
        },
        {
            details: ["☀️", "🌧️", "❄️"],
            options: [
                { icon: "🌡️", label: "Weather", isMain: true },
                { icon: "🧤", label: "Winter", isMain: false },
                { icon: "⛱️", label: "Summer", isMain: false }
            ],
            instruction: "Find the umbrella for Sun, Rain, and Snow."
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
                .umbrella-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                }
                .header-stats {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    max-width: 500px;
                    font-weight: bold;
                    color: #4A5568;
                }
                .instruction-box {
                    background: #EBF4FF;
                    border-left: 5px solid #3182CE;
                    padding: 15px 20px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 1.1rem;
                    color: #2C5282;
                    max-width: 500px;
                }
                .details-row {
                    display: flex;
                    gap: 20px;
                    background: #F7FAFC;
                    padding: 20px;
                    border-radius: 20px;
                    border: 2px solid #EDF2F7;
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
                .options-container {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                }
                .option-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding: 15px;
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
                .option-label { font-weight: bold; color: #4A5568; font-size: 0.9rem; }
                
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

                <div class="details-row">
                    ${data.details.map(d => `<div class="detail-item">${d}</div>`).join('')}
                </div>

                <div class="options-container" id="options">
                    <!-- Options generated here -->
                </div>
            </div>
        `;

        const optionsDiv = document.getElementById('options');

        data.options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.innerHTML = `
                <div class="option-icon">${opt.icon}</div>
                <div class="option-label">${opt.label}</div>
            `;

            card.onclick = (e) => {
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