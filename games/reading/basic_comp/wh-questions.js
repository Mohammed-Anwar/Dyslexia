/**
 * Game: Text Hunter (Answering Wh-questions)
 * Filename: text_hunter.js
 * Logic: Read short sentences and tap the word that answers the question.
 * Dyslexia Focus: Scanning for specific information, focus, and reducing impulsivity.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const gameData = [
        // ==========================================
        // المستوى المبتدئ (1 - 5): جمل بسيطة، أسئلة متنوعة ومباشرة
        // ==========================================
        {
            sentences: "The cat sat on the mat.",
            question: "Where did the cat sit?",
            target: "mat",
            instruction: "Find the place (WHERE)."
        },
        {
            sentences: "Ben went to the big park.",
            question: "Who went to the park?",
            target: "Ben",
            instruction: "Find the person (WHO)."
        },
        {
            sentences: "Sarah ate a red apple.",
            question: "What color is the apple?",
            target: "red",
            instruction: "Find the color word."
        },
        {
            sentences: "The frog jumped into the pond.",
            question: "Where did the frog jump?",
            target: "pond",
            instruction: "Find the location (WHERE)."
        },
        {
            sentences: "The monkey is eating a banana.",
            question: "What is the monkey eating?",
            target: "banana",
            instruction: "Find the food (WHAT)."
        },

        // ==========================================
        // المستوى المتوسط (6 - 15): تكرار الجمل مع كسر النمط وتنوع الأسئلة
        // ==========================================
        
        // المجموعة الأولى (الترتيب: لون -> حالة -> مكان)
        {
            sentences: "The brown bear sleeps in the cave. It feels very tired.",
            question: "What color is the bear?",
            target: "brown",
            instruction: "Look for a color."
        },
        {
            sentences: "The brown bear sleeps in the cave. It feels very tired.",
            question: "How does the bear feel?",
            target: "tired",
            instruction: "Find the feeling word."
        },
        {
            sentences: "The brown bear sleeps in the cave. It feels very tired.",
            question: "Where does it sleep?",
            target: "cave",
            instruction: "Find the place (WHERE)."
        },

        // المجموعة الثانية (الترتيب: مكان -> وصف -> شخص) - نمط مختلف عن المجموعة السابقة
        {
            sentences: "Emma is reading a funny book in the library. She is laughing.",
            question: "Where is Emma?",
            target: "library",
            instruction: "Find the place (WHERE)."
        },
        {
            sentences: "Emma is reading a funny book in the library. She is laughing.",
            question: "What kind of book is it?",
            target: "funny",
            instruction: "Find the describing word."
        },
        {
            sentences: "Emma is reading a funny book in the library. She is laughing.",
            question: "Who is reading?",
            target: "Emma",
            instruction: "Find the name (WHO)."
        },

        // المجموعة الثالثة (الترتيب: شيء -> مكان)
        {
            sentences: "Tom found a shiny coin. He put it in his pocket.",
            question: "What did Tom find?",
            target: "coin",
            instruction: "Find the object (WHAT)."
        },
        {
            sentences: "Tom found a shiny coin. He put it in his pocket.",
            question: "Where did he put it?",
            target: "pocket",
            instruction: "Find the place (WHERE)."
        },

        // المجموعة الرابعة (الترتيب: حالة -> مكان)
        {
            sentences: "The fast car drives on the highway. The driver is careful.",
            question: "How is the driver?",
            target: "careful",
            instruction: "Find how he acts."
        },
        {
            sentences: "The fast car drives on the highway. The driver is careful.",
            question: "Where does the car drive?",
            target: "highway",
            instruction: "Find the place (WHERE)."
        },

        // ==========================================
        // المستوى المتقدم (16 - 20): التشتيت والتركيز العالي (تفاصيل مزدوجة)
        // ==========================================
        {
            sentences: "The dog is in the yard. The cat is on the mat.",
            question: "Where is the CAT?",
            target: "mat",
            instruction: "Read carefully! Find where the CAT is."
        },
        {
            sentences: "The red bag is on the desk. The blue bag is on the bed.",
            question: "Where is the BLUE bag?",
            target: "bed",
            instruction: "Find where the BLUE bag is."
        },
        {
            sentences: "The red bag is on the desk. The blue bag is on the bed.",
            question: "Which bag is on the DESK?",
            target: "red",
            instruction: "Focus! Find the color of the bag on the DESK."
        },
        {
            sentences: "Ali plays football. Omar plays tennis.",
            question: "Who plays tennis?",
            target: "Omar",
            instruction: "Focus! Find who plays TENNIS."
        },
        {
            sentences: "Mom is eating pizza in the kitchen. Dad is eating cake in the garden.",
            question: "What is Dad eating?",
            target: "cake",
            instruction: "Read carefully! Find what DAD is eating."
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