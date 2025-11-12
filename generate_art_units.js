'use strict';

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'questions');

function padNumber(value) {
  return value.toString().padStart(3, '0');
}

function rotateChoices(list, rotation, correct) {
  const len = list.length;
  const rotated = [];
  for (let i = 0; i < len; i += 1) {
    rotated.push(list[(i + rotation) % len]);
  }
  const answer = rotated.indexOf(correct);
  if (answer === -1) {
    throw new Error('Correct answer not found in rotated choices.');
  }
  return { choices: rotated, answer };
}

function pickDistractors(pool, index, count) {
  const unique = [];
  for (const item of pool) {
    if (!unique.includes(item)) {
      unique.push(item);
    }
  }
  if (unique.length < count) {
    throw new Error('Not enough unique distractors.');
  }
  const result = [];
  let cursor = index % unique.length;
  while (result.length < count) {
    const candidate = unique[cursor];
    if (!result.includes(candidate)) {
      result.push(candidate);
    }
    cursor = (cursor + 1) % unique.length;
  }
  return result;
}

function createQuestion({ text, correct, pool, explanation, index, idPrefix }) {
  const distractors = pickDistractors(pool, index, 3);
  const { choices, answer } = rotateChoices([correct, ...distractors], index % 4, correct);
  return {
    id: `${idPrefix}-${padNumber(index)}`,
    question: text,
    type: 'multiple',
    choices,
    answer,
    explanation
  };
}

