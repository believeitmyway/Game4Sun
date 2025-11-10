const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'questions');

function padNumber(num) {
  return num.toString().padStart(3, '0');
}

function createIdGenerator(prefix) {
  let counter = 1;
  return () => `${prefix}-${padNumber(counter++)}`;
}

function formatNumber(num) {
  const parts = Math.round(num).toString().split('');
  let formatted = '';
  let count = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    formatted = parts[i] + formatted;
    count += 1;
    if (count === 3 && i !== 0) {
      formatted = ',' + formatted;
      count = 0;
    }
  }
  return formatted;
}

function formatPa(value) {
  return `${formatNumber(Math.round(value))} Pa`;
}

function addQuestion(questions, nextId, question, choices, explanation) {
  questions.push({
    id: nextId(),
    question,
    type: 'multiple',
    choices,
    answer: 0,
    explanation
  });
}

function mapFromData(data, nextId) {
  return data.map(({ question, correct, distractors, explanation }) => ({
    id: nextId(),
    question,
    type: 'multiple',
    choices: [correct, ...distractors],
    answer: 0,
    explanation
  }));
}

function clampPositive(value, minimum) {
  return value > 0 ? value : minimum;
}

function generateForceAreaQuestions(nextId) {
  const items = [
    { context: '床に置かれた木箱', force: 160, area: 0.4, pressure: 400 },
    { context: '机の上の辞書の束', force: 180, area: 0.3, pressure: 600 },
    { context: '雪の上に置いたスキー板', force: 270, area: 0.9, pressure: 300 },
    { context: '工事現場の足場板', force: 350, area: 0.5, pressure: 700 },
    { context: '体育館の分厚いマット', force: 450, area: 0.75, pressure: 600 },
    { context: '棚に置かれた花瓶', force: 120, area: 0.24, pressure: 500 },
    { context: '床に片膝をついたときの膝頭', force: 360, area: 0.12, pressure: 3000 },
    { context: '幅の広い長靴の片足', force: 520, area: 0.13, pressure: 4000 },
    { context: '釘の頭にかけた力', force: 80, area: 0.02, pressure: 4000 },
    { context: '教室の椅子1本の脚', force: 300, area: 0.03, pressure: 10000 },
    { context: '油圧プレスのピストン', force: 2500, area: 0.25, pressure: 10000 },
    { context: '雪原で使うかんじき', force: 480, area: 0.8, pressure: 600 },
    { context: '実験用ばねばかりで押す木板', force: 540, area: 0.18, pressure: 3000 },
    { context: '押し花づくりの重し', force: 210, area: 0.35, pressure: 600 },
    { context: '分銅をのせた小さなピストン', force: 240, area: 0.08, pressure: 3000 },
    { context: '気密容器のふた', force: 600, area: 0.15, pressure: 4000 },
    { context: '床に押し付けた掃除機のヘッド', force: 320, area: 0.16, pressure: 2000 },
    { context: '科学室のジャッキ', force: 1800, area: 0.18, pressure: 10000 }
  ];

  const questions = [];

  for (const item of items) {
    const correct = formatPa(item.pressure);
    const variation = Math.max(100, Math.round(item.pressure * 0.1));
    const variationLarge = Math.max(200, Math.round(item.pressure * 0.25));
    const distractor1 = formatPa(item.pressure + variation);
    const distractor2 = formatPa(clampPositive(item.pressure - variation, item.pressure + variationLarge));
    const distractor3 = formatPa(item.pressure + variationLarge);
    const explanation = `${item.context}に働く圧力は p = F ÷ S で求められ、${item.force}N ÷ ${item.area}m² = ${item.pressure}Pa になります。`;
    addQuestion(
      questions,
      nextId,
      `${item.context}が ${item.area}m² の面に垂直に ${item.force}N の力を及ぼすとき、面にかかる圧力として正しい値はどれですか。`,
      [correct, distractor1, distractor2, distractor3],
      explanation
    );
  }

  return questions;
}

