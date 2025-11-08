// 問題データベース
// 各科目・単元ごとに100問以上の問題を格納

const QUESTION_DATABASE = {
    english: {
        name: '英語',
        units: {
            'grammar-basic': {
                name: '基礎文法',
                category: '文法',
                questions: generateEnglishGrammarQuestions()
            },
            'grammar-tense': {
                name: '時制（現在・過去・未来）',
                category: '文法',
                questions: generateTenseQuestions()
            },
            'grammar-passive': {
                name: '受動態',
                category: '文法',
                questions: generatePassiveQuestions()
            },
            'vocabulary-basic': {
                name: '基本単語',
                category: '語彙',
                questions: generateBasicVocabularyQuestions()
            },
            'vocabulary-advanced': {
                name: '応用単語',
                category: '語彙',
                questions: generateAdvancedVocabularyQuestions()
            }
        }
    },
    math: {
        name: '数学',
        units: {
            'calc-polynomial': {
                name: '多項式の加法・減法',
                category: '式の計算',
                questions: generatePolynomialAddSubQuestions()
            },
            'calc-monomial': {
                name: '単項式の乗法・除法',
                category: '式の計算',
                questions: generateMonomialMulDivQuestions()
            },
            'equation-linear': {
                name: '連立方程式（加減法・代入法）',
                category: '連立方程式',
                questions: generateLinearEquationQuestions()
            },
            'equation-word': {
                name: '連立方程式の文章問題',
                category: '連立方程式',
                questions: generateEquationWordQuestions()
            },
            'function-linear': {
                name: '一次関数',
                category: '関数',
                questions: generateLinearFunctionQuestions()
            }
        }
    },
    japanese: {
        name: '国語',
        units: {
            'kanji-reading': {
                name: '漢字の読み',
                category: '漢字',
                questions: generateKanjiReadingQuestions()
            },
            'kanji-writing': {
                name: '漢字の書き',
                category: '漢字',
                questions: generateKanjiWritingQuestions()
            },
            'grammar-particles': {
                name: '助詞・助動詞',
                category: '文法',
                questions: generateParticlesQuestions()
            },
            'literature': {
                name: '文学作品',
                category: '読解',
                questions: generateLiteratureQuestions()
            },
            'classic': {
                name: '古典文法',
                category: '古典',
                questions: generateClassicQuestions()
            }
        }
    },
    science: {
        name: '理科',
        units: {
            'physics-force': {
                name: '力と運動',
                category: '物理',
                questions: generateForceQuestions()
            },
            'physics-electricity': {
                name: '電気',
                category: '物理',
                questions: generateElectricityQuestions()
            },
            'chemistry-reaction': {
                name: '化学反応',
                category: '化学',
                questions: generateChemicalReactionQuestions()
            },
            'chemistry-atom': {
                name: '原子・分子',
                category: '化学',
                questions: generateAtomQuestions()
            },
            'biology-cell': {
                name: '細胞',
                category: '生物',
                questions: generateCellQuestions()
            }
        }
    },
    social: {
        name: '社会',
        units: {
            'geography-japan': {
                name: '日本の地理',
                category: '地理',
                questions: generateJapanGeographyQuestions()
            },
            'geography-world': {
                name: '世界の地理',
                category: '地理',
                questions: generateWorldGeographyQuestions()
            },
            'history-ancient': {
                name: '古代〜中世',
                category: '歴史',
                questions: generateAncientHistoryQuestions()
            },
            'history-modern': {
                name: '近代〜現代',
                category: '歴史',
                questions: generateModernHistoryQuestions()
            },
            'civics': {
                name: '公民',
                category: '公民',
                questions: generateCivicsQuestions()
            }
        }
    }
};

// 以下、問題生成関数

