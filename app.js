/**
 * Kızma Birader - Premium Digital Edition
 * Game Engine & Controller
 */

// Sound Engine using Web Audio API
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playRoll() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    }

    playMove() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    playCapture() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.4);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
    }

    playHome() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.08, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
        });
    }

    playWin() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const fanfare = [
            { freq: 261.63, time: 0 },
            { freq: 329.63, time: 0.15 },
            { freq: 392.00, time: 0.3 },
            { freq: 523.25, time: 0.45 },
            { freq: 659.25, time: 0.6 },
            { freq: 783.99, time: 0.75 },
            { freq: 1046.50, time: 0.9 }
        ];
        fanfare.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = note.freq;
            gain.gain.setValueAtTime(0.12, now + note.time);
            gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + note.time);
            osc.stop(now + note.time + 0.4);
        });
    }
}

const sounds = new SoundEngine();

// Coordinates mapping for 15x15 board cells
// Clockwise common perimeter track path
const TRACK_COORDS = [
    { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 }, // Red area track exit
    { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 },
    { r: 0, c: 7 },
    { r: 0, c: 8 }, { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 }, // Green area track exit
    { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 }, { r: 6, c: 14 },
    { r: 7, c: 14 },
    { r: 8, c: 14 }, { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 }, // Blue area track exit
    { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 },
    { r: 14, c: 7 },
    { r: 14, c: 6 }, { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 }, // Yellow area track exit
    { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 }, { r: 8, c: 0 },
    { r: 7, c: 0 },
    { r: 6, c: 0 }
];

// Safe zones indices
const SAFE_INDICES = [0, 8, 13, 22, 26, 34, 39, 48];

// Color definitions
const COLORS = ['red', 'blue', 'green', 'yellow'];
const COLOR_NAMES = {
    red: 'Kırmızı',
    blue: 'Mavi',
    green: 'Yeşil',
    yellow: 'Sarı'
};

const COLOR_CONFIGS = {
    red: {
        startIndex: 0,
        endIndex: 51,
        homePath: [{ r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }],
        basePockets: [{ r: 2, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 3 }]
    },
    blue: {
        startIndex: 13,
        endIndex: 12,
        homePath: [{ r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }],
        basePockets: [{ r: 2, c: 11 }, { r: 2, c: 12 }, { r: 3, c: 11 }, { r: 3, c: 12 }]
    },
    green: {
        startIndex: 26,
        endIndex: 25,
        homePath: [{ r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }],
        basePockets: [{ r: 11, c: 11 }, { r: 11, c: 12 }, { r: 12, c: 11 }, { r: 12, c: 12 }]
    },
    yellow: {
        startIndex: 39,
        endIndex: 38,
        homePath: [{ r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }],
        basePockets: [{ r: 11, c: 2 }, { r: 11, c: 3 }, { r: 12, c: 2 }, { r: 12, c: 3 }]
    }
};

// Game State
let gameState = {
    players: {}, // color -> { type: 'human'|'ai'|'none', finished: 0 }
    activePlayers: [], // array of colors in order
    currentTurnIndex: 0,
    diceVal: null,
    hasRolled: false,
    extraTurn: false,
    tokens: {}, // color -> array of 4 tokens: { id: 0..3, posType: 'base'|'track'|'homePath'|'finished', posIndex: 0.. }
    history: []
};

// DOM References
const hubPanel = document.getElementById('hub-panel');
const setupPanel = document.getElementById('setup-panel');
const gamePanel = document.getElementById('game-panel');
const ludoBoard = document.getElementById('ludo-board');
const currentPlayerDisplay = document.getElementById('current-player-display');
const rollDiceBtn = document.getElementById('roll-dice-btn');
const rollResultBadge = document.getElementById('roll-result-badge');
const dice3D = document.getElementById('dice-3d');
const gameLog = document.getElementById('game-log');
const rulesBtn = document.getElementById('rules-btn');
const soundBtn = document.getElementById('sound-btn');
const themeBtn = document.getElementById('theme-btn');
const rulesModal = document.getElementById('rules-modal');
const closeRulesBtn = document.getElementById('close-rules-btn');
const winnerModal = document.getElementById('winner-modal');
const winnerTitle = document.getElementById('winner-title');
const winnerText = document.getElementById('winnerText'); // wait, let's look at index.html, it's winner-text. Let's use document.getElementById('winner-text')
const winnerTextEl = document.getElementById('winner-text');
const newGameBtn = document.getElementById('new-game-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const endGameBtn = document.getElementById('end-game-btn');

// SOS DOM References
const sosSetupPanel = document.getElementById('sos-setup-panel');
const sosGamePanel = document.getElementById('sos-game-panel');
const sosGridContainer = document.getElementById('sos-grid-container');
const sosStatusP1 = document.getElementById('sos-status-p1');
const sosStatusP2 = document.getElementById('sos-status-p2');
const sosTurnBadge = document.getElementById('sos-turn-badge');
const sosBtnS = document.getElementById('sos-btn-s');
const sosBtnO = document.getElementById('sos-btn-o');
const sosResetBtn = document.getElementById('sos-reset-btn');
const sosEndBtn = document.getElementById('sos-end-btn');
const sosStartBtn = document.getElementById('sos-start-btn');
const logoBackToHub = document.getElementById('logo-back-to-hub');
const ludoSetupBackBtn = document.getElementById('ludo-setup-back-btn');
const sosSetupBackBtn = document.getElementById('sos-setup-back-btn');

// Profile & Navigation State
let accounts = [];
let activeUsername = "";

function loadProfileStats() {
    const savedAccounts = localStorage.getItem('boardgame_hub_accounts');
    const savedActive = localStorage.getItem('boardgame_hub_active_user');
    
    if (savedAccounts) {
        try {
            accounts = JSON.parse(savedAccounts);
        } catch(e) {
            accounts = [];
        }
    }
    
    if (savedActive) {
        activeUsername = savedActive;
    }
    
    if (accounts.length === 0) {
        // Force account creation on startup if none exists
        showPanel('profile-setup-panel');
        regCancelBtn.classList.add('hidden');
    } else {
        // Fallback active user if active user is missing or invalid
        if (!activeUsername || !accounts.find(a => a.username === activeUsername)) {
            activeUsername = accounts[0].username;
        }
        showPanel('hub-panel');
        updateProfileUI();
    }
}

function saveProfileStats() {
    localStorage.setItem('boardgame_hub_accounts', JSON.stringify(accounts));
    localStorage.setItem('boardgame_hub_active_user', activeUsername);
    updateProfileUI();
}

function updateProfileUI() {
    const currentAccount = accounts.find(a => a.username === activeUsername);
    if (!currentAccount) return;
    
    // Update name
    profileName.innerText = currentAccount.username;
    
    // Update avatar and color
    profileAvatarDisplay.className = `profile-avatar theme-${currentAccount.color}`;
    profileAvatarDisplay.innerHTML = `<i class="fa-solid ${currentAccount.avatar}"></i>`;
    
    // Update stats
    document.getElementById('stats-played').innerText = currentAccount.played;
    document.getElementById('stats-wins').innerText = currentAccount.wins;
    const ratio = currentAccount.played > 0 ? Math.round((currentAccount.wins / currentAccount.played) * 100) : 0;
    document.getElementById('stats-ratio').innerText = ratio + '%';
}

function showPanel(panelId) {
    const panels = ['hub-panel', 'setup-panel', 'sos-setup-panel', 'game-panel', 'sos-game-panel', 'profile-setup-panel', 'multiplayer-lobby-panel'];
    panels.forEach(p => {
        const el = document.getElementById(p);
        if (el) {
            if (p === panelId) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    });
}

// Logo Click -> Go back to Lobby
logoBackToHub.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
    disconnectFromRoom();
    showPanel('hub-panel');
});

