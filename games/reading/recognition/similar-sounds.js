/**
Game 9: Sound Sort (التمييز بين الأصوات المتشابهة)
Filename: games/read_d1_g9.js
Logic: Listen to a word (or an isolated phoneme) and sort it into the
   correct picture bucket based on the confusing consonant sound.
Dyslexia Focus: Auditory discrimination using Web Speech API (speechSynthesis).
*/
(function() {
let levelIndex = 0;
const totalLevels = 15;
let score = 0;
let currentStage = null;

 const gameData = [
     { target: { word: "Bear", emoji: "🐻" }, distractor: { word: "Pear", emoji: "🍐" },
       letter: "B", audioText: "Find the Bear", mode: "word" },
     { target: { word: "Buy", emoji: "💰" }, distractor: { word: "Pie", emoji: "🥧" },
       letter: "B", audioText: "Select Buy", mode: "word" },
     { target: { word: "Pin", emoji: "📌" }, distractor: { word: "Bin", emoji: "🗑️" },
       letter: "P", audioText: "p, p, p, as in Pin", mode: "phoneme" },
     { target: { word: "Big", emoji: "🐘" }, distractor: { word: "Pig", emoji: "🐷" },
       letter: "B", audioText: "Select Big", mode: "word" },
     { target: { word: "Town", emoji: "🏘️" }, distractor: { word: "Down", emoji: "⬇️" },
       letter: "T", audioText: "Select Town", mode: "word" },
     { target: { word: "Dime", emoji: "🪙" }, distractor: { word: "Time", emoji: "⏰" },
       letter: "D", audioText: "d, d, d, as in Dime", mode: "phoneme" },
     { target: { word: "To", emoji: "➡️" }, distractor: { word: "Do", emoji: "✅" },
       letter: "T", audioText: "Find To", mode: "word" },
     { target: { word: "Tie", emoji: "👔" }, distractor: { word: "Die", emoji: "🎲" },
       letter: "T", audioText: "Find the Tie", mode: "word" },
     { target: { word: "Van", emoji: "🚐" }, distractor: { word: "Fan", emoji: "🌬️" },
       letter: "V", audioText: "v, v, v, as in Van", mode: "phoneme" },
     { target: { word: "Fast", emoji: "🏃" }, distractor: { word: "Vast", emoji: "🌌" },
       letter: "F", audioText: "Find Fast", mode: "word" },
     { target: { word: "Live", emoji: "📡" }, distractor: { word: "Life", emoji: "❤️" },
       letter: "V", audioText: "Select Live", mode: "word" },
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
             window.GameHub.showComplete("Sound Expert!", `You sorted all the sounds correctly! Score: ${score}/${totalLevels}`);
         }
     }
 }

 function previousRound() {
     if (levelIndex > 0) {
         levelIndex--;
         renderLevel(currentStage);
     }
 }

 function playSound(text) {
     const status = document.getElementById('sort-status');
     if (status) status.innerText = "Listening... 🔊";
     if (window.GameHub && typeof window.GameHub.speak === 'function') {
         window.GameHub.speak(text, 'en-US');
     }
     const buckets = document.getElementById('buckets-container');
     if (buckets) buckets.classList.remove('disabled');
     if (status) status.innerText = "Which one did you hear?";
 }

 function shuffle(arr) {
     const a = arr.slice();
     for (let i = a.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [a[i], a[j]] = [a[j], a[i]];
     }
     return a;
 }

 function renderLevel(stage) {
     const data = gameData[levelIndex];
     const isWordMode = data.mode === "word";
     const bucketOptions = shuffle([
         { ...data.target, isTarget: true },
         { ...data.distractor, isTarget: false }
     ]);
     
     stage.innerHTML = `
         <style>
             .sort-wrapper {
                 display: flex; flex-direction: column; align-items: center; gap: 30px;
                 width: 100%; max-width: 600px; margin: 0 auto; padding: 20px;
                 font-family: 'Segoe UI', Tahoma, sans-serif;
             }
             .status-row {
                 display: flex; width: 100%; justify-content: space-between; align-items: center; gap: 10px;
             }
             .sound-trigger {
                 width: 120px; height: 120px; background: #667EEA; border-radius: 50%;
                 display: flex; align-items: center; justify-content: center; font-size: 4rem;
                 color: white; cursor: pointer; box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
                 transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 6px solid white;
             }
             .sound-trigger:hover { transform: scale(1.1); background: #5A67D8; }
             .buckets-container {
                 display: flex; gap: 30px; width: 100%; justify-content: center; transition: opacity 0.3s ease;
             }
             .buckets-container.disabled { opacity: 0.2; pointer-events: none; filter: grayscale(1); }
             .bucket {
                 width: 170px; height: 190px; background: white; border: 4px dashed #CBD5E0;
                 border-radius: 24px; display: flex; flex-direction: column; align-items: center;
                 justify-content: center; gap: 8px; color: #4A5568; cursor: pointer; transition: all 0.3s ease; padding: 10px;
             }
             .bucket .bucket-emoji { font-size: 4rem; line-height: 1; }
             .bucket .bucket-word { font-size: 1.4rem; font-weight: 800; }
             .bucket:hover { background: #F7FAFC; border-color: #4299E1; transform: translateY(-8px); }
             #sort-status { font-weight: 600; color: #718096; min-height: 24px; }
             .level-indicator {
                 font-size: 14px; font-weight: bold; color: #4A5568; background: #EDF2F7; padding: 8px 20px; border-radius: 30px;
             }
             .mode-badge {
                 font-size: 12px; font-weight: 700; color: #667EEA; background: #EDF2FF; padding: 4px 12px; border-radius: 20px;
             }
         </style>
         <div class="sort-wrapper">
             <div class="status-row">
                 <button id="prev-btn" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color:#4A5568; visibility: ${levelIndex > 0 ? 'visible' : 'hidden'};">⬅️ Previous</button>
                 <div class="level-indicator">Level ${levelIndex + 1} / ${totalLevels}</div>
             </div>
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
     
     const prevBtn = stage.querySelector('#prev-btn');
     if (prevBtn) prevBtn.onclick = previousRound;

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
                 setTimeout(() => nextRound(), 1000);
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
 
 window.nextRound = nextRound;
 window.previousRound = previousRound;
})();