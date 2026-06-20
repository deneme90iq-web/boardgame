/**
 * BoardGame Hub - Premium Digital Edition
 * Modularized OOP Architecture
 */

// ==========================================
// 1. SOUND ENGINE (Web Audio API)
// ==========================================
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

// ==========================================
// 2. CONSTANTS & GAME SPECIFICATIONS
// ==========================================
const TRACK_COORDS = [
    { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 },
    { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 },
    { r: 0, c: 7 },
    { r: 0, c: 8 }, { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 },
    { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 }, { r: 6, c: 14 },
    { r: 7, c: 14 },
    { r: 8, c: 14 }, { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 },
    { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 },
    { r: 14, c: 7 },
    { r: 14, c: 6 }, { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 },
    { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 }, { r: 8, c: 0 },
    { r: 7, c: 0 }, { r: 6, c: 0 }
];

const SAFE_INDICES = [0, 8, 13, 22, 26, 34, 39, 48];
const COLORS = ['red', 'blue', 'green', 'yellow'];
const COLOR_NAMES = { red: 'Kırmızı', blue: 'Mavi', green: 'Yeşil', yellow: 'Sarı' };

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

// ==========================================
// 3. ACCOUNT MANAGER (Profiles & Statistics)
// ==========================================
class AccountManager {
    constructor() {
        this.accounts = [];
        this.activeUsername = "";
    }

    load() {
        const savedAccounts = localStorage.getItem('boardgame_hub_accounts');
        const savedActive = localStorage.getItem('boardgame_hub_active_user');
        
        if (savedAccounts) {
            try { this.accounts = JSON.parse(savedAccounts); } catch(e) { this.accounts = []; }
        }
        if (savedActive) {
            this.activeUsername = savedActive;
        }
    }

    save() {
        localStorage.setItem('boardgame_hub_accounts', JSON.stringify(this.accounts));
        localStorage.setItem('boardgame_hub_active_user', this.activeUsername);
        this.updateProfileUI();
    }

    getActiveAccount() {
        return this.accounts.find(a => a.username === this.activeUsername);
    }

    createProfile(username, avatar, color) {
        let profile = this.accounts.find(a => a.username.toLowerCase() === username.toLowerCase());
        if (!profile) {
            profile = { username, avatar, color, played: 0, wins: 0 };
            this.accounts.push(profile);
        } else {
            profile.avatar = avatar;
            profile.color = color;
        }
        this.activeUsername = profile.username;
        this.save();
    }

    deleteProfile(username) {
        this.accounts = this.accounts.filter(a => a.username !== username);
        if (this.activeUsername === username && this.accounts.length > 0) {
            this.activeUsername = this.accounts[0].username;
        }
        this.save();
    }

    updateProfileUI() {
        const account = this.getActiveAccount();
        if (!account) return;
        
        document.getElementById('profile-name').innerText = account.username;
        const avatarDisplay = document.getElementById('profile-avatar-display');
        avatarDisplay.className = `profile-avatar theme-${account.color}`;
        avatarDisplay.innerHTML = `<i class="fa-solid ${account.avatar}"></i>`;
        
        document.getElementById('stats-played').innerText = account.played;
        document.getElementById('stats-wins').innerText = account.wins;
        const ratio = account.played > 0 ? Math.round((account.wins / account.played) * 100) : 0;
        document.getElementById('stats-ratio').innerText = ratio + '%';
    }
}

// ==========================================
// 4. FIREBASE MULTIPLAYER MANAGER
// ==========================================
class FirebaseManager {
    constructor() {
        this.app = null;
        this.db = null;
        this.config = null;
        this.roomRef = null;
        
        this.roomCode = null;
        this.myPlayerKey = null; // 'player1'..'player4'
        this.isMultiplayerActive = false;
        this.gameName = null; // 'ludo' or 'sos'
        
        this.onRoomStateChanged = null;
        this.onPlayersChanged = null;
    }

    loadConfig() {
        const saved = localStorage.getItem('boardgame_hub_firebase_config');
        if (saved) {
            try {
                this.config = JSON.parse(saved);
                this.initializeFirebase();
            } catch(e) {
                console.error("Firebase saved config load failed", e);
            }
        }
    }

    saveConfig(configStr) {
        try {
            const config = JSON.parse(configStr);
            localStorage.setItem('boardgame_hub_firebase_config', JSON.stringify(config));
            this.config = config;
            this.initializeFirebase();
            return true;
        } catch(e) {
            alert("Geçersiz JSON formatı!");
            return false;
        }
    }

    initializeFirebase() {
        if (!this.config) return;
        try {
            // Check if already initialized to avoid re-init error
            if (firebase.apps.length === 0) {
                this.app = firebase.initializeApp(this.config);
            } else {
                this.app = firebase.app();
            }
            this.db = firebase.database();
        } catch(e) {
            console.error("Firebase Init Error", e);
        }
    }

    isConfigured() {
        return !!this.db;
    }

    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async createRoom(gameName, hostAccount) {
        if (!this.isConfigured()) {
            alert("Firebase yapılandırılmamış!");
            return null;
        }
        this.roomCode = this.generateRoomCode();
        this.gameName = gameName;
        this.myPlayerKey = 'player1';
        this.isMultiplayerActive = true;
        
        this.roomRef = this.db.ref(`rooms/${this.roomCode}`);
        
        const hostPlayerObj = {
            username: hostAccount.username,
            avatar: hostAccount.avatar,
            color: hostAccount.color,
            playerKey: 'player1'
        };

        await this.roomRef.set({
            gameName: gameName,
            status: 'lobby',
            players: {
                player1: hostPlayerObj
            },
            state: null
        });

        this.listenToRoom();
        return this.roomCode;
    }

    async joinRoom(roomCode, gameName, guestAccount) {
        if (!this.isConfigured()) {
            alert("Firebase yapılandırılmamış!");
            return null;
        }
        const cleanedCode = roomCode.trim().toUpperCase();
        this.roomRef = this.db.ref(`rooms/${cleanedCode}`);
        
        const snapshot = await this.roomRef.once('value');
        const roomData = snapshot.val();
        if (!roomData) {
            alert("Oda bulunamadı!");
            return null;
        }
        if (roomData.gameName !== gameName) {
            alert(`Bu oda ${roomData.gameName === 'ludo' ? 'Kızma Birader' : 'SOS'} oyunu için açılmış!`);
            return null;
        }
        if (roomData.status !== 'lobby') {
            alert("Oyun çoktan başlamış!");
            return null;
        }

        const maxPlayers = gameName === 'ludo' ? 4 : 2;
        const currentPlayers = roomData.players || {};
        const playerKeys = Object.keys(currentPlayers);
        
        if (playerKeys.length >= maxPlayers) {
            alert("Oda dolu!");
            return null;
        }

        // Determine next slot
        let myKey = null;
        for (let i = 1; i <= maxPlayers; i++) {
            if (!currentPlayers[`player${i}`]) {
                myKey = `player${i}`;
                break;
            }
        }

        if (!myKey) {
            alert("Oda dolu!");
            return null;
        }

        this.roomCode = cleanedCode;
        this.gameName = gameName;
        this.myPlayerKey = myKey;
        this.isMultiplayerActive = true;

        const guestPlayerObj = {
            username: guestAccount.username,
            avatar: guestAccount.avatar,
            color: guestAccount.color,
            playerKey: myKey
        };

        await this.roomRef.child('players').child(myKey).set(guestPlayerObj);
        
        this.listenToRoom();
        return this.roomCode;
    }

