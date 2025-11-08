const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'questions');

function pad(num) {
  return num.toString().padStart(3, '0');
}

function formatLinear(coef, constant, variable = 'x') {
  let expr = '';
  if (coef === 0) {
    expr = '';
  } else if (coef === 1) {
    expr = variable;
  } else if (coef === -1) {
    expr = `-${variable}`;
  } else {
    expr = `${coef}${variable}`;
  }

  if (constant === 0) {
    if (!expr) {
      return '0';
    }
    return expr;
  }

  if (!expr) {
    return `${constant}`;
  }

  if (constant > 0) {
    return `${expr} + ${constant}`;
  }
  return `${expr} - ${Math.abs(constant)}`;
}

function formatTwoVariableExpression(xCoef, yCoef) {
  const parts = [];
  if (xCoef !== 0) {
    parts.push(formatLinear(xCoef, 0, 'x'));
  }
  if (yCoef !== 0) {
    const term = formatLinear(yCoef, 0, 'y');
    if (parts.length && !term.startsWith('-')) {
      parts.push(`+ ${term}`);
    } else {
      parts.push(term);
    }
  }
  if (parts.length === 0) {
    return '0';
  }
  return parts.join(' ');
}

function formatPair(x, y) {
  return `x = ${x}, y = ${y}`;
}

function ensurePositive(value, fallback) {
  return value > 0 ? value : fallback;
}

function literalCalcQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 4;

  if (variant === 1) {
    const a = 3 + (index % 5);
    const b = 2 + (index % 7);
    const c = 1 + (index % 4);
    const d = 3 + (index % 6);
    const question = `(${a}x + ${b}) + (${c}x + ${d}) を計算しなさい。`;
    const correct = formatLinear(a + c, b + d);
    const choices = [
      correct,
      formatLinear(a + c + 1, b + d),
      formatLinear(a + c, b + d + 3),
      formatLinear(a + c - 1, b + d + 1)
    ];
    const explanation = `同類項をまとめます。xの項: ${a} + ${c} = ${a + c}、定数項: ${b} + ${d} = ${b + d} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const a = 7 + (index % 4);
    const b = 8 + (index % 5);
    const c = 2 + (index % 4);
    const d = 3 + (index % 6);
    const question = `(${a}x + ${b}) - (${c}x + ${d}) を計算しなさい。`;
    const coef = a - c;
    const constant = b - d;
    const correct = formatLinear(coef, constant);
    const choices = [
      correct,
      formatLinear(coef + 1, constant),
      formatLinear(coef, constant + 4),
      formatLinear(coef - 2, constant + 2)
    ];
    const explanation = `括弧を外して ${a}x - ${c}x = ${(a - c)}x、定数項は ${b} - ${d} = ${b - d} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 3) {
    const m = 2 + (index % 3);
    const a = 2 + (index % 5);
    const b = 3 + (index % 6);
    const c = 1 + (index % 4);
    const d = 2 + (index % 5);
    const question = `${m}(${a}x + ${b}) - (${c}x - ${d}) を展開して整理しなさい。`;
    const coef = m * a - c;
    const constant = m * b + d;
    const correct = formatLinear(coef, constant);
    const choices = [
      correct,
      formatLinear(coef + 1, constant),
      formatLinear(coef, constant - 3),
      formatLinear(coef - 2, constant + 2)
    ];
    const explanation = `${m}(${a}x + ${b}) = ${m * a}x + ${m * b}、そこから ${c}x - ${d} を引くので係数は ${m * a} - ${c} = ${coef}、定数項は ${m * b} + ${d} = ${constant} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const a = 2 + (index % 4);
  const b = 4 + (index % 5);
  const c = 3 + (index % 4);
  const question = `-${a}(x - ${b}) + ${c}(x + 1) を計算しなさい。`;
  const coef = -a + c;
  const constant = a * b + c;
  const correct = formatLinear(coef, constant);
  const choices = [
    correct,
    formatLinear(coef + 2, constant),
    formatLinear(coef, constant - 4),
    formatLinear(coef - 1, constant + 3)
  ];
  const explanation = `-${a}(x - ${b}) = -${a}x + ${a * b}、${c}(x + 1) = ${c}x + ${c} なので、xの係数は ${-a} + ${c} = ${coef}、定数項は ${a * b} + ${c} = ${constant} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function literalApplicationQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;
  const xVal = 2 + (index % 7);
  const yVal = 3 + (index % 5);

  if (variant === 1) {
    const question = `x = ${xVal}、y = ${yVal} のとき、式 3x + 2y の値を求めなさい。`;
    const answerValue = 3 * xVal + 2 * yVal;
    const choices = [
      `${answerValue}`,
      `${answerValue + 3}`,
      `${answerValue - 4}`,
      `${answerValue + 6}`
    ];
    const explanation = `3x + 2y = 3 × ${xVal} + 2 × ${yVal} = ${3 * xVal} + ${2 * yVal} = ${answerValue} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const question = `x = ${xVal}、y = ${yVal} のとき、式 4x - y の値を求めなさい。`;
    const answerValue = 4 * xVal - yVal;
    const choices = [
      `${answerValue}`,
      `${answerValue + 5}`,
      `${answerValue - 3}`,
      `${answerValue + 7}`
    ];
    const explanation = `4x - y = 4 × ${xVal} - ${yVal} = ${4 * xVal} - ${yVal} = ${answerValue} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const question = `x = ${xVal}、y = ${yVal} のとき、式 xy + 2x の値を求めなさい。`;
  const answerValue = xVal * yVal + 2 * xVal;
  const choices = [
    `${answerValue}`,
    `${answerValue + 6}`,
    `${answerValue - 5}`,
    `${answerValue + 9}`
  ];
  const explanation = `xy + 2x = ${xVal} × ${yVal} + 2 × ${xVal} = ${xVal * yVal} + ${2 * xVal} = ${answerValue} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function simultaneousEquationQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const xVal = 1 + (index % 9);
  const yVal = 2 + (Math.floor((index - 1) / 9) % 9);
  let a1 = 1 + (index % 4);
  let b1 = 2 + (index % 5);
  let a2 = 2 + ((index + 1) % 4);
  let b2 = 1 + ((index + 2) % 5);
  if (a1 * b2 === b1 * a2) {
    b2 += 1;
  }
  const c1 = a1 * xVal + b1 * yVal;
  const c2 = a2 * xVal + b2 * yVal;
  const question = `次の連立方程式を解きなさい。\n${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`;
  const correct = formatPair(xVal, yVal);
  const choices = [
    correct,
    formatPair(xVal + 1, yVal - 1),
    formatPair(xVal - 1, yVal + 1),
    formatPair(xVal + 2, yVal)
  ];
  const explanation = `${a1}x + ${b1}y = ${c1}、${a2}x + ${b2}y = ${c2} を加減法で解くと x = ${xVal}、y = ${yVal} となります。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function simultaneousApplicationQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const applePrice = 80 + (index % 5) * 10;
  const orangePrice = 50 + (index % 4) * 10;
  const a1 = 2 + (index % 3);
  const b1 = 3 + (index % 4);
  const a2 = 4 + (index % 2);
  const b2 = 1 + ((index + 1) % 3);
  const total1 = a1 * applePrice + b1 * orangePrice;
  const total2 = a2 * applePrice + b2 * orangePrice;
  const question = `りんご1個を x 円、みかん1個を y 円 とします。りんごを ${a1} 個、みかんを ${b1} 個 買うと合計 ${total1} 円になりました。また、りんごを ${a2} 個、みかんを ${b2} 個 買うと合計 ${total2} 円になりました。りんご1個の値段はいくらですか。`;
  const correctValue = applePrice;
  const choices = [
    `${correctValue}`,
    `${correctValue + 20}`,
    `${correctValue - 10}`,
    `${correctValue + 30}`
  ].map(value => `${value} 円`);
  const explanation = `りんごの値段を x、みかんの値段を y とおくと、${a1}x + ${b1}y = ${total1}、${a2}x + ${b2}y = ${total2} の連立方程式になり、解くと x = ${applePrice}（円）、y = ${orangePrice}（円）です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function linearFunctionQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 4;

  if (variant === 1) {
    const a = 1 + (index % 5);
    const b = -a * (2 + (index % 3));
    const question = `一次関数 y = ${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} のグラフがx軸と交わる点のx座標を求めなさい。`;
    const answerValue = -b / a;
    const choices = [
      `${answerValue}`,
      `${answerValue + 1}`,
      `${answerValue - 1}`,
      `${answerValue + 2}`
    ];
    const explanation = `y = 0 とすると ${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = 0 となり、x = ${answerValue} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const a = 2 + (index % 4);
    const b = 3 + (index % 6);
    const xVal = 1 + (index % 5);
    const question = `一次関数 y = ${a}x + ${b} において、x = ${xVal} のときの y の値を求めなさい。`;
    const answerValue = a * xVal + b;
    const choices = [
      `${answerValue}`,
      `${answerValue + 2}`,
      `${answerValue - 3}`,
      `${answerValue + 4}`
    ];
    const explanation = `y = ${a} × ${xVal} + ${b} = ${answerValue} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 3) {
    const a = 3 + (index % 4);
    const b = -2 - (index % 5);
    const question = `一次関数 y = ${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} の傾きを求めなさい。`;
    const answerValue = a;
    const choices = [
      `${answerValue}`,
      `${answerValue + 1}`,
      `${answerValue - 1}`,
      `${answerValue + 2}`
    ];
    const explanation = `一次関数 y = ax + b の傾きは係数 a に等しいため、傾きは ${a} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const a = 1 + (index % 5);
  const b = 2 + (index % 4);
  const question = `一次関数 y = ${a}x + ${b} の切片（y切片）を求めなさい。`;
  const answerValue = b;
  const choices = [
    `${answerValue}`,
    `${answerValue + 2}`,
    `${answerValue - 1}`,
    `${answerValue + 3}`
  ];
  const explanation = `一次関数 y = ax + b の y切片は定数項 b であり、この場合 ${b} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function linearApplicationQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 1) {
    const base = 420 + (index % 4) * 20;
    const rate = 80 + (index % 3) * 10;
    const distance = 5 + (index % 5);
    const question = `あるタクシーの料金は初乗り${base}円で、1kmごとに${rate}円ずつ加算されます。距離を x km とすると料金は y = ${rate}x + ${base} と表せます。${distance}km 乗ったときの料金はいくらですか。`;
    const answerValue = rate * distance + base;
    const choices = [
      `${answerValue} 円`,
      `${answerValue + 100} 円`,
      `${answerValue - 80} 円`,
      `${answerValue + 160} 円`
    ];
    const explanation = `${distance}km のとき y = ${rate} × ${distance} + ${base} = ${answerValue} 円 です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const initial = 10 + (index % 5);
    const rate = 3 + (index % 4);
    const minutes = 6 + (index % 5);
    const question = `ある水槽には初めに ${initial} L の水が入っています。1分ごとに一定の割合で ${rate} L の水が加えられるとき、時間 x 分後の水の量は y = ${rate}x + ${initial} で表せます。${minutes} 分後の水の量を求めなさい。`;
    const answerValue = rate * minutes + initial;
    const choices = [
      `${answerValue} L`,
      `${answerValue + 3} L`,
      `${answerValue - 4} L`,
      `${answerValue + 6} L`
    ];
    const explanation = `${minutes} 分後の水の量は y = ${rate} × ${minutes} + ${initial} = ${answerValue} L です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const start = 200 + (index % 4) * 10;
  const rate = 15 + (index % 3) * 5;
  const hours = 4 + (index % 4);
  const question = `ある商品の在庫は、毎時間 ${rate} 個ずつ減っていき、時間 x のときの在庫数は y = ${start} - ${rate}x で表せます。${hours} 時間後の在庫数を求めなさい。`;
  const answerValue = start - rate * hours;
  const choices = [
    `${answerValue} 個`,
    `${answerValue - 10} 個`,
    `${answerValue + 12} 個`,
    `${answerValue - 15} 個`
  ];
  const explanation = `${hours} 時間後には y = ${start} - ${rate} × ${hours} = ${answerValue} 個 です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function parallelAnglesQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 2;
  const angle = 50 + (index % 7) * 5;

  if (variant === 1) {
    const question = `平行な直線 l₁ と l₂ に交わる直線 m があります。l₁ と m がつくる同位角が ${angle}° のとき、対応する錯角の大きさを求めなさい。`;
    const choices = [
      `${angle}°`,
      `${180 - angle}°`,
      `${angle + 10}°`,
      `${angle - 15}°`
    ];
    const explanation = `平行線の錯角は同位角と等しいため、${angle}° です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const question = `平行な直線 l₁ と l₂ に交わる直線 m があります。l₁ と m がつくる内角の一つが ${angle}° のとき、同じ側の内角とその和を180°とする角の大きさを求めなさい。`;
  const supplementary = 180 - angle;
  const choices = [
    `${supplementary}°`,
    `${angle}°`,
    `${supplementary + 20}°`,
    `${supplementary - 10}°`
  ];
  const explanation = `同側の内角の和は180°になるので、もう一方の角は 180° - ${angle}° = ${supplementary}° です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function congruenceProofQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 4;

  if (variant === 1) {
    const a = 5 + (index % 4);
    const b = 6 + (index % 5);
    const c = 7 + (index % 3);
    const question = `三角形ABCと三角形DEFについて、AB = DE = ${a} cm、BC = EF = ${b} cm、CA = FD = ${c} cm のとき、合同を示すのに適切な条件はどれですか。`;
    const choices = [
      'SSS（三辺がそれぞれ等しい）',
      'SAS（2辺とその間の角が等しい）',
      'ASA（1辺とその両端の角が等しい）',
      'HL（直角三角形で斜辺と1つの鋭角が等しい）'
    ];
    const explanation = `対応する三辺がすべて等しいため、SSS の条件で合同が言えます。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const question = `三角形ABCと三角形DEFで、AB = DE、AC = DF、∠A = ∠D のとき、合同を証明するのに適切な条件はどれですか。`;
    const choices = [
      'SAS（2辺とその間の角が等しい）',
      'SSS（三辺がそれぞれ等しい）',
      'ASA（1辺とその両端の角が等しい）',
      'AAS（2つの角と1つの辺が対応して等しい）'
    ];
    const explanation = `二つの辺とその間の角が等しいので、SAS で合同が言えます。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 3) {
    const question = `三角形ABCと三角形DEFで、∠A = ∠D、∠B = ∠E、AB = DE のとき、合同が成り立つ条件はどれですか。`;
    const choices = [
      'ASA（1辺とその両端の角が等しい）',
      'SSS（三辺がそれぞれ等しい）',
      'SAS（2辺とその間の角が等しい）',
      'RHS（直角三角形で斜辺と1つの辺が等しい）'
    ];
    const explanation = `1辺とその両端の角が等しいので、ASA の条件で合同が言えます。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const question = `直角三角形ABC（∠C = 90°）と直角三角形DEF（∠F = 90°）で、斜辺AB = DE、1つの鋭角∠A = ∠D のとき、合同を言える条件はどれですか。`;
  const choices = [
    'HL（直角三角形で斜辺と1つの鋭角が等しい）',
    'SSS（三辺がそれぞれ等しい）',
    'ASA（1辺とその両端の角が等しい）',
    'SAS（2辺とその間の角が等しい）'
  ];
  const explanation = `直角三角形で斜辺と1つの鋭角が等しいとき、HL の条件で合同が言えます。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function triangleQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 1) {
    const base = 6 + (index % 5);
    const height = 4 + (index % 6);
    const area = (base * height) / 2;
    const question = `底辺が ${base} cm、高さが ${height} cm の三角形の面積を求めなさい。`;
    const choices = [
      `${area} cm²`,
      `${area + 3} cm²`,
      `${area - 2} cm²`,
      `${area + 5} cm²`
    ];
    const explanation = `三角形の面積は 底辺×高さ÷2 = ${base} × ${height} ÷ 2 = ${area} cm² です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const a = 5 + (index % 4);
    const b = 7 + (index % 5);
    const c = 6 + (index % 3);
    const perimeter = a + b + c;
    const question = `三角形の3辺の長さが ${a} cm、${b} cm、${c} cm のとき、周の長さ（周囲）を求めなさい。`;
    const choices = [
      `${perimeter} cm`,
      `${perimeter + 4} cm`,
      `${perimeter - 3} cm`,
      `${perimeter + 6} cm`
    ];
    const explanation = `周囲は3辺の和で ${a} + ${b} + ${c} = ${perimeter} cm です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const angleA = 50 + (index % 5) * 5;
  const angleB = 60 + (index % 4) * 5;
  const angleC = 180 - (angleA + angleB);
  const question = `三角形の内角のうち、∠A = ${angleA}°、∠B = ${angleB}° のとき、∠C の大きさを求めなさい。`;
  const choices = [
    `${angleC}°`,
    `${angleC + 10}°`,
    `${angleC - 8}°`,
    `${angleC + 6}°`
  ];
  const explanation = `三角形の内角の和は180°なので、∠C = 180° - ${angleA}° - ${angleB}° = ${angleC}° です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function quadrilateralQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const variant = index % 3;

  if (variant === 1) {
    const length = 6 + (index % 5);
    const width = 4 + (index % 6);
    const area = length * width;
    const question = `長方形の縦が ${length} cm、横が ${width} cm のとき、面積を求めなさい。`;
    const choices = [
      `${area} cm²`,
      `${area + 8} cm²`,
      `${area - 6} cm²`,
      `${area + 10} cm²`
    ];
    const explanation = `長方形の面積は 縦×横 = ${length} × ${width} = ${area} cm² です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const angle = 60 + (index % 4) * 10;
    const question = `平行四辺形ABCDの∠Aが ${angle}° のとき、対角である ∠C の大きさを求めなさい。`;
    const choices = [
      `${angle}°`,
      `${180 - angle}°`,
      `${angle + 20}°`,
      `${angle - 15}°`
    ];
    const explanation = `平行四辺形の向かい合う角は等しいので、∠C も ${angle}° です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const side = 5 + (index % 5);
  const question = `正方形の1辺の長さが ${side} cm のとき、対角線の長さを求めなさい（√2 を含めて答えなさい）。`;
  const diagonal = `${side}√2`;
  const choices = [
    diagonal,
    `${side + 1}√2`,
    `${side}√3`,
    `${side - 1}√2`
  ];
  const explanation = `正方形の対角線は 1辺×√2 なので ${side}√2 です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function probabilityQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const red = 3 + (index % 4);
  const blue = 2 + (index % 5);
  const green = 1 + (index % 3);
  const total = red + blue + green;
  const variant = index % 3;

  if (variant === 1) {
    const question = `赤玉 ${red} 個、青玉 ${blue} 個、緑玉 ${green} 個 が入った袋から1個の玉を取り出すとき、赤玉を引く確率を分数で求めなさい。`;
    const correct = `${red}/${total}`;
    const choices = [
      correct,
      `${blue}/${total}`,
      `${green}/${total}`,
      `${red}/${total + 1}`
    ];
    const explanation = `全体 ${total} 個のうち赤玉は ${red} 個なので、確率は ${red}/${total} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  if (variant === 2) {
    const question = `赤玉 ${red} 個、青玉 ${blue} 個、緑玉 ${green} 個 の袋から1個の玉を取り出すとき、青玉を引く確率を求めなさい。`;
    const correct = `${blue}/${total}`;
    const choices = [
      correct,
      `${red}/${total}`,
      `${green}/${total}`,
      `${blue}/${total + 2}`
    ];
    const explanation = `全体 ${total} 個のうち青玉は ${blue} 個なので、確率は ${blue}/${total} です。`;
    return { id, question, type: 'multiple', choices, answer: 0, explanation };
  }

  const question = `赤玉 ${red} 個、青玉 ${blue} 個、緑玉 ${green} 個 の袋から1個の玉を取り出すとき、赤玉以外（青玉または緑玉）を引く確率を求めなさい。`;
  const success = blue + green;
  const correct = `${success}/${total}`;
  const choices = [
    correct,
    `${red}/${total}`,
    `${success}/${total + 1}`,
    `${success - 1}/${total}`
  ];
  const explanation = `赤玉以外は ${success} 個なので、確率は ${success}/${total} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

function interquartileRangeQuestion(index, unit) {
  const id = `${unit.idPrefix}-${pad(index)}`;
  const base = 10 + (index % 5) * 2;
  const data = Array.from({ length: 8 }, (_, i) => base + i * 2);
  const question = `データ: ${data.join(', ')} の四分位範囲（Q3 - Q1）を求めなさい。`;
  const lower = data.slice(0, 4);
  const upper = data.slice(4);
  const q1 = (lower[1] + lower[2]) / 2;
  const q3 = (upper[1] + upper[2]) / 2;
  const iqr = q3 - q1;
  const choices = [
    `${iqr}`,
    `${iqr + 2}`,
    `${iqr - 2}`,
    `${iqr + 4}`
  ];
  const explanation = `下側データ ${lower.join(', ')} の中央値は (${lower[1]} + ${lower[2]}) ÷ 2 = ${q1}、上側データ ${upper.join(', ')} の中央値は (${upper[1]} + ${upper[2]}) ÷ 2 = ${q3} なので、四分位範囲は ${q3} - ${q1} = ${iqr} です。`;
  return { id, question, type: 'multiple', choices, answer: 0, explanation };
}

const units = [
  {
    file: 'math-literal-calculation.json',
    unitId: 'literal-calc',
    unitName: '文字式の計算',
    category: '式の計算',
    idPrefix: 'math-literal-calc',
    generator: literalCalcQuestion
  },
  {
    file: 'math-literal-application.json',
    unitId: 'literal-application',
    unitName: '文字式の利用',
    category: '式の利用',
    idPrefix: 'math-literal-app',
    generator: literalApplicationQuestion
  },
  {
    file: 'math-simultaneous-equations.json',
    unitId: 'simultaneous-equations',
    unitName: '連立方程式',
    category: '方程式',
    idPrefix: 'math-sim-eq',
    generator: simultaneousEquationQuestion
  },
  {
    file: 'math-simultaneous-application.json',
    unitId: 'simultaneous-application',
    unitName: '連立方程式の利用',
    category: '方程式の利用',
    idPrefix: 'math-sim-app',
    generator: simultaneousApplicationQuestion
  },
  {
    file: 'math-linear-function.json',
    unitId: 'linear-function',
    unitName: '一次関数',
    category: '関数',
    idPrefix: 'math-linear-func',
    generator: linearFunctionQuestion
  },
  {
    file: 'math-linear-function-application.json',
    unitId: 'linear-function-application',
    unitName: '一次関数の利用',
    category: '関数の利用',
    idPrefix: 'math-linear-app',
    generator: linearApplicationQuestion
  },
  {
    file: 'math-parallel-angles.json',
    unitId: 'parallel-angles',
    unitName: '平行線と角',
    category: '図形',
    idPrefix: 'math-parallel',
    generator: parallelAnglesQuestion
  },
  {
    file: 'math-congruence-proof.json',
    unitId: 'congruence-proof',
    unitName: '合同と証明',
    category: '図形の性質',
    idPrefix: 'math-congruence',
    generator: congruenceProofQuestion
  },
  {
    file: 'math-triangle.json',
    unitId: 'triangle',
    unitName: '三角形',
    category: '図形',
    idPrefix: 'math-triangle',
    generator: triangleQuestion
  },
  {
    file: 'math-quadrilateral.json',
    unitId: 'quadrilateral',
    unitName: '四角形',
    category: '図形',
    idPrefix: 'math-quad',
    generator: quadrilateralQuestion
  },
  {
    file: 'math-probability.json',
    unitId: 'probability',
    unitName: '確率',
    category: '確率',
    idPrefix: 'math-prob',
    generator: probabilityQuestion
  },
  {
    file: 'math-interquartile-range.json',
    unitId: 'interquartile-range',
    unitName: '四分位範囲',
    category: '統計',
    idPrefix: 'math-iqr',
    generator: interquartileRangeQuestion
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
    questions
  };
  const outPath = path.join(outDir, unit.file);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Generated ${unit.file}`);
}
