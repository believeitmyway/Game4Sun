const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'questions');
const TOTAL = 100;
const UNIT_MAN = 10000;
const UNIT_OKU = 100000000;
const UNIT_CHO = 1000000000000;

function pad(num) {
  return num.toString().padStart(3, '0');
}

function formatLargeNumber(value) {
  if (value === 0) return '0';
  let remainder = value;
  const parts = [];
  const cho = Math.floor(remainder / UNIT_CHO);
  if (cho > 0) {
    parts.push(`${cho}兆`);
    remainder -= cho * UNIT_CHO;
  }
  const oku = Math.floor(remainder / UNIT_OKU);
  if (oku > 0) {
    parts.push(`${oku}億`);
    remainder -= oku * UNIT_OKU;
  }
  const man = Math.floor(remainder / UNIT_MAN);
  if (man > 0) {
    parts.push(`${man}万`);
    remainder -= man * UNIT_MAN;
  }
  if (remainder > 0) {
    parts.push(`${remainder}`);
  }
  return parts.join('');
}

function createChoiceSet(correct, distractors = []) {
  const choices = [correct];
  for (const candidate of distractors) {
    if (choices.length === 4) break;
    if (!candidate || choices.includes(candidate)) continue;
    choices.push(candidate);
  }
  while (choices.length < 4) {
    const match = correct.match(/(-?\\d+(?:\\.\\d+)?)(.*)/);
    if (match) {
      const value = Number(match[1]) + choices.length;
      const candidate = `${Number.isNaN(value) ? match[1] : value}${match[2]}`;
      if (!choices.includes(candidate)) {
        choices.push(candidate);
        continue;
      }
    }
    const fallback = `${correct}（別の値${choices.length}）`;
    if (!choices.includes(fallback)) {
      choices.push(fallback);
    } else {
      choices.push(`${fallback}-${choices.length}`);
    }
  }
  return choices;
}

function largeNumberQuestion(index) {
  const includeCho = index % 5 === 0;
  const cho = includeCho ? 1 + (index % 3) : 0;
  const oku = 2 + ((index * 3) % 8);
  const manUnits = ((index * 7) % 40) * 100;
  const remainder = ((index * 11) % 10) * 100;
  const baseValue = cho * UNIT_CHO + oku * UNIT_OKU + manUnits * UNIT_MAN + remainder;
  const multiplier = 2 + (index % 8);
  const resultValue = baseValue * multiplier;
  const question = `大きな数「${formatLargeNumber(baseValue)}」を ${multiplier} 倍すると、いくつになりますか。`;
  const correct = formatLargeNumber(resultValue);
  const distractors = [
    formatLargeNumber(resultValue + UNIT_OKU),
    formatLargeNumber(Math.max(resultValue - UNIT_OKU, UNIT_OKU)),
    formatLargeNumber(resultValue + UNIT_MAN * (500 + (index % 5) * 100)),
    formatLargeNumber(Math.max(resultValue - UNIT_MAN * (400 + ((index + 1) % 5) * 100), UNIT_OKU))
  ];
  const explanation = `「${formatLargeNumber(baseValue)}」に ${multiplier} をかけて、${formatLargeNumber(baseValue)} × ${multiplier} = ${correct} となります。`;
  return { question, choices: createChoiceSet(correct, distractors), answer: 0, explanation };
}

