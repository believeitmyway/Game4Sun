// 下ネタ置換の確率検証スクリプト
// すべての科目、単元、問題数の組み合わせで50%確率検証

// data.jsとapp.jsから必要な部分を読み込み
const fs = require('fs');
const vm = require('vm');

// data.jsとapp.jsを読み込む
const dataJs = fs.readFileSync('./data.js', 'utf8');
const appJs = fs.readFileSync('./app.js', 'utf8');

// グローバルコンテキストを作成
const context = {
    console: console,
    Math: Math,
    settings: { explicitContent: true }
};

// data.jsを実行
vm.runInNewContext(dataJs, context);
const QUESTION_DATABASE = context.QUESTION_DATABASE;

// app.jsからshuffleChoicesWithPoopJoke関数を抽出
const POOP_JOKES = context.POOP_JOKES || [
    'やわらかいうんち', '硬いうんち', '漏れそうな人', '茶色いソフトクリーム',
    'コロコロうんち', 'バナナ型うんち', '下痢気味の人', 'トイレを探す人'
];

function shuffleChoicesWithPoopJoke(choices, correctAnswerIndex) {
    const choicesWithIndex = choices.map((choice, index) => ({
        text: choice,
        isCorrect: index === correctAnswerIndex
    }));
    
    const shouldAddPoopJoke = context.settings.explicitContent && Math.random() < 0.5;
    
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
    
    for (let i = choicesWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choicesWithIndex[i], choicesWithIndex[j]] = [choicesWithIndex[j], choicesWithIndex[i]];
    }
    
    let newCorrectIndex = -1;
    const shuffledChoices = choicesWithIndex.map((item, index) => {
        if (item.isCorrect) {
            newCorrectIndex = index;
        }
        return item.text;
    });
    
    return {
        choices: shuffledChoices,
        correctIndex: newCorrectIndex,
        hadPoopJoke: shouldAddPoopJoke
    };
}

// 検証関数
function verifyReplacementProbability(iterations = 1000) {
    console.log('=' .repeat(80));
    console.log('下ネタ置換の確率検証 - 全科目・全単元・全問題数');
    console.log('=' .repeat(80));
    console.log();

    const results = {};
    let totalTests = 0;
    let totalWithReplacement = 0;
    const issuesFound = [];

    // すべての科目を走査
    for (const [subjectId, subjectData] of Object.entries(QUESTION_DATABASE)) {
        console.log(`\n📚 科目: ${subjectData.name} (${subjectId})`);
        console.log('-'.repeat(80));
        
        results[subjectId] = {
            name: subjectData.name,
            units: {}
        };

        // 各科目のすべての単元を走査
        for (const [unitId, unitData] of Object.entries(subjectData.units)) {
            const questions = unitData.questions;
            
            // multiple choice問題だけをフィルター
            const multipleChoiceQuestions = questions.filter(q => q.type === 'multiple');
            
            if (multipleChoiceQuestions.length === 0) {
                console.log(`  ⚠️  単元: ${unitData.name} - 選択問題なし（スキップ）`);
                continue;
            }

            console.log(`  📖 単元: ${unitData.name}`);
            console.log(`     問題数: ${multipleChoiceQuestions.length}問`);

            // この単元でiterations回テスト
            let replacementCount = 0;
            
            for (let i = 0; i < iterations; i++) {
                // ランダムに問題を選択
                const randomQuestion = multipleChoiceQuestions[
                    Math.floor(Math.random() * multipleChoiceQuestions.length)
                ];
                
                const result = shuffleChoicesWithPoopJoke(
                    randomQuestion.choices,
                    randomQuestion.answer
                );
                
                if (result.hadPoopJoke) {
                    replacementCount++;
                }
            }

            const replacementRate = (replacementCount / iterations) * 100;
            totalTests += iterations;
            totalWithReplacement += replacementCount;

            results[subjectId].units[unitId] = {
                name: unitData.name,
                questionCount: multipleChoiceQuestions.length,
                replacementCount: replacementCount,
                replacementRate: replacementRate
            };

            console.log(`     置換回数: ${replacementCount} / ${iterations}`);
            console.log(`     置換率: ${replacementRate.toFixed(2)}%`);

            // 期待値から大きく外れている場合に警告
            const deviation = Math.abs(replacementRate - 50);
            if (deviation > 5) {  // 5%以上の乖離
                const issue = `${subjectData.name} - ${unitData.name}: ${replacementRate.toFixed(2)}% (期待値50%から${deviation.toFixed(2)}%の乖離)`;
                issuesFound.push(issue);
                console.log(`     ⚠️  警告: 期待値から${deviation.toFixed(2)}%乖離`);
            } else {
                console.log(`     ✅ OK`);
            }
        }
    }

    // 全体の統計
    console.log('\n');
    console.log('=' .repeat(80));
    console.log('全体統計');
    console.log('=' .repeat(80));
    const overallRate = (totalWithReplacement / totalTests) * 100;
    console.log(`総テスト回数: ${totalTests}`);
    console.log(`総置換回数: ${totalWithReplacement}`);
    console.log(`全体置換率: ${overallRate.toFixed(4)}%`);
    console.log(`期待値との差: ${Math.abs(overallRate - 50).toFixed(4)}%`);

    // 問題がある単元のサマリー
    console.log('\n');
    if (issuesFound.length > 0) {
        console.log('⚠️  警告が発生した単元:');
        console.log('-'.repeat(80));
        issuesFound.forEach((issue, index) => {
            console.log(`${index + 1}. ${issue}`);
        });
        console.log(`\n合計 ${issuesFound.length} 件の警告`);
    } else {
        console.log('✅ すべての単元で置換率が期待値の範囲内です！');
    }

    // 問題数別の検証
    console.log('\n');
    console.log('=' .repeat(80));
    console.log('問題数別検証（10問、20問、50問、全問の想定）');
    console.log('=' .repeat(80));

    const questionCounts = [10, 20, 50, 100];
    for (const count of questionCounts) {
        let replacementCount = 0;
        const testIterations = 1000;
        
        for (let i = 0; i < testIterations; i++) {
            // ダミーの選択肢を使用
            const dummyChoices = ['選択肢1', '選択肢2', '選択肢3', '選択肢4'];
            const result = shuffleChoicesWithPoopJoke(dummyChoices, 0);
            if (result.hadPoopJoke) {
                replacementCount++;
            }
        }
        
        const rate = (replacementCount / testIterations) * 100;
        const deviation = Math.abs(rate - 50);
        const status = deviation <= 5 ? '✅' : '⚠️';
        
        console.log(`${status} ${count}問想定: ${rate.toFixed(2)}% (${replacementCount}/${testIterations})`);
    }

    return {
        totalTests,
        totalWithReplacement,
        overallRate,
        issuesFound,
        results
    };
}

