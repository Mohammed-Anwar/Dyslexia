/**
 * Assets Mapper: Automatic Emoji to PNG Upgrader
 * 
 * Logic: Scans specific game elements for emojis. If an emoji is found in the 
 * dictionary, it replaces it with an <img> tag pointing to Static/Icons/[name].png.
 * Fallback: If the image fails to load (404), it instantly reverts to the original emoji.
 */

// =====================================================================
// 1. YOUR MASTER DICTIONARY
// Map every emoji used in your games to the exact filename (without .png)
// =====================================================================
window.EmojiToImageMap = {
  "1️⃣": "keycap_1",
  "2️⃣": "keycap_2",
  "5️⃣": "keycap_5",
  "6️⃣": "keycap_6",
  "8️⃣": "keycap_8",
  "⌚": "watch",
  "⏰": "alarm_clock",
  "⏳": "hourglass_not_done",
  "▶": "play_button",
  "☀️": "sun",
  "☁️": "cloud",
  "☂️": "umbrella",
  "☃️": "snowman",
  "☕": "hot_beverage",
  "♾️": "infinity",
  "⚡": "high_voltage",
  "⚪": "white_circle",
  "⚫": "black_circle",
  "⚽": "soccer_ball",
  "⚾": "baseball",
  "⛄": "snowman_without_snow",
  "⛰️": "mountain",
  "⛱️": "umbrella_on_ground",
  "⛵": "sailboat",
  "⛸️": "ice_skate",
  "⛽": "fuel_pump",
  "✅": "check_mark_button",
  "✈️": "airplane",
  "✉️": "envelope",
  "✋": "raised_hand",
  "✍️": "writing_hand",
  "✖": "multiply",
  "✨": "sparkles",
  "❄️": "snowflake",
  "❌": "cross_mark",
  "❓": "red_question_mark",
  "❤️": "red_heart",
  "➡️": "right_arrow",
  "⬅️": "left_arrow",
  "⬆️": "up_arrow",
  "⬇️": "down_arrow",
  "⬛": "black_large_square",
  "⭐": "star",
  "🌀": "cyclone",
  "🌅": "sunrise",
  "🌈": "rainbow",
  "🌊": "water_wave",
  "🌋": "volcano",
  "🌌": "milky_way",
  "🌍": "globe_showing_Europe-Africa",
  "🌙": "crescent_moon",
  "🌤️": "sun_behind_small_cloud",
  "🌧️": "cloud_with_rain",
  "🌬️": "wind_face",
  "🌱": "seedling",
  "🌲": "evergreen_tree",
  "🌳": "deciduous_tree",
  "🌵": "cactus",
  "🌸": "cherry_blossom",
  "🌹": "rose",
  "🌻": "sunflower",
  "🌽": "ear_of_corn",
  "🌾": "sheaf_of_rice",
  "🌿": "herb",
  "🍃": "leaf_fluttering_in_wind",
  "🍇": "grapes",
  "🍉": "watermelon",
  "🍊": "tangerine",
  "🍋": "lemon",
  "🍌": "banana",
  "🍍": "pineapple",
  "🍎": "red_apple",
  "🍏": "green_apple",
  "🍐": "pear",
  "🍓": "strawberry",
  "🍔": "hamburger",
  "🍕": "pizza",
  "🍗": "poultry_leg",
  "🍚": "cooked_rice",
  "🍞": "bread",
  "🍟": "french_fries",
  "🍡": "dango",
  "🍦": "soft_ice_cream",
  "🍪": "cookie",
  "🍫": "chocolate_bar",
  "🍬": "candy",
  "🍭": "lollipop",
  "🍯": "honey_pot",
  "🍰": "shortcake",
  "🍳": "cooking",
  "🍴": "fork_and_knife",
  "🍽️": "fork_and_knife_with_plate",
  "🎁": "wrapped_gift",
  "🎂": "birthday_cake",
  "🎇": "sparkler",
  "🎈": "balloon",
  "🎉": "party_popper",
  "🎋": "tanabata_tree",
  "🎒": "backpack",
  "🎣": "fishing_pole",
  "🎤": "microphone",
  "🎨": "artist_palette",
  "🎩": "top_hat",
  "🎪": "circus_tent",
  "🎫": "ticket",
  "🎬": "clapper_board",
  "🎮": "video_game",
  "🎯": "bullseye",
  "🎲": "game_die",
  "🎺": "trumpet",
  "🎾": "tennis",
  "🏀": "basketball",
  "🏃": "person_running",
  "🏆": "trophy",
  "🏊": "person_swimming",
  "🏊‍♀️": "woman_swimming",
  "🏎️": "racing_car",
  "🏖️": "beach_with_umbrella",
  "🏘️": "houses",
  "🏜️": "desert",
  "🏝️": "desert_island",
  "🏞️": "national_park",
  "🏟️": "stadium",
  "🏠": "house",
  "🏡": "house_with_garden",
  "🏢": "office_building",
  "🏥": "hospital",
  "🏫": "school",
  "🏮": "red_paper_lantern",
  "🏰": "castle",
  "🏷️": "label",
  "🏸": "badminton",
  "🐄": "cow",
  "🐇": "rabbit",
  "🐈": "cat",
  "🐉": "dragon",
  "🐋": "whale",
  "🐍": "snake",
  "🐎": "horse",
  "🐐": "goat",
  "🐑": "ewe",
  "🐒": "monkey",
  "🐔": "chicken",
  "🐕": "dog",
  "🐘": "elephant",
  "🐙": "octopus",
  "🐛": "bug",
  "🐜": "ant",
  "🐝": "honeybee",
  "🐞": "lady_beetle",
  "🐟": "fish",
  "🐠": "tropical_fish",
  "🐤": "baby_chick",
  "🐦": "bird",
  "🐧": "penguin",
  "🐪": "camel",
  "🐫": "two-hump_camel",
  "🐭": "mouse_face",
  "🐯": "tiger_face",
  "🐰": "rabbit_face",
  "🐱": "cat_face",
  "🐳": "spouting_whale",
  "🐴": "horse_face",
  "🐶": "dog_face",
  "🐷": "pig_face",
  "🐸": "frog",
  "🐹": "hamster",
  "🐺": "wolf",
  "🐻": "bear",
  "🐾": "paw_prints",
  "👁️": "eye",
  "👂": "ear",
  "👃": "nose",
  "👄": "mouth",
  "👆": "backhand_index_pointing_up",
  "👋": "waving_hand",
  "👍": "thumbs_up",
  "👒": "woman’s_hat",
  "👔": "necktie",
  "👕": "t-shirt",
  "👟": "running_shoe",
  "👤": "bust_in_silhouette",
  "👦": "boy",
  "👧": "girl",
  "👨": "man",
  "👨‍⚕️": "man_health_worker",
  "👨‍✈️": "man_pilot",
  "👨‍🌾": "man_farmer",
  "👨‍👧": "family_man_girl",
  "👩‍🍳": "woman_cook",
  "👩‍🏫": "woman_teacher",
  "👫": "woman_and_man_holding_hands",
  "💃": "woman_dancing",
  "💅": "nail_polish",
  "💇": "person_getting_haircut",
  "💊": "pill",
  "💍": "ring",
  "💎": "gem_stone",
  "💡": "light_bulb",
  "💥": "collision",
  "💧": "droplet",
  "💨": "dashing_away",
  "💪": "flexed_biceps",
  "💰": "money_bag",
  "💻": "laptop",
  "📅": "calendar",
  "📌": "pushpin",
  "📍": "round_pushpin",
  "📓": "notebook",
  "📖": "open_book",
  "📚": "books",
  "📝": "memo",
  "📞": "telephone_receiver",
  "📡": "satellite_antenna",
  "📦": "package",
  "📮": "postbox",
  "📱": "mobile_phone",
  "📷": "camera",
  "📺": "television",
  "🔊": "speaker_high_volume",
  "🔌": "electric_plug",
  "🔍": "magnifying_glass_tilted_left",
  "🔑": "key",
  "🔒": "locked",
  "🔙": "BACK_arrow",
  "🔤": "input_latin_letters",
  "🔥": "fire",
  "🔨": "hammer",
  "🔪": "kitchen_knife",
  "🔫": "water_pistol",
  "🔴": "red_circle",
  "🔵": "blue_circle",
  "🔺": "red_triangle_pointed_up",
  "🕒": "three_o’clock",
  "🕕": "six_o’clock",
  "🕖": "seven_o’clock",
  "🕯️": "candle",
  "🕶️": "sunglasses",
  "🕸️": "spider_web",
  "🖊️": "pen",
  "🖌": "paintbrush",
  "🖌️": "paintbrush",
  "🗄️": "file_cabinet",
  "🗑️": "wastebasket",
  "🗝️": "old_key",
  "🗣️": "speaking_head",
  "🗺️": "world_map",
  "😁": "beaming_face_with_smiling_eyes",
  "😄": "grinning_face_with_smiling_eyes",
  "😊": "smiling_face_with_smiling_eyes",
  "😋": "face_savoring_food",
  "😠": "angry_face",
  "😢": "crying_face",
  "😴": "sleeping_face",
  "🙋": "person_raising_hand",
  "🚀": "rocket",
  "🚁": "helicopter",
  "🚂": "locomotive",
  "🚌": "bus",
  "🚐": "minibus",
  "🚕": "taxi",
  "🚗": "automobile",
  "🚙": "sport_utility_vehicle",
  "🚢": "ship",
  "🚦": "vertical_traffic_light",
  "🚪": "door",
  "🚫": "prohibited",
  "🚰": "potable_water",
  "🚲": "bicycle",
  "🚶": "person_walking",
  "🚻": "restroom",
  "🚿": "shower",
  "🛁": "bathtub",
  "🛌": "person_in_bed",
  "🛏️": "bed",
  "🛑": "stop_sign",
  "🛒": "shopping_cart",
  "🛖": "hut",
  "🛠️": "hammer_and_wrench",
  "🛥️": "motor_boat",
  "🟡": "yellow_circle",
  "🟢": "green_circle",
  "🟤": "brown_circle",
  "🟦": "blue_square",
  "🟨": "yellow_square",
  "🟫": "brown_square",
  "🤏": "pinching_hand",
  "🤔": "thinking_face",
  "🤖": "robot",
  "🤝": "handshake",
  "🤧": "sneezing_face",
  "🤫": "shushing_face",
  "🤸": "person_cartwheeling",
  "🥁": "drum",
  "🥕": "carrot",
  "🥚": "egg",
  "🥛": "glass_of_milk",
  "🥜": "peanuts",
  "🥝": "kiwi_fruit",
  "🥣": "bowl_with_spoon",
  "🥤": "cup_with_straw",
  "🥦": "broccoli",
  "🥧": "pie",
  "🥨": "pretzel",
  "🥩": "cut_of_meat",
  "🥪": "sandwich",
  "🥭": "mango",
  "🥵": "hot_face",
  "🥽": "goggles",
  "🦁": "lion",
  "🦄": "unicorn",
  "🦅": "eagle",
  "🦆": "duck",
  "🦈": "shark",
  "🦊": "fox",
  "🦋": "butterfly",
  "🦌": "deer",
  "🦓": "zebra",
  "🦘": "kangaroo",
  "🦜": "parrot",
  "🦢": "swan",
  "🦯": "white_cane",
  "🦴": "bone",
  "🦵": "leg",
  "🦶": "foot",
  "🦷": "tooth",
  "🦸": "superhero",
  "🧀": "cheese_wedge",
  "🧃": "beverage_box",
  "🧊": "ice",
  "🧑‍🌾": "farmer",
  "🧞": "genie",
  "🧠": "brain",
  "🧡": "orange_heart",
  "🧢": "billed_cap",
  "🧣": "scarf",
  "🧥": "coat",
  "🧮": "abacus",
  "🧳": "luggage",
  "🧵": "thread",
  "🧸": "teddy_bear",
  "🧹": "broom",
  "🧺": "basket",
  "🧼": "soap",
  "🩷": "pink_heart",
  "🩸": "drop_of_blood",
  "🩺": "stethoscope",
  "🪀": "yo-yo",
  "🪁": "kite",
  "🪑": "chair",
  "🪙": "coin",
  "🪢": "knot",
  "🪥": "toothbrush",
  "🪨": "rock",
  "🪪": "identification_card",
  "🪱": "worm",
  "🪴": "potted_plant",
  "🪸": "coral",
  "🪽": "wing",
};