const crafts = [
  {
    name: '鎌倉彫',
    origin: '鎌倉市',
    material: '桂や朴の木材',
    technique: '木地に彫刻を施し漆を塗り重ね研ぎ出す',
    history: '禅寺の仏具づくりから発展し鎌倉時代に定着した',
    motif: '蓮華や牡丹などの寺院文様'
  },
  {
    name: '箱根寄木細工',
    origin: '箱根町',
    material: '色の異なる広葉樹材',
    technique: '幾何学模様の木組みを貼り合わせる',
    history: '江戸後期に石川仁兵衛が旅人向けに発展させた',
    motif: '麻の葉や矢羽根などの幾何文様'
  },
  {
    name: '小田原漆器',
    origin: '小田原市',
    material: 'ケヤキやトチの木材',
    technique: '挽き物木地に拭き漆や彩色漆で仕上げる',
    history: '北条氏の城下町で武具生産から器物へ広がった',
    motif: '木目を活かした落ち着いた仕上げ'
  },
  {
    name: '小田原提灯',
    origin: '小田原市',
    material: '竹ひごと美濃和紙',
    technique: '曲げた竹骨に和紙を貼り折り畳めるよう仕上げる',
    history: '江戸時代の旅籠街道で携帯用照明として発達した',
    motif: '宿場名や家紋を染め抜いた意匠'
  },
  {
    name: '小田原鋳物',
    origin: '小田原市',
    material: '銑鉄や銅合金',
    technique: '砂型を用いた鋳造と丹念な仕上げ',
    history: '戦国期に甲冑や鉄砲を鋳造した技術が基盤となった',
    motif: '実用性重視の渋い文様'
  },
  {
    name: '小田原挽物木工芸',
    origin: '小田原市',
    material: 'ミズメやトチの丸太',
    technique: 'ろくろで木地を挽き薄挽きする',
    history: '江戸時代の箱根宿で土産物として発展した',
    motif: '椀や盆の端正な曲線'
  },
  {
    name: '湘南打刃物',
    origin: '藤沢・茅ヶ崎地域',
    material: '鋼と軟鉄の鍛接材',
    technique: '鍛造と焼き入れを繰り返し刃を鍛える',
    history: '農具製作から始まり明治期に包丁へ展開した',
    motif: '実用本位で質実な刃紋'
  },
  {
    name: '相州手漉和紙',
    origin: '厚木市と愛川町',
    material: '楮や三椏の繊維',
    technique: '寒冷期に流し漉きで繊維を重ねる',
    history: '室町時代から公用紙として重宝された',
    motif: '素朴な風合いと透かし模様'
  },
  {
    name: '大山こま',
    origin: '伊勢原市',
    material: 'ブナやミズメの木材',
    technique: 'ろくろで成形し手描きで彩色する',
    history: '大山詣での土産として江戸期に流行した',
    motif: '赤青黄の同心円模様'
  },
  {
    name: '横浜スカーフ',
    origin: '横浜市',
    material: '上質なシルク生地',
    technique: '精密な捺染と手縫いの縁かがり',
    history: '開港後の輸出産業として発展した',
    motif: '港町や海をテーマにしたデザイン'
  },
  {
    name: '真鶴石細工',
    origin: '真鶴町',
    material: '小松石などの火成岩',
    technique: 'ノミと研磨で繊細な彫刻を施す',
    history: '江戸城石垣の採石から派生した',
    motif: '波や海禽をテーマにした造形'
  },
  {
    name: '江の島ガラス',
    origin: '藤沢市江の島',
    material: 'ソーダ石灰ガラス',
    technique: '宙吹きとカットを組み合わせる',
    history: '観光土産として昭和期に確立した',
    motif: '貝殻や波紋を模した意匠'
  },
  {
    name: '横須賀独楽',
    origin: '横須賀市',
    material: 'カエデやカシの木材',
    technique: 'ろくろ挽きと旋盤仕上げ',
    history: '軍港の子ども向け玩具として明治期に普及した',
    motif: '錨や星条旗を取り入れた図柄'
  },
  {
    name: '平塚七夕飾り',
    origin: '平塚市',
    material: '竹と和紙とビニールフィルム',
    technique: '立体飾りを骨組みに貼り合わせる',
    history: '戦後復興祭から全国的に知られるようになった',
    motif: '華やかな立体飾りや光る装飾'
  },
  {
    name: '鎌倉彫金',
    origin: '鎌倉市',
    material: '銀や真鍮',
    technique: '鏨で打ち出し唐草などを彫り込む',
    history: '鎌倉仏具の金具制作から派生した',
    motif: '唐草や瑞鳥をあしらった意匠'
  },
  {
    name: '川崎浮世絵木版',
    origin: '川崎市',
    material: 'サクラ材の版木',
    technique: '見当を合わせ多色摺りを行う',
    history: '東海道五十三次の宿場版元が源流',
    motif: '旅情あふれる風景図'
  },
  {
    name: '厚木竹細工',
    origin: '厚木市',
    material: '真竹や孟宗竹',
    technique: '編み込みと火曲げで形を整える',
    history: '里山の生活道具として育まれた',
    motif: '格子や麻の葉の編み目'
  },
  {
    name: '三崎ちりめん',
    origin: '三浦市',
    material: '上質な絹糸',
    technique: '強撚糸を平織りし縮緬皺を出す',
    history: '京都技術が移入され港町で定着した',
    motif: '海や船をモチーフにした柄'
  },
  {
    name: '逗子螺鈿細工',
    origin: '逗子市',
    material: '夜光貝と黒漆',
    technique: '貝片を切り嵌めて漆で埋め磨く',
    history: '武家調度の装飾として江戸期に盛んになった',
    motif: '波や桜を散らした光沢文様'
  },
  {
    name: '藤沢白磁',
    origin: '藤沢市',
    material: '白磁粘土',
    technique: 'ロクロ成形後に透明釉を掛け高温焼成する',
    history: '湘南の窯場が昭和初期に築窯した',
    motif: '爽やかな波紋レリーフ'
  }
];