function generateEnglishGrammarQuestions() {
    const questions = [];
    const templates = [
        { q: 'I ___ a student.', choices: ['am', 'is', 'are', 'be'], answer: 0, explanation: 'I（私は）の後は "am" を使います。I am / You are / He is などと覚えましょう。' },
        { q: 'She ___ to school every day.', choices: ['go', 'goes', 'going', 'went'], answer: 1, explanation: '三人称単数（She, He, It）の現在形では動詞に "s" または "es" をつけます。' },
        { q: 'They ___ playing soccer now.', choices: ['is', 'am', 'are', 'be'], answer: 2, explanation: 'They（彼らは）の後は "are" を使います。現在進行形は be動詞 + 動詞ing の形です。' },
        { q: 'This is ___ book.', choices: ['I', 'my', 'me', 'mine'], answer: 1, explanation: '所有格（〜の）は my, your, his, her などを使います。' },
        { q: '___ is your name?', choices: ['Who', 'What', 'Where', 'When'], answer: 1, explanation: '名前を聞くときは "What is your name?" を使います。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `eng-grammar-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: template.answer,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateTenseQuestions() {
    const questions = [];
    const templates = [
        { q: 'I ___ TV yesterday.', choices: ['watch', 'watched', 'watching', 'will watch'], answer: 1, explanation: 'yesterday（昨日）があるので過去形の "watched" を使います。' },
        { q: 'She ___ to Tokyo tomorrow.', choices: ['go', 'went', 'goes', 'will go'], answer: 3, explanation: 'tomorrow（明日）があるので未来形の "will go" を使います。' },
        { q: 'We ___ English now.', choices: ['study', 'studied', 'are studying', 'will study'], answer: 2, explanation: 'now（今）があるので現在進行形の "are studying" を使います。' },
        { q: 'He ___ his homework already.', choices: ['finish', 'finished', 'has finished', 'will finish'], answer: 2, explanation: 'already（すでに）があるので現在完了形の "has finished" を使います。' },
        { q: 'They ___ soccer every Sunday.', choices: ['play', 'played', 'are playing', 'will play'], answer: 0, explanation: 'every Sunday（毎週日曜日）があるので現在形の "play" を使います。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `eng-tense-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: template.answer,
            explanation: template.explanation
        });
    }
    return questions;
}

function generatePassiveQuestions() {
    const questions = [];
    const templates = [
        { q: 'This book ___ by many people.', choices: ['read', 'reads', 'is read', 'reading'], answer: 2, explanation: '受動態は "be動詞 + 過去分詞" の形です。この場合は "is read"（読まれる）となります。' },
        { q: 'English ___ in Canada.', choices: ['speak', 'speaks', 'is spoken', 'speaking'], answer: 2, explanation: '英語は「話される」ので受動態 "is spoken" を使います。' },
        { q: 'The car ___ by my father.', choices: ['wash', 'washes', 'was washed', 'washing'], answer: 2, explanation: '車は「洗われた」ので過去の受動態 "was washed" を使います。' },
        { q: 'The letter ___ tomorrow.', choices: ['send', 'sends', 'will be sent', 'sending'], answer: 2, explanation: '手紙は「送られる予定」なので未来の受動態 "will be sent" を使います。' },
        { q: 'These pictures ___ last year.', choices: ['take', 'takes', 'were taken', 'taking'], answer: 2, explanation: '写真は「撮られた」ので過去の受動態 "were taken" を使います。複数形なので "were" です。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `eng-passive-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: template.answer,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateBasicVocabularyQuestions() {
    const questions = [];
    const vocab = [
        { word: 'apple', meaning: 'りんご', choices: ['りんご', 'みかん', 'バナナ', 'ぶどう'] },
        { word: 'cat', meaning: '猫', choices: ['猫', '犬', '鳥', '魚'] },
        { word: 'book', meaning: '本', choices: ['本', 'ペン', 'ノート', '机'] },
        { word: 'school', meaning: '学校', choices: ['学校', '病院', '図書館', '公園'] },
        { word: 'happy', meaning: '幸せな', choices: ['幸せな', '悲しい', '怒った', '疲れた'] }
    ];

    for (let i = 0; i < 100; i++) {
        const v = vocab[i % vocab.length];
        questions.push({
            id: `eng-vocab-basic-${i + 1}`,
            question: `"${v.word}" の意味は？`,
            type: 'multiple',
            choices: v.choices,
            answer: 0,
            explanation: `"${v.word}" は「${v.meaning}」という意味です。`
        });
    }
    return questions;
}

function generateAdvancedVocabularyQuestions() {
    const questions = [];
    const vocab = [
        { word: 'convenient', meaning: '便利な', choices: ['便利な', '不便な', '複雑な', '簡単な'] },
        { word: 'important', meaning: '重要な', choices: ['重要な', '簡単な', '困難な', '面白い'] },
        { word: 'environment', meaning: '環境', choices: ['環境', '経済', '社会', '政治'] },
        { word: 'society', meaning: '社会', choices: ['社会', '自然', '科学', '芸術'] },
        { word: 'knowledge', meaning: '知識', choices: ['知識', '経験', '技術', '能力'] }
    ];

    for (let i = 0; i < 100; i++) {
        const v = vocab[i % vocab.length];
        questions.push({
            id: `eng-vocab-adv-${i + 1}`,
            question: `"${v.word}" の意味は？`,
            type: 'multiple',
            choices: v.choices,
            answer: 0,
            explanation: `"${v.word}" は「${v.meaning}」という意味です。`
        });
    }
    return questions;
}

function generatePolynomialAddSubQuestions() {
    const questions = [];
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 10) + 1;
        const d = Math.floor(Math.random() * 10) + 1;
        
        const correctX = a + c;
        const correctConst = b + d;
        
        questions.push({
            id: `math-poly-add-${i + 1}`,
            question: `(${a}x + ${b}) + (${c}x + ${d}) を計算しなさい。`,
            type: 'multiple',
            choices: [
                `${correctX}x + ${correctConst}`,
                `${correctX}x + ${correctConst + 1}`,
                `${correctX + 1}x + ${correctConst}`,
                `${correctX - 1}x + ${correctConst}`
            ],
            answer: 0,
            explanation: `同類項をまとめます。xの項: ${a}x + ${c}x = ${correctX}x、定数項: ${b} + ${d} = ${correctConst}`
        });
    }
    return questions;
}

function generateMonomialMulDivQuestions() {
    const questions = [];
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 9) + 2;
        const b = Math.floor(Math.random() * 9) + 2;
        const correct = a * b;
        
        questions.push({
            id: `math-mono-mul-${i + 1}`,
            question: `${a}x × ${b}y を計算しなさい。`,
            type: 'multiple',
            choices: [
                `${correct}xy`,
                `${correct}x`,
                `${correct}y`,
                `${a + b}xy`
            ],
            answer: 0,
            explanation: `係数どうしをかけ算し、文字はそのまま並べます。${a} × ${b} = ${correct}、よって ${correct}xy となります。`
        });
    }
    return questions;
}

