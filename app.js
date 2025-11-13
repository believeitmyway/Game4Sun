// グローバル変数
let currentScreen = 'top-screen';
let selectedSubject = null;
let selectedUnits = [];
let questionCount = 10;
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let startTime = null;
let userAnswerHistory = {};
let currentQuestionAnswered = false;  // 現在の問題が既に回答済みかどうか
let shopUpdateInterval = null;  // ショップ画面の更新用インターバル
let settings = {
    bgm: true,
    sfx: true,
    explicitContent: true  // 下ネタあり/なし
};

// 新機能: プレイヤーデータ
let playerData = {
    level: 1,
    exp: 0,
    upPoints: 0,  // U-P（うんちポイント）
    title: 'うんち初心者💩',
    totalQuestions: 0,
    totalCorrect: 0,
    consecutiveCorrect: 0,  // 連続正解数
    bestConsecutiveCorrect: 0
};

// 新機能: ストリークデータ
let streakData = {
    currentStreak: 0,  // 現在の連続学習日数
    lastStudyDate: null,  // 最終学習日（YYYY-MM-DD形式）
    longestStreak: 0  // 最長連続学習日数
};

// 新機能: アチーブメントデータ
let achievements = {
    unlocked: [],  // 獲得済み実績IDのリスト
    progress: {}  // 実績の進捗状況（例: { "100-questions": 45 }）
};

// 新機能: ショップデータ
let shopData = {
    purchased: [],  // 購入済みアイテムIDのリスト
    active: {  // 現在使用中のアイテム
        racer: null,
        background: null,
        effects: []
    },
    boosts: {  // アクティブなブースト
        exp: null,  // { itemId: 'boost-exp', expiresAt: timestamp }
        up: null,   // { itemId: 'boost-up', expiresAt: timestamp }
        all: null   // { itemId: 'boost-all', expiresAt: timestamp }
    },
    titles: []  // 購入済み称号IDのリスト
};

// 問題データベース（JSONファイルから読み込む）
let QUESTION_DATABASE = {};

// うんちネタの誤答選択肢（100個）
const POOP_JOKES = [
    'やわらかいうんち',
    '硬いうんち',
    '漏れそうな人',
    '茶色いソフトクリーム',
    'コロコロうんち',
    'バナナ型うんち',
    '下痢気味の人',
    'トイレを探す人',
    'ウォシュレット待ち',
    'うんちを我慢中',
    '今すぐトイレが必要',
    'おなら我慢',
    'おならが出そう',
    'ぶりぶりうんち',
    'もりもりうんち',
    'するするうんち',
    'ツルツルうんち',
    'べちゃべちゃうんち',
    'こんもりうんち',
    'とぐろを巻いたうんち',
    'うんち5秒前',
    'うんちタイム',
    'トイレの神様',
    '便秘3日目',
    '便秘1週間',
    'お腹ゴロゴロ',
    'おなかピーピー',
    'きばってる人',
    'いきんでる人',
    'ふんばり中',
    'トイレットペーパー10巻',
    'ウォシュレットMAX',
    '音姫フル稼働',
    '個室に駆け込む',
    '大の方です',
    'しゃがみこむ人',
    'くさいうんち',
    'くさいおなら',
    'におうやつ',
    'プンプン丸',
    'スルッと出た',
    'スッキリうんち',
    'お腹の中が大変',
    '腸内環境最悪',
    '乳酸菌不足',
    '食物繊維が必要',
    'トイレに30分',
    'トイレから出られない',
    'ノックされてあせる',
    'もよおしてきた',
    '便意が襲う',
    '腹痛で冷や汗',
    'お腹グルグル',
    '消化不良気味',
    '食あたりかも',
    '昨日の食事のせい',
    'カレーの翌日',
    '焼肉の翌朝',
    '牛乳でおなか',
    'お腹ユルユル',
    'おなかシクシク',
    '腸が活発',
    '大腸の大行進',
    'S字結腸パニック',
    '直腸からの警告',
    '肛門が限界',
    '括約筋がんばる',
    'ガマンの限界',
    'もう無理です',
    '駅のトイレを探す',
    'コンビニトイレへ',
    '公園のトイレに走る',
    'トイレの場所を聞く',
    '地図でトイレ検索',
    '次の駅まで我慢',
    '各駅停車で助かる',
    'うんち座りの人',
    '和式でふんばる',
    '洋式で安心',
    '温水便座が恋しい',
    'ペーパーが足りない',
    '流し忘れ注意',
    '2度流し必要',
    'つまりそう',
    'ラバーカップ待機',
    '換気扇フル回転',
    '窓を開けたい',
    '芳香剤必須',
    '消臭スプレー3回',
    'ファブリーズが欲しい',
    '後の人ごめん',
    '入った瞬間に後悔',
    '前の人ひどい',
    '臭いがこもってる',
    'マスク必要',
    '息を止める',
    '鼻をつまむ',
    '我慢できない匂い',
    'うんちハイ',
    'トイレで至福',
    '出し切った感',
    'スッキリ爽快'
];

// スプラッシュスクリーン管理
const SPLASH_TOTAL_STEPS = 7;
let splashCurrentStep = 0;
let splashReady = false;
let splashAlreadyHidden = false;
let splashScreenEl = null;
let splashProgressBarEl = null;
let splashCTAEl = null;
let splashInnerEl = null;

function initSplashScreen() {
    splashScreenEl = document.getElementById('splash-screen');
    splashProgressBarEl = document.getElementById('splash-progress-bar');
    splashCTAEl = document.getElementById('splash-cta');
    splashInnerEl = splashScreenEl ? splashScreenEl.querySelector('.splash-inner') : null;

    if (splashScreenEl) {
        document.body.classList.add('splash-active');
        splashScreenEl.setAttribute('role', 'button');
        splashScreenEl.setAttribute('aria-label', 'クリックまたはタップしてゲームを開始');

        if (splashProgressBarEl && !splashProgressBarEl.style.width) {
            splashProgressBarEl.style.width = '12%';
        }

        splashScreenEl.addEventListener('click', handleSplashActivate);
        splashScreenEl.addEventListener('keydown', handleSplashKeydown);

        requestAnimationFrame(() => {
            splashScreenEl.classList.add('active');
        });
    }
}

function setSplashCTA(message) {
    if (splashCTAEl && typeof message === 'string') {
        splashCTAEl.textContent = message;
    }
}

function advanceSplashProgress(stepIncrement = 1) {
    if (!splashProgressBarEl) return;
    splashCurrentStep = Math.min(SPLASH_TOTAL_STEPS, splashCurrentStep + stepIncrement);
    const percent = Math.max(12, (splashCurrentStep / SPLASH_TOTAL_STEPS) * 100);
    splashProgressBarEl.style.width = `${percent}%`;
}

function completeSplashProgress() {
    if (!splashProgressBarEl) return;
    splashCurrentStep = SPLASH_TOTAL_STEPS;
    splashProgressBarEl.style.width = '100%';
    splashProgressBarEl.classList.add('is-complete');
}

function markSplashReady() {
    splashReady = true;
    completeSplashProgress();
    setSplashCTA('クリックまたはタップしてスタート！');
    if (splashScreenEl) {
        splashScreenEl.classList.add('ready');
    }
    if (splashInnerEl) {
        splashInnerEl.classList.add('ready');
    }
}

function handleSplashActivate(event) {
    if (event && event.type === 'keydown' && !(event.key === 'Enter' || event.key === ' ')) {
        return;
    }

    if (event && event.type === 'keydown') {
        event.preventDefault();
    }

    if (!splashReady) {
        triggerSplashNudge();
        return;
    }

    hideSplashScreen();
}

function handleSplashKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        handleSplashActivate(event);
    }
}

function triggerSplashNudge() {
    if (!splashInnerEl) return;
    splashInnerEl.classList.remove('nudge');
    // Reflow to restart animation
    void splashInnerEl.offsetWidth;
    splashInnerEl.classList.add('nudge');
}

function hideSplashScreen(delay = 0) {
    if (!splashScreenEl || splashAlreadyHidden) return;
    splashAlreadyHidden = true;

    if (splashScreenEl) {
        splashScreenEl.removeEventListener('click', handleSplashActivate);
        splashScreenEl.removeEventListener('keydown', handleSplashKeydown);
        splashScreenEl.classList.remove('active');
        splashScreenEl.classList.add('fade-out');
        splashScreenEl.classList.remove('ready');
    }

    document.body.classList.remove('splash-active');

    const removeSplash = () => {
        if (splashScreenEl && splashScreenEl.parentNode) {
            splashScreenEl.parentNode.removeChild(splashScreenEl);
        }
        splashScreenEl = null;
        splashProgressBarEl = null;
        splashCTAEl = null;
        splashInnerEl = null;
    };

    setTimeout(removeSplash, Math.max(600, delay));
}

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
    initSplashScreen();

    setSplashCTA('過去の挑戦を分析中...');
    loadUserData();
    advanceSplashProgress();

    setSplashCTA('プレイヤーデータを同期中...');
    loadPlayerData();
    advanceSplashProgress();

    setSplashCTA('連続学習ボーナスを計算中...');
    loadStreakData();
    advanceSplashProgress();

    setSplashCTA('実績をチェックしています...');
    loadAchievements();
    advanceSplashProgress();

    setSplashCTA('ショップを準備中...');
    loadShopData();
    advanceSplashProgress();

    setSplashCTA('設定を復元しています...');
    loadSettings();
    advanceSplashProgress();

    setSplashCTA('問題データを読み込み中...');
    await loadQuestions();  // 問題データを読み込む
    advanceSplashProgress();

    setSplashCTA('ミニゲームを準備中...');
    initMinigame();
    advanceSplashProgress();

    updateTitle();  // 称号を更新
    updateTopScreenDashboard();
    showScreen('top-screen');
    markSplashReady();
});

// JSONファイルから問題データを読み込む
async function loadQuestions() {
    try {
        // キャッシュバスティング用のタイムスタンプを生成
        const cacheBuster = new Date().getTime();
        
        // index.jsonを読み込んで、問題ファイルのリストを取得
        // キャッシュを無効化するためにタイムスタンプとno-cacheオプションを使用
        const indexResponse = await fetch(`questions/index.json?t=${cacheBuster}`, {
            cache: 'no-cache'
        });
        const index = await indexResponse.json();
        
        // 各JSONファイルを読み込む
        const promises = index.files.map(async (filename) => {
            const response = await fetch(`questions/${filename}?t=${cacheBuster}`, {
                cache: 'no-cache'
            });
            return await response.json();
        });
        
        const questionFiles = await Promise.all(promises);
        
        // QUESTION_DATABASEを構築
        questionFiles.forEach(file => {
            const { subject, subjectName, unitId, unitName, category, questions } = file;
            
            // 科目がまだ存在しない場合は初期化
            if (!QUESTION_DATABASE[subject]) {
                QUESTION_DATABASE[subject] = {
                    name: subjectName,
                    units: {}
                };
            }
            
            // 単元を追加
            QUESTION_DATABASE[subject].units[unitId] = {
                name: unitName,
                category: category,
                questions: questions
            };
        });
        
        console.log('問題データの読み込みが完了しました:', QUESTION_DATABASE);
    } catch (error) {
        console.error('問題データの読み込みに失敗しました:', error);
        alert('問題データの読み込みに失敗しました。ページを再読み込みしてください。');
    }
}