// Setup back buttons
ludoSetupBackBtn.addEventListener('click', () => {
    showPanel('hub-panel');
});

sosSetupBackBtn.addEventListener('click', () => {
    showPanel('hub-panel');
});

// Start Ludo Game Handler
document.getElementById('start-game-btn').addEventListener('click', () => {
    let activeColors = [];
    COLORS.forEach(color => {
        const type = document.querySelector(`input[name="player-${color}"]:checked`).value;
        gameState.players[color] = { type: type, finished: 0 };
        if (type !== 'none') {
            activeColors.push(color);
        }
    });

    if (activeColors.length < 2) {
        alert("En az 2 aktif oyuncu seçmelisiniz!");
        return;
    }

    gameState.activePlayers = activeColors;
    gameState.currentTurnIndex = 0;
    
    COLORS.forEach(color => {
        gameState.tokens[color] = Array.from({ length: 4 }, (_, i) => ({
            id: i,
            posType: 'base',
            posIndex: i
        }));
    });

    saveGameState();
    showPanel('game-panel');

    buildBoardUI();
    updateUI();
    logMessage("Oyun başladı! Sıra " + COLOR_NAMES[getCurrentPlayerColor()] + " oyuncusunda.", getCurrentPlayerColor());
    checkAndTriggerAI();
});

// Restart / End Ludo Game Handlers
resetGameBtn.addEventListener('click', resetCurrentGame);
endGameBtn.addEventListener('click', endGame);
newGameBtn.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
    showPanel('hub-panel');
});

function endGame() {
    winnerModal.classList.add('hidden');
    showPanel('hub-panel');
    sessionStorage.removeItem('kizmabirader_state');
}

function resetCurrentGame() {
    if (!confirm("Oyunu mevcut oyuncularla yeniden başlatmak istediğinize emin misiniz?")) return;
    
    COLORS.forEach(color => {
        gameState.tokens[color] = Array.from({ length: 4 }, (_, i) => ({
            id: i,
            posType: 'base',
            posIndex: i
        }));
    });

    gameState.currentTurnIndex = 0;
    gameState.diceVal = null;
    gameState.hasRolled = false;
    gameState.extraTurn = false;
    
    gameLog.innerHTML = '<div class="log-entry system"><i class="fa-solid fa-circle-info"></i> Oyun yeniden başlatıldı.</div>';
    
    saveGameState();
    updateUI();
    checkAndTriggerAI();
}

// Build Board layout cells
function buildBoardUI() {
    ludoBoard.innerHTML = '';
    
    // Generate 15x15 grid structures
    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            // Check if cell matches bases
            if (r < 6 && c < 6) continue; // Skip to place large base element
            if (r < 6 && c >= 9) continue;
            if (r >= 9 && c < 6) continue;
            if (r >= 9 && c >= 9) continue;
            if (r >= 6 && r <= 8 && c >= 6 && c <= 8) continue; // Center zone skip
            
            // Regular cells
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            // Check safe zones
            const trackIdx = TRACK_COORDS.findIndex(coord => coord.r === r && coord.c === c);
            if (trackIdx !== -1) {
                if (SAFE_INDICES.includes(trackIdx)) {
                    cell.classList.add('safe-zone');
                }
                
                // Color start cells
                if (r === 6 && c === 1) cell.classList.add('red-start');
                else if (r === 1 && c === 8) cell.classList.add('blue-start');
                else if (r === 8 && c === 13) cell.classList.add('green-start');
                else if (r === 13 && c === 6) cell.classList.add('yellow-start');
            }
            
            // Color home path cells (4 solid colored slots, 5th next to center is white)
            COLORS.forEach(color => {
                const homeIdx = COLOR_CONFIGS[color].homePath.findIndex(coord => coord.r === r && coord.c === c);
                if (homeIdx !== -1) {
                    if (homeIdx < 4) {
                        cell.classList.add(`${color}-home`);
                    }
                }
            });
            
            ludoBoard.appendChild(cell);
        }
    }

    // Append 4 Base Zones
    appendBaseZone('red', 1, 1);
    appendBaseZone('blue', 1, 10);
    appendBaseZone('yellow', 10, 1);
    appendBaseZone('green', 10, 10);

    // Append Center Zone
    const center = document.createElement('div');
    center.className = 'center-zone';
    center.style.gridColumn = '7 / span 3';
    center.style.gridRow = '7 / span 3';
    
    // Create responsive SVG for center triangles meeting perfectly at the center point
    center.innerHTML = `
        <svg viewBox="0 0 120 120" style="width: 100%; height: 100%; display: block;">
            <!-- Top Triangle (Blue) -->
            <polygon points="0,0 120,0 60,60" fill="var(--color-blue)" />
            <!-- Right Triangle (Green) -->
            <polygon points="120,0 120,120 60,60" fill="var(--color-green)" />
            <!-- Bottom Triangle (Yellow) -->
            <polygon points="0,120 120,120 60,60" fill="var(--color-yellow)" />
            <!-- Left Triangle (Red) -->
            <polygon points="0,0 0,120 60,60" fill="var(--color-red)" />
            
            <!-- Diagonal Dividers -->
            <line x1="0" y1="0" x2="120" y2="120" stroke="#1a1a1a" stroke-width="2.5" />
            <line x1="120" y1="0" x2="0" y2="120" stroke="#1a1a1a" stroke-width="2.5" />
            <!-- Outer Border -->
            <rect x="0" y="0" width="120" height="120" fill="none" stroke="#1a1a1a" stroke-width="3" />
        </svg>
    `;
    
    ludoBoard.appendChild(center);
}

