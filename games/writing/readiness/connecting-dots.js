/**
 * Game: Connect the Dots (Shape Tracer)
 * Filename: the_director.js
 * Logic: Trace dotted lines of a shape following directional arrows.
 * Dyslexia Focus: Building fine motor muscle memory for letter strokes.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let isDrawing = false;
    let ctx = null;
    let canvas = null;
    let pointsToTrace = [];
    let progress = 0;

    const gameData = [
        {
            shapeName: "Circle",
            description: "Trace the circle to see it glow!",
            points: (w, h) => {
                const pts = [];
                const cx = w / 2, cy = h / 2, r = 100;
                // Start at the top and go clockwise
                for (let i = -Math.PI / 2; i <= 1.5 * Math.PI; i += 0.2) {
                    pts.push({ x: cx + Math.cos(i) * r, y: cy + Math.sin(i) * r });
                }
                return pts;
            },
            explanation: "Perfect circles! This motion helps with letters like 'O', 'C', and 'G'."
        },
        {
            shapeName: "Square",
            description: "Follow the arrows to trace the square.",
            points: (w, h) => {
                const cx = w / 2 - 80, cy = h / 2 - 80, size = 160;
                const pts = [];
                // Top
                for (let x = 0; x <= size; x += 20) pts.push({ x: cx + x, y: cy });
                // Right
                for (let y = 0; y <= size; y += 20) pts.push({ x: cx + size, y: cy + y });
                // Bottom
                for (let x = size; x >= 0; x -= 20) pts.push({ x: cx + x, y: cy + size });
                // Left
                for (let y = size; y >= 0; y -= 20) pts.push({ x: cx, y: cy + y });
                return pts;
            },
            explanation: "Great corners! Sharp turns are important for letters like 'E', 'L', and 'H'."
        },
        {
            shapeName: "Triangle",
            description: "Trace the triangle from the top peak.",
            points: (w, h) => {
                const cx = w / 2, cy = h / 2 - 80, size = 180;
                const pts = [];
                // Down Right
                for (let i = 0; i <= 1; i += 0.1) pts.push({ x: cx + (size / 2) * i, y: cy + size * i });
                // Left
                for (let i = 0; i <= 1; i += 0.1) pts.push({ x: (cx + size / 2) - size * i, y: cy + size });
                // Up Right
                for (let i = 0; i <= 1; i += 0.1) pts.push({ x: (cx - size / 2) + (size / 2) * i, y: (cy + size) - size * i });
                return pts;
            },
            explanation: "Excellent diagonal strokes! These help with 'A', 'V', and 'W'."
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
        progress = 0;

        stage.innerHTML = `
            <style>
                .tracer-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    user-select: none;
                }
                .header-stats {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                .canvas-wrapper {
                    position: relative;
                    background: white;
                    border: 4px solid #CBD5E0;
                    border-radius: 20px;
                    cursor: crosshair;
                    touch-action: none;
                }
                #tracingCanvas {
                    border-radius: 16px;
                }
                .instruction-box {
                    text-align: center;
                    background: #EBF8FF;
                    padding: 10px 20px;
                    border-radius: 50px;
                    color: #2B6CB0;
                    font-weight: bold;
                    border: 2px solid #BEE3F8;
                }
                .feedback-tray {
                    min-height: 40px;
                    font-weight: 600;
                    text-align: center;
                }
                .btn-next {
                    padding: 10px 30px;
                    background: #48BB78;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                    display: none;
                }
            </style>

            <div class="tracer-container">
                <div class="header-stats">
                    <span>Shape: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>

                <div class="instruction-box">
                    ${data.shapeName}: ${data.description}
                </div>

                <div class="canvas-wrapper">
                    <canvas id="tracingCanvas" width="500" height="400"></canvas>
                </div>

                <div id="feedback" class="feedback-tray"></div>
                <button id="nextBtn" class="btn-next">Next Shape →</button>
            </div>
        `;

        canvas = document.getElementById('tracingCanvas');
        ctx = canvas.getContext('2d');
        pointsToTrace = data.points(canvas.width, canvas.height);

        drawStaticLevel();
        setupEventListeners();
    }

    function drawStaticLevel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw dotted guide
        ctx.beginPath();
        ctx.setLineDash([5, 10]);
        ctx.strokeStyle = "#E2E8F0";
        ctx.lineWidth = 20;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        
        ctx.moveTo(pointsToTrace[0].x, pointsToTrace[0].y);
        for (let i = 1; i < pointsToTrace.length; i++) {
            ctx.lineTo(pointsToTrace[i].x, pointsToTrace[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Start Arrow
        const start = pointsToTrace[0];
        const next = pointsToTrace[1];
        drawArrow(start.x, start.y, next.x, next.y, "#48BB78", "START");
    }

    function drawArrow(x, y, nx, ny, color, label) {
        const angle = Math.atan2(ny - y, nx - x);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Arrow head
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-15, -10);
        ctx.lineTo(-15, 10);
        ctx.fill();
        
        // Label
        ctx.rotate(-angle);
        ctx.font = "bold 14px Arial";
        ctx.fillText(label, 10, -10);
        ctx.restore();
    }

    function setupEventListeners() {
        const startDraw = (e) => {
            isDrawing = true;
            handleDrawing(e);
        };
        const endDraw = () => {
            isDrawing = false;
        };
        const moveDraw = (e) => {
            if (isDrawing) handleDrawing(e);
        };

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', moveDraw);
        window.addEventListener('mouseup', endDraw);
        
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e.touches[0]); });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); moveDraw(e.touches[0]); });
        canvas.addEventListener('touchend', endDraw);
    }

    function handleDrawing(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if user is near the next required point
        if (progress < pointsToTrace.length) {
            const target = pointsToTrace[progress];
            const dist = Math.sqrt((x - target.x)**2 + (y - target.y)**2);

            if (dist < 30) {
                // Draw progress
                ctx.beginPath();
                ctx.fillStyle = "#4299E1";
                ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
                ctx.fill();
                
                progress++;

                if (progress === pointsToTrace.length) {
                    completeLevel();
                }
            }
        }
    }

    function completeLevel() {
        score += 10;
        isDrawing = false;
        const feedback = document.getElementById('feedback');
        const nextBtn = document.getElementById('nextBtn');
        const data = gameData[currentLevel];

        feedback.style.color = "#2F855A";
        feedback.innerText = data.explanation;
        nextBtn.style.display = "block";

        if (window.GameHub) {
            window.GameHub.playSound('correct');
            const rect = canvas.getBoundingClientRect();
            window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

        nextBtn.onclick = () => {
            if (currentLevel < gameData.length - 1) {
                currentLevel++;
                loadLevel(document.querySelector('.tracer-container').parentElement);
            } else {
                if (window.GameHub?.showComplete) {
                    window.GameHub.showComplete("Shape Master!", `Final Score: ${score}. You traced every shape perfectly!`);
                }
            }
        };
    }
})();