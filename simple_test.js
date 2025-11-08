// シンプルな確率検証スクリプト
// Math.random() < 0.5 が本当に50%確率かを確認

console.log('=' .repeat(80));
console.log('基本的な確率検証');
console.log('=' .repeat(80));
console.log();

// テスト1: Math.random() < 0.5 の確率を検証
function testBasicProbability(iterations) {
    let trueCount = 0;
    for (let i = 0; i < iterations; i++) {
        if (Math.random() < 0.5) {
            trueCount++;
        }
    }
    const rate = (trueCount / iterations) * 100;
    const deviation = Math.abs(rate - 50);
    return { trueCount, iterations, rate, deviation };
}

console.log('テスト1: Math.random() < 0.5 の確率検証');
console.log('-'.repeat(80));

const testCases = [100, 1000, 10000, 100000];
testCases.forEach(iterations => {
    const result = testBasicProbability(iterations);
    console.log(`反復回数: ${iterations.toLocaleString()}`);
    console.log(`  真になった回数: ${result.trueCount.toLocaleString()}`);
    console.log(`  確率: ${result.rate.toFixed(4)}%`);
    console.log(`  期待値との差: ${result.deviation.toFixed(4)}%`);
    console.log();
});

// テスト2: 実際の置換ロジックをシミュレート
console.log('\n' + '='.repeat(80));
console.log('テスト2: 置換ロジックのシミュレーション');
console.log('=' .repeat(80));
console.log();

const POOP_JOKES = [
    'やわらかいうんち', '硬いうんち', '漏れそうな人', '茶色いソフトクリーム'
];

function simulateReplacement(choices, correctIndex, explicitContent) {
    const choicesWithIndex = choices.map((choice, index) => ({
        text: choice,
        isCorrect: index === correctIndex
    }));
    
    const shouldAddPoopJoke = explicitContent && Math.random() < 0.5;
    
    if (shouldAddPoopJoke) {
        const wrongIndices = [];
        choicesWithIndex.forEach((item, index) => {
            if (!item.isCorrect) {
                wrongIndices.push(index);
            }
        });
        
        if (wrongIndices.length > 0) {
            const targetIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
            const randomPoopJoke = POOP_JOKES[Math.floor(Math.random() * POOP_JOKES.length)];
            choicesWithIndex[targetIndex].text = randomPoopJoke;
        }
    }
    
    return {
        choices: choicesWithIndex.map(c => c.text),
        replaced: shouldAddPoopJoke
    };
}

function testReplacementLogic(iterations, explicitContent) {
    const testChoices = ['選択肢A', '選択肢B', '選択肢C', '選択肢D'];
    const correctIndex = 0;
    
    let replacementCount = 0;
    let actualPoopJokeCount = 0;
    
    for (let i = 0; i < iterations; i++) {
        const result = simulateReplacement(testChoices, correctIndex, explicitContent);
        if (result.replaced) {
            replacementCount++;
        }
        
        // 実際にうんちネタが含まれているかチェック
        const hasPoopJoke = result.choices.some(choice => 
            POOP_JOKES.includes(choice)
        );
        if (hasPoopJoke) {
            actualPoopJokeCount++;
        }
    }
    
    const replacementRate = (replacementCount / iterations) * 100;
    const actualRate = (actualPoopJokeCount / iterations) * 100;
    const deviation = Math.abs(replacementRate - 50);
    
    return {
        replacementCount,
        actualPoopJokeCount,
        replacementRate,
        actualRate,
        deviation
    };
}

console.log('下ネタ設定: ON');
console.log('-'.repeat(80));
testCases.forEach(iterations => {
    const result = testReplacementLogic(iterations, true);
    console.log(`反復回数: ${iterations.toLocaleString()}`);
    console.log(`  置換フラグが立った回数: ${result.replacementCount.toLocaleString()}`);
    console.log(`  実際にうんちネタが含まれた回数: ${result.actualPoopJokeCount.toLocaleString()}`);
    console.log(`  置換率: ${result.replacementRate.toFixed(4)}%`);
    console.log(`  実際の出現率: ${result.actualRate.toFixed(4)}%`);
    console.log(`  期待値との差: ${result.deviation.toFixed(4)}%`);
    console.log();
});

console.log('\n下ネタ設定: OFF');
console.log('-'.repeat(80));
const resultOff = testReplacementLogic(10000, false);
console.log(`反復回数: 10,000`);
console.log(`  置換フラグが立った回数: ${resultOff.replacementCount.toLocaleString()}`);
console.log(`  実際にうんちネタが含まれた回数: ${resultOff.actualPoopJokeCount.toLocaleString()}`);
console.log(`  置換率: ${resultOff.replacementRate.toFixed(4)}%`);
console.log();

console.log('='.repeat(80));
console.log('結論');
console.log('='.repeat(80));
console.log();
console.log('✅ Math.random() < 0.5 は統計的に50%に収束します');
console.log('✅ 置換ロジックも同様に50%確率で動作します');
console.log('✅ 設定がOFFの場合は確実に0%になります');
console.log();
console.log('もし実際のアプリで50%にならない場合、以下の原因が考えられます：');
console.log('  1. settings.explicitContent が false になっている');
console.log('  2. サンプル数が少なすぎて統計的なばらつきが大きい');
console.log('  3. ブラウザのキャッシュで古いコードが動いている');
console.log();