function appendBaseZone(color, startRow, startCol) {
    const base = document.createElement('div');
    base.className = `base-zone base-${color}`;
    base.style.gridColumn = `${startCol} / span 6`;
    base.style.gridRow = `${startRow} / span 6`;
    
    // 4 pockets inside base
    for (let i = 0; i < 4; i++) {
        const pocket = document.createElement('div');
        pocket.className = 'pocket';
        pocket.dataset.pocketColor = color;
        pocket.dataset.pocketIndex = i;
        base.appendChild(pocket);
    }
    ludoBoard.appendChild(base);
}

// Render Tokens on the Board
function renderTokens() {
    // Clear all token containers/tokens first
    document.querySelectorAll('.token-container').forEach(el => el.remove());
    document.querySelectorAll('.token').forEach(el => el.remove());

    // Map of coordinate key "r,c" -> list of tokens
    const placementMap = {};

    COLORS.forEach(color => {
        if (gameState.players[color].type === 'none') return;

        gameState.tokens[color].forEach(token => {
            let coords = null;
            if (token.posType === 'base') {
                coords = COLOR_CONFIGS[color].basePockets[token.posIndex];
            } else if (token.posType === 'track') {
                coords = TRACK_COORDS[token.posIndex];
            } else if (token.posType === 'homePath') {
                coords = COLOR_CONFIGS[color].homePath[token.posIndex];
            }
            
            if (coords) {
                const key = `${coords.r},${coords.c}`;
                if (!placementMap[key]) {
                    placementMap[key] = [];
                }
                placementMap[key].push({ color, token });
            }
        });
    });

    // Render tokens onto cells
    Object.keys(placementMap).forEach(key => {
        const [r, c] = key.split(',').map(Number);
        const tokensInCell = placementMap[key];
        
        let container = null;
        if (tokensInCell.length > 1) {
            container = document.createElement('div');
            container.className = 'token-container multiple';
        }

        tokensInCell.forEach(({ color, token }) => {
            const tokenEl = document.createElement('div');
            tokenEl.className = `token token-${color}`;
            tokenEl.dataset.color = color;
            tokenEl.dataset.tokenId = token.id;
            tokenEl.innerText = token.id + 1;

            // Make playable highlight if turn fits
            if (isPlayableToken(color, token)) {
                tokenEl.classList.add('playable');
                tokenEl.addEventListener('click', () => handleTokenMove(color, token.id));
            }

            if (container) {
                container.appendChild(tokenEl);
            } else {
                // Find single cell
                const cell = findCell(r, c);
                if (cell) {
                    cell.appendChild(tokenEl);
                }
            }
        });

        if (container) {
            const cell = findCell(r, c);
            if (cell) {
                cell.appendChild(container);
            }
        }
    });
}

function findCell(r, c) {
    // Check inside pocket bases first
    const pockets = document.querySelectorAll('.pocket');
    for (let pocket of pockets) {
        const color = pocket.dataset.pocketColor;
        const idx = Number(pocket.dataset.pocketIndex);
        const configCoords = COLOR_CONFIGS[color].basePockets[idx];
        if (configCoords.r === r && configCoords.c === c) {
            return pocket;
        }
    }

    // Grid cells
    return document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
}

// Rules engine: can token move?
function isPlayableToken(color, token) {
    if (color !== getCurrentPlayerColor()) return false;
    if (!gameState.hasRolled) return false;
    if (gameState.diceVal === null) return false;
    
    // AI has its own decision path, but visually mark AI moves if debug
    const playerType = gameState.players[color] ? gameState.players[color].type : 'none';
    
    const val = gameState.diceVal;

    if (token.posType === 'base') {
        return val === 6; // Must roll 6 to exit base
    }

    if (token.posType === 'track') {
        return true; // Can always move along path
    }

    if (token.posType === 'homePath') {
        // Must roll exact value to land in home
        return token.posIndex + val <= 4;
    }

    return false; // Finished tokens cannot move
}

function getCurrentPlayerColor() {
    if (!gameState || !gameState.activePlayers || gameState.activePlayers.length === 0) return null;
    return gameState.activePlayers[gameState.currentTurnIndex] || null;
}

function isMyTurn() {
    if (!isMultiplayerActive) return true;
    const activeColor = getCurrentPlayerColor();
    if (!activeColor) return false;
    const activePlayerObj = gameState.players[activeColor];
    return activePlayerObj && activePlayerObj.playerKey === myPlayerKey;
}

// Dice Roll logic
rollDiceBtn.addEventListener('click', rollDice);
dice3D.addEventListener('click', () => {
    const activeColor = getCurrentPlayerColor();
    if (gameState.players[activeColor].type !== 'ai') {
        rollDice();
    }
});

function rollDice() {
    if (isMultiplayerActive && !isMyTurn()) {
        alert("Sıra sizde değil!");
        return;
    }
    if (gameState.hasRolled) return;
    
    sounds.playRoll();
    rollDiceBtn.disabled = true;
    dice3D.className = 'dice rolling';

    setTimeout(() => {
        dice3D.classList.remove('rolling');
        const roll = Math.floor(Math.random() * 6) + 1;
        gameState.diceVal = roll;
        gameState.hasRolled = true;
        
        // Show static face representation in 3D
        setDiceFace(roll);
        
        rollResultBadge.innerText = roll;
        rollResultBadge.classList.remove('hidden');

        const activeColor = getCurrentPlayerColor();
        if (!activeColor) return;

        logMessage(`${COLOR_NAMES[activeColor] || activeColor} ${roll} attı!`, activeColor);

        // Process options
        const tokensForColor = gameState.tokens[activeColor] || [];
        const playableTokens = tokensForColor.filter(t => isPlayableToken(activeColor, t));
        
        if (roll === 6) {
            gameState.extraTurn = true;
        } else {
            gameState.extraTurn = false;
        }

        if (playableTokens.length === 0) {
            // No moves possible
            logMessage("Yapılabilecek hamle yok.", activeColor);
            setTimeout(nextTurn, 1000);
        } else {
            renderTokens();
            // If AI, make decision automatically
            const playerConfig = gameState.players[activeColor];
            if (playerConfig && playerConfig.type === 'ai') {
                setTimeout(() => makeAIMove(playableTokens), 1000);
            }
        }
        
        saveGameState();
        if (isMultiplayerActive) {
            currentRoomRef.child('state').set(gameState);
        }
    }, 600);
}