// ローカルストレージからデータ読み込み
function loadUserData() {
    const saved = localStorage.getItem('unchiDrill_answerHistory');
    if (saved) {
        userAnswerHistory = JSON.parse(saved);
    }
}

function saveUserData() {
    localStorage.setItem('unchiDrill_answerHistory', JSON.stringify(userAnswerHistory));
}

function loadSettings() {
    const saved = localStorage.getItem('unchiDrill_settings');
    if (saved) {
        settings = JSON.parse(saved);
        document.getElementById('bgm-toggle').checked = settings.bgm;
        document.getElementById('sfx-toggle').checked = settings.sfx;
        document.getElementById('explicit-toggle').checked = settings.explicitContent !== false;
    }
}

function saveSettings() {
    localStorage.setItem('unchiDrill_settings', JSON.stringify(settings));
}

// 新機能: プレイヤーデータの読み込み・保存
function loadPlayerData() {
    const saved = localStorage.getItem('unchiDrill_playerData');
    if (saved) {
        const data = JSON.parse(saved);
        playerData = { ...playerData, ...data };
        // データ読み込み後、称号を更新
        updateTitle();
    }
}

function savePlayerData() {
    localStorage.setItem('unchiDrill_playerData', JSON.stringify(playerData));
}

// 新機能: ストリークデータの読み込み・保存
function loadStreakData() {
    const saved = localStorage.getItem('unchiDrill_streakData');
    if (saved) {
        const data = JSON.parse(saved);
        streakData = { ...streakData, ...data };
    }
    // ストリークの更新チェック
    updateStreak();
}

function saveStreakData() {
    localStorage.setItem('unchiDrill_streakData', JSON.stringify(streakData));
}

// 新機能: ストリークの更新
function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = streakData.lastStudyDate;
    
    if (!lastDate) {
        // 初回学習
        streakData.currentStreak = 0;
    } else if (lastDate === today) {
        // 今日既に学習済み
        // ストリークは維持
    } else {
        const lastDateObj = new Date(lastDate);
        const todayObj = new Date(today);
        const diffDays = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            // 連続学習継続
            streakData.currentStreak++;
        } else if (diffDays > 1) {
            // ストリーク途切れ
            if (streakData.currentStreak > streakData.longestStreak) {
                streakData.longestStreak = streakData.currentStreak;
            }
            streakData.currentStreak = 0;
        }
    }
    saveStreakData();
    // ストリークが変わったので称号を更新
    updateTitle();
}

// 新機能: 学習記録時にストリークを更新
function updateStreakOnStudy() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = streakData.lastStudyDate;
    
    if (lastDate !== today) {
        const oldStreak = streakData.currentStreak;
        updateStreak();
        streakData.lastStudyDate = today;
        saveStreakData();
        // ストリークが増えた場合は称号を更新（updateStreak内でも呼ばれるが念のため）
        if (streakData.currentStreak > oldStreak) {
            updateTitle();
        }
    }
}

// 新機能: アチーブメントデータの読み込み・保存
function loadAchievements() {
    const saved = localStorage.getItem('unchiDrill_achievements');
    if (saved) {
        const data = JSON.parse(saved);
        achievements = { ...achievements, ...data };
    }
}

function saveAchievements() {
    localStorage.setItem('unchiDrill_achievements', JSON.stringify(achievements));
}

// 新機能: ショップデータの読み込み・保存
function loadShopData() {
    const saved = localStorage.getItem('unchiDrill_shopData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            shopData = normalizeShopData({ ...shopData, ...data });
        } catch (error) {
            console.warn('ショップデータの読み込みに失敗しました。初期値を使用します:', error);
            shopData = normalizeShopData(shopData);
        }
    } else {
        shopData = normalizeShopData(shopData);
    }
    applyShopCustomizations();
}

function saveShopData() {
    shopData = normalizeShopData(shopData);
    localStorage.setItem('unchiDrill_shopData', JSON.stringify(shopData));
}

function normalizeShopData(rawData = {}) {
    const catalog = typeof SHOP_ITEMS !== 'undefined' ? SHOP_ITEMS : {};
    const purchased = Array.isArray(rawData.purchased)
        ? Array.from(new Set(rawData.purchased.filter(id => catalog[id])))
        : [];
    const activeData = rawData.active && typeof rawData.active === 'object' ? rawData.active : {};

    const normalizeActiveId = (id, category) => {
        if (!id) return null;
        const item = catalog[id];
        return item && item.category === category && purchased.includes(id) ? id : null;
    };

    const effects = Array.isArray(activeData.effects)
        ? Array.from(
            new Set(
                activeData.effects.filter(
                    id => catalog[id] && catalog[id].category === 'effect' && purchased.includes(id)
                )
            )
        )
        : [];

    const boostsData = rawData.boosts && typeof rawData.boosts === 'object' ? rawData.boosts : {};
    const titles = Array.isArray(rawData.titles)
        ? Array.from(new Set(rawData.titles.filter(id => catalog[id] && catalog[id].category === 'title')))
        : [];
    
    return {
        purchased,
        active: {
            racer: normalizeActiveId(activeData.racer, 'racer'),
            background: normalizeActiveId(activeData.background, 'background'),
            effects
        },
        boosts: {
            exp: boostsData.exp && typeof boostsData.exp === 'object' && boostsData.exp.expiresAt ? boostsData.exp : null,
            up: boostsData.up && typeof boostsData.up === 'object' && boostsData.up.expiresAt ? boostsData.up : null,
            all: boostsData.all && typeof boostsData.all === 'object' && boostsData.all.expiresAt ? boostsData.all : null
        },
        titles
    };
}

// 新機能: レベル計算関数
function getExpForLevel(level) {
    // レベル1→2: 100, レベル2→3: 150, レベル3→4: 200... というように増加
    return 100 + (level - 1) * 50;
}

// 新機能: レベルアップチェック
function checkLevelUp() {
    const expNeeded = getExpForLevel(playerData.level);
    if (playerData.exp >= expNeeded) {
        playerData.level++;
        playerData.exp -= expNeeded;
        updateTitle();
        return true;
    }
    return false;
}

// 新機能: 称号の更新
function updateTitle() {
    // 特別称号を優先チェック（より特別な称号を優先）
    if (playerData.bestConsecutiveCorrect >= 30 && !achievements.unlocked.includes('consecutive-30')) {
        playerData.title = '完璧主義者✨';
        return;  // 特別称号が優先
    }
    if (streakData.currentStreak >= 7 && !achievements.unlocked.includes('streak-7')) {
        playerData.title = '連続学習マスター🔥';
        return;  // 特別称号が優先
    }
    
    // レベルベースの称号
    if (playerData.level >= 51) {
        playerData.title = 'うんちゴッド💫';
    } else if (playerData.level >= 31) {
        playerData.title = 'うんちキング👑';
    } else if (playerData.level >= 11) {
        playerData.title = 'うんちマスター🚽';
    } else {
        playerData.title = 'うんち初心者💩';
    }
}

// 新機能: ストリークボーナス計算
function getStreakBonus() {
    const streak = streakData.currentStreak;
    let expBonus = 0;
    let upBonus = 0;
    
    if (streak >= 30) {
        expBonus = 2.0;  // +200%
        upBonus = 1.0;   // +100%
    } else if (streak >= 14) {
        expBonus = 1.0;  // +100%
        upBonus = 0.5;   // +50%
    } else if (streak >= 7) {
        expBonus = 0.5;  // +50%
        upBonus = 0.25;  // +25%
    } else if (streak >= 3) {
        expBonus = 0.2;  // +20%
        upBonus = 0.1;   // +10%
    }
    
    return { expBonus, upBonus };
}

// 新機能: アチーブメント定義
const ACHIEVEMENTS = {
    'first-question': {
        name: '初めての問題',
        description: '初めて問題を解く',
        check: () => playerData.totalQuestions >= 1
    },
    '100-questions': {
        name: '100問クリア',
        description: '累計100問解く',
        check: () => playerData.totalQuestions >= 100
    },
    '500-questions': {
        name: '500問クリア',
        description: '累計500問解く',
        check: () => playerData.totalQuestions >= 500
    },
    '1000-questions': {
        name: '1000問クリア',
        description: '累計1000問解く',
        check: () => playerData.totalQuestions >= 1000
    },
    'consecutive-3': {
        name: '3連続正解',
        description: '3問連続正解する',
        check: () => playerData.consecutiveCorrect >= 3
    },
    'consecutive-10': {
        name: '10連続正解',
        description: '10問連続正解する',
        check: () => playerData.consecutiveCorrect >= 10
    },
    'consecutive-30': {
        name: '30連続正解',
        description: '30問連続正解する',
        check: () => playerData.consecutiveCorrect >= 30
    },
    'streak-3': {
        name: '3日連続学習',
        description: '3日連続で学習する',
        check: () => streakData.currentStreak >= 3
    },
    'streak-7': {
        name: '7日連続学習',
        description: '7日連続で学習する',
        check: () => streakData.currentStreak >= 7
    },
    'streak-30': {
        name: '30日連続学習',
        description: '30日連続で学習する',
        check: () => streakData.currentStreak >= 30
    },
    'level-10': {
        name: 'レベル10達成',
        description: 'レベル10に到達する',
        check: () => playerData.level >= 10
    },
    'level-30': {
        name: 'レベル30達成',
        description: 'レベル30に到達する',
        check: () => playerData.level >= 30
    },
    'level-50': {
        name: 'レベル50達成',
        description: 'レベル50に到達する',
        check: () => playerData.level >= 50
    }
};

// 新機能: アチーブメントチェック
function checkAchievements() {
    Object.keys(ACHIEVEMENTS).forEach(achievementId => {
        if (!achievements.unlocked.includes(achievementId)) {
            const achievement = ACHIEVEMENTS[achievementId];
            if (achievement.check()) {
                unlockAchievement(achievementId);
            }
        }
    });
}