    disconnect() {
        if (this.roomRef) {
            if (this.myPlayerKey) {
                // Remove player from database
                this.roomRef.child('players').child(this.myPlayerKey).remove();
            }
            this.roomRef.off();
        }
        this.roomCode = null;
        this.myPlayerKey = null;
        this.isMultiplayerActive = false;
        this.roomRef = null;
    }

    listenToRoom() {
        if (!this.roomRef) return;
        
        // Listen players list
        this.roomRef.child('players').on('value', (snapshot) => {
            const players = snapshot.val() || {};
            if (this.onPlayersChanged) this.onPlayersChanged(players);
        });

        // Listen game status / state updates
        this.roomRef.on('value', (snapshot) => {
            const roomVal = snapshot.val();
            if (roomVal && this.onRoomStateChanged) {
                this.onRoomStateChanged(roomVal);
            }
        });
    }

    updateGameState(state) {
        if (this.roomRef && this.myPlayerKey === 'player1') {
            this.roomRef.child('state').set(state);
        }
    }
    
    // Allow non-hosts to also post their turn updates
    updatePlayerStateDirect(state) {
        if (this.roomRef) {
            this.roomRef.child('state').set(state);
        }
    }
}

// ==========================================
// 5. NAVIGATION MANAGER (SPA Panels Control)
// ==========================================
class NavigationManager {
    constructor(appRef) {
        this.app = appRef;
        this.RULES_CONTENT = {
            hub: `
                <h3>Masa Oyunu Platformu</h3>
                <p>Klasik oyunlar arasından seçim yapıp oynayabilirsiniz:</p>
                <ul>
                    <li><strong>Kızma Birader (Ludo):</strong> 2-4 oyunculu şans ve strateji.</li>
                    <li><strong>SOS Oyunu:</strong> Puan toplama ve harf eşleme stratejisi.</li>
                </ul>
            `,
            ludo: `
                <h3>Kızma Birader Kuralları</h3>
                <p>4 piyonun tamamını tam tur döndürerek hedef (ev) alanına ulaştıran ilk oyuncu olun.</p>
                <ul>
                    <li>Kaleden çıkabilmek için zarda <strong>6</strong> atmalısınız.</li>
                    <li>Her 6 attığınızda <strong>ekstra bir zar atma</strong> hakkı kazanırsınız.</li>
                    <li>Eğer hareketiniz rakip piyonun bulunduğu karede biterse piyonu **kırıp** kalesine yollarsınız.</li>
                    <li>Güvenli bölgelerde piyonlar kırılamaz.</li>
                </ul>
            `,
            sos: `
                <h3>SOS Oyun Kuralları</h3>
                <p>Boş hücrelere sırayla <strong>S</strong> veya <strong>O</strong> harfi yerleştirin.</p>
                <ul>
                    <li>Yatay, dikey ya da çapraz olarak <strong>S-O-S</strong> dizen 1 puan kazanır.</li>
                    <li>SOS yapan oyuncu **ekstra bir hamle** hakkı kazanır.</li>
                    <li>Tahta tamamen dolduğunda en çok puana sahip olan oyunu kazanır.</li>
                </ul>
            `
        };
    }

    showPanel(panelId) {
        const panels = ['hub-panel', 'setup-panel', 'sos-setup-panel', 'game-panel', 'sos-game-panel', 'profile-setup-panel', 'multiplayer-lobby-panel'];
        panels.forEach(p => {
            const el = document.getElementById(p);
            if (el) {
                if (p === panelId) el.classList.remove('hidden');
                else el.classList.add('hidden');
            }
        });
    }

    openRules() {
        const rulesBody = document.getElementById('rules-modal-body');
        const gamePanel = document.getElementById('game-panel');
        const sosGamePanel = document.getElementById('sos-game-panel');
        
        if (!gamePanel.classList.contains('hidden')) {
            rulesBody.innerHTML = this.RULES_CONTENT.ludo;
        } else if (!sosGamePanel.classList.contains('hidden')) {
            rulesBody.innerHTML = this.RULES_CONTENT.sos;
        } else {
            rulesBody.innerHTML = this.RULES_CONTENT.hub;
        }
        document.getElementById('rules-modal').classList.remove('hidden');
    }

    closeRules() {
        document.getElementById('rules-modal').classList.add('hidden');
    }

    toggleTheme() {
        const curTheme = document.body.getAttribute('data-theme') || 'dark';
        const nextTheme = curTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', nextTheme);
        const icon = document.getElementById('theme-btn').querySelector('i');
        icon.className = nextTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
}

// ==========================================
// 6. LUDO GAME ENGINE
// ==========================================
class LudoEngine {
    constructor(appRef) {
        this.app = appRef;
        this.state = {
            players: {}, // color -> { type: 'human'|'ai'|'none', finished: 0, username: '' }
            activePlayers: [], // colors
            currentTurnIndex: 0,
            diceVal: null,
            hasRolled: false,
            extraTurn: false,
            tokens: {} // color -> 4 tokens
        };
    }

    init() {
        this.buildBoardUI();
    }

    buildBoardUI() {
        const board = document.getElementById('ludo-board');
        board.innerHTML = '';

        for (let r = 0; r < 15; r++) {
            for (let c = 0; c < 15; c++) {
                if (r < 6 && c < 6) continue;
                if (r < 6 && c >= 9) continue;
                if (r >= 9 && c < 6) continue;
                if (r >= 9 && c >= 9) continue;
                if (r >= 6 && r <= 8 && c >= 6 && c <= 8) continue;
                
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                const trackIdx = TRACK_COORDS.findIndex(coord => coord.r === r && coord.c === c);
                if (trackIdx !== -1) {
                    if (SAFE_INDICES.includes(trackIdx)) {
                        cell.classList.add('safe-zone');
                    }
                    if (r === 6 && c === 1) cell.classList.add('red-start');
                    else if (r === 1 && c === 8) cell.classList.add('blue-start');
                    else if (r === 8 && c === 13) cell.classList.add('green-start');
                    else if (r === 13 && c === 6) cell.classList.add('yellow-start');
                }
                
                COLORS.forEach(color => {
                    const homeIdx = COLOR_CONFIGS[color].homePath.findIndex(coord => coord.r === r && coord.c === c);
                    if (homeIdx !== -1 && homeIdx < 4) {
                        cell.classList.add(`${color}-home`);
                    }
                });
                
                board.appendChild(cell);
            }
        }

        this.appendBaseZone('red', 1, 1);
        this.appendBaseZone('blue', 1, 10);
        this.appendBaseZone('yellow', 10, 1);
        this.appendBaseZone('green', 10, 10);

        const center = document.createElement('div');
        center.className = 'center-zone';
        center.style.gridColumn = '7 / span 3';
        center.style.gridRow = '7 / span 3';
        center.innerHTML = `
            <svg viewBox="0 0 120 120" style="width: 100%; height: 100%; display: block;">
                <polygon points="0,0 120,0 60,60" fill="var(--color-blue)" />
                <polygon points="120,0 120,120 60,60" fill="var(--color-green)" />
                <polygon points="0,120 120,120 60,60" fill="var(--color-yellow)" />
                <polygon points="0,0 0,120 60,60" fill="var(--color-red)" />
                <line x1="0" y1="0" x2="120" y2="120" stroke="#1a1a1a" stroke-width="2.5" />
                <line x1="120" y1="0" x2="0" y2="120" stroke="#1a1a1a" stroke-width="2.5" />
                <rect x="0" y="0" width="120" height="120" fill="none" stroke="#1a1a1a" stroke-width="3" />
            </svg>
        `;
        board.appendChild(center);
    }