const tsuishuProcesses = [
  {
    name: '木地選択',
    tool: '鋸と鉋',
    purpose: '漆との相性が良い木地を整える',
    technique: '年輪を読み狂いの少ない部位を採材する',
    history: '室町期の漆工が堆朱導入時に確立した基礎工程',
    caution: '乾燥不足の木地は漆層に割れを生じさせる'
  },
  {
    name: '布着せ',
    tool: '刷毛とヘラ',
    purpose: '木地の補強と漆の密着を高める',
    technique: '麻布を漆で貼り込み気泡を追い出す',
    history: '唐物漆器を模して江戸初期に定着した',
    caution: '布目が浮くと塗り重ね後に剥離する'
  },
  {
    name: '下地砥ぎ',
    tool: '砥石と木製ヘラ',
    purpose: '塗面の段差を整え次の塗りを密着させる',
    technique: '硬化前の漆を砥粉で研ぎ滑らかにする',
    history: '加賀の下地技法を取り入れて高度化した',
    caution: '研ぎ過ぎると布着せが露出してしまう'
  },
  {
    name: '錆漆作り',
    tool: '乳鉢と練りヘラ',
    purpose: '目止めと細かな凹凸の充填を行う',
    technique: '砥粉と生漆を練り合わせペースト状にする',
    history: '堆朱特有の厚塗りを支える要素として発展',
    caution: '配合比がずれると乾きが不揃いになる'
  },
  {
    name: '塗り重ね',
    tool: '漆刷毛',
    purpose: '層を積み重ねて彫刻に十分な厚みを得る',
    technique: '一層ごとに薄く均一に塗り布団で乾かす',
    history: '中国明代の技法を日本流に改良した',
    caution: '厚塗りしすぎると乾燥不良を起こす'
  },
  {
    name: '室管理',
    tool: '湿度計と温度計',
    purpose: '漆の乾燥に適した環境を保つ',
    technique: '湿度70%前後と温度25度前後を維持する',
    history: '明治期に科学的管理が導入された',
    caution: '風を直接当てると表面が縮む'
  },
  {
    name: '彫り起こし',
    tool: '丸刀と平刀',
    purpose: '塗り重ねた層から模様を立体的に浮かび上がらせる',
    technique: '下絵に沿って段階的に層を削り出す',
    history: '堆朱の名前の由来となる象徴的工程',
    caution: '刃の角度が鈍ると層が欠ける'
  },
  {
    name: '面取り仕上げ',
    tool: '小刀とサンドペーパー',
    purpose: 'エッジを滑らかにして手触りを整える',
    technique: '削り跡を整え微細な段差をなくす',
    history: '茶道具の需要で細やかな仕上げが求められた',
    caution: '削り過ぎると模様が崩れる'
  },
  {
    name: '磨き出し',
    tool: '炭布と油砥石',
    purpose: '艶と奥行きある光沢を引き出す',
    technique: '炭粉を使いながら段階的に磨き上げる',
    history: '明治の輸出向け製品で磨きが強調された',
    caution: '熱を持たせると漆が白濁する'
  },
  {
    name: '呂色仕上げ',
    tool: '鹿皮と菜種油',
    purpose: '鏡面に近い最終光沢を与える',
    technique: '油を含ませた鹿皮で何度も擦る',
    history: '蒔絵技法から転用され堆朱にも導入された',
    caution: '油分が多いと曇りが残る'
  },
  {
    name: '文様設計',
    tool: '和紙と墨',
    purpose: '作品の主題と構図を決定する',
    technique: '反復模様を割り付けバランスを調整する',
    history: '唐草や雲龍など中国文様を研究して成立した',
    caution: '彫り易さを考慮し過密に配置しない'
  },
  {
    name: '下絵転写',
    tool: 'トレーシングペーパーと鹿膠',
    purpose: '文様を正確に木地へ写す',
    technique: '透写した線を鹿膠で仮固定する',
    history: '明治の洋紙導入で精度が向上した',
    caution: '転写後に乾燥させないと線が流れる'
  },
  {
    name: '刃物研ぎ',
    tool: '天然砥石',
    purpose: '切れ味を保ち滑らかな彫りを可能にする',
    technique: '刃先を細かい番手の砥石で整える',
    history: '堆朱専用の刃型が江戸末期に確立した',
    caution: '片刃の角度を崩すと刃の跳ねが生じる'
  },
  {
    name: '彩色堆朱',
    tool: '色漆調合皿',
    purpose: '朱以外の色層を重ね変化を出す',
    technique: '黒や緑を交互に塗り彫りで色を引き出す',
    history: '昭和期の現代作家が提案し定着した',
    caution: '層順を誤ると狙った色が現れない'
  },
  {
    name: '象嵌併用',
    tool: '錐と木槌',
    purpose: '金属や貝を埋め込み装飾性を高める',
    technique: '凹部を彫り込み別素材を漆で固定する',
    history: '正倉院宝物に倣った高度な意匠',
    caution: '別素材の厚み管理が不十分だと段差ができる'
  },
  {
    name: '修復研磨',
    tool: '極細目の研磨紙',
    purpose: '経年で曇った表面を整える',
    technique: '最小限の研磨で艶を回復させる',
    history: '文化財修復技術の進歩で確立された',
    caution: '元の彫りを損なうほど磨かない'
  },
  {
    name: '湿度調整保管',
    tool: '桐箱と調湿剤',
    purpose: '作品の割れや白濁を防ぐ',
    technique: '通気性と緩やかな湿度調整を両立させる',
    history: '茶道具保管の知恵が堆朱にも応用された',
    caution: '直射日光と急激な乾燥を避ける'
  },
  {
    name: '鑑賞ポイント',
    tool: '照明器具',
    purpose: '彫りの陰影と色の奥行きを確認する',
    technique: '斜光を当てて層の立体感を強調する',
    history: '展覧会展示で工夫されてきた見せ方',
    caution: '強すぎる光は漆の退色を早める'
  },
  {
    name: '堆朱史料研究',
    tool: '古文書と図録',
    purpose: '意匠の変遷を学び制作に活かす',
    technique: '作品年代と図様を比較分析する',
    history: '大正期の工芸振興で調査が進んだ',
    caution: '史料の表記や寸法を正確に読み取る'
  },
  {
    name: '新素材実験',
    tool: '合成漆と測定器',
    purpose: '現代環境に適応した材料を探る',
    technique: '揮発性を測定しながら試験塗りを行う',
    history: '環境規制に対応するため平成期から進む',
    caution: '伝統漆との相性を見極めないと剥離する'
  }
];