// 新機能: アチーブメント解除
function unlockAchievement(achievementId) {
    if (achievements.unlocked.includes(achievementId)) {
        return;  // 既に獲得済み
    }
    
    achievements.unlocked.push(achievementId);
    saveAchievements();
    
    const achievement = ACHIEVEMENTS[achievementId];
    
    // 報酬付与
    const reward = getAchievementReward(achievementId);
    playerData.exp += reward.exp;
    playerData.upPoints += reward.up;
    
    // レベルアップチェック
    const leveledUp = checkLevelUp();
    if (leveledUp) {
        showLevelUpModal();
    }
    
    // 称号を更新（アチーブメント獲得で称号が変わる可能性があるため）
    updateTitle();
    
    savePlayerData();
    
    // アチーブメント獲得通知
    showAchievementNotification(achievement, reward);
}

// 新機能: アチーブメント報酬
function getAchievementReward(achievementId) {
    const rewards = {
        'first-question': { exp: 10, up: 10 },
        '100-questions': { exp: 50, up: 50 },
        '500-questions': { exp: 200, up: 200 },
        '1000-questions': { exp: 500, up: 500 },
        'consecutive-3': { exp: 20, up: 20 },
        'consecutive-10': { exp: 50, up: 50 },
        'consecutive-30': { exp: 200, up: 200 },
        'streak-3': { exp: 30, up: 30 },
        'streak-7': { exp: 100, up: 100 },
        'streak-30': { exp: 500, up: 500 },
        'level-10': { exp: 100, up: 100 },
        'level-30': { exp: 300, up: 300 },
        'level-50': { exp: 500, up: 500 }
    };
    
    return rewards[achievementId] || { exp: 0, up: 0 };
}

// 新機能: レベルアップモーダル表示
function showLevelUpModal() {
    const modal = document.getElementById('level-up-modal');
    if (!modal) {
        // モーダルが存在しない場合は作成
        createLevelUpModal();
    }
    
    const modalTitle = document.getElementById('level-up-title');
    const modalLevel = document.getElementById('level-up-level');
    const modalTitleText = document.getElementById('level-up-title-text');
    
    if (modalTitle) modalTitle.textContent = '🎉 レベルアップ！ 🎉';
    if (modalLevel) modalLevel.textContent = `レベル ${playerData.level}`;
    if (modalTitleText) modalTitleText.textContent = playerData.title;
    
    document.getElementById('level-up-modal').classList.add('active');
    
    // パーティクルエフェクト
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createParticles('correct', Math.random() * window.innerWidth, Math.random() * window.innerHeight / 2);
        }, i * 100);
    }
    
    // 効果音
    playSFX('finish');
}

// 新機能: レベルアップモーダル作成
function createLevelUpModal() {
    const modal = document.createElement('div');
    modal.id = 'level-up-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content level-up-content">
            <div class="modal-header">
                <h3 id="level-up-title">🎉 レベルアップ！ 🎉</h3>
            </div>
            <div class="modal-body">
                <div class="level-up-display">
                    <div class="level-up-number" id="level-up-level">レベル 1</div>
                    <div class="level-up-title" id="level-up-title-text">うんち初心者💩</div>
                </div>
            </div>
            <button class="modal-btn" onclick="closeLevelUpModal()">やったー！</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// 新機能: レベルアップモーダルを閉じる
function closeLevelUpModal() {
    document.getElementById('level-up-modal').classList.remove('active');
    // レベルアップ後もレベルアップの可能性があるので再チェック
    while (checkLevelUp()) {
        showLevelUpModal();
    }
    // ダッシュボードを更新（称号やレベルが変わった可能性があるため）
    updateTopScreenDashboard();
}

// 新機能: アチーブメント通知表示
function showAchievementNotification(achievement, reward) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-content">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-reward">報酬: EXP +${reward.exp} / U-P +${reward.up}</div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3秒後に削除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
    
    // パーティクルエフェクト
    createParticles('correct', window.innerWidth / 2, 100);
    playSFX('correct');
}

// 新機能: トップ画面ダッシュボード更新
function updateTopScreenDashboard() {
    // ダッシュボード要素が存在するかチェック
    let dashboard = document.getElementById('top-dashboard');
    if (!dashboard) {
        // ダッシュボードが存在しない場合は作成
        createTopScreenDashboard();
        dashboard = document.getElementById('top-dashboard');
    }
    
    // データ更新
    const levelEl = document.getElementById('dashboard-level');
    const expBar = document.getElementById('dashboard-exp-bar');
    const expText = document.getElementById('dashboard-exp-text');
    const upPoints = document.getElementById('dashboard-up-points');
    const streak = document.getElementById('dashboard-streak');
    const title = document.getElementById('dashboard-title');
    
    if (levelEl) levelEl.textContent = `レベル ${playerData.level}`;
    if (title) title.textContent = playerData.title;
    if (upPoints) upPoints.textContent = `${playerData.upPoints} U-P`;
    
    // EXPバー更新
    const expNeeded = getExpForLevel(playerData.level);
    const expPercent = (playerData.exp / expNeeded) * 100;
    if (expBar) {
        expBar.style.width = `${expPercent}%`;
    }
    if (expText) {
        expText.textContent = `${playerData.exp} / ${expNeeded} EXP`;
    }
    
    // ストリーク表示
    if (streak) {
        if (streakData.currentStreak > 0) {
            streak.innerHTML = `🔥 ${streakData.currentStreak}日連続学習`;
            streak.style.display = 'block';
        } else {
            streak.style.display = 'none';
        }
    }
}

// 新機能: トップ画面ダッシュボード作成
function createTopScreenDashboard() {
    const titleArea = document.querySelector('.title-area');
    if (!titleArea) return;
    
    const dashboard = document.createElement('div');
    dashboard.id = 'top-dashboard';
    dashboard.className = 'top-dashboard';
    dashboard.innerHTML = `
        <div class="dashboard-row">
            <div class="dashboard-item">
                <div class="dashboard-label">レベル</div>
                <div class="dashboard-value" id="dashboard-level">レベル 1</div>
            </div>
            <div class="dashboard-item">
                <div class="dashboard-label">称号</div>
                <div class="dashboard-value" id="dashboard-title">うんち初心者💩</div>
            </div>
            <div class="dashboard-item">
                <div class="dashboard-label">U-P</div>
                <div class="dashboard-value" id="dashboard-up-points">0 U-P</div>
            </div>
        </div>
        <div class="dashboard-exp-container">
            <div class="dashboard-exp-label">経験値</div>
            <div class="dashboard-exp-bar-container">
                <div class="dashboard-exp-bar" id="dashboard-exp-bar"></div>
            </div>
            <div class="dashboard-exp-text" id="dashboard-exp-text">0 / 100 EXP</div>
        </div>
        <div class="dashboard-streak" id="dashboard-streak" style="display: none;"></div>
    `;
    
    titleArea.insertAdjacentElement('afterend', dashboard);
}

// 画面遷移
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // ドリル設定画面に遷移する際は必ず科目選択から開始
    if (screenId === 'drill-setup-screen') {
        resetDrillSetup();
    }
    
    // トップ画面に戻った時にダッシュボードを更新
    if (screenId === 'top-screen') {
        updateTopScreenDashboard();
    }
    
    // アチーブメント画面の更新
    if (screenId === 'achievements-screen') {
        displayAchievements();
    }
    
    // ショップ画面の更新
    if (screenId === 'shop-screen') {
        displayShop();
        // ブーストの残り時間を定期的に更新
        if (shopUpdateInterval) {
            clearInterval(shopUpdateInterval);
        }
        shopUpdateInterval = setInterval(() => {
            if (currentScreen === 'shop-screen') {
                displayShop();
            } else {
                clearInterval(shopUpdateInterval);
                shopUpdateInterval = null;
            }
        }, 1000);  // 1秒ごとに更新
    } else {
        if (shopUpdateInterval) {
            clearInterval(shopUpdateInterval);
            shopUpdateInterval = null;
        }
    }
    
    // 設定画面に移動した時にミニゲームを停止
    if (screenId !== 'settings-screen' && minigameState.isRunning) {
        stopMinigame();
        resetMinigame();
    }
}

// ドリル設定をリセットして科目選択画面から開始
function resetDrillSetup() {
    // 選択状態をクリア
    selectedSubject = null;
    selectedUnits = [];
    questionCount = 10; // デフォルト値に戻す
    
    // すべての設定ステップを非表示にする
    document.querySelectorAll('.setup-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // 科目選択画面だけを表示
    document.getElementById('subject-selection').classList.add('active');
    
    // 科目ボタンの選択状態をクリア
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// ドリル設定 - 科目選択
function selectSubject(subject) {
    selectedSubject = subject;
    
    // 科目ボタンのスタイル更新
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.subject-btn').classList.add('selected');
    
    // 単元選択画面に移動
    setTimeout(() => {
        document.getElementById('subject-selection').classList.remove('active');
        document.getElementById('unit-selection').classList.add('active');
        
        // 科目名表示
        document.getElementById('selected-subject-name').textContent = QUESTION_DATABASE[subject].name;
        
        // 単元ツリーを生成
        generateUnitTree(subject);
    }, 300);
}

function generateUnitTree(subject) {
    const unitTree = document.getElementById('unit-tree');
    unitTree.innerHTML = '';
    
    const units = QUESTION_DATABASE[subject].units;
    const categories = {};
    
    // カテゴリごとにグループ化
    Object.keys(units).forEach(unitId => {
        const unit = units[unitId];
        if (!categories[unit.category]) {
            categories[unit.category] = [];
        }
        categories[unit.category].push({ id: unitId, name: unit.name });
    });
    
    // カテゴリごとに表示
    Object.keys(categories).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'unit-category';
        
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `<span class="expand-icon">▶</span> ${category}`;
        header.onclick = () => toggleCategory(categoryDiv);
        
        const items = document.createElement('div');
        items.className = 'unit-items';
        
        categories[category].forEach(unit => {
            const item = document.createElement('div');
            item.className = 'unit-item';
            item.innerHTML = `
                <input type="checkbox" id="unit-${unit.id}" value="${unit.id}" onchange="updateSelectedUnits()">
                <label for="unit-${unit.id}">${unit.name}</label>
            `;
            items.appendChild(item);
        });
        
        categoryDiv.appendChild(header);
        categoryDiv.appendChild(items);
        unitTree.appendChild(categoryDiv);
    });
}

function toggleCategory(categoryDiv) {
    const icon = categoryDiv.querySelector('.expand-icon');
    const items = categoryDiv.querySelector('.unit-items');
    
    if (items.classList.contains('expanded')) {
        items.classList.remove('expanded');
        icon.textContent = '▶';
    } else {
        items.classList.add('expanded');
        icon.textContent = '▼';
    }
}

function updateSelectedUnits() {
    selectedUnits = [];
    document.querySelectorAll('#unit-tree input[type="checkbox"]:checked').forEach(checkbox => {
        selectedUnits.push(checkbox.value);
    });
}

function showQuestionCountSelection() {
    if (selectedUnits.length === 0) {
        alert('単元を1つ以上選択してください！');
        return;
    }
    
    document.getElementById('unit-selection').classList.remove('active');
    document.getElementById('question-count-selection').classList.add('active');
}

