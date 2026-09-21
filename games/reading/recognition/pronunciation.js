/**
Game 8: Sound Tap (نطق الحروف في كلمات بسيطة)
Filename: games/read_d1_g8.js
Logic: Tap the letter to hear its phoneme, then tap the matching object.
Dyslexia Focus: Grapheme-Phoneme correspondence using Web Speech API.
*/
(function() {
let levelIndex = 0;
const totalLevels = 15;
let score = 0;
let soundPlayed = false;
let currentStage = null;

 const gameData = [
     { letter: "S", phoneme: "sssss as in snake", options: [{icon: "🐍", correct: true}, {icon: "🍎", correct: false}] },
     { letter: "A", phoneme: "ah as in apple", options: [{icon: "🍎", correct: true}, {icon: "🚗", correct: false}] },
     { letter: "T", phoneme: "ttt as in tiger", options: [{icon: "🐯", correct: true}, {icon: "🍦", correct: false}] },
     { letter: "P", phoneme: "ppp as in pizza", options: [{icon: "🍕", correct: true}, {icon: "🎈", correct: false}] },
     { letter: "M", phoneme: "mmm as in monkey", options: [{icon: "🐒", correct: true}, {icon: "🌙", correct: false}] },
     { letter: "D", phoneme: "d. d. d. duh", options: [{icon: "🐕", correct: true}, {icon: "🍭", correct: false}] },
     { letter: "G", phoneme: "goh goh goh goh", options: [{icon: "🐐", correct: true}, {icon: "🍇", correct: false}] },
     { letter: "B", phoneme: "b. b. b. buh", options: [{icon: "⚽", correct: true}, {icon: "🍌", correct: false}] },
     { letter: "R", phoneme: "rrrr", options: [{icon: "🐇", correct: true}, {icon: "🚀", correct: false}] },
     { letter: "H", phoneme: "huh, huh", options: [{icon: "👒", correct: true}, {icon: "🚗", correct: false}] },
     { letter: "O", phoneme: "Oh", options: [{icon: "🐙", correct: true}, {icon: "🐱", correct: false}] },
     { letter: "C", phoneme: "ka", options: [{icon: "🐱", correct: true}, {icon: "🐕", correct: false}] },
     { letter: "K", phoneme: "Kay", options: [{icon: "🪁", correct: true}, {icon: "🍎", correct: false}] },
     { letter: "E", phoneme: "Ee", options: [{icon: "🥚", correct: true}, {icon: "🎈", correct: false}] },
     { letter: "U", phoneme: "Ah", options: [{icon: "☂️", correct: true}, {icon: "🐟", correct: false}] }
 ];

 window.initGame = function(containerId) {
     currentStage = document.getElementById(containerId);
     if (!currentStage) return;
     levelIndex = 0;
     score = 0;
     renderLevel(currentStage);
 };

 function nextRound() {
     if (levelIndex < gameData.length - 1) {
         levelIndex++;
         renderLevel(currentStage);
     } else {
         if (window.GameHub?.showComplete) {
             window.GameHub.showComplete("Phonics Pro!", `Great job! You identified all sounds! Score: ${score}/15`);
         }
     }
 }

 function previousRound() {
     if (levelIndex > 0) {
         levelIndex--;
         renderLevel(currentStage);
     }
 }

 function playPhoneme(text) {
     const statusText = document.getElementById('status-text');
     const letterCard = document.getElementById('letter-card');
     if (statusText) statusText.innerText = "Listening... 🔊";
     if (letterCard) {
         letterCard.classList.add('heard');
         letterCard.style.opacity = "1";
     }
     if (window.GameHub && typeof window.GameHub.speak === 'function') {
         window.GameHub.speak(text, 'en-US');
     }
     soundPlayed = true;
     if (statusText) statusText.innerText = "Tap to listen again 🔊";
     const grid = document.getElementById('options-grid');
     if (grid) grid.classList.remove('disabled');
 }

 function renderLevel(stage) {
     const data = gameData[levelIndex];
     soundPlayed = false;
     const shuffledOptions = [...data.options].sort(() => Math.random() - 0.5);
     
     stage.innerHTML = `
         <style>
             .game-wrapper {
                 display: flex; flex-direction: column; align-items: center; gap: 20px;
                 width: 100%; max-width: 500px; margin: 0 auto; padding: 20px;
                 font-family: system-ui, -apple-system, sans-serif;
             }
             .status-row { display: flex; width: 100%; justify-content: space-between; align-items: center; gap: 10px; }
             .instruction { font-size: 1.2rem; font-weight: 700; color: #2D3748; text-align: center; line-height: 1.4; }
             .letter-card {
                 width: 140px; height: 140px; background: #4A90E2; color: white; font-size: 5rem;
                 font-weight: 900; display: flex; align-items: center; justify-content: center;
                 border-radius: 24px; cursor: pointer; box-shadow: 0 10px 20px rgba(74, 144, 226, 0.3);
                 transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 5px solid white; position: relative;
             }
             .letter-card:active { transform: scale(0.95); }
             .letter-card.heard { background: #48BB78; box-shadow: 0 10px 20px rgba(72, 187, 120, 0.3); }
             #status-text { color: #718096; font-size: 0.95rem; font-weight: 500; height: 40px; text-align: center; }
             .options-grid { display: flex; gap: 25px; transition: all 0.4s ease; }
             .options-grid.disabled { opacity: 0.2; pointer-events: none; filter: grayscale(1); transform: translateY(10px); }
             .option-item {
                 width: 150px; height: 150px; background: white; border: 4px solid #E2E8F0; border-radius: 28px;
                 display: flex; align-items: center; justify-content: center; font-size: 4.5rem; cursor: pointer;
                 transition: all 0.2s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
             }
             .option-item:hover { border-color: #4A90E2; transform: translateY(-8px); box-shadow: 0 12px 20px rgba(0,0,0,0.1); }
             .level-indicator {
                 font-size: 14px; font-weight: bold; color: #4A5568; background: #EDF2F7; padding: 8px 20px; border-radius: 30px;
             }
         </style>
         <div class="game-wrapper">
             <div class="status-row">
                 <button id="prev-btn" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color:#4A5568; visibility: ${levelIndex > 0 ? 'visible' : 'hidden'};">⬅️ Previous</button>
                 <div class="level-indicator">Level ${levelIndex + 1} / ${totalLevels}</div>
             </div>
             <div class="instruction">First, tap the letter to hear its sound!</div>
             <div id="letter-card" class="letter-card">
                 <div>${data.letter}</div>
             </div>
             <div id="status-text">Tap the blue card 🔊</div>
             <div class="instruction" style="font-size: 1rem; color: #718096;">Now, which one matches the sound?</div>
             <div id="options-grid" class="options-grid disabled">
                 ${shuffledOptions.map((opt, i) => `
                     <div class="option-item" data-correct="${opt.correct}">${opt.icon}</div>
                 `).join('')}
             </div>
         </div>
     `;
     
     const prevBtn = stage.querySelector('#prev-btn');
     if (prevBtn) prevBtn.onclick = previousRound;

     document.getElementById('letter-card').onclick = () => {
         playPhoneme(data.phoneme);
     };
     
     const items = stage.querySelectorAll('.option-item');
     items.forEach(item => {
         item.onclick = (e) => {
             if (!soundPlayed) return;
             const isCorrect = item.dataset.correct === "true";
             if (isCorrect) {
                 item.style.background = "#C6F6D5";
                 item.style.borderColor = "#48BB78";
                 score++;
                 if (window.GameHub) {
                     window.GameHub.triggerVFX(e.clientX, e.clientY);
                     window.GameHub.playSound('correct');
                 }
                 setTimeout(() => nextRound(), 1000);
             } else {
                 if (window.GameHub) window.GameHub.playSound('wrong');
                 item.style.background = "#FFF5F5";
                 item.style.borderColor = "#F56565";
                 item.animate([
                     { transform: 'translateX(-5px)' },
                     { transform: 'translateX(5px)' },
                     { transform: 'translateX(0)' }
                 ], { duration: 200, iterations: 2 });
                 setTimeout(() => {
                     item.style.background = "white";
                     item.style.borderColor = "#E2E8F0";
                 }, 500);
             }
         };
     });
 }
 
 window.nextRound = nextRound;
 window.previousRound = previousRound;
})();