function setDiceFace(val) {
    let x = 0, y = 0;
    switch(val) {
        case 1: x = 0; y = 0; break;
        case 6: x = 0; y = 180; break;
        case 3: x = 0; y = -90; break;
        case 4: x = 0; y = 90; break;
        case 2: x = -90; y = 0; break;
        case 5: x = 90; y = 0; break;
    }
    dice3D.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
}

// Token movement handling
function handleTokenMove(color, tokenId) {
    if (isMultiplayerActive && !isMyTurn()) {
        alert("Sıra sizde değil!");
        return;
    }
    const token = gameState.tokens[color].find(t => t.id === tokenId);
    if (!token || !isPlayableToken(color, token)) return;

    sounds.playMove();

    const val = gameState.diceVal;
    
    if (token.posType === 'base') {
        // Exit base
        token.posType = 'track';
        token.posIndex = COLOR_CONFIGS[color].startIndex;
        logMessage(`${COLOR_NAMES[color]} kaleden çıktı!`, color);
    } else if (token.posType === 'track') {
        const nextPos = getNextTrackPosition(color, token.posIndex, val);
        if (nextPos.type === 'track') {
            token.posIndex = nextPos.index;
            // Check capture
            checkCaptures(color, token.posIndex);
        } else if (nextPos.type === 'homePath') {
            token.posType = 'homePath';
            token.posIndex = nextPos.index;
        } else if (nextPos.type === 'finished') {
            token.posType = 'finished';
            sounds.playHome();
            logMessage(`${COLOR_NAMES[color]} piyonu hedefe ulaştırdı! 🎉`, color);
        }
    } else if (token.posType === 'homePath') {
        if (token.posIndex + val === 4) {
            token.posType = 'finished';
            sounds.playHome();
            logMessage(`${COLOR_NAMES[color]} piyonu hedefe ulaştırdı! 🎉`, color);
        } else {
            token.posIndex += val;
        }
    }

    gameState.hasRolled = false;
    gameState.diceVal = null;
    rollResultBadge.classList.add('hidden');

    // Check Win
    if (checkWinCondition(color)) {
        handleWin(color);
        return;
    }

    renderTokens();
    updateUI();

    if (gameState.extraTurn) {
        logMessage(`${COLOR_NAMES[color]} 6 attığı için tekrar oynuyor!`, color);
        gameState.extraTurn = false; // reset flag
        saveGameState();
        checkAndTriggerAI();
    } else {
        nextTurn();
    }
}

// Compute next steps clockwise
function getNextTrackPosition(color, currentIndex, steps) {
    const config = COLOR_CONFIGS[color];
    let remaining = steps;
    let curr = currentIndex;

    while (remaining > 0) {
        if (curr === config.endIndex) {
            // Enter home stretch
            remaining--;
            if (remaining === 4) {
                return { type: 'finished' };
            } else if (remaining < 4) {
                return { type: 'homePath', index: remaining };
            } else {
                // Cant enter home if overshoot (some variants allow bounce, but wait-until-exact is standard)
                return { type: 'track', index: currentIndex }; // overshoot wait
            }
        }
        
        curr = (curr + 1) % 52;
        remaining--;
    }

    return { type: 'track', index: curr };
}

// Capture opponent tokens
function checkCaptures(myColor, trackIndex) {
    // If safe zone, no capture
    if (SAFE_INDICES.includes(trackIndex)) return;

    COLORS.forEach(oppColor => {
        if (oppColor === myColor) return;
        
        gameState.tokens[oppColor].forEach(oppToken => {
            if (oppToken.posType === 'track' && oppToken.posIndex === trackIndex) {
                // Send back to base!
                oppToken.posType = 'base';
                oppToken.posIndex = oppToken.id; // pocket index
                sounds.playCapture();
                logMessage(`${COLOR_NAMES[myColor]} oyuncusu, ${COLOR_NAMES[oppColor]} piyonunu kırdı! 💥`, myColor);
            }
        });
    });
}

// Turn progression
function nextTurn() {
    gameState.hasRolled = false;
    gameState.diceVal = null;
    gameState.currentTurnIndex = (gameState.currentTurnIndex + 1) % gameState.activePlayers.length;
    
    rollResultBadge.classList.add('hidden');
    saveGameState();
    updateUI();
    if (isMultiplayerActive) {
        currentRoomRef.child('state').set(gameState);
    }
    
    checkAndTriggerAI();
}

function checkAndTriggerAI() {
    const activeColor = getCurrentPlayerColor();
    if (!activeColor || !gameState.players[activeColor]) return;
    if (gameState.players[activeColor].type === 'ai') {
        rollDiceBtn.disabled = true;
        // Delay AI roll to look natural
        setTimeout(rollDice, 1200);
    } else {
        rollDiceBtn.disabled = false;
    }
}