function selectQuestionCount(count) {
    questionCount = count;
    
    // ボタンのスタイル更新
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

// ドリル開始
function startDrill() {
    if (!questionCount) {
        alert('問題数を選択してください！');
        return;
    }
    
    // 選択された単元から問題を取得
    currentQuestions = [];
    selectedUnits.forEach(unitId => {
        const questions = QUESTION_DATABASE[selectedSubject].units[unitId].questions;
        currentQuestions.push(...questions);
    });
    
    // 苦手問題優先アルゴリズムで問題を選択
    currentQuestions = selectQuestionsByWeakness(currentQuestions, questionCount);
    
    // 初期化
    currentQuestionIndex = 0;
    correctAnswers = 0;
    startTime = Date.now();
    currentQuestionAnswered = false;  // 回答済みフラグをリセット
    
    // クイズ画面へ
    showScreen('quiz-screen');
    displayQuestion();
}

// 苦手問題優先出題アルゴリズム
function selectQuestionsByWeakness(questions, count) {
    // 実際の問題数が要求数より少ない場合は全問出題
    if (count === -1 || count >= questions.length) {
        return shuffleArray([...questions]);
    }
    
    // 各問題の優先度スコアを計算
    const scoredQuestions = questions.map(q => {
        const history = userAnswerHistory[q.id] || { attempts: 0, correct: 0 };
        const correctRate = history.attempts > 0 ? history.correct / history.attempts : 0;
        const priorityScore = (1 - correctRate) * 10;
        
        return {
            question: q,
            score: priorityScore
        };
    });
    
    // 重み付けランダム抽選
    const selected = [];
    const pool = [...scoredQuestions];
    
    for (let i = 0; i < count && pool.length > 0; i++) {
        const totalScore = pool.reduce((sum, item) => sum + Math.max(item.score, 1), 0);
        let random = Math.random() * totalScore;
        
        for (let j = 0; j < pool.length; j++) {
            random -= Math.max(pool[j].score, 1);
            if (random <= 0) {
                selected.push(pool[j].question);
                pool.splice(j, 1);
                break;
            }
        }
    }
    
    return selected;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 選択肢をシャッフルし、ランダムでうんちネタに置き換える
function shuffleChoicesWithPoopJoke(choices, correctAnswerIndex) {
    // 選択肢とインデックスのペアを作成
    const choicesWithIndex = choices.map((choice, index) => ({
        text: choice,
        isCorrect: index === correctAnswerIndex
    }));
    
    // 設定で下ネタが有効な場合のみ置き換え（確率50%）
    const shouldAddPoopJoke = settings.explicitContent && Math.random() < 0.5;
    
    if (shouldAddPoopJoke) {
        // 不正解の選択肢のインデックスを取得
        const wrongIndices = [];
        choicesWithIndex.forEach((item, index) => {
            if (!item.isCorrect) {
                wrongIndices.push(index);
            }
        });
        
        // ランダムに不正解の選択肢を1つ選んでうんちネタに置き換え
        if (wrongIndices.length > 0) {
            const targetIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
            const randomPoopJoke = POOP_JOKES[Math.floor(Math.random() * POOP_JOKES.length)];
            choicesWithIndex[targetIndex].text = randomPoopJoke;
        }
    }
    
    // シャッフル
    for (let i = choicesWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choicesWithIndex[i], choicesWithIndex[j]] = [choicesWithIndex[j], choicesWithIndex[i]];
    }
    
    // 正解のインデックスを見つける
    let newCorrectIndex = -1;
    const shuffledChoices = choicesWithIndex.map((item, index) => {
        if (item.isCorrect) {
            newCorrectIndex = index;
        }
        return item.text;
    });
    
    return {
        choices: shuffledChoices,
        correctIndex: newCorrectIndex
    };
}

// 問題表示
function displayQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showResult();
        return;
    }
    
    // 新しい問題を表示する際に回答済みフラグをリセット
    currentQuestionAnswered = false;
    
    const question = currentQuestions[currentQuestionIndex];
    const unitInfo = findUnitInfo(question.id);
    
    // 進捗バー更新
    const progress = (currentQuestionIndex / currentQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('racer-position').style.left = `${progress}%`;
    
    // 問題番号更新
    document.getElementById('current-question-num').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = currentQuestions.length;
    
    // 問題情報表示
    document.getElementById('question-subject').textContent = QUESTION_DATABASE[selectedSubject].name;
    document.getElementById('question-unit').textContent = unitInfo ? unitInfo.name : '';
    document.getElementById('question-text').textContent = question.question;
    
    // 解答エリア生成
    generateAnswerArea(question);
}

function findUnitInfo(questionId) {
    const units = QUESTION_DATABASE[selectedSubject].units;
    for (let unitId in units) {
        const questions = units[unitId].questions;
        if (questions.some(q => q.id === questionId)) {
            return units[unitId];
        }
    }
    return null;
}

function generateAnswerArea(question) {
    const answerArea = document.getElementById('answer-area');
    answerArea.innerHTML = '';
    
    if (question.type === 'multiple') {
        // 4択問題
        // 選択肢をシャッフルし、ランダムでうんちネタに置き換え
        const shuffledChoices = shuffleChoicesWithPoopJoke(question.choices, question.answer);
        
        shuffledChoices.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = choice;
            btn.onclick = () => checkAnswer(index, shuffledChoices.correctIndex);
            answerArea.appendChild(btn);
        });
    } else if (question.type === 'input') {
        // 入力問題
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-answer';
        input.placeholder = '解答を入力してください';
        input.id = 'answer-input';
        
        const btn = document.createElement('button');
        btn.className = 'submit-btn';
        btn.textContent = '解答する';
        btn.onclick = () => checkInputAnswer();
        
        answerArea.appendChild(input);
        answerArea.appendChild(btn);
        
        // Enterキーで送信
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkInputAnswer();
            }
        });
    }
}

function checkAnswer(selectedIndex, correctIndex) {
    // 既に回答済みの場合は処理をスキップ
    if (currentQuestionAnswered) {
        return;
    }
    
    // 回答済みフラグを設定（重複回答を防ぐ）
    currentQuestionAnswered = true;
    
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === correctIndex;
    
    // ボタンのスタイル更新
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // 効果音とパーティクル
    playSFX(isCorrect ? 'correct' : 'wrong');
    
    // パーティクルエフェクト
    const buttonRect = buttons[selectedIndex].getBoundingClientRect();
    createParticles(isCorrect ? 'correct' : 'wrong', buttonRect.left + buttonRect.width / 2, buttonRect.top + buttonRect.height / 2);
    
    // 解答履歴を保存
    recordAnswer(question.id, isCorrect);
    
    if (isCorrect) {
        correctAnswers++;
        // 画面を揺らす
        document.querySelector('.container').style.animation = 'shake-celebration 0.5s ease';
        setTimeout(() => {
            document.querySelector('.container').style.animation = '';
            currentQuestionIndex++;
            displayQuestion();
        }, 1000);
    } else {
        // 不正解の場合は解説を表示
        setTimeout(() => {
            showExplanation(question, false);
        }, 1000);
    }
}

function checkInputAnswer() {
    // 既に回答済みの場合は処理をスキップ
    if (currentQuestionAnswered) {
        return;
    }
    
    // 回答済みフラグを設定（重複回答を防ぐ）
    currentQuestionAnswered = true;
    
    const question = currentQuestions[currentQuestionIndex];
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim();
    const correctAnswer = question.answer.toString().trim();
    
    const isCorrect = userAnswer === correctAnswer;
    
    // 入力フィールドとボタンを無効化
    input.disabled = true;
    const submitBtn = input.nextElementSibling;
    if (submitBtn && submitBtn.classList.contains('submit-btn')) {
        submitBtn.disabled = true;
    }
    
    // 効果音とパーティクル
    playSFX(isCorrect ? 'correct' : 'wrong');
    
    // パーティクルエフェクト
    const inputRect = input.getBoundingClientRect();
    createParticles(isCorrect ? 'correct' : 'wrong', inputRect.left + inputRect.width / 2, inputRect.top);
    
    // 解答履歴を保存
    recordAnswer(question.id, isCorrect);
    
    if (isCorrect) {
        correctAnswers++;
        input.style.borderColor = '#4CAF50';
        input.style.animation = 'glow-success 0.5s ease';
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1000);
    } else {
        input.style.borderColor = '#f44336';
        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            showExplanation(question, false);
        }, 1000);
    }
}

function recordAnswer(questionId, isCorrect) {
    if (!userAnswerHistory[questionId]) {
        userAnswerHistory[questionId] = { attempts: 0, correct: 0 };
    }
    
    userAnswerHistory[questionId].attempts++;
    if (isCorrect) {
        userAnswerHistory[questionId].correct++;
    }
    
    saveUserData();
    
    // 学習記録も保存（日付ごと）
    const today = new Date().toISOString().split('T')[0];
    let dailyRecords = JSON.parse(localStorage.getItem('unchiDrill_dailyRecords') || '{}');
    
    if (!dailyRecords[today]) {
        dailyRecords[today] = { total: 0, correct: 0, subjects: {} };
    }
    
    dailyRecords[today].total++;
    if (isCorrect) {
        dailyRecords[today].correct++;
    }
    
    // 科目別の記録
    if (!dailyRecords[today].subjects[selectedSubject]) {
        dailyRecords[today].subjects[selectedSubject] = { total: 0, correct: 0 };
    }
    dailyRecords[today].subjects[selectedSubject].total++;
    if (isCorrect) {
        dailyRecords[today].subjects[selectedSubject].correct++;
    }
    
    localStorage.setItem('unchiDrill_dailyRecords', JSON.stringify(dailyRecords));
    
    // 新機能: プレイヤーデータの更新
    playerData.totalQuestions++;
    if (isCorrect) {
        playerData.totalCorrect++;
        playerData.consecutiveCorrect++;
        if (playerData.consecutiveCorrect > playerData.bestConsecutiveCorrect) {
            playerData.bestConsecutiveCorrect = playerData.consecutiveCorrect;
        }
        
        // EXP獲得（基本10 + 連続ボーナス）
        let expGained = 10;
        let upGained = 10;
        
        if (playerData.consecutiveCorrect >= 3) expGained += 5;
        if (playerData.consecutiveCorrect >= 5) expGained += 5;
        if (playerData.consecutiveCorrect >= 10) expGained += 10;
        
        // ストリークボーナス
        const streakBonus = getStreakBonus();
        expGained = Math.floor(expGained * (1 + streakBonus.expBonus));
        upGained = Math.floor(upGained * (1 + streakBonus.upBonus));
        
        // ブースト適用
        const boostMultiplier = getBoostMultiplier();
        if (boostMultiplier.exp > 1) {
            expGained = Math.floor(expGained * boostMultiplier.exp);
        }
        if (boostMultiplier.up > 1) {
            upGained = Math.floor(upGained * boostMultiplier.up);
        }
        
        playerData.exp += expGained;
        playerData.upPoints += upGained;
        
        // レベルアップチェック
        const leveledUp = checkLevelUp();
        if (leveledUp) {
            showLevelUpModal();
        }
    } else {
        playerData.consecutiveCorrect = 0;
    }
    
    // 称号を更新（連続正解数やストリークが変わった可能性があるため）
    updateTitle();
    
    savePlayerData();
    
    // ストリーク更新
    updateStreakOnStudy();
    
    // アチーブメントチェック
    checkAchievements();
}

