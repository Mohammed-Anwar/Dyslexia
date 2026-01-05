/**
 * Game 2: Finding Similar Images
 * Filename: games/read_d1_g2.js
 * 15 Levels: 1-5 (Theme Match), 6-10 (Shape Match), 11-15 (Shadow Logic Match)
 */

(function() {
    let score = 0;
    let currentRound = 0;
    const totalRounds = 15;

    // Themed sets for Stage 1
    const itemSets = [
        ['🦁', '🐯', '🐱', '🐶', '🦊'],
        ['🚗', '🚕', '🚙', '🚌', '🏎️'],
        ['🍏', '🍐', '🥝', '🥦', '🎾'],
        ['🎈', '🏮', '🔴', '📍', '🍎'],
        ['🌙', '🍌', '🧀', '🍋', '✨']
    ];

    // Geometric sets for Stage 2
    const geometricPool = [
        { char: '🔴', color: 'red' }, { char: '🟦', color: 'blue' },
        { char: '🔺', color: 'red' }, { char: '🟡', color: 'yellow' },
        { char: '⬛', color: 'black' }, { char: '⭐', color: 'yellow' },
        { char: '💎', color: 'blue' }, { char: '🧡', color: 'orange' }
    ];

    // General item pool for Stage 3
    const shadowPool = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍍', '🥦', '🍉', '🐳', '🐧', '🍄', '☀️'];

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

        // Target Display Area
        const targetContainer = document.createElement('div');
        targetContainer.id = "target-container";
        targetContainer.style.cssText = `
            background: #F7FAFC; padding: 15px; border-radius: 20px;
            border: 3px dashed #CBD5E0; margin-bottom: 15px;
            display: flex; flex-direction: column; align-items: center; width: 140px;
        `;
        
        const targetLabel = document.createElement('p');
        targetLabel.innerText = "TARGET";
        targetLabel.style.cssText = "font-size: 0.7rem; font-weight: bold; color: #A0AEC0; margin: 0 0 5px 0; letter-spacing: 1px;";
        
        const targetIcon = document.createElement('div');
        targetIcon.id = "target-icon";
        targetIcon.style.fontSize = "60px";

        targetContainer.appendChild(targetLabel);
        targetContainer.appendChild(targetIcon);

        const grid = document.createElement('div');
        grid.id = "game-grid";
        grid.style.cssText = `display: grid; gap: 10px; margin-bottom: 20px; min-height: 220px; align-items: center; justify-content: center; width: 100%;`;

        const stats = document.createElement('div');
        stats.id = "game-stats";
        stats.style.cssText = `
            font-weight: bold; color: #718096; font-size: 1rem; 
            background: #EDF2F7; padding: 10px 25px; border-radius: 50px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-top: 10px;
        `;

        gameWrapper.appendChild(instruction);
        gameWrapper.appendChild(targetContainer);
        gameWrapper.appendChild(grid);
        gameWrapper.appendChild(stats);
        stage.appendChild(gameWrapper);

        nextRound(grid, stats, instruction, targetIcon);
    };

    function nextRound(grid, stats, instruction, targetIcon) {
        if (currentRound >= totalRounds) {
            if (window.GameHub?.showComplete) {
                window.GameHub.showComplete("Eagle-Eyed Scout!", `You found all 15 matches! Score: ${score}`);
            }
            return;
        }

        currentRound++;
        grid.innerHTML = '';
        stats.innerText = `Level: ${currentRound} / ${totalRounds} | Score: ${score}`;
        
        targetIcon.style.filter = "none"; // Reset filter

        if (currentRound <= 5) {
            setupThemeMatch(grid, instruction, targetIcon);
        } else if (currentRound <= 10) {
            setupShapeMatch(grid, instruction, targetIcon);
        } else {
            setupShadowLogicMatch(grid, instruction, targetIcon);
        }
    }

    function setupThemeMatch(grid, instruction, targetIcon) {
        instruction.innerText = "Find the matching image!";
        grid.style.gridTemplateColumns = "repeat(3, 100px)";

        const currentSet = itemSets[Math.floor(Math.random() * itemSets.length)];
        const targetItem = currentSet[Math.floor(Math.random() * currentSet.length)];
        const distractors = currentSet.filter(i => i !== targetItem).sort(() => 0.5 - Math.random()).slice(0, 5);
        
        targetIcon.innerText = targetItem;
        renderOptions(grid, targetItem, distractors);
    }

    function setupShapeMatch(grid, instruction, targetIcon) {
        instruction.innerText = "Match the SHAPE (ignore the color)!";
        grid.style.gridTemplateColumns = "repeat(3, 100px)";

        const colors = ['red', 'yellow', 'blue'];
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];
        const sameColorPool = geometricPool.filter(i => i.color === chosenColor);
        
        const targetItem = sameColorPool[0].char;
        const distractor = sameColorPool[1].char;
        
        targetIcon.innerText = targetItem;
        
        // In this mode, we fill the grid with the same colored shapes to make it hard
        let options = [targetItem];
        for(let i=0; i<5; i++) options.push(distractor);
        
        renderShuffledOptions(grid, targetItem, options);
    }

    function setupShadowLogicMatch(grid, instruction, targetIcon) {
        instruction.innerText = "Match the shadow to the real object!";
        grid.style.gridTemplateColumns = "repeat(3, 100px)";

        const pool = [...shadowPool].sort(() => 0.5 - Math.random());
        const targetItem = pool[0];
        const distractors = pool.slice(1, 6);

        targetIcon.innerText = targetItem;
        targetIcon.style.filter = "brightness(0)"; // Make target a shadow
        
        renderOptions(grid, targetItem, distractors);
    }

    function renderOptions(grid, target, distractors) {
        let options = [target, ...distractors];
        renderShuffledOptions(grid, target, options);
    }

    function renderShuffledOptions(grid, target, options) {
        options.sort(() => 0.5 - Math.random());
        options.forEach(symbol => {
            const card = createCard(symbol);
            card.onclick = (e) => {
                if (symbol === target) onCorrect(e, card, grid);
                else onWrong(card);
            };
            grid.appendChild(card);
        });
    }

    function createCard(symbol) {
        const card = document.createElement('button');
        card.innerText = symbol;
        card.style.cssText = `
            font-size: 40px; width: 90px; height: 90px;
            border: 3px solid #E2E8F0; border-radius: 20px;
            background: white; cursor: pointer; transition: all 0.2s;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05); outline: none; margin: auto;
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
        setTimeout(() => {
            nextRound(
                document.getElementById('game-grid'), 
                document.getElementById('game-stats'), 
                document.getElementById('game-instruction'),
                document.getElementById('target-icon')
            );
        }, 800);
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
            @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }
})();