function lineGraphQuestion(index) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const start = index % 9;
  const labels = months.slice(start, start + 4);
  const base = 10 + (index % 5) * 2;
  const rise1 = 2 + (index % 3);
  const drop = 1 + ((index >> 1) % 3);
  const rise2 = 3 + ((index + 1) % 4);
  const values = [];
  values[0] = base;
  values[1] = base + rise1;
  values[2] = values[1] - drop;
  values[3] = values[2] + rise2;
  const unitLabel = ['気温（℃）', '歩数（歩）', '水位（cm）'][index % 3];
  if (index % 2 === 0) {
    const increase = values[3] - values[0];
    const question = `ある町の${unitLabel}を折れ線グラフにまとめると、${labels[0]}は${values[0]}、${labels[1]}は${values[1]}、${labels[2]}は${values[2]}、${labels[3]}は${values[3]}となりました。${labels[0]}から${labels[3]}までの増加は何単位ですか。`;
    const choices = createChoiceSet(`${increase}`, [
      `${increase + 2}`,
      `${increase - 2}`,
      `${increase + 4}`,
      `${increase - 3}`
    ]);
    const explanation = `${labels[3]} - ${labels[0]} = ${values[3]} - ${values[0]} = ${increase} です。`;
    return { question, choices, answer: 0, explanation };
  }
  const decrease = values[1] - values[2];
  const question = `あるクラスの${unitLabel}を折れ線グラフにしました。${labels[0]}は${values[0]}、${labels[1]}は${values[1]}、${labels[2]}は${values[2]}、${labels[3]}は${values[3]}です。${labels[1]}から${labels[2]}にかけて何単位減りましたか。`;
  const choices = createChoiceSet(`${decrease}`, [
    `${decrease + 1}`,
    `${decrease - 1}`,
    `${decrease + 3}`,
    `${decrease + 2}`
  ]);
  const explanation = `${labels[1]}から${labels[2]}の減少量は ${values[1]} - ${values[2]} = ${decrease} です。`;
  return { question, choices, answer: 0, explanation };
}

function longDivisionQuestion(index) {
  const divisor = 2 + (index % 8);
  const quotient = 30 + ((index * 7) % 60);
  if (index % 2 === 0) {
    const dividend = divisor * quotient;
    const question = `${dividend} ÷ ${divisor} を筆算で計算すると、商はいくつになりますか。`;
    const choices = createChoiceSet(`${quotient}`, [
      `${quotient + 2}`,
      `${quotient - 3}`,
      `${quotient + 5}`,
      `${quotient - 1}`
    ]);
    const explanation = `${dividend} ÷ ${divisor} = ${quotient} となります。`;
    return { question, choices, answer: 0, explanation };
  }
  const remainder = 1 + (index % (divisor - 1 || 1));
  const dividend = divisor * quotient + remainder;
  const question = `${dividend} ÷ ${divisor} を筆算で計算すると、商と余りはいくつになりますか。`;
  const correct = `商${quotient} 余り${remainder}`;
  const choices = createChoiceSet(correct, [
    `商${quotient + 1} 余り${Math.max(remainder - 1, 0)}`,
    `商${quotient - 1} 余り${remainder + 1}`,
    `商${quotient} 余り${remainder + 2}`
  ]);
  const explanation = `${dividend} = ${divisor} × ${quotient} + ${remainder} なので、商${quotient}、余り${remainder}です。`;
  return { question, choices, answer: 0, explanation };
}

function angleQuestion(index) {
  if (index % 2 === 0) {
    const known = 40 + (index % 6) * 10;
    const unknown = 180 - known;
    const question = `一直線上の角 ∠A と ∠B のうち、∠A = ${known}° です。∠B の大きさを求めなさい。`;
    const choices = createChoiceSet(`${unknown}°`, [
      `${unknown + 10}°`,
      `${unknown - 10}°`,
      `${unknown + 5}°`,
      `${unknown - 15}°`
    ]);
    const explanation = `一直線上の角は180°なので、180° - ${known}° = ${unknown}° です。`;
    return { question, choices, answer: 0, explanation };
  }
  const angleA = 50 + (index % 5) * 10;
  const angleB = 40 + ((index + 2) % 4) * 10;
  const angleC = 180 - (angleA + angleB);
  const question = `三角形の内角のうち、∠A = ${angleA}°、∠B = ${angleB}° です。∠C の大きさを求めなさい。`;
  const choices = createChoiceSet(`${angleC}°`, [
    `${angleC + 8}°`,
    `${angleC - 6}°`,
    `${angleC + 12}°`,
    `${angleC - 4}°`
  ]);
  const explanation = `三角形の内角の和は180°なので、180° - ${angleA}° - ${angleB}° = ${angleC}° です。`;
  return { question, choices, answer: 0, explanation };
}