function generateWaterPressureQuestions(nextId) {
  const g = 9.8;
  const items = [
    { medium: '水', density: 1000, depth: 0.8, context: '水槽の底' },
    { medium: '水', density: 1000, depth: 1.2, context: '川の中' },
    { medium: '水', density: 1000, depth: 1.5, context: '潜水プール' },
    { medium: '水', density: 1000, depth: 2.0, context: 'ダムの浅い部分' },
    { medium: '水', density: 1000, depth: 2.5, context: '海辺の浅瀬' },
    { medium: '海水', density: 1025, depth: 1.0, context: '海岸の潜水地点' },
    { medium: '海水', density: 1025, depth: 1.8, context: 'シュノーケリングの深さ' },
    { medium: '海水', density: 1025, depth: 2.2, context: '沿岸の観測点' },
    { medium: '淡水', density: 1000, depth: 0.5, context: '理科室の実験水槽' },
    { medium: '淡水', density: 1000, depth: 1.8, context: '湖の浅瀬' },
    { medium: '油', density: 900, depth: 0.7, context: '透明な油槽' },
    { medium: '油', density: 900, depth: 1.3, context: '工場の実験装置' },
    { medium: '水銀', density: 13600, depth: 0.12, context: '水銀槽の底' },
    { medium: '水', density: 1000, depth: 3.0, context: '消防用貯水槽' },
    { medium: '水', density: 1000, depth: 2.8, context: '農業用ため池' },
    { medium: '海水', density: 1025, depth: 3.2, context: '防波堤付近' },
    { medium: '淡水', density: 1000, depth: 0.9, context: '実験用水槽の観測点' },
    { medium: '油', density: 850, depth: 0.6, context: '低密度の油槽' }
  ];

  const questions = [];

  for (const item of items) {
    const pressure = Math.round(item.density * g * item.depth);
    const formatted = formatPa(pressure);
    const variation = Math.max(500, Math.round(pressure * 0.08));
    const larger = Math.max(800, Math.round(pressure * 0.15));
    const distractor1 = formatPa(pressure + variation);
    const distractor2 = formatPa(clampPositive(pressure - variation, pressure + larger));
    const distractor3 = formatPa(pressure + larger);
    const explanation = `${item.context}での${item.medium}の圧力は p = ρgh で計算でき、${item.density}kg/m³ × 9.8m/s² × ${item.depth}m ≒ ${pressure}Pa となります。`;
    addQuestion(
      questions,
      nextId,
      `${item.context}で${item.depth}m の深さにある物体に働く${item.medium}の圧力として適切な値はどれですか。（重力加速度を 9.8m/s² とする）`,
      [formatted, distractor1, distractor2, distractor3],
      explanation
    );
  }

  return questions;
}