function showExplanation(question, isCorrect) {
    const modal = document.getElementById('explanation-modal');
    const title = document.getElementById('modal-title');
    const text = document.getElementById('explanation-text');
    
    title.textContent = isCorrect ? '🎉 正解！ スッキリ！' : '😅 不正解... ウッ！';
    text.textContent = question.explanation;
    
    modal.classList.add('active');
}

function closeExplanationModal() {
    document.getElementById('explanation-modal').classList.remove('active');
    currentQuestionIndex++;
    displayQuestion();
}

// リザルト表示
function showResult() {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    
    const correctRate = Math.round((correctAnswers / currentQuestions.length) * 100);
    
    // 今回のセッションで獲得したEXPとU-Pを計算
    const sessionExp = correctAnswers * 10; // 簡易計算（実際はrecordAnswerで既に加算済み）
    const sessionUP = correctAnswers * 10; // 簡易計算
    
    document.getElementById('result-correct').textContent = `${correctAnswers} / ${currentQuestions.length}`;
    document.getElementById('result-rate').textContent = `${correctRate}%`;
    document.getElementById('result-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // U-P表示を更新（既存の要素があれば）
    const resultUP = document.getElementById('result-up');
    if (resultUP) {
        resultUP.textContent = playerData.upPoints;
    }
    
    // 新機能: EXP表示を追加
    const resultExp = document.getElementById('result-exp');
    if (resultExp) {
        const expNeeded = getExpForLevel(playerData.level);
        resultExp.textContent = `${playerData.exp} / ${expNeeded} EXP`;
    }
    
    showScreen('result-screen');
    
    // 効果音とお祝いパーティクル
    playSFX('finish');
    
    // 画面全体にパーティクルを発生
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createParticles('correct', Math.random() * window.innerWidth, Math.random() * window.innerHeight / 2);
        }, i * 200);
    }
    
    // ダッシュボードを更新
    updateTopScreenDashboard();
}

// 成績グラフ画面
function showStatsTab(tabName) {
    // タブボタンの更新
    document.querySelectorAll('.stats-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // タブコンテンツの更新
    document.querySelectorAll('.stats-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // データの読み込みと表示
    if (tabName === 'calendar') {
        displayCalendar();
    } else if (tabName === 'graph') {
        displayGraph('daily');
    } else if (tabName === 'units') {
        displayUnitStats();
    }
}

function displayCalendar() {
    const calendar = document.getElementById('calendar');
    const dailyRecords = JSON.parse(localStorage.getItem('unchiDrill_dailyRecords') || '{}');
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    let html = `<h3>${year}年 ${month + 1}月</h3>`;
    html += '<div class="calendar-grid">';
    
    // 曜日ヘッダー
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    weekdays.forEach(day => {
        html += `<div class="calendar-day" style="font-weight:bold;">${day}</div>`;
    });
    
    // 月初めの空白
    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day"></div>';
    }
    
    // 日付
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasData = dailyRecords[dateStr] ? 'has-data' : '';
        html += `<div class="calendar-day ${hasData}" onclick="showDayDetail('${dateStr}')">${day}</div>`;
    }
    
    html += '</div>';
    calendar.innerHTML = html;
}

function showDayDetail(dateStr) {
    const dailyRecords = JSON.parse(localStorage.getItem('unchiDrill_dailyRecords') || '{}');
    const detail = document.getElementById('calendar-detail');
    
    if (dailyRecords[dateStr]) {
        const record = dailyRecords[dateStr];
        const rate = Math.round((record.correct / record.total) * 100);
        
        let html = `<h4>${dateStr} の学習記録</h4>`;
        html += `<p>解いた問題数: ${record.total}問</p>`;
        html += `<p>正答数: ${record.correct}問</p>`;
        html += `<p>正答率: ${rate}%</p>`;
        
        detail.innerHTML = html;
    } else {
        detail.innerHTML = '<p>この日の学習記録はありません。</p>';
    }
}

function selectGraphPeriod(period) {
    // ボタンの更新
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayGraph(period);
}

function displayGraph(period) {
    const canvas = document.getElementById('stats-chart');
    const ctx = canvas.getContext('2d');
    
    // キャンバスのサイズを設定
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const dailyRecords = JSON.parse(localStorage.getItem('unchiDrill_dailyRecords') || '{}');
    
    // データの準備（簡易版）
    const dates = Object.keys(dailyRecords).sort().slice(-7); // 最新7日分
    const totals = dates.map(date => dailyRecords[date].total);
    const corrects = dates.map(date => dailyRecords[date].correct);
    
    if (dates.length === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('まだ学習記録がありません', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // 簡易的な棒グラフを描画
    const barWidth = canvas.width / dates.length / 2.5;
    const maxValue = Math.max(...totals, 10);
    const scale = (canvas.height - 50) / maxValue;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    dates.forEach((date, i) => {
        const x = (i + 0.5) * (canvas.width / dates.length);
        const totalHeight = totals[i] * scale;
        const correctHeight = corrects[i] * scale;
        
        // 全体の棒（グレー）
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x - barWidth / 2, canvas.height - 30 - totalHeight, barWidth, totalHeight);
        
        // 正答の棒（茶色）
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - barWidth / 2, canvas.height - 30 - correctHeight, barWidth, correctHeight);
        
        // 日付ラベル
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(date.substring(5), x, canvas.height - 10);
        
        // 数値ラベル
        ctx.fillText(corrects[i], x, canvas.height - 35 - correctHeight);
    });
    
    // 凡例
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(10, 10, 20, 20);
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('正答数', 35, 25);
    
    ctx.fillStyle = '#ddd';
    ctx.fillRect(120, 10, 20, 20);
    ctx.fillStyle = '#333';
    ctx.fillText('全問題数', 145, 25);
}

function displayUnitStats() {
    const unitList = document.getElementById('unit-list');
    unitList.innerHTML = '<h3>単元別正答率</h3>';
    
    // 各科目・単元ごとの正答率を計算
    const unitStats = {};
    
    Object.keys(QUESTION_DATABASE).forEach(subjectId => {
        const subject = QUESTION_DATABASE[subjectId];
        Object.keys(subject.units).forEach(unitId => {
            const unit = subject.units[unitId];
            let total = 0;
            let correct = 0;
            
            unit.questions.forEach(q => {
                if (userAnswerHistory[q.id]) {
                    total += userAnswerHistory[q.id].attempts;
                    correct += userAnswerHistory[q.id].correct;
                }
            });
            
            if (total > 0) {
                unitStats[`${subject.name} - ${unit.name}`] = {
                    total,
                    correct,
                    rate: Math.round((correct / total) * 100)
                };
            }
        });
    });
    
    // 表示
    Object.keys(unitStats).forEach(unitName => {
        const stat = unitStats[unitName];
        const div = document.createElement('div');
        div.className = 'unit-stat-item';
        div.innerHTML = `
            <span class="unit-stat-name">${unitName}</span>
            <span class="unit-stat-rate">${stat.rate}%</span>
        `;
        unitList.appendChild(div);
    });
    
    if (Object.keys(unitStats).length === 0) {
        unitList.innerHTML += '<p style="text-align:center;color:#666;">まだ学習記録がありません</p>';
    }
}

// 設定
function toggleBGM() {
    settings.bgm = document.getElementById('bgm-toggle').checked;
    saveSettings();
}

function toggleSFX() {
    settings.sfx = document.getElementById('sfx-toggle').checked;
    saveSettings();
}

function toggleExplicitContent() {
    settings.explicitContent = document.getElementById('explicit-toggle').checked;
    saveSettings();
}

function confirmResetData() {
    showConfirmDialog(
        '確認',
        '全うんち記録（解いた数、正答数、正答率）をリセットしますか？\nこの操作は取り消せません。',
        resetAllData
    );
}

function resetAllData() {
    localStorage.removeItem('unchiDrill_answerHistory');
    localStorage.removeItem('unchiDrill_dailyRecords');
    localStorage.removeItem('unchiDrill_playerData');
    localStorage.removeItem('unchiDrill_streakData');
    localStorage.removeItem('unchiDrill_achievements');
    localStorage.removeItem('unchiDrill_shopData');
    userAnswerHistory = {};
    playerData = {
        level: 1,
        exp: 0,
        upPoints: 0,
        title: 'うんち初心者💩',
        totalQuestions: 0,
        totalCorrect: 0,
        consecutiveCorrect: 0,
        bestConsecutiveCorrect: 0
    };
    streakData = {
        currentStreak: 0,
        lastStudyDate: null,
        longestStreak: 0
    };
    achievements = {
        unlocked: [],
        progress: {}
    };
    shopData = {
        purchased: [],
        active: {
            racer: null,
            background: null,
            effects: []
        },
        boosts: {
            exp: null,
            up: null,
            all: null
        },
        titles: []
    };
    applyShopCustomizations();
    alert('学習記録をリセットしました！');
    closeConfirmDialog();
    updateTopScreenDashboard();
}

// 確認ダイアログ
let confirmCallback = null;

function showConfirmDialog(title, message, callback) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    confirmCallback = callback;
    document.getElementById('confirm-dialog').classList.add('active');
}

function closeConfirmDialog() {
    document.getElementById('confirm-dialog').classList.remove('active');
    confirmCallback = null;
}

function executeConfirmAction() {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmDialog();
}

// 効果音（Web Audio API を使った簡易実装）
function playSFX(type) {
    if (!settings.sfx) return;
    
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            throw new Error('AudioContext is not supported in this environment.');
        }

        const enhancedSound = isEffectActive('effect-sound');
        const sequence = getSFXSequence(type, { enhanced: enhancedSound });
        if (!sequence.length) {
            return;
        }

        const audioContext = new AudioContextClass();
        sequence.forEach(note => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = note.frequency;
            osc.type = note.type;
            const startTime = audioContext.currentTime + note.delay;
            gain.gain.setValueAtTime(note.gain, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
            osc.start(startTime);
            osc.stop(startTime + note.duration);
        });

        const totalDuration = sequence.reduce((max, note) => Math.max(max, note.delay + note.duration), 0) + 0.1;
        if (typeof audioContext.close === 'function') {
            setTimeout(() => {
                audioContext.close();
            }, totalDuration * 1000);
        }
    } catch (e) {
        console.log('効果音の再生に失敗しました:', e);
    }
}

