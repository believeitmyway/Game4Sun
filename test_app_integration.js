// Node.js用のテストスクリプト（統合テスト）
const https = require('https');
const http = require('http');

async function testJSONLoading() {
    console.log('🧪 問題データ読み込みの統合テスト開始\n');
    
    try {
        // index.jsonを読み込む
        console.log('📂 index.jsonを読み込んでいます...');
        const indexData = await fetchJSON('http://localhost:8080/questions/index.json');
        console.log(`✅ index.json読み込み成功: ${indexData.files.length}ファイル\n`);
        
        // 各JSONファイルを読み込む
        console.log('📚 各問題ファイルを読み込んでいます...');
        const QUESTION_DATABASE = {};
        
        for (const filename of indexData.files) {
            const fileData = await fetchJSON(`http://localhost:8080/questions/${filename}`);
            const { subject, subjectName, unitId, unitName, category, questions } = fileData;
            
            if (!QUESTION_DATABASE[subject]) {
                QUESTION_DATABASE[subject] = {
                    name: subjectName,
                    units: {}
                };
            }
            
            QUESTION_DATABASE[subject].units[unitId] = {
                name: unitName,
                category: category,
                questions: questions
            };
            
            console.log(`  ✓ ${filename}: ${questions.length}問`);
        }
        
        console.log('\n📊 統計情報:');
        let totalQuestions = 0;
        let totalUnits = 0;
        
        Object.keys(QUESTION_DATABASE).forEach(subjectId => {
            const subject = QUESTION_DATABASE[subjectId];
            const unitCount = Object.keys(subject.units).length;
            let questionCount = 0;
            Object.keys(subject.units).forEach(unitId => {
                questionCount += subject.units[unitId].questions.length;
            });
            totalQuestions += questionCount;
            totalUnits += unitCount;
            console.log(`  ${subject.name}: ${unitCount}単元, ${questionCount}問`);
        });
        
        console.log(`\n✅ 合計: ${Object.keys(QUESTION_DATABASE).length}科目, ${totalUnits}単元, ${totalQuestions}問`);
        console.log('\n🎉 全てのテストに合格しました！');
        
        return true;
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
        return false;
    }
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`JSON parse error: ${e.message}`));
                }
            });
        }).on('error', (err) => {
            reject(new Error(`HTTP request error: ${err.message}`));
        });
    });
}

// テスト実行
testJSONLoading().then(success => {
    process.exit(success ? 0 : 1);
});