// Simple AI logic
function makeAIMove(playableTokens) {
    // AI priorities:
    // 1. Capture opponents!
    // 2. Safely enter home path or finish
    // 3. Move token closest to home stretch
    // 4. Release token from base if 6
    
    let bestToken = playableTokens[0];
    let maxScore = -1;

    playableTokens.forEach(t => {
        let score = 0;
        const val = gameState.diceVal;

        if (t.posType === 'base' && val === 6) {
            score = 50; // High priority to release base
        } else if (t.posType === 'track') {
            const nextPos = getNextTrackPosition(getCurrentPlayerColor(), t.posIndex, val);
            
            if (nextPos.type === 'track') {
                // Will this capture someone?
                if (!SAFE_INDICES.includes(nextPos.index)) {
                    COLORS.forEach(oppColor => {
                        if (oppColor === getCurrentPlayerColor()) return;
                        gameState.tokens[oppColor].forEach(oppToken => {
                            if (oppToken.posType === 'track' && oppToken.posIndex === nextPos.index) {
                                score = 100; // Capturing is top priority!
                            }
                        });
                    });
                }
                
                // Keep moving along track - favor tokens closer to end
                if (score < 100) {
                    const distToEnd = (COLOR_CONFIGS[getCurrentPlayerColor()].endIndex - nextPos.index + 52) % 52;
                    score = 40 - Math.floor(distToEnd / 2);
                }
            } else if (nextPos.type === 'homePath' || nextPos.type === 'finished') {
                score = 80; // Highly favor getting closer to or reaching home
            }
        } else if (t.posType === 'homePath') {
            if (t.posIndex + val === 4) {
                score = 90; // Finish!
            } else {
                score = 70; // Keep moving in home path
            }
        }

        if (score > maxScore) {
            maxScore = score;
            bestToken = t;
        }
    });

    handleTokenMove(getCurrentPlayerColor(), bestToken.id);
}

// Victory Checks
function checkWinCondition(color) {
    return gameState.tokens[color].every(t => t.posType === 'finished');
}

function handleWin(color) {
    sounds.playWin();
    
    const currentAccount = accounts.find(a => a.username === activeUsername);
    if (currentAccount) {
        currentAccount.played += 1;
        if (gameState.players[color] && gameState.players[color].type === 'human') {
            currentAccount.wins += 1;
        }
        saveProfileStats();
    }
    
    winnerTitle.innerText = "Tebrikler!";
    winnerTextEl.innerText = `Oyunu ${COLOR_NAMES[color]} kazandı!`;
    winnerModal.classList.remove('hidden');
    sessionStorage.removeItem('kizmabirader_state');
}

// UI State Updates
function updateUI() {
    // Current player badge
    const activeColor = getCurrentPlayerColor();
    if (!activeColor) return;

    currentPlayerDisplay.className = `player-badge active-${activeColor}`;
    
    const activePlayer = gameState.players[activeColor];
    if (activePlayer) {
        const typeStr = activePlayer.type === 'ai' ? 'Yapay Zeka' : 'İnsan';
        const nameStr = COLOR_NAMES[activeColor] || activeColor;
        const nameSpan = currentPlayerDisplay.querySelector('.player-name');
        if (nameSpan) nameSpan.innerText = `${nameStr} (${typeStr})`;
    }

    // Indicators / Ranks
    COLORS.forEach(color => {
        const row = document.getElementById(`status-${color}`);
        if (row) {
            const player = gameState.players[color];
            if (!player || player.type === 'none') {
                row.classList.add('hidden');
            } else {
                row.classList.remove('hidden');
                if (color === activeColor) {
                    row.classList.add('active-turn');
                    row.style.color = `var(--color-${color})`;
                } else {
                    row.classList.remove('active-turn');
                    row.style.color = '';
                }
                
                const finishedCount = (gameState.tokens[color] || []).filter(t => t.posType === 'finished').length;
                const progressSpan = row.querySelector('.p-progress');
                if (progressSpan) progressSpan.innerText = `Bitiş: ${finishedCount}/4`;
                
                const statusSpan = row.querySelector('.p-status');
                if (statusSpan) {
                    statusSpan.innerHTML = player.type === 'ai' 
                        ? `<i class="fa-solid fa-robot"></i> ${COLOR_NAMES[color]}` 
                        : `<i class="fa-solid fa-user"></i> ${COLOR_NAMES[color]}`;
                }
            }
        }
    });

    // Disable dice if already rolled or AI is moving
    const activePlayerConfig = gameState.players[activeColor];
    if (gameState.hasRolled || (activePlayerConfig && activePlayerConfig.type === 'ai')) {
        rollDiceBtn.disabled = true;
    } else {
        rollDiceBtn.disabled = false;
    }

    // Toggle active player dice glow
    if (dice3D) {
        dice3D.className = 'dice';
        if (!gameState.hasRolled && activePlayerConfig && activePlayerConfig.type !== 'ai') {
            dice3D.classList.add(`roll-active-${activeColor}`);
        }
    }

    renderTokens();
}

