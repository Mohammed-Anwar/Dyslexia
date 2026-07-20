/**
 * Game: The Intruder (Identifying Sentences that Do Not Belong)
 * Filename: the_intruder.js
 * Logic: Read a short passage and identify the "intruder" sentence that doesn't fit the topic.
 * Dyslexia Focus: Sustained attention and topical cohesion.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const gameData = [
        {
            topic: "Baking Cookies",
            sentences: [
                { text: "First, mix the sugar and butter in a large bowl.", belongs: true },
                { text: "Then, add the chocolate chips to the dough.", belongs: true },
                { text: "Most bicycles have two wheels and a chain.", belongs: false },
                { text: "Finally, bake the cookies in the oven for ten minutes.", belongs: true }
            ],
            hint: "One sentence is talking about transportation instead of food!",
            explanation: "The bicycle sentence doesn't fit! We are talking about baking cookies."
        },
        {
            topic: "The Ocean",
            sentences: [
                { text: "Dolphins are mammals that live in the sea.", belongs: true },
                { text: "The water is very salty and blue.", belongs: true },
                { text: "Giant whales can swim for many miles.", belongs: true },
                { text: "I need to buy new batteries for my flashlight.", belongs: false }
            ],
            hint: "Which sentence has nothing to do with the sea?",
            explanation: "Batteries don't belong in a story about the ocean!"
        },
        {
            topic: "Playing Soccer",
            sentences: [
                { text: "The players ran across the green field.", belongs: true },
                { text: "The goalie blocked the ball from entering the net.", belongs: true },
                { text: "Penguins are birds that cannot fly.", belongs: false },
                { text: "The referee blew the whistle to start the game.", belongs: true }
            ],
            hint: "Is there an animal hiding in this sports story?",
            explanation: "Penguins are cool, but they aren't part of a soccer game!"
        },
        {
            topic: "Brushing Your Teeth",
            sentences: [
                { text: "Put a small squeeze of toothpaste on the brush.", belongs: true },
                { text: "Squirrels love to hide acorns in the ground.", belongs: false },
                { text: "Brush in small circles for two minutes.", belongs: true },
                { text: "Rinse your mouth with water when you are finished.", belongs: true }
            ],
            hint: "Does a squirrel help you clean your teeth?",
            explanation: "The squirrel sentence is the intruder!"
        },
        {
            topic: "Outer Space",
            sentences: [
                { text: "Astronauts wear special suits to breathe.", belongs: true },
                { text: "The moon orbits around the Earth.", belongs: true },
                { text: "The library is a quiet place to read books.", belongs: false },
                { text: "Stars are massive balls of burning gas.", belongs: true }
            ],
            hint: "Find the sentence that belongs in a building, not in space.",
            explanation: "The library is on Earth, not in outer space!"
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
        
        // Shuffle sentences for each play
        const shuffledSentences = [...data.sentences].sort(() => Math.random() - 0.5);

        stage.innerHTML = `
            <style>
                .intruder-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 650px;
                    margin: 0 auto;
                }
                .header-stats {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .topic-header {
                    background: #2D3748;
                    color: white;
                    padding: 10px 25px;
                    border-radius: 50px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .passage-box {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 100%;
                }
                .sentence-card {
                    background: white;
                    border: 3px solid #E2E8F0;
                    padding: 18px 25px;
                    border-radius: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 1.15rem;
                    color: #2D3748;
                    line-height: 1.5;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .sentence-card:hover {
                    border-color: #A0AEC0;
                    background: #F7FAFC;
                    transform: translateX(5px);
                }
                .sentence-card.correct {
                    background: #C6F6D5;
                    border-color: #48BB78;
                    color: #22543D;
                }
                .sentence-card.wrong {
                    background: #FED7D7;
                    border-color: #F56565;
                    color: #742A2A;
                }
                .intruder-icon {
                    font-size: 1.5rem;
                    min-width: 30px;
                }
                .feedback-area {
                    min-height: 50px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 1.1rem;
                    padding: 10px;
                    border-radius: 10px;
                }
            </style>

            <div class="intruder-container">
                <div class="header-stats">
                    <span>Passage: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>

                <div class="topic-header">Topic: ${data.topic}</div>
                
                <p style="text-align: center; color: #718096; margin: 0;">Tap the "Intruder" sentence that doesn't fit the topic.</p>

                <div class="passage-box" id="passage">
                    ${shuffledSentences.map((s, idx) => `
                        <div class="sentence-card" data-index="${idx}" onclick="checkSentence(${idx}, ${s.belongs})">
                            <span class="intruder-icon">🔍</span>
                            <span>${s.text}</span>
                        </div>
                    `).join('')}
                </div>

                <div id="feedback" class="feedback-area"></div>
            </div>
        `;

        window.checkSentence = (idx, belongs) => {
            const cards = document.querySelectorAll('.sentence-card');
            const feedback = document.getElementById('feedback');
            const selectedCard = cards[idx];

            if (!belongs) {
                // Correctly identified the intruder
                score++;
                selectedCard.classList.add('correct');
                selectedCard.querySelector('.intruder-icon').innerText = "🚫";
                feedback.style.color = "#2F855A";
                feedback.innerHTML = `Great catch! ${data.explanation}`;
                
                document.getElementById('passage').style.pointerEvents = 'none';

                if (window.GameHub) {
                    window.GameHub.playSound('correct');
                    // Get coordinates for VFX
                    const rect = selectedCard.getBoundingClientRect();
                    window.GameHub.triggerVFX(rect.left + rect.width/2, rect.top + rect.height/2);
                }

                setTimeout(() => {
                    if (currentLevel < gameData.length - 1) {
                        currentLevel++;
                        loadLevel(stage);
                    } else {
                        if (window.GameHub?.showComplete) {
                            window.GameHub.showComplete("Topical Expert!", `Score: ${score}. You're great at finding the intruder!`);
                        }
                    }
                }, 2500);
            } else {
                // Tapped a sentence that DOES belong
                selectedCard.classList.add('wrong');
                feedback.style.color = "#C53030";
                feedback.innerHTML = `Wait, that sentence fits the topic! ${data.hint}`;
                
                if (window.GameHub) window.GameHub.playSound('wrong');
                
                setTimeout(() => {
                    selectedCard.classList.remove('wrong');
                }, 1000);
            }
        };
    }
})();