const modernTechniques = [
  {
    name: 'デジタルペインティング',
    tool: '液晶タブレットとスタイラス',
    feature: '筆圧感知で絵具の質感を再現できる',
    application: 'コンセプトアートやイラスト制作',
    pioneer: 'CGイラストレーターの坂本元樹らが普及させた',
    tip: 'レイヤー構造を活用して修正性を高める'
  },
  {
    name: 'プロジェクションマッピング',
    tool: '高輝度プロジェクターと3Dマッピングソフト',
    feature: '立体物に映像を重ね空間を変容させる',
    application: '建築物の演出や舞台装置',
    pioneer: 'teamLabやMoment Factoryが大規模作品で注目された',
    tip: '投影対象の計測精度が映像のズレを左右する'
  },
  {
    name: 'インタラクティブアート',
    tool: 'センサーとマイコン',
    feature: '観客の動きで作品が変化する',
    application: '体験型の美術展示',
    pioneer: '久保田晃弘らが国内で研究を進めた',
    tip: '反応遅延を最小限に抑えて没入感を高める'
  },
  {
    name: '3Dプリント造形',
    tool: '3Dプリンターとモデリングソフト',
    feature: '積層構造で複雑な形状を直接造形できる',
    application: '彫刻の試作や最終作品',
    pioneer: 'ジョシュア・ハーカーなどが芸術応用を広めた',
    tip: 'データの壁厚設定が出力成功の鍵になる'
  },
  {
    name: 'バイオアート',
    tool: '培養器と顕微鏡',
    feature: '生体素材を用いて変化する作品を作る',
    application: '生命倫理を問いかける展示',
    pioneer: 'エドゥアルド・カクが代表的存在',
    tip: '生体材料の取扱い基準を遵守する'
  },
  {
    name: 'ジェネラティブアート',
    tool: 'プログラミング言語とアルゴリズム',
    feature: 'コードによる自律的な形の生成',
    application: '無限変奏のビジュアル作品',
    pioneer: 'casey reasとben fryがProcessingで普及',
    tip: '乱数の種を制御して再現性を確保する'
  },
  {
    name: 'ARアート',
    tool: 'スマートフォンとAR開発環境',
    feature: '現実空間にデジタルオブジェクトを重ねる',
    application: '都市空間の回遊型展示',
    pioneer: '坂本大三郎らが地域芸術祭で展開',
    tip: '位置情報の精度が体験品質を左右する'
  },
  {
    name: 'VRインスタレーション',
    tool: 'ヘッドマウントディスプレイとリアルタイムエンジン',
    feature: '仮想空間に没入して体験できる',
    application: '物語性のある体験型作品',
    pioneer: 'Oculus Mediumを活用するアーティスト集団が牽引',
    tip: '視線誘導を考えた空間設計が重要'
  },
  {
    name: 'ライトペインティング',
    tool: '長時間露光カメラと光源',
    feature: '光の軌跡を写真に描写する',
    application: '夜間のビジュアルアート',
    pioneer: 'ピカソの光の絵シリーズが嚆矢',
    tip: '露光時間とISO感度を慎重に調整する'
  },
  {
    name: 'サウンドスカルプチャー',
    tool: 'スピーカーアレイと音響ソフト',
    feature: '音場そのものを造形する',
    application: '音響インスタレーション',
    pioneer: 'ビル・フォンタナが公共空間で実践',
    tip: '反射音を考慮した配置が欠かせない'
  },
  {
    name: 'データビジュアライゼーション',
    tool: '統計ソフトとグラフィックツール',
    feature: '数値データを視覚的に翻訳する',
    application: '社会課題を伝えるアート',
    pioneer: 'ナタリー・マンボがデータアートで知られる',
    tip: '文脈説明を添えて理解を助ける'
  },
  {
    name: 'グリッチアート',
    tool: '画像編集ソフトとコーデック操作',
    feature: 'データ破損の美を意図的に活用する',
    application: '映像作品やポスター',
    pioneer: 'ローザ・メンケンが理論化した',
    tip: '破損度合いを段階的に試して最適値を探る'
  },
  {
    name: 'モジュラーシンセシス',
    tool: 'モジュラーシンセとパッチケーブル',
    feature: '音色をモジュール組み合わせで構築する',
    application: 'サウンドアートのライブパフォーマンス',
    pioneer: 'スザンヌ・チアーニが表現の幅を示した',
    tip: 'シグナルフローを図式化して整理する'
  },
  {
    name: 'AIスタイルトランスファ',
    tool: 'ニューラルネットワークとGPU',
    feature: '異なる絵画の筆致を画像へ転写する',
    application: '写真からの絵画風作品生成',
    pioneer: 'GoogleのDeepDream研究が契機',
    tip: '学習データの著作権に配慮する'
  },
  {
    name: 'フィジカルコンピューティング',
    tool: 'Arduinoと各種センサー',
    feature: '動きや光を制御する立体作品を作る',
    application: '参加型のインスタレーション',
    pioneer: 'メディアアート教育機関が普及を後押し',
    tip: '配線図を整備してトラブルを防ぐ'
  },
  {
    name: 'ウェアラブルアート',
    tool: '導電糸とソフトウェア',
    feature: '身につけることで機能する作品',
    application: 'ファッションとアートの融合',
    pioneer: 'Hussein Chalayanが素材実験を進めた',
    tip: '着用時の安全性と耐久性を検証する'
  },
  {
    name: 'エコロジカルアート',
    tool: '自然素材と環境測定機器',
    feature: '環境との共生をテーマにする',
    application: 'サイトスペシフィックな展示',
    pioneer: 'アグネス・デネスがランドアートで提唱',
    tip: '設置場所の生態系への影響を調査する'
  },
  {
    name: 'ネットアート',
    tool: 'Webプログラミングとサーバー',
    feature: 'インターネット上で公開される',
    application: 'オンライン参加型プロジェクト',
    pioneer: 'オリー・レニアードがEarly Webで実験',
    tip: 'ブラウザ互換性をテストする'
  },
  {
    name: 'ドローンアート',
    tool: 'プログラム制御ドローンとLED',
    feature: '編隊飛行で空間に図形を描く',
    application: '屋外の大規模パフォーマンス',
    pioneer: 'インテルのドローンショーが象徴的',
    tip: '飛行ルートの安全管理計画が最優先'
  },
  {
    name: 'ホログラムアート',
    tool: 'ホログラム撮影装置とレーザー',
    feature: '光干渉で立体像を再現する',
    application: '立体表示のインスタレーション',
    pioneer: '新井康雄が美術表現として紹介',
    tip: '照明角度を一定に保ち像を鮮明にする'
  }
];