function logMessage(text, colorClass = 'system') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${colorClass}`;
    
    let icon = '<i class="fa-solid fa-circle-info"></i> ';
    if (colorClass !== 'system') {
        icon = '<i class="fa-solid fa-circle-play"></i> ';
    }
    
    entry.innerHTML = icon + text;
    gameLog.appendChild(entry);
    gameLog.scrollTop = gameLog.scrollHeight;
}

// Auto Save / Resume Game
function saveGameState() {
    sessionStorage.setItem('kizmabirader_state', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = sessionStorage.getItem('kizmabirader_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.activePlayers && parsed.activePlayers.length > 0) {
                gameState = parsed;
                showPanel('game-panel');
                buildBoardUI();
                updateUI();
                logMessage("Kaldığınız yerden devam ediliyor...", getCurrentPlayerColor());
                checkAndTriggerAI();
            } else {
                sessionStorage.removeItem('kizmabirader_state');
            }
        } catch (e) {
            console.error("Auto load failed", e);
            sessionStorage.removeItem('kizmabirader_state');
        }
    }
}

// Theme toggles
themeBtn.addEventListener('click', () => {
    const curTheme = document.body.getAttribute('data-theme') || 'dark';
    const nextTheme = curTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', nextTheme);
    themeBtn.querySelector('i').className = nextTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});

// Sound toggles
soundBtn.addEventListener('click', () => {
    const isEnabled = sounds.toggle();
    soundBtn.querySelector('i').className = isEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
});

// Rules Modal Contents
const RULES_CONTENT = {
    hub: `
        <h3>Masa Oyunu Platformu</h3>
        <p>Hub üzerinden dilediğiniz klasik oyunu seçip oynayabilirsiniz. Şu an aktif oyunlar:</p>
        <ul>
            <li><strong>Kızma Birader (Ludo):</strong> 2-4 oyunculu klasik şans ve strateji oyunu.</li>
            <li><strong>SOS Oyunu:</strong> Grid üzerinde harf yerleştirme ve puan toplama oyunu.</li>
        </ul>
    `,
    ludo: `
        <h3>Kızma Birader Kuralları</h3>
        <p>4 piyonunuzun tamamını oyun tahtası etrafında tam tur döndürerek kendi renginizdeki hedef (ev) alanına ulaştıran ilk oyuncu olmak.</p>
        <h3>Başlangıç & Zar</h3>
        <ul>
            <li>Piyonların başlangıç kalesinden çıkabilmesi için <strong>6</strong> atılması gerekir.</li>
            <li>Zarda 6 atan oyuncu bir piyonunu çıkarabilir ve <strong>ekstra zar atma hakkı</strong> kazanır.</li>
            <li>Sırası gelen oyuncu zarı atar ve gelen sayı kadar piyonunu saat yönünde ilerletir.</li>
        </ul>
        <h3>Piyon Kırma & Güvenli Bölgeler</h3>
        <ul>
            <li>Eğer hareketiniz rakip piyonun bulunduğu karede biterse, rakip piyon **kırılır** ve başlangıç kalesine geri döner.</li>
            <li>Güvenli bölgelerde (Yıldız/Kalkan işaretli kareler) piyonlar kırılamaz. Aynı karede birden fazla piyon durabilir.</li>
        </ul>
        <h3>Oyunu Bitirme</h3>
        <ul>
            <li>Piyonlar hedefe girmek için tam gerekli sayıyı atmalıdır. Fazla sayı gelirse piyon hedefe giremez ve olduğu yerde bekler.</li>
        </ul>
    `,
    sos: `
        <h3>SOS Oyun Kuralları</h3>
        <p>Boş hücrelere sırayla <strong>S</strong> ya da <strong>O</strong> harfi yerleştirin.</p>
        <h3>Puanlama</h3>
        <ul>
            <li>Yatay, dikey ya da çapraz olarak <strong>S-O-S</strong> harf dizilimini oluşturan oyuncu 1 puan kazanır.</li>
            <li>SOS yapan oyuncu <strong>ekstra bir hamle hakkı</strong> kazanır.</li>
            <li>Tahtadaki tüm hücreler dolduğunda en çok puana sahip olan oyuncu oyunu kazanır.</li>
        </ul>
    `
};

// Modal Dialog rules
rulesBtn.addEventListener('click', () => {
    const rulesBody = document.getElementById('rules-modal-body');
    if (!gamePanel.classList.contains('hidden')) {
        rulesBody.innerHTML = RULES_CONTENT.ludo;
    } else if (!sosGamePanel.classList.contains('hidden')) {
        rulesBody.innerHTML = RULES_CONTENT.sos;
    } else {
        rulesBody.innerHTML = RULES_CONTENT.hub;
    }
    rulesModal.classList.remove('hidden');
});
closeRulesBtn.addEventListener('click', () => rulesModal.classList.add('hidden'));

// ---------------- SOS GAME ENGINE ----------------

let sosState = {
    boardSize: 4,
    player2Type: 'ai',
    board: [], // Array of size*size elements: { char: 'S'|'O'|'', owner: 1|2 }
    currentPlayer: 1, // 1 | 2
    scores: { 1: 0, 2: 0 },
    activeLetter: 'S',
    completedSOS: [] // Array of 'idx1,idx2,idx3' keys
};

// Selection of Letter
sosBtnS.addEventListener('click', () => {
    sosState.activeLetter = 'S';
    sosBtnS.classList.add('active');
    sosBtnO.classList.remove('active');
});

sosBtnO.addEventListener('click', () => {
    sosState.activeLetter = 'O';
    sosBtnO.classList.add('active');
    sosBtnS.classList.remove('active');
});

// Setup -> Start SOS Game
sosStartBtn.addEventListener('click', () => {
    const size = parseInt(document.querySelector('input[name="sos-size"]:checked').value);
    const opponent = document.querySelector('input[name="sos-player2"]:checked').value;
    
    initSOSGame(size, opponent);
});

function initSOSGame(size, opponent, savedState = null) {
    if (savedState) {
        sosState = savedState;
    } else {
        sosState.boardSize = size;
        sosState.player2Type = opponent;
        sosState.currentPlayer = 1;
        sosState.scores = { 1: 0, 2: 0 };
        sosState.activeLetter = 'S';
        sosState.completedSOS = [];
        
        sosState.board = [];
        for (let i = 0; i < size * size; i++) {
            sosState.board.push({ char: '', owner: null });
        }
    }
    
    saveSOSState();
    showPanel('sos-game-panel');
    buildSOSBoardUI();
    updateSOSUI();
    
    if (sosState.currentPlayer === 2 && sosState.player2Type === 'ai') {
        setTimeout(makeSOSAIMove, 1000);
    }
}

function buildSOSBoardUI() {
    sosGridContainer.innerHTML = '';
    const size = sosState.boardSize;
    
    sosGridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    sosGridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
    sosState.board.forEach((cell, idx) => {
        const cellEl = document.createElement('div');
        cellEl.className = 'sos-cell';
        cellEl.dataset.index = idx;
        
        if (cell.char !== '') {
            cellEl.innerText = cell.char;
            cellEl.classList.add('filled');
            cellEl.classList.add(cell.owner === 1 ? 'p1-placed' : 'p2-placed');
        }
        
        // Check if part of any completed SOS
        const isCompleted = sosState.completedSOS.some(key => {
            const indices = key.split(',').map(Number);
            return indices.includes(idx);
        });
        
        if (isCompleted) {
            cellEl.classList.add('sos-complete');
        }
        
        if (cell.char === '' && !(sosState.currentPlayer === 2 && sosState.player2Type === 'ai')) {
            cellEl.addEventListener('click', () => handleSOSCellClick(idx));
        }
        
        sosGridContainer.appendChild(cellEl);
    });
}

function handleSOSCellClick(idx) {
    if (sosState.board[idx].char !== '') return;
    
    applySOSMove(idx, sosState.activeLetter);
}

function applySOSMove(idx, char) {
    if (isMultiplayerActive) {
        const myNum = myPlayerKey === 'player1' ? 1 : 2;
        if (sosState.currentPlayer !== myNum) {
            alert("Sıra sizde değil!");
            return;
        }
    }
    sosState.board[idx].char = char;
    sosState.board[idx].owner = sosState.currentPlayer;
    sounds.playMove();
    
    // Check if new SOS formed
    const newMatches = checkSOSFormed(idx, char);
    
    if (newMatches.length > 0) {
        // Increase score
        sosState.scores[sosState.currentPlayer] += newMatches.length;
        
        // Add to completed list
        newMatches.forEach(match => {
            sosState.completedSOS.push(match.tripletKey);
        });
        
        sounds.playHome();
    } else {
        // Switch turn if no SOS was formed
        sosState.currentPlayer = sosState.currentPlayer === 1 ? 2 : 1;
    }
    
    saveSOSState();
    buildSOSBoardUI();
    updateSOSUI();
    if (isMultiplayerActive) {
        currentRoomRef.child('state').set(sosState);
    }
    
    // Check game over
    const emptyIndices = sosState.board.filter(c => c.char === '').length;
    if (emptyIndices === 0) {
        setTimeout(handleSOSGameOver, 600);
        return;
    }
    
    // Trigger AI if turn fits
    if (sosState.currentPlayer === 2 && sosState.player2Type === 'ai') {
        setTimeout(makeSOSAIMove, 1000);
    }
}

function checkSOSFormed(placedIdx, placedChar) {
    const size = sosState.boardSize;
    const r = Math.floor(placedIdx / size);
    const c = placedIdx % size;
    let sosFound = [];

    // Direction steps: [rowOffset, colOffset]
    const dirs = [
        [0, 1],   // Horizontal
        [1, 0],   // Vertical
        [1, 1],   // Diagonal Down-Right
        [1, -1]   // Diagonal Down-Left
    ];

    dirs.forEach(([dr, dc]) => {
        if (placedChar === 'O') {
            // Check opposite neighbors: S-O-S
            const r1 = r - dr, c1 = c - dc;
            const r2 = r + dr, c2 = c + dc;
            if (r1 >= 0 && r1 < size && c1 >= 0 && c1 < size &&
                r2 >= 0 && r2 < size && c2 >= 0 && c2 < size) {
                const idx1 = r1 * size + c1;
                const idx2 = r2 * size + c2;
                if (sosState.board[idx1] && sosState.board[idx1].char === 'S' &&
                    sosState.board[idx2] && sosState.board[idx2].char === 'S') {
                    const tripletKey = [idx1, placedIdx, idx2].sort((a,b) => a-b).join(',');
                    if (!sosState.completedSOS.includes(tripletKey)) {
                        sosFound.push({ tripletKey, cells: [idx1, placedIdx, idx2] });
                    }
                }
            }
        } else if (placedChar === 'S') {
            // Check two cells forward: S-O-S
            const r1_1 = r + dr, c1_1 = c + dc;
            const r1_2 = r + 2 * dr, c1_2 = c + 2 * dc;
            if (r1_1 >= 0 && r1_1 < size && c1_1 >= 0 && c1_1 < size &&
                r1_2 >= 0 && r1_2 < size && c1_2 >= 0 && c1_2 < size) {
                const idx1 = r1_1 * size + c1_1;
                const idx2 = r1_2 * size + c1_2;
                if (sosState.board[idx1] && sosState.board[idx1].char === 'O' &&
                    sosState.board[idx2] && sosState.board[idx2].char === 'S') {
                    const tripletKey = [placedIdx, idx1, idx2].sort((a,b) => a-b).join(',');
                    if (!sosState.completedSOS.includes(tripletKey)) {
                        sosFound.push({ tripletKey, cells: [placedIdx, idx1, idx2] });
                    }
                }
            }
            // Check two cells backward: S-O-S
            const r2_1 = r - dr, c2_1 = c - dc;
            const r2_2 = r - 2 * dr, c2_2 = c - 2 * dc;
            if (r2_1 >= 0 && r2_1 < size && c2_1 >= 0 && c2_1 < size &&
                r2_2 >= 0 && r2_2 < size && c2_2 >= 0 && c2_2 < size) {
                const idx1 = r2_1 * size + c2_1;
                const idx2 = r2_2 * size + c2_2;
                if (sosState.board[idx1] && sosState.board[idx1].char === 'O' &&
                    sosState.board[idx2] && sosState.board[idx2].char === 'S') {
                    const tripletKey = [placedIdx, idx1, idx2].sort((a,b) => a-b).join(',');
                    if (!sosState.completedSOS.includes(tripletKey)) {
                        sosFound.push({ tripletKey, cells: [placedIdx, idx1, idx2] });
                    }
                }
            }
        }
    });

    return sosFound;
}

function makeSOSAIMove() {
    const emptyIndices = [];
    sosState.board.forEach((cell, idx) => {
        if (cell.char === '') emptyIndices.push(idx);
    });

    if (emptyIndices.length === 0) return;

    // 1. Check if AI can make an SOS immediately
    for (let idx of emptyIndices) {
        sosState.board[idx].char = 'S';
        let matches = checkSOSFormed(idx, 'S');
        sosState.board[idx].char = ''; // revert
        if (matches.length > 0) {
            applySOSMove(idx, 'S');
            return;
        }

        sosState.board[idx].char = 'O';
        matches = checkSOSFormed(idx, 'O');
        sosState.board[idx].char = ''; // revert
        if (matches.length > 0) {
            applySOSMove(idx, 'O');
            return;
        }
    }

    // 2. Block Opponent from making an SOS
    for (let idx of emptyIndices) {
        sosState.board[idx].char = 'S';
        let matches = checkSOSFormed(idx, 'S');
        sosState.board[idx].char = ''; // revert
        if (matches.length > 0) {
            applySOSMove(idx, 'O');
            return;
        }

        sosState.board[idx].char = 'O';
        matches = checkSOSFormed(idx, 'O');
        sosState.board[idx].char = ''; // revert
        if (matches.length > 0) {
            applySOSMove(idx, 'S');
            return;
        }
    }

    // 3. Fallback: Place S or O randomly
    const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const randomChar = Math.random() > 0.5 ? 'S' : 'O';
    applySOSMove(randomIdx, randomChar);
}

function updateSOSUI() {
    // Score labels
    sosStatusP1.querySelector('.player-name').innerText = `Oyuncu 1: ${sosState.scores[1]} SOS`;
    const p2TypeStr = sosState.player2Type === 'ai' ? 'Yapay Zeka' : 'Oyuncu 2';
    sosStatusP2.querySelector('.player-name').innerText = `${p2TypeStr}: ${sosState.scores[2]} SOS`;
    
    // Turn active indicators
    if (sosState.currentPlayer === 1) {
        sosStatusP1.classList.add('active-turn');
        sosStatusP2.classList.remove('active-turn');
        sosTurnBadge.innerText = 'Oyuncu 1';
        sosTurnBadge.className = 'player-badge active-red'; // dynamic indicator class
    } else {
        sosStatusP2.classList.add('active-turn');
        sosStatusP1.classList.remove('active-turn');
        sosTurnBadge.innerText = p2TypeStr;
        sosTurnBadge.className = 'player-badge active-blue';
    }
}

function handleSOSGameOver() {
    sounds.playWin();
    
    const currentAccount = accounts.find(a => a.username === activeUsername);
    if (currentAccount) {
        currentAccount.played += 1;
        if (sosState.scores[1] > sosState.scores[2]) {
            currentAccount.wins += 1;
        }
        saveProfileStats();
    }
    
    let resultText = "";
    if (sosState.scores[1] > sosState.scores[2]) {
        resultText = "Oyuncu 1 kazandı!";
    } else if (sosState.scores[2] > sosState.scores[1]) {
        const p2TypeStr = sosState.player2Type === 'ai' ? 'Yapay Zeka' : 'Oyuncu 2';
        resultText = `${p2TypeStr} kazandı!`;
    } else {
        resultText = "Berabere bitti!";
    }
    
    winnerTitle.innerText = "Oyun Bitti!";
    winnerTextEl.innerText = resultText;
    winnerModal.classList.remove('hidden');
    
    sessionStorage.removeItem('sos_state');
}

// SOS sidebar resets
sosResetBtn.addEventListener('click', () => {
    if (confirm("Oyunu baştan açmak istediğinize emin misiniz?")) {
        initSOSGame(sosState.boardSize, sosState.player2Type);
    }
});

sosEndBtn.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
    showPanel('hub-panel');
    sessionStorage.removeItem('sos_state');
});

// Auto-save & resume for SOS
function saveSOSState() {
    sessionStorage.setItem('sos_state', JSON.stringify(sosState));
}

function loadSOSState() {
    const saved = sessionStorage.getItem('sos_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.board && parsed.board.length > 0) {
                initSOSGame(parsed.boardSize, parsed.player2Type, parsed);
            }
        } catch(e) {}
    }
}

// Profile setup form submission
regSubmitBtn.addEventListener('click', () => {
    const username = regUsername.value.trim();
    if (!username) {
        alert("Lütfen geçerli bir kullanıcı adı girin!");
        return;
    }
    
    // Check duplication
    const isEditing = regSubmitBtn.dataset.editing === 'true';
    if (!isEditing && accounts.some(a => a.username.toLowerCase() === username.toLowerCase())) {
        alert("Bu kullanıcı adı zaten alınmış!");
        return;
    }

    const selectedAvatarEl = document.querySelector('input[name="reg-avatar"]:checked');
    const avatar = selectedAvatarEl ? selectedAvatarEl.value : 'fa-user-astronaut';

    const selectedColorEl = document.querySelector('input[name="reg-color"]:checked');
    const color = selectedColorEl ? selectedColorEl.value : 'red';

    // Create or edit profile
    let targetProfile = accounts.find(a => a.username === username);
    if (!targetProfile) {
        targetProfile = {
            username: username,
            avatar: avatar,
            color: color,
            played: 0,
            wins: 0
        };
        accounts.push(targetProfile);
    } else {
        targetProfile.avatar = avatar;
        targetProfile.color = color;
    }
    
    activeUsername = username;
    saveProfileStats();
    
    // Clear input
    regUsername.value = '';
    delete regSubmitBtn.dataset.editing;
    
    showPanel('hub-panel');
});

regCancelBtn.addEventListener('click', () => {
    if (accounts.length > 0) {
        showPanel('hub-panel');
    }
});

// Profile Switcher Events
hubSwitchProfileBtn.addEventListener('click', () => {
    updateProfilesListUI();
    profileSwitchModal.classList.remove('hidden');
});

closeProfileSwitchBtn.addEventListener('click', () => {
    profileSwitchModal.classList.add('hidden');
});

hubNewProfileBtn.addEventListener('click', () => {
    regUsername.value = '';
    regCancelBtn.classList.remove('hidden');
    delete regSubmitBtn.dataset.editing;
    showPanel('profile-setup-panel');
});

function updateProfilesListUI() {
    profilesListContainer.innerHTML = '';
    
    accounts.forEach(account => {
        const item = document.createElement('div');
        item.className = `profile-item ${account.username === activeUsername ? 'active-profile' : ''}`;
        
        const ratio = account.played > 0 ? Math.round((account.wins / account.played) * 100) : 0;
        
        item.innerHTML = `
            <div class="profile-item-info">
                <div class="profile-item-avatar theme-${account.color}" style="background: var(--color-${account.color}); box-shadow: 0 0 10px var(--color-${account.color});">
                    <i class="fa-solid ${account.avatar}"></i>
                </div>
                <div>
                    <div class="profile-item-name">${account.username}</div>
                    <div class="profile-item-stats">Maç: ${account.played} | Galibiyet: ${account.wins} (%${ratio})</div>
                </div>
            </div>
            ${accounts.length > 1 ? `<button class="profile-item-delete" title="Profili Sil"><i class="fa-solid fa-trash"></i></button>` : ''}
        `;
        
        // Switch click
        item.addEventListener('click', (e) => {
            // If delete button was clicked, don't switch
            if (e.target.closest('.profile-item-delete')) return;
            
            activeUsername = account.username;
            saveProfileStats();
            profileSwitchModal.classList.add('hidden');
        });
        
        // Delete click
        const delBtn = item.querySelector('.profile-item-delete');
        if (delBtn) {
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`"${account.username}" profilini silmek istediğinize emin misiniz? Bütün istatistikleriniz silinecektir.`)) {
                    accounts = accounts.filter(a => a.username !== account.username);
                    if (activeUsername === account.username) {
                        activeUsername = accounts[0].username;
                    }
                    saveProfileStats();
                    updateProfilesListUI();
                    if (accounts.length === 0) {
                        profileSwitchModal.classList.add('hidden');
                        regCancelBtn.classList.add('hidden');
                        showPanel('profile-setup-panel');
                    }
                }
            });
        }
        
        profilesListContainer.appendChild(item);
    });
}

// ---------------- PLATFORM RUN ON INIT ----------------

loadProfileStats();
loadGameState();
loadSOSState();