function getSFXSequence(type, options = {}) {
    const enhanced = options.enhanced === true;
    if (type === 'correct') {
        const base = [800, 1000, 1200, 1600];
        const frequencies = enhanced ? base.concat([1900, 2100]) : base;
        return frequencies.map((freq, index) => ({
            frequency: freq,
            type: enhanced ? 'triangle' : 'sine',
            delay: index * (enhanced ? 0.06 : 0.08),
            duration: enhanced ? 0.5 : 0.4,
            gain: enhanced ? 0.4 : 0.3
        }));
    }
    if (type === 'wrong') {
        const base = [200, 180, 160];
        const frequencies = enhanced ? base.concat([140]) : base;
        return frequencies.map((freq, index) => ({
            frequency: freq,
            type: enhanced ? 'square' : 'sawtooth',
            delay: index * 0.1,
            duration: enhanced ? 0.35 : 0.3,
            gain: enhanced ? 0.3 : 0.25
        }));
    }
    if (type === 'finish') {
        const base = [523, 523, 659, 523, 784, 740];
        const frequencies = enhanced ? base.concat([880, 988]) : base;
        return frequencies.map((freq, index) => ({
            frequency: freq,
            type: enhanced ? 'sawtooth' : 'triangle',
            delay: index * (enhanced ? 0.12 : 0.15),
            duration: enhanced ? 0.5 : 0.4,
            gain: enhanced ? 0.45 : 0.35
        }));
    }
    return [];
}