    appendBaseZone(color, r, c) {
        const base = document.createElement('div');
        base.className = `base-zone base-${color}`;
        base.style.gridColumn = `${c} / span 6`;
        base.style.gridRow = `${r} / span 6`;
        
        for (let i = 0; i < 4; i++) {
            const pocket = document.createElement('div');
            pocket.className = 'pocket';
            pocket.dataset.pocketColor = color;
            pocket.dataset.pocketIndex = i;
            base.appendChild(pocket);
        }
        document.getElementById('ludo-board').appendChild(base);
    }

    startLocalGame(playersConfig) {
        this.state = {
            players: playersConfig,
            activePlayers: Object.keys(playersConfig).filter(c => playersConfig[c].type !== 'none'),
            currentTurnIndex: 0,
            diceVal: null,
            hasRolled: false,
            extraTurn: false,
            tokens: {}
        };

        COLORS.forEach(color => {
            this.state.tokens[color] = Array.from({ length: 4 }, (_, i) => ({
                id: i,
                posType: 'base',
                posIndex: i
            }));
        });

        this.saveLocalBackup();
        this.render();
        this.logMessage("Lokal oyun başladı! Sıra: " + COLOR_NAMES[this.getCurrentPlayerColor()], this.getCurrentPlayerColor());
        this.checkAndTriggerAI();
    }

    startOnlineGame(initialOnlineState) {
        this.state = initialOnlineState;
        this.render();
        this.logMessage("Çevrimiçi oyun başladı! Sıra: " + COLOR_NAMES[this.getCurrentPlayerColor()], this.getCurrentPlayerColor());
        this.checkAndTriggerAI();
    }

    saveLocalBackup() {
        if (!this.app.firebase.isMultiplayerActive) {
            sessionStorage.setItem('kizmabirader_state', JSON.stringify(this.state));
        }
    }

    getCurrentPlayerColor() {
        return this.state.activePlayers[this.state.currentTurnIndex] || null;
    }

    isMyTurn() {
        if (!this.app.firebase.isMultiplayerActive) return true;
        const color = this.getCurrentPlayerColor();
        const pObj = this.state.players[color];
        return pObj && pObj.playerKey === this.app.firebase.myPlayerKey;
    }

    rollDice() {
        if (this.app.firebase.isMultiplayerActive && !this.isMyTurn()) {
            return;
        }
        if (this.state.hasRolled) return;

        this.app.sounds.playRoll();
        const diceBtn = document.getElementById('roll-dice-btn');
        const dice3D = document.getElementById('dice-3d');
        
        diceBtn.disabled = true;
        dice3D.className = 'dice rolling';

        setTimeout(() => {
            dice3D.classList.remove('rolling');
            const roll = Math.floor(Math.random() * 6) + 1;
            this.state.diceVal = roll;
            this.state.hasRolled = true;

            this.setDiceFace(roll);
            const badge = document.getElementById('roll-result-badge');
            badge.innerText = roll;
            badge.classList.remove('hidden');

            const color = this.getCurrentPlayerColor();
            this.logMessage(`${COLOR_NAMES[color]} ${roll} attı!`, color);

            const playable = this.state.tokens[color].filter(t => this.isPlayableToken(color, t));
            
            if (roll === 6) this.state.extraTurn = true;
            else this.state.extraTurn = false;

            if (playable.length === 0) {
                this.logMessage("Yapılabilecek hamle yok.", color);
                setTimeout(() => this.nextTurn(), 1000);
            } else {
                this.render();
                if (this.state.players[color].type === 'ai') {
                    // Host client coordinates local AI decision even in online lobby
                    if (!this.app.firebase.isMultiplayerActive || this.app.firebase.myPlayerKey === 'player1') {
                        setTimeout(() => this.makeAIMove(playable), 1000);
                    }
                }
            }

            this.syncState();
        }, 600);
    }

