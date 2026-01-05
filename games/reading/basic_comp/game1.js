/**
 * Game: Text Hunter (Answering Wh-questions)
 * Filename: text_hunter.js
 * Logic: Read two short sentences and tap the word that answers 'Who' or 'Where'.
 * Dyslexia Focus: Scanning for specific information without over-reading.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const gameData = [
        {
            sentences: "The cat sat on the mat. It was happy.",
            question: "Where did the cat sit?",
            target: "mat",
            instruction: "Find the word that tells us WHERE."
        },
        {
            sentences: "Ben went to the park. He saw a big dog.",
            question: "Who went to the park?",
            target: "Ben",
            instruction: "Find the person (WHO)."
        },
        {
            sentences: "The bird is in the tree. It is singing a song.",
            question: "Where is the bird?",
            target: "tree",
            instruction: "Scan for the place (WHERE)."
        },
        {
            sentences: "Sarah ate a red apple. It tasted very sweet.",
            question: "Who ate the apple?",
            target: "Sarah",
            instruction: "Find the name (WHO)."
        },
        {
            sentences: "The frog jumped into the pond. The water was cold.",
            question: "Where did the frog jump?",
            target: "pond",
            instruction: "Find the location (WHERE)."
        },
        {
            sentences: "Tom found a shiny coin. He put it in his pocket.",
            question: "Who found a coin?",
            target: "Tom",
            instruction: "Tap the name of the person."
        },
        {
            sentences: "The books are on the shelf. They are very heavy.",
            question: "Where are the books?",
            target: "shelf",
            instruction: "Look for the location."
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
        // Split sentences into words for individual tapping
        const words = data.sentences.split(' ');

        stage.innerHTML = `
            <style>
                .hunter-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 25px;
                    padding: 20px;
                    font-family: 'Open Sans', system-ui, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .question-box {
                    background: #EBF8FF;
                    border: 2px solid #4299E1;
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                    width: 100%;
                }
                .question-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #2B6CB0;
                    margin-bottom: 10px;
                }
                .hint-text {
                    font-size: 1rem;
                    color: #4A5568;
                    font-style: italic;
                }
                .text-display {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    line-height: 2;
                    font-size: 1.4rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    justify-content: center;
                    border: 1px solid #E2E8F0;
                }
                .word-token {
                    padding: 2px 6px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #2D3748;
                    user-select: none;
                }
                .word-token:hover {
                    background: #EDF2F7;
                    color: #2B6CB0;
                }
                .word-token.correct {
                    background: #C6F6D5;
                    color: #22543D;
                    font-weight: bold;
                    transform: scale(1.1);
                }
                .word-token.wrong {
                    background: #FED7D7;
                    color: #742A2A;
                    text-decoration: line-through;
                }
                .status-bar {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    color: #718096;
                    font-weight: bold;
                }
            </style>

            <div class="hunter-container">
                <div class="status-bar">
                    <span>Level: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>

                <div class="question-box">
                    <div class="question-text">${data.question}</div>
                    <div class="hint-text">${data.instruction}</div>
                </div>

                <div class="text-display" id="text-display">
                    <!-- Words injected here -->
                </div>
            </div>
        `;

        const display = document.getElementById('text-display');

        words.forEach((word) => {
            const span = document.createElement('span');
            span.className = 'word-token';
            span.innerText = word;
            
            // Clean word for comparison (remove punctuation)
            const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

            span.onclick = (e) => {
                if (cleanWord.toLowerCase() === data.target.toLowerCase()) {
                    if (!span.classList.contains('correct')) {
                        score++;
                        span.classList.add('correct');
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
                                    window.GameHub.showComplete("Elite Hunter!", `You answered every question correctly! Final Score: ${score}`);
                                }
                            }
                        }, 1500);
                    }
                } else {
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    span.classList.add('wrong');
                    setTimeout(() => span.classList.remove('wrong'), 500);
                }
            };

            display.appendChild(span);
        });
    }
})();