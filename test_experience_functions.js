// 経験値・称号機能のユニットテスト
// Node.js環境で実行可能なテスト

// テスト用のモックデータ
let playerData = {
    level: 1,
    exp: 0,
    upPoints: 0,
    title: 'うんち初心者💩',
    totalQuestions: 0,
    totalCorrect: 0,
    consecutiveCorrect: 0,
    bestConsecutiveCorrect: 0
};

let streakData = {
    currentStreak: 0,
    lastStudyDate: null,
    longestStreak: 0
};

let achievements = {
    unlocked: [],
    progress: {}
};

// 関数の実装（app.jsから抜粋）
function getExpForLevel(level) {
    return 100 + (level - 1) * 50;
}

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

function updateTitle() {
    // 特別称号を優先チェック
    if (playerData.bestConsecutiveCorrect >= 30 && !achievements.unlocked.includes('consecutive-30')) {
        playerData.title = '完璧主義者✨';
        return;
    }
    if (streakData.currentStreak >= 7 && !achievements.unlocked.includes('streak-7')) {
        playerData.title = '連続学習マスター🔥';
        return;
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

function getStreakBonus() {
    const streak = streakData.currentStreak;
    let expBonus = 0;
    let upBonus = 0;
    
    if (streak >= 30) {
        expBonus = 2.0;
        upBonus = 1.0;
    } else if (streak >= 14) {
        expBonus = 1.0;
        upBonus = 0.5;
    } else if (streak >= 7) {
        expBonus = 0.5;
        upBonus = 0.25;
    } else if (streak >= 3) {
        expBonus = 0.2;
        upBonus = 0.1;
    }
    
    return { expBonus, upBonus };
}

// テスト関数
function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}: 合格`);
        return true;
    } catch (error) {
        console.error(`❌ ${name}: 不合格 - ${error.message}`);
        return false;
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message || '値が一致しません'}: 期待値=${expected}, 実際の値=${actual}`);
    }
}

function assertTrue(condition, message) {
    if (!condition) {
        throw new Error(message || '条件が真ではありません');
    }
}

// テスト実行
console.log('🧪 経験値・称号機能のユニットテスト開始\n');

let passed = 0;
let total = 0;

// テスト1: 経験値計算
total++;
if (test('経験値計算テスト', () => {
    assertEquals(getExpForLevel(1), 100, 'レベル1→2の必要経験値');
    assertEquals(getExpForLevel(2), 150, 'レベル2→3の必要経験値');
    assertEquals(getExpForLevel(10), 550, 'レベル10→11の必要経験値');
})) passed++;

// テスト2: レベルアップ
total++;
if (test('レベルアップテスト', () => {
    playerData.level = 1;
    playerData.exp = 100;
    const result = checkLevelUp();
    assertTrue(result, 'レベルアップが発生するべき');
    assertEquals(playerData.level, 2, 'レベルが2になるべき');
    assertEquals(playerData.exp, 0, '経験値が0になるべき');
})) passed++;

// テスト3: 称号更新（レベルベース）
total++;
if (test('称号更新テスト（レベルベース）', () => {
    playerData.level = 1;
    updateTitle();
    assertEquals(playerData.title, 'うんち初心者💩', 'レベル1の称号');
    
    playerData.level = 11;
    updateTitle();
    assertEquals(playerData.title, 'うんちマスター🚽', 'レベル11の称号');
    
    playerData.level = 31;
    updateTitle();
    assertEquals(playerData.title, 'うんちキング👑', 'レベル31の称号');
    
    playerData.level = 51;
    updateTitle();
    assertEquals(playerData.title, 'うんちゴッド💫', 'レベル51の称号');
})) passed++;

// テスト4: 特別称号
total++;
if (test('特別称号テスト', () => {
    playerData.level = 1;
    streakData.currentStreak = 7;
    achievements.unlocked = [];
    updateTitle();
    assertEquals(playerData.title, '連続学習マスター🔥', '7日ストリークの特別称号');
    
    playerData.level = 20;
    playerData.bestConsecutiveCorrect = 30;
    achievements.unlocked = [];
    updateTitle();
    assertEquals(playerData.title, '完璧主義者✨', '30連続正解の特別称号');
})) passed++;

// テスト5: ストリークボーナス
total++;
if (test('ストリークボーナステスト', () => {
    streakData.currentStreak = 0;
    let bonus = getStreakBonus();
    assertEquals(bonus.expBonus, 0, 'ストリーク0日のボーナス');
    
    streakData.currentStreak = 3;
    bonus = getStreakBonus();
    assertEquals(bonus.expBonus, 0.2, 'ストリーク3日のボーナス');
    
    streakData.currentStreak = 7;
    bonus = getStreakBonus();
    assertEquals(bonus.expBonus, 0.5, 'ストリーク7日のボーナス');
    assertEquals(bonus.upBonus, 0.25, 'ストリーク7日のU-Pボーナス');
    
    streakData.currentStreak = 14;
    bonus = getStreakBonus();
    assertEquals(bonus.expBonus, 1.0, 'ストリーク14日のボーナス');
    
    streakData.currentStreak = 30;
    bonus = getStreakBonus();
    assertEquals(bonus.expBonus, 2.0, 'ストリーク30日のボーナス');
})) passed++;

// テスト6: 複数レベルアップ
total++;
if (test('複数レベルアップテスト', () => {
    playerData.level = 1;
    playerData.exp = 250; // レベル1→2(100) + レベル2→3(150) = 250
    let count = 0;
    while (checkLevelUp()) {
        count++;
    }
    assertEquals(count, 2, '2回レベルアップするべき');
    assertEquals(playerData.level, 3, 'レベルが3になるべき');
    assertEquals(playerData.exp, 0, '経験値が0になるべき');
})) passed++;

console.log(`\n📊 テスト結果: ${passed}/${total} 合格`);
process.exit(passed === total ? 0 : 1);