    setDiceFace(val) {
        const dice3D = document.getElementById('dice-3d');
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

    isPlayableToken(color, token) {
        if (color !== this.getCurrentPlayerColor()) return false;
        if (!this.state.hasRolled || this.state.diceVal === null) return false;
        
        const val = this.state.diceVal;
        if (token.posType === 'base') return val === 6;
        if (token.posType === 'track') return true;
        if (token.posType === 'homePath') return token.posIndex + val <= 4;
        return false;
    }

    handleTokenMove(color, tokenId) {
        if (this.app.firebase.isMultiplayerActive && !this.isMyTurn()) return;
        const token = this.state.tokens[color].find(t => t.id === tokenId);
        if (!token || !this.isPlayableToken(color, token)) return;

        this.app.sounds.playMove();
        const val = this.state.diceVal;

        if (token.posType === 'base') {
            token.posType = 'track';
            token.posIndex = COLOR_CONFIGS[color].startIndex;
            this.logMessage(`${COLOR_NAMES[color]} kaleden çıktı!`, color);
        } else if (token.posType === 'track') {
            const next = this.getNextTrackPosition(color, token.posIndex, val);
            if (next.type === 'track') {
                token.posIndex = next.index;
                this.checkCaptures(color, token.posIndex);
            } else if (next.type === 'homePath') {
                token.posType = 'homePath';
                token.posIndex = next.index;
            } else if (next.type === 'finished') {
                token.posType = 'finished';
                this.app.sounds.playHome();
                this.logMessage(`${COLOR_NAMES[color]} piyonunu hedefe ulaştırdı! 🎉`, color);
            }
        } else if (token.posType === 'homePath') {
            if (token.posIndex + val === 4) {
                token.posType = 'finished';
                this.app.sounds.playHome();
                this.logMessage(`${COLOR_NAMES[color]} piyonunu hedefe ulaştırdı! 🎉`, color);
            } else {
                token.posIndex += val;
            }
        }

        this.state.hasRolled = false;
        this.state.diceVal = null;
        document.getElementById('roll-result-badge').classList.add('hidden');

        if (this.checkWinCondition(color)) {
            this.handleWin(color);
            return;
        }

        this.render();

        if (this.state.extraTurn) {
            this.logMessage(`${COLOR_NAMES[color]} 6 attığı için tekrar oynuyor!`, color);
            this.state.extraTurn = false;
            this.syncState();
            this.checkAndTriggerAI();
        } else {
            this.nextTurn();
        }
    }

    getNextTrackPosition(color, curr, steps) {
        const config = COLOR_CONFIGS[color];
        let remaining = steps;
        let index = curr;

        while (remaining > 0) {
            if (index === config.endIndex) {
                remaining--;
                if (remaining === 4) return { type: 'finished' };
                else if (remaining < 4) return { type: 'homePath', index: remaining };
                else return { type: 'track', index: curr }; // bounce or wait standard
            }
            index = (index + 1) % 52;
            remaining--;
        }
        return { type: 'track', index: index };
    }

    checkCaptures(myColor, trackIndex) {
        if (SAFE_INDICES.includes(trackIndex)) return;
        COLORS.forEach(opp => {
            if (opp === myColor) return;
            this.state.tokens[opp].forEach(t => {
                if (t.posType === 'track' && t.posIndex === trackIndex) {
                    t.posType = 'base';
                    t.posIndex = t.id;
                    this.app.sounds.playCapture();
                    this.logMessage(`${COLOR_NAMES[myColor]} oyuncusu, ${COLOR_NAMES[opp]} piyonunu kırdı! 💥`, myColor);
                }
            });
        });
    }

    nextTurn() {
        this.state.hasRolled = false;
        this.state.diceVal = null;
        this.state.currentTurnIndex = (this.state.currentTurnIndex + 1) % this.state.activePlayers.length;
        
        document.getElementById('roll-result-badge').classList.add('hidden');
        this.syncState();
        this.checkAndTriggerAI();
    }

    checkAndTriggerAI() {
        const color = this.getCurrentPlayerColor();
        if (!color || !this.state.players[color]) return;
        
        const isAI = this.state.players[color].type === 'ai';
        const diceBtn = document.getElementById('roll-dice-btn');
        
        if (isAI) {
            diceBtn.disabled = true;
            // Online mode: only host performs AI roll calculations
            if (!this.app.firebase.isMultiplayerActive || this.app.firebase.myPlayerKey === 'player1') {
                setTimeout(() => this.rollDice(), 1200);
            }
        } else {
            // Check if player has rolled
            diceBtn.disabled = !this.isMyTurn() || this.state.hasRolled;
        }
    }

    makeAIMove(playable) {
        let best = playable[0];
        let maxScore = -1;

        playable.forEach(t => {
            let score = 0;
            const val = this.state.diceVal;

            if (t.posType === 'base' && val === 6) {
                score = 50;
            } else if (t.posType === 'track') {
                const next = this.getNextTrackPosition(this.getCurrentPlayerColor(), t.posIndex, val);
                if (next.type === 'track') {
                    if (!SAFE_INDICES.includes(next.index)) {
                        COLORS.forEach(opp => {
                            if (opp === this.getCurrentPlayerColor()) return;
                            this.state.tokens[opp].forEach(oppT => {
                                if (oppT.posType === 'track' && oppT.posIndex === next.index) {
                                    score = 100; // Capture priority
                                }
                            });
                        });
                    }
                    if (score < 100) {
                        const dist = (COLOR_CONFIGS[this.getCurrentPlayerColor()].endIndex - next.index + 52) % 52;
                        score = 40 - Math.floor(dist / 2);
                    }
                } else if (next.type === 'homePath' || next.type === 'finished') {
                    score = 80;
                }
            } else if (t.posType === 'homePath') {
                if (t.posIndex + val === 4) score = 90;
                else score = 70;
            }

            if (score > maxScore) {
                maxScore = score;
                best = t;
            }
        });

        this.handleTokenMove(this.getCurrentPlayerColor(), best.id);
    }

    checkWinCondition(color) {
        return this.state.tokens[color].every(t => t.posType === 'finished');
    }

    handleWin(color) {
        this.app.sounds.playWin();
        const account = this.app.accounts.getActiveAccount();
        if (account) {
            account.played += 1;
            // Win credited if matches current user color / role
            if (this.state.players[color] && this.state.players[color].type === 'human') {
                account.wins += 1;
            }
            this.app.accounts.save();
        }

        document.getElementById('winner-title').innerText = "Tebrikler!";
        document.getElementById('winner-text').innerText = `Oyunu ${COLOR_NAMES[color]} kazandı!`;
        document.getElementById('winner-modal').classList.remove('hidden');
        
        sessionStorage.removeItem('kizmabirader_state');
    }

    syncState() {
        this.saveLocalBackup();
        if (this.app.firebase.isMultiplayerActive) {
            this.app.firebase.updatePlayerStateDirect(this.state);
        }
    }

    render() {
        // Clear old tokens
        document.querySelectorAll('.token-container').forEach(el => el.remove());
        document.querySelectorAll('.token').forEach(el => el.remove());

        const placement = {};
        COLORS.forEach(color => {
            if (!this.state.players[color] || this.state.players[color].type === 'none') return;
            this.state.tokens[color].forEach(t => {
                let coords = null;
                if (t.posType === 'base') coords = COLOR_CONFIGS[color].basePockets[t.posIndex];
                else if (t.posType === 'track') coords = TRACK_COORDS[t.posIndex];
                else if (t.posType === 'homePath') coords = COLOR_CONFIGS[color].homePath[t.posIndex];

                if (coords) {
                    const key = `${coords.r},${coords.c}`;
                    if (!placement[key]) placement[key] = [];
                    placement[key].push({ color, token: t });
                }
            });
        });

        // Draw tokens
        Object.keys(placement).forEach(key => {
            const [r, c] = key.split(',').map(Number);
            const tokens = placement[key];
            const cell = this.findCell(r, c);
            if (!cell) return;

            if (tokens.length > 1) {
                const container = document.createElement('div');
                container.className = 'token-container multiple';
                tokens.forEach(({ color, token }) => {
                    const el = this.createTokenEl(color, token);
                    container.appendChild(el);
                });
                cell.appendChild(container);
            } else {
                const { color, token } = tokens[0];
                const el = this.createTokenEl(color, token);
                cell.appendChild(el);
            }
        });

        // Update turn display info
        const activeColor = this.getCurrentPlayerColor();
        if (activeColor) {
            const display = document.getElementById('current-player-display');
            display.className = `player-badge active-${activeColor}`;
            const nameSpan = display.querySelector('.player-name');
            const p = this.state.players[activeColor];
            nameSpan.innerText = `${COLOR_NAMES[activeColor]} (${p.type === 'ai' ? 'Yapay Zeka' : 'İnsan'})`;
            
            // Dice glow class
            const dice3D = document.getElementById('dice-3d');
            dice3D.className = 'dice';
            if (!this.state.hasRolled && p.type !== 'ai' && this.isMyTurn()) {
                dice3D.classList.add(`roll-active-${activeColor}`);
            }

            // Sync dice value face visually on all clients
            if (this.state.diceVal !== null) {
                this.setDiceFace(this.state.diceVal);
                const badge = document.getElementById('roll-result-badge');
                badge.innerText = this.state.diceVal;
                badge.classList.remove('hidden');
            } else {
                document.getElementById('roll-result-badge').classList.add('hidden');
            }
        }

        // Side ranks
        COLORS.forEach(color => {
            const row = document.getElementById(`status-${color}`);
            if (!row) return;
            const p = this.state.players[color];
            if (!p || p.type === 'none') {
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
                const finished = this.state.tokens[color].filter(t => t.posType === 'finished').length;
                row.querySelector('.p-progress').innerText = `Bitiş: ${finished}/4`;
                row.querySelector('.p-status').innerHTML = p.type === 'ai'
                    ? `<i class="fa-solid fa-robot"></i> ${COLOR_NAMES[color]}`
                    : `<i class="fa-solid fa-user"></i> ${COLOR_NAMES[color]}`;
            }
        });
    }

    createTokenEl(color, token) {
        const el = document.createElement('div');
        el.className = `token token-${color}`;
        el.innerText = token.id + 1;
        
        if (this.isPlayableToken(color, token) && this.isMyTurn()) {
            el.classList.add('playable');
            el.addEventListener('click', () => this.handleTokenMove(color, token.id));
        }
        return el;
    }

    findCell(r, c) {
        const pockets = document.querySelectorAll('.pocket');
        for (let pocket of pockets) {
            const color = pocket.dataset.pocketColor;
            const idx = Number(pocket.dataset.pocketIndex);
            const conf = COLOR_CONFIGS[color].basePockets[idx];
            if (conf.r === r && conf.c === c) return pocket;
        }
        return document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    }

    logMessage(text, color = 'system') {
        const log = document.getElementById('game-log');
        const entry = document.createElement('div');
        entry.className = `log-entry ${color}`;
        entry.innerHTML = (color === 'system' ? '<i class="fa-solid fa-circle-info"></i> ' : '<i class="fa-solid fa-circle-play"></i> ') + text;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }
}

// ==========================================
// 7. SOS GAME ENGINE
// ==========================================
class SOSEngine {
    constructor(appRef) {
        this.app = appRef;
        this.state = {
            boardSize: 4,
            player2Type: 'ai',
            board: [], // char: 'S'|'O'|'', owner: 1|2
            currentPlayer: 1,
            scores: { 1: 0, 2: 0 },
            activeLetter: 'S',
            completedSOS: []
        };
    }