// パーティクルエフェクト
function createParticles(type, x, y) {
    let particleContainer = document.getElementById('particle-container');
    if (!particleContainer) {
        particleContainer = document.createElement('div');
        particleContainer.id = 'particle-container';
        particleContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        document.body.appendChild(particleContainer);
    }
    
    const hasDoubleParticles = isEffectActive('effect-particles');
    const hasTripleParticles = isEffectActive('effect-triple-particles');
    const particleMultiplier = hasTripleParticles ? 3 : (hasDoubleParticles ? 2 : 1);
    const baseCount = type === 'correct' ? 30 : 15;
    const count = baseCount * particleMultiplier;
    const emojiPool = type === 'correct'
        ? (hasTripleParticles ? ['✨', '💫', '🌟', '⭐', '💎', '👑'] : (hasDoubleParticles ? ['✨', '💫', '🌟'] : ['✨']))
        : ['💩'];
    const colors = type === 'correct'
        ? (hasTripleParticles
            ? ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEFA', '#BA55D3', '#FF1493', '#00CED1', '#FF6347', '#9370DB']
            : (hasDoubleParticles
                ? ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEFA', '#BA55D3']
                : ['#FFD700', '#FFA500', '#FF69B4', '#00FF00']))
        : ['#8B4513', '#654321', '#A0522D'];
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = Math.random() > 0.5 ? emojiPool[Math.floor(Math.random() * emojiPool.length)] : '';
        particle.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 10}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${x || window.innerWidth / 2}px;
            top: ${y || window.innerHeight / 2}px;
            pointer-events: none;
        `;
        
        particleContainer.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / count;
        const velocity = Math.random() * 150 + 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 100;
        
        animateParticle(particle, vx, vy);
    }
}

function animateParticle(particle, vx, vy) {
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    let opacity = 1;
    const gravity = 300;
    const startTime = Date.now();
    
    function update() {
        const elapsed = (Date.now() - startTime) / 1000;
        x += vx * elapsed / 10;
        y += (vy + gravity * elapsed) * elapsed / 10;
        opacity -= elapsed / 15;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.opacity = Math.max(0, opacity);
        
        if (opacity > 0 && y < window.innerHeight + 100) {
            requestAnimationFrame(update);
        } else {
            particle.remove();
        }
    }
    
    update();
}

// 新機能: ショップアイテム定義
const SHOP_ITEMS = {
    'racer-gold': {
        name: '金色うんち💛',
        description: 'うんちレーサーを金色に変更',
        price: 500,
        category: 'racer',
        emoji: '💛'
    },
    'racer-rainbow': {
        name: '虹色うんち🌈',
        description: 'うんちレーサーを虹色に変更',
        price: 1000,
        category: 'racer',
        emoji: '🌈'
    },
    'racer-sparkle': {
        name: 'キラキラうんち✨',
        description: 'うんちレーサーをキラキラに変更',
        price: 1500,
        category: 'racer',
        emoji: '✨'
    },
    'racer-fire': {
        name: '炎うんち🔥',
        description: 'うんちレーサーを炎で包む',
        price: 2000,
        category: 'racer',
        emoji: '🔥'
    },
    'racer-space': {
        name: '宇宙うんち🚀',
        description: 'うんちレーサーを宇宙仕様に',
        price: 3000,
        category: 'racer',
        emoji: '🚀'
    },
    'racer-diamond': {
        name: 'ダイヤモンドうんち💎',
        description: 'うんちレーサーをダイヤモンド仕様に',
        price: 5000,
        category: 'racer',
        emoji: '💎'
    },
    'racer-timemachine': {
        name: 'タイムマシンうんち⏰',
        description: 'うんちレーサーをタイムマシン仕様に',
        price: 8000,
        category: 'racer',
        emoji: '⏰'
    },
    'racer-dragon': {
        name: 'ドラゴンうんち🐉',
        description: 'うんちレーサーをドラゴン仕様に',
        price: 10000,
        category: 'racer',
        emoji: '🐉'
    },
    'racer-god': {
        name: 'ゴッドうんち👑',
        description: 'うんちレーサーをゴッド仕様に',
        price: 15000,
        category: 'racer',
        emoji: '👑'
    },
    'bg-night': {
        name: 'トイレの夜',
        description: '背景を夜のトイレに変更',
        price: 800,
        category: 'background',
        emoji: '🌙'
    },
    'bg-gold': {
        name: '黄金のトイレ',
        description: '背景を黄金のトイレに変更',
        price: 1500,
        category: 'background',
        emoji: '🏆'
    },
    'bg-space': {
        name: '宇宙トイレ',
        description: '背景を宇宙に変更',
        price: 2500,
        category: 'background',
        emoji: '🌌'
    },
    'bg-fantasy': {
        name: '幻想的なトイレ🌠',
        description: '背景を幻想的なトイレに変更',
        price: 5000,
        category: 'background',
        emoji: '🌠'
    },
    'bg-diamond': {
        name: 'ダイヤモンドのトイレ💎',
        description: '背景をダイヤモンドのトイレに変更',
        price: 8000,
        category: 'background',
        emoji: '💎'
    },
    'bg-dragon': {
        name: 'ドラゴンのトイレ🐉',
        description: '背景をドラゴンのトイレに変更',
        price: 10000,
        category: 'background',
        emoji: '🐉'
    },
    'effect-particles': {
        name: '特大パーティクル',
        description: 'パーティクルが2倍になる',
        price: 1000,
        category: 'effect',
        emoji: '💫'
    },
    'effect-sound': {
        name: '音響強化',
        description: '効果音が豪華になる',
        price: 1200,
        category: 'effect',
        emoji: '🔊'
    },
    'effect-triple-particles': {
        name: '3倍パーティクル🌟',
        description: 'パーティクルが3倍になる',
        price: 5000,
        category: 'effect',
        emoji: '🌟'
    },
    'effect-rainbow': {
        name: 'レインボーエフェクト🌈',
        description: '画面全体にレインボーエフェクト',
        price: 6000,
        category: 'effect',
        emoji: '🌈'
    },
    'effect-gold': {
        name: 'ゴールドエフェクト✨',
        description: '画面全体にゴールドエフェクト',
        price: 7000,
        category: 'effect',
        emoji: '✨'
    },
    'effect-slowmo': {
        name: 'スローモーション効果⏸️',
        description: '正解時にスローモーション演出',
        price: 8000,
        category: 'effect',
        emoji: '⏸️'
    },
    'boost-exp': {
        name: 'EXP 2倍ブースト📈',
        description: '1時間、獲得EXPが2倍になる',
        price: 5000,
        category: 'boost',
        emoji: '📈',
        duration: 3600000  // 1時間（ミリ秒）
    },
    'boost-up': {
        name: 'U-P 2倍ブースト💰',
        description: '1時間、獲得U-Pが2倍になる',
        price: 5000,
        category: 'boost',
        emoji: '💰',
        duration: 3600000  // 1時間（ミリ秒）
    },
    'boost-all': {
        name: '全ブーストパック🎁',
        description: '1時間、EXPとU-Pが2倍になる',
        price: 15000,
        category: 'boost',
        emoji: '🎁',
        duration: 3600000  // 1時間（ミリ秒）
    },
    'title-master': {
        name: 'マスター称号🏅',
        description: '特別な称号「うんちマスター」を獲得',
        price: 10000,
        category: 'title',
        emoji: '🏅'
    },
    'title-legend': {
        name: 'レジェンド称号⭐',
        description: '特別な称号「うんちレジェンド」を獲得',
        price: 20000,
        category: 'title',
        emoji: '⭐'
    },
    'title-god': {
        name: 'ゴッド称号👑',
        description: '特別な称号「うんちゴッド」を獲得',
        price: 30000,
        category: 'title',
        emoji: '👑'
    }
};

const RACER_STYLES = {
    default: {
        className: 'racer-style-default',
        emoji: '💩',
        wheels: '🏎️',
        progressIcon: '💩🏎️'
    },
    'racer-gold': {
        className: 'racer-style-gold',
        emoji: '💩',
        wheels: '💛🚗',
        progressIcon: '💩✨'
    },
    'racer-rainbow': {
        className: 'racer-style-rainbow',
        emoji: '🌈💩',
        wheels: '🛞',
        progressIcon: '🌈💩'
    },
    'racer-sparkle': {
        className: 'racer-style-sparkle',
        emoji: '✨💩✨',
        wheels: '💠',
        progressIcon: '💩✨💫'
    },
    'racer-fire': {
        className: 'racer-style-fire',
        emoji: '🔥💩🔥',
        wheels: '🔥',
        progressIcon: '🔥💩'
    },
    'racer-space': {
        className: 'racer-style-space',
        emoji: '🚀💩',
        wheels: '🪐',
        progressIcon: '🚀💩'
    },
    'racer-diamond': {
        className: 'racer-style-diamond',
        emoji: '💎💩💎',
        wheels: '💠💠',
        progressIcon: '💎💩✨'
    },
    'racer-timemachine': {
        className: 'racer-style-timemachine',
        emoji: '⏰💩⏰',
        wheels: '🕐🕐',
        progressIcon: '⏰💩'
    },
    'racer-dragon': {
        className: 'racer-style-dragon',
        emoji: '🐉💩🐉',
        wheels: '🔥🔥',
        progressIcon: '🐉💩'
    },
    'racer-god': {
        className: 'racer-style-god',
        emoji: '👑💩👑',
        wheels: '✨✨',
        progressIcon: '👑💩👑'
    }
};

const RACER_STYLE_CLASSES = Array.from(
    new Set(Object.values(RACER_STYLES).map(style => style.className).filter(Boolean))
);

const BACKGROUND_STYLES = {
    default: { className: null },
    'bg-night': { className: 'shop-bg-night' },
    'bg-gold': { className: 'shop-bg-gold' },
    'bg-space': { className: 'shop-bg-space' },
    'bg-fantasy': { className: 'shop-bg-fantasy' },
    'bg-diamond': { className: 'shop-bg-diamond' },
    'bg-dragon': { className: 'shop-bg-dragon' }
};

const BACKGROUND_CLASSES = Array.from(
    new Set(Object.values(BACKGROUND_STYLES).map(style => style.className).filter(Boolean))
);

const EFFECT_CLASS_MAP = {
    'effect-particles': 'effect-particles-active',
    'effect-sound': 'effect-sound-active',
    'effect-triple-particles': 'effect-triple-particles-active',
    'effect-rainbow': 'effect-rainbow-active',
    'effect-gold': 'effect-gold-active',
    'effect-slowmo': 'effect-slowmo-active'
};

function applyShopCustomizations() {
    applyRacerCustomization();
    applyBackgroundCustomization();
    applyEffectCustomizations();
}

function applyRacerCustomization() {
    const racerId = shopData.active && shopData.active.racer;
    const style = (racerId && RACER_STYLES[racerId]) || RACER_STYLES.default;
    
    const topRacer = document.querySelector('.poop-racer');
    if (topRacer) {
        RACER_STYLE_CLASSES.forEach(cls => topRacer.classList.remove(cls));
        if (style.className) {
            topRacer.classList.add(style.className);
        }
        const emojiEl = topRacer.querySelector('.racer-emoji');
        if (emojiEl) {
            emojiEl.textContent = style.emoji;
        }
        const wheelsEl = topRacer.querySelector('.racer-wheels');
        if (wheelsEl) {
            wheelsEl.textContent = style.wheels;
        }
    }

    const progressRacer = document.getElementById('racer-position');
    if (progressRacer) {
        RACER_STYLE_CLASSES.forEach(cls => progressRacer.classList.remove(cls));
        if (style.className) {
            progressRacer.classList.add(style.className);
        }
        const iconEl = progressRacer.querySelector('.racer-icon');
        if (iconEl) {
            iconEl.textContent = style.progressIcon;
        }
    }
}

function applyBackgroundCustomization() {
    const backgroundId = shopData.active && shopData.active.background;
    const style = (backgroundId && BACKGROUND_STYLES[backgroundId]) || BACKGROUND_STYLES.default;
    const body = document.body;
    if (!body) return;
    BACKGROUND_CLASSES.forEach(cls => body.classList.remove(cls));
    if (style.className) {
        body.classList.add(style.className);
    }
}

function applyEffectCustomizations() {
    const body = document.body;
    if (!body) return;
    Object.values(EFFECT_CLASS_MAP).forEach(cls => body.classList.remove(cls));
    if (shopData.active && Array.isArray(shopData.active.effects)) {
        shopData.active.effects.forEach(effectId => {
            const className = EFFECT_CLASS_MAP[effectId];
            if (className) {
                body.classList.add(className);
            }
        });
    }
}

function isEffectActive(effectId) {
    return Boolean(
        shopData.active &&
        Array.isArray(shopData.active.effects) &&
        shopData.active.effects.includes(effectId)
    );
}

// 新機能: ブーストの有効期限チェック
function checkBoostExpiry() {
    const now = Date.now();
    if (shopData.boosts.exp && shopData.boosts.exp.expiresAt < now) {
        shopData.boosts.exp = null;
    }
    if (shopData.boosts.up && shopData.boosts.up.expiresAt < now) {
        shopData.boosts.up = null;
    }
    if (shopData.boosts.all && shopData.boosts.all.expiresAt < now) {
        shopData.boosts.all = null;
    }
    saveShopData();
}

// 新機能: ブースト倍率取得
function getBoostMultiplier() {
    checkBoostExpiry();
    const now = Date.now();
    let expMultiplier = 1;
    let upMultiplier = 1;
    
    // 全ブーストパック
    if (shopData.boosts.all && shopData.boosts.all.expiresAt > now) {
        expMultiplier = 2;
        upMultiplier = 2;
    } else {
        // 個別ブースト
        if (shopData.boosts.exp && shopData.boosts.exp.expiresAt > now) {
            expMultiplier = 2;
        }
        if (shopData.boosts.up && shopData.boosts.up.expiresAt > now) {
            upMultiplier = 2;
        }
    }
    
    return { exp: expMultiplier, up: upMultiplier };
}

// 新機能: ショップ画面表示
function displayShop() {
    const shopContainer = document.getElementById('shop-items');
    if (!shopContainer) return;
    
    shopContainer.innerHTML = '';
    
    // カテゴリごとに表示
    const categories = ['racer', 'background', 'effect', 'boost', 'title'];
    
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'shop-category';
        
        const categoryTitle = document.createElement('h3');
        let categoryName = '';
        if (category === 'racer') categoryName = 'うんちレーサー';
        else if (category === 'background') categoryName = '背景テーマ';
        else if (category === 'effect') categoryName = 'エフェクト';
        else if (category === 'boost') categoryName = 'ブースト';
        else if (category === 'title') categoryName = '称号';
        categoryTitle.textContent = categoryName;
        categoryDiv.appendChild(categoryTitle);
        
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'shop-items-grid';
        
        Object.keys(SHOP_ITEMS).forEach(itemId => {
            const item = SHOP_ITEMS[itemId];
            if (item.category !== category) return;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';
            if (shopData.purchased.includes(itemId)) {
                itemDiv.classList.add('purchased');
            }
            if (isItemActive(itemId)) {
                itemDiv.classList.add('active');
            }
            
            const isPurchased = shopData.purchased.includes(itemId);
            const isActive = isItemActive(itemId);
            
            // ブーストの残り時間表示
            let timeRemaining = '';
            if (category === 'boost' && isActive) {
                const boost = getActiveBoost(itemId);
                if (boost && boost.expiresAt) {
                    const remaining = Math.max(0, boost.expiresAt - Date.now());
                    const minutes = Math.floor(remaining / 60000);
                    const seconds = Math.floor((remaining % 60000) / 1000);
                    timeRemaining = `<div class="boost-time">残り時間: ${minutes}:${seconds.toString().padStart(2, '0')}</div>`;
                }
            }
            
            itemDiv.innerHTML = `
                <div class="shop-item-emoji">${item.emoji}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-description">${item.description}</div>
                <div class="shop-item-price">${isPurchased ? '購入済み' : `${item.price} U-P`}</div>
                ${timeRemaining}
                <button class="shop-item-btn ${isPurchased ? (isActive ? 'active-btn' : 'use-btn') : 'buy-btn'}" 
                        onclick="${isPurchased ? (isActive ? '' : `useShopItem('${itemId}')`) : `buyShopItem('${itemId}')`}">
                    ${isPurchased ? (isActive ? '使用中' : '使用する') : '購入する'}
                </button>
            `;
            
            itemsDiv.appendChild(itemDiv);
        });
        
        categoryDiv.appendChild(itemsDiv);
        shopContainer.appendChild(categoryDiv);
    });
    
    // U-P表示を更新
    const shopUP = document.getElementById('shop-up-points');
    if (shopUP) {
        shopUP.textContent = `${playerData.upPoints} U-P`;
    }
}

// 新機能: アイテムが使用中かチェック
function isItemActive(itemId) {
    const item = SHOP_ITEMS[itemId];
    if (!item) return false;
    
    if (item.category === 'racer') {
        return shopData.active.racer === itemId;
    } else if (item.category === 'background') {
        return shopData.active.background === itemId;
    } else if (item.category === 'effect') {
        return shopData.active.effects.includes(itemId);
    } else if (item.category === 'boost') {
        return getActiveBoost(itemId) !== null;
    } else if (item.category === 'title') {
        return shopData.titles.includes(itemId);
    }
    return false;
}

// 新機能: アクティブなブースト取得
function getActiveBoost(itemId) {
    checkBoostExpiry();
    const now = Date.now();
    if (itemId === 'boost-exp' && shopData.boosts.exp && shopData.boosts.exp.expiresAt > now) {
        return shopData.boosts.exp;
    }
    if (itemId === 'boost-up' && shopData.boosts.up && shopData.boosts.up.expiresAt > now) {
        return shopData.boosts.up;
    }
    if (itemId === 'boost-all' && shopData.boosts.all && shopData.boosts.all.expiresAt > now) {
        return shopData.boosts.all;
    }
    return null;
}

// 新機能: ショップアイテム購入
function buyShopItem(itemId) {
    const item = SHOP_ITEMS[itemId];
    if (!item) return;
    
    // ブーストは購入と同時に使用されるため、購入済みチェックをスキップ
    if (item.category !== 'boost' && shopData.purchased.includes(itemId)) {
        alert('既に購入済みです！');
        return;
    }
    
    if (playerData.upPoints < item.price) {
        alert(`U-Pが足りません！\n必要: ${item.price} U-P / 所持: ${playerData.upPoints} U-P`);
        return;
    }
    
    if (confirm(`${item.name}を${item.price} U-Pで購入しますか？`)) {
        playerData.upPoints -= item.price;
        
        // ブーストは購入と同時に使用
        if (item.category === 'boost') {
            useShopItem(itemId);
        } else {
            shopData.purchased.push(itemId);
        }
        
        // 称号は購入と同時に獲得
        if (item.category === 'title') {
            if (!shopData.titles.includes(itemId)) {
                shopData.titles.push(itemId);
            }
            applyTitle(itemId);
        }
        
        savePlayerData();
        saveShopData();
        displayShop();
        updateTopScreenDashboard();
        alert('購入しました！');
    }
}

// 新機能: ショップアイテム使用
function useShopItem(itemId) {
    const item = SHOP_ITEMS[itemId];
    if (!item) return;
    
    // ブーストは購入済みチェックをスキップ（購入と同時に使用されるため）
    if (item.category !== 'boost' && !shopData.purchased.includes(itemId)) {
        alert('このアイテムは購入していません！');
        return;
    }
    
    if (item.category === 'racer') {
        shopData.active.racer = itemId;
    } else if (item.category === 'background') {
        shopData.active.background = itemId;
    } else if (item.category === 'effect') {
        if (!shopData.active.effects.includes(itemId)) {
            shopData.active.effects.push(itemId);
        }
    } else if (item.category === 'boost') {
        // ブーストをアクティブにする
        const expiresAt = Date.now() + (item.duration || 3600000);
        if (itemId === 'boost-exp') {
            shopData.boosts.exp = { itemId, expiresAt };
        } else if (itemId === 'boost-up') {
            shopData.boosts.up = { itemId, expiresAt };
        } else if (itemId === 'boost-all') {
            shopData.boosts.all = { itemId, expiresAt };
            // 全ブーストパックは個別ブーストを無効化
            shopData.boosts.exp = null;
            shopData.boosts.up = null;
        }
        // ブーストは購入済みリストに追加しない（消費アイテムのため）
    }
    
    saveShopData();
    displayShop();
    applyShopCustomizations();
    if (item.category === 'boost') {
        alert(`${item.name}を開始しました！1時間有効です。`);
    } else {
        alert(`${item.name}を使用中に設定しました！`);
    }
}

// 新機能: 称号適用
function applyTitle(itemId) {
    const titleMap = {
        'title-master': 'うんちマスター🏅',
        'title-legend': 'うんちレジェンド⭐',
        'title-god': 'うんちゴッド👑'
    };
    
    if (titleMap[itemId]) {
        playerData.title = titleMap[itemId];
        updateTitle();
        savePlayerData();
    }
}

// 新機能: アチーブメント画面表示
function displayAchievements() {
    const achievementsContainer = document.getElementById('achievements-list');
    if (!achievementsContainer) return;
    
    achievementsContainer.innerHTML = '';
    
    Object.keys(ACHIEVEMENTS).forEach(achievementId => {
        const achievement = ACHIEVEMENTS[achievementId];
        const isUnlocked = achievements.unlocked.includes(achievementId);
        
        const achievementDiv = document.createElement('div');
        achievementDiv.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        achievementDiv.innerHTML = `
            <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
            ${isUnlocked ? '<div class="achievement-badge">獲得済み</div>' : ''}
        `;
        
        achievementsContainer.appendChild(achievementDiv);
    });
    
    // 統計表示
    const statsDiv = document.getElementById('achievements-stats');
    if (statsDiv) {
        const total = Object.keys(ACHIEVEMENTS).length;
        const unlocked = achievements.unlocked.length;
        statsDiv.textContent = `獲得済み: ${unlocked} / ${total}`;
    }
}

// 新機能: ミニゲーム
let minigameState = {
    isRunning: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('unchiDrill_minigameHighScore') || '0'),
    playerX: 0,
    playerY: 0,
    playerWidth: 60,
    playerHeight: 40,
    poops: [],
    gameSpeed: 2,
    lastPoopTime: 0,
    keys: {},
    animationFrame: null
};

// ミニゲーム初期化
function initMinigame() {
    const canvas = document.getElementById('minigame-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // プレイヤーの初期位置
    minigameState.playerX = canvas.width / 2 - minigameState.playerWidth / 2;
    minigameState.playerY = canvas.height - minigameState.playerHeight - 20;
    
    // ハイスコア表示を更新
    updateMinigameHighScore();
    
    // イベントリスナー
    canvas.addEventListener('mousemove', handleMinigameMouseMove);
    canvas.addEventListener('click', handleMinigameClick);
    document.addEventListener('keydown', handleMinigameKeyDown);
    document.addEventListener('keyup', handleMinigameKeyUp);
}

// ミニゲーム開始
function startMinigame() {
    const canvas = document.getElementById('minigame-canvas');
    const overlay = document.getElementById('minigame-overlay');
    if (!canvas || !overlay) return;
    
    if (minigameState.isRunning) return;
    
    minigameState.isRunning = true;
    minigameState.score = 0;
    minigameState.poops = [];
    minigameState.gameSpeed = 2;
    minigameState.lastPoopTime = Date.now();
    minigameState.playerX = canvas.width / 2 - minigameState.playerWidth / 2;
    
    overlay.style.display = 'none';
    updateMinigameScore();
    
    gameLoop();
    playSFX('correct');
}

// ミニゲームリセット
function resetMinigame() {
    stopMinigame();
    const overlay = document.getElementById('minigame-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
    minigameState.score = 0;
    updateMinigameScore();
}

// ミニゲーム停止
function stopMinigame() {
    minigameState.isRunning = false;
    if (minigameState.animationFrame) {
        cancelAnimationFrame(minigameState.animationFrame);
        minigameState.animationFrame = null;
    }
}

// ゲームループ
function gameLoop() {
    if (!minigameState.isRunning) return;
    
    const canvas = document.getElementById('minigame-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 画面クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景描画
    drawMinigameBackground(ctx, canvas);
    
    // プレイヤー移動処理
    updateMinigamePlayer();
    
    // うんち生成
    generateMinigamePoops();
    
    // うんち更新・描画
    updateMinigamePoops(ctx, canvas);
    
    // プレイヤー描画
    drawMinigamePlayer(ctx);
    
    // 衝突判定
    checkMinigameCollisions();
    
    // スコア更新
    updateMinigameScore();
    
    // ゲーム速度を徐々に上げる
    if (minigameState.score > 0 && minigameState.score % 10 === 0) {
        minigameState.gameSpeed = Math.min(6, 2 + minigameState.score / 50);
    }
    
    minigameState.animationFrame = requestAnimationFrame(gameLoop);
}

// 背景描画
function drawMinigameBackground(ctx, canvas) {
    // グラデーション背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 雲を描画
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    drawCloud(ctx, 100, 50, 40);
    drawCloud(ctx, 300, 80, 35);
    drawCloud(ctx, 500, 60, 45);
}

// 雲を描画
function drawCloud(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x + size * 1.2, y, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
}

// プレイヤー更新
function updateMinigamePlayer() {
    const canvas = document.getElementById('minigame-canvas');
    if (!canvas) return;
    
    const speed = 5;
    
    if (minigameState.keys['ArrowLeft'] || minigameState.keys['a'] || minigameState.keys['A']) {
        minigameState.playerX = Math.max(0, minigameState.playerX - speed);
    }
    if (minigameState.keys['ArrowRight'] || minigameState.keys['d'] || minigameState.keys['D']) {
        minigameState.playerX = Math.min(canvas.width - minigameState.playerWidth, minigameState.playerX + speed);
    }
}

// プレイヤー描画
function drawMinigamePlayer(ctx) {
    const x = minigameState.playerX;
    const y = minigameState.playerY;
    const w = minigameState.playerWidth;
    const h = minigameState.playerHeight;
    
    // バケツを描画
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y + h * 0.3, w, h * 0.7);
    
    // バケツの縁
    ctx.fillStyle = '#654321';
    ctx.fillRect(x - 2, y + h * 0.3, w + 4, 5);
    
    // うんちを描画（キャッチしたうんちを表現）
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.5, w * 0.3, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // ハンドル
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.2, w * 0.15, Math.PI, 0);
    ctx.stroke();
}

// うんち生成
function generateMinigamePoops() {
    const now = Date.now();
    const spawnInterval = Math.max(500, 2000 - minigameState.score * 10);
    
    if (now - minigameState.lastPoopTime > spawnInterval) {
        const canvas = document.getElementById('minigame-canvas');
        if (canvas) {
            minigameState.poops.push({
                x: Math.random() * (canvas.width - 30),
                y: -30,
                size: 20 + Math.random() * 15,
                speed: minigameState.gameSpeed + Math.random() * 2,
                emoji: Math.random() > 0.7 ? '💩' : '💩',
                rotation: Math.random() * Math.PI * 2
            });
        }
        minigameState.lastPoopTime = now;
    }
}

// うんち更新・描画
function updateMinigamePoops(ctx, canvas) {
    for (let i = minigameState.poops.length - 1; i >= 0; i--) {
        const poop = minigameState.poops[i];
        poop.y += poop.speed;
        poop.rotation += 0.1;
        
        // 画面外に出たら削除
        if (poop.y > canvas.height + 50) {
            minigameState.poops.splice(i, 1);
            continue;
        }
        
        // うんちを描画
        ctx.save();
        ctx.translate(poop.x + poop.size / 2, poop.y + poop.size / 2);
        ctx.rotate(poop.rotation);
        ctx.font = `${poop.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(poop.emoji, 0, 0);
        ctx.restore();
    }
}

