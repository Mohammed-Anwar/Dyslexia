/**
 * Game: Vowel Accordion & Sound Sort (Short vs Long Vowels)
 * Filename: vowel_accordion.js
 *
 * Two mini-games merged into one leveled experience:
 *  1) "Accordion" levels — the user stretches a short-vowel word into a
 *     long-vowel word (Silent E rule), using a magic wand trigger and a
 *     picture cue for each word.
 *  2) "Sort" levels — the game speaks a word out loud AND shows its emoji,
 *     and the child drags that emoji into the box that matches its vowel
 *     length (short vs. long). Clicking a box simply plays its word.
 *
 * Levels alternate accordion → sort, one pair per vowel (A, I, O), for a
 * short, focused 6-level session.
 */

(function() {
    let currentLevel = 0;
    let isStretched = false; // accordion levels only

    // ---------------------------------------------------------------
    // LEVEL DATA — 6 levels total: accordion + sort, paired per vowel.
    // ---------------------------------------------------------------
    const gameData = [
        { type: 'accordion', short: "CAN", long: "CANE", shortSound: "can", longSound: "cane", icon: "🦯", instruction: "Stretch 'A' into a long sound!" },
        {
            type: 'sort', vowel: 'A',
            shortWords: [
                //{ word: "Cat", icon: "🐱" },
                { word: "Man", icon: "👨" },
                //{ word: "Hat", icon: "🎩" },
                { word: "Dad", icon: "👨‍👧" }
            ],
            longWords: [
                //{ word: "Cake", icon: "🎂" },
                { word: "Lake", icon: "🏞️" },
                //{ word: "Tape", icon: "📼" },
                { word: "Gate", icon: "🚪" }
            ],
            shortIcon: "🐱", shortLabel: "Cat",
            longIcon: "🎂", longLabel: "Cake"
        },

        { type: 'accordion', short: "KIT", long: "KITE", shortSound: "kit", longSound: "kite", icon: "🪁", instruction: "Make the 'I' say its name!" },
        {
            type: 'sort', vowel: 'I',
            shortWords: [
                //{ word: "Pig", icon: "🐷" },
                //{ word: "Six", icon: "6️⃣" },
                { word: "Pin", icon: "📌" },
                { word: "Win", icon: "🏆" }
            ],
            longWords: [
                { word: "Five", icon: "5️⃣" },
                //{ word: "Nine", icon: "9️⃣" },
                //{ word: "Kite", icon: "🪁" },
                { word: "Bike", icon: "🚲" }
            ],
            shortIcon: "🐷", shortLabel: "Pig",
            longIcon: "🪁", longLabel: "Kite"
        },

        { type: 'accordion', short: "NOT", long: "NOTE", shortSound: "not", longSound: "note", icon: "📝", instruction: "From 'ah' to 'oh'!" },
        {
            type: 'sort', vowel: 'O',
            shortWords: [
                { word: "Fox", icon: "🦊" },
                { word: "Box", icon: "📦" },
                { word: "Hot", icon: "🥵" }
            ],
            longWords: [
                { word: "Bone", icon: "🦴" },
                { word: "Rope", icon: "🪢" },
                { word: "Home", icon: "🏠" }
            ],
            shortIcon: "🦊", shortLabel: "Fox",
            longIcon: "🦴", longLabel: "Bone"
        }
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

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function sharedStyles() {
        return `
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
            .level-indicator, .round-indicator {
                background: #EDF2F7;
                padding: 6px 14px;
                border-radius: 20px;
                font-weight: bold;
                color: #4A5568;
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
            .hint {
                color: #A0AEC0;
                font-size: 0.9rem;
                margin-top: 10px;
                text-align: center;
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
        `;
    }

    function loadLevel(stage) {
        const level = gameData[currentLevel];
        if (level.type === 'sort') {
            loadSortLevel(stage, level);
        } else {
            loadAccordionLevel(stage, level);
        }
    }

    function goNextLevel(stage) {
        if (currentLevel < gameData.length - 1) {
            currentLevel++;
            loadLevel(stage);
        } else {
            if (window.GameHub?.showComplete) {
                window.GameHub.showComplete(
                    "Vowel Master!",
                    "You've mastered stretching AND sorting long and short vowel sounds!"
                );
            }
        }
    }

    // =================================================================
    // GAME 1: ACCORDION — stretch a short word into its long-vowel form
    // =================================================================
    function loadAccordionLevel(stage, data) {
        isStretched = false;

        stage.innerHTML = `
            <style>
                ${sharedStyles()}
                .accordion-container {
                    max-width: 780px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'OpenDyslexic', 'Helvetica Neue', Arial, sans-serif;
                    box-sizing: border-box;
                }
                .word-image {
                    font-size: 4rem;
                    line-height: 1;
                    transition: transform 0.4s ease;
                }
                .stretched .word-image {
                    transform: scale(1.2);
                }
                .word-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 18px;
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
                .wand-btn {
                    font-size: 2.6rem;
                    cursor: pointer;
                    user-select: none;
                    transition: transform 0.2s ease;
                }
                .wand-btn:hover {
                    transform: rotate(-12deg) scale(1.1);
                }
                .wand-btn.waving {
                    animation: wandWave 0.5s ease;
                }
                @keyframes wandWave {
                    0%   { transform: rotate(0deg) scale(1); }
                    30%  { transform: rotate(-30deg) scale(1.25); }
                    60%  { transform: rotate(18deg) scale(1.1); }
                    100% { transform: rotate(0deg) scale(1); }
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

                <div class="word-image" id="word-image">${data.icon}</div>

                <div class="word-row">
                    <div id="accordion-trigger" class="word-display">
                        <span class="letter">${data.short[0]}</span>
                        <span class="letter vowel">${data.short[1]}</span>
                        <span class="letter">${data.short[2]}</span>
                        <span class="letter magic-e">E</span>
                    </div>
                    <div id="wand-btn" class="wand-btn" title="Wave the magic wand!">🖌</div>
                </div>

                <div class="hint">Tap the word or wave the magic wand to stretch the sound!</div>

                <button id="next-level" class="btn-submit">Correct! Next Word →</button>
              </div>
            </div>
        `;

        const container = stage.querySelector('.accordion-container');
        const trigger = document.getElementById('accordion-trigger');
        const wandBtn = document.getElementById('wand-btn');
        const nextBtn = document.getElementById('next-level');

        function toggle() {
            isStretched = !isStretched;
            if (isStretched) {
                container.classList.add('stretched');
                speak(data.longSound, 0.6); // Slow for emphasis
                nextBtn.classList.add('show');
                if (window.GameHub) window.GameHub.triggerVFX(window.innerWidth / 2, window.innerHeight / 2);
            } else {
                container.classList.remove('stretched');
                speak(data.shortSound, 0.9);
                nextBtn.classList.remove('show');
            }
        }

        //trigger.onclick = toggle;

        wandBtn.onclick = () => {
            wandBtn.classList.add('waving');
            setTimeout(() => wandBtn.classList.remove('waving'), 500);
            toggle();
        };

        nextBtn.onclick = () => goNextLevel(stage);

        // Initial sound
        setTimeout(() => speak(data.shortSound), 500);
    }

    // =================================================================
    // GAME 2: SOUND SORT — hear/see a word, drag its emoji into the
    // box whose model word shares the same vowel length.
    // =================================================================
    function loadSortLevel(stage, level) {
        const rounds = shuffle([
            ...level.shortWords.map(w => ({ ...w, type: 'short' })),
            ...level.longWords.map(w => ({ ...w, type: 'long' }))
        ]);
        let roundIdx = 0;

        function render() {
            const round = rounds[roundIdx];
            let answered = false; // Moved up here to safely control interactions early

            stage.innerHTML = `
                <style>
                    ${sharedStyles()}
                    .sort-container {
                        max-width: 780px;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 22px;
                        padding: 20px;
                        font-family: 'OpenDyslexic', 'Helvetica Neue', Arial, sans-serif;
                        box-sizing: border-box;
                    }
                    .boxes-row {
                        display: flex;
                        gap: 30px;
                        justify-content: center;
                        width: 100%;
                        flex-wrap: wrap;
                    }
                    .sound-box {
                        background: #fff;
                        border: 3px solid #E2E8F0;
                        border-radius: 24px;
                        padding: 24px 30px;
                        min-width: 140px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                        transition: all 0.25s ease;
                        box-shadow: 0 6px 16px rgba(0,0,0,0.08);
                    }
                    .sound-box:hover {
                        border-color: #CBD5E0;
                        transform: translateY(-2px);
                    }
                    .sound-box.dragover {
                        border-color: #4299E1;
                        background: #EBF8FF;
                        transform: scale(1.05);
                    }
                    .sound-box.correct {
                        border-color: #48BB78;
                        background: #F0FFF4;
                        animation: pop 0.4s ease;
                    }
                    .sound-box.wrong {
                        border-color: #F56565;
                        animation: shake 0.4s ease;
                    }
                    .box-icon {
                        font-size: 3rem;
                    }
                    .box-label {
                        font-weight: 700;
                        color: #4A5568;
                        font-size: 1.1rem;
                    }
                    .drag-zone {
                        display: flex;
                        justify-content: center;
                        padding: 10px;
                    }
                    .sound-bubble {
                        background: #fff;
                        border: 3px solid #4299E1;
                        color: #2D3748;
                        font-size: 3rem;
                        width: 110px;
                        height: 110px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: grab;
                        box-shadow: 0 8px 20px rgba(66,153,225,0.3);
                        transition: transform 0.2s ease;
                        user-select: none;
                    }
                    .sound-bubble:active {
                        cursor: grabbing;
                        transform: scale(0.95);
                    }
                    .sound-bubble.dragging {
                        opacity: 0.4;
                    }
                    @keyframes pop {
                        0%   { transform: scale(1); }
                        50%  { transform: scale(1.12); }
                        100% { transform: scale(1); }
                    }
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25%      { transform: translateX(-8px); }
                        75%      { transform: translateX(8px); }
                    }
                </style>

                <div class="game-stage">
                  <div class="sort-container">
                    <div class="status-row">
                        <div class="level-indicator">Level ${currentLevel + 1} / ${totalLevels}</div>
                        <div class="round-indicator">Round ${roundIdx + 1} / ${rounds.length}</div>
                    </div>

                    <div class="instruction-box">
                        <strong>Listen &amp; Sort:</strong><br>
                        Which box has the same vowel sound?
                    </div>

                    <div class="boxes-row">
                        <div id="box-short" class="sound-box" data-type="short" title="Tap to hear the sound">
                            <div class="box-icon">${level.shortIcon}</div>
                            <div class="box-label">${level.shortLabel}</div>
                        </div>
                        <div id="box-long" class="sound-box" data-type="long" title="Tap to hear the sound">
                            <div class="box-icon">${level.longIcon}</div>
                            <div class="box-label">${level.longLabel}</div>
                        </div>
                    </div>

                    <div class="drag-zone">
                        <div id="sound-bubble" class="sound-bubble" draggable="true" title="Tap to hear again">${round.icon}</div>
                    </div>

                    <div class="hint">Drag the bubble into the matching box! Tap a box to hear its sound.</div>
                  </div>
                </div>
            `;

            const bubble = document.getElementById('sound-bubble');
            const boxShort = document.getElementById('box-short');
            const boxLong = document.getElementById('box-long');

            function playWord() {
                if (!answered) speak(round.word, 0.85);
            }

            bubble.onclick = playWord;

            bubble.addEventListener('dragstart', (e) => {
                if (answered) {
                    e.preventDefault();
                    return;
                }
                bubble.classList.add('dragging');
                e.dataTransfer.setData('text/plain', 'sound');
            });
            bubble.addEventListener('dragend', () => bubble.classList.remove('dragging'));

            [boxShort, boxLong].forEach(box => {
                box.addEventListener('dragover', (e) => {
                    if (answered) return;
                    e.preventDefault();
                    box.classList.add('dragover');
                });
                
                box.addEventListener('dragleave', () => box.classList.remove('dragover'));
                
                box.addEventListener('drop', (e) => {
                    if (answered) return;
                    e.preventDefault();
                    box.classList.remove('dragover');
                    handleAnswer(box.dataset.type, box);
                });

                // FIX: Instead of checking the answer on click, we only play the box's word.
                box.onclick = () => {
                    if (answered) return;
                    const modelWord = box.dataset.type === 'short' ? level.shortLabel : level.longLabel;
                    speak(modelWord, 0.85);
                };
            });

            // FIX: Simplified success/failure strings to prevent audio overlap bugs
            // across rapidly executing setTimeout boundaries.
            function handleAnswer(chosenType, chosenBox) {
                if (answered) return; 
                answered = true; // Lock the UI instantly so no more clicks or drops register

                const isCorrect = chosenType === round.type;

                if (isCorrect) {
                    chosenBox.classList.add('correct');
                    speak(`Correct!`, 0.9);
                    if (window.GameHub) window.GameHub.triggerVFX(window.innerWidth / 2, window.innerHeight / 2);

                    setTimeout(() => {
                        if (roundIdx < rounds.length - 1) {
                            roundIdx++;
                            render();
                        } else {
                            goNextLevel(stage);
                        }
                    }, 1500); // 1.5s gives just enough time for "Correct!" to finish
                } else {
                    chosenBox.classList.add('wrong');
                    speak(`Try again!`, 0.9);
                    
                    setTimeout(() => {
                        chosenBox.classList.remove('wrong');
                        speak(round.word, 0.85); // Re-prompt the target word
                        answered = false; // Unlock UI for another try
                    }, 1500);
                }
            }

            // Initial sound for this round
            setTimeout(playWord, 500);
        }

        render();
    }
})();