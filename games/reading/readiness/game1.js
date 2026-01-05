/**
 * Game 1: Advanced Distinguishing Skills
 * Filename: games/read_d1_g1.js
 * 15 Levels: 1-5 (Color Contrast), 6-10 (Shape Logic), 11-15 (Shadow Match)
 */

(function() {
    let score = 0;
    let currentRound = 0;
    const totalRounds = 15;

    // Level sets with color metadata to prevent similarity in Stage 1
    const itemPool = [
        { char: '🍎', color: 'red' }, { char: '🍌', color: 'yellow' },
        { char: '🍇', color: 'purple' }, { char: '🍓', color: 'red' },
        { char: '🍊', color: 'orange' }, { char: '🍍', color: 'yellow' },
        { char: '🥦', color: 'green' }, { char: '🍉', color: 'green' },
        { char: '🐳', color: 'blue' }, { char: '🐧', color: 'black' },
        { char: '🍄', color: 'red' }, { char: '☀️', color: 'yellow' }
    ];

    const geometricPool = [
        { char: '🔴', color: 'red' }, { char: '🟦', color: 'blue' },
        { char: '🔺', color: 'red' }, { char: '🟡', color: 'yellow' },
        { char: '⬛', color: 'black' }, { char: '⭐', color: 'yellow' },
        { char: '💎', color: 'blue' }, { char: '🧡', color: 'orange' }
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        
        stage.innerHTML = ''; 
        currentRound = 0;
        score = 0;

        const gameWrapper = document.createElement('div');
        gameWrapper.style.cssText = `
            display: flex; flex-direction: column; align-items: center;
            width: 100%; max-width: 100%; animation: fadeIn 0.5s ease; user-select: none;
            padding: 10px; box-sizing: border-box; justify-content: flex-start;
        `;

        const instruction = document.createElement('h2');
        instruction.id = "game-instruction";
        instruction.style.cssText = "margin-bottom: 10px; color: #2D3748; text-align: center; font-size: 1.4rem; width: 100%;";

        const grid = document.createElement('div');
        grid.id = "game-grid";
        grid.style.cssText = `display: grid; gap: 10px; margin-bottom: 20px; min-height: 300px; align-items: center; justify-content: center; width: 100%;`;

        const stats = document.createElement('div');
        stats.id = "game-stats";
        stats.style.cssText = `
            font-weight: bold; color: #718096; font-size: 1rem; 
            background: #EDF2F7; padding: 10px 25px; border-radius: 50px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-top: 10px;
        `;

        gameWrapper.appendChild(instruction);
        gameWrapper.appendChild(grid);
        gameWrapper.appendChild(stats);
        stage.appendChild(gameWrapper);

        nextRound(grid, stats, instruction);
    };

    function nextRound(grid, stats, instruction) {
        if (currentRound >= totalRounds) {
            if (window.GameHub?.showComplete) {
                window.GameHub.showComplete("Master Explorer!", `You completed all 15 levels with a score of ${score}!`);
            }
            return;
        }

        currentRound++;
        grid.innerHTML = '';
        stats.innerText = `Level: ${currentRound} / ${totalRounds} | Score: ${score}`;
        
        if (currentRound <= 5) {
            setupContrastStage(grid, instruction);
        } else if (currentRound <= 10) {
            setupShapeStage(grid, instruction);
        } else {
            setupShadowStage(grid, instruction);
        }
    }

    // --- STAGE 1: Different Colors/Items (9 grid) ---
    function setupContrastStage(grid, instruction) {
        instruction.innerText = "Find the item that looks different!";
        grid.style.gridTemplateColumns = "repeat(3, 100px)";
        
        let main = itemPool[Math.floor(Math.random() * itemPool.length)];
        let odd = itemPool[Math.floor(Math.random() * itemPool.length)];
        
        // Ensure color and icon are different
        while (odd.color === main.color || odd.char === main.char) {
            odd = itemPool[Math.floor(Math.random() * itemPool.length)];
        }

        createGrid(grid, 9, main.char, odd.char);
    }

    // --- STAGE 2: Same Color, Different Shape (9 grid) ---
    function setupShapeStage(grid, instruction) {
        instruction.innerText = "Find the different SHAPE!";
        grid.style.gridTemplateColumns = "repeat(3, 100px)";

        // Filter items that share colors but have different shapes
        const colors = ['red', 'yellow', 'blue'];
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];
        const sameColorPool = geometricPool.filter(i => i.color === chosenColor);
        
        const main = sameColorPool[0].char;
        const odd = sameColorPool[1].char;

        createGrid(grid, 9, main, odd);
    }

    // --- STAGE 3: Shadow Match (3 choices) ---
    function setupShadowStage(grid, instruction) {
        instruction.innerText = "Which one matches the shadow?";
        grid.style.gridTemplateColumns = "repeat(3, 100px)";

        const choices = [...itemPool].sort(() => 0.5 - Math.random()).slice(0, 3);
        const correctIdx = Math.floor(Math.random() * 3);
        const target = choices[correctIdx].char;

        // Shadow display area (spanning top row)
        const shadowBox = document.createElement('div');
        shadowBox.style.cssText = `
            grid-column: 1 / span 3; background: #F7FAFC; border: 2px dashed #CBD5E0; 
            border-radius: 20px; height: 110px; display: flex; align-items: center; 
            justify-content: center; font-size: 70px; margin-bottom: 5px;
            position: relative; overflow: hidden;
        `;
        
        const silhouette = document.createElement('span');
        silhouette.innerText = target;
        silhouette.style.cssText = `filter: brightness(0); opacity: 0.9;`;
        
        shadowBox.appendChild(silhouette);
        grid.appendChild(shadowBox);

        choices.forEach((item, idx) => {
            const card = createCard(item.char);
            card.onclick = (e) => {
                if (idx === correctIdx) {
                    onCorrect(e, card, grid);
                } else {
                    onWrong(card);
                }
            };
            grid.appendChild(card);
        });
    }

    function createGrid(grid, count, mainChar, oddChar) {
        const oddIndex = Math.floor(Math.random() * count);
        for (let i = 0; i < count; i++) {
            const char = (i === oddIndex) ? oddChar : mainChar;
            const card = createCard(char);
            card.onclick = (e) => {
                if (i === oddIndex) onCorrect(e, card, grid);
                else onWrong(card);
            };
            grid.appendChild(card);
        }
    }

    function createCard(symbol) {
        const card = document.createElement('button');
        card.innerText = symbol;
        card.style.cssText = `
            font-size: 40px; width: 90px; height: 90px;
            border: 3px solid #E2E8F0; border-radius: 20px;
            background: white; cursor: pointer; transition: all 0.2s;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05); outline: none;
            margin: auto;
        `;
        card.onmouseenter = () => card.style.transform = "scale(1.05)";
        card.onmouseleave = () => card.style.transform = "scale(1)";
        return card;
    }

    function onCorrect(e, card, grid) {
        score++;
        if (window.GameHub) {
            window.GameHub.triggerVFX(e.clientX, e.clientY);
            window.GameHub.playSound('correct');
        }
        card.style.background = "#C6F6D5";
        card.style.borderColor = "#48BB78";
        grid.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
        setTimeout(() => nextRound(document.getElementById('game-grid'), document.getElementById('game-stats'), document.getElementById('game-instruction')), 800);
    }

    function onWrong(card) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        card.style.animation = "shake 0.4s";
        card.style.background = "#FFF5F5";
        card.style.borderColor = "#F56565";
        setTimeout(() => {
            card.style.animation = "";
            card.style.background = "white";
            card.style.borderColor = "#E2E8F0";
        }, 400);
    }

    if (!document.getElementById('game-vfx-styles')) {
        const style = document.createElement('style');
        style.id = 'game-vfx-styles';
        style.innerHTML = `
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }
})();