function buildCraftQuestions() {
  const questions = [];
  let index = 1;
  crafts.forEach((craft, craftIndex) => {
    const others = crafts.filter((_, i) => i !== craftIndex);
    questions.push(
      createQuestion({
        text: `「${craft.name}」の主な産地として正しいものを選びなさい。`,
        correct: craft.origin,
        pool: others.map(item => item.origin),
        explanation: `「${craft.name}」は${craft.origin}で受け継がれている伝統工芸です。`,
        index,
        idPrefix: 'art-kanagawa'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `「${craft.name}」で中心的に用いられる素材はどれですか。`,
        correct: craft.material,
        pool: others.map(item => item.material),
        explanation: `「${craft.name}」では${craft.material}が代表的に使われます。`,
        index,
        idPrefix: 'art-kanagawa'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `「${craft.name}」の制作工程で特徴的な技法として最も適切なのはどれですか。`,
        correct: craft.technique,
        pool: others.map(item => item.technique),
        explanation: `「${craft.name}」では${craft.technique}ことが特徴です。`,
        index,
        idPrefix: 'art-kanagawa'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `「${craft.name}」の歴史に関する説明として正しいものを選びなさい。`,
        correct: craft.history,
        pool: others.map(item => item.history),
        explanation: craft.history,
        index,
        idPrefix: 'art-kanagawa'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `「${craft.name}」でよく見られる意匠・モチーフはどれですか。`,
        correct: craft.motif,
        pool: others.map(item => item.motif),
        explanation: `「${craft.name}」では${craft.motif}が親しまれています。`,
        index,
        idPrefix: 'art-kanagawa'
      })
    );
    index += 1;
  });
  if (questions.length !== 100) {
    throw new Error('神奈川県の伝統工芸の問題数が100ではありません。');
  }
  return questions;
}