function generateHydraulicQuestions(nextId) {
  const items = [
    { context: '自動車整備工場のリフト', inputForce: 300, inputArea: 0.01, outputArea: 0.2 },
    { context: '油圧ジャッキ', inputForce: 150, inputArea: 0.015, outputArea: 0.12 },
    { context: '工場の成形プレス', inputForce: 500, inputArea: 0.02, outputArea: 0.3 },
    { context: '実験用油圧装置', inputForce: 80, inputArea: 0.008, outputArea: 0.08 },
    { context: 'ブレーキ装置のマスターシリンダー', inputForce: 120, inputArea: 0.01, outputArea: 0.04 },
    { context: '建設現場の油圧クレーン', inputForce: 400, inputArea: 0.025, outputArea: 0.25 },
    { context: 'パスカルの原理実験装置', inputForce: 60, inputArea: 0.006, outputArea: 0.06 },
    { context: '水圧式プレス機', inputForce: 250, inputArea: 0.02, outputArea: 0.18 },
    { context: '油圧ディスクブレーキ', inputForce: 90, inputArea: 0.008, outputArea: 0.05 },
    { context: '油圧式ドアクローザ', inputForce: 40, inputArea: 0.004, outputArea: 0.02 },
    { context: 'ハサミ型油圧カッター', inputForce: 220, inputArea: 0.012, outputArea: 0.09 },
    { context: '車いす用昇降機', inputForce: 180, inputArea: 0.015, outputArea: 0.1 },
    { context: '造船所の油圧プレス', inputForce: 600, inputArea: 0.025, outputArea: 0.28 },
    { context: '油圧式土木圧縮機', inputForce: 350, inputArea: 0.018, outputArea: 0.2 },
    { context: '理科室の注射器実験', inputForce: 50, inputArea: 0.007, outputArea: 0.035 },
    { context: '油圧ブレーキのキャリパー', inputForce: 110, inputArea: 0.009, outputArea: 0.045 }
  ];

  const questions = [];

  for (const item of items) {
    const pressure = item.inputForce / item.inputArea;
    const outputForce = pressure * item.outputArea;
    const correct = `${Math.round(outputForce)}N`;
    const delta = Math.max(10, Math.round(outputForce * 0.1));
    const larger = Math.max(20, Math.round(outputForce * 0.2));
    const distractor1 = `${Math.round(outputForce + delta)}N`;
    const distractor2 = `${Math.round(clampPositive(outputForce - delta, outputForce + larger))}N`;
    const distractor3 = `${Math.round(outputForce + larger)}N`;
    const explanation = `${item.context}ではパスカルの原理により圧力が等しく伝わり、出力側の力は F = p × S = (${item.inputForce}N ÷ ${item.inputArea}m²) × ${item.outputArea}m² ≒ ${Math.round(outputForce)}N になります。`;
    addQuestion(
      questions,
      nextId,
      `${item.context}で、入力側に ${item.inputForce}N の力を加えたとき、面積 ${item.outputArea}m² の出力ピストンが生み出す力として最も適切なものはどれですか。`,
      [correct, distractor1, distractor2, distractor3],
      explanation
    );
  }

  return questions;
}

function generateAltitudePressureQuestions(nextId) {
  const seaLevel = 1013;
  const dropPer100m = 12;
  const items = [
    { location: '標高 200m の丘', altitude: 200, feature: '緩やかな丘陵地' },
    { location: '標高 350m の台地', altitude: 350, feature: '台地の上' },
    { location: '標高 500m の山村', altitude: 500, feature: '内陸の山村' },
    { location: '標高 650m の観測所', altitude: 650, feature: '高原の気象観測所' },
    { location: '標高 800m の展望台', altitude: 800, feature: '高原の展望台' },
    { location: '標高 950m の牧場', altitude: 950, feature: '高地の牧場' },
    { location: '標高 1100m の山小屋', altitude: 1100, feature: '山小屋' },
    { location: '標高 1250m の湿原', altitude: 1250, feature: '高層湿原' },
    { location: '標高 1400m の山頂広場', altitude: 1400, feature: '山頂広場' },
    { location: '標高 1550m の湖', altitude: 1550, feature: '山上の湖' },
    { location: '標高 1700m の研究施設', altitude: 1700, feature: '山岳研究施設' },
    { location: '標高 1850m の気象レーダー基地', altitude: 1850, feature: '気象レーダー基地' },
    { location: '標高 2000m の観測塔', altitude: 2000, feature: '高地観測塔' },
    { location: '標高 2200m の山頂', altitude: 2200, feature: '主峰の山頂' },
    { location: '標高 2400m の休憩所', altitude: 2400, feature: '山の休憩所' },
    { location: '標高 2600m の稜線', altitude: 2600, feature: '稜線の観測点' }
  ];

  const questions = [];

  for (const item of items) {
    const decrease = (item.altitude / 100) * dropPer100m;
    const pressure = Math.round(seaLevel - decrease);
    const correct = `${pressure}hPa`;
    const delta = Math.max(3, Math.round(decrease * 0.2));
    const distractor1 = `${pressure + delta}hPa`;
    const distractor2 = `${pressure - delta > 0 ? pressure - delta : pressure + delta + 6}hPa`;
    const distractor3 = `${pressure + delta + 6}hPa`;
    const explanation = `${item.feature}では標高が ${item.altitude}m なので、標準大気圧 1013hPa から標高100mあたり約12hPaずつ低下すると考えると ${pressure}hPa 程度になります。`;
    addQuestion(
      questions,
      nextId,
      `${item.location}で測定される気圧のおおよその値として最も適切なものはどれですか。（標高100m 上昇するごとに約12hPa 低下するとする）`,
      [correct, distractor1, distractor2, distractor3],
      explanation
    );
  }

  return questions;
}

