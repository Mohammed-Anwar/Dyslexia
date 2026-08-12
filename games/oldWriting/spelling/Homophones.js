/**
 * Game 15: Homophone Context Matching (Homophones)
 * Logic: Select the correct word tile to complete a picture sentence, updating the context image on hover.
 * Dyslexia Focus: Reinforcing semantic-orthographic links for identical-sounding words.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const THEME_COLOR = "#FF4500";

    const gameData = [
        {
            sentenceParts: ["Look over ", "!"],
            correctWord: "there",
            options: [
                { word: "there", icon: "🗺️", hint: "Points to a place" },
                { word: "their", icon: "👨‍👩‍👧‍👦", hint: "Belongs to a group of people" },
                { word: "they're", icon: "🧍‍♂️+💬", hint: "Short for 'they are'" }
            ]
        },
        {
            sentenceParts: ["I have ", " cats."],
            correctWord: "two",
            options: [
                { word: "too", icon: "➕", hint: "Means 'also' or 'very'" },
                { word: "to", icon: "➡️", hint: "Direction or action" },
                { word: "two", icon: "✌️", hint: "The number 2" }
            ]
        },
        {
            sentenceParts: ["The ", " is shining today."],
            correctWord: "sun",
            options: [
                { word: "son", icon: "👦", hint: "A boy child" },
                { word: "sun", icon: "☀️", hint: "The hot star in the sky" }
            ]
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
        
        stage.innerHTML = `
            <style>
                .homophone-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 700px;
                    margin: 0 auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                
                .context-display {
                    background: white;
                    border: 4px solid #E2E8F0;
                    border-radius: 20px;
                    width: 250px;
                    height: 200px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 6rem;
                    transition: all 0.3s;
                    box-shadow: 0 10px 15px rgba(0,0,0,0.05);
                }
                .context-hint {
                    font-size: 1.2rem;
                    color: #718096;
                    margin-top: 10px;
                    font-weight: 600;
                    text-align: center;
                    padding: 0 10px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                
                .sentence-bar {
                    background: #2D3748;
                    color: white;
                    padding: 20px 40px;
                    border-radius: 15px;
                    font-size: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                
                .blank-slot {
                    min-width: 100px;
                    height: 50px;
                    border-bottom: 4px solid ${THEME_COLOR};
                    display: inline-flex;
                    align-items: flex-end;
                    justify-content: center;
                    color: ${THEME_COLOR};
                    font-weight: bold;
                    padding: 0 10px;
                    transition: all 0.3s;
                }
                
                .options-grid {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .word-btn {
                    background: white;
                    border: 3px solid #CBD5E0;
                    padding: 15px 30px;
                    border-radius: 12px;
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #4A5568;
                    cursor: pointer;
                    transition: transform 0.1s, border-color 0.2s, background 0.2s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .word-btn:hover, .word-btn.active {
                    border-color: ${THEME_COLOR};
                    background: #FFF5F5;
                    transform: translateY(-5px);
                }
                .word-btn:active {
                    transform: translateY(0);
                }
            </style>

            <div class="homophone-container">
                <div class="header">
                    <span>Sentence: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <div class="context-display" id="context-box">
                    <span id="context-icon">❓</span>
                    <div class="context-hint" id="context-text">Hover a word to see what it means!</div>
                </div>
                
                <div class="sentence-bar">
                    <span>${data.sentenceParts[0]}</span>
                    <div class="blank-slot" id="target-slot"></div>
                    <span>${data.sentenceParts[1]}</span>
                </div>

                <div class="options-grid" id="options">
                    ${data.options.sort(() => Math.random() - 0.5).map((opt, i) => `
                        <button class="word-btn" data-word="${opt.word}" data-icon="${opt.icon}" data-hint="${opt.hint}">${opt.word}</button>
                    `).join('')}
                </div>
            </div>
        `;

        setupHoverAndSelection(stage, data);
    }

    function setupHoverAndSelection(stage, data) {
        const buttons = stage.querySelectorAll('.word-btn');
        const contextIcon = document.getElementById('context-icon');
        const contextText = document.getElementById('context-text');
        const targetSlot = document.getElementById('target-slot');
        let locked = false;

        buttons.forEach(btn => {
            // Hover/Touch previews context
            const showPreview = () => {
                if (locked) return;
                contextIcon.innerText = btn.dataset.icon;
                contextText.innerText = btn.dataset.hint;
                contextText.style.opacity = "1";
                targetSlot.innerText = btn.dataset.word;
                targetSlot.style.color = "#A0AEC0"; // preview color
            };

            const clearPreview = () => {
                if (locked) return;
                contextIcon.innerText = "❓";
                contextText.style.opacity = "0";
                targetSlot.innerText = "";
            };

            btn.addEventListener('mouseenter', showPreview);
            btn.addEventListener('touchstart', showPreview, {passive: true});
            btn.addEventListener('mouseleave', clearPreview);
            btn.addEventListener('touchend', clearPreview, {passive: true});

            // Click validation
            btn.addEventListener('click', () => {
                if (locked) return;
                locked = true;

                const selectedWord = btn.dataset.word;
                targetSlot.innerText = selectedWord;
                targetSlot.style.color = THEME_COLOR;

                if (selectedWord === data.correctWord) {
                    score += 30;
                    btn.style.backgroundColor = THEME_COLOR;
                    btn.style.color = "white";
                    
                    if (window.GameHub) {
                        window.GameHub.playSound('correct');
                        const rect = targetSlot.getBoundingClientRect();
                        window.GameHub.triggerVFX(rect.left + rect.width/2, rect.top);
                    }

                    setTimeout(() => {
                        if (currentLevel < gameData.length - 1) {
                            currentLevel++;
                            loadLevel(document.querySelector('.homophone-container').parentElement);
                        } else {
                            if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("Context Master!", `You picked the perfect words! Final Score: ${score}`);
                            }
                        }
                    }, 1500);
                } else {
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    btn.style.backgroundColor = "#E53E3E";
                    btn.style.color = "white";
                    btn.style.borderColor = "#C53030";
                    targetSlot.style.color = "#E53E3E";
                    
                    document.querySelector('.sentence-bar').style.animation = "shake 0.3s";

                    setTimeout(() => {
                        locked = false;
                        btn.style.backgroundColor = "white";
                        btn.style.color = "#4A5568";
                        btn.style.borderColor = "#CBD5E0";
                        targetSlot.innerText = "";
                        document.querySelector('.sentence-bar').style.animation = "none";
                    }, 800);
                }
            });
        });
    }
})();