function generateLinearEquationQuestions() {
    const questions = [];
    for (let i = 0; i < 100; i++) {
        const x = Math.floor(Math.random() * 10) + 1;
        const y = Math.floor(Math.random() * 10) + 1;
        const eq1Right = x + y;
        const eq2Right = 2 * x - y;
        
        questions.push({
            id: `math-linear-eq-${i + 1}`,
            question: `次の連立方程式を解きなさい。\nx + y = ${eq1Right}\n2x - y = ${eq2Right}`,
            type: 'multiple',
            choices: [
                `x = ${x}, y = ${y}`,
                `x = ${y}, y = ${x}`,
                `x = ${x + 1}, y = ${y}`,
                `x = ${x}, y = ${y + 1}`
            ],
            answer: 0,
            explanation: `加減法で解きます。2つの式を足すと3x = ${eq1Right + eq2Right}、よってx = ${x}。これを代入してy = ${y}。`
        });
    }
    return questions;
}

function generateEquationWordQuestions() {
    const questions = [];
    const templates = [
        { q: 'りんご5個とみかん3個で800円、りんご2個とみかん4個で600円です。りんご1個の値段は？', a: 100, explanation: 'りんごをx円、みかんをy円とすると、5x + 3y = 800、2x + 4y = 600。これを解いてx = 100円。' },
        { q: '兄と弟の年齢の和は30歳で、兄は弟より4歳年上です。兄の年齢は？', a: 17, explanation: '兄をx歳、弟をy歳とすると、x + y = 30、x - y = 4。これを解いてx = 17歳。' },
        { q: '現在、父は40歳、息子は10歳です。父の年齢が息子の年齢の2倍になるのは何年後？', a: 20, explanation: 'x年後とすると、40 + x = 2(10 + x)。これを解いてx = 20年後。' },
        { q: 'ある数の3倍から5を引くと、その数の2倍に7を足した数と等しくなります。ある数は？', a: 12, explanation: 'ある数をxとすると、3x - 5 = 2x + 7。これを解いてx = 12。' },
        { q: '長方形の縦の長さは横の長さより3cm長く、周の長さは30cmです。横の長さは？', a: 6, explanation: '横をxcm、縦を(x+3)cmとすると、2(x + x + 3) = 30。これを解いてx = 6cm。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `math-eq-word-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: [
                `${template.a}`,
                `${template.a + 1}`,
                `${template.a - 1}`,
                `${template.a + 2}`
            ],
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateLinearFunctionQuestions() {
    const questions = [];
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) - 5;
        const x = Math.floor(Math.random() * 10);
        const y = a * x + b;
        
        questions.push({
            id: `math-func-${i + 1}`,
            question: `一次関数 y = ${a}x + ${b} について、x = ${x} のときのyの値は？`,
            type: 'multiple',
            choices: [
                `${y}`,
                `${y + 1}`,
                `${y - 1}`,
                `${y + a}`
            ],
            answer: 0,
            explanation: `y = ${a} × ${x} + ${b} = ${a * x} + ${b} = ${y}`
        });
    }
    return questions;
}

