/**
 * Game: Vowel Accordion (Short vs Long Vowels)
 * Filename: vowel_accordion.js
 * Logic: User "stretches" a short vowel word into a long vowel word using an accordion animation.
 * Dyslexia Focus: Phonological awareness of vowel duration and the "Silent E" rule.
 */

(function() {
    let currentLevel = 0;
    let isStretched = false;

    const gameData = [
        { short: "HOP", long: "HOPE", shortSound: "hop", longSound: "hope", instruction: "Add 'E' to make the 'O' long!" },
        { short: "CAN", long: "CANE", shortSound: "can", longSound: "cane", instruction: "Stretch 'A' into a long sound!" },
        { short: "KIT", long: "KITE", shortSound: "kit", longSound: "kite", instruction: "Make the 'I' say its name!" },
        { short: "TAP", long: "TAPE", shortSound: "tap", longSound: "tape", instruction: "Add 'E' to change the sound!" },
        { short: "PIN", long: "PINE", shortSound: "pin", longSound: "pine", instruction: "Watch the 'I' stretch!" },
        { short: "NOT", long: "NOTE", shortSound: "not", longSound: "note", instruction: "From 'ah' to 'oh'!" },
        { short: "CUB", long: "CUBE", shortSound: "cub", longSound: "cube", instruction: "Stretch the 'U' sound!" },
        { short: "MAD", long: "MADE", shortSound: "mad", longSound: "made", instruction: "Add the magic E!" },
        { short: "BIT", long: "BITE", shortSound: "bit", longSound: "bite", instruction: "Make it a long 'I'!" },
        { short: "TUB", long: "TUBE", shortSound: "tub", longSound: "tube", instruction: "Stretch the 'U'!" }
    ];

    const totalLevels = gameData.length;

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 0;
        loadLevel(stage);
    };

    function speak(text, rate = 0.8) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = rate;
        window.speechSynthesis.speak(utter);
    }

    function loadLevel(stage) {
        const data = gameData[currentLevel];
        isStretched = false;

        stage.innerHTML = `
            <style>
                .game-stage {
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    min-height:60vh;
                    padding:20px;
                    box-sizing:border-box;
                }
                .accordion-container {
                    max-width: 780px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                    padding: 20px;
                    font-family: 'OpenDyslexic', 'Helvetica Neue', Arial, sans-serif;
                    box-sizing: border-box;
                }
                .instruction-box {
                    background: #F7FAFC;
                    padding: 15px 25px;
                    border-radius: 20px;
                    border: 2px dashed #CBD5E0;
                    text-align: center;
                    font-size: 1.2rem;
                    color: #4A5568;
                }
                .word-display {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff;
                    padding: 40px;
                    border-radius: 30px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    min-width: 300px;
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    user-select: none;
                }
                .letter {
                    font-size: 5rem;
                    font-weight: 800;
                    color: #2D3748;
                    display: inline-block;
                    transition: all 0.5s ease;
                }
                .magic-e {
                    color: #ED64A6;
                    opacity: 0;
                    transform: scale(0) rotate(-20deg);
                    width: 0;
                    overflow: hidden;
                }
                .stretched .magic-e {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                    width: auto;
                    margin-left: 10px;
                }
                .stretched .word-display {
                    padding-left: 60px;
                    padding-right: 60px;
                    background: #FFF5F7;
                    border: 3px solid #ED64A6;
                }
                .vowel {
                    color: #4299E1;
                }
                .stretched .vowel {
                    transform: scaleX(1.3);
                    color: #ED64A6;
                }
                .btn-submit {
                    margin-top: 20px;
                    padding: 15px 40px;
                    font-size: 1.2rem;
                    background: #48BB78;
                    color: white;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    box-shadow: 0 4px 14px rgba(72, 187, 120, 0.4);
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                }
                .btn-submit.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .hint {
                    color: #A0AEC0;
                    font-size: 0.9rem;
                    margin-top: 10px;
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
              <div class="accordion-container">
                <div class="status-row">
                    <div class="level-indicator">Level ${currentLevel + 1} / ${totalLevels}</div>
                </div>

                <div class="instruction-box">
                    <strong>Level ${currentLevel + 1}:</strong><br>
                    ${data.instruction}
                </div>

                <div id="accordion-trigger" class="word-display">
                    <span class="letter">${data.short[0]}</span>
                    <span class="letter vowel">${data.short[1]}</span>
                    <span class="letter">${data.short[2]}</span>
                    <span class="letter magic-e">E</span>
                </div>

                <div class="hint">Tap the word to stretch the sound!</div>

                <button id="next-level" class="btn-submit">Correct! Next Word →</button>
              </div>
            </div>
        `;

        const trigger = document.getElementById('accordion-trigger');
        const nextBtn = document.getElementById('next-level');

        trigger.onclick = () => {
            isStretched = !isStretched;
            if (isStretched) {
                trigger.parentElement.classList.add('stretched');
                speak(data.longSound, 0.6); // Slow for emphasis
                nextBtn.classList.add('show');
                if (window.GameHub) window.GameHub.triggerVFX(window.innerWidth/2, window.innerHeight/2);
            } else {
                trigger.parentElement.classList.remove('stretched');
                speak(data.shortSound, 0.9);
                nextBtn.classList.remove('show');
            }
        };

        nextBtn.onclick = () => {
            if (currentLevel < gameData.length - 1) {
                currentLevel++;
                loadLevel(stage);
            } else {
                if (window.GameHub?.showComplete) {
                    window.GameHub.showComplete(
                        "Accordion Master!", 
                        "You've mastered the long and short vowels!"
                    );
                }
            }
        };

        // Initial sound
        setTimeout(() => speak(data.shortSound), 500);
    }
})();