/**
 * Game: Story Slides (Sequencing Events) - 15-Level Scaffolding Progression
 * Filename: story_slides.js
 * Logic: Drag panels into chronological order with progressive difficulty.
 * Dyslexia Focus: Visual sequencing -> Transition word recognition -> Pure reading comprehension.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let correctlyPlaced = 0;

    // 15 مرحلة مقسمة إلى 3 فئات (5 مراحل لكل فئة)
    const gameData = [
        // ==========================================
        // المرحلة الأولى: دعم بصري ولغوي (أيقونات + نص)
        // ==========================================
        {
            phase: 1, phaseName: "Visual Support",
            storyTitle: "Growing a Flower",
            instruction: "Look at the pictures and drag them into the correct order (1 to 4).",
            panels: [
                { id: "p1", order: 0, icon: "🌱", text: "Plant seed" },
                { id: "p2", order: 1, icon: "💧", text: "Water it" },
                { id: "p3", order: 2, icon: "☀️", text: "Sun shines" },
                { id: "p4", order: 3, icon: "🌻", text: "Flower blooms" }
            ]
        },
        {
            phase: 1, phaseName: "Visual Support",
            storyTitle: "Baking a Cake",
            instruction: "Look at the pictures and drag them into the correct order (1 to 4).",
            panels: [
                { id: "p1", order: 0, icon: "🥣", text: "Mix batter" },
                { id: "p2", order: 1, icon: "🔥", text: "Bake in oven" },
                { id: "p3", order: 2, icon: "🍰", text: "Add frosting" },
                { id: "p4", order: 3, icon: "🍴", text: "Eat a slice" }
            ]
        },
        {
            phase: 1, phaseName: "Visual Support",
            storyTitle: "Building a Snowman",
            instruction: "Look at the pictures and drag them into the correct order (1 to 4).",
            panels: [
                { id: "p1", order: 0, icon: "❄️", text: "Roll snow" },
                { id: "p2", order: 1, icon: "🥕", text: "Add nose" },
                { id: "p3", order: 2, icon: "🧣", text: "Put on scarf" },
                { id: "p4", order: 3, icon: "☃️", text: "Finished!" }
            ]
        },
        {
            phase: 1, phaseName: "Visual Support",
            storyTitle: "Brushing Teeth",
            instruction: "Look at the pictures and drag them into the correct order (1 to 4).",
            panels: [
                { id: "p1", order: 0, icon: "🪥", text: "Put paste on brush" },
                { id: "p2", order: 1, icon: "👄", text: "Brush teeth" },
                { id: "p3", order: 2, icon: "🚰", text: "Rinse mouth" },
                { id: "p4", order: 3, icon: "😁", text: "Bright smile" }
            ]
        },
        {
            phase: 1, phaseName: "Visual Support",
            storyTitle: "Catching a Bus",
            instruction: "Look at the pictures and drag them into the correct order (1 to 4).",
            panels: [
                { id: "p1", order: 0, icon: "🎒", text: "Pack backpack" },
                { id: "p2", order: 1, icon: "🚶", text: "Walk to stop" },
                { id: "p3", order: 2, icon: "🚌", text: "Bus arrives" },
                { id: "p4", order: 3, icon: "🎫", text: "Show ticket" }
            ]
        },

        // ==========================================
        // المرحلة الثانية: دعم لغوي موجه (نص فقط + كلمات دلالية)
        // ==========================================
        {
            phase: 2, phaseName: "Transition Words",
            storyTitle: "Going to school",
            instruction: "Read the sentences. Look for clue words like First, Next, Then, Last!",
            panels: [
                { id: "p1", order: 0, text: "First, wake up from bed." },
                { id: "p2", order: 1, text: "Next, wash your face." },
                { id: "p3", order: 2, text: "Then, eat your breakfast." },
                { id: "p4", order: 3, text: "Last, go to school." }
            ]
        },
        {
            phase: 2, phaseName: "Transition Words",
            storyTitle: "Making a sandwich",
            instruction: "Read the sentences. Look for clue words like First, Next, Then, Last!",
            panels: [
                { id: "p1", order: 0, text: "First, get two pieces of bread." },
                { id: "p2", order: 1, text: "Next, put cheese on the bread." },
                { id: "p3", order: 2, text: "Then, put the pieces together." },
                { id: "p4", order: 3, text: "Last, eat the sandwich." }
            ]
        },
        {
            phase: 2, phaseName: "Transition Words",
            storyTitle: "Washing hands",
            instruction: "Read the sentences. Look for clue words like First, Next, Then, Last!",
            panels: [
                { id: "p1", order: 0, text: "First, turn on the water." },
                { id: "p2", order: 1, text: "Next, use some soap." },
                { id: "p3", order: 2, text: "Then, rub your hands well." },
                { id: "p4", order: 3, text: "Last, dry your hands with a towel." }
            ]
        },
        {
            phase: 2, phaseName: "Transition Words",
            storyTitle: "Doing Homework",
            instruction: "Read the sentences. Look for clue words like First, Next, Then, Last!",
            panels: [
                { id: "p1", order: 0, text: "First, open your book." },
                { id: "p2", order: 1, text: "Next, read the lesson." },
                { id: "p3", order: 2, text: "Then, solve the exercises." },
                { id: "p4", order: 3, text: "Last, close your book." }
            ]
        },
        {
            phase: 2, phaseName: "Transition Words",
            storyTitle: "Getting Ready for Bed",
            instruction: "Read the sentences. Look for clue words like First, Next, Then, Last!",
            panels: [
                { id: "p1", order: 0, text: "First, put on your pajamas." },
                { id: "p2", order: 1, text: "Next, brush your teeth." },
                { id: "p3", order: 2, text: "Then, read a short story." },
                { id: "p4", order: 3, text: "Last, turn off the light." }
            ]
        },

        // ==========================================
        // المرحلة الثالثة: الفهم القرائي المتقدم (نص فقط، بدون كلمات دلالية)
        // ==========================================
        {
            phase: 3, phaseName: "Reading Comprehension",
            storyTitle: "A rainy day",
            instruction: "Read carefully! There are no clue words. What happens first, and what happens next?",
            panels: [
                { id: "p1", order: 0, text: "Dark clouds fill the sky." },
                { id: "p2", order: 1, text: "It starts to rain hard." },
                { id: "p3", order: 2, text: "The boy opens his umbrella." },
                { id: "p4", order: 3, text: "He walks safely in the rain." }
            ]
        },
        {
            phase: 3, phaseName: "Reading Comprehension",
            storyTitle: "Baking a cake",
            instruction: "Read carefully! There are no clue words. What happens first, and what happens next?",
            panels: [
                { id: "p1", order: 0, text: "Mix flour, eggs, and milk." },
                { id: "p2", order: 1, text: "Pour the mix into a pan." },
                { id: "p3", order: 2, text: "Put the pan in the hot oven." },
                { id: "p4", order: 3, text: "Take out the baked cake." }
            ]
        },
        {
            phase: 3, phaseName: "Reading Comprehension",
            storyTitle: "A lost puppy",
            instruction: "Read carefully! There are no clue words. What happens first, and what happens next?",
            panels: [
                { id: "p1", order: 0, text: "I heard a small whimper." },
                { id: "p2", order: 1, text: "I looked under the porch." },
                { id: "p3", order: 2, text: "I found a scared puppy." },
                { id: "p4", order: 3, text: "I gave it food and water." }
            ]
        },
        {
            phase: 3, phaseName: "Reading Comprehension",
            storyTitle: "Riding a bicycle",
            instruction: "Read carefully! There are no clue words. What happens first, and what happens next?",
            panels: [
                { id: "p1", order: 0, text: "Put on a safe helmet." },
                { id: "p2", order: 1, text: "Get on the bicycle seat." },
                { id: "p3", order: 2, text: "Pedal forward on the path." },
                { id: "p4", order: 3, text: "Stop at the red light." }
            ]
        },
        {
            phase: 3, phaseName: "Reading Comprehension",
            storyTitle: "Making a cup of tea",
            instruction: "Read carefully! There are no clue words. What happens first, and what happens next?",
            panels: [
                { id: "p1", order: 0, text: "Boil water in a kettle." },
                { id: "p2", order: 1, text: "Put a tea bag in a cup." },
                { id: "p3", order: 2, text: "Pour the hot water." },
                { id: "p4", order: 3, text: "Add sugar and stir well." }
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

    // دالة لإبراز الكلمات الانتقالية فقط إذا كانت موجودة في النص
    function formatText(text) {
        const transitionWords = ["First", "Next", "Then", "Last"];
        for (let word of transitionWords) {
            if (text.startsWith(word + ",")) {
                return `<span class="transition-word">${word},</span>${text.substring(word.length + 1)}`;
            }
        }
        return text;
    }

    function loadLevel(stage) {
        const data = gameData[currentLevel];
        correctlyPlaced = 0;
        
        // تحديد لون شارة المرحلة حسب الصعوبة
        let badgeColor = data.phase === 1 ? "#48BB78" : (data.phase === 2 ? "#4299E1" : "#ED8936");

        stage.innerHTML = `
            <style>
                .story-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', 'Comic Sans MS', 'OpenDyslexic', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .game-header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #2D3748;
                    background: #EDF2F7;
                    padding: 12px 20px;
                    border-radius: 12px;
                    align-items: center;
                }
                .level-badge {
                    background: ${badgeColor};
                    color: white;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    letter-spacing: 0.05em;
                }
                .story-title {
                    font-size: 1.8rem;
                    color: #2D3748;
                    margin: 5px 0;
                    text-align: center;
                }
                .instruction-text {
                    font-size: 1.15rem;
                    color: #4A5568;
                    text-align: center;
                    margin-bottom: 10px;
                    font-weight: 600;
                    background: #FFF;
                    padding: 10px 20px;
                    border-radius: 10px;
                    border-left: 5px solid ${badgeColor};
                }
                .drop-zones {
                    display: flex;
                    gap: 15px;
                    margin-top: 10px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .slot {
                    width: 160px;
                    min-height: 150px;
                    border: 3px dashed #CBD5E0;
                    border-radius: 15px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding-top: 35px;
                    background: #F7FAFC;
                    position: relative;
                    transition: all 0.3s ease;
                }
                .slot.drag-over {
                    background: #EBF8FF;
                    border-color: #4299E1;
                    transform: scale(1.02);
                }
                .slot-number {
                    position: absolute;
                    top: 8px;
                    left: 12px;
                    font-size: 1.1rem;
                    color: #A0AEC0;
                    font-weight: 800;
                }
                .panel-pool {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                    padding: 25px;
                    background: #EDF2F7;
                    border-radius: 20px;
                    min-height: 170px;
                    width: 100%;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .panel {
                    width: 150px;
                    min-height: 130px;
                    background: white;
                    border: 2px solid #E2E8F0;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 12px;
                    cursor: grab;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    touch-action: none;
                    z-index: 10;
                    text-align: center;
                    /* Dyslexia-friendly text settings */
                    font-size: 1.05rem;
                    line-height: 1.5;
                    letter-spacing: 0.03em;
                    color: #2D3748;
                    word-wrap: break-word;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .panel:active {
                    cursor: grabbing;
                    transform: scale(1.05);
                    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
                }
                .panel-icon { 
                    font-size: 3rem; 
                    margin-bottom: 8px;
                }
                .panel.correct { 
                    border-color: #48BB78; 
                    background: #F0FFF4; 
                    cursor: default; 
                    box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.3);
                }
                .transition-word {
                    color: #2B6CB0;
                    font-weight: 800;
                    text-decoration: underline;
                    text-decoration-color: #90CDF4;
                    text-underline-offset: 4px;
                }
            </style>

            <div class="story-container">
                <div class="game-header">
                    <span class="level-badge">${data.phaseName}</span>
                    <span>Stage ${currentLevel + 1} / ${gameData.length} | Score: ${score}</span>
                </div>
                <h2 class="story-title">${data.storyTitle}</h2>
                <p class="instruction-text">${data.instruction}</p>

                <div class="drop-zones">
                    ${[0, 1, 2, 3].map(i => `
                        <div class="slot" id="slot-${i}" data-order="${i}">
                            <span class="slot-number">${i + 1}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="panel-pool" id="panel-pool">
                    <!-- Panels loaded here -->
                </div>
            </div>
        `;

        const pool = document.getElementById('panel-pool');
        const shuffledPanels = [...data.panels].sort(() => Math.random() - 0.5);

        shuffledPanels.forEach(pData => {
            const panel = document.createElement('div');
            panel.className = 'panel';
            panel.id = pData.id;
            
            // بناء المحتوى: أيقونة إذا كانت موجودة، ثم النص (مع تنسيق الكلمات الانتقالية إن وجدت)
            let contentHTML = '';
            if (pData.icon) {
                contentHTML += `<div class="panel-icon">${pData.icon}</div>`;
            }
            contentHTML += `<div class="panel-text">${formatText(pData.text)}</div>`;
            
            panel.innerHTML = contentHTML;
            pool.appendChild(panel);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(panel, (x, y, el) => {
                    let matched = false;
                    [0, 1, 2, 3].forEach(i => {
                        const slot = document.getElementById(`slot-${i}`);
                        const rect = slot.getBoundingClientRect();
                        
                        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                            if (pData.order === i) {
                                snapToSlot(el, slot, x, y);
                                matched = true;
                            } else {
                                handleWrongOrder(el);
                                matched = true;
                            }
                        }
                    });
                    if (!matched && el.resetPosition) el.resetPosition();
                });
            }
        });
    }

    function snapToSlot(panel, slot, x, y) {
        panel.classList.add('correct');
        panel.style.position = 'static';
        panel.style.transform = 'none';
        slot.innerHTML = '';
        slot.appendChild(panel);
        panel.style.cursor = 'default';
        panel.onmousedown = null;

        score += 20;
        correctlyPlaced++;

        if (window.GameHub) {
            window.GameHub.playSound('correct');
            window.GameHub.triggerVFX(x, y);
        }

        if (correctlyPlaced === 4) {
            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.querySelector('.story-container').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Master Storyteller!", `You've sequenced all 15 stories perfectly! Final Score: ${score}`);
                    } else {
                        alert(`Master Storyteller! You've sequenced all 15 stories perfectly! Final Score: ${score}`);
                    }
                }
            }, 1200);
        }
    }

    function handleWrongOrder(panel) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        panel.style.borderColor = "#F56565";
        // اهتزاز بسيط (Shake effect) للتغذية الراجعة الحسية
        panel.style.transform = "translateX(6px)";
        setTimeout(() => {
            panel.style.transform = "translateX(-6px)";
            setTimeout(() => {
                panel.style.transform = "translateX(4px)";
                setTimeout(() => {
                    panel.style.transform = "translateX(0)";
                    if (panel.resetPosition) panel.resetPosition();
                    panel.style.borderColor = "#E2E8F0";
                }, 100);
            }, 100);
        }, 100);
    }
})();