/**
 * Game: Salami Slicer (Syllable Analysis)
 * Filename: syllable_slicer.js
 * Logic: User "slices" a word into syllables using a swipe or click between letters.
 * Dyslexia Focus: Phonological segmentation and syllable awareness.
 */

(function() {
    let currentLevel = 0;
    let slicesFound = [];

    const gameData = [
        { word: "CAT", syllables: ["CAT"], cuts: [], instruction: "One beat: CAT. No cuts needed!" },
        { word: "ROBOT", syllables: ["RO", "BOT"], cuts: [2], instruction: "Slice RO-BOT into two beats!" },
        { word: "PIZZA", syllables: ["PIZ", "ZA"], cuts: [3], instruction: "Slice PIZ-ZA between the Zs!" },
        { word: "TIGER", syllables: ["TI", "GER"], cuts: [2], instruction: "Slice TI-GER!" },
        { word: "CACTUS", syllables: ["CAC", "TUS"], cuts: [3], instruction: "Slice CAC-TUS!" },
        { word: "BANANA", syllables: ["BA", "NA", "NA"], cuts: [2, 4], instruction: "Three beats! Slice BA-NA-NA" },
        { word: "DINOSAUR", syllables: ["DI", "NO", "SAUR"], cuts: [2, 4], instruction: "Slice DI-NO-SAUR" },
        { word: "FANTASTIC", syllables: ["FAN", "TAS", "TIC"], cuts: [3, 6], instruction: "Slice FAN-TAS-TIC" },
        { word: "OCTOPUS", syllables: ["OC", "TO", "PUS"], cuts: [2, 4], instruction: "Slice OC-TO-PUS" },
        { word: "BUTTERFLY", syllables: ["BUT", "TER", "FLY"], cuts: [3, 6], instruction: "Slice BUT-TER-FLY" }
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
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
    }

    function playClap() {
        // Simple synth clap sound using Web Audio or standard emoji-based feedback
        if (window.GameHub?.playSound) {
            window.GameHub.playSound('correct');
        }
    }

    function loadLevel(stage) {
        const data = gameData[currentLevel];
        slicesFound = [];
        
        stage.innerHTML = `
            <style>
                .slicer-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 40px;
                    padding: 20px;
                    font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
                }
                .instruction-box {
                    background: #FFFBEB;
                    padding: 15px 25px;
                    border-radius: 20px;
                    border: 2px solid #F6E05E;
                    text-align: center;
                    font-size: 1.2rem;
                    color: #744210;
                }
                .word-rail {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #F7FAFC;
                    padding: 30px 50px;
                    border-radius: 100px;
                    position: relative;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
                    gap: 0;
                }
                .letter-block {
                    font-size: 4.5rem;
                    font-weight: 900;
                    color: #2D3748;
                    position: relative;
                    z-index: 2;
                }
                .cut-zone {
                    width: 20px;
                    height: 80px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 3;
                    transition: all 0.2s;
                }
                .cut-zone:hover .blade-hint {
                    opacity: 0.5;
                }
                .blade-hint {
                    width: 4px;
                    height: 40px;
                    background: #CBD5E0;
                    border-radius: 2px;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .cut-active .blade-hint {
                    opacity: 1;
                    background: #F56565;
                    height: 100px;
                    width: 6px;
                    box-shadow: 0 0 10px rgba(245, 101, 101, 0.5);
                    transform: rotate(5deg);
                }
                .syllable-gap {
                    width: 40px !important;
                }
                .btn-next {
                    padding: 15px 40px;
                    font-size: 1.2rem;
                    background: #4299E1;
                    color: white;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                }
                .btn-next.show {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0);
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
                    justify-content: flex-start;
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
              <div class="slicer-container">
                <div class="status-row">
                    <div class="level-indicator">Level ${currentLevel + 1} / ${totalLevels}</div>
                </div>
                <div class="instruction-box">${data.instruction}</div>

                <div class="word-rail" id="word-rail">
                    <!-- Letters and Cut Zones generated by JS -->
                </div>

                <button id="next-btn" class="btn-next">Perfect Slicing! →</button>
              </div>
            </div>
        `;

        const rail = document.getElementById('word-rail');
        const nextBtn = document.getElementById('next-btn');

        // Create word blocks
        for (let i = 0; i < data.word.length; i++) {
            const letter = document.createElement('span');
            letter.className = 'letter-block';
            letter.innerText = data.word[i];
            rail.appendChild(letter);

            // Add cut zone between letters, but not after the last letter
            if (i < data.word.length - 1) {
                const zone = document.createElement('div');
                zone.className = 'cut-zone';
                zone.dataset.index = i + 1;
                zone.innerHTML = `<div class="blade-hint"></div>`;
                
                zone.onclick = (e) => handleSlice(zone, parseInt(zone.dataset.index), e);
                rail.appendChild(zone);
            }
        }

        // Special case for single syllable words
        if (data.cuts.length === 0) {
            setTimeout(() => {
                nextBtn.classList.add('show');
                speak(data.word);
            }, 1000);
        }

        function handleSlice(element, index, event) {
            if (slicesFound.includes(index)) return;

            if (data.cuts.includes(index)) {
                slicesFound.push(index);
                element.classList.add('cut-active');
                element.classList.add('syllable-gap');
                
                playClap();
                if (window.GameHub) window.GameHub.triggerVFX(event.clientX, event.clientY);
                
                // Speak the syllable just cut
                const sylIdx = data.cuts.indexOf(index);
                speak(data.syllables[sylIdx]);

                if (slicesFound.length === data.cuts.length) {
                    setTimeout(() => {
                        speak(data.word);
                        nextBtn.classList.add('show');
                    }, 500);
                }
            } else {
                // Wrong cut animation
                element.style.background = "rgba(255,0,0,0.1)";
                setTimeout(() => element.style.background = "transparent", 300);
            }
        }

        nextBtn.onclick = () => {
            if (currentLevel < totalLevels - 1) {
                currentLevel++;
                loadLevel(stage);
            } else {
                if (window.GameHub?.showComplete) {
                    window.GameHub.showComplete("Master Slicer!", "You can break down any word!");
                }
            }
        };
    }
})();