const conceptQuestions = [
  {
    prompt: '次のうち、平行四辺形の性質として正しいものを選びなさい。',
    options: [
      '向かい合う辺は平行で長さも等しい',
      '1つの角が直角であることが必ず条件になる',
      '4つの辺はすべて同じ長さでなければならない',
      '対角線は必ず同じ長さになる'
    ],
    answer: 0,
    explanation: '平行四辺形では向かい合う辺が平行で同じ長さになります。'
  },
  {
    prompt: '直角四角形（長方形）について正しいものを選びなさい。',
    options: [
      '4つの角がすべて直角である',
      '向かい合う辺が常に異なる長さである',
      '隣り合う辺は必ず等しい',
      '対角線は交わらない'
    ],
    answer: 0,
    explanation: '長方形は4つの角がすべて直角であることが特徴です。'
  },
  {
    prompt: 'ひし形について正しいものを選びなさい。',
    options: [
      '4つの辺の長さがすべて等しい',
      '4つの角がすべて直角である',
      '1組の向かい合う辺だけが平行である',
      '対角線は同じ長さになる'
    ],
    answer: 0,
    explanation: 'ひし形は4辺がすべて等しい長さです。'
  },
  {
    prompt: '正方形について正しいものを選びなさい。',
    options: [
      '4辺が等しく、4つの角が直角である',
      '4つの角がすべて鋭角である',
      '長さの異なる辺を2本ずつ持つ',
      '対角線は必ず垂直に交わらない'
    ],
    answer: 0,
    explanation: '正方形は4辺が等しく、4つの角が直角です。'
  }
];

function linesQuadrilateralsQuestion(index) {
  if (index % 2 === 0) {
    const baseAngles = [60, 70, 80, 90, 100, 110];
    const angleA = baseAngles[index % baseAngles.length];
    const angleB = baseAngles[(index + 2) % baseAngles.length];
    const angleC = baseAngles[(index + 4) % baseAngles.length];
    const angleD = 360 - (angleA + angleB + angleC);
    const question = `四角形の内角が順に ${angleA}°、${angleB}°、${angleC}°、∠D のとき、∠D を求めなさい。`;
    const choices = createChoiceSet(`${angleD}°`, [
      `${angleD + 10}°`,
      `${angleD - 10}°`,
      `${angleD + 15}°`,
      `${angleD - 5}°`
    ]);
    const explanation = `四角形の内角の和は360°なので、360° - (${angleA}° + ${angleB}° + ${angleC}°) = ${angleD}° です。`;
    return { question, choices, answer: 0, explanation };
  }
  const concept = conceptQuestions[index % conceptQuestions.length];
  return {
    question: concept.prompt,
    choices: concept.options,
    answer: concept.answer,
    explanation: concept.explanation
  };
}

function decimalsQuestion(index) {
  if (index % 2 === 0) {
    const a = Number((1 + (index % 15) * 0.1).toFixed(1));
    const b = Number(((index * 3) % 50 / 100).toFixed(2));
    const sum = Number((a + b).toFixed(2));
    const question = `${a.toFixed(1)} + ${b.toFixed(2)} を計算しなさい。`;
    const correct = sum.toFixed(2);
    const choices = createChoiceSet(correct, [
      (sum + 0.1).toFixed(2),
      (sum - 0.1).toFixed(2),
      (sum + 0.2).toFixed(2),
      (sum - 0.05).toFixed(2)
    ]);
    const explanation = `${a.toFixed(1)} + ${b.toFixed(2)} = ${correct} です。`;
    return { question, choices, answer: 0, explanation };
  }
  const a = Number((3 + (index % 10) * 0.2).toFixed(1));
  const b = Number(((index % 6) * 0.15 + 0.3).toFixed(2));
  const diff = Number((a - b).toFixed(2));
  const question = `${a.toFixed(1)} - ${b.toFixed(2)} を計算しなさい。`;
  const correct = diff.toFixed(2);
  const choices = createChoiceSet(correct, [
    (diff + 0.1).toFixed(2),
    (diff - 0.1).toFixed(2),
    (diff + 0.05).toFixed(2),
    (diff - 0.05).toFixed(2)
  ]);
  const explanation = `${a.toFixed(1)} から ${b.toFixed(2)} を引くと ${correct} です。`;
  return { question, choices, answer: 0, explanation };
}