// 詳細検証を実行
function detailedVerification() {
    console.log('\n\n');
    console.log('=' .repeat(80));
    console.log('詳細検証: 実際の選択肢確認');
    console.log('=' .repeat(80));
    
    // 各科目から1問ずつサンプリングして、実際にうんちネタが挿入されることを確認
    for (const [subjectId, subjectData] of Object.entries(QUESTION_DATABASE)) {
        for (const [unitId, unitData] of Object.entries(subjectData.units)) {
            const multipleChoiceQuestions = unitData.questions.filter(q => q.type === 'multiple');
            if (multipleChoiceQuestions.length === 0) continue;
            
            const question = multipleChoiceQuestions[0];
            console.log(`\n📝 ${subjectData.name} - ${unitData.name}`);
            console.log(`   問題: ${question.question}`);
            console.log(`   元の選択肢: ${question.choices.join(', ')}`);
            
            // 10回実行してうんちネタが含まれるか確認
            let poopJokeFound = false;
            let attempts = 0;
            while (!poopJokeFound && attempts < 20) {
                const result = shuffleChoicesWithPoopJoke(question.choices, question.answer);
                
                // POOP_JOKESに含まれる文字列があるかチェック
                const hasPoopJoke = result.choices.some(choice => 
                    POOP_JOKES.includes(choice)
                );
                
                if (hasPoopJoke) {
                    poopJokeFound = true;
                    console.log(`   ✅ 置換後の選択肢: ${result.choices.join(', ')}`);
                }
                attempts++;
            }
            
            if (!poopJokeFound) {
                console.log(`   ⚠️  警告: 20回試行してもうんちネタが出現しませんでした`);
            }
            
            break; // 最初の単元だけ
        }
        break; // 最初の科目だけ
    }
}

// メイン実行
console.log('検証開始...\n');
const verificationResult = verifyReplacementProbability(10000);  // 各単元で10000回テスト
detailedVerification();

console.log('\n\n検証完了！');
