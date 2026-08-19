/**
 * Game: Tree & Branches (General Idea vs. Sub-details)
 * Filename: tree_branches.js
 * Logic: Drag specific details (leaves/cards) to the correct main idea (tree trunk).
 * Dyslexia Focus: Organizational processing, hierarchical classification, and reading comprehension.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let itemsPlaced = 0;

    const gameData = [
    // --- VISUAL LEVELS (1-2) ---
    {
        type: "visual",
        trunks: [
            { id: "ocean", label: "Ocean", icon: "🌊", color: "#BEE3F8" },
            { id: "desert", label: "Desert", icon: "🏜️", color: "#FEEBC8" }
        ],
        items: [
            { id: "l1", content: "🦈", belongsTo: "ocean" },
            { id: "l2", content: "🌵", belongsTo: "desert" },
            { id: "l3", content: "🐋", belongsTo: "ocean" },
            { id: "l4", content: "🐪", belongsTo: "desert" },
            { id: "l5", content: "🪸", belongsTo: "ocean" },
            { id: "l6", content: "⏳", belongsTo: "desert" }
        ],
        instruction: "Sort the pictures to the right environment."
    },
    {
        type: "visual",
        trunks: [
            { id: "sky", label: "Sky", icon: "☁️", color: "#E0F2FE" },
            { id: "garden", label: "Garden", icon: "🏡", color: "#DCFCE7" }
        ],
        items: [
            { id: "l1", content: "☁️", belongsTo: "sky" },
            { id: "l2", content: "🌻", belongsTo: "garden" },
            { id: "l3", content: "☀️", belongsTo: "sky" },
            { id: "l4", content: "🪴", belongsTo: "garden" },
            { id: "l5", content: "🐦", belongsTo: "sky" },
            { id: "l6", content: "🪱", belongsTo: "garden" }
        ],
        instruction: "Where do these things belong?"
    },

    // --- TEXT-BASED LEVELS (3-15) ---
    {
        type: "text",
        trunks: [
            { id: "bird", label: "A Bird", icon: "🐦", color: "#FEFCBF" },
            { id: "fish", label: "A Fish", icon: "🐟", color: "#BEE3F8" }
        ],
        items: [
            { id: "l1", content: "has wings", belongsTo: "bird" },
            { id: "l2", content: "swims in water", belongsTo: "fish" },
            { id: "l3", content: "flies in the sky", belongsTo: "bird" },
            { id: "l4", content: "has gills", belongsTo: "fish" }
        ],
        instruction: "Read the clues and sort them to the correct animal."
    },
    {
        type: "text",
        trunks: [
            { id: "dog", label: "A Dog", icon: "🐶", color: "#EDF2F7" },
            { id: "lion", label: "A Lion", icon: "🦁", color: "#FEEBC8" }
        ],
        items: [
            { id: "l1", content: "lives in a house", belongsTo: "dog" },
            { id: "l2", content: "lives in the jungle", belongsTo: "lion" },
            { id: "l3", content: "plays with kids", belongsTo: "dog" },
            { id: "l4", content: "hunts for meat", belongsTo: "lion" }
        ],
        instruction: "Pets vs. Wild: Where do these facts belong?"
    },
    {
        type: "text",
        trunks: [
            { id: "day", label: "Day time", icon: "☀️", color: "#FEFCBF" },
            { id: "night", label: "Night time", icon: "🌙", color: "#E9D8FD" }
        ],
        items: [
            { id: "l1", content: "see the sun", belongsTo: "day" },
            { id: "l2", content: "see the moon", belongsTo: "night" },
            { id: "l3", content: "go to school", belongsTo: "day" },
            { id: "l4", content: "go to sleep", belongsTo: "night" }
        ],
        instruction: "Day vs. Night: Sort the activities and sights."
    },
    {
        type: "text",
        trunks: [
            { id: "summer", label: "Summer", icon: "🏖️", color: "#C6F6D5" },
            { id: "winter", label: "Winter", icon: "⛄", color: "#E2E8F0" }
        ],
        items: [
            { id: "l1", content: "it is very hot", belongsTo: "summer" },
            { id: "l2", content: "it is very cold", belongsTo: "winter" },
            { id: "l3", content: "go to the beach", belongsTo: "summer" },
            { id: "l4", content: "wear a heavy coat", belongsTo: "winter" }
        ],
        instruction: "Summer vs. Winter: Sort the weather and activities."
    },
    {
        type: "text",
        trunks: [
            { id: "healthy", label: "Healthy Food", icon: "🍎", color: "#FC8181" },
            { id: "junk", label: "Junk Food", icon: "🍔", color: "#FBD38D" }
        ],
        items: [
            { id: "l1", content: "gives you good energy", belongsTo: "healthy" },
            { id: "l2", content: "has lots of vitamins", belongsTo: "healthy" },
            { id: "l3", content: "has too much sugar", belongsTo: "junk" },
            { id: "l4", content: "bad for your teeth", belongsTo: "junk" }
        ],
        instruction: "Sort the food facts."
    },
    {
        type: "text",
        trunks: [
            { id: "car", label: "A Car", icon: "🚗", color: "#FEB2B2" },
            { id: "plane", label: "A Plane", icon: "✈️", color: "#90CDF4" }
        ],
        items: [
            { id: "l1", content: "drives on roads", belongsTo: "car" },
            { id: "l2", content: "flies in the clouds", belongsTo: "plane" },
            { id: "l3", content: "has four tires", belongsTo: "car" },
            { id: "l4", content: "needs a pilot", belongsTo: "plane" }
        ],
        instruction: "Vehicles: How do they move?"
    },
    {
        type: "text",
        trunks: [
            { id: "teacher", label: "Teacher", icon: "👩‍🏫", color: "#FBB6CE" },
            { id: "doctor", label: "Doctor", icon: "👨‍⚕️", color: "#9AE6B4" }
        ],
        items: [
            { id: "l1", content: "works in a school", belongsTo: "teacher" },
            { id: "l2", content: "helps sick people", belongsTo: "doctor" },
            { id: "l3", content: "uses a whiteboard", belongsTo: "teacher" },
            { id: "l4", content: "gives medicine", belongsTo: "doctor" }
        ],
        instruction: "Jobs: Who does what?"
    },
    {
        type: "text",
        trunks: [
            { id: "kitchen", label: "Kitchen", icon: "🍳", color: "#FEEBC8" },
            { id: "bedroom", label: "Bedroom", icon: "🛏️", color: "#E9D8FD" }
        ],
        items: [
            { id: "l1", content: "cook food here", belongsTo: "kitchen" },
            { id: "l2", content: "sleep in a bed", belongsTo: "bedroom" },
            { id: "l3", content: "keep milk in the fridge", belongsTo: "kitchen" },
            { id: "l4", content: "put clothes in a closet", belongsTo: "bedroom" }
        ],
        instruction: "Rooms: What happens in each room?"
    },
    {
        type: "text",
        trunks: [
            { id: "head", label: "On your head", icon: "🧢", color: "#90CDF4" },
            { id: "feet", label: "On your feet", icon: "👟", color: "#EDF2F7" }
        ],
        items: [
            { id: "l1", content: "wear it in the sun", belongsTo: "head" },
            { id: "l2", content: "wear them with socks", belongsTo: "feet" },
            { id: "l3", content: "protects your hair", belongsTo: "head" },
            { id: "l4", content: "keeps your toes warm", belongsTo: "feet" }
        ],
        instruction: "Clothes: Where do you wear them?"
    },
    {
        type: "text",
        trunks: [
            { id: "phone", label: "Phone", icon: "📱", color: "#CBD5E0" },
            { id: "tv", label: "TV", icon: "📺", color: "#E2E8F0" }
        ],
        items: [
            { id: "l1", content: "fits in your pocket", belongsTo: "phone" },
            { id: "l2", content: "big screen on the wall", belongsTo: "tv" },
            { id: "l3", content: "used to make calls", belongsTo: "phone" },
            { id: "l4", content: "watch movies with family", belongsTo: "tv" }
        ],
        instruction: "Technology: TV or Phone?"
    },
    {
        type: "text",
        trunks: [
            { id: "living", label: "Living", icon: "🌳", color: "#C6F6D5" },
            { id: "nonliving", label: "Non-Living", icon: "🪨", color: "#A0AEC0" }
        ],
        items: [
            { id: "l1", content: "needs water to grow", belongsTo: "living" },
            { id: "l2", content: "stays the same size", belongsTo: "nonliving" },
            { id: "l3", content: "breathes air", belongsTo: "living" },
            { id: "l4", content: "does not eat", belongsTo: "nonliving" }
        ],
        instruction: "Science: Living vs. Non-Living things."
    },
    {
        type: "text",
        trunks: [
            { id: "farm", label: "Farm Animals", icon: "🐄", color: "#FEFCBF" },
            { id: "forest", label: "Forest Animals", icon: "🐻", color: "#C6F6D5" }
        ],
        items: [
            { id: "l1", content: "gives us milk", belongsTo: "farm" },
            { id: "l2", content: "sleeps in a cave", belongsTo: "forest" },
            { id: "l3", content: "lives in a barn", belongsTo: "farm" },
            { id: "l4", content: "eats wild berries", belongsTo: "forest" }
        ],
        instruction: "Habitats: Farm or Forest?"
    },
    {
        type: "text",
        trunks: [
            { id: "happy", label: "Happy", icon: "😄", color: "#FAF089" },
            { id: "sad", label: "Sad", icon: "😢", color: "#90CDF4" }
        ],
        items: [
            { id: "l1", content: "you smile and laugh", belongsTo: "happy" },
            { id: "l2", content: "you drop tears", belongsTo: "sad" },
            { id: "l3", content: "you feel very good", belongsTo: "happy" },
            { id: "l4", content: "you need a warm hug", belongsTo: "sad" }
        ],
        instruction: "Emotions: How do you feel?"
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
        itemsPlaced = 0;
        
        stage.innerHTML = `
            <style>
                .tree-game-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    user-select: none;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                    font-size: 1.1rem;
                }
                .instruction {
                    background: #EBF4FF;
                    padding: 15px 20px;
                    border-radius: 10px;
                    border-left: 5px solid #3182CE;
                    color: #2C5282;
                    font-size: 1.1rem;
                    text-align: center;
                    width: 100%;
                    max-width: 600px;
                }
                .trunks-area {
                    display: flex;
                    gap: 40px;
                    margin-top: 20px;
                    width: 100%;
                    justify-content: center;
                }
                .trunk {
                    width: 200px;
                    height: 220px;
                    border: 3px dashed #CBD5E0;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    transition: all 0.3s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .trunk-icon { font-size: 4rem; margin-bottom: 15px; }
                .trunk-label { font-weight: 800; font-size: 1.3rem; color: #2D3748; text-align: center; }
                
                .items-area {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                    padding: 25px;
                    background: #F7FAFC;
                    border: 2px solid #EDF2F7;
                    border-radius: 20px;
                    min-height: 120px;
                    width: 100%;
                    max-width: 700px;
                }

                /* Styles for visual level icons */
                .item-icon {
                    width: 80px;
                    height: 80px;
                    background: #F0FFF4;
                    border: 2px solid #C6F6D5;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: grab;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    touch-action: none;
                }
                .item-icon .item-content {
                    transform: rotate(45deg);
                    font-size: 2.5rem;
                }

                /* Styles for text level cards */
                .item-text {
                    padding: 15px 25px;
                    background: white;
                    border: 2px solid #E2E8F0;
                    border-radius: 20px 20px 20px 5px; /* Subtle leaf-like shape */
                    font-size: 1.1rem;
                    font-weight: bold;
                    color: #2D3748;
                    cursor: grab;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    touch-action: none;
                    text-align: center;
                }

                .draggable-item:active { cursor: grabbing; }
            </style>

            <div class="tree-game-container">
                <div class="header">
                    <span>Round: ${currentLevel + 1} / ${gameData.length}</span>
                    <span>Score: ${score}</span>
                </div>
                <div class="instruction">${data.instruction}</div>
                
                <div class="trunks-area" id="trunks-area">
                    ${data.trunks.map(t => `
                        <div class="trunk" id="trunk-${t.id}" data-id="${t.id}" style="background-color: ${t.color}">
                            <div class="trunk-icon">${t.icon}</div>
                            <div class="trunk-label">${t.label}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="items-area" id="items-area">
                    <!-- Items will be added here -->
                </div>
            </div>
        `;

        const itemsArea = document.getElementById('items-area');
        const shuffledItems = [...data.items].sort(() => Math.random() - 0.5);

        shuffledItems.forEach(itemData => {
            const itemEl = document.createElement('div');
            // Determine class based on level type (Visual vs Text)
            itemEl.className = `draggable-item ${data.type === 'visual' ? 'item-icon' : 'item-text'}`;
            itemEl.id = itemData.id;
            
            if (data.type === 'visual') {
                itemEl.innerHTML = `<div class="item-content">${itemData.content}</div>`;
            } else {
                itemEl.innerText = itemData.content;
            }
            
            itemsArea.appendChild(itemEl);

            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(itemEl, (x, y, el) => {
                    let dropped = false;
                    data.trunks.forEach(t => {
                        const trunkEl = document.getElementById(`trunk-${t.id}`);
                        const rect = trunkEl.getBoundingClientRect();
                        
                        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                            if (itemData.belongsTo === t.id) {
                                handleMatch(el, trunkEl, x, y);
                                dropped = true;
                            } else {
                                handleMismatch(el, data.type);
                                dropped = true;
                            }
                        }
                    });
                    if (!dropped && el.resetPosition) el.resetPosition();
                });
            }
        });
    }

    function handleMatch(itemEl, trunkEl, x, y) {
        itemEl.style.display = 'none';
        score += 10;
        itemsPlaced++;
        
        if (window.GameHub) {
            window.GameHub.playSound('correct');
            window.GameHub.triggerVFX(x, y);
        }

        // Visual feedback on trunk
        trunkEl.style.transform = "scale(1.05)";
        setTimeout(() => trunkEl.style.transform = "scale(1)", 200);

        // Check if level complete
        if (itemsPlaced === gameData[currentLevel].items.length) {
            setTimeout(() => {
                if (currentLevel < gameData.length - 1) {
                    currentLevel++;
                    loadLevel(document.querySelector('.tree-game-container').parentElement);
                } else {
                    if (window.GameHub?.showComplete) {
                        window.GameHub.showComplete("Master Organizer!", `You've correctly categorized all details. Final Score: ${score}`);
                    }
                }
            }, 1000);
        }
    }

    function handleMismatch(itemEl, type) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        
        // Temporarily change style for error feedback
        itemEl.style.borderColor = "#F56565";
        itemEl.style.background = "#FFF5F5";
        
        setTimeout(() => {
            if (itemEl.resetPosition) itemEl.resetPosition();
            // Revert styles based on type
            if (type === 'visual') {
                itemEl.style.borderColor = "#C6F6D5";
                itemEl.style.background = "#F0FFF4";
            } else {
                itemEl.style.borderColor = "#E2E8F0";
                itemEl.style.background = "white";
            }
        }, 500);
    }
})();