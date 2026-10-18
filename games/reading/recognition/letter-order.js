/**
Game 6: Sound Train (Phonics & Sound Position)
Filename: games/read_d1_g6.js
Logic: Identify if the target sound is at the Start, Middle, or End of the word.
Dyslexia Focus: Phonological awareness, sequential processing, and auditory-spatial mapping.
*/
(function() {
    let levelIndex = 0;
    const totalLevels = 15;
    let score = 0;
    let currentStage = null;

    // Simplified data using actual letters instead of IPA symbols for early readers
    const gameData = [
        { word: "bus", emoji: "🚌", sound: "b", pos: 0 },
        { word: "dog", emoji: "🐶", sound: "d", pos: 0 },
        { word: "map", emoji: "🗺️", sound: "m", pos: 0 },
        { word: "sun", emoji: "☀️", sound: "s", pos: 0 },
        { word: "bed", emoji: "🛏️", sound: "d", pos: 2 },
        { word: "box", emoji: "📦", sound: "x", pos: 2 },
        { word: "lip", emoji: "👄", sound: "p", pos: 2 },
        { word: "hen", emoji: "🐔", sound: "e", pos: 1 },
        { word: "cup", emoji: "☕", sound: "u", pos: 1 },
        { word: "six", emoji: "6️⃣", sound: "i", pos: 1 },
        { word: "frog", emoji: "🐸", sound: "f", pos: 0 },
        { word: "clock", emoji: "🕒", sound: "c", pos: 0 },
        { word: "snake", emoji: "🐍", sound: "s", pos: 0 },
        { word: "ship", emoji: "🚢", sound: "sh", pos: 0 },
        { word: "fish", emoji: "🐟", sound: "sh", pos: 2 }
    ];

    function speakWord(word, slow = false) {
        if (window.GameHub && typeof window.GameHub.speak === 'function') {
            window.GameHub.speak(word, 'en-US');
        }
    }

    window.initGame = function(containerId) {
        currentStage = document.getElementById(containerId);
        if (!currentStage) return;
        levelIndex = 0;
        score = 0;
        renderLevel(currentStage);
    };

    function nextRound() {
        if (levelIndex < gameData.length - 1) {
            levelIndex++;
            renderLevel(currentStage);
        } else {
            if (window.GameHub?.showComplete) {
                window.GameHub.showComplete("Great Job! 🚂", `You found all the sounds! Score: ${score}/${totalLevels}`);
            }
        }
    }

    function previousRound() {
        if (levelIndex > 0) {
            levelIndex--;
            renderLevel(currentStage);
        }
    }

    function renderLevel(stage) {
        const data = gameData[levelIndex];
        let buttonMistakes = { 0: 0, 1: 0, 2: 0 };
        
        stage.innerHTML = `
            <style>
                .game-wrapper {
                    display: flex; flex-direction: column; align-items: center; gap: 15px;
                    width: 100%; max-width: 700px; margin: 0 auto; padding: 20px;
                    font-family: 'Nunito', 'Segoe UI', sans-serif; animation: fadeIn 0.5s ease;
                }
                .status-row { display: flex; width: 100%; justify-content: space-between; align-items: center; gap: 10px; }
                .instruction-text { font-size: 1.6rem; color: #2D3748; font-weight: 800; text-align: center; }
                .target-prompt {
                    font-size: 1.3rem; color: #4A5568; background: #EBF8FF; padding: 8px 20px;
                    border-radius: 10px; border: 2px dashed #4299E1; font-weight: 600;
                }
                .target-sound {
                    color: #E53E3E; font-size: 2rem; font-weight: 900; 
                    display: inline-block; text-transform: uppercase;
                }
                .image-display {
                    font-size: 5rem; background: white; width: 130px; height: 130px; display: flex;
                    align-items: center; justify-content: center; border-radius: 20px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 0px; cursor: pointer;
                    transition: transform 0.2s, background-color 0.2s; border: 3px solid #E2E8F0;
                }
                .image-display:hover { background: #F7FAFC; border-color: #4299E1; transform: scale(1.03); }
                .image-display:active { transform: scale(0.95); }
                .hint-audio-text { font-size: 0.9rem; color: #718096; margin-top: -5px; font-weight: 600; }
                .word-reveal {
                    font-size: 2.5rem; font-weight: 800; letter-spacing: 3px; color: #48BB78;
                    opacity: 0; transform: translateY(10px); transition: all 0.5s ease; height: 40px;
                }
                .word-reveal.show { opacity: 1; transform: translateY(0); }
                .train-track {
                    display: flex; align-items: center; background: #CBD5E0; padding: 15px;
                    border-radius: 15px; box-shadow: inset 0 4px 6px rgba(0,0,0,0.1);
                }
                .locomotive { font-size: 3rem; margin-right: -10px; z-index: 2; }
                .connector { width: 15px; height: 10px; background: #4A5568; z-index: 1; }
                .train-car {
                    width: 80px; height: 70px; background: #EDF2F7; border: 4px solid #718096;
                    border-radius: 8px; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.3s ease; position: relative; box-shadow: 0 4px 0 #4A5568;
                }
                .train-car::after {
                    content: '⚫⚫'; position: absolute; bottom: -15px; font-size: 14px; letter-spacing: 20px; color: #2D3748;
                }
                .train-car:hover { background: #E2E8F0; border-color: #4299E1; }
                .train-car.selected { background: #48BB78; border-color: #276749; }
                .train-car.disabled { opacity: 0.2; pointer-events: none; filter: grayscale(100%); }
                .level-indicator { font-size: 14px; font-weight: bold; color: #718096; background: #EDF2F7; padding: 6px 16px; border-radius: 20px; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
            </style>
            <div class="game-wrapper">
                <div class="status-row">
                    <button id="prev-btn" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color:#4A5568; visibility: ${levelIndex > 0 ? 'visible' : 'hidden'};">⬅️ Back</button>
                    <div class="level-indicator">Level ${levelIndex + 1} / ${totalLevels}</div>
                </div>
                
                <div class="instruction-text">Where is the sound?</div>
                <div class="target-prompt">
                    Find: <span class="target-sound">${data.sound}</span>
                </div>
                
                <div class="image-display" id="play-sound-btn" title="Tap to hear">${data.emoji}</div>
                
                <div class="word-reveal" id="hidden-word">${data.word}</div>
                
                <div class="train-track">
                    <div class="locomotive">🚂</div>
                    <div class="connector"></div>
                    <div class="train-car" data-pos="0" title="Start"></div>
                    <div class="connector"></div>
                    <div class="train-car" data-pos="1" title="Middle"></div>
                    <div class="connector"></div>
                    <div class="train-car" data-pos="2" title="End"></div>
                </div>
            </div>
        `;
        
        const prevBtn = stage.querySelector('#prev-btn');
        if (prevBtn) prevBtn.onclick = previousRound;

        const soundBtn = stage.querySelector('#play-sound-btn');
        soundBtn.onclick = () => {
            speakWord(data.word);
            soundBtn.style.transform = "scale(0.93)";
            setTimeout(() => soundBtn.style.transform = "scale(1)", 150);
        };
        
        const cars = stage.querySelectorAll('.train-car');
        cars.forEach(car => {
            car.onclick = (e) => {
                const selectedPos = parseInt(car.dataset.pos);
                if (selectedPos === data.pos) {
                    car.classList.add('selected');
                    document.getElementById('hidden-word').classList.add('show');
                    score++;
                    cars.forEach(c => c.style.pointerEvents = 'none');
                    if (window.GameHub) {
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                        window.GameHub.playSound('correct');
                    }
                    setTimeout(() => speakWord(data.word), 400);
                    setTimeout(() => nextRound(), 2200);
                } else {
                    buttonMistakes[selectedPos]++;
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    if (buttonMistakes[selectedPos] === 1) {
                        car.style.animation = "shake 0.4s ease";
                        car.style.borderColor = "#F56565";
                        car.style.background = "#FFF5F5";
                        setTimeout(() => speakWord(data.word, true), 300);
                        setTimeout(() => {
                            car.style.animation = "";
                            car.style.borderColor = "#718096";
                            car.style.background = "#EDF2F7";
                        }, 500);
                    } else {
                        car.classList.add('disabled');
                    }
                }
            };
        });
        
        setTimeout(() => {
            speakWord(data.word, true);
        }, 600);
    }
    
    window.nextRound = nextRound;
    window.previousRound = previousRound;
})();