    startLocalGame(size, p2Type) {
        this.state = {
            boardSize: size,
            player2Type: p2Type,
            board: Array.from({ length: size * size }, () => ({ char: '', owner: null })),
            currentPlayer: 1,
            scores: { 1: 0, 2: 0 },
            activeLetter: 'S',
            completedSOS: []
        };

        this.saveLocalBackup();
        this.render();
    }

    startOnlineGame(onlineState) {
        this.state = onlineState;
        this.render();
        this.checkAndTriggerAI();
    }

    saveLocalBackup() {
        if (!this.app.firebase.isMultiplayerActive) {
            sessionStorage.setItem('sos_state', JSON.stringify(this.state));
        }
    }

    isMyTurn() {
        if (!this.app.firebase.isMultiplayerActive) return true;
        const myNum = this.app.firebase.myPlayerKey === 'player1' ? 1 : 2;
        return this.state.currentPlayer === myNum;
    }

    cellClick(idx) {
        if (this.state.board[idx].char !== '') return;
        if (this.app.firebase.isMultiplayerActive && !this.isMyTurn()) return;

        this.applyMove(idx, this.state.activeLetter);
    }

    applyMove(idx, char) {
        this.state.board[idx].char = char;
        this.state.board[idx].owner = this.state.currentPlayer;
        this.app.sounds.playMove();

        const matches = this.checkSOSFormed(idx, char);
        if (matches.length > 0) {
            this.state.scores[this.state.currentPlayer] += matches.length;
            matches.forEach(m => this.state.completedSOS.push(m.tripletKey));
            this.app.sounds.playHome();
        } else {
            this.state.currentPlayer = this.state.currentPlayer === 1 ? 2 : 1;
        }

        this.syncState();
        this.render();

        const empty = this.state.board.filter(c => c.char === '').length;
        if (empty === 0) {
            setTimeout(() => this.handleGameOver(), 600);
            return;
        }

        this.checkAndTriggerAI();
    }

    checkAndTriggerAI() {
        if (this.state.currentPlayer === 2 && this.state.player2Type === 'ai') {
            if (!this.app.firebase.isMultiplayerActive || this.app.firebase.myPlayerKey === 'player1') {
                setTimeout(() => this.makeAIMove(), 1000);
            }
        }
    }

    checkSOSFormed(placedIdx, char) {
        const size = this.state.boardSize;
        const r = Math.floor(placedIdx / size);
        const c = placedIdx % size;
        const found = [];

        const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];

        dirs.forEach(([dr, dc]) => {
            if (char === 'O') {
                const r1 = r - dr, c1 = c - dc;
                const r2 = r + dr, c2 = c + dc;
                if (r1 >= 0 && r1 < size && c1 >= 0 && c1 < size &&
                    r2 >= 0 && r2 < size && c2 >= 0 && c2 < size) {
                    const idx1 = r1 * size + c1;
                    const idx2 = r2 * size + c2;
                    if (this.state.board[idx1].char === 'S' && this.state.board[idx2].char === 'S') {
                        const key = [idx1, placedIdx, idx2].sort((a,b)=>a-b).join(',');
                        if (!this.state.completedSOS.includes(key)) {
                            found.push({ tripletKey: key });
                        }
                    }
                }
            } else {
                // Forward
                const r1_1 = r + dr, c1_1 = c + dc;
                const r1_2 = r + 2 * dr, c1_2 = c + 2 * dc;
                if (r1_2 >= 0 && r1_2 < size && c1_2 >= 0 && c1_2 < size) {
                    const idx1 = r1_1 * size + c1_1;
                    const idx2 = r1_2 * size + c1_2;
                    if (this.state.board[idx1].char === 'O' && this.state.board[idx2].char === 'S') {
                        const key = [placedIdx, idx1, idx2].sort((a,b)=>a-b).join(',');
                        if (!this.state.completedSOS.includes(key)) found.push({ tripletKey: key });
                    }
                }
                // Backward
                const r2_1 = r - dr, c2_1 = c - dc;
                const r2_2 = r - 2 * dr, c2_2 = c - 2 * dc;
                if (r2_2 >= 0 && r2_2 < size && c2_2 >= 0 && c2_2 < size) {
                    const idx1 = r2_1 * size + c2_1;
                    const idx2 = r2_2 * size + c2_2;
                    if (this.state.board[idx1].char === 'O' && this.state.board[idx2].char === 'S') {
                        const key = [placedIdx, idx1, idx2].sort((a,b)=>a-b).join(',');
                        if (!this.state.completedSOS.includes(key)) found.push({ tripletKey: key });
                    }
                }
            }
        });
        return found;
    }