// =====================================================================
// 2. TARGET SELECTORS
// These are the specific CSS classes from your 50 game scripts 
// that we know contain standalone emojis.
// =====================================================================
const targetSelectors = [
    '.bucket-emoji', '.option-icon', '.clue-emoji', '.emoji-avatar', 
    '.panel-icon', '.box-icon', '.target-display', '.word-image', 
    '.mystery-icon', '.draggable-item', '.item-content', '.detail-item',
    '.bucket .bucket-emoji', '.option-card .option-icon', '.as-icon', '.dr-icon',
    '.bucket-icon', '.gemoji', '.emoji-icon', '.emoji-display', '.emoji-button',
    '.lens-icon', '.hint-icon', '.clue-icon', '.item-icon', '.trunk-icon',
    '.speak-btn', '.voice-btn',

    '#prompt-icon', '#play-sound-btn', '#target-icon'
];

// =====================================================================
// 3. THE MAGIC REPLACEMENT FUNCTION
// =====================================================================
function getOptimalImageSize(element) {
    // Check parent classes to determine appropriate size
    
    if (element.closest('.item-content')) {
        return '40px'; // Larger for drag items
    } else if (element.closest('.trunk-icon')) {
        return '64px'; // Larger for trunk icons
    } else if (element.closest('.option-icon, .bucket-emoji')) {
        return '1em'; // Keep original for other elements
    }
    return '1em';
}