function generateBarometerTrendQuestions(nextId) {
  const scenarios = [
    { location: '沿岸部の観測所', start: 1010, end: 998, duration: '6時間', trend: 'down' },
    { location: '内陸の都市', start: 1008, end: 996, duration: '4時間', trend: 'down' },
    { location: '離島の気象台', start: 1005, end: 992, duration: '8時間', trend: 'down' },
    { location: '山間部の測候所', start: 1002, end: 990, duration: '5時間', trend: 'down' },
    { location: '漁港の観測点', start: 1007, end: 994, duration: '3時間', trend: 'down' },
    { location: '湾岸の都市', start: 1013, end: 1000, duration: '12時間', trend: 'down' },
    { location: '高原の観測所', start: 1000, end: 988, duration: '6時間', trend: 'down' },
    { location: '日本海沿岸の町', start: 1006, end: 994, duration: '6時間', trend: 'down' },
    { location: '太平洋側の都市', start: 1004, end: 1015, duration: '5時間', trend: 'up' },
    { location: '山麓の気象観測点', start: 998, end: 1009, duration: '6時間', trend: 'up' },
    { location: '農村部の観測所', start: 1001, end: 1012, duration: '7時間', trend: 'up' },
    { location: '空港の気象台', start: 1003, end: 1014, duration: '4時間', trend: 'up' },
    { location: '港町の観測所', start: 1000, end: 1011, duration: '9時間', trend: 'up' },
    { location: '都市部のビル屋上', start: 999, end: 1010, duration: '8時間', trend: 'up' },
    { location: '湖畔の観測点', start: 1002, end: 1013, duration: '10時間', trend: 'up' },
    { location: '盆地の測候所', start: 997, end: 1008, duration: '6時間', trend: 'up' }
  ];

  const downChoices = [
    '低気圧が接近し、雨や風が強まりやすい',
    '移動性高気圧が張り出し、晴れて乾燥しやすい',
    '寒冷前線が遠ざかり、気温が急上昇する',
    '高気圧の中心が通過して風が弱まる'
  ];

  const upChoices = [
    '高気圧が張り出し、晴れて安定した天気になりやすい',
    '台風が接近して雨と風が急に強まる',
    '温暖前線が通過して雨が長く続く',
    '発達した低気圧が通過して気圧がさらに下がる'
  ];

  const questions = [];

  for (const scenario of scenarios) {
    if (scenario.trend === 'down') {
      const explanation = `${scenario.location}では気圧が ${scenario.duration} で ${scenario.start}hPa から ${scenario.end}hPa まで下がっており、低気圧の接近などで天気が崩れやすくなります。`;
      addQuestion(
        questions,
        nextId,
        `${scenario.location}では気圧が ${scenario.duration} で ${scenario.start}hPa から ${scenario.end}hPa へと下がりました。考えられる状況として最も適切なものはどれですか。`,
        downChoices,
        explanation
      );
    } else {
      const explanation = `${scenario.location}では気圧が ${scenario.duration} で ${scenario.start}hPa から ${scenario.end}hPa まで上がっており、高気圧に覆われて天気が安定しやすい状態です。`;
      addQuestion(
        questions,
        nextId,
        `${scenario.location}では気圧が ${scenario.duration} で ${scenario.start}hPa から ${scenario.end}hPa へと上がりました。考えられる状況として最も適切なものはどれですか。`,
        upChoices,
        explanation
      );
    }
  }

  return questions;
}