    makeAIMove() {
        const empty = [];
        this.state.board.forEach((cell, idx) => {
            if (cell.char === '') empty.push(idx);
        });

        if (empty.length === 0) return;

        // 1. Check immediate win
        for (let idx of empty) {
            this.state.board[idx].char = 'S';
            let matches = this.checkSOSFormed(idx, 'S');
            this.state.board[idx].char = '';
            if (matches.length > 0) { this.applyMove(idx, 'S'); return; }

            this.state.board[idx].char = 'O';
            matches = this.checkSOSFormed(idx, 'O');
            this.state.board[idx].char = '';
            if (matches.length > 0) { this.applyMove(idx, 'O'); return; }
        }

        // 2. Block opponent
        for (let idx of empty) {
            this.state.board[idx].char = 'S';
            let matches = this.checkSOSFormed(idx, 'S');
            this.state.board[idx].char = '';
            if (matches.length > 0) { this.applyMove(idx, 'O'); return; }

            this.state.board[idx].char = 'O';
            matches = this.checkSOSFormed(idx, 'O');
            this.state.board[idx].char = '';
            if (matches.length > 0) { this.applyMove(idx, 'S'); return; }
        }

        // 3. Random choice
        const rand = empty[Math.floor(Math.random() * empty.length)];
        const char = Math.random() > 0.5 ? 'S' : 'O';
        this.applyMove(rand, char);
    }

    handleGameOver() {
        this.app.sounds.playWin();
        const account = this.app.accounts.getActiveAccount();
        if (account) {
            account.played += 1;
            if (this.state.scores[1] > this.state.scores[2]) {
                account.wins += 1;
            }
            this.app.accounts.save();
        }

        let txt = "";
        if (this.state.scores[1] > this.state.scores[2]) txt = "Oyuncu 1 kazandı!";
        else if (this.state.scores[2] > this.state.scores[1]) {
            txt = `${this.state.player2Type === 'ai' ? 'Yapay Zeka' : 'Oyuncu 2'} kazandı!`;
        } else txt = "Berabere bitti!";

        document.getElementById('winner-title').innerText = "Oyun Bitti!";
        document.getElementById('winner-text').innerText = txt;
        document.getElementById('winner-modal').classList.remove('hidden');

        sessionStorage.removeItem('sos_state');
    }

    syncState() {
        this.saveLocalBackup();
        if (this.app.firebase.isMultiplayerActive) {
            this.app.firebase.updatePlayerStateDirect(this.state);
        }
    }

    render() {
        const grid = document.getElementById('sos-grid-container');
        grid.innerHTML = '';
        const size = this.state.boardSize;

        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        this.state.board.forEach((cell, idx) => {
            const el = document.createElement('div');
            el.className = 'sos-cell';
            if (cell.char !== '') {
                el.innerText = cell.char;
                el.classList.add('filled');
                el.classList.add(cell.owner === 1 ? 'p1-placed' : 'p2-placed');
            }

            const inComplete = this.state.completedSOS.some(k => k.split(',').map(Number).includes(idx));
            if (inComplete) {
                el.classList.add('sos-complete');
            }

            if (cell.char === '' && this.isMyTurn()) {
                el.addEventListener('click', () => this.cellClick(idx));
            }
            grid.appendChild(el);
        });

        // UI Score updates
        document.getElementById('sos-status-p1').querySelector('.player-name').innerText = `Oyuncu 1: ${this.state.scores[1]} SOS`;
        const p2Str = this.state.player2Type === 'ai' ? 'Yapay Zeka' : 'Oyuncu 2';
        document.getElementById('sos-status-p2').querySelector('.player-name').innerText = `${p2Str}: ${this.state.scores[2]} SOS`;

        const badge = document.getElementById('sos-turn-badge');
        const p1Status = document.getElementById('sos-status-p1');
        const p2Status = document.getElementById('sos-status-p2');

        if (this.state.currentPlayer === 1) {
            p1Status.classList.add('active-turn');
            p2Status.classList.remove('active-turn');
            badge.innerText = 'Oyuncu 1';
            badge.className = 'player-badge active-red';
        } else {
            p2Status.classList.add('active-turn');
            p1Status.classList.remove('active-turn');
            badge.innerText = p2Str;
            badge.className = 'player-badge active-blue';
        }
    }
}

// ==========================================
// 8. APP INITIALIZATION & COORDINATOR
// ==========================================
class App {
    constructor() {
        this.sounds = new SoundEngine();
        this.accounts = new AccountManager();
        this.firebase = new FirebaseManager();
        this.navigation = new NavigationManager(this);
        this.ludo = new LudoEngine(this);
        this.sos = new SOSEngine(this);
    }

    init() {
        this.accounts.load();
        this.firebase.loadConfig();
        this.ludo.init();
        
        this.initDOMEvents();
        this.setupMultiplayerSync();
        
        // Auto-login or Setup
        if (this.accounts.accounts.length === 0) {
            this.navigation.showPanel('profile-setup-panel');
            document.getElementById('reg-cancel-btn').classList.add('hidden');
        } else {
            if (!this.accounts.activeUsername || !this.accounts.accounts.some(a => a.username === this.accounts.activeUsername)) {
                this.accounts.activeUsername = this.accounts.accounts[0].username;
            }
            this.navigation.showPanel('hub-panel');
            this.accounts.updateProfileUI();
        }

        // Resume active session
        this.resumeActiveSessions();
    }

    resumeActiveSessions() {
        const savedLudo = sessionStorage.getItem('kizmabirader_state');
        const savedSos = sessionStorage.getItem('sos_state');
        
        if (savedLudo) {
            try {
                const parsed = JSON.parse(savedLudo);
                if (parsed && parsed.activePlayers && parsed.activePlayers.length > 0) {
                    this.ludo.state = parsed;
                    this.navigation.showPanel('game-panel');
                    this.ludo.render();
                    this.ludo.logMessage("Kaldığınız yerden devam ediliyor...", this.ludo.getCurrentPlayerColor());
                    this.ludo.checkAndTriggerAI();
                }
            } catch(e) { sessionStorage.removeItem('kizmabirader_state'); }
        } else if (savedSos) {
            try {
                const parsed = JSON.parse(savedSos);
                if (parsed && parsed.board && parsed.board.length > 0) {
                    this.sos.state = parsed;
                    this.navigation.showPanel('sos-game-panel');
                    this.sos.render();
                    this.sos.checkAndTriggerAI();
                }
            } catch(e) { sessionStorage.removeItem('sos_state'); }
        }
    }