function twoDigitDivisionQuestion(index) {
  const divisor = 12 + (index % 18);
  const quotient = 12 + ((index * 5) % 60);
  if (index % 3 === 0) {
    const dividend = divisor * quotient;
    const question = `${dividend} ÷ ${divisor} の商を求めなさい。`;
    const choices = createChoiceSet(`${quotient}`, [
      `${quotient + 4}`,
      `${quotient - 5}`,
      `${quotient + 6}`,
      `${quotient - 3}`
    ]);
    const explanation = `${dividend} ÷ ${divisor} = ${quotient} です。`;
    return { question, choices, answer: 0, explanation };
  }
  const remainder = 3 + (index % 5);
  const dividend = divisor * quotient + remainder;
  const question = `${dividend} ÷ ${divisor} を筆算すると、商と余りはいくつになりますか。`;
  const correct = `商${quotient} 余り${remainder}`;
  const choices = createChoiceSet(correct, [
    `商${quotient + 2} 余り${remainder - 1}`,
    `商${quotient - 2} 余り${remainder + 2}`,
    `商${quotient + 1} 余り${remainder + 1}`
  ]);
  const explanation = `${dividend} = ${divisor} × ${quotient} + ${remainder} です。`;
  return { question, choices, answer: 0, explanation };
}

function calculationRulesQuestion(index) {
  if (index % 2 === 0) {
    const base = 20 + (index % 5) * 10;
    const p = 3 + (index % 4);
    const q = 5 + ((index + 1) % 4);
    const question = `計算のきまり（分配法則）を使って ${base} × ${p} + ${base} × ${q} を計算しなさい。`;
    const value = base * (p + q);
    const choices = createChoiceSet(`${value}`, [
      `${value + base}`,
      `${value - base}`,
      `${value + 100}`,
      `${value - 80}`
    ]);
    const explanation = `${base} × (${p} + ${q}) = ${base} × ${p + q} = ${value} です。`;
    return { question, choices, answer: 0, explanation };
  }
  const a = 120 + (index % 4) * 30;
  const b = 80 + ((index + 1) % 4) * 20;
  const c = 3 + (index % 5);
  const question = `計算のきまり（結合法則）を使って (${a} + ${b}) × ${c} を計算しなさい。`;
  const value = (a + b) * c;
  const choices = createChoiceSet(`${value}`, [
    `${value + 60}`,
    `${value - 50}`,
    `${value + 100}`,
    `${value - 80}`
  ]);
  const explanation = `(${a} + ${b}) × ${c} = ${a + b} × ${c} = ${value} です。`;
  return { question, choices, answer: 0, explanation };
}

function multiplesRatioQuestion(index) {
  if (index % 2 === 0) {
    const blue = 6 + (index % 5) * 2;
    const multiple = 2 + (index % 4);
    const red = blue * multiple;
    const question = `青いビーズが${blue}個あります。赤いビーズは青いビーズの${multiple}倍です。赤いビーズは何個ですか。`;
    const choices = createChoiceSet(`${red}`, [
      `${red + blue}`,
      `${red - blue}`,
      `${red + multiple}`,
      `${red - multiple}`
    ]);
    const explanation = `${blue} × ${multiple} = ${red} です。`;
    return { question, choices, answer: 0, explanation };
  }
  const redRatio = 2 + (index % 3);
  const blueRatio = 3 + ((index + 1) % 3);
  const unit = 4 + (index % 5);
  const total = (redRatio + blueRatio) * unit;
  const red = redRatio * unit;
  const question = `赤色と青色の花の本数の比が ${redRatio}:${blueRatio} で、全部で ${total} 本あります。赤い花は何本ですか。`;
  const choices = createChoiceSet(`${red}`, [
    `${red + unit}`,
    `${red - unit}`,
    `${red + 2 * unit}`,
    `${red - 2 * unit}`
  ]);
  const explanation = `合計 ${total} 本は ${redRatio + blueRatio} の ${unit} 倍なので、赤い花は ${redRatio} × ${unit} = ${red} 本です。`;
  return { question, choices, answer: 0, explanation };
}