function buildTsuishuQuestions() {
  const questions = [];
  let index = 1;
  tsuishuProcesses.forEach((process, processIndex) => {
    const others = tsuishuProcesses.filter((_, i) => i !== processIndex);
    questions.push(
      createQuestion({
        text: `堆朱の工程「${process.name}」で主に使用する道具はどれですか。`,
        correct: process.tool,
        pool: others.map(item => item.tool),
        explanation: `「${process.name}」では${process.tool}を使うのが基本です。`,
        index,
        idPrefix: 'art-tsuishu'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `堆朱の工程「${process.name}」の目的として最も適切なものはどれですか。`,
        correct: process.purpose,
        pool: others.map(item => item.purpose),
        explanation: `「${process.name}」は${process.purpose}ために行われます。`,
        index,
        idPrefix: 'art-tsuishu'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `堆朱の工程「${process.name}」で行われる技法として正しいものを選びなさい。`,
        correct: process.technique,
        pool: others.map(item => item.technique),
        explanation: `「${process.name}」では${process.technique}ことが大切です。`,
        index,
        idPrefix: 'art-tsuishu'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `堆朱の工程「${process.name}」に関する歴史的背景として正しいものはどれですか。`,
        correct: process.history,
        pool: others.map(item => item.history),
        explanation: process.history,
        index,
        idPrefix: 'art-tsuishu'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `堆朱の工程「${process.name}」を行う際の注意点として適切なのはどれですか。`,
        correct: process.caution,
        pool: others.map(item => item.caution),
        explanation: process.caution,
        index,
        idPrefix: 'art-tsuishu'
      })
    );
    index += 1;
  });
  if (questions.length !== 100) {
    throw new Error('堆朱工芸の問題数が100ではありません。');
  }
  return questions;
}