    initDOMEvents() {
        // Logo Return
        document.getElementById('logo-back-to-hub').addEventListener('click', () => {
            document.getElementById('winner-modal').classList.add('hidden');
            this.firebase.disconnect();
            this.navigation.showPanel('hub-panel');
        });

        // Header controls
        document.getElementById('firebase-config-btn').addEventListener('click', () => {
            const modal = document.getElementById('firebase-config-modal');
            const input = document.getElementById('firebase-config-input');
            if (this.firebase.config) {
                input.value = JSON.stringify(this.firebase.config, null, 2);
            } else {
                input.value = '';
            }
            modal.classList.remove('hidden');
        });
        document.getElementById('close-firebase-btn').addEventListener('click', () => {
            document.getElementById('firebase-config-modal').classList.add('hidden');
        });
        document.getElementById('save-firebase-btn').addEventListener('click', () => {
            const val = document.getElementById('firebase-config-input').value;
            if (this.firebase.saveConfig(val)) {
                document.getElementById('firebase-config-modal').classList.add('hidden');
            }
        });

        document.getElementById('rules-btn').addEventListener('click', () => this.navigation.openRules());
        document.getElementById('close-rules-btn').addEventListener('click', () => this.navigation.closeRules());
        
        document.getElementById('sound-btn').addEventListener('click', () => {
            const active = this.sounds.toggle();
            document.getElementById('sound-btn').querySelector('i').className = active ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        });

        document.getElementById('theme-btn').addEventListener('click', () => this.navigation.toggleTheme());

        // Account form
        document.getElementById('reg-submit-btn').addEventListener('click', () => {
            const username = document.getElementById('reg-username').value.trim();
            if (!username) return alert("Geçersiz kullanıcı adı!");
            
            const avatar = document.querySelector('input[name="reg-avatar"]:checked').value;
            const color = document.querySelector('input[name="reg-color"]:checked').value;
            
            this.accounts.createProfile(username, avatar, color);
            document.getElementById('reg-username').value = '';
            this.navigation.showPanel('hub-panel');
        });

        document.getElementById('reg-cancel-btn').addEventListener('click', () => {
            if (this.accounts.accounts.length > 0) this.navigation.showPanel('hub-panel');
        });

        document.getElementById('hub-new-profile-btn').addEventListener('click', () => {
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-cancel-btn').classList.remove('hidden');
            this.navigation.showPanel('profile-setup-panel');
        });

        document.getElementById('hub-switch-profile-btn').addEventListener('click', () => {
            this.updateSwitcherUI();
            document.getElementById('profile-switch-modal').classList.remove('hidden');
        });
        document.getElementById('close-profile-switch-btn').addEventListener('click', () => {
            document.getElementById('profile-switch-modal').classList.add('hidden');
        });

        // Game setup pages navigation
        document.getElementById('btn-play-ludo-local').addEventListener('click', () => {
            this.navigation.showPanel('setup-panel');
        });
        document.getElementById('ludo-setup-back-btn').addEventListener('click', () => {
            this.navigation.showPanel('hub-panel');
        });

        document.getElementById('btn-play-sos-local').addEventListener('click', () => {
            this.navigation.showPanel('sos-setup-panel');
        });
        document.getElementById('sos-setup-back-btn').addEventListener('click', () => {
            this.navigation.showPanel('hub-panel');
        });

        // Online mode game lobby triggers
        document.getElementById('btn-play-ludo-online').addEventListener('click', () => {
            if (!this.firebase.isConfigured()) return alert("Öncelikle Firebase'i yapılandırmalısınız!");
            this.openMultiplayerLobby('ludo');
        });
        document.getElementById('btn-play-sos-online').addEventListener('click', () => {
            if (!this.firebase.isConfigured()) return alert("Öncelikle Firebase'i yapılandırmalısınız!");
            this.openMultiplayerLobby('sos');
        });

        document.getElementById('multiplayer-lobby-back-btn').addEventListener('click', () => {
            this.firebase.disconnect();
            this.navigation.showPanel('hub-panel');
        });

        // Lobby Actions
        document.getElementById('btn-create-room').addEventListener('click', async () => {
            const acc = this.accounts.getActiveAccount();
            const code = await this.firebase.createRoom(this.firebase.gameName, acc);
            if (code) {
                document.getElementById('lobby-room-details').classList.remove('hidden');
                document.getElementById('room-code-display').innerText = code;
            }
        });

        document.getElementById('btn-join-room').addEventListener('click', async () => {
            const input = document.getElementById('join-room-code-input').value;
            const acc = this.accounts.getActiveAccount();
            const code = await this.firebase.joinRoom(input, this.firebase.gameName, acc);
            if (code) {
                document.getElementById('lobby-room-details').classList.remove('hidden');
                document.getElementById('room-code-display').innerText = code;
            }
        });

        document.getElementById('btn-start-multiplayer-game').addEventListener('click', () => {
            this.startMultiplayerGame();
        });

        // Ludo Actions
        document.getElementById('roll-dice-btn').addEventListener('click', () => this.ludo.rollDice());
        document.getElementById('dice-3d').addEventListener('click', () => {
            const color = this.ludo.getCurrentPlayerColor();
            if (color && this.ludo.state.players[color].type !== 'ai') {
                this.ludo.rollDice();
            }
        });

        document.getElementById('reset-game-btn').addEventListener('click', () => {
            if (confirm("Oyunu baştan açmak istediğinize emin misiniz?")) {
                this.ludo.startLocalGame(this.ludo.state.players);
            }
        });
        document.getElementById('end-game-btn').addEventListener('click', () => {
            sessionStorage.removeItem('kizmabirader_state');
            this.navigation.showPanel('hub-panel');
        });

        // SOS Actions
        document.getElementById('sos-btn-s').addEventListener('click', () => {
            this.sos.state.activeLetter = 'S';
            document.getElementById('sos-btn-s').classList.add('active');
            document.getElementById('sos-btn-o').classList.remove('active');
        });
        document.getElementById('sos-btn-o').addEventListener('click', () => {
            this.sos.state.activeLetter = 'O';
            document.getElementById('sos-btn-o').classList.add('active');
            document.getElementById('sos-btn-s').classList.remove('active');
        });

        document.getElementById('sos-reset-btn').addEventListener('click', () => {
            if (confirm("SOS oyununu yeniden başlatmak ister misiniz?")) {
                this.sos.startLocalGame(this.sos.state.boardSize, this.sos.state.player2Type);
            }
        });
        document.getElementById('sos-end-btn').addEventListener('click', () => {
            sessionStorage.removeItem('sos_state');
            this.navigation.showPanel('hub-panel');
        });

        // Setup starts
        document.getElementById('start-game-btn').addEventListener('click', () => {
            const config = {};
            COLORS.forEach(c => {
                const type = document.querySelector(`input[name="player-${c}"]:checked`).value;
                config[c] = { type, finished: 0 };
            });
            const active = Object.keys(config).filter(c => config[c].type !== 'none');
            if (active.length < 2) return alert("En az 2 aktif oyuncu seçmelisiniz!");
            
            this.navigation.showPanel('game-panel');
            this.ludo.startLocalGame(config);
        });

        document.getElementById('sos-start-btn').addEventListener('click', () => {
            const size = parseInt(document.querySelector('input[name="sos-size"]:checked').value);
            const opponent = document.querySelector('input[name="sos-player2"]:checked').value;
            this.navigation.showPanel('sos-game-panel');
            this.sos.startLocalGame(size, opponent);
        });

        document.getElementById('new-game-btn').addEventListener('click', () => {
            document.getElementById('winner-modal').classList.add('hidden');
            this.navigation.showPanel('hub-panel');
        });
    }