function approximationQuestion(index) {
  const number = 100 + ((index * 37) % 900);
  if (index % 3 === 0) {
    const rounded = Math.round(number / 10) * 10;
    const question = `${number} を十の位で四捨五入したがい数を求めなさい。`;
    const choices = createChoiceSet(`${rounded}`, [
      `${rounded + 10}`,
      `${rounded - 10}`,
      `${rounded + 20}`,
      `${rounded - 20}`
    ]);
    const explanation = `${number} を十の位で四捨五入すると ${rounded} になります。`;
    return { question, choices, answer: 0, explanation };
  }
  if (index % 3 === 1) {
    const rounded = Math.round(number / 100) * 100;
    const question = `${number} を百の位で四捨五入したがい数を求めなさい。`;
    const choices = createChoiceSet(`${rounded}`, [
      `${rounded + 100}`,
      `${rounded - 100}`,
      `${rounded + 200}`,
      `${rounded - 200}`
    ]);
    const explanation = `百の位で四捨五入すると ${rounded} になります。`;
    return { question, choices, answer: 0, explanation };
  }
  const value = Number((10 + (index % 20) * 0.37).toFixed(2));
  const rounded = value.toFixed(1);
  const question = `${value.toFixed(2)} を小数第一位で四捨五入しなさい。`;
  const choices = createChoiceSet(rounded, [
    (Number(rounded) + 0.1).toFixed(1),
    (Number(rounded) - 0.1).toFixed(1),
    (Number(rounded) + 0.2).toFixed(1),
    (Number(rounded) - 0.2).toFixed(1)
  ]);
  const explanation = `${value.toFixed(2)} を四捨五入すると ${rounded} です。`;
  return { question, choices, answer: 0, explanation };
}

function areaQuestion(index) {
  if (index % 3 === 0) {
    const length = 8 + (index % 5) * 2;
    const width = 5 + ((index + 1) % 4) * 2;
    const area = length * width;
    const question = `縦 ${length} cm、横 ${width} cm の長方形の面積を求めなさい。`;
    const choices = createChoiceSet(`${area} cm²`, [
      `${area + length} cm²`,
      `${area - width} cm²`,
      `${area + 10} cm²`,
      `${area - 12} cm²`
    ]);
    const explanation = `${length} × ${width} = ${area} cm² です。`;
    return { question, choices, answer: 0, explanation };
  }
  if (index % 3 === 1) {
    const side = 6 + (index % 6);
    const area = side * side;
    const question = `1辺が ${side} cm の正方形の面積を求めなさい。`;
    const choices = createChoiceSet(`${area} cm²`, [
      `${area + side} cm²`,
      `${area - side} cm²`,
      `${area + 12} cm²`,
      `${area - 9} cm²`
    ]);
    const explanation = `${side} × ${side} = ${area} cm² です。`;
    return { question, choices, answer: 0, explanation };
  }
  const base = 10 + (index % 4) * 3;
  const height = 7 + ((index + 1) % 4) * 2;
  const area = base * height;
  const question = `底辺 ${base} cm、高さ ${height} cm の平行四辺形の面積を求めなさい。`;
  const choices = createChoiceSet(`${area} cm²`, [
    `${area + base} cm²`,
    `${area - height} cm²`,
    `${area + 15} cm²`,
    `${area - 10} cm²`
  ]);
  const explanation = `平行四辺形の面積は 底辺×高さ = ${base} × ${height} = ${area} cm² です。`;
  return { question, choices, answer: 0, explanation };
}

