/**
 * Game 8: Word Magnets (Sentence Building) - Progressive Scaffolding
 * Filename: games/read_d1_g8.js
 * Logic: Snap words onto a rail to build a 4-word sentence. 
 * Progression: Color-coded -> Neutral colors -> Distractor word included.
 * Dyslexia Focus: Syntactic structure, grammar internalization, and cognitive inhibition.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let correctlyPlaced = 0;

    // 9 مراحل مقسمة إلى 3 فئات (3 مراحل لكل فئة)
    const gameData = [
        // ==========================================
        // المرحلة الأولى: دعم بصري (ألوان تدل على نوع الكلمة)
        // ==========================================
        {
            phase: 1, phaseName: "Visual Support",
            sentence: "The cat jumps high",
            targetLength: 4,
            hasColors: true,
            instruction: "Snap the words to the rail. Use the colors to help you!",
            words: [
                { text: "The", type: "other", order: 0 },
                { text: "cat", type: "noun", order: 1 },
                { text: "jumps", type: "verb", order: 2 },
                { text: "high", type: "other", order: 3 }
            ]
        },
        {
            phase: 1, phaseName: "Visual Support",
            sentence: "Big dogs bark loudly",
            targetLength: 4,
            hasColors: true,
            instruction: "Snap the words to the rail. Use the colors to help you!",
            words: [
                { text: "Big", type: "other", order: 0 },
                { text: "dogs", type: "noun", order: 1 },
                { text: "bark", type: "verb", order: 2 },
                { text: "loudly", type: "other", order: 3 }
            ]
        },
        {
            phase: 1, phaseName: "Visual Support",
            sentence: "Birds fly in sky",
            targetLength: 4,
            hasColors: true,
            instruction: "Snap the words to the rail. Use the colors to help you!",
            words: [
                { text: "Birds", type: "noun", order: 0 },
                { text: "fly", type: "verb", order: 1 },
                { text: "in", type: "other", order: 2 },
                { text: "sky", type: "noun", order: 3 }
            ]
        },

        // ==========================================
        // المرحلة الثانية: الاعتماد على البنية النحوية (بدون ألوان)
        // ==========================================
        {
            phase: 2, phaseName: "Syntax Focus",
            sentence: "She reads a book",
            targetLength: 4,
            hasColors: false,
            instruction: "Colors are gone! Read the words and build the sentence logically.",
            words: [
                { text: "She", type: "noun", order: 0 },
                { text: "reads", type: "verb", order: 1 },
                { text: "a", type: "other", order: 2 },
                { text: "book", type: "noun", order: 3 }
            ]
        },
        {
            phase: 2, phaseName: "Syntax Focus",
            sentence: "The sun is hot",
            targetLength: 4,
            hasColors: false,
            instruction: "Colors are gone! Read the words and build the sentence logically.",
            words: [
                { text: "The", type: "other", order: 0 },
                { text: "sun", type: "noun", order: 1 },
                { text: "is", type: "verb", order: 2 },
                { text: "hot", type: "other", order: 3 }
            ]
        },
        {
            phase: 2, phaseName: "Syntax Focus",
            sentence: "We play in park",
            targetLength: 4,
            hasColors: false,
            instruction: "Colors are gone! Read the words and build the sentence logically.",
            words: [
                { text: "We", type: "noun", order: 0 },
                { text: "play", type: "verb", order: 1 },
                { text: "in", type: "other", order: 2 },
                { text: "park", type: "noun", order: 3 }
            ]
        },

        // ==========================================
        // المرحلة الثالثة: التفكير النقدي (كلمة مشتتة)
        // ملاحظة: الكلمة المشتتة لها order: -1 لكي ترفضها جميع الخانات
        // ==========================================
        {
            phase: 3, phaseName: "Critical Thinking",
            sentence: "The cat drinks milk",
            targetLength: 4,
            hasColors: false,
            instruction: "Build the 4-word sentence. ONE word is a trick and doesn't belong!",
            words: [
                { text: "The", type: "other", order: 0 },
                { text: "cat", type: "noun", order: 1 },
                { text: "drinks", type: "verb", order: 2 },
                { text: "milk", type: "noun", order: 3 },
                { text: "cheese", type: "noun", order: -1 } // Distractor!
            ]
        },
        {
            phase: 3, phaseName: "Critical Thinking",
            sentence: "I eat red apple",
            targetLength: 4,
            hasColors: false,
            instruction: "Build the 4-word sentence. ONE word is a trick and doesn't belong!",
            words: [
                { text: "I", type: "noun", order: 0 },
                { text: "eat", type: "verb", order: 1 },
                { text: "red", type: "other", order: 2 },
                { text: "apple", type: "noun", order: 3 },
                { text: "blue", type: "other", order: -1 } // Distractor!
            ]
        },
        {
            phase: 3, phaseName: "Critical Thinking",
            sentence: "He runs very fast",
            targetLength: 4,
            hasColors: false,
            instruction: "Build the 4-word sentence. ONE word is a trick and doesn't belong!",
            words: [
                { text: "He", type: "noun", order: 0 },
                { text: "runs", type: "verb", order: 1 },
                { text: "very", type: "other", order: 2 },
                { text: "fast", type: "other", order: 3 },
                { text: "turtle", type: "other", order: -1 } // Distractor!
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
        correctlyPlaced = 0;
        
        // تحديد لون شارة المرحلة
        let badgeColor = data.phase === 1 ? "#48BB78" : (data.phase === 2 ? "#4299E1" : "#ED8936");
        
        // إخفاء أو إظهار دليل الألوان بناءً على المرحلة
        const legendHTML = data.hasColors ? `
            <div class="legend">
                <div class="legend-item"><div class="dot noun"></div> Noun</div>
                <div class="legend-item"><div class="dot verb"></div> Verb</div>
            </div>
        ` : '<div class="legend-item" style="color:#718096; font-style:italic;">No color hints this time!</div>';

        stage.innerHTML = `
            <style>
                .sentence-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', 'Comic Sans MS', 'OpenDyslexic', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    color: #2D3748;
                }
                .game-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    padding: 12px 20px;
                    background: #EDF2F7;
                    border-radius: 12px;
                }
                .level-badge {
                    background: ${badgeColor};
                    color: white;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: bold;
                    letter-spacing: 0.05em;
                }
                .legend { display: flex; gap: 15px; }
                .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; font-weight: 600; }
                .dot { width: 12px; height: 12px; border-radius: 50%; }
                .dot.noun { background: #4299E1; }
                .dot.verb { background: #F6AD55; }

                .instruction-text {
                    font-size: 1.15rem;
                    color: #4A5568;
                    text-align: center;
                    margin: 5px 0 15px 0;
                    font-weight: 600;
                    background: #FFF;
                    padding: 12px 20px;
                    border-radius: 10px;
                    border-left: 5px solid ${badgeColor};
                    width: 100%;
                    box-sizing: border-box;
                }

                .magnetic-rail {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    padding: 25px;
                    background: #F7FAFC;
                    border: 3px dashed #CBD5E0;
                    border-radius: 16px;
                    min-height: 100px;
                    width: 100%;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                }
                .word-slot {
                    width: 110px;
                    height: 65px;
                    border-bottom: 4px solid #E2E8F0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .word-slot::before {
                    content: attr(data-slot-num);
                    position: absolute;
                    top: -25px;
                    font-size: 0.85rem;
                    color: #A0AEC0;
                    font-weight: bold;
                }
                .word-slot.drag-over {
                    background: #EBF8FF;
                    border-bottom-color: #4299E1;
                }

                .magnet-pool {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-top: 30px;
                    justify-content: center;
                    padding: 25px;
                    background: #EDF2F7;
                    border-radius: 16px;
                    width: 100%;
                    box-sizing: border-box;
                    min-height: 100px;
                }
                .magnet {
                    padding: 12px 20px;
                    background: white;
                    border: 2px solid #E2E8F0;
                    border-radius: 10px;
                    font-size: 1.15rem;
                    font-weight: 700;
                    cursor: grab;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    touch-action: none;
                    z-index: 10;
                    user-select: none;
                    letter-spacing: 0.03em;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .magnet:active { cursor: grabbing; transform: scale(1.05); }
                
                /* Color coding classes */
                .magnet.noun { border-bottom: 5px solid #4299E1; }
                .magnet.verb { border-bottom: 5px solid #F6AD55; }
                .magnet.other { border-bottom: 5px solid #718096; }
                
                /* Neutral class for advanced levels */
                .magnet.neutral { border-bottom: 5px solid #A0AEC0; }

                .magnet.correct { 
                    cursor: default; 
                    box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.3);
                    border-color: #48BB78 !important;
                    background: #F0FFF4;
                    transform: none !important;
                }
                
                .shaking {
                    animation: shakeMagnet 0.4s ease-in-out;
                }

                @keyframes shakeMagnet {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-6px); }
                    40% { transform: translateX(6px); }
                    60% { transform: translateX(-4px); }
                    80% { transform: translateX(4px); }
                }
            </style>

            <div class="sentence-container">
                <div class="game-header">
                    <span class="level-badge">${data.phaseName}</span>
                    ${legendHTML}
                    <div style="font-weight: 800; color: #2B6CB0;">Score: ${score}</div>
                </div>

                <div class="instruction-text">${data.instruction}</div>

                <div class="magnetic-rail">
                    ${Array(data.targetLength).fill(0).map((_, i) => `
                        <div class="word-slot" id="slot-${i}" data-order="${i}" data-slot-num="${i + 1}"></div>
                    `).join('')}
                </div>

                <div class="magnet-pool" id="magnet-pool"></div>
            </div>
        `;

        const pool = document.getElementById('magnet-pool');
        // خلط الكلمات بما فيها الكلمة المشتتة
        const shuffledWords = [...data.words].sort(() => Math.random() - 0.5);

        shuffledWords.forEach(wData => {
            const magnet = document.createElement('div');
            // تطبيق الألوان فقط إذا كانت المرحلة تسمح بذلك
            const typeClass = data.hasColors ? wData.type : 'neutral';
            magnet.className = `magnet ${typeClass}`;
            magnet.innerText = wData.text;
            pool.appendChild(magnet);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(magnet, (x, y, el) => {
                    let foundSlot = null;
                    
                    // البحث عن الخانة التي تم الإفلات فوقها
                    for (let i = 0; i < data.targetLength; i++) {
                        const slot = document.getElementById(`slot-${i}`);
                        const rect = slot.getBoundingClientRect();
                        
                        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                            foundSlot = { element: slot, order: i };
                            break;
                        }
                    }

                    if (foundSlot) {
                        // التحقق مما إذا كانت الكلمة تنتمي لهذا المكان
                        // ملاحظة: الكلمة المشتتة لها order: -1، لذا هذا الشرط سيفشل دائماً لها
                        if (wData.order === foundSlot.order) {
                            snapToRail(el, foundSlot.element, x, y);
                        } else {
                            handleWrongSnap(el);
                        }
                    } else {
                        // إذا تم إفلات الكلمة خارج الخانات، تعود لمكانها
                        if (el.resetPosition) el.resetPosition();
                    }
                });
            }
        });
    }

    function snapToRail(magnet, slot, x, y) {
        if (magnet.classList.contains('correct')) return;

        magnet.classList.add('correct');
        magnet.style.position = 'static';
        magnet.style.transform = 'none';
        
        slot.innerHTML = '';
        slot.appendChild(magnet);
        
        score += 25;
        correctlyPlaced++;

        if (window.GameHub) {
            window.GameHub.playSound('correct');
            window.GameHub.triggerVFX(x, y);
        }

        // شرط الفوز يعتمد على targetLength (4) وليس عدد الكلمات الكلي (5 في المراحل المتقدمة)
        if (correctlyPlaced === gameData[currentLevel].targetLength) {
            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.querySelector('.sentence-container').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Sentence Architect!", `You built all sentences perfectly! Final Score: ${score}`);
                    } else {
                        alert(`Sentence Architect! You built all sentences perfectly! Final Score: ${score}`);
                    }
                }
            }, 1200);
        }
    }

    function handleWrongSnap(magnet) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        
        // إزالة الكلاس أولاً لإعادة تشغيل الأنيميشن إذا تم الضغط بسرعة
        magnet.classList.remove('shaking');
        void magnet.offsetWidth; // Trigger reflow
        
        magnet.classList.add('shaking');
        magnet.style.borderColor = "#F56565";
        
        setTimeout(() => {
            magnet.classList.remove('shaking');
            magnet.style.borderColor = ""; // العودة للون الأصلي (أو المحايد)
            if (magnet.resetPosition) magnet.resetPosition();
        }, 500);
    }
})();