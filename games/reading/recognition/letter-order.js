/**
 * Game 6: Sound Train (الوعي الصوتي وتحديد مكان الصوت)
 * Filename: games/read_d1_g6.js
 * Logic: Identify if the target sound is at the Start, Middle, or End of the word train using Web Speech API.
 * Dyslexia Focus: Phonological awareness, sequential processing, and auditory-spatial mapping.
 */

(function() {
    let currentLevel = 1;
    const totalLevels = 15;
    let score = 0;

    const gameData = [
        // المستوى الأول (1-4): أول الكلمة
        { word: "bus", emoji: "🚌", sound: "/b/", pos: 0 },
        { word: "dog", emoji: "🐶", sound: "/d/", pos: 0 },
        { word: "map", emoji: "🗺️", sound: "/m/", pos: 0 },
        { word: "sun", emoji: "☀️", sound: "/s/", pos: 0 },
        
        // المستوى الثاني (5-7): آخر الكلمة
        { word: "bed", emoji: "🛏️", sound: "/d/", pos: 2 },
        { word: "box", emoji: "📦", sound: "/ks/", pos: 2 },
        { word: "lip", emoji: "👄", sound: "/p/", pos: 2 },
        
        // المستوى الثالث (8-10): المنتصف (CVC)
        { word: "hen", emoji: "🐔", sound: "/e/", pos: 1 },
        { word: "cup", emoji: "☕", sound: "/ʌ/", pos: 1 },
        { word: "six", emoji: "6️⃣", sound: "/ɪ/", pos: 1 },
        
        // المستوى الرابع (11-13): التجمعات الساكنة في البداية
        { word: "frog", emoji: "🐸", sound: "/fr/", pos: 0 },
        { word: "clock", emoji: "🕒", sound: "/cl/", pos: 0 },
        { word: "snake", emoji: "🐍", sound: "/sn/", pos: 0 },
        
        // المستوى الخامس (14-15): الأصوات المركبة
        { word: "ship", emoji: "🚢", sound: "/sh/", pos: 0 },
        { word: "fish", emoji: "🐟", sound: "/sh/", pos: 2 }
    ];

    // دالة نطق الكلمات باستخدام نظام المتصفح (Web Speech API)
    function speakWord(word, slow = false) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // إيقاف أي نطق سابق لمنع التداخل
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = slow ? 0.6 : 0.9; // سرعة أبطأ عند الحاجة للتدقيق
            window.speechSynthesis.speak(utterance);
        }
    }

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        
        currentLevel = 1;
        score = 0;
        loadLevel(stage);
    };

    function loadLevel(stage) {
        const data = gameData[currentLevel - 1];
        let buttonMistakes = { 0: 0, 1: 0, 2: 0 };

        stage.innerHTML = `
            <style>
                .game-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    width: 100%;
                    max-width: 700px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Tajawal', 'Segoe UI', Tahoma, sans-serif;
                    animation: fadeIn 0.5s ease;
                    direction: rtl;
                }

                .instruction-text {
                    font-size: 1.5rem;
                    color: #2D3748;
                    font-weight: 700;
                    text-align: center;
                }

                .target-prompt {
                    font-size: 1.2rem;
                    color: #4A5568;
                    background: #EBF8FF;
                    padding: 10px 20px;
                    border-radius: 10px;
                    border: 2px dashed #4299E1;
                }

                .target-sound {
                    color: #2B6CB0;
                    font-size: 1.8rem;
                    font-weight: 900;
                    direction: ltr;
                    display: inline-block;
                    font-family: Arial, sans-serif;
                }

                .image-display {
                    font-size: 5rem;
                    background: white;
                    width: 130px;
                    height: 130px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    margin-bottom: 5px;
                    cursor: pointer;
                    transition: transform 0.2s, background-color 0.2s;
                    border: 3px solid #E2E8F0;
                }

                .image-display:hover {
                    background: #F7FAFC;
                    border-color: #4299E1;
                    transform: scale(1.03);
                }

                .image-display:active {
                    transform: scale(0.95);
                }

                .hint-audio-text {
                    font-size: 0.85rem;
                    color: #718096;
                    margin-top: -10px;
                    margin-bottom: 10px;
                }

                .word-reveal {
                    font-size: 2.5rem;
                    font-weight: 800;
                    letter-spacing: 3px;
                    color: #48BB78;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.5s ease;
                    height: 40px;
                    font-family: Arial, sans-serif;
                }

                .word-reveal.show {
                    opacity: 1;
                    transform: translateY(0);
                }

                .train-track {
                    display: flex;
                    align-items: center;
                    background: #CBD5E0;
                    padding: 15px;
                    border-radius: 15px;
                    box-shadow: inset 0 4px 6px rgba(0,0,0,0.1);
                    direction: ltr;
                }

                .locomotive {
                    font-size: 3rem;
                    margin-right: -10px;
                    z-index: 2;
                }

                .connector {
                    width: 15px;
                    height: 10px;
                    background: #4A5568;
                    z-index: 1;
                }

                .train-car {
                    width: 80px;
                    height: 70px;
                    background: #EDF2F7;
                    border: 4px solid #718096;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    box-shadow: 0 4px 0 #4A5568;
                }

                .train-car::after {
                    content: '⚫⚫';
                    position: absolute;
                    bottom: -15px;
                    font-size: 14px;
                    letter-spacing: 20px;
                    color: #2D3748;
                }

                .train-car:hover {
                    background: #E2E8F0;
                    border-color: #4299E1;
                }

                .train-car.selected {
                    background: #48BB78;
                    border-color: #276749;
                }

                .train-car.disabled {
                    opacity: 0.2;
                    pointer-events: none;
                    filter: grayscale(100%);
                }

                .level-indicator {
                    font-size: 14px;
                    font-weight: bold;
                    color: #718096;
                    background: #EDF2F7;
                    padding: 6px 16px;
                    border-radius: 20px;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            </style>

            <div class="game-wrapper">
                <div class="level-indicator">المستوى ${currentLevel} / ${totalLevels}</div>
                <div class="instruction-text">أين تسمع هذا الصوت في الكلمة؟</div>
                
                <div class="target-prompt">
                    ابحث عن مكان الصوت: <span class="target-sound">${data.sound}</span>
                </div>
                
                <div class="image-display" id="play-sound-btn" title="اضغط لسماع الكلمة">${data.emoji}</div>
                <div class="hint-audio-text">🔊 اضغط على الصورة للاستماع للكلمة</div>
                
                <div class="word-reveal" id="hidden-word">${data.word}</div>

                <div class="train-track">
                    <div class="locomotive">🚂</div>
                    <div class="connector"></div>
                    <div class="train-car" data-pos="0"></div>
                    <div class="connector"></div>
                    <div class="train-car" data-pos="1"></div>
                    <div class="connector"></div>
                    <div class="train-car" data-pos="2"></div>
                </div>
            </div>
        `;

        // تفعيل النطق عند الضغط على الصورة
        const soundBtn = stage.querySelector('#play-sound-btn');
        soundBtn.onclick = () => {
            speakWord(data.word);
            soundBtn.style.transform = "scale(0.93)";
            setTimeout(() => soundBtn.style.transform = "scale(1)", 150);
        };

        const cars = stage.querySelectorAll('.train-car');

        cars.forEach(car => {
            car.onclick = (e) => {
                const selectedPos = parseInt(car.dataset.pos);
                
                if (selectedPos === data.pos) {
                    car.classList.add('selected');
                    document.getElementById('hidden-word').classList.add('show');
                    score++;
                    
                    cars.forEach(c => c.style.pointerEvents = 'none');

                    if (window.GameHub) {
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                        window.GameHub.playSound('correct');
                    }
                    // إعادة نطق الكلمة بوضوح كتعزيز بعد الإجابة الصحيحة
                    setTimeout(() => speakWord(data.word), 400);

                    setTimeout(() => {
                        if (currentLevel < totalLevels) {
                            currentLevel++;
                            loadLevel(stage);
                        } else {
                            if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("قائد القطار الماهر!", `لقد استمعت للأصوات جيداً! النتيجة: ${score}/${totalLevels}`);
                            }
                        }
                    }, 2200);
                } else {
                    buttonMistakes[selectedPos]++;
                    
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    
                    if (buttonMistakes[selectedPos] === 1) {
                        car.style.animation = "shake 0.4s ease";
                        car.style.borderColor = "#F56565";
                        car.style.background = "#FFF5F5";
                        
                        // الخطأ الأول: إعادة نطق الكلمة ببطء (Slow Pronunciation) لمساعدة الطفل
                        setTimeout(() => speakWord(data.word, true), 300);
                        
                        setTimeout(() => {
                            car.style.animation = "";
                            car.style.borderColor = "#718096";
                            car.style.background = "#EDF2F7";
                        }, 500);
                    } else {
                        // الخطأ الثاني: اختفاء الزر الخاطئ وبقاؤه باهتاً تماماً (Fading)
                        car.classList.add('disabled');
                    }
                }
            };
        });
        
        // نطق تلقائي بطيء عند الدخول للمستوى لأول مرة
        setTimeout(() => {
            speakWord(data.word, true);
        }, 600);
    }
})();