function decimalTimesIntegerQuestion(index) {
  if (index % 2 === 0) {
    const decimal = Number((1 + (index % 15) * 0.2).toFixed(1));
    const multiplier = 3 + (index % 5);
    const product = Number((decimal * multiplier).toFixed(2));
    const question = `${decimal.toFixed(1)} × ${multiplier} を計算しなさい。`;
    const correct = product.toFixed(2);
    const choices = createChoiceSet(correct, [
      (product + 0.5).toFixed(2),
      (product - 0.5).toFixed(2),
      (product + 1).toFixed(2),
      (product - 1).toFixed(2)
    ]);
    const explanation = `${decimal.toFixed(1)} を ${multiplier} 倍すると ${correct} です。`;
    return { question, choices, answer: 0, explanation };
  }
  const decimal = Number((0.25 * ((index % 8) + 1)).toFixed(2));
  const multiplier = 6 + ((index + 2) % 5);
  const product = Number((decimal * multiplier).toFixed(3));
  const question = `${decimal.toFixed(2)} × ${multiplier} を計算しなさい。`;
  const correct = product.toFixed(3);
  const choices = createChoiceSet(correct, [
    (product + 0.25).toFixed(3),
    (product - 0.25).toFixed(3),
    (product + 0.5).toFixed(3),
    (product - 0.5).toFixed(3)
  ]);
  const explanation = `${decimal.toFixed(2)} × ${multiplier} = ${correct} です。`;
  return { question, choices, answer: 0, explanation };
}

function decimalDivIntegerQuestion(index) {
  if (index % 2 === 0) {
    const dividend = Number((6 + (index % 6) * 1.2).toFixed(1));
    const divisor = 2 + (index % 4);
    const quotient = Number((dividend / divisor).toFixed(2));
    const question = `${dividend.toFixed(1)} ÷ ${divisor} を計算しなさい。`;
    const correct = quotient.toFixed(2);
    const choices = createChoiceSet(correct, [
      (quotient + 0.2).toFixed(2),
      (quotient - 0.2).toFixed(2),
      (quotient + 0.3).toFixed(2),
      (quotient - 0.3).toFixed(2)
    ]);
    const explanation = `${dividend.toFixed(1)} ÷ ${divisor} = ${correct} です。`;
    return { question, choices, answer: 0, explanation };
  }
  const dividend = Number((3 + (index % 5) * 0.75).toFixed(2));
  const divisor = 4 + (index % 3);
  const quotient = Number((dividend / divisor).toFixed(3));
  const question = `${dividend.toFixed(2)} ÷ ${divisor} を計算しなさい。`;
  const correct = quotient.toFixed(3);
  const choices = createChoiceSet(correct, [
    (quotient + 0.05).toFixed(3),
    (quotient - 0.05).toFixed(3),
    (quotient + 0.1).toFixed(3),
    (quotient - 0.1).toFixed(3)
  ]);
  const explanation = `${dividend.toFixed(2)} ÷ ${divisor} = ${correct} です。`;
  return { question, choices, answer: 0, explanation };
}

function fractionToMixedString(whole, numerator, denominator) {
  return numerator === 0 ? `${whole}` : `${whole}と${numerator}/${denominator}`;
}

function fractionsQuestion(index) {
  if (index % 2 === 0) {
    const denominator = 2 + (index % 6);
    const whole = 1 + (index % 4);
    const remainder = 1 + (index % (denominator - 1 || 1));
    const numerator = whole * denominator + remainder;
    const question = `仮分数 ${numerator}/${denominator} を帯分数で表しなさい。`;
    const correct = fractionToMixedString(whole, remainder, denominator);
    const choices = createChoiceSet(correct, [
      fractionToMixedString(whole + 1, remainder - 1, denominator),
      fractionToMixedString(whole - 1, remainder + 1, denominator),
      fractionToMixedString(whole, remainder + 1, denominator)
    ]);
    const explanation = `${numerator} ÷ ${denominator} = ${whole} 余り ${remainder} なので、${correct} です。`;
    return { question, choices, answer: 0, explanation };
  }
  const denominator = 3 + (index % 5);
  const whole = 1 + (index % 4);
  const remainder = 1 + (index % (denominator - 1 || 1));
  const numerator = whole * denominator + remainder;
  const question = `帯分数 ${whole}と${remainder}/${denominator} を仮分数で表しなさい。`;
  const correct = `${numerator}/${denominator}`;
  const choices = createChoiceSet(correct, [
    `${numerator + denominator}/${denominator}`,
    `${numerator - denominator}/${denominator}`,
    `${numerator + remainder}/${denominator}`
  ]);
  const explanation = `仮分数にすると ${denominator} × ${whole} + ${remainder} = ${numerator} なので ${correct} です。`;
  return { question, choices, answer: 0, explanation };
}

