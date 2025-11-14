const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'questions');

function pad(num) {
  return num.toString().padStart(3, '0');
}

// 1. 大きな数（億、兆）とかけ算
function largeNumbersMultiplicationQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 4;

  if (variant === 0) {
    const billions = 1 + (index % 9);
    const multiplier = 2 + (index % 8);
    const result = billions * multiplier;
    const question = `${billions}億 × ${multiplier} を計算しなさい。`;
    const answer = `${result}億`;
    const choices = [
      answer,
      `${result + 1}億`,
      `${result - 1}億`,
      `${result + 2}億`
    ];
    const explanation = `${billions}億 × ${multiplier} = ${result}億 です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const millions = 10 + (index % 90);
    const multiplier = 3 + (index % 7);
    const result = millions * multiplier;
    const question = `${millions}万 × ${multiplier} を計算しなさい。`;
    const answer = `${result}万`;
    const choices = [
      answer,
      `${result + 10}万`,
      `${result - 5}万`,
      `${result + 20}万`
    ];
    const explanation = `${millions}万 × ${multiplier} = ${result}万 です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const trillions = 1 + (index % 5);
    const multiplier = 2 + (index % 4);
    const result = trillions * multiplier;
    const question = `${trillions}兆 × ${multiplier} を計算しなさい。`;
    const answer = `${result}兆`;
    const choices = [
      answer,
      `${result + 1}兆`,
      `${result - 1}兆`,
      `${result + 2}兆`
    ];
    const explanation = `${trillions}兆 × ${multiplier} = ${result}兆 です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const large = 1000 + (index % 9000);
  const multiplier = 2 + (index % 8);
  const result = large * multiplier;
  const question = `${large.toLocaleString()} × ${multiplier} を計算しなさい。`;
  const answer = result.toLocaleString();
  const choices = [
    answer,
    (result + 100).toLocaleString(),
    (result - 50).toLocaleString(),
    (result + 200).toLocaleString()
  ];
  const explanation = `${large.toLocaleString()} × ${multiplier} = ${result.toLocaleString()} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 2. 折れ線グラフ
function lineGraphQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;
  const base = 10 + (index % 20);

  if (variant === 0) {
    const day1 = base;
    const day2 = base + 3 + (index % 5);
    const day3 = day2 + 2 + (index % 4);
    const question = `ある日の気温を記録しました。1日目は ${day1}°C、2日目は ${day2}°C、3日目は ${day3}°C でした。2日目から3日目にかけて気温は何度上がりましたか。`;
    const answer = day3 - day2;
    const choices = [
      `${answer}°C`,
      `${answer + 1}°C`,
      `${answer - 1}°C`,
      `${answer + 2}°C`
    ];
    const explanation = `${day3}°C - ${day2}°C = ${answer}°C 上がりました。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const values = [base, base + 2, base + 5, base + 3, base + 7];
    const maxIdx = values.indexOf(Math.max(...values));
    const question = `5日間の売上を記録した折れ線グラフがあります。1日目: ${values[0]}個、2日目: ${values[1]}個、3日目: ${values[2]}個、4日目: ${values[3]}個、5日目: ${values[4]}個 でした。最も売上が多かったのは何日目ですか。`;
    const answer = maxIdx + 1;
    const choices = [
      `${answer}日目`,
      `${answer === 1 ? 2 : answer - 1}日目`,
      `${answer === 5 ? 4 : answer + 1}日目`,
      `${answer === 1 ? 3 : answer - 2}日目`
    ];
    const explanation = `各日の売上を比べると、${answer}日目の ${Math.max(...values)}個 が最も多いです。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const day1 = base;
  const day2 = base + 4 + (index % 6);
  const day3 = day2 - 2 - (index % 3);
  const question = `3日間の体重を記録しました。1日目: ${day1}kg、2日目: ${day2}kg、3日目: ${day3}kg でした。1日目から3日目にかけて体重は何kg変化しましたか（増えた場合は正の数、減った場合は負の数で答えなさい）。`;
  const change = day3 - day1;
  const answer = change > 0 ? `+${change}` : `${change}`;
  const choices = [
    `${answer}kg`,
    `${change + 1}kg`,
    `${change - 1}kg`,
    `${change + 2}kg`
  ];
  const explanation = `${day3}kg - ${day1}kg = ${change}kg なので、${change > 0 ? '増加' : '減少'}しました。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 3. わり算の筆算
function divisionQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const divisor = 2 + (index % 8);
  const quotient = 10 + (index % 40);
  const remainder = index % divisor;
  const dividend = divisor * quotient + remainder;

  const question = `${dividend} ÷ ${divisor} を筆算で計算しなさい。`;
  const answer = remainder === 0 ? `${quotient}` : `${quotient} あまり ${remainder}`;
  const wrong1 = remainder === 0 ? `${quotient + 1}` : `${quotient + 1} あまり ${remainder}`;
  const wrong2 = remainder === 0 ? `${quotient - 1}` : `${quotient - 1} あまり ${remainder}`;
  const wrong3 = remainder === 0 ? `${quotient} あまり 1` : `${quotient} あまり ${remainder + 1}`;
  const choices = [answer, wrong1, wrong2, wrong3];
  const explanation = `${dividend} ÷ ${divisor} = ${quotient}${remainder > 0 ? ` あまり ${remainder}` : ''} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 4. 角
function angleQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 0) {
    const angle = 30 + (index % 60);
    const question = `${angle}° の角を、分度器を使ってかきなさい。この角の種類はどれですか。`;
    let answer, explanation;
    if (angle < 90) {
      answer = '鋭角';
      explanation = `${angle}° は 90° より小さいので鋭角です。`;
    } else if (angle === 90) {
      answer = '直角';
      explanation = `${angle}° は直角です。`;
    } else if (angle < 180) {
      answer = '鈍角';
      explanation = `${angle}° は 90° より大きく 180° より小さいので鈍角です。`;
    } else {
      answer = '平角';
      explanation = `${angle}° は平角です。`;
    }
    const choices = [answer, angle < 90 ? '鈍角' : '鋭角', '回転角', '周角'];
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const angle1 = 40 + (index % 50);
    const angle2 = 30 + (index % 40);
    const question = `2つの角があり、1つは ${angle1}°、もう1つは ${angle2}° です。2つの角の和は何度ですか。`;
    const answer = angle1 + angle2;
    const choices = [
      `${answer}°`,
      `${answer + 5}°`,
      `${answer - 5}°`,
      `${answer + 10}°`
    ];
    const explanation = `${angle1}° + ${angle2}° = ${answer}° です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const angle = 50 + (index % 40);
  const question = `直線が交わってできる角の1つが ${angle}° のとき、向かい合う角（対頂角）の大きさは何度ですか。`;
  const answer = angle;
  const choices = [
    `${answer}°`,
    `${180 - answer}°`,
    `${answer + 10}°`,
    `${answer - 10}°`
  ];
  const explanation = `対頂角は等しいので、${angle}° です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 5. 直線と四角形
function linesAndQuadrilateralsQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 4;

  if (variant === 0) {
    const question = `平行な2本の直線があります。この2本の直線の関係を表す言葉はどれですか。`;
    const answer = '平行線';
    const choices = [answer, '垂直線', '交線', '対角線'];
    const explanation = '同じ平面上で交わらない2本の直線を平行線といいます。';
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const length = 5 + (index % 6);
    const width = 3 + (index % 5);
    const question = `長方形の縦が ${length} cm、横が ${width} cm のとき、周の長さを求めなさい。`;
    const perimeter = 2 * (length + width);
    const answer = `${perimeter} cm`;
    const choices = [
      answer,
      `${perimeter + 2} cm`,
      `${perimeter - 2} cm`,
      `${perimeter + 4} cm`
    ];
    const explanation = `長方形の周の長さは (縦 + 横) × 2 = (${length} + ${width}) × 2 = ${perimeter} cm です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const side = 4 + (index % 6);
    const question = `正方形の1辺の長さが ${side} cm のとき、周の長さを求めなさい。`;
    const perimeter = 4 * side;
    const answer = `${perimeter} cm`;
    const choices = [
      answer,
      `${perimeter + 2} cm`,
      `${perimeter - 2} cm`,
      `${perimeter + 4} cm`
    ];
    const explanation = `正方形の周の長さは 1辺 × 4 = ${side} × 4 = ${perimeter} cm です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const question = `2本の直線が直角に交わっています。この2本の直線の関係を表す言葉はどれですか。`;
  const answer = '垂直';
  const choices = [answer, '平行', '斜交', '対角'];
  const explanation = '2本の直線が直角に交わるとき、それらは垂直であるといいます。';
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 6. 小数（４年生）
function decimalsQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 4;

  if (variant === 0) {
    const whole = 1 + (index % 9);
    const tenths = index % 10;
    const decimal = whole + tenths / 10;
    const question = `${decimal} を読みなさい。`;
    const answer = `${whole} と ${tenths} 分の 1`;
    const choices = [
      answer,
      `${whole} と ${tenths} 分の 10`,
      `${whole + 1} と ${tenths} 分の 1`,
      `${whole} と ${tenths + 1} 分の 1`
    ];
    const explanation = `${decimal} は ${whole} と ${tenths} 分の 1 と読みます。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const a = 0.1 * (1 + (index % 9));
    const b = 0.1 * (1 + (index % 8));
    const question = `${a} + ${b} を計算しなさい。`;
    const answer = (a + b).toFixed(1);
    const choices = [
      answer,
      (a + b + 0.1).toFixed(1),
      (a + b - 0.1).toFixed(1),
      (a + b + 0.2).toFixed(1)
    ];
    const explanation = `${a} + ${b} = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const a = 0.1 * (5 + (index % 5));
    const b = 0.1 * (1 + (index % 4));
    const question = `${a} - ${b} を計算しなさい。`;
    const answer = (a - b).toFixed(1);
    const choices = [
      answer,
      (a - b + 0.1).toFixed(1),
      (a - b - 0.1).toFixed(1),
      (a - b + 0.2).toFixed(1)
    ];
    const explanation = `${a} - ${b} = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const whole = 2 + (index % 8);
  const tenths = index % 10;
  const question = `${whole} と ${tenths} 分の 1 を小数で表しなさい。`;
  const answer = (whole + tenths / 10).toFixed(1);
  const choices = [
    answer,
    (whole + (tenths + 1) / 10).toFixed(1),
    (whole + 1 + tenths / 10).toFixed(1),
    (whole - 1 + tenths / 10).toFixed(1)
  ];
  const explanation = `${whole} と ${tenths} 分の 1 = ${answer} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 7. ２けたでわる わり算の筆算
function twoDigitDivisionQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const divisor = 10 + (index % 90);
  const quotient = 1 + (index % 9);
  const remainder = index % divisor;
  const dividend = divisor * quotient + remainder;

  const question = `${dividend} ÷ ${divisor} を筆算で計算しなさい。`;
  const answer = remainder === 0 ? `${quotient}` : `${quotient} あまり ${remainder}`;
  const wrong1 = remainder === 0 ? `${quotient + 1}` : `${quotient + 1} あまり ${remainder}`;
  const wrong2 = remainder === 0 ? `${quotient - 1}` : `${quotient - 1} あまり ${remainder}`;
  const wrong3 = remainder === 0 ? `${quotient} あまり 1` : `${quotient} あまり ${remainder + 1}`;
  const choices = [answer, wrong1, wrong2, wrong3];
  const explanation = `${dividend} ÷ ${divisor} = ${quotient}${remainder > 0 ? ` あまり ${remainder}` : ''} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 8. 計算のきまり
function calculationRulesQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 0) {
    const a = 2 + (index % 8);
    const b = 3 + (index % 7);
    const c = 4 + (index % 6);
    const question = `${a} × (${b} × ${c}) と (${a} × ${b}) × ${c} の計算結果は同じですか。`;
    const answer = 'はい、同じです';
    const choices = [answer, 'いいえ、違います', '場合によります', '計算してみないとわかりません'];
    const explanation = `かけ算は結合法則が成り立ち、${a} × (${b} × ${c}) = (${a} × ${b}) × ${c} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const a = 5 + (index % 5);
    const b = 3 + (index % 4);
    const c = 2 + (index % 3);
    const question = `${a} × (${b} + ${c}) を計算しなさい。`;
    const answer = a * (b + c);
    const choices = [
      answer.toString(),
      (a * b + c).toString(),
      (a + b * c).toString(),
      (a * b * c).toString()
    ];
    const explanation = `分配法則より ${a} × (${b} + ${c}) = ${a} × ${b + c} = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const a = 6 + (index % 5);
  const b = 4 + (index % 4);
  const question = `${a} + ${b} と ${b} + ${a} の計算結果は同じですか。`;
  const answer = 'はい、同じです';
  const choices = [answer, 'いいえ、違います', '場合によります', '計算してみないとわかりません'];
  const explanation = `たし算は交換法則が成り立ち、${a} + ${b} = ${b} + ${a} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 9. 倍の見方と割合
function ratioQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 0) {
    const base = 5 + (index % 10);
    const multiplier = 2 + (index % 4);
    const question = `${base} の ${multiplier} 倍はいくつですか。`;
    const answer = base * multiplier;
    const choices = [
      answer.toString(),
      (answer + 1).toString(),
      (answer - 1).toString(),
      (answer + base).toString()
    ];
    const explanation = `${base} × ${multiplier} = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const total = 20 + (index % 30);
    const part = 5 + (index % 10);
    const question = `${total} 個のうち ${part} 個は何倍ですか。`;
    const answer = part / total;
    const answerStr = answer === 0.5 ? '0.5倍（2分の1倍）' : answer === 0.25 ? '0.25倍（4分の1倍）' : `${answer}倍`;
    const choices = [
      answerStr,
      `${answer + 0.1}倍`,
      `${answer - 0.1}倍`,
      `${answer * 2}倍`
    ];
    const explanation = `${part} ÷ ${total} = ${answer} なので、${answerStr} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const a = 8 + (index % 12);
  const b = 4 + (index % 8);
  const question = `${a} は ${b} の何倍ですか。`;
  const answer = a / b;
  const answerStr = answer === Math.floor(answer) ? `${answer}倍` : `${answer}倍`;
  const choices = [
    answerStr,
    `${answer + 1}倍`,
    `${answer - 1}倍`,
    `${answer * 2}倍`
  ];
  const explanation = `${a} ÷ ${b} = ${answer} なので、${answerStr} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 10. がい数（およその数）
function approximationQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 0) {
    const num = 100 + (index % 900);
    const question = `${num} を十の位までのがい数にしなさい。`;
    const rounded = Math.round(num / 10) * 10;
    const choices = [
      rounded.toString(),
      (rounded + 10).toString(),
      (rounded - 10).toString(),
      (rounded + 20).toString()
    ];
    const explanation = `${num} の十の位を四捨五入すると ${rounded} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const num = 1000 + (index % 9000);
    const question = `${num} を百の位までのがい数にしなさい。`;
    const rounded = Math.round(num / 100) * 100;
    const choices = [
      rounded.toString(),
      (rounded + 100).toString(),
      (rounded - 100).toString(),
      (rounded + 200).toString()
    ];
    const explanation = `${num} の百の位を四捨五入すると ${rounded} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const num = 10000 + (index % 90000);
  const question = `${num} を千の位までのがい数にしなさい。`;
  const rounded = Math.round(num / 1000) * 1000;
  const choices = [
    rounded.toString(),
    (rounded + 1000).toString(),
    (rounded - 1000).toString(),
    (rounded + 2000).toString()
  ];
  const explanation = `${num} の千の位を四捨五入すると ${rounded} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 11. 面積
function areaQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 0) {
    const length = 5 + (index % 8);
    const width = 3 + (index % 6);
    const question = `縦 ${length} cm、横 ${width} cm の長方形の面積を求めなさい。`;
    const area = length * width;
    const answer = `${area} cm²`;
    const choices = [
      answer,
      `${area + 2} cm²`,
      `${area - 2} cm²`,
      `${area + 4} cm²`
    ];
    const explanation = `長方形の面積は 縦 × 横 = ${length} × ${width} = ${area} cm² です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const side = 4 + (index % 7);
    const question = `1辺が ${side} cm の正方形の面積を求めなさい。`;
    const area = side * side;
    const answer = `${area} cm²`;
    const choices = [
      answer,
      `${area + 2} cm²`,
      `${area - 2} cm²`,
      `${area + 4} cm²`
    ];
    const explanation = `正方形の面積は 1辺 × 1辺 = ${side} × ${side} = ${area} cm² です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const base = 6 + (index % 7);
  const height = 4 + (index % 6);
  const question = `底辺が ${base} cm、高さが ${height} cm の平行四辺形の面積を求めなさい。`;
  const area = base * height;
  const answer = `${area} cm²`;
  const choices = [
    answer,
    `${area + 3} cm²`,
    `${area - 3} cm²`,
    `${area + 5} cm²`
  ];
  const explanation = `平行四辺形の面積は 底辺 × 高さ = ${base} × ${height} = ${area} cm² です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 12. 小数×整数
function decimalTimesIntegerQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 0) {
    const decimal = 0.1 * (1 + (index % 9));
    const integer = 2 + (index % 8);
    const question = `${decimal} × ${integer} を計算しなさい。`;
    const answer = (decimal * integer).toFixed(1);
    const choices = [
      answer,
      (decimal * integer + 0.1).toFixed(1),
      (decimal * integer - 0.1).toFixed(1),
      (decimal * integer + 0.2).toFixed(1)
    ];
    const explanation = `${decimal} × ${integer} = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const decimal = 0.2 * (1 + (index % 5));
    const integer = 3 + (index % 7);
    const question = `${decimal} × ${integer} を計算しなさい。`;
    const answer = (decimal * integer).toFixed(1);
    const choices = [
      answer,
      (decimal * integer + 0.1).toFixed(1),
      (decimal * integer - 0.1).toFixed(1),
      (decimal * integer + 0.2).toFixed(1)
    ];
    const explanation = `${decimal} × ${integer} = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const decimal = 0.5 + 0.1 * (index % 5);
  const integer = 2 + (index % 6);
  const question = `${decimal} × ${integer} を計算しなさい。`;
  const answer = (decimal * integer).toFixed(1);
  const choices = [
    answer,
    (decimal * integer + 0.1).toFixed(1),
    (decimal * integer - 0.1).toFixed(1),
    (decimal * integer + 0.2).toFixed(1)
  ];
  const explanation = `${decimal} × ${integer} = ${answer} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 13. 小数÷整数
function decimalDivideIntegerQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 0) {
    const decimal = 0.1 * (2 + (index % 8));
    const integer = 2 + (index % 4);
    const question = `${decimal} ÷ ${integer} を計算しなさい。`;
    const answer = (decimal / integer).toFixed(1);
    const choices = [
      answer,
      (decimal / integer + 0.1).toFixed(1),
      (decimal / integer - 0.1).toFixed(1),
      (decimal / integer + 0.2).toFixed(1)
    ];
    const explanation = `${decimal} ÷ ${integer} = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const decimal = 0.2 * (1 + (index % 5));
    const integer = 2 + (index % 3);
    const question = `${decimal} ÷ ${integer} を計算しなさい。`;
    const answer = (decimal / integer).toFixed(1);
    const choices = [
      answer,
      (decimal / integer + 0.1).toFixed(1),
      (decimal / integer - 0.1).toFixed(1),
      (decimal / integer + 0.2).toFixed(1)
    ];
    const explanation = `${decimal} ÷ ${integer} = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const decimal = 0.5 + 0.1 * (index % 5);
  const integer = 2 + (index % 4);
  const question = `${decimal} ÷ ${integer} を計算しなさい。`;
  const answer = (decimal / integer).toFixed(1);
  const choices = [
    answer,
    (decimal / integer + 0.1).toFixed(1),
    (decimal / integer - 0.1).toFixed(1),
    (decimal / integer + 0.2).toFixed(1)
  ];
  const explanation = `${decimal} ÷ ${integer} = ${answer} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 14. 仮分数と帯分数
function improperAndMixedFractionsQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 0) {
    const whole = 1 + (index % 3);
    const numerator = 1 + (index % 3);
    const denominator = 2 + (index % 3);
    const question = `${whole} と ${numerator}/${denominator} を仮分数になおしなさい。`;
    const improper = whole * denominator + numerator;
    const answer = `${improper}/${denominator}`;
    const choices = [
      answer,
      `${improper + 1}/${denominator}`,
      `${improper}/${denominator + 1}`,
      `${improper - 1}/${denominator}`
    ];
    const explanation = `${whole} と ${numerator}/${denominator} = ${whole} + ${numerator}/${denominator} = ${whole * denominator}/${denominator} + ${numerator}/${denominator} = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const numerator = 5 + (index % 10);
    const denominator = 2 + (index % 3);
    const question = `仮分数 ${numerator}/${denominator} を帯分数になおしなさい。`;
    const whole = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    const answer = remainder === 0 ? `${whole}` : `${whole} と ${remainder}/${denominator}`;
    const choices = [
      answer,
      `${whole + 1} と ${remainder}/${denominator}`,
      `${whole} と ${remainder + 1}/${denominator}`,
      `${whole - 1} と ${remainder}/${denominator}`
    ];
    const explanation = `${numerator} ÷ ${denominator} = ${whole} あまり ${remainder} なので、${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const whole = 1 + (index % 2);
  const numerator = 1 + (index % 2);
  const denominator = 2 + (index % 2);
  const question = `${whole} と ${numerator}/${denominator} と ${whole + 1} と ${numerator + 1}/${denominator + 1} のどちらが大きいですか。`;
  const value1 = whole + numerator / denominator;
  const value2 = (whole + 1) + (numerator + 1) / (denominator + 1);
  const answer = value2 > value1 ? `${whole + 1} と ${numerator + 1}/${denominator + 1}` : `${whole} と ${numerator}/${denominator}`;
  const choices = [
    answer,
    value2 > value1 ? `${whole} と ${numerator}/${denominator}` : `${whole + 1} と ${numerator + 1}/${denominator + 1}`,
    '同じ',
    'どちらともいえない'
  ];
  const explanation = value2 > value1 
    ? `${whole + 1} と ${numerator + 1}/${denominator + 1} の方が大きいです。`
    : `${whole} と ${numerator}/${denominator} の方が大きいです。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 15. 変わり方調べ
function changePatternQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 0) {
    const base = 10 + (index % 10);
    const multiplier = 2 + (index % 3);
    const x = 3 + (index % 5);
    const question = `表を見て、x が ${x} のときの y の値を求めなさい。\n表: x が 1 のとき y は ${base}、x が 2 のとき y は ${base * multiplier}、x が 3 のとき y は ${base * multiplier * multiplier} です。`;
    const y = base * Math.pow(multiplier, x - 1);
    const answer = y.toString();
    const choices = [
      answer,
      (y + base).toString(),
      (y - base).toString(),
      (y * multiplier).toString()
    ];
    const explanation = `x が 1 増えると y は ${multiplier} 倍になるので、x が ${x} のとき y = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const base = 5 + (index % 10);
    const increment = 3 + (index % 4);
    const x = 4 + (index % 5);
    const question = `表を見て、x が ${x} のときの y の値を求めなさい。\n表: x が 1 のとき y は ${base}、x が 2 のとき y は ${base + increment}、x が 3 のとき y は ${base + increment * 2} です。`;
    const y = base + increment * (x - 1);
    const answer = y.toString();
    const choices = [
      answer,
      (y + increment).toString(),
      (y - increment).toString(),
      (y + base).toString()
    ];
    const explanation = `x が 1 増えると y は ${increment} 増えるので、x が ${x} のとき y = ${answer} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const base = 8 + (index % 8);
  const x = 2 + (index % 4);
  const question = `表を見て、x と y の関係を表す式を選びなさい。\n表: x が 1 のとき y は ${base}、x が 2 のとき y は ${base * 2}、x が 3 のとき y は ${base * 3} です。`;
  const answer = `y = ${base}x`;
  const choices = [
    answer,
    `y = ${base + 1}x`,
    `y = ${base}x + 1`,
    `y = ${base - 1}x`
  ];
  const explanation = `x が 1 増えると y は ${base} 増えるので、y = ${base}x です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

// 16. 直方体と立方体
function rectangularAndCubeQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 4;

  if (variant === 0) {
    const length = 3 + (index % 5);
    const width = 2 + (index % 4);
    const height = 4 + (index % 4);
    const question = `縦 ${length} cm、横 ${width} cm、高さ ${height} cm の直方体の体積を求めなさい。`;
    const volume = length * width * height;
    const answer = `${volume} cm³`;
    const choices = [
      answer,
      `${volume + 2} cm³`,
      `${volume - 2} cm³`,
      `${volume + 4} cm³`
    ];
    const explanation = `直方体の体積は 縦 × 横 × 高さ = ${length} × ${width} × ${height} = ${volume} cm³ です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 1) {
    const edge = 2 + (index % 5);
    const question = `1辺が ${edge} cm の立方体の体積を求めなさい。`;
    const volume = edge * edge * edge;
    const answer = `${volume} cm³`;
    const choices = [
      answer,
      `${volume + 2} cm³`,
      `${volume - 2} cm³`,
      `${volume + 4} cm³`
    ];
    const explanation = `立方体の体積は 1辺 × 1辺 × 1辺 = ${edge} × ${edge} × ${edge} = ${volume} cm³ です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const length = 4 + (index % 4);
    const width = 3 + (index % 4);
    const height = 5 + (index % 4);
    const question = `縦 ${length} cm、横 ${width} cm、高さ ${height} cm の直方体の表面積を求めなさい。`;
    const surfaceArea = 2 * (length * width + width * height + height * length);
    const answer = `${surfaceArea} cm²`;
    const choices = [
      answer,
      `${surfaceArea + 4} cm²`,
      `${surfaceArea - 4} cm²`,
      `${surfaceArea + 8} cm²`
    ];
    const explanation = `直方体の表面積は 2 × (縦×横 + 横×高さ + 高さ×縦) = 2 × (${length}×${width} + ${width}×${height} + ${height}×${length}) = ${surfaceArea} cm² です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const edge = 3 + (index % 4);
  const question = `1辺が ${edge} cm の立方体の表面積を求めなさい。`;
  const surfaceArea = 6 * edge * edge;
  const answer = `${surfaceArea} cm²`;
  const choices = [
    answer,
    `${surfaceArea + 6} cm²`,
    `${surfaceArea - 6} cm²`,
    `${surfaceArea + 12} cm²`
  ];
  const explanation = `立方体の表面積は 1辺 × 1辺 × 6 = ${edge} × ${edge} × 6 = ${surfaceArea} cm² です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

const units = [
  {
    file: 'math-large-numbers-multiplication.json',
    unitId: 'large-numbers-multiplication',
    unitName: '大きな数（億、兆）とかけ算',
    category: '数と計算',
    idPrefix: 'math-large-num-mult',
    generator: largeNumbersMultiplicationQuestion
  },
  {
    file: 'math-line-graph.json',
    unitId: 'line-graph',
    unitName: '折れ線グラフ',
    category: 'データの活用',
    idPrefix: 'math-line-graph',
    generator: lineGraphQuestion
  },
  {
    file: 'math-division.json',
    unitId: 'division',
    unitName: 'わり算の筆算',
    category: '数と計算',
    idPrefix: 'math-division',
    generator: divisionQuestion
  },
  {
    file: 'math-angle.json',
    unitId: 'angle',
    unitName: '角',
    category: '図形',
    idPrefix: 'math-angle',
    generator: angleQuestion
  },
  {
    file: 'math-lines-quadrilaterals.json',
    unitId: 'lines-quadrilaterals',
    unitName: '直線と四角形',
    category: '図形',
    idPrefix: 'math-lines-quad',
    generator: linesAndQuadrilateralsQuestion
  },
  {
    file: 'math-decimals-4th.json',
    unitId: 'decimals-4th',
    unitName: '小数（４年生）',
    category: '数と計算',
    idPrefix: 'math-decimals-4th',
    generator: decimalsQuestion
  },
  {
    file: 'math-two-digit-division.json',
    unitId: 'two-digit-division',
    unitName: '２けたでわる わり算の筆算',
    category: '数と計算',
    idPrefix: 'math-2digit-div',
    generator: twoDigitDivisionQuestion
  },
  {
    file: 'math-calculation-rules.json',
    unitId: 'calculation-rules',
    unitName: '計算のきまり',
    category: '数と計算',
    idPrefix: 'math-calc-rules',
    generator: calculationRulesQuestion
  },
  {
    file: 'math-ratio.json',
    unitId: 'ratio',
    unitName: '倍の見方と割合',
    category: '数と計算',
    idPrefix: 'math-ratio',
    generator: ratioQuestion
  },
  {
    file: 'math-approximation.json',
    unitId: 'approximation',
    unitName: 'がい数（およその数）',
    category: '数と計算',
    idPrefix: 'math-approx',
    generator: approximationQuestion
  },
  {
    file: 'math-area-4th.json',
    unitId: 'area-4th',
    unitName: '面積',
    category: '図形',
    idPrefix: 'math-area-4th',
    generator: areaQuestion
  },
  {
    file: 'math-decimal-times-integer.json',
    unitId: 'decimal-times-integer',
    unitName: '小数×整数',
    category: '数と計算',
    idPrefix: 'math-dec-times-int',
    generator: decimalTimesIntegerQuestion
  },
  {
    file: 'math-decimal-divide-integer.json',
    unitId: 'decimal-divide-integer',
    unitName: '小数÷整数',
    category: '数と計算',
    idPrefix: 'math-dec-div-int',
    generator: decimalDivideIntegerQuestion
  },
  {
    file: 'math-improper-mixed-fractions.json',
    unitId: 'improper-mixed-fractions',
    unitName: '仮分数と帯分数',
    category: '数と計算',
    idPrefix: 'math-improper-mixed',
    generator: improperAndMixedFractionsQuestion
  },
  {
    file: 'math-change-pattern.json',
    unitId: 'change-pattern',
    unitName: '変わり方調べ',
    category: 'データの活用',
    idPrefix: 'math-change-pattern',
    generator: changePatternQuestion
  },
  {
    file: 'math-rectangular-cube.json',
    unitId: 'rectangular-cube',
    unitName: '直方体と立方体',
    category: '図形',
    idPrefix: 'math-rect-cube',
    generator: rectangularAndCubeQuestion
  }
];

for (const unit of units) {
  const questions = [];
  for (let i = 1; i <= 100; i += 1) {
    questions.push(unit.generator(i, unit));
  }
  const data = {
    subject: 'math',
    subjectName: '数学',
    unitId: unit.unitId,
    unitName: unit.unitName,
    category: unit.category,
    grade: '小4',
    questions
  };
  const outPath = path.join(outDir, unit.file);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Generated ${unit.file}`);
}

console.log('All 4th grade math units generated!');