function generateUnitConversionQuestions(nextId) {
  const data = [
    {
      question: '標準気圧 1013hPa は kPa で表すとおよそいくつになりますか。',
      correct: '101.3kPa',
      distractors: ['10.13kPa', '1.013kPa', '1000kPa'],
      explanation: 'hPa を kPa に直すには 10 で割ります。1013hPa ÷ 10 = 101.3kPa です。'
    },
    {
      question: '100kPa を hPa に換算するといくつになりますか。',
      correct: '1000hPa',
      distractors: ['100hPa', '10hPa', '10,000hPa'],
      explanation: 'kPa を hPa に直すには 10 を掛けます。100kPa × 10 = 1000hPa です。'
    },
    {
      question: '980hPa は Pa で表すとおよそいくつになりますか。',
      correct: '98,000Pa',
      distractors: ['9,800Pa', '980,000Pa', '9,800,000Pa'],
      explanation: '1hPa = 100Pa なので、980hPa × 100 = 98,000Pa となります。'
    },
    {
      question: '1.02×10⁵Pa を hPa に換算するといくつになりますか。',
      correct: '1020hPa',
      distractors: ['102hPa', '10,200hPa', '1,020hPa'],
      explanation: 'Pa から hPa へは 100 で割ります。1.02×10⁵Pa ÷ 100 = 1020hPa です。'
    },
    {
      question: '95kPa を hPa で表すとおよそいくつになりますか。',
      correct: '950hPa',
      distractors: ['95hPa', '9,500hPa', '9.5hPa'],
      explanation: 'kPa から hPa へは 10 倍します。95kPa × 10 = 950hPa です。'
    },
    {
      question: '750mmHg を hPa に換算するとおよそいくつになりますか。（1mmHg ≒ 1.33hPa とする）',
      correct: '約1,000hPa',
      distractors: ['約750hPa', '約560hPa', '約1,330hPa'],
      explanation: '750mmHg × 1.33 ≒ 997.5hPa なので、およそ 1,000hPa です。'
    },
    {
      question: '1気圧（atm）を hPa で表すと標準的にいくつと定められていますか。',
      correct: '1,013hPa',
      distractors: ['1,000hPa', '760hPa', '1,100hPa'],
      explanation: '標準気圧は 1atm = 1013hPa と定められています。'
    },
    {
      question: '1030hPa を kPa で表すといくつになりますか。',
      correct: '103.0kPa',
      distractors: ['10.30kPa', '1,030kPa', '1.03kPa'],
      explanation: 'hPa から kPa へは 10 で割ります。1030hPa ÷ 10 = 103.0kPa です。'
    }
  ];

  return mapFromData(data, nextId);
}