function patternsQuestion(index) {
  if (index % 2 === 0) {
    const start = 4 + (index % 5);
    const diff = 3 + (index % 4);
    const term = 10;
    const value = start + (term - 1) * diff;
    const sequence = `${start}, ${start + diff}, ${start + 2 * diff}`;
    const question = `数列 ${sequence}, ... の等差数列について、${term} 番目の数を求めなさい。`;
    const choices = createChoiceSet(`${value}`, [
      `${value + diff}`,
      `${value - diff}`,
      `${value + 2 * diff}`,
      `${value - 2 * diff}`
    ]);
    const explanation = `等差数列の${term}番目は 初項 + (n-1)×公差 = ${start} + 9 × ${diff} = ${value} です。`;
    return { question, choices, answer: 0, explanation };
  }
  const increase = 5 + (index % 4);
  const start = 12 + (index % 5) * 3;
  const xValue = 6 + (index % 5);
  const value = start + increase * (xValue - 1);
  const question = `ある量は、1回ごとに ${increase} ずつ増えるきまりで変わります。1回目は ${start} でした。このきまりの ${xValue} 回目の値はいくつですか。`;
  const choices = createChoiceSet(`${value}`, [
    `${value + increase}`,
    `${value - increase}`,
    `${value + 2 * increase}`,
    `${value - 2 * increase}`
  ]);
  const explanation = `${xValue} 回目は ${start} + (${xValue} - 1) × ${increase} = ${value} です。`;
  return { question, choices, answer: 0, explanation };
}

function prismsCubesQuestion(index) {
  if (index % 3 === 0) {
    const length = 4 + (index % 5);
    const width = 3 + ((index + 1) % 4);
    const height = 5 + ((index + 2) % 3);
    const volume = length * width * height;
    const question = `縦 ${length} cm、横 ${width} cm、高さ ${height} cm の直方体の体積を求めなさい。`;
    const choices = createChoiceSet(`${volume} cm³`, [
      `${volume + length} cm³`,
      `${volume - width} cm³`,
      `${volume + height} cm³`,
      `${volume - 10} cm³`
    ]);
    const explanation = `${length} × ${width} × ${height} = ${volume} cm³ です。`;
    return { question, choices, answer: 0, explanation };
  }
  if (index % 3 === 1) {
    const side = 3 + (index % 6);
    const volume = Math.pow(side, 3);
    const question = `1辺が ${side} cm の立方体の体積を求めなさい。`;
    const choices = createChoiceSet(`${volume} cm³`, [
      `${volume + side} cm³`,
      `${volume - side} cm³`,
      `${volume + 10} cm³`,
      `${volume - 12} cm³`
    ]);
    const explanation = `${side} × ${side} × ${side} = ${volume} cm³ です。`;
    return { question, choices, answer: 0, explanation };
  }
  const length = 5 + (index % 4);
  const width = 4 + ((index + 1) % 4);
  const height = 2 + ((index + 2) % 4);
  const cubes = length * width * height;
  const question = `縦 ${length} cm、横 ${width} cm、高さ ${height} cm の直方体を、1辺1 cm の小さな立方体で作ると何個必要ですか。`;
  const choices = createChoiceSet(`${cubes}`, [
    `${cubes + length}`,
    `${cubes - width}`,
    `${cubes + height}`,
    `${cubes - 8}`
  ]);
  const explanation =  `必要な小さな立方体の個数は体積 ${length} × ${width} × ${height} = ${cubes} 個です。`;
  return { question, choices, answer: 0, explanation };
}

