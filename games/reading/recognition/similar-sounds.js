/**
 * Game 9: Sound Sort (التمييز بين الأصوات المتشابهة)
 * Filename: games/read_d1_g9.js
 * Logic: Listen to a sound and sort it into the correct phoneme bucket.
 * Dyslexia Focus: Auditory discrimination using Web Speech API (speechSynthesis).
 */

(function() {
    let currentLevel = 1;
    const totalLevels = 15; // Increased level count
    let score = 0;
    let soundPlayed = false;

    // Expanded data set with more confusing sound pairs
    const gameData = [
        { pair: ["B", "P"], target: "B", phonemeText: "b, b, b, as in Ball", options: ["B", "P"] },
        { pair: ["B", "P"], target: "P", phonemeText: "p, p, p, as in Pan", options: ["B", "P"] },
        { pair: ["F", "V"], target: "F", phonemeText: "f, f, f, as in Fan", options: ["F", "V"] },
        { pair: ["F", "V"], target: "V", phonemeText: "v, v, v, as in Van", options: ["F", "V"] },
        { pair: ["D", "T"], target: "D", phonemeText: "d, d, d, as in Dog", options: ["D", "T"] },
        { pair: ["D", "T"], target: "T", phonemeText: "t, t, t, as in Top", options: ["D", "T"] },
        { pair: ["S", "Z"], target: "S", phonemeText: "s, s, s, as in Sun", options: ["S", "Z"] },
        { pair: ["S", "Z"], target: "Z", phonemeText: "z, z, z, as in Zoo", options: ["S", "Z"] },
        { pair: ["CH", "SH"], target: "CH", phonemeText: "ch, ch, ch, as in Chips", options: ["CH", "SH"] },
        { pair: ["CH", "SH"], target: "SH", phonemeText: "sh, sh, sh, as in Ship", options: ["CH", "SH"] },
        { pair: ["G", "K"], target: "G", phonemeText: "g, g, g, as in Goat", options: ["G", "K"] },
        { pair: ["G", "K"], target: "K", phonemeText: "k, k, k, as in Kite", options: ["G", "K"] },
        { pair: ["M", "N"], target: "M", phonemeText: "m, m, m, as in Moon", options: ["M", "N"] },
        { pair: ["M", "N"], target: "N", phonemeText: "n, n, n, as in Nose", options: ["M", "N"] },
        { pair: ["W", "R"], target: "W", phonemeText: "w, w, w, as in Watch", options: ["W", "R"] }
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

        utter.onstart = () => {
            soundPlayed = true;
        };

        utter.onend = () => {
            const buckets = document.getElementById('buckets-container');
            if (buckets) buckets.classList.remove('disabled');
            if (status) status.innerText = "Which sound did you hear?";
        };

        utter.onerror = (event) => {
            console.error("SpeechSynthesis error:", event);
            if (status) status.innerText = "Speech error. Try again.";
            // Fallback to enable buckets if speech fails
            const buckets = document.getElementById('buckets-container');
            if (buckets) buckets.classList.remove('disabled');
        };

        window.speechSynthesis.speak(utter);
    }

    function loadLevel(stage) {
        const data = gameData[currentLevel - 1];
        soundPlayed = false;
        
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
                    gap: 40px;
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
                    width: 160px;
                    height: 160px;
                    background: white;
                    border: 4px dashed #CBD5E0;
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 4rem;
                    font-weight: 900;
                    color: #4A5568;
                    cursor: pointer;
                    transition: all 0.3s ease;
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
            </style>

            <div class="sort-wrapper">
                <div class="level-indicator">Level ${currentLevel} / ${totalLevels}</div>
                <div style="text-align:center">
                    <h2 style="margin:0">Sound Sort</h2>
                    <p style="color: #718096;">Listen to the sound, then pick the bucket.</p>
                </div>

                <div class="sound-trigger" id="play-sound-btn">🔊</div>
                <div id="sort-status">Tap the speaker to listen</div>

                <div class="buckets-container disabled" id="buckets-container">
                    ${data.options.map(opt => `
                        <div class="bucket" data-val="${opt}">${opt}</div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('play-sound-btn').onclick = () => playSound(data.phonemeText);

        stage.querySelectorAll('.bucket').forEach(btn => {
            btn.onclick = (e) => {
                const choice = btn.dataset.val;
                if (choice === data.target) {
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