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
let settings = {
    bgm: true,
    sfx: true
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadSettings();
    showScreen('top-screen');
});

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
    }
}

function saveSettings() {
    localStorage.setItem('unchiDrill_settings', JSON.stringify(settings));
}

// 画面遷移
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
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

// 問題表示
function displayQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showResult();
        return;
    }
    
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
        question.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = choice;
            btn.onclick = () => checkAnswer(index);
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

function checkAnswer(selectedIndex) {
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.answer;
    
    // ボタンのスタイル更新
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.answer) {
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
    const question = currentQuestions[currentQuestionIndex];
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim();
    const correctAnswer = question.answer.toString().trim();
    
    const isCorrect = userAnswer === correctAnswer;
    
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
    const upPoints = correctAnswers * 10;
    
    document.getElementById('result-correct').textContent = `${correctAnswers} / ${currentQuestions.length}`;
    document.getElementById('result-rate').textContent = `${correctRate}%`;
    document.getElementById('result-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('result-up').textContent = upPoints;
    
    showScreen('result-screen');
    
    // 効果音とお祝いパーティクル
    playSFX('finish');
    
    // 画面全体にパーティクルを発生
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createParticles('correct', Math.random() * window.innerWidth, Math.random() * window.innerHeight / 2);
        }, i * 200);
    }
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
    userAnswerHistory = {};
    alert('学習記録をリセットしました！');
    closeConfirmDialog();
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
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            // 正解音（キラキラした音）
            [800, 1000, 1200, 1600].forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.08 + 0.4);
                osc.start(audioContext.currentTime + i * 0.08);
                osc.stop(audioContext.currentTime + i * 0.08 + 0.4);
            });
        } else if (type === 'wrong') {
            // 不正解音（ブザー音）
            [200, 180, 160].forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                osc.type = 'sawtooth';
                gain.gain.setValueAtTime(0.25, audioContext.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
                osc.start(audioContext.currentTime + i * 0.1);
                osc.stop(audioContext.currentTime + i * 0.1 + 0.3);
            });
        } else if (type === 'finish') {
            // 完了音（ファンファーレ）
            [523, 523, 659, 523, 784, 740].forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                osc.type = 'triangle';
                gain.gain.setValueAtTime(0.35, audioContext.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.4);
                osc.start(audioContext.currentTime + i * 0.15);
                osc.stop(audioContext.currentTime + i * 0.15 + 0.4);
            });
        }
    } catch (e) {
        console.log('効果音の再生に失敗しました:', e);
    }
}

// パーティクルエフェクト
function createParticles(type, x, y) {
    const particleContainer = document.getElementById('particle-container');
    if (!particleContainer) {
        const container = document.createElement('div');
        container.id = 'particle-container';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        document.body.appendChild(container);
    }
    
    const count = type === 'correct' ? 30 : 15;
    const emoji = type === 'correct' ? '✨' : '💩';
    const colors = type === 'correct' ? ['#FFD700', '#FFA500', '#FF69B4', '#00FF00'] : ['#8B4513', '#654321', '#A0522D'];
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = Math.random() > 0.5 ? emoji : '';
        particle.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 10}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${x || window.innerWidth / 2}px;
            top: ${y || window.innerHeight / 2}px;
            pointer-events: none;
        `;
        
        document.getElementById('particle-container').appendChild(particle);
        
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
