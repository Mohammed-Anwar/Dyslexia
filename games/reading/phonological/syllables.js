/**
 * Game: Syllable Robot Drums
 * Category: Phonological Awareness
 * Logic: Robot speaks a word syllable by syllable with mouth animation, child counts syllables and hits the correct drum.
 */

(function() {
    let currentLevel = 0;
    let isPlaying = false;
    let synth = window.speechSynthesis;

    // Game data merged from Salami Slicer but adapted for syllable counting
    const gameData = [
        { word: "CAT", syllables: ["CAT", "CAT"], instruction: "How many beats in CAT?" },
        { word: "ROBOT", syllables: ["ROBOT", "RO", "BOT"], instruction: "How many beats in RO-BOT?" },
        { word: "PIZZA", syllables: ["PIZZA", "PIZ", "ZA"], instruction: "How many beats in PIZ-ZA?" },
        { word: "TIGER", syllables: ["TIGER", "TI", "GER"], instruction: "How many beats in TI-GER?" },
        { word: "CACTUS", syllables: ["CACTUS", "CAC", "TUS"], instruction: "How many beats in CAC-TUS?" },
        { word: "BANANA", syllables: ["BANANA", "BA", "NA", "NA"], instruction: "How many beats in BA-NA-NA?" },
        { word: "DINOSAUR", syllables: ["DINOSAUR", "DI", "NO", "SAUR"], instruction: "How many beats in DI-NO-SAUR?" },
        { word: "FANTASTIC", syllables: ["FANTASTIC", "FAN", "TAS", "TIC"], instruction: "How many beats in FAN-TAS-TIC?" },
        { word: "OCTOPUS", syllables: ["OCTOPUS", "OC", "TO", "PUS"], instruction: "How many beats in OC-TO-PUS?" },
        { word: "BUTTERFLY", syllables: ["BUTTERFLY", "BUT", "TER", "FLY"], instruction: "How many beats in BUT-TER-FLY?" }
    ];

    const totalLevels = gameData.length;
    const mouthShapes = ['a', 'e', 'o'];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 0;
        
        // Setup initial UI layout and styles scoped to this game
        stage.innerHTML = `
            <style>
                #robot-game-container {
                    --outline: #191932;
                    --shell: #eef1f8;
                    --shell-shade: #cfd5e4;
                    --screen: #1c3c4c;
                    --screen-dark: #152e3b;
                    --cyan: #5ceef7;
                    --cyan-deep: #37c9d6;
                    --primary: #4299E1;
                    
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Segoe UI', sans-serif;
                }

                .rg-header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    align-items: center;
                }

                .rg-level-indicator {
                    background: #EDF2F7;
                    color: #4A5568;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 1.1rem;
                }

                .rg-instruction {
                    background: #FFFBEB;
                    padding: 15px 25px;
                    border-radius: 20px;
                    border: 2px solid #F6E05E;
                    text-align: center;
                    font-size: 1.3rem;
                    color: #744210;
                    font-weight: bold;
                    width: 100%;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .rg-listen-btn {
                    background: #ED8936;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 0 #C05621;
                    transition: all 0.1s;
                }
                .rg-listen-btn:active { transform: translateY(4px); box-shadow: 0 0 0 #C05621; }
                .rg-listen-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                /* Robot Styles */
                .rg-robot-wrapper {
                    position: relative;
                    transform: scale(0.7);
                    margin: -50px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .rg-robot { position: relative; width: 320px; height: 430px; animation: rg-float 3.4s ease-in-out infinite; }
                @keyframes rg-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

                .rg-antenna {
                    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
                    width: 120px; height: 52px;
                    background: linear-gradient(180deg,var(--shell),var(--shell-shade));
                    border: 6px solid var(--outline); border-bottom: none;
                    border-radius: 60px 60px 0 0;
                }
                .rg-ear {
                    position: absolute; top: 96px; width: 52px; height: 92px;
                    background: linear-gradient(180deg,var(--shell),var(--shell-shade));
                    border: 6px solid var(--outline); border-radius: 26px;
                }
                .rg-ear.left { left: 6px; } .rg-ear.right { right: 6px; }

                .rg-head {
                    position: absolute; top: 22px; left: 50%; transform: translateX(-50%);
                    width: 300px; height: 212px; z-index: 2;
                    background: linear-gradient(180deg,#f4f6fb 20%,var(--shell-shade));
                    border: 6px solid var(--outline); border-radius: 86px;
                }
                
                .rg-screen {
                    position: absolute; inset: 18px 16px;
                    background: linear-gradient(160deg,var(--screen) 55%,var(--screen-dark));
                    border: 5px solid var(--outline); border-radius: 64px;
                    overflow: hidden;
                }

                .rg-eye {
                    position: absolute; top: 50px; width: 58px; height: 33px;
                    background: var(--cyan); border-radius: 60px 60px 10px 10px;
                    animation: rg-blink 4.6s infinite;
                }
                .rg-eye.left { left: 46px; } .rg-eye.right { right: 46px; }
                @keyframes rg-blink { 0%,90%,100%{transform:scaleY(1)} 93%,96%{transform:scaleY(.12)} }

                /* Mouth Animation */
                .rg-mouth {
                    position: absolute; left: 50%; top: 112px;
                    width: 42px; height: 21px;
                    transform: translateX(-50%);
                    background: var(--cyan);
                    border-radius: 8px 8px 40px 40px;
                    transition: all .2s cubic-bezier(.6,-.4,.3,1.4);
                }
                .rg-mouth::after {
                    content: ''; position: absolute; top: 4px; left: 8px; right: 8px; height: 8px;
                    background: #fff; border-radius: 4px; opacity: 0; transition: opacity .2s;
                }
                .rg-mouth::before {
                    content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
                    width: 60%; height: 35%; background: var(--cyan-deep);
                    border-radius: 50% 50% 40% 40%; opacity: 0; transition: opacity .2s;
                }
                
                .rg-mouth.o { width: 54px; height: 54px; top: 96px;  border-radius: 50%; }                  
                .rg-mouth.e { width: 96px; height: 26px; top: 110px; border-radius: 12px; }                 
                .rg-mouth.e::after { opacity: 1; }
                .rg-mouth.a { width: 50px; height: 62px; top: 92px; border-radius: 26px 26px 32px 32px; }   
                .rg-mouth.o::before, .rg-mouth.a::before { opacity: 1; }

                .rg-mouth.talking { animation: rg-talk .3s ease-in-out infinite alternate; }
                @keyframes rg-talk { from{transform:translateX(-50%) scale(1)} to{transform:translateX(-50%) scale(1.2)} }

                .rg-neck {
                    position: absolute; top: 226px; left: 50%; transform: translateX(-50%);
                    width: 118px; height: 46px; z-index: 1;
                    background: var(--shell-shade);
                    border: 6px solid var(--outline); border-radius: 0 0 30px 30px;
                }
                .rg-arm {
                    position: absolute; top: 268px; width: 64px; height: 140px; z-index: 1;
                    background: linear-gradient(180deg,#eef1f8,#d5dae8);
                    border: 6px solid var(--outline); border-radius: 40px;
                }
                .rg-arm.left { left: 16px;  transform: rotate(14deg); }
                .rg-arm.right { right: 16px; transform: rotate(-14deg); }
                .rg-body {
                    position: absolute; top: 252px; left: 50%; transform: translateX(-50%);
                    width: 212px; height: 170px; z-index: 2;
                    background: linear-gradient(180deg,#f4f6fb,var(--shell-shade));
                    border: 6px solid var(--outline);
                    border-radius: 50% 50% 50% 50% / 58% 58% 44% 44%;
                }
                .rg-chest { position: absolute; top: 344px; left: 50%; transform: translateX(-50%); z-index: 3; color: var(--cyan); }
                
                /* Drums Section */
                .rg-drums-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                    width: 100%;
                    margin-top: -20px;
                }
                .rg-drums-container {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                }
                .rg-drum-btn {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 5px solid var(--outline);
                    background: linear-gradient(145deg, #ffffff, #e6e6e6);
                    color: var(--outline);
                    font-size: 2rem;
                    font-weight: 900;
                    cursor: pointer;
                    box-shadow: 0 8px 0 var(--outline);
                    transition: all 0.15s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .rg-drum-btn span { font-size: 1rem; margin-top: -5px; }
                .rg-drum-btn:hover:not(:disabled) { transform: translateY(-2px); }
                .rg-drum-btn:active:not(:disabled) { transform: translateY(8px); box-shadow: 0 0px 0 var(--outline); }
                .rg-drum-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                
                .rg-drum-btn.correct { background: #48BB78; color: white; border-color: #2F855A; box-shadow: 0 8px 0 #2F855A; }
                .rg-drum-btn.wrong { background: #F56565; color: white; border-color: #C53030; box-shadow: 0 8px 0 #C53030; }

                /* Start overlay for audio context */
                #rg-start-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(255,255,255,0.9); z-index: 100;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    border-radius: 20px;
                }
                .rg-start-btn {
                    padding: 15px 40px; font-size: 1.5rem; background: var(--primary);
                    color: white; border: none; border-radius: 30px; cursor: pointer;
                    font-weight: bold; box-shadow: 0 5px 0 #2b6cb0;
                }
            </style>

            <div id="robot-game-container">
                <div id="rg-start-overlay">
                    <h2 style="font-size:2rem; color:#2D3748; margin-bottom: 20px;">Syllable Robot 🤖🥁</h2>
                    <button class="rg-start-btn" id="rg-start-btn">Start Playing!</button>
                </div>

                <div class="rg-header">
                    <div class="rg-level-indicator" id="rg-level-text">Level 1 / 10</div>
                    <button class="rg-listen-btn" id="rg-listen-btn">👂 Listen</button>
                </div>

                <div class="rg-instruction" id="rg-instruction-text">Tap start to play!</div>

                <div class="rg-robot-wrapper">
                    <div class="rg-robot">
                        <div class="rg-antenna"></div>
                        <div class="rg-ear left"></div>
                        <div class="rg-ear right"></div>
                        <div class="rg-head">
                            <div class="rg-screen">
                                <div class="rg-eye left"></div>
                                <div class="rg-eye right"></div>
                                <div class="rg-mouth" id="rg-robot-mouth"></div>
                            </div>
                        </div>
                        <div class="rg-neck"></div>
                        <div class="rg-arm left"></div>
                        <div class="rg-arm right"></div>
                        <div class="rg-body"></div>
                        <svg class="rg-chest" width="190" height="24" viewBox="0 0 190 24">
                            <path d="M4 6 H66 V16 H124 V6 H186" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>

                <div class="rg-drums-section">
                    <div class="rg-drums-container">
                        <button class="rg-drum-btn" data-beats="1">1 <span>🥁</span></button>
                        <button class="rg-drum-btn" data-beats="2">2 <span>🥁</span></button>
                        <button class="rg-drum-btn" data-beats="3">3 <span>🥁</span></button>
                        <button class="rg-drum-btn" data-beats="4">4 <span>🥁</span></button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('rg-start-btn').addEventListener('click', () => {
            document.getElementById('rg-start-overlay').style.display = 'none';
            // Init speech context
            let utter = new SpeechSynthesisUtterance("");
            synth.speak(utter);
            loadLevel();
        });

        document.getElementById('rg-listen-btn').addEventListener('click', playCurrentWord);

        const drumBtns = document.querySelectorAll('.rg-drum-btn');
        drumBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const beats = parseInt(e.currentTarget.getAttribute('data-beats'));
                checkAnswer(beats, e.currentTarget);
            });
        });
    };

    function loadLevel() {
        const data = gameData[currentLevel];
        document.getElementById('rg-level-text').innerText = `Level ${currentLevel + 1} / ${totalLevels}`;
        
        const drumBtns = document.querySelectorAll('.rg-drum-btn');
        drumBtns.forEach(btn => {
            btn.className = 'rg-drum-btn';
            btn.disabled = false;
        });

        // Small delay before auto-playing
        setTimeout(() => {
            playCurrentWord();
        }, 800);
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function speakSyllable(text) {
        return new Promise((resolve) => {
            if (!synth) {
                animateMouth();
                setTimeout(resolve, 600);
                return;
            }

            synth.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US';
            u.rate = 0.7;  // Speak slowly
            u.pitch = 1.3; // Robot pitch
            
            u.onstart = () => animateMouth();
            u.onend = () => {
                resetMouth();
                resolve();
            };
            u.onerror = () => {
                resetMouth();
                resolve();
            };
            
            synth.speak(u);
        });
    }

    function animateMouth() {
        const mouth = document.getElementById('rg-robot-mouth');
        if (!mouth) return;
        const randomShape = mouthShapes[Math.floor(Math.random() * mouthShapes.length)];
        mouth.className = `rg-mouth ${randomShape} talking`;
    }

    function resetMouth() {
        const mouth = document.getElementById('rg-robot-mouth');
        if (mouth) mouth.className = 'rg-mouth';
    }

    async function playCurrentWord() {
        if (isPlaying) return;
        isPlaying = true;
        
        document.getElementById('rg-listen-btn').disabled = true;
        const drumBtns = document.querySelectorAll('.rg-drum-btn');
        drumBtns.forEach(btn => btn.disabled = true);
        
        const data = gameData[currentLevel];
        document.getElementById('rg-instruction-text').innerText = "🤖 Listening...";

        await sleep(300);

        for (let i = 0; i < data.syllables.length; i++) {
            await speakSyllable(data.syllables[i]);
            await sleep(400); // Pause between syllables to simulate robotic segmentation
        }

        isPlaying = false;
        document.getElementById('rg-listen-btn').disabled = false;
        drumBtns.forEach(btn => btn.disabled = false);
        document.getElementById('rg-instruction-text').innerText = data.instruction;
    }

    function checkAnswer(selectedBeats, clickedBtn) {
        if (isPlaying) return;
        
        const data = gameData[currentLevel];
        const correctBeats = data.syllables.length;
        const mouth = document.getElementById('rg-robot-mouth');

        if (selectedBeats === correctBeats-1) {
            // Correct logic
            clickedBtn.classList.add('correct');
            document.getElementById('rg-instruction-text').innerText = "Awesome! Correct!";
            
            if (mouth) mouth.className = 'rg-mouth'; // Smile
            
            // Trigger Hub functions
            if (window.GameHub) {
                window.GameHub.playSound('correct');
                const rect = clickedBtn.getBoundingClientRect();
                window.GameHub.triggerVFX(rect.left + rect.width/2, rect.top);
            }

            const drumBtns = document.querySelectorAll('.rg-drum-btn');
            drumBtns.forEach(btn => btn.disabled = true);
            document.getElementById('rg-listen-btn').disabled = true;

            setTimeout(() => {
                if (currentLevel < totalLevels - 1) {
                    currentLevel++;
                    loadLevel();
                } else {
                    if (window.GameHub && window.GameHub.showComplete) {
                        window.GameHub.showComplete("Robot Master! 🤖", "You are amazing at counting syllables!");
                    }
                }
            }, 1500);

        } else {
            // Wrong logic
            clickedBtn.classList.add('wrong');
            document.getElementById('rg-instruction-text').innerText = "Oops! Listen again and count the beats.";
            
            if (mouth) {
                mouth.className = 'rg-mouth o'; // Surprised face
                setTimeout(() => resetMouth(), 1000);
            }

            if (window.GameHub) window.GameHub.playSound('wrong');

            setTimeout(() => {
                clickedBtn.classList.remove('wrong');
            }, 600);
        }
    }

})();