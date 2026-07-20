/**
 * Game: Invisible Ink (Spoken Sounds Not Written)
 * Filename: invisible_ink.js
 * Logic: User hears a word with a 'hidden' phoneme and selects the missing sound from options.
 * Dyslexia Focus: Bridging the gap between speech and writing (Phonemic awareness).
 */

(function() {
    let currentLevel = 0;

    const gameData = [
        { 
            word: "ONE", 
            missingSound: "W", 
            options: ["W", "O", "V"], 
            instruction: "Listen: 'ONE'. What sound do you hear at the start that isn't written?",
            explanation: "In 'ONE', we hear a 'W' sound even though it starts with 'O'!"
        },
        { 
            word: "UNION", 
            missingSound: "Y", 
            options: ["U", "Y", "J"], 
            instruction: "Listen: 'UNION'. What hidden sound starts this word?",
            explanation: "We say 'Y-UNION', adding a tiny 'Y' sound at the beginning."
        },
        { 
            word: "MUSIC", 
            missingSound: "Y", 
            options: ["I", "Y", "E"], 
            instruction: "Listen: 'MUSIC'. There is a hidden sound after the 'M'...",
            explanation: "It sounds like 'M-Y-USIC'!"
        },
        { 
            word: "CHOIR", 
            missingSound: "W", 
            options: ["Q", "W", "H"], 
            instruction: "Listen: 'CHOIR'. What hidden sound is in the middle?",
            explanation: "The 'OI' in choir sounds like 'QU-W-IRE'!"
        },
        { 
            word: "USE", 
            missingSound: "Y", 
            options: ["Y", "U", "W"], 
            instruction: "Listen: 'USE'. What sound is at the very start?",
            explanation: "Long 'U' at the start of words often carries a hidden 'Y' sound."
        }
    ];

    const totalLevels = gameData.length;

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 0;
        loadLevel(stage);
    };

    function speak(text) {
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
                .ink-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
                }
                .instruction-box {
                    background: #F0FFF4;
                    padding: 20px;
                    border-radius: 20px;
                    border: 2px solid #68D391;
                    text-align: center;
                    font-size: 1.2rem;
                    color: #22543D;
                    max-width: 500px;
                }
                .word-paper {
                    background: #FEFCBF;
                    padding: 40px 80px;
                    border-radius: 10px;
                    box-shadow: 5px 5px 0px #ECC94B;
                    font-size: 5rem;
                    font-weight: 900;
                    color: rgba(0,0,0,0.1); /* Invisible Ink effect */
                    position: relative;
                    border: 1px solid #FAF089;
                    cursor: pointer;
                    transition: color 0.5s ease;
                }
                .word-paper.revealed {
                    color: #744210;
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    width: 100%;
                    max-width: 400px;
                }
                .option-btn {
                    padding: 20px;
                    font-size: 2rem;
                    font-weight: bold;
                    background: white;
                    border: 3px solid #E2E8F0;
                    border-radius: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #4A5568;
                }
                .option-btn:hover {
                    transform: translateY(-5px);
                    border-color: #4299E1;
                }
                .option-btn.correct {
                    background: #C6F6D5;
                    border-color: #48BB78;
                    color: #22543D;
                }
                .option-btn.wrong {
                    background: #FED7D7;
                    border-color: #F56565;
                    color: #742A2A;
                }
                .feedback-text {
                    height: 24px;
                    font-weight: bold;
                    color: #4A5568;
                    text-align: center;
                }
                .game-stage {
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    min-height:60vh;
                    padding:20px;
                    box-sizing:border-box;
                }
                .status-row {
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                }
                .level-indicator {
                    background: #EDF2F7;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-weight: bold;
                    color: #4A5568;
                }
            </style>

<div class="game-stage">
              <div class="ink-container">
                <div class="status-row">
                    <div class="level-indicator">Level ${currentLevel + 1} / ${totalLevels}</div>
                </div>

                <div class="instruction-box">
                    ${data.instruction}
                </div>

                <div class="word-paper" id="word-paper">
                    ${data.word}
                </div>
                
                <div class="feedback-text" id="feedback">Click the paper to hear the word!</div>

                <div class="options-grid" id="options">
                    <!-- Options generated by JS -->
                </div>
              </div>
            </div>
        `;

        const paper = document.getElementById('word-paper');
        const optionsContainer = document.getElementById('options');
        const feedback = document.getElementById('feedback');

        paper.onclick = () => {
            paper.classList.add('revealed');
            speak(data.word);
        };

        data.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            
            btn.onclick = (e) => {
                if (opt === data.missingSound) {
                    btn.classList.add('correct');
                    feedback.innerText = data.explanation;
                    feedback.style.color = "#2F855A";
                    if (window.GameHub) {
                        window.GameHub.playSound('correct');
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                    }
                    
                    // Disable other buttons
                    Array.from(optionsContainer.children).forEach(b => b.style.pointerEvents = 'none');
                    
                    setTimeout(() => {
                        if (currentLevel < totalLevels - 1) {
                            currentLevel++;
                            loadLevel(stage);
                        } else {
                            if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("Phoneme Detective!", "You can hear sounds that aren't even there!");
                            }
                        }
                    }, 3000);
                } else {
                    btn.classList.add('wrong');
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    setTimeout(() => btn.classList.remove('wrong'), 500);
                }
            };
            
            optionsContainer.appendChild(btn);
        });

        // Initial voice prompt
        setTimeout(() => speak(data.word), 500);
    }
})();