function buildModernQuestions() {
  const questions = [];
  let index = 1;
  modernTechniques.forEach((tech, techIndex) => {
    const others = modernTechniques.filter((_, i) => i !== techIndex);
    questions.push(
      createQuestion({
        text: `モダンテクニック「${tech.name}」で主に使用するツールはどれですか。`,
        correct: tech.tool,
        pool: others.map(item => item.tool),
        explanation: `「${tech.name}」では${tech.tool}が基本的なツールです。`,
        index,
        idPrefix: 'art-modern'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `モダンテクニック「${tech.name}」の特徴として最も適切なのはどれですか。`,
        correct: tech.feature,
        pool: others.map(item => item.feature),
        explanation: `「${tech.name}」の特徴は${tech.feature}ことです。`,
        index,
        idPrefix: 'art-modern'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `モダンテクニック「${tech.name}」の代表的な活用場面はどれですか。`,
        correct: tech.application,
        pool: others.map(item => item.application),
        explanation: `「${tech.name}」は${tech.application}で活躍します。`,
        index,
        idPrefix: 'art-modern'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `モダンテクニック「${tech.name}」を広めた人物・団体として適切なのはどれですか。`,
        correct: tech.pioneer,
        pool: others.map(item => item.pioneer),
        explanation: tech.pioneer,
        index,
        idPrefix: 'art-modern'
      })
    );
    index += 1;
    questions.push(
      createQuestion({
        text: `モダンテクニック「${tech.name}」を実践する際のポイントとして正しいものを選びなさい。`,
        correct: tech.tip,
        pool: others.map(item => item.tip),
        explanation: `「${tech.name}」では${tech.tip}ことが重要です。`,
        index,
        idPrefix: 'art-modern'
      })
    );
    index += 1;
  });
  if (questions.length !== 100) {
    throw new Error('モダンテクニックの問題数が100ではありません。');
  }
  return questions;
}

const units = [
  {
    file: 'art-kanagawa-traditional-crafts.json',
    data: {
      subject: 'art',
      subjectName: '美術',
      unitId: 'kanagawa-traditional-crafts',
      unitName: '神奈川県の伝統工芸',
      category: '地域文化',
      questions: buildCraftQuestions()
    }
  },
  {
    file: 'art-tsuishu-crafts.json',
    data: {
      subject: 'art',
      subjectName: '美術',
      unitId: 'tsuishu-crafts',
      unitName: '堆朱工芸',
      category: '工芸技法',
      questions: buildTsuishuQuestions()
    }
  },
  {
    file: 'art-modern-techniques.json',
    data: {
      subject: 'art',
      subjectName: '美術',
      unitId: 'modern-techniques',
      unitName: 'モダンテクニック',
      category: '現代表現',
      questions: buildModernQuestions()
    }
  }
];

units.forEach(unit => {
  const outputPath = path.join(outDir, unit.file);
  fs.writeFileSync(outputPath, `${JSON.stringify(unit.data, null, 2)}\n`, 'utf8');
  console.log(`Generated ${unit.file} with ${unit.data.questions.length} questions.`);
});