// 衝突判定
function checkMinigameCollisions() {
    const playerLeft = minigameState.playerX;
    const playerRight = minigameState.playerX + minigameState.playerWidth;
    const playerTop = minigameState.playerY;
    const playerBottom = minigameState.playerY + minigameState.playerHeight;
    
    for (let i = minigameState.poops.length - 1; i >= 0; i--) {
        const poop = minigameState.poops[i];
        const poopLeft = poop.x;
        const poopRight = poop.x + poop.size;
        const poopTop = poop.y;
        const poopBottom = poop.y + poop.size;
        
        // 衝突判定
        if (poopRight > playerLeft && poopLeft < playerRight &&
            poopBottom > playerTop && poopTop < playerBottom) {
            // キャッチ成功
            minigameState.poops.splice(i, 1);
            minigameState.score += 10;
            playSFX('correct');
            createParticles('correct', poop.x + poop.size / 2, poop.y + poop.size / 2);
        }
    }
}

// スコア更新
function updateMinigameScore() {
    const scoreEl = document.getElementById('minigame-score');
    if (scoreEl) {
        scoreEl.textContent = minigameState.score;
    }
    
    // ハイスコア更新
    if (minigameState.score > minigameState.highScore) {
        minigameState.highScore = minigameState.score;
        localStorage.setItem('unchiDrill_minigameHighScore', minigameState.highScore.toString());
        updateMinigameHighScore();
    }
}

// ハイスコア表示更新
function updateMinigameHighScore() {
    const highScoreEl = document.getElementById('minigame-highscore');
    if (highScoreEl) {
        highScoreEl.textContent = minigameState.highScore;
    }
}

// マウス移動処理
function handleMinigameMouseMove(event) {
    if (!minigameState.isRunning) return;
    
    const canvas = document.getElementById('minigame-canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    minigameState.playerX = Math.max(0, Math.min(canvas.width - minigameState.playerWidth, mouseX - minigameState.playerWidth / 2));
}

// クリック処理
function handleMinigameClick(event) {
    const overlay = document.getElementById('minigame-overlay');
    if (overlay && overlay.style.display !== 'none') {
        startMinigame();
    }
}

// キーダウン処理
function handleMinigameKeyDown(event) {
    if (currentScreen !== 'settings-screen') return;
    minigameState.keys[event.key] = true;
}

// キーアップ処理
function handleMinigameKeyUp(event) {
    minigameState.keys[event.key] = false;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SHOP_ITEMS,
        shopData,
        applyShopCustomizations,
        applyRacerCustomization,
        applyBackgroundCustomization,
        applyEffectCustomizations,
        isEffectActive,
        normalizeShopData,
        createParticles,
        getSFXSequence,
        playSFX,
        RACER_STYLES,
        BACKGROUND_STYLES,
        EFFECT_CLASS_MAP
    };
}