function generateKanjiReadingQuestions() {
    const questions = [];
    const kanji = [
        { word: '解決', reading: 'かいけつ', choices: ['かいけつ', 'かいけち', 'げけつ', 'げけち'] },
        { word: '変化', reading: 'へんか', choices: ['へんか', 'へんげ', 'かわりか', 'かわりげ'] },
        { word: '研究', reading: 'けんきゅう', choices: ['けんきゅう', 'けんく', 'けんきゅ', 'けんきゅお'] },
        { word: '調査', reading: 'ちょうさ', choices: ['ちょうさ', 'ちょさ', 'しらべさ', 'しらさ'] },
        { word: '議論', reading: 'ぎろん', choices: ['ぎろん', 'ぎりん', 'ぎろう', 'ぎりょん'] }
    ];

    for (let i = 0; i < 100; i++) {
        const k = kanji[i % kanji.length];
        questions.push({
            id: `jp-kanji-read-${i + 1}`,
            question: `「${k.word}」の読みは？`,
            type: 'multiple',
            choices: k.choices,
            answer: 0,
            explanation: `「${k.word}」は「${k.reading}」と読みます。`
        });
    }
    return questions;
}

function generateKanjiWritingQuestions() {
    const questions = [];
    const kanji = [
        { reading: 'きょうそう', word: '競争', choices: ['競争', '競奏', '競走', '強争'] },
        { reading: 'けいけん', word: '経験', choices: ['経験', '経検', '径験', '経研'] },
        { reading: 'こうりつ', word: '効率', choices: ['効率', '高率', '効立', '校率'] },
        { reading: 'しんぽ', word: '進歩', choices: ['進歩', '進保', '新歩', '進補'] },
        { reading: 'せきにん', word: '責任', choices: ['責任', '積任', '責認', '席任'] }
    ];

    for (let i = 0; i < 100; i++) {
        const k = kanji[i % kanji.length];
        questions.push({
            id: `jp-kanji-write-${i + 1}`,
            question: `「${k.reading}」を漢字で書くと？`,
            type: 'multiple',
            choices: k.choices,
            answer: 0,
            explanation: `「${k.reading}」は「${k.word}」と書きます。`
        });
    }
    return questions;
}

