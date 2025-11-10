const assert = require('assert');
const { JSDOM } = require('jsdom');

const dom = new JSDOM(
    `<!DOCTYPE html>
    <html lang="ja">
      <head>
        <title>Shop Feature Test</title>
      </head>
      <body>
        <div id="top-screen" class="screen">
          <div class="title-area"></div>
          <div class="poop-racer">
            <div class="racer-emoji">💩</div>
            <div class="racer-wheels">🏎️</div>
          </div>
        </div>
        <div id="quiz-screen" class="screen">
          <div class="race-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="progress-fill"></div>
              <div class="racer-position" id="racer-position">
                <span class="racer-icon">💩🏎️</span>
              </div>
            </div>
          </div>
          <div class="container"></div>
        </div>
        <div id="shop-screen" class="screen"></div>
        <div id="result-screen" class="screen"></div>
        <div id="drill-setup-screen" class="screen"></div>
        <div id="achievements-screen" class="screen"></div>
        <div id="stats-screen" class="screen"></div>
        <div id="settings-screen" class="screen"></div>
        <div id="explanation-modal" class="modal">
          <div class="modal-content">
            <div id="modal-title"></div>
            <div id="explanation-text"></div>
          </div>
        </div>
        <div id="level-up-modal" class="modal">
          <div class="modal-content">
            <div id="level-up-title"></div>
            <div id="level-up-level"></div>
            <div id="level-up-title-text"></div>
          </div>
        </div>
        <div id="confirm-dialog" class="modal">
          <div class="modal-content">
            <div id="confirm-title"></div>
            <div id="confirm-message"></div>
          </div>
        </div>
        <div id="answer-area"></div>
        <div id="question-text"></div>
      </body>
    </html>`,
    { url: 'http://localhost' }
);

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;
global.navigator = dom.window.navigator;
global.performance = dom.window.performance;
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};
global.alert = () => {};
global.confirm = () => true;

global.fetch = async (url) => ({
    json: async () =>
        url.includes('index.json')
            ? { files: [] }
            : {
                  subject: 'test',
                  subjectName: 'テスト',
                  unitId: 'unit',
                  unitName: 'ユニット',
                  category: 'category',
                  questions: []
              }
});

const app = require('./app.js');

function setShopState({ purchased = [], active = {} } = {}) {
    app.shopData.purchased.length = 0;
    app.shopData.purchased.push(...purchased);
    app.shopData.active.racer = active.racer || null;
    app.shopData.active.background = active.background || null;
    app.shopData.active.effects = Array.isArray(active.effects) ? [...active.effects] : [];
}

function resetState() {
    setShopState({ purchased: [], active: {} });
    const poopRacer = document.querySelector('.poop-racer');
    if (poopRacer) {
        poopRacer.className = 'poop-racer';
        const emoji = poopRacer.querySelector('.racer-emoji');
        if (emoji) {
            emoji.textContent = '💩';
        }
        const wheels = poopRacer.querySelector('.racer-wheels');
        if (wheels) {
            wheels.textContent = '🏎️';
        }
    }
    const progressRacer = document.getElementById('racer-position');
    if (progressRacer) {
        progressRacer.className = 'racer-position';
        const icon = progressRacer.querySelector('.racer-icon');
        if (icon) {
            icon.textContent = '💩🏎️';
        }
    }
    document.body.className = '';
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer) {
        particleContainer.remove();
    }
}

function runTest(name, fn) {
    try {
        resetState();
        fn();
        console.log(`✅ ${name}`);
        return true;
    } catch (error) {
        console.error(`❌ ${name}: ${error.message}`);
        return false;
    }
}

const results = [];

results.push(
    runTest('デフォルトレーサーが適用される', () => {
        app.applyShopCustomizations();
        const poopRacer = document.querySelector('.poop-racer');
        const emoji = poopRacer.querySelector('.racer-emoji').textContent;
        const wheels = poopRacer.querySelector('.racer-wheels').textContent;
        const progressIcon = document.querySelector('#racer-position .racer-icon').textContent;

        assert.strictEqual(emoji, app.RACER_STYLES.default.emoji, 'デフォルトの絵文字が設定されること');
        assert.strictEqual(wheels, app.RACER_STYLES.default.wheels, 'デフォルトの車輪が設定されること');
        assert.strictEqual(progressIcon, app.RACER_STYLES.default.progressIcon, 'デフォルトの進捗アイコンが設定されること');
        assert.ok(poopRacer.classList.contains(app.RACER_STYLES.default.className), 'デフォルトスタイルクラスが付与されること');
    })
);

results.push(
    runTest('レーサー「炎うんち🔥」が適用される', () => {
        setShopState({
            purchased: ['racer-fire'],
            active: { racer: 'racer-fire' }
        });
        app.applyShopCustomizations();

        const poopRacer = document.querySelector('.poop-racer');
        const emoji = poopRacer.querySelector('.racer-emoji').textContent;
        const progressIcon = document.querySelector('#racer-position .racer-icon').textContent;

        assert.strictEqual(emoji, app.RACER_STYLES['racer-fire'].emoji, '炎レーサーの絵文字が設定されること');
        assert.strictEqual(progressIcon, app.RACER_STYLES['racer-fire'].progressIcon, '炎レーサーの進捗アイコンが設定されること');
        assert.ok(poopRacer.classList.contains('racer-style-fire'), '炎レーサークラスが付与されること');
    })
);

results.push(
    runTest('背景テーマ「宇宙トイレ」が適用される', () => {
        setShopState({
            purchased: ['bg-space'],
            active: { background: 'bg-space' }
        });
        app.applyShopCustomizations();

        assert.ok(document.body.classList.contains('shop-bg-space'), '宇宙背景クラスが付与されること');
    })
);

results.push(
    runTest('パーティクル強化で生成数が2倍になる', () => {
        const baseX = 200;
        const baseY = 200;
        app.applyShopCustomizations();
        app.createParticles('correct', baseX, baseY);
        const baseContainer = document.getElementById('particle-container');
        const baseCount = baseContainer ? baseContainer.childElementCount : 0;
        if (baseContainer) {
            baseContainer.remove();
        }

        setShopState({
            purchased: ['effect-particles'],
            active: { effects: ['effect-particles'] }
        });
        app.applyShopCustomizations();
        app.createParticles('correct', baseX, baseY);
        const boostedContainer = document.getElementById('particle-container');
        const boostedCount = boostedContainer ? boostedContainer.childElementCount : 0;

        assert.ok(baseCount > 0, 'パーティクルが生成されること');
        assert.strictEqual(boostedCount, baseCount * 2, '強化後はパーティクル数が2倍になること');
    })
);

results.push(
    runTest('音響強化がクラスを付与し、シーケンスが豪華になる', () => {
        const defaultSeq = app.getSFXSequence('correct', { enhanced: false });
        const enhancedSeq = app.getSFXSequence('correct', { enhanced: true });
        assert.ok(enhancedSeq.length > defaultSeq.length, '音響強化時はノート数が増えること');
        assert.notStrictEqual(enhancedSeq[0].type, defaultSeq[0].type, '音色が変化すること');

        setShopState({
            purchased: ['effect-sound'],
            active: { effects: ['effect-sound'] }
        });
        app.applyShopCustomizations();
        assert.ok(document.body.classList.contains('effect-sound-active'), '音響強化クラスが付与されること');
    })
);

const passed = results.filter(Boolean).length;
const total = results.length;

console.log(`\n📊 テスト結果: ${passed} / ${total} 合格`);

if (passed !== total) {
    process.exit(1);
}