function generateConceptualPressureQuestions(nextId) {
  const data = [
    {
      question: '地表付近での大気圧に関する説明として最も適切なものはどれですか。',
      correct: '空気の重さが積み重なって地表を押すことで生じる圧力である',
      distractors: ['地表の熱が直接空気を押し上げて生じる圧力である', '太陽から送られる光の圧力である', '地球の自転が空気を引き寄せて生じる圧力である'],
      explanation: '気圧は上空の空気の重さが下向きに作用することで生じる圧力です。'
    },
    {
      question: '同じ重さの荷物を置くとき、圧力をより小さくする方法として適切なのはどれですか。',
      correct: '接触面の面積を広くする',
      distractors: ['接触面の面積を狭くする', '荷物を高い位置に置く', '荷物を冷やして重さを変える'],
      explanation: '圧力は力 ÷ 面積なので、同じ力でも面積を広くすると圧力は小さくなります。'
    },
    {
      question: '大気圧に関する記述として正しいものはどれですか。',
      correct: '標高が高くなるほど大気圧は低くなる',
      distractors: ['標高が高くなるほど大気圧は高くなる', '標高によって大気圧は変わらない', '標高 1000m より上では大気圧は突然 0 になる'],
      explanation: '上空ほど空気の量が少なくなるため、大気圧は標高が高くなるほど低くなります。'
    },
    {
      question: 'パスカルの原理に基づく装置の特徴として正しいものはどれですか。',
      correct: '閉じた流体内の圧力が全体に等しく伝わる性質を利用している',
      distractors: ['流体を加熱して体積を変化させる性質を利用している', '流体の静止摩擦力を利用している', '流体の比重差によって層を分ける性質を利用している'],
      explanation: 'パスカルの原理は、閉じた流体中の圧力が全方向に等しく伝わる性質を利用するものです。'
    },
    {
      question: '1m² の面積に 1N の力が加わったときの圧力の単位の読み方として正しいものはどれですか。',
      correct: 'パスカル',
      distractors: ['ニュートン毎平方メートル', 'ワット', 'ジュール'],
      explanation: '1m² に 1N の力が加わったときの圧力は 1Pa（パスカル）と呼びます。'
    },
    {
      question: '気圧が低下しているときに起こりやすい現象として適切なのはどれですか。',
      correct: '雲が発達して雨が降りやすくなる',
      distractors: ['晴天が続いて空気が乾燥する', '風が必ず弱まる', '気温が急激に上がる'],
      explanation: '気圧が下がると上昇気流が生まれ、雲が発達して雨が降りやすくなります。'
    },
    {
      question: '大気圧を測定する器具として最も適切なものはどれですか。',
      correct: '気圧計',
      distractors: ['温度計', '湿度計', '風速計'],
      explanation: '気圧を測定するのは気圧計で、温度計や湿度計などでは測れません。'
    },
    {
      question: '密閉した缶に含まれる空気を外へ抜いたときの現象として最も適切なものはどれですか。',
      correct: '外側の大気圧が勝って缶が押しつぶされることがある',
      distractors: ['缶の内外の圧力が等しくなり変化は起きない', '缶の内側の圧力が高まり膨らむ', '大気圧が下がって缶から泡が出る'],
      explanation: '缶の中の空気を抜くと内圧が下がり、外側からの大気圧で押しつぶされることがあります。'
    }
  ];

  return mapFromData(data, nextId);
}

function generatePressureAndAtmosphere() {
  const nextId = createIdGenerator('sci-pressatm');
  const questions = [];

  questions.push(...generateForceAreaQuestions(nextId));
  questions.push(...generateWaterPressureQuestions(nextId));
  questions.push(...generateHydraulicQuestions(nextId));
  questions.push(...generateAltitudePressureQuestions(nextId));
  questions.push(...generateBarometerTrendQuestions(nextId));
  questions.push(...generateUnitConversionQuestions(nextId));
  questions.push(...generateConceptualPressureQuestions(nextId));

  return {
    fileName: 'science-pressure-and-atmospheric-pressure.json',
    data: {
      subject: 'science',
      subjectName: '理科',
      unitId: 'meteorology-pressure-atmosphere',
      unitName: '圧力と気圧',
      category: '気象',
      questions
    }
  };
}

function writeUnitFile(fileName, data) {
  const targetPath = path.join(outDir, fileName);
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Wrote ${fileName} with ${data.questions.length} questions.`);
}

function main() {
  const units = [
    generatePressureAndAtmosphere()
  ];

  for (const unit of units) {
    if (unit.data.questions.length !== 100) {
      throw new Error(`${unit.fileName} has ${unit.data.questions.length} questions (expected 100)`);
    }
    writeUnitFile(unit.fileName, unit.data);
  }
}

if (require.main === module) {
  main();
}