// Then update the upgradeEmojisToImages function
function upgradeEmojisToImages() {
    // 1. Build a robust regex from the dictionary keys
    // We escape special characters and sort by length DESCENDING 
    // so complex emojis (like 👨‍⚕️) are matched before simple ones (like 👨)
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const emojiKeys = Object.keys(window.EmojiToImageMap)
        .map(escapeRegExp)
        .sort((a, b) => b.length - a.length);
    
    const emojiRegex = new RegExp(`(${emojiKeys.join('|')})`, 'g');

    targetSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            // Skip if this element already contains images (prevents infinite loops)
            if (el.querySelector('img')) return;

            // 2. Use a TreeWalker to ONLY look at actual text nodes (ignores HTML tags/attributes)
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
            const textNodesToReplace = [];
            
            while (walker.nextNode()) {
                if (emojiRegex.test(walker.currentNode.nodeValue)) {
                    textNodesToReplace.push(walker.currentNode);
                }
            }

            // 3. Safely replace emojis within those text nodes
            textNodesToReplace.forEach(textNode => {
                const span = document.createElement('span');
                
                span.innerHTML = textNode.nodeValue.replace(emojiRegex, (match) => {
                    const imageName = window.EmojiToImageMap[match];
                    if (imageName) {
                        const optimalSize = getOptimalImageSize(el);
                        return `<img src="Static/Icons/${imageName}.png" alt="${match}" data-emoji="${match}" style="width: ${optimalSize}; height: ${optimalSize}; object-fit: contain; display: inline-block; vertical-align: middle; margin: 0 2px;">`;
                    }
                    return match;
                });
                
                // Insert the new images/text back into the DOM and remove the old raw text node
                while (span.firstChild) {
                    textNode.parentNode.insertBefore(span.firstChild, textNode);
                }
                textNode.parentNode.removeChild(textNode);
            });
        });
    });
}

// =====================================================================
// 4. AUTOMATION: Watch the DOM for changes and auto-upgrade instantly
// This means you don't even have to call the function in your 50 scripts!
// =====================================================================
let upgradeTimeout;
const gameObserver = new MutationObserver(() => {
    // Debounce to prevent performance hits when many DOM nodes are added at once
    if (upgradeTimeout) clearTimeout(upgradeTimeout);
    upgradeTimeout = setTimeout(upgradeEmojisToImages, 50);
});

// Start watching the whole document body for new elements being added
gameObserver.observe(document.body, { childList: true, subtree: true });

// Run once on initial load just in case
document.addEventListener('DOMContentLoaded', upgradeEmojisToImages);