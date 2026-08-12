/**
 * Game 7: Connected vs Disconnected Scripts (The Linker)
 * Logic: Drag magnetic connectors between letter tiles to build continuous words.
 * Dyslexia Focus: Understanding continuity and spelling syntax sequentially.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let connectionsMade = 0;
    let targetConnections = 0;

    const THEME_COLOR = "#3CB371";

    const gameData = [
        { word: "cat", letters: ["c", "a", "t"] },
        { word: "play", letters: ["p", "l", "a", "y"] },
        { word: "green", letters: ["g", "r", "e", "e", "n"] }
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
        connectionsMade = 0;
        targetConnections = data.letters.length - 1;
        
        stage.innerHTML = `
            <style>
                .linker-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    position: relative;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .instruction {
                    background: #F0FFF4;
                    padding: 15px;
                    border-radius: 8px;
                    color: #2D3748;
                    border: 2px solid ${THEME_COLOR};
                }
                .word-area {
                    display: flex;
                    gap: 40px;
                    margin-top: 50px;
                    position: relative;
                    z-index: 10;
                }
                .letter-block {
                    width: 80px;
                    height: 80px;
                    background: white;
                    border: 3px solid #CBD5E0;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-family: 'Comic Sans MS', cursive, sans-serif;
                    color: #2D3748;
                    position: relative;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                
                /* Linking Nodes */
                .node {
                    width: 20px;
                    height: 20px;
                    background: #E2E8F0;
                    border: 3px solid #A0AEC0;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    z-index: 20;
                    transition: all 0.2s;
                }
                .node.out { right: -25px; border-color: ${THEME_COLOR}; background: #F0FFF4; }
                .node.in { left: -25px; border-color: #F6AD55; background: #FFFBEB; }
                .node:hover { transform: translateY(-50%) scale(1.2); }
                .node.connected { background: ${THEME_COLOR}; border-color: #22543D; cursor: default; }

                #svg-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 5;
                }
                
                path.wire {
                    fill: none;
                    stroke: #A0AEC0;
                    stroke-width: 6;
                    stroke-linecap: round;
                    stroke-dasharray: 10, 10;
                }
                path.wire.active {
                    stroke: ${THEME_COLOR};
                    stroke-dasharray: none;
                }
            </style>

            <div class="linker-container" id="linker-main">
                <div class="header">
                    <span>Word: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <div class="instruction">Connect the letters in order by dragging a line from the green dot to the orange dot!</div>
                
                <svg id="svg-layer"></svg>

                <div class="word-area" id="word-area">
                    ${data.letters.map((char, idx) => `
                        <div class="letter-block" id="block-${idx}">
                            ${idx > 0 ? `<div class="node in" id="node-in-${idx}" data-idx="${idx}"></div>` : ''}
                            ${char}
                            ${idx < data.letters.length - 1 ? `<div class="node out" id="node-out-${idx}" data-idx="${idx}"></div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        setupDrawingLogic(stage);
    }

    function setupDrawingLogic(stage) {
        const svg = document.getElementById('svg-layer');
        const container = document.getElementById('linker-main');
        let isDrawing = false;
        let startNode = null;
        let activePath = null;

        // Helper to get relative coordinates
        function getRelativeCoords(el) {
            const rect = el.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            return {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2
            };
        }

        // Draw bezier curve
        function updatePath(path, x1, y1, x2, y2) {
            const cpX = (x1 + x2) / 2;
            path.setAttribute('d', `M ${x1} ${y1} C ${cpX} ${y1}, ${cpX} ${y2}, ${x2} ${y2}`);
        }

        const outNodes = document.querySelectorAll('.node.out');
        
        const startDrag = (e) => {
            if (e.target.classList.contains('connected')) return;
            e.preventDefault();
            isDrawing = true;
            startNode = e.target;
            
            const startCoords = getRelativeCoords(startNode);
            
            activePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            activePath.classList.add('wire');
            svg.appendChild(activePath);
            updatePath(activePath, startCoords.x, startCoords.y, startCoords.x, startCoords.y);
            
            if(window.GameHub) window.GameHub.playSound('click');
        };

        const moveDrag = (e) => {
            if (!isDrawing || !activePath) return;
            e.preventDefault();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            
            const containerRect = container.getBoundingClientRect();
            const currentX = clientX - containerRect.left;
            const currentY = clientY - containerRect.top;
            
            const startCoords = getRelativeCoords(startNode);
            updatePath(activePath, startCoords.x, startCoords.y, currentX, currentY);
        };

        const endDrag = (e) => {
            if (!isDrawing) return;
            isDrawing = false;
            
            const clientX = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.changedTouches[0].clientY : e.clientY;
            
            // Check if dropped on a valid IN node
            const elementsAtPoint = document.elementsFromPoint(clientX, clientY);
            const targetNode = elementsAtPoint.find(el => el.classList.contains('in'));

            let success = false;

            if (targetNode && !targetNode.classList.contains('connected')) {
                const startIdx = parseInt(startNode.dataset.idx);
                const targetIdx = parseInt(targetNode.dataset.idx);
                
                // Ensure correct sequential connection
                if (targetIdx === startIdx + 1) {
                    success = true;
                    const startCoords = getRelativeCoords(startNode);
                    const targetCoords = getRelativeCoords(targetNode);
                    
                    activePath.classList.add('active');
                    updatePath(activePath, startCoords.x, startCoords.y, targetCoords.x, targetCoords.y);
                    
                    startNode.classList.add('connected');
                    targetNode.classList.add('connected');
                    
                    score += 20;
                    connectionsMade++;
                    
                    if (window.GameHub) {
                        window.GameHub.playSound('correct');
                        window.GameHub.triggerVFX(clientX, clientY);
                    }
                    
                    checkCompletion();
                }
            }

            if (!success && activePath) {
                if (window.GameHub) window.GameHub.playSound('wrong');
                activePath.remove();
            }
            
            activePath = null;
            startNode = null;
        };

        outNodes.forEach(node => {
            node.addEventListener('mousedown', startDrag);
            node.addEventListener('touchstart', startDrag, {passive: false});
        });

        window.addEventListener('mousemove', moveDrag);
        window.addEventListener('touchmove', moveDrag, {passive: false});
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);

        // Cleanup event listeners on unload
        stage.addEventListener('DOMNodeRemoved', () => {
            window.removeEventListener('mousemove', moveDrag);
            window.removeEventListener('touchmove', moveDrag);
            window.removeEventListener('mouseup', endDrag);
            window.removeEventListener('touchend', endDrag);
        });
    }

    function checkCompletion() {
        if (connectionsMade === targetConnections) {
            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.getElementById('linker-main').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Link Master!", `You connected all the words! Final Score: ${score}`);
                    }
                }
            }, 1000);
        }
    }
})();