/**
 * Game 8: Minute Feature Detection (Detail Detective)
 * Logic: Tap the subtle distinctive feature on a magnified letter.
 * Dyslexia Focus: Visual discrimination for orthographic details.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const THEME_COLOR = "#3CB371";

    const gameData = [
        {
            letter: "Q",
            instruction: "Find and tap the TAIL of the letter Q.",
            // Representing letters via distinct clickable CSS parts
            parts: [
                { id: "base", class: "shape-circle", isTarget: false },
                { id: "tail", class: "shape-tail", isTarget: true }
            ]
        },
        {
            letter: "f",
            instruction: "Tap the CROSSBAR on the letter f.",
            parts: [
                { id: "stem", class: "shape-f-stem", isTarget: false },
                { id: "bar", class: "shape-crossbar", isTarget: true }
            ]
        },
        {
            letter: "i",
            instruction: "Tap the DOT on the letter i.",
            parts: [
                { id: "stem", class: "shape-i-stem", isTarget: false },
                { id: "dot", class: "shape-dot", isTarget: true }
            ]
        },
        {
            letter: "G",
            instruction: "Find the short HORIZONTAL BAR that goes inside the G.",
            parts: [
                { id: "curve", class: "shape-g-curve", isTarget: false },
                { id: "hbar", class: "shape-g-bar", isTarget: true }
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
                .detective-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .magnifying-glass {
                    background: #F7FAFC;
                    border: 8px solid #CBD5E0;
                    border-radius: 50%;
                    width: 300px;
                    height: 300px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: inset 0 4px 10px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.1);
                }
                
                /* Letter Parts Common */
                .letter-part {
                    position: absolute;
                    background-color: #2D3748;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .letter-part:hover { background-color: #4A5568; }
                .letter-part.correct { background-color: ${THEME_COLOR} !important; box-shadow: 0 0 15px ${THEME_COLOR}; }
                .letter-part.wrong { background-color: #F56565 !important; animation: shake 0.4s; }

                /* Specific Letter Shapes */
                /* Q */
                .shape-circle { width: 140px; height: 140px; border-radius: 50%; border: 25px solid #2D3748; background: transparent; box-sizing: border-box; }
                .shape-circle:hover { border-color: #4A5568; background: transparent; }
                .shape-circle.wrong { border-color: #F56565 !important; }
                .shape-tail { width: 60px; height: 25px; border-radius: 10px; bottom: 50px; right: 50px; transform: rotate(45deg); }
                
                /* f */
                .shape-f-stem { width: 25px; height: 160px; border-radius: 15px 15px 0 0; }
                .shape-f-stem::before { content: ''; position:absolute; top: 0; left: 0; width: 60px; height: 25px; background: inherit; border-radius: 15px 15px 0 0; }
                .shape-crossbar { width: 70px; height: 25px; border-radius: 10px; top: 120px; left: 115px; }
                
                /* i */
                .shape-i-stem { width: 25px; height: 100px; border-radius: 10px; bottom: 70px; }
                .shape-dot { width: 35px; height: 35px; border-radius: 50%; top: 60px; }
                
                /* G */
                .shape-g-curve { width: 140px; height: 140px; border-radius: 50%; border: 25px solid #2D3748; border-right-color: transparent; background: transparent; box-sizing: border-box; }
                .shape-g-curve:hover { border-color: #4A5568; border-right-color: transparent; background: transparent;}
                .shape-g-curve.wrong { border-color: #F56565 !important; border-right-color: transparent !important; }
                .shape-g-bar { width: 60px; height: 25px; border-radius: 10px; right: 80px; top: 135px; }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            </style>

            <div class="detective-container">
                <div class="header">
                    <span>Level: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <h3 style="text-align:center; color: #2D3748;">${data.instruction}</h3>
                
                <div class="magnifying-glass" id="lens">
                    ${data.parts.map((p, idx) => `
                        <div class="letter-part ${p.class}" id="part-${idx}" data-target="${p.isTarget}"></div>
                    `).join('')}
                </div>
            </div>
        `;

        const lens = document.getElementById('lens');
        const parts = lens.querySelectorAll('.letter-part');

        parts.forEach(part => {
            part.onclick = (e) => {
                const isTarget = part.dataset.target === "true";

                if (isTarget) {
                    score += 25;
                    part.classList.add('correct');
                    
                    if (window.GameHub) {
                        window.GameHub.playSound('correct');
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                    }
                    
                    // Disable all clicks
                    parts.forEach(p => p.style.pointerEvents = 'none');
                    
                    setTimeout(() => {
                        if (currentLevel < gameData.length - 1) {
                            currentLevel++;
                            loadLevel(document.querySelector('.detective-container').parentElement);
                        } else {
                            if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("Eagle Eye!", `You found all the hidden details. Final Score: ${score}`);
                            }
                        }
                    }, 1500);

                } else {
                    part.classList.add('wrong');
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    
                    setTimeout(() => {
                        part.classList.remove('wrong');
                    }, 500);
                }
            };
        });
    }
})();