const units = [
  {
    file: 'math-grade4-large-numbers.json',
    unitId: 'grade4-large-numbers',
    unitName: '大きな数（億、兆）とかけ算',
    category: '数と計算',
    generator: largeNumberQuestion
  },
  {
    file: 'math-grade4-line-graph.json',
    unitId: 'grade4-line-graph',
    unitName: '折れ線グラフ',
    category: 'データの活用',
    generator: lineGraphQuestion
  },
  {
    file: 'math-grade4-long-division.json',
    unitId: 'grade4-long-division',
    unitName: 'わり算の筆算',
    category: '数と計算',
    generator: longDivisionQuestion
  },
  {
    file: 'math-grade4-angles.json',
    unitId: 'grade4-angles',
    unitName: '角',
    category: '図形',
    generator: angleQuestion
  },
  {
    file: 'math-grade4-lines-quadrilaterals.json',
    unitId: 'grade4-lines-quadrilaterals',
    unitName: '直線と四角形',
    category: '図形',
    generator: linesQuadrilateralsQuestion
  },
  {
    file: 'math-grade4-decimals.json',
    unitId: 'grade4-decimals',
    unitName: '小数（４年生）',
    category: '数と計算',
    generator: decimalsQuestion
  },
  {
    file: 'math-grade4-long-division-2digit.json',
    unitId: 'grade4-long-division-2digit',
    unitName: '２けたでわる わり算の筆算',
    category: '数と計算',
    generator: twoDigitDivisionQuestion
  },
  {
    file: 'math-grade4-calculation-rules.json',
    unitId: 'grade4-calculation-rules',
    unitName: '計算のきまり',
    category: '数と計算',
    generator: calculationRulesQuestion
  },
  {
    file: 'math-grade4-multiples-ratio.json',
    unitId: 'grade4-multiples-ratio',
    unitName: '倍の見方と割合',
    category: '割合',
    generator: multiplesRatioQuestion
  },
  {
    file: 'math-grade4-approximation.json',
    unitId: 'grade4-approximation',
    unitName: 'がい数（およその数）',
    category: '数と計算',
    generator: approximationQuestion
  },
  {
    file: 'math-grade4-area.json',
    unitId: 'grade4-area',
    unitName: '面積',
    category: '図形',
    generator: areaQuestion
  },
  {
    file: 'math-grade4-decimal-times-integer.json',
    unitId: 'grade4-decimal-times-integer',
    unitName: '小数×整数',
    category: '数と計算',
    generator: decimalTimesIntegerQuestion
  },
  {
    file: 'math-grade4-decimal-div-integer.json',
    unitId: 'grade4-decimal-div-integer',
    unitName: '小数÷整数',
    category: '数と計算',
    generator: decimalDivIntegerQuestion
  },
  {
    file: 'math-grade4-fractions-mixed.json',
    unitId: 'grade4-fractions-mixed',
    unitName: '仮分数と帯分数',
    category: '分数',
    generator: fractionsQuestion
  },
  {
    file: 'math-grade4-patterns.json',
    unitId: 'grade4-patterns',
    unitName: '変わり方調べ',
    category: '数量関係',
    generator: patternsQuestion
  },
  {
    file: 'math-grade4-prisms-cubes.json',
    unitId: 'grade4-prisms-cubes',
    unitName: '直方体と立方体',
    category: '図形',
    generator: prismsCubesQuestion
  }
];

for (const unit of units) {
  const questions = [];
  for (let i = 0; i < TOTAL; i += 1) {
    const { question, choices, answer, explanation } = unit.generator(i);
    questions.push({
      id: `${unit.unitId}-${pad(i + 1)}`,
      question,
      type: 'multiple',
      choices,
      answer,
      explanation
    });
  }
  const data = {
    subject: 'math',
    subjectName: '算数',
    unitId: unit.unitId,
    unitName: unit.unitName,
    category: unit.category,
    grade: '小4',
    questions
  };
  const outPath = path.join(OUTPUT_DIR, unit.file);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Generated ${unit.file}`);
}

const indexPath = path.join(OUTPUT_DIR, 'index.json');
if (fs.existsSync(indexPath)) {
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const fileSet = new Set(indexData.files);
  let updated = false;
  for (const unit of units) {
    if (!fileSet.has(unit.file)) {
      indexData.files.push(unit.file);
      updated = true;
    }
  }
  if (updated) {
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 4) + '\n', 'utf8');
    console.log('index.json updated');
  } else {
    console.log('index.json already up to date');
  }
}
