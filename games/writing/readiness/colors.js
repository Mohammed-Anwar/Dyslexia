/**
 * Game: Color Discrimination (Color Palette)
 * Filename: the_director.js
 * Logic: Paint specific areas of a drawing based on a color-key.
 * Dyslexia Focus: Strengthening visual processing speed.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let selectedColor = null;

    const gameData = [
        {
            title: "The Magic Flower",
            description: "Match the colors to the numbers to make the flower bloom!",
            svgPath: `
                <svg viewBox="0 0 400 400" id="gameSvg" style="width: 100%; height: auto; max-width: 400px;">
                    <circle cx="200" cy="200" r="40" class="paintable" data-target="1" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="195" y="205" font-size="20" fill="#A0AEC0" pointer-events="none">1</text>
                    <path d="M200,160 Q240,80 200,40 Q160,80 200,160" class="paintable" data-target="2" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="195" y="100" font-size="16" fill="#A0AEC0" pointer-events="none">2</text>
                    <path d="M240,200 Q320,240 360,200 Q320,160 240,200" class="paintable" data-target="2" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="300" y="205" font-size="16" fill="#A0AEC0" pointer-events="none">2</text>
                    <path d="M200,240 Q160,320 200,360 Q240,320 200,240" class="paintable" data-target="2" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="195" y="310" font-size="16" fill="#A0AEC0" pointer-events="none">2</text>
                    <path d="M160,200 Q80,160 40,200 Q80,240 160,200" class="paintable" data-target="2" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="90" y="205" font-size="16" fill="#A0AEC0" pointer-events="none">2</text>
                    <path d="M200,360 Q130,380 100,340 Q150,320 200,360" class="paintable" data-target="3" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="135" y="360" font-size="14" fill="#A0AEC0" pointer-events="none">3</text>
                </svg>
            `,
            key: [
                { id: "1", color: "#F6E05E", label: "Yellow (1)" },
                { id: "2", color: "#F687B3", label: "Pink (2)" },
                { id: "3", color: "#48BB78", label: "Green (3)" }
            ],
            explanation: "Beautiful! Recognizing colors quickly helps with visual reading flow."
        },
        {
            title: "The Happy House",
            description: "Use the palette to paint the house correctly!",
            svgPath: `
                <svg viewBox="0 0 400 400" id="gameSvg" style="width: 100%; height: auto; max-width: 400px;">
                    <path d="M50,200 L200,50 L350,200 Z" class="paintable" data-target="1" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="190" y="140" font-size="20" fill="#A0AEC0" pointer-events="none">1</text>
                    <rect x="80" y="200" width="240" height="150" class="paintable" data-target="2" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="190" y="280" font-size="20" fill="#A0AEC0" pointer-events="none">2</text>
                    <rect x="175" y="270" width="50" height="80" class="paintable" data-target="3" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="195" y="320" font-size="16" fill="#A0AEC0" pointer-events="none">3</text>
                </svg>
            `,
            key: [
                { id: "1", color: "#C53030", label: "Red (1)" },
                { id: "2", color: "#4299E1", label: "Blue (2)" },
                { id: "3", color: "#975A16", label: "Brown (3)" }
            ],
            explanation: "Great job! Sorting by color improves how we process shapes and words."
        },
        {
            title: "Space Explorer",
            description: "Prepare the rocket for launch!",
            svgPath: `
                <svg viewBox="0 0 400 400" id="gameSvg" style="width: 100%; height: auto; max-width: 400px;">
                    <path d="M120,300 L80,350 L120,350 Z" class="paintable" data-target="3" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <path d="M280,300 L320,350 L280,350 Z" class="paintable" data-target="3" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="95" y="340" font-size="14" fill="#A0AEC0" pointer-events="none">3</text>
                    <text x="295" y="340" font-size="14" fill="#A0AEC0" pointer-events="none">3</text>
                    <path d="M120,350 L120,150 Q200,20 280,150 L280,350 Z" class="paintable" data-target="1" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="190" y="230" font-size="20" fill="#A0AEC0" pointer-events="none">1</text>
                    <circle cx="200" cy="180" r="30" class="paintable" data-target="2" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="195" y="185" font-size="16" fill="#A0AEC0" pointer-events="none">2</text>
                    <rect x="160" y="350" width="80" height="20" class="paintable" data-target="3" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                </svg>
            `,
            key: [
                { id: "1", color: "#EDF2F7", label: "Silver (1)" },
                { id: "2", color: "#63B3ED", label: "Cyan (2)" },
                { id: "3", color: "#ED8936", label: "Orange (3)" }
            ],
            explanation: "3... 2... 1... Blast off! Your focus is out of this world."
        },
        {
            title: "Under the Sea",
            description: "Find the hidden fish in the reef!",
            svgPath: `
                <svg viewBox="0 0 400 400" id="gameSvg" style="width: 100%; height: auto; max-width: 400px;">
                    <rect x="0" y="0" width="400" height="400" fill="#EBF8FF" pointer-events="none" />
                    <path d="M100,200 Q200,100 300,200 Q200,300 100,200" class="paintable" data-target="1" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="190" y="205" font-size="20" fill="#A0AEC0" pointer-events="none">1</text>
                    <path d="M100,200 L40,150 L40,250 Z" class="paintable" data-target="2" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="50" y="205" font-size="14" fill="#A0AEC0" pointer-events="none">2</text>
                    <path d="M330,400 Q310,300 330,200" fill="none" stroke="#48BB78" stroke-width="10" stroke-linecap="round" pointer-events="none" />
                    <circle cx="280" cy="120" r="15" class="paintable" data-target="3" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
                    <text x="275" y="125" font-size="10" fill="#A0AEC0" pointer-events="none">3</text>
                </svg>
            `,
            key: [
                { id: "1", color: "#F6AD55", label: "Orange (1)" },
                { id: "2", color: "#F6E05E", label: "Yellow (2)" },
                { id: "3", color: "#BEE3F8", label: "Light Blue (3)" }
            ],
            explanation: "Splendid! Identifying patterns in busy backgrounds is a great reading skill."
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
        selectedColor = null;

        stage.innerHTML = `
            <style>
                .color-container {
                    display: flex; flex-direction: column; align-items: center; gap: 20px;
                    padding: 20px; font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 800px; margin: 0 auto;
                }
                .header-stats { display: flex; justify-content: space-between; width: 100%; font-weight: bold; color: #4A5568; }
                .game-layout {
                    display: flex; gap: 30px; align-items: center; background: white;
                    padding: 30px; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    border: 4px solid #EDF2F7; width: 100%;
                }
                .palette { display: flex; flex-direction: column; gap: 15px; min-width: 80px; }
                .color-swatch {
                    width: 60px; height: 60px; border-radius: 50%; cursor: pointer;
                    border: 4px solid #E2E8F0; transition: all 0.2s;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: bold; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                .color-swatch.active { border-color: #2D3748; box-shadow: 0 0 15px rgba(0,0,0,0.2); transform: scale(1.1); }
                .drawing-area { flex: 1; display: flex; justify-content: center; background: #F7FAFC; border-radius: 12px; padding: 10px; }
                .paintable { cursor: pointer; transition: fill 0.3s ease; }
                .feedback-box { min-height: 50px; text-align: center; font-weight: 600; font-size: 1.2rem; }
                .btn-next { padding: 12px 35px; background: #48BB78; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; display: none; }
            </style>
            <div class="color-container">
                <div class="header-stats">
                    <span>Drawing: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>
                <div style="text-align: center;">
                    <h2 style="margin: 0; color: #2D3748;">${data.title}</h2>
                    <p style="color: #718096;">${data.description}</p>
                </div>
                <div class="game-layout">
                    <div class="palette">
                        ${data.key.map(item => `<div class="color-swatch" data-id="${item.id}" data-color="${item.color}" style="background-color: ${item.color};">${item.id}</div>`).join('')}
                    </div>
                    <div class="drawing-area">${data.svgPath}</div>
                </div>
                <div id="feedback" class="feedback-box"></div>
                <button id="nextBtn" class="btn-next">Next Drawing →</button>
            </div>
        `;

        const swatches = stage.querySelectorAll('.color-swatch');
        const paintables = stage.querySelectorAll('.paintable');
        const feedback = stage.querySelector('#feedback');
        const nextBtn = stage.querySelector('#nextBtn');

        swatches.forEach(swatch => {
            swatch.onclick = () => {
                swatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                selectedColor = { id: swatch.dataset.id, hex: swatch.dataset.color };
                feedback.innerText = "";
            };
        });

        paintables.forEach(region => {
            region.onclick = (e) => {
                if (!selectedColor) {
                    feedback.style.color = "#E53E3E";
                    feedback.innerText = "Pick a color from the palette first!";
                    return;
                }
                if (region.dataset.target === selectedColor.id) {
                    region.setAttribute('fill', selectedColor.hex);
                    region.classList.remove('paintable');
                    region.style.pointerEvents = 'none';
                    score += 5;
                    if (window.GameHub) {
                        window.GameHub.playSound('correct');
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                    }
                    if (stage.querySelectorAll('.paintable').length === 0) {
                        feedback.style.color = "#2F855A";
                        feedback.innerText = data.explanation;
                        nextBtn.style.display = "block";
                        nextBtn.onclick = () => {
                            if (currentLevel < gameData.length - 1) {
                                currentLevel++;
                                loadLevel(stage);
                            } else if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("Master Artist!", `Final Score: ${score}. Great focus!`);
                            }
                        };
                    }
                } else {
                    feedback.style.color = "#E53E3E";
                    feedback.innerText = "Wrong color! Try again.";
                    if (window.GameHub) window.GameHub.playSound('wrong');
                }
            };
        });
    }
})();