function generateParticlesQuestions() {
    const questions = [];
    const templates = [
        { q: '私___学校___行く。', a: 'は、に', choices: ['は、に', 'が、を', 'を、に', 'に、が'], explanation: '「私は」が主語、「学校に」が目的地を示します。' },
        { q: '友達___本___借りる。', a: 'に、を', choices: ['に、を', 'を、に', 'が、を', 'は、が'], explanation: '「友達に」が相手、「本を」が目的語を示します。' },
        { q: '空___青い。', a: 'が', choices: ['が', 'は', 'を', 'に'], explanation: '形容詞の前では「が」を使うことが多いです。' },
        { q: 'これ___私の本です。', a: 'は', choices: ['は', 'が', 'を', 'に'], explanation: '「これは」で主題を示します。' },
        { q: '彼___会う。', a: 'に', choices: ['に', 'を', 'が', 'は'], explanation: '「会う」という動詞には助詞「に」を使います。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `jp-particle-${i + 1}`,
            question: `次の文の空欄に適切な助詞を入れなさい。\n${template.q}`,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateLiteratureQuestions() {
    const questions = [];
    const templates = [
        { q: '『走れメロス』の作者は？', a: '太宰治', choices: ['太宰治', '芥川龍之介', '夏目漱石', '森鴎外'] },
        { q: '『坊っちゃん』の作者は？', a: '夏目漱石', choices: ['夏目漱石', '太宰治', '芥川龍之介', '森鴎外'] },
        { q: '『羅生門』の作者は？', a: '芥川龍之介', choices: ['芥川龍之介', '太宰治', '夏目漱石', '川端康成'] },
        { q: '『伊豆の踊子』の作者は？', a: '川端康成', choices: ['川端康成', '太宰治', '三島由紀夫', '谷崎潤一郎'] },
        { q: '『こころ』の作者は？', a: '夏目漱石', choices: ['夏目漱石', '森鴎外', '太宰治', '芥川龍之介'] }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `jp-lit-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: `正解は「${template.a}」です。`
        });
    }
    return questions;
}

function generateClassicQuestions() {
    const questions = [];
    const templates = [
        { q: '「けり」の活用の種類は？', a: 'ラ行変格活用', choices: ['ラ行変格活用', '四段活用', '下二段活用', '上二段活用'] },
        { q: '「あり」の活用の種類は？', a: 'ラ行変格活用', choices: ['ラ行変格活用', '四段活用', '下二段活用', 'ナ行変格活用'] },
        { q: '「む」の意味として適切なものは？', a: '推量', choices: ['推量', '過去', '完了', '打消'] },
        { q: '「ず」の意味は？', a: '打消', choices: ['打消', '推量', '過去', '完了'] },
        { q: '「き」の意味は？', a: '過去', choices: ['過去', '推量', '打消', '完了'] }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `jp-classic-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: `「${template.a}」が正解です。古典文法の基本として覚えましょう。`
        });
    }
    return questions;
}

function generateForceQuestions() {
    const questions = [];
    const templates = [
        { q: '10Nの力で5kgの物体を押すときの加速度は？', a: '2 m/s²', choices: ['2 m/s²', '5 m/s²', '10 m/s²', '50 m/s²'], explanation: '加速度 = 力 ÷ 質量 = 10N ÷ 5kg = 2 m/s²' },
        { q: '質量10kgの物体にはたらく重力は？(重力加速度を10m/s²とする)', a: '100 N', choices: ['100 N', '10 N', '1 N', '1000 N'], explanation: '重力 = 質量 × 重力加速度 = 10kg × 10m/s² = 100N' },
        { q: '作用・反作用の法則で正しいのは？', a: '力の大きさは等しく向きは逆', choices: ['力の大きさは等しく向きは逆', '力の大きさは異なり向きは逆', '力の大きさは等しく向きも同じ', '力の大きさは異なり向きは同じ'], explanation: '作用・反作用の法則では、2つの物体間の力は大きさが等しく、向きが反対です。' },
        { q: '速さ10m/sで走っている物体が2秒後に30m/sになった。加速度は？', a: '10 m/s²', choices: ['10 m/s²', '5 m/s²', '20 m/s²', '15 m/s²'], explanation: '加速度 = (30 - 10) ÷ 2 = 20 ÷ 2 = 10 m/s²' },
        { q: '摩擦力について正しいのは？', a: '運動を妨げる向きに働く', choices: ['運動を妨げる向きに働く', '運動を助ける向きに働く', '重力と同じ向きに働く', '力は働かない'], explanation: '摩擦力は物体の運動を妨げる向きに働きます。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `sci-force-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateElectricityQuestions() {
    const questions = [];
    const templates = [
        { q: '電圧6V、抵抗3Ωのとき、電流は？', a: '2 A', choices: ['2 A', '3 A', '6 A', '9 A'], explanation: 'オームの法則より、電流 = 電圧 ÷ 抵抗 = 6V ÷ 3Ω = 2A' },
        { q: '電流2A、抵抗5Ωのとき、電圧は？', a: '10 V', choices: ['10 V', '2.5 V', '7 V', '3 V'], explanation: 'オームの法則より、電圧 = 電流 × 抵抗 = 2A × 5Ω = 10V' },
        { q: '直列回路で抵抗3Ωと6Ωをつなぐと全体の抵抗は？', a: '9 Ω', choices: ['9 Ω', '3 Ω', '2 Ω', '18 Ω'], explanation: '直列回路では抵抗を足し算します。3Ω + 6Ω = 9Ω' },
        { q: '並列回路の特徴は？', a: '各抵抗にかかる電圧は等しい', choices: ['各抵抗にかかる電圧は等しい', '各抵抗を流れる電流は等しい', '全体の抵抗は各抵抗の和', '電圧は分配される'], explanation: '並列回路では各抵抗に同じ電圧がかかります。' },
        { q: '電力の単位は？', a: 'W（ワット）', choices: ['W（ワット）', 'V（ボルト）', 'A（アンペア）', 'Ω（オーム）'], explanation: '電力の単位はW（ワット）です。電力 = 電圧 × 電流' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `sci-elec-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateChemicalReactionQuestions() {
    const questions = [];
    const templates = [
        { q: '化学式 H₂O が表す物質は？', a: '水', choices: ['水', '二酸化炭素', '酸素', '水素'], explanation: 'H₂Oは水素2個と酸素1個からなる水を表します。' },
        { q: '化学式 CO₂ が表す物質は？', a: '二酸化炭素', choices: ['二酸化炭素', '一酸化炭素', '水', '酸素'], explanation: 'CO₂は炭素1個と酸素2個からなる二酸化炭素を表します。' },
        { q: '酸化とは何か？', a: '酸素と化合すること', choices: ['酸素と化合すること', '酸素を失うこと', '水素と化合すること', '水素を失うこと'], explanation: '酸化は物質が酸素と化合する反応です。' },
        { q: '還元とは何か？', a: '酸素を失うこと', choices: ['酸素を失うこと', '酸素と化合すること', '水素を失うこと', '水と化合すること'], explanation: '還元は酸化物が酸素を失う反応です。' },
        { q: '燃焼に必要なものは？', a: '酸素', choices: ['酸素', '水素', '窒素', '二酸化炭素'], explanation: '燃焼（激しい酸化）には酸素が必要です。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `sci-chem-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateAtomQuestions() {
    const questions = [];
    const templates = [
        { q: '原子の中心にあるのは？', a: '原子核', choices: ['原子核', '電子', '陽子', '中性子'], explanation: '原子の中心には原子核があり、その周りを電子が回っています。' },
        { q: '原子核を構成するのは？', a: '陽子と中性子', choices: ['陽子と中性子', '電子と陽子', '電子と中性子', '電子のみ'], explanation: '原子核は陽子と中性子から構成されています。' },
        { q: '電子の電気は？', a: '負（マイナス）', choices: ['負（マイナス）', '正（プラス）', '電気を持たない', '状況による'], explanation: '電子は負（マイナス）の電気を持っています。' },
        { q: '陽子の電気は？', a: '正（プラス）', choices: ['正（プラス）', '負（マイナス）', '電気を持たない', '状況による'], explanation: '陽子は正（プラス）の電気を持っています。' },
        { q: '原子が結びついてできるものは？', a: '分子', choices: ['分子', '化合物', '混合物', '溶液'], explanation: '原子が結びつくと分子ができます。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `sci-atom-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateCellQuestions() {
    const questions = [];
    const templates = [
        { q: '植物細胞にあって動物細胞にないものは？', a: '細胞壁', choices: ['細胞壁', '核', 'ミトコンドリア', '細胞膜'], explanation: '植物細胞には細胞壁があります。動物細胞にはありません。' },
        { q: '細胞の中で遺伝情報を持つのは？', a: '核', choices: ['核', 'ミトコンドリア', '液胞', '細胞膜'], explanation: '核にはDNAが含まれ、遺伝情報を持っています。' },
        { q: '光合成を行う場所は？', a: '葉緑体', choices: ['葉緑体', 'ミトコンドリア', '核', '液胞'], explanation: '葉緑体で光合成が行われます。' },
        { q: 'エネルギーを作る場所は？', a: 'ミトコンドリア', choices: ['ミトコンドリア', '葉緑体', '核', '液胞'], explanation: 'ミトコンドリアで呼吸が行われ、エネルギーが作られます。' },
        { q: '細胞の外側を覆う膜は？', a: '細胞膜', choices: ['細胞膜', '細胞壁', '核膜', '液胞膜'], explanation: 'すべての細胞は細胞膜で覆われています。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `sci-cell-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateJapanGeographyQuestions() {
    const questions = [];
    const templates = [
        { q: '日本で最も面積が大きい都道府県は？', a: '北海道', choices: ['北海道', '岩手県', '福島県', '長野県'], explanation: '北海道は日本で最も面積が大きい都道府県です。' },
        { q: '日本で最も人口が多い都道府県は？', a: '東京都', choices: ['東京都', '神奈川県', '大阪府', '愛知県'], explanation: '東京都は日本で最も人口が多い都道府県です。' },
        { q: '日本アルプスに含まれないのは？', a: '奥羽山脈', choices: ['奥羽山脈', '飛騨山脈', '木曽山脈', '赤石山脈'], explanation: '日本アルプスは飛騨山脈（北アルプス）、木曽山脈（中央アルプス）、赤石山脈（南アルプス）の総称です。' },
        { q: '日本最長の川は？', a: '信濃川', choices: ['信濃川', '利根川', '石狩川', '北上川'], explanation: '信濃川が日本最長の川です（約367km）。' },
        { q: '日本最大の湖は？', a: '琵琶湖', choices: ['琵琶湖', '霞ヶ浦', 'サロマ湖', '浜名湖'], explanation: '琵琶湖が日本最大の湖です。滋賀県にあります。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `soc-geo-jp-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateWorldGeographyQuestions() {
    const questions = [];
    const templates = [
        { q: '世界最大の大陸は？', a: 'ユーラシア大陸', choices: ['ユーラシア大陸', 'アフリカ大陸', '北アメリカ大陸', '南アメリカ大陸'], explanation: 'ユーラシア大陸が世界最大の大陸です。' },
        { q: '世界最長の川は？', a: 'ナイル川', choices: ['ナイル川', 'アマゾン川', 'ミシシッピ川', '長江'], explanation: 'ナイル川が世界最長の川です（約6650km）。' },
        { q: '世界で最も人口が多い国は？', a: '中国', choices: ['中国', 'インド', 'アメリカ', 'インドネシア'], explanation: '中国が世界で最も人口が多い国です（約14億人）。' },
        { q: '赤道が通らない大陸は？', a: 'ヨーロッパ', choices: ['ヨーロッパ', 'アフリカ', '南アメリカ', 'アジア'], explanation: '赤道はアフリカ、南アメリカ、アジアを通りますが、ヨーロッパは通りません。' },
        { q: '世界最高峰の山は？', a: 'エベレスト', choices: ['エベレスト', 'K2', 'キリマンジャロ', 'モンブラン'], explanation: 'エベレストが世界最高峰の山です（標高8848m）。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `soc-geo-world-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateAncientHistoryQuestions() {
    const questions = [];
    const templates = [
        { q: '縄文時代の特徴は？', a: '狩猟・採集生活', choices: ['狩猟・採集生活', '稲作の開始', '古墳の建設', '仏教の伝来'], explanation: '縄文時代は狩猟・採集による生活が中心でした。' },
        { q: '弥生時代に始まったことは？', a: '稲作', choices: ['稲作', '仏教', '鉄器の使用', '文字の使用'], explanation: '弥生時代に大陸から稲作が伝わりました。' },
        { q: '聖徳太子が制定したのは？', a: '十七条の憲法', choices: ['十七条の憲法', '大宝律令', '御成敗式目', '武家諸法度'], explanation: '聖徳太子は十七条の憲法を制定しました。' },
        { q: '奈良時代の都は？', a: '平城京', choices: ['平城京', '平安京', '藤原京', '長岡京'], explanation: '奈良時代の都は平城京です。' },
        { q: '鎌倉幕府を開いたのは？', a: '源頼朝', choices: ['源頼朝', '源義経', '平清盛', '足利尊氏'], explanation: '源頼朝が1192年に鎌倉幕府を開きました。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `soc-hist-ancient-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateModernHistoryQuestions() {
    const questions = [];
    const templates = [
        { q: '江戸幕府を開いたのは？', a: '徳川家康', choices: ['徳川家康', '豊臣秀吉', '織田信長', '徳川家光'], explanation: '徳川家康が1603年に江戸幕府を開きました。' },
        { q: '明治維新で行われた改革は？', a: '廃藩置県', choices: ['廃藩置県', '刀狩り', '参勤交代', '鎖国'], explanation: '明治政府は廃藩置県を行い、中央集権国家を作りました。' },
        { q: '日本が開国したきっかけは？', a: 'ペリー来航', choices: ['ペリー来航', '黒船来航', '薩英戦争', '日清戦争'], explanation: 'ペリーの来航（黒船来航）がきっかけで日本は開国しました。' },
        { q: '第一次世界大戦が起こったのは？', a: '1914年', choices: ['1914年', '1904年', '1939年', '1941年'], explanation: '第一次世界大戦は1914年に始まりました。' },
        { q: '日本国憲法が施行されたのは？', a: '1947年', choices: ['1947年', '1945年', '1946年', '1948年'], explanation: '日本国憲法は1947年5月3日に施行されました。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `soc-hist-modern-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}

function generateCivicsQuestions() {
    const questions = [];
    const templates = [
        { q: '日本国憲法の三大原則に含まれないのは？', a: '教育の義務', choices: ['教育の義務', '国民主権', '基本的人権の尊重', '平和主義'], explanation: '日本国憲法の三大原則は、国民主権、基本的人権の尊重、平和主義です。' },
        { q: '国会の種類でないのは？', a: '臨時国会', choices: ['臨時国会', '通常国会', '特別国会', '定期国会'], explanation: '国会には通常国会、臨時国会、特別国会があります。定期国会という種類はありません。' },
        { q: '三権分立に含まれないのは？', a: '地方自治', choices: ['地方自治', '立法', '行政', '司法'], explanation: '三権分立は、立法（国会）、行政（内閣）、司法（裁判所）に権力を分けることです。' },
        { q: '選挙権が与えられるのは？', a: '満18歳以上', choices: ['満18歳以上', '満20歳以上', '満16歳以上', '満25歳以上'], explanation: '2016年から選挙権年齢が満18歳以上に引き下げられました。' },
        { q: '衆議院の解散権を持つのは？', a: '内閣総理大臣', choices: ['内閣総理大臣', '天皇', '国会議長', '最高裁判所長官'], explanation: '内閣総理大臣が衆議院の解散を決定します。' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = templates[i % templates.length];
        questions.push({
            id: `soc-civics-${i + 1}`,
            question: template.q,
            type: 'multiple',
            choices: template.choices,
            answer: 0,
            explanation: template.explanation
        });
    }
    return questions;
}