    updateSwitcherUI() {
        const container = document.getElementById('profiles-list-container');
        container.innerHTML = '';
        this.accounts.accounts.forEach(acc => {
            const item = document.createElement('div');
            item.className = `profile-item ${acc.username === this.accounts.activeUsername ? 'active-profile' : ''}`;
            const ratio = acc.played > 0 ? Math.round((acc.wins / acc.played) * 100) : 0;
            
            item.innerHTML = `
                <div class="profile-item-info">
                    <div class="profile-item-avatar theme-${acc.color}" style="background: var(--color-${acc.color}); box-shadow: 0 0 10px var(--color-${acc.color});">
                        <i class="fa-solid ${acc.avatar}"></i>
                    </div>
                    <div>
                        <div class="profile-item-name">${acc.username}</div>
                        <div class="profile-item-stats">Maç: ${acc.played} | Galibiyet: ${acc.wins} (%${ratio})</div>
                    </div>
                </div>
                ${this.accounts.accounts.length > 1 ? `<button class="profile-item-delete" title="Profili Sil"><i class="fa-solid fa-trash"></i></button>` : ''}
            `;

            item.addEventListener('click', (e) => {
                if (e.target.closest('.profile-item-delete')) return;
                this.accounts.activeUsername = acc.username;
                this.accounts.save();
                document.getElementById('profile-switch-modal').classList.add('hidden');
            });

            const del = item.querySelector('.profile-item-delete');
            if (del) {
                del.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`"${acc.username}" silinecektir. Emin misiniz?`)) {
                        this.accounts.deleteProfile(acc.username);
                        this.updateSwitcherUI();
                        if (this.accounts.accounts.length === 0) {
                            document.getElementById('profile-switch-modal').classList.add('hidden');
                            document.getElementById('reg-cancel-btn').classList.add('hidden');
                            this.navigation.showPanel('profile-setup-panel');
                        }
                    }
                });
            }
            container.appendChild(item);
        });
    }

    openMultiplayerLobby(gameName) {
        this.firebase.gameName = gameName;
        document.getElementById('lobby-game-name').innerText = gameName === 'ludo' ? 'Kızma Birader' : 'SOS Oyunu';
        document.getElementById('lobby-room-details').classList.add('hidden');
        document.getElementById('join-room-code-input').value = '';
        this.navigation.showPanel('multiplayer-lobby-panel');
    }

    setupMultiplayerSync() {
        this.firebase.onPlayersChanged = (players) => {
            const ul = document.getElementById('room-players-ul');
            ul.innerHTML = '';
            const playerKeys = Object.keys(players);
            
            playerKeys.forEach(k => {
                const p = players[k];
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.alignItems = 'center';
                li.style.gap = '10px';
                li.style.padding = '8px';
                li.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                li.innerHTML = `
                    <span style="color:var(--color-${p.color});"><i class="fa-solid ${p.avatar}"></i></span>
                    <span>${p.username} ${k === 'player1' ? '<strong style="color:var(--color-yellow); font-size:0.8rem;">(Kurucu)</strong>' : ''}</span>
                `;
                ul.appendChild(li);
            });

            // Start button control (Host controls this, minimum 2 players)
            const startBtn = document.getElementById('btn-start-multiplayer-game');
            if (this.firebase.myPlayerKey === 'player1') {
                startBtn.classList.remove('hidden');
                startBtn.disabled = playerKeys.length < 2;
            } else {
                startBtn.classList.add('hidden');
            }
        };

        this.firebase.onRoomStateChanged = (roomVal) => {
            if (roomVal.status === 'playing' && roomVal.state) {
                if (this.firebase.gameName === 'ludo') {
                    const isNewRoll = this.ludo.state && this.ludo.state.diceVal !== roomVal.state.diceVal && roomVal.state.diceVal !== null;
                    const isNewMove = this.ludo.state && JSON.stringify(this.ludo.state.tokens) !== JSON.stringify(roomVal.state.tokens);

                    if (document.getElementById('game-panel').classList.contains('hidden')) {
                        this.navigation.showPanel('game-panel');
                    }
                    this.ludo.state = roomVal.state;
                    this.ludo.render();

                    if (isNewRoll) {
                        this.sounds.playRoll();
                    } else if (isNewMove) {
                        this.sounds.playMove();
                    }

                    this.ludo.checkAndTriggerAI();
                } else if (this.firebase.gameName === 'sos') {
                    const isNewMove = this.sos.state && JSON.stringify(this.sos.state.board) !== JSON.stringify(roomVal.state.board);

                    if (document.getElementById('sos-game-panel').classList.contains('hidden')) {
                        this.navigation.showPanel('sos-game-panel');
                    }
                    this.sos.state = roomVal.state;
                    this.sos.render();

                    if (isNewMove) {
                        this.sounds.playMove();
                    }

                    this.sos.checkAndTriggerAI();
                }
            }
        };
    }

    startMultiplayerGame() {
        if (this.firebase.myPlayerKey !== 'player1') return;

        if (this.firebase.gameName === 'ludo') {
            const playersConfig = {};
            const dbPlayers = [];
            
            this.firebase.roomRef.child('players').once('value', (snapshot) => {
                const players = snapshot.val();
                
                // Red = player1, Green = player2, Yellow = player3, Blue = player4
                playersConfig['red'] = players.player1 ? { type: 'human', finished: 0, playerKey: 'player1', username: players.player1.username } : { type: 'none' };
                playersConfig['green'] = players.player2 ? { type: 'human', finished: 0, playerKey: 'player2', username: players.player2.username } : { type: 'none' };
                playersConfig['yellow'] = players.player3 ? { type: 'human', finished: 0, playerKey: 'player3', username: players.player3.username } : { type: 'none' };
                playersConfig['blue'] = players.player4 ? { type: 'human', finished: 0, playerKey: 'player4', username: players.player4.username } : { type: 'none' };
                
                const activeColors = Object.keys(playersConfig).filter(c => playersConfig[c].type !== 'none');
                
                const tokensObj = {};
                COLORS.forEach(color => {
                    tokensObj[color] = Array.from({ length: 4 }, (_, i) => ({
                        id: i,
                        posType: 'base',
                        posIndex: i
                    }));
                });

                const initialState = {
                    players: playersConfig,
                    activePlayers: activeColors,
                    currentTurnIndex: 0,
                    diceVal: null,
                    hasRolled: false,
                    extraTurn: false,
                    tokens: tokensObj
                };

                this.firebase.roomRef.update({
                    status: 'playing',
                    state: initialState
                });
            });

        } else if (this.firebase.gameName === 'sos') {
            const initialState = {
                boardSize: 4,
                player2Type: 'human',
                board: Array.from({ length: 16 }, () => ({ char: '', owner: null })),
                currentPlayer: 1,
                scores: { 1: 0, 2: 0 },
                activeLetter: 'S',
                completedSOS: []
            };

            this.firebase.roomRef.update({
                status: 'playing',
                state: initialState
            });
        }
    }
}

// Global App Instance
let gamePlatformApp = null;
window.addEventListener('load', () => {
    gamePlatformApp = new App();
    gamePlatformApp.init();
});
