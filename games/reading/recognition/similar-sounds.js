/**
 * Game 9: Sound Sort (التمييز بين الأصوات المتشابهة)
 * Filename: games/read_d1_g9.js
 * Logic: Listen to a word (or an isolated phoneme) and sort it into the
 *        correct picture bucket based on the confusing consonant sound.
 * Dyslexia Focus: Auditory discrimination using Web Speech API (speechSynthesis).
 *
 * v2 changes:
 *  - Buckets now show a picture (emoji) + the full word, not just a bare letter.
 *    This gives the child a concrete concept to anchor the sound to, instead of
 *    an abstract grapheme.
 *  - Most levels speak the WHOLE WORD in a short context sentence
 *    (e.g. "Find the Bear") so the child has to catch the target consonant
 *    inside real speech, not an isolated drilled sound.
 *  - A minority of levels (every 3rd one) still use the old "isolated phoneme"
 *    mode (e.g. "b, b, b, as in Bear") so both skills stay in rotation.
 *  - Bucket left/right position is shuffled every level so the child can't
 *    rely on a fixed spatial pattern.
 */

(function() {
    let currentLevel = 1;
    const totalLevels = 15;
    let score = 0;

    // Each entry is a minimal-pair (or near-minimal-pair) word battle.
    // `target` is the word/picture the child must pick when the audio plays.
    // `distractor` is the confusable sibling sound.
    // `mode: 'word'`    -> speech says a short sentence using the whole word.
    // `mode: 'phoneme'` -> speech says the isolated sound 3x, old-school drill style.
    const gameData = [
        // --- B vs P ---------------------------------------------------
        { target: { word: "Bear", emoji: "🐻" }, distractor: { word: "Pear", emoji: "🍐" },
          letter: "B", audioText: "Find the Bear", mode: "word" },
        { target: { word: "Buy", emoji: "💰" }, distractor: { word: "Pie", emoji: "🥧" },
          letter: "B", audioText: "Select Buy", mode: "word" },
        { target: { word: "Pin", emoji: "📌" }, distractor: { word: "Bin", emoji: "🗑️" },
          letter: "P", audioText: "p, p, p, as in Pin", mode: "phoneme" },
        { target: { word: "Big", emoji: "🐘" }, distractor: { word: "Pig", emoji: "🐷" },
          letter: "B", audioText: "Select Big", mode: "word" },

        // --- T vs D ---------------------------------------------------
        { target: { word: "Town", emoji: "🏘️" }, distractor: { word: "Down", emoji: "⬇️" },
          letter: "T", audioText: "Select Town", mode: "word" },
        { target: { word: "Dime", emoji: "🪙" }, distractor: { word: "Time", emoji: "⏰" },
          letter: "D", audioText: "d, d, d, as in Dime", mode: "phoneme" },
        { target: { word: "To", emoji: "➡️" }, distractor: { word: "Do", emoji: "✅" },
          letter: "T", audioText: "Find To", mode: "word" },
        { target: { word: "Tie", emoji: "👔" }, distractor: { word: "Die", emoji: "🎲" },
          letter: "T", audioText: "Find the Tie", mode: "word" },

        // --- F vs V -----------------------------------------------------
        { target: { word: "Van", emoji: "🚐" }, distractor: { word: "Fan", emoji: "🌬️" },
          letter: "V", audioText: "v, v, v, as in Van", mode: "phoneme" },
        { target: { word: "Fast", emoji: "🏃" }, distractor: { word: "Vast", emoji: "🌌" },
          letter: "F", audioText: "Find Fast", mode: "word" },
        { target: { word: "Live", emoji: "📡" }, distractor: { word: "Life", emoji: "❤️" },
          letter: "V", audioText: "Select Live", mode: "word" },

        // --- CH vs SH / G vs K / M vs N / W vs R ------------------------
        { target: { word: "Chip", emoji: "🍟" }, distractor: { word: "Ship", emoji: "🚢" },
          letter: "CH", audioText: "ch, ch, ch, as in Chip", mode: "phoneme" },
        { target: { word: "Goat", emoji: "🐐" }, distractor: { word: "Coat", emoji: "🧥" },
          letter: "G", audioText: "Find the Goat", mode: "word" },
        { target: { word: "Map", emoji: "🗺️" }, distractor: { word: "Nap", emoji: "😴" },
          letter: "M", audioText: "Find the Map", mode: "word" },
        { target: { word: "Wing", emoji: "🪽" }, distractor: { word: "Ring", emoji: "💍" },
          letter: "W", audioText: "w, w, w, as in Wing", mode: "phoneme" }
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 1;
        score = 0;
        loadLevel(stage);
    };

    function playSound(text) {
        const status = document.getElementById('sort-status');
        if (status) status.innerText = "Listening... 🔊";

        // Cancel any ongoing speech to prevent overlapping
        window.speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.8; // slower = better for dyslexia
        utter.pitch = 1;
        utter.lang = "en-US";

        utter.onend = () => {
            const buckets = document.getElementById('buckets-container');
            if (buckets) buckets.classList.remove('disabled');
            if (status) status.innerText = "Which one did you hear?";
        };

        utter.onerror = (event) => {
            console.error("SpeechSynthesis error:", event);
            if (status) status.innerText = "Speech error. Try again.";
            const buckets = document.getElementById('buckets-container');
            if (buckets) buckets.classList.remove('disabled');
        };

        window.speechSynthesis.speak(utter);
    }

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function loadLevel(stage) {
        const data = gameData[currentLevel - 1];
        const isWordMode = data.mode === "word";
        const bucketOptions = shuffle([
            { ...data.target, isTarget: true },
            { ...data.distractor, isTarget: false }
        ]);

        stage.innerHTML = `
            <style>
                .sort-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, sans-serif;
                }

                .sound-trigger {
                    width: 120px;
                    height: 120px;
                    background: #667EEA;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 4rem;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 6px solid white;
                }

                .sound-trigger:hover { transform: scale(1.1); background: #5A67D8; }

                .buckets-container {
                    display: flex;
                    gap: 30px;
                    width: 100%;
                    justify-content: center;
                    transition: opacity 0.3s ease;
                }

                .buckets-container.disabled {
                    opacity: 0.2;
                    pointer-events: none;
                    filter: grayscale(1);
                }

                .bucket {
                    width: 170px;
                    height: 190px;
                    background: white;
                    border: 4px dashed #CBD5E0;
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #4A5568;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 10px;
                }

                .bucket .bucket-emoji {
                    font-size: 4rem;
                    line-height: 1;
                }

                .bucket .bucket-word {
                    font-size: 1.4rem;
                    font-weight: 800;
                }

                .bucket:hover {
                    background: #F7FAFC;
                    border-color: #4299E1;
                    transform: translateY(-8px);
                }

                #sort-status {
                    font-weight: 600;
                    color: #718096;
                    min-height: 24px;
                }

                .level-indicator {
                    font-size: 14px;
                    font-weight: bold;
                    color: #4A5568;
                    background: #EDF2F7;
                    padding: 8px 20px;
                    border-radius: 30px;
                }

                .mode-badge {
                    font-size: 12px;
                    font-weight: 700;
                    color: #667EEA;
                    background: #EDF2FF;
                    padding: 4px 12px;
                    border-radius: 20px;
                }
            </style>

            <div class="sort-wrapper">
                <div class="level-indicator">Level ${currentLevel} / ${totalLevels}</div>
                <div style="text-align:center">
                    <h2 style="margin:0">Sound Sort</h2>
                    <p style="color: #718096; margin:4px 0;">
                        ${isWordMode ? "Listen to the word, then pick the matching picture." : "Listen to the sound, then pick the bucket."}
                    </p>
                    <span class="mode-badge">${isWordMode ? "🗣️ Whole Word" : "🔤 Sound Only"}</span>
                </div>

                <div class="sound-trigger" id="play-sound-btn">🔊</div>
                <div id="sort-status">Tap the speaker to listen</div>

                <div class="buckets-container disabled" id="buckets-container">
                    ${bucketOptions.map(opt => `
                        <div class="bucket" data-target="${opt.isTarget}">
                            <div class="bucket-emoji">${opt.emoji}</div>
                            <div class="bucket-word">${opt.word}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('play-sound-btn').onclick = () => playSound(data.audioText);

        stage.querySelectorAll('.bucket').forEach(btn => {
            btn.onclick = (e) => {
                const isCorrect = btn.dataset.target === "true";
                if (isCorrect) {
                    btn.style.background = "#C6F6D5";
                    btn.style.borderColor = "#48BB78";
                    score++;

                    if (window.GameHub) {
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                        window.GameHub.playSound('correct');
                    }

                    setTimeout(() => {
                        if (currentLevel < totalLevels) {
                            currentLevel++;
                            loadLevel(stage);
                        } else {
                            if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("Sound Expert!", `You sorted all the sounds correctly! Score: ${score}/${totalLevels}`);
                            }
                        }
                    }, 1000);
                } else {
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    btn.style.background = "#FFF5F5";
                    btn.style.borderColor = "#F56565";
                    setTimeout(() => {
                        btn.style.background = "white";
                        btn.style.borderColor = "#CBD5E0";
                    }, 500);
                }
            };
        });
    }
})();