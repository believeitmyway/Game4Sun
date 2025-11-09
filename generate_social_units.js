const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'questions');

function pad(num) {
  return num.toString().padStart(3, '0');
}

function createIdGenerator(prefix) {
  let counter = 1;
  return () => `${prefix}-${pad(counter++)}`;
}

function pickDistractors(items, currentItem, field, count) {
  const options = [];
  for (const item of items) {
    if (item === currentItem) {
      continue;
    }
    const value = item[field];
    if (!options.includes(value) && value !== currentItem[field]) {
      options.push(value);
    }
    if (options.length === count) {
      break;
    }
  }
  if (options.length < count) {
    // If not enough unique options, fill with generic placeholders to avoid crashing.
    while (options.length < count) {
      options.push(`選択肢不足${options.length + 1}`);
    }
  }
  return options;
}

function makeQuestion(id, question, choices, explanation) {
  return {
    id,
    question,
    type: 'multiple',
    choices,
    answer: 0,
    explanation
  };
}

function generateQuestionsFromConfigs(items, idPrefix, fieldConfigs, limit = 100) {
  const nextId = createIdGenerator(idPrefix);
  const questions = [];

  for (const config of fieldConfigs) {
    const { field, questionBuilder, explanationBuilder } = config;
    for (const item of items) {
      const correct = item[field];
      if (typeof correct === 'undefined') {
        throw new Error(`Missing field "${field}" in item: ${JSON.stringify(item)}`);
      }
      const distractors = pickDistractors(items, item, field, 3);
      const choices = [correct, ...distractors];
      questions.push(
        makeQuestion(
          nextId(),
          questionBuilder(item),
          choices,
          explanationBuilder(item)
        )
      );
      if (questions.length === limit) {
        return questions;
      }
    }
  }

  return questions.slice(0, limit);
}

const localSurveyScenarios = [
  {
    scenario: '通学路の安全点検を行う',
    method: '朝と夕方の通学時間帯に交差点や歩道を歩いて観察する',
    indicator: '歩行者と車両の通行量の変化',
    dataSource: '市教育委員会が公表する通学路安全マップ',
    presentation: '危険箇所を地図に色分けした安全点検報告ポスター',
    interview: '通学路で見守り活動をしているPTAのボランティア'
  },
  {
    scenario: '商店街の賑わいを調べる',
    method: '平日と休日で時間帯を変えながら通行量をカウントする',
    indicator: '来街者数と買い物客の滞留時間',
    dataSource: '商店街振興組合がまとめた月別売上統計',
    presentation: '曜日別と時間帯別の棒グラフを組み合わせた資料',
    interview: '商店街で長く店を構える老舗の店主'
  },
  {
    scenario: '地域の公園の利用状況を調べる',
    method: '平日と休日の午前・午後に公園で利用者を観察記録する',
    indicator: '利用者の年齢層と遊具の利用頻度',
    dataSource: '市役所公園緑地課が作成した施設利用統計',
    presentation: '年齢層別の円グラフと利用時間帯の折れ線グラフ',
    interview: '公園を清掃している地域のボランティア団体'
  },
  {
    scenario: 'ごみ集積所のマナーを調べる',
    method: '収集日前日に集積所を巡回してごみの出され方を記録する',
    indicator: '分別の状況と決められた時間前の排出件数',
    dataSource: '市のごみ分別ルール冊子と収集日カレンダー',
    presentation: '分別状況を写真付きでまとめた啓発掲示',
    interview: '町内会でごみ集積所を管理している担当者'
  },
  {
    scenario: '地域を流れる小さな川の水質を調べる',
    method: '決めた地点で定期的に採水し透明度や匂いを測る',
    indicator: '水の透明度と水温の季節変化',
    dataSource: '県の水質調査データベースと過去の測定結果',
    presentation: '採水地点を示した地図と測定値の折れ線グラフ',
    interview: '川沿いの環境保全活動を続けている市民団体の代表'
  },
  {
    scenario: '地域のお祭りの準備状況を調べる',
    method: '準備期間中に会場を訪ねて役割分担を観察する',
    indicator: '参加団体数と担い手の年代構成',
    dataSource: '自治会が配布する祭りの運営計画書',
    presentation: '作業工程をタイムライン化した掲示資料',
    interview: '祭りの運営を統括する自治会長'
  },
  {
    scenario: '高齢者の見守り活動を調べる',
    method: '見守り活動に同行して訪問の様子を観察する',
    indicator: '訪問件数と見守り対象者の主な困りごと',
    dataSource: '地域包括支援センターが作成する活動記録',
    presentation: '活動の流れをまとめた図解と事例紹介',
    interview: '見守り活動を担当している民生委員'
  },
  {
    scenario: '空き地の利用希望を調べる',
    method: '周辺住民へのアンケートを配布し回収する',
    indicator: '希望する利用内容の割合と理由',
    dataSource: '市の都市計画図と用途地域の指定状況',
    presentation: '希望内容を分類した円グラフと自由記述のまとめ',
    interview: '空き地の所有者と地域で活動するまちづくり団体'
  },
  {
    scenario: '公共施設のバリアフリー状況を調べる',
    method: '施設内をルートごとに移動し段差や案内表示を記録する',
    indicator: '段差の数とバリアフリー設備の設置箇所',
    dataSource: '施設が公開するフロアガイドとバリアフリーマップ',
    presentation: '段差や案内表示を写真と地図で示した報告書',
    interview: '車椅子利用者の意見をまとめている障害者団体の担当者'
  },
  {
    scenario: '地域バスの利用状況を調べる',
    method: '路線ごとに乗車して乗降客数と利用時間帯を記録する',
    indicator: '停留所ごとの平均乗降客数',
    dataSource: 'バス会社が公開するダイヤと利用統計',
    presentation: '停留所別のヒートマップと利用者の声のまとめ',
    interview: 'バス路線の計画を担当する交通政策課の職員'
  },
  {
    scenario: '大雨時の道路冠水箇所を調べる',
    method: '降雨後に問題となる地点を確認し住民から情報を集める',
    indicator: '冠水の頻度と水深の目安',
    dataSource: '市のハザードマップと道路標高データ',
    presentation: '冠水箇所を地図上に記した危険情報ポスター',
    interview: '大雨のたびに対応している消防団の団員'
  },
  {
    scenario: '防災倉庫の備蓄状況を調べる',
    method: '倉庫を訪ね備蓄品の種類と数量を棚卸しする',
    indicator: '備蓄品の種類と使用期限の管理状況',
    dataSource: '自治体が示す地域防災計画と備蓄品リスト',
    presentation: '備蓄品の充足率を一覧表にまとめたチェックリスト',
    interview: '防災倉庫の鍵を管理している自治会防災担当者'
  },
  {
    scenario: '町内会活動の参加状況を調べる',
    method: '定例会や清掃活動を見学し参加者を記録する',
    indicator: '活動ごとの参加人数と参加者の年代',
    dataSource: '町内会の年間行事予定と会費収支報告',
    presentation: '活動別の参加人数を棒グラフにしたレポート',
    interview: '町内会の役員と活動に積極的な住民'
  },
  {
    scenario: '地域を訪れる観光客の動きを調べる',
    method: '観光案内所付近で滞在時間と訪問先を聞き取り調査する',
    indicator: '訪問目的と人気スポットの組み合わせ',
    dataSource: '観光協会の入込客数統計とイベント情報',
    presentation: '動線を模式図にしたルートマップとコメント集',
    interview: '観光案内所で案内業務を行うスタッフ'
  },
  {
    scenario: '駅前の通勤時間帯の混雑を調べる',
    method: '通勤時間帯に改札周辺で混雑状況をカウントする',
    indicator: '改札通過人数と滞留時間',
    dataSource: '鉄道会社の乗降客数データ',
    presentation: '時間帯別混雑度を色分けしたヒートマップ',
    interview: '駅の運営を担当する駅長や助役'
  },
  {
    scenario: '住宅地の夜間騒音を調べる',
    method: '夜間の時間帯を変えて騒音計で測定する',
    indicator: '時間帯別の平均騒音レベル',
    dataSource: '環境省が定める環境基準と地域の騒音規制条例',
    presentation: '時間帯別騒音レベルの折れ線グラフ',
    interview: '騒音の苦情を受け付けている市役所環境課の担当者'
  },
  {
    scenario: '自転車の利用マナーを調べる',
    method: '主要な交差点で自転車の走行方法を観察する',
    indicator: '歩道走行の割合と信号無視の件数',
    dataSource: '警察署の交通事故統計と安全教室の資料',
    presentation: '良い例と悪い例を写真比較した啓発パネル',
    interview: '交通安全教室を担当する警察署の広報担当者'
  },
  {
    scenario: '学校周辺の花壇整備状況を調べる',
    method: '季節ごとに花壇を巡回して植栽の管理状況を記録する',
    indicator: '植栽の本数と手入れの頻度',
    dataSource: '学校と地域団体の協定書や活動計画',
    presentation: '四季の変化を写真でまとめた掲示板',
    interview: '花壇の世話を担当している地域の園芸クラブ'
  },
  {
    scenario: '地域図書館の利用状況を調べる',
    method: '利用者アンケートと貸出カウンターでの滞留観察を行う',
    indicator: '貸出冊数と利用者の年代構成',
    dataSource: '図書館が公開する月次統計と蔵書構成表',
    presentation: '貸出冊数の推移グラフと利用者の声のまとめ',
    interview: '図書館サービスを担当する司書'
  },
  {
    scenario: '夜間の街灯の照度を調べる',
    method: '決めたルートを夜間に歩き照度計で明るさを測る',
    indicator: '街灯ごとの照度と暗がりの位置',
    dataSource: '市の街路灯管理台帳と照明計画',
    presentation: '明暗を色分けした地図と改善提案リスト',
    interview: '街路灯の維持管理を担当する土木事務所の技術職員'
  },
  {
    scenario: '空き家の実態を調べる',
    method: '現地調査と固定資産税台帳の閲覧で空き家を特定する',
    indicator: '空き家の戸数と所在地の分布',
    dataSource: '市の空き家バンクと固定資産税課の台帳情報',
    presentation: '空き家分布を示す地図と管理状況の一覧表',
    interview: '空き家対策を担当する市役所住宅政策課の職員'
  },
  {
    scenario: '子どもの遊び場の安全性を調べる',
    method: '遊具の損耗状況をチェックリストで点検する',
    indicator: '遊具の故障箇所と事故の発生状況',
    dataSource: '市の遊具安全点検マニュアルと過去の事故報告',
    presentation: '点検結果をレーダーチャートで示した安全評価表',
    interview: '児童館で安全指導を行う職員'
  },
  {
    scenario: '近隣農地の耕作状況を調べる',
    method: '季節ごとに農地を訪ね作付状況を聞き取りする',
    indicator: '作付面積と栽培品目の変化',
    dataSource: '農業委員会がまとめる農地台帳と営農計画',
    presentation: '作付品目を色分けした農地マップ',
    interview: '農地を管理する農業委員と主な生産者'
  },
  {
    scenario: '雪かきボランティアの体制を調べる',
    method: '降雪期にボランティア活動へ同行し作業を記録する',
    indicator: '出動回数と支援対象者の属性',
    dataSource: '市社会福祉協議会の雪害対応記録',
    presentation: '出動状況を時間軸で整理した報告ポスター',
    interview: '雪かきボランティアの調整を担当する社会福祉協議会職員'
  },
  {
    scenario: '避難経路の掲示状況を調べる',
    method: '公共施設や店舗を巡回し避難誘導標識を確認する',
    indicator: '避難標識の設置率と劣化状況',
    dataSource: '地域防災計画に掲載された指定避難所一覧',
    presentation: '避難標識の位置をまとめたチェックマップ',
    interview: '防災訓練を統括する地域防災リーダー'
  },
  {
    scenario: '地域の歴史的建造物の保存状況を調べる',
    method: '保全対象の建物を巡り保護措置を記録する',
    indicator: '保全措置の実施有無と維持管理の頻度',
    dataSource: '教育委員会文化財課の指定文化財リスト',
    presentation: '建造物ごとの保全状況を写真付きでまとめたリーフレット',
    interview: '文化財保全を担当する教育委員会の学芸員'
  },
  {
    scenario: '地域の防犯カメラ設置状況を調べる',
    method: '商店街や公園などを歩いて設置場所を地図に記録する',
    indicator: '防犯カメラの設置箇所数と死角',
    dataSource: '防犯協会が作成する防犯カメラ運用計画',
    presentation: '設置箇所を示したマップと死角の分析コメント',
    interview: '防犯カメラの運用を担当する防犯協会の担当者'
  }
];

const japanLandformsClimateItems = [
  {
    name: '富士山',
    feature: '日本で最も高い成層火山で標高3776 m',
    region: '静岡県と山梨県の県境',
    climateEffect: '高原気候となり夏でも平均気温が低い',
    risk: '噴火時には火山灰や泥流が周辺地域に影響する',
    keyword: '成層火山'
  },
  {
    name: '北アルプス（飛騨山脈）',
    feature: '標高3000 m級の山々が連なる日本アルプスの一部',
    region: '長野県・岐阜県・富山県にまたがる',
    climateEffect: '日本海側と太平洋側の気候を分ける分水嶺となる',
    risk: '雪崩や落石など高山特有の災害が起こりやすい',
    keyword: '隆起山脈'
  },
  {
    name: '阿蘇山',
    feature: '世界最大級のカルデラを持つ活火山',
    region: '熊本県阿蘇地域',
    climateEffect: '外輪山が周辺の気候を緩やかにし草原が広がる',
    risk: '噴火による降灰や火砕流が観光や農業に影響する',
    keyword: 'カルデラ'
  },
  {
    name: '大雪山系',
    feature: '北海道の屋根と呼ばれる火山群で高山植物が豊富',
    region: '北海道中央部',
    climateEffect: '寒冷な気候で夏でも雪渓が残る',
    risk: '厳しい寒さと急な天候変化による登山事故',
    keyword: '火山群'
  },
  {
    name: '石狩川',
    feature: '北海道最長の川で上川盆地を潤す',
    region: '大雪山系を源に石狩湾へ流れる',
    climateEffect: '雪解け水が春の流量を増やす',
    risk: '洪水や氾濫で低地に被害が出ることがある',
    keyword: '穀倉地帯を潤す河川'
  },
  {
    name: '信濃川',
    feature: '日本最長の河川で水系が広い',
    region: '長野県妙高山麓を源に新潟県へ流れる',
    climateEffect: '日本海側の多雪が雪解け洪水を引き起こす',
    risk: '流域で冬の豪雪と春の洪水対策が重要',
    keyword: '日本最長の川'
  },
  {
    name: '利根川',
    feature: '関東地方を流れる大河で水運に利用された',
    region: '群馬県を源に関東平野を通り太平洋へ注ぐ',
    climateEffect: '流域で台風時に大雨が集中しやすい',
    risk: '堤防決壊による洪水対策が江戸時代から課題',
    keyword: '坂東太郎'
  },
  {
    name: '吉野川',
    feature: '四国三郎と呼ばれる急流で発電に利用される',
    region: '高知県の石鎚山脈を源に徳島県へ流れる',
    climateEffect: '山間部に多雨をもたらし水量が多い',
    risk: '大雨時の氾濫や土砂災害が発生しやすい',
    keyword: '急流河川'
  },
  {
    name: '最上川',
    feature: '山形県を北流し日本海に注ぐ河川',
    region: '山形県の盆地を貫流し酒田市付近で海へ',
    climateEffect: '雪国であるため冬の降雪が流量に影響する',
    risk: '江戸時代から洪水対策として治水工事が行われた',
    keyword: '三大急流'
  },
  {
    name: '関東平野',
    feature: '日本最大の平野で首都圏が広がる',
    region: '関東地方一帯',
    climateEffect: '太平洋側気候で冬は乾燥した晴天が多い',
    risk: '都市化に伴う地盤沈下や洪水リスクがある',
    keyword: '日本最大の平野'
  },
  {
    name: '濃尾平野',
    feature: '木曽三川がつくった沖積平野で工業が発達',
    region: '愛知県・岐阜県・三重県に広がる',
    climateEffect: '木曽川の水が稲作を支える温暖な気候',
    risk: '輪中地帯で洪水から集落を守る工夫がされている',
    keyword: '輪中地帯'
  },
  {
    name: '筑紫平野',
    feature: '九州北部の代表的な平野で米作が盛ん',
    region: '福岡県と佐賀県にまたがる',
    climateEffect: '温暖で降水量が多く二毛作が可能',
    risk: '有明海沿岸で干潟の保全と洪水対策が課題',
    keyword: '二毛作地帯'
  },
  {
    name: '十勝平野',
    feature: '北海道東部の大規模畑作地帯',
    region: '北海道十勝地方',
    climateEffect: '冷涼で日較差が大きく畑作に適する',
    risk: '寒冷害や霜害に備えた農業経営が必要',
    keyword: '畑作王国'
  },
  {
    name: '庄内平野',
    feature: '山形県西部の稲作地帯で日本海に面する',
    region: '山形県庄内地方',
    climateEffect: '日本海側の冬季多雪と夏のフェーンが特徴',
    risk: '強風と砂丘の飛砂対策が求められる',
    keyword: '庄内米'
  },
  {
    name: '瀬戸内海式気候',
    feature: '年間を通して降水量が少なく晴天が多い温暖な気候',
    region: '中国・四国地方の瀬戸内海沿岸',
    climateEffect: '冬は比較的温暖で晴天が続く',
    risk: '渇水による水不足が生じやすい',
    keyword: '少雨温暖'
  },
  {
    name: '日本海側の冬の気候',
    feature: '季節風で雪雲が流れ込み豪雪となる',
    region: '本州日本海側から北海道西岸',
    climateEffect: '冬は曇天が多く積雪が深い',
    risk: '豪雪災害やなだれが頻発する',
    keyword: '豪雪地帯'
  },
  {
    name: '太平洋側の気候',
    feature: '冬は乾燥した晴天が多く夏は台風や梅雨で降水が増える',
    region: '本州太平洋側と四国・九州東岸',
    climateEffect: '冬に乾いた季節風が吹きフェーンで気温が上がることもある',
    risk: '夏の台風や豪雨による土砂災害が発生しやすい',
    keyword: '冬晴れ'
  },
  {
    name: '中央高地の内陸気候',
    feature: '日較差が大きく夏暑く冬寒い気候',
    region: '長野県や岐阜県内陸の盆地',
    climateEffect: '湿度が低く晴天が多い',
    risk: '冬の冷え込みと霜害が農業に影響',
    keyword: '内陸性気候'
  },
  {
    name: '南西諸島の亜熱帯気候',
    feature: '年間を通じて気温が高く降水も多い',
    region: '沖縄県から奄美大島にかけて',
    climateEffect: '夏は台風の通過が多く高温多湿',
    risk: '台風の暴風雨や高潮被害が大きい',
    keyword: '亜熱帯'
  },
  {
    name: '黒潮（日本海流）',
    feature: 'フィリピン付近から日本沿岸を北上する強い暖流',
    region: '南西諸島から本州南岸の太平洋沿い',
    climateEffect: '沿岸を温暖にし霜の発生を抑える',
    risk: '台風の勢力を保ったまま上陸させる要因となる',
    keyword: '暖流'
  },
  {
    name: '親潮（千島海流）',
    feature: 'オホーツク海から南下する寒流',
    region: '北海道東岸から三陸沖',
    climateEffect: '海水温を下げ霧を発生させる',
    risk: '漁場に豊かなプランクトンをもたらすが海霧で航行が難しい',
    keyword: '寒流'
  },
  {
    name: '対馬海流',
    feature: '日本海を北上する暖流で漁場を豊かにする',
    region: '九州北西岸から日本海沿岸',
    climateEffect: '冬でも比較的温暖な気候をもたらす',
    risk: '海水温上昇による赤潮の発生につながることがある',
    keyword: '日本海の暖流'
  },
  {
    name: 'リマン海流',
    feature: '沿海州沿岸から南下する寒流',
    region: 'ロシア沿海州から北海道西方沖',
    climateEffect: '日本海北部の海水温を下げる',
    risk: '冬季の流氷を南下させ漁業に影響する',
    keyword: '日本海の寒流'
  },
  {
    name: 'フェーン現象',
    feature: '山を越えた乾いた暖かい風が吹き下ろす現象',
    region: '日本海側で風が山を越えて太平洋側へ',
    climateEffect: '気温が急上昇し乾燥する',
    risk: '農作物の高温障害や山火事を起こしやすい',
    keyword: '乾燥熱風'
  },
  {
    name: '冬の季節風（北西季節風）',
    feature: 'シベリア高気圧から吹く冷たい北西の風',
    region: '日本海側から列島全体',
    climateEffect: '日本海側に雪を降らせ太平洋側を乾燥させる',
    risk: '体感温度を下げ吹雪を引き起こす',
    keyword: 'モンスーン'
  }
];

const japanPopulationIndustryItems = [
  {
    name: '首都圏（東京圏）',
    feature: '日本最大の人口を抱える都市圏で政治・経済の中心となっている',
    region: '東京都・神奈川県・埼玉県・千葉県',
    strength: '情報通信業や金融業など高度な第3次産業が集中する',
    challenge: '人口過密に伴う住宅不足や交通混雑、地価高騰が課題',
    keyword: 'メガロポリス'
  },
  {
    name: '中京圏（名古屋圏）',
    feature: '自動車産業を中心に製造業が発達した都市圏',
    region: '愛知県・岐阜県南部・三重県北部',
    strength: '輸送用機械工業と関連部品産業の集積が強み',
    challenge: 'サプライチェーンの再編や技能労働者の確保が課題',
    keyword: '自動車工業集積'
  },
  {
    name: '近畿圏（京阪神）',
    feature: '古くから商業と文化が発達した大都市圏',
    region: '大阪府・京都府・兵庫県',
    strength: '中小企業の技術力とサービス業、観光業の多様性',
    challenge: '少子高齢化と都心部の再開発の両立',
    keyword: '商業都市圏'
  },
  {
    name: '福岡都市圏',
    feature: '九州の玄関口として人口が集中する成長都市圏',
    region: '福岡県福岡市周辺',
    strength: 'アジアとのビジネス拠点として物流・IT産業が伸びる',
    challenge: '再開発に伴う交通渋滞や防災対策の強化',
    keyword: '九州の中枢'
  },
  {
    name: '札幌都市圏',
    feature: '北海道最大の人口を持つ行政・経済の中心地',
    region: '北海道札幌市と周辺自治体',
    strength: '観光やサービス業、食関連産業の集積',
    challenge: '冬季の除雪体制と人口高齢化への対応',
    keyword: '道都'
  },
  {
    name: '東北地方の人口動態',
    feature: '人口減少と高齢化が進む地域が多い',
    region: '青森県から福島県までの東北地方全域',
    strength: '農林水産資源と再生可能エネルギーのポテンシャル',
    challenge: '若年層の都市部流出と地域産業の維持',
    keyword: '人口減少地域'
  },
  {
    name: '中山間地域',
    feature: '山地と山裾に広がる農林業主体の地域',
    region: '全国の山間部と盆地周辺',
    strength: '棚田や林業など地域固有の生産が行われる',
    challenge: '高齢化と労働力不足による耕作放棄地の増加',
    keyword: '中山間地'
  },
  {
    name: '三大都市圏への人口集中',
    feature: '戦後から続く大都市圏への人口移動現象',
    region: '首都圏・中京圏・近畿圏',
    strength: '雇用機会と教育機関が多く若年層を引き付ける',
    challenge: '地方との人口格差拡大と都市インフラへの負荷',
    keyword: '一極集中'
  },
  {
    name: '過疎地域',
    feature: '人口が著しく減少し行政サービス維持が難しい地域',
    region: '離島や山間部など全国各地',
    strength: '自然環境や伝統文化が豊かに残る',
    challenge: '医療・交通・買い物など生活利便性の確保',
    keyword: '過疎化'
  },
  {
    name: '高齢化社会',
    feature: '65歳以上人口が総人口の21%を超えた社会構造',
    region: '全国的に進行',
    strength: '医療・介護関連産業が拡大する',
    challenge: '社会保障費の増大と労働力人口の減少',
    keyword: '高齢化率'
  },
  {
    name: '製造品出荷額が多い愛知県',
    feature: '製造品出荷額が全国トップクラスを維持する県',
    region: '中部地方の愛知県',
    strength: '自動車産業を中心に輸送機械生産が盛ん',
    challenge: 'エネルギーコスト上昇とカーボンニュートラル対応',
    keyword: '工業王国'
  },
  {
    name: '輸送機器工業',
    feature: '自動車や航空機などを生産する基幹産業',
    region: '中部・九州北部・関東南部など',
    strength: '部品のサプライチェーンが国内外に広がる',
    challenge: '電動化や自動運転への技術転換',
    keyword: 'モビリティ産業'
  },
  {
    name: '電子部品・デバイス産業（九州シリコンアイランド）',
    feature: '半導体関連工場が集積する産業地域',
    region: '熊本県・大分県・長崎県など九州北部',
    strength: '半導体製造装置やメモリ生産が行われる',
    challenge: '高エネルギー需要と人材確保',
    keyword: 'シリコンアイランド'
  },
  {
    name: '瀬戸内工業地域',
    feature: '臨海部に重化学工業が集積した地域',
    region: '岡山県・広島県・山口県・香川県など',
    strength: '石油化学や鉄鋼、造船など多様な重工業',
    challenge: '老朽化設備の更新と環境負荷の低減',
    keyword: '臨海工業地帯'
  },
  {
    name: '京浜工業地帯',
    feature: '日本最大の工業地帯で高付加価値産業が集まる',
    region: '東京湾沿岸の東京・神奈川・千葉',
    strength: '精密機械や化学、印刷などの先端産業',
    challenge: '工場の海外移転と都市再開発の両立',
    keyword: '京浜工業地帯'
  },
  {
    name: '阪神工業地帯',
    feature: '重化学工業と機械工業が発達した伝統的工業地帯',
    region: '大阪湾沿岸の大阪府・兵庫県',
    strength: '鉄鋼・造船・機械などの多角的な産業構造',
    challenge: '老朽化した港湾設備の更新と環境対策',
    keyword: '阪神工業地帯'
  },
  {
    name: '北九州工業地帯',
    feature: '製鉄を中心に重化学工業が発展した地域',
    region: '福岡県北九州市周辺',
    strength: '官営八幡製鉄所以来の鉄鋼と化学工業',
    challenge: '鉄鋼需要の変化と環境負荷低減',
    keyword: '北九州工業地帯'
  },
  {
    name: '太平洋ベルト',
    feature: '太平洋沿岸に工業や人口が連なって分布する地域',
    region: '千葉県から北九州までの臨海部',
    strength: '工業・港湾・交通インフラが密集する',
    challenge: '南海トラフ地震や台風への防災対策',
    keyword: '産業軸'
  },
  {
    name: '北海道の酪農',
    feature: '広大な草地を活用した大規模酪農が行われる',
    region: '北海道東部や根釧台地',
    strength: '生乳生産量が全国トップで乳製品加工が盛ん',
    challenge: '飼料価格の高騰と担い手不足',
    keyword: '酪農王国'
  },
  {
    name: '北陸の繊維産業',
    feature: '化学繊維や合成繊維の生産が盛んな地域',
    region: '福井県・石川県などの北陸地方',
    strength: '合繊を中心とした高機能素材の開発',
    challenge: '海外生産との競合と国内需要の縮小',
    keyword: '合繊産地'
  },
  {
    name: '瀬戸内の造船業',
    feature: '穏やかな海域を活かした造船所が集まる',
    region: '広島県呉市・愛媛県今治市など瀬戸内沿岸',
    strength: '中型船やばら積み船の建造技術',
    challenge: '国際競争の激化と省エネ船への対応',
    keyword: '造船クラスター'
  },
  {
    name: '九州北部の製鉄',
    feature: '官営八幡製鉄所以来の鉄鋼生産が続く',
    region: '福岡県北九州市と周辺',
    strength: '高炉による鉄鋼一貫生産と再資源化技術',
    challenge: '炭素排出削減と国際価格競争',
    keyword: '製鉄拠点'
  },
  {
    name: '再生可能エネルギー（風力）',
    feature: '風の強い地域で導入が進む再生可能エネルギー',
    region: '北海道・東北・九州沿岸など',
    strength: '化石燃料に頼らない発電として期待される',
    challenge: '景観や騒音への配慮と送電網整備',
    keyword: '風力発電'
  },
  {
    name: '地熱発電（大分・熊本）',
    feature: '火山地帯の地下熱を利用した発電',
    region: '九州の別府・八丁原・南阿蘇など',
    strength: '安定した基幹電源として運転可能',
    challenge: '温泉資源との調整と探査コスト',
    keyword: '地熱発電'
  },
  {
    name: '第3次産業の拡大',
    feature: 'サービス業の就業者が総就業者の7割近くを占める状況',
    region: '全国都市部を中心に拡大',
    strength: '情報通信・医療・教育など多様なサービス提供',
    challenge: '人手不足や労働生産性の向上',
    keyword: 'サービス経済化'
  },
  {
    name: '農業の高付加価値化',
    feature: 'ブランド野菜や有機農法による付加価値向上の取り組み',
    region: '各地の先進的な農業地域',
    strength: '地域ブランド化で販路拡大を目指す',
    challenge: '担い手育成と輸送コストの負担',
    keyword: '6次産業化'
  }
];

const kinkiRegionItems = [
  {
    name: '大阪府',
    feature: '近畿地方の経済と交通の中心で人口が最も多い',
    location: '大阪平野と大阪湾岸部',
    industry: '商業・サービス業が集積し情報関連産業も発達している',
    culture: '食文化や文楽・上方落語などの伝統芸能が盛ん',
    keyword: 'なにわの台所'
  },
  {
    name: '京都府',
    feature: '千年以上首都であった歴史都市で文化財が豊富',
    location: '京都盆地と北部の丹後地方',
    industry: '観光業と伝統工芸、西陣織などの地場産業',
    culture: '祇園祭や寺社行事など世界文化遺産が多い',
    keyword: '古都'
  },
  {
    name: '兵庫県',
    feature: '日本海と太平洋に面し多彩な地形を持つ',
    location: '瀬戸内海沿岸の阪神地域から但馬・淡路まで',
    industry: '神戸港を中心に重化学工業と機械工業が発達',
    culture: '神戸の異国文化や姫路城などの歴史遺産',
    keyword: '港湾都市'
  },
  {
    name: '滋賀県',
    feature: '日本最大の湖である琵琶湖を擁する内陸県',
    location: '近江盆地と鈴鹿山脈・比良山地',
    industry: '電子部品や金属加工、近江米など農業も盛ん',
    culture: '近江商人の商業精神と比叡山延暦寺',
    keyword: '琵琶湖の県'
  },
  {
    name: '奈良県',
    feature: '律令国家の都が置かれた歴史資源が豊富',
    location: '奈良盆地と吉野山地',
    industry: '観光業と靴下などの軽工業',
    culture: '東大寺や法隆寺、吉野の桜など世界遺産が集中',
    keyword: '古都奈良'
  },
  {
    name: '和歌山県',
    feature: '紀伊半島南部を占め温暖な気候で果樹栽培が盛ん',
    location: '紀伊山地と太平洋に面した海岸',
    industry: '梅やみかんの果樹農業、漁業、化学工業',
    culture: '熊野古道や高野山など信仰の聖地',
    keyword: '紀州'
  },
  {
    name: '三重県',
    feature: '伊勢湾岸と紀伊半島東部に広がる県',
    location: '北勢・中勢・伊勢志摩・紀伊山地',
    industry: '自動車部品や石油化学、真珠養殖が盛ん',
    culture: '伊勢神宮や熊野古道などの信仰文化',
    keyword: '伊勢の国'
  },
  {
    name: '琵琶湖',
    feature: '日本最大の淡水湖で近畿の水資源を支える',
    location: '滋賀県中央部',
    industry: '上水道・農業用水・物流に利用される',
    culture: '湖岸の水郷文化とレジャー観光',
    keyword: '淡水湖'
  },
  {
    name: '淀川',
    feature: '琵琶湖を水源として大阪湾に注ぐ重要な河川',
    location: '滋賀県から京都盆地、大阪平野へ流れる',
    industry: '水運と水資源が京阪神の工業と生活を支える',
    culture: '淀川舟運が上方文化の発展に寄与',
    keyword: '京阪神の母なる川'
  },
  {
    name: '紀伊山地',
    feature: '降水量が多く森林資源に恵まれた山地',
    location: '和歌山・奈良・三重の県境一帯',
    industry: '林業や木材加工、吉野杉の生産',
    culture: '熊野三山への参詣道が世界遺産',
    keyword: '熊野'
  },
  {
    name: '阪神工業地帯',
    feature: '大阪湾沿岸に重化学工業が集積した工業地帯',
    location: '大阪府と兵庫県南部の臨海部',
    industry: '鉄鋼・造船・機械・石油化学など',
    culture: '港湾都市の発展が商都文化を育んだ',
    keyword: '重化学工業'
  },
  {
    name: '京阪神大都市圏',
    feature: '京都・大阪・神戸が連なる人口1,900万人規模の都市圏',
    location: '大阪湾沿岸と内陸盆地',
    industry: 'サービス業と製造業のバランスが取れた経済圏',
    culture: '多彩な祭礼や食文化、エンターテインメント産業',
    keyword: '関西圏'
  },
  {
    name: '関西国際空港',
    feature: '海上に建設された国際ハブ空港',
    location: '大阪湾泉州沖の人工島',
    industry: '国際物流と観光客の受け入れを担う',
    culture: '夜景観光や地域イベントと連携',
    keyword: '海上空港'
  },
  {
    name: 'ユニバーサル・スタジオ・ジャパン',
    feature: '大阪市此花区にあるテーマパーク',
    location: '大阪市此花区桜島',
    industry: '観光・エンターテインメント産業を牽引',
    culture: '映画やアニメの世界を再現したコンテンツ',
    keyword: 'USJ'
  },
  {
    name: '祇園祭',
    feature: '京都市で7月に行われる日本三大祭りの一つ',
    location: '京都市中心部',
    industry: '観光需要を高める伝統的な祭礼',
    culture: '豪華な山鉾巡行と町衆文化',
    keyword: '山鉾行事'
  },
  {
    name: '法隆寺',
    feature: '世界最古の木造建築群を持つ寺院',
    location: '奈良県斑鳩町',
    industry: '文化財観光と地域の歴史学習資源',
    culture: '聖徳太子ゆかりの仏教文化',
    keyword: '世界遺産'
  },
  {
    name: '熊野古道',
    feature: '熊野三山へ至る巡礼道の総称',
    location: '紀伊山地を南北に結ぶルート',
    industry: 'スピリチュアルツーリズムとエコツーリズム',
    culture: '自然崇拝と信仰が生む文化的景観',
    keyword: '巡礼路'
  },
  {
    name: '伊勢神宮',
    feature: '日本人の心のふるさとと呼ばれる神社',
    location: '三重県伊勢市',
    industry: '参拝観光と外宮・内宮周辺の土産産業',
    culture: '式年遷宮に代表される神道文化',
    keyword: '大神宮'
  },
  {
    name: '吉野杉林業',
    feature: '良質な杉材を育てる長期育林が特徴',
    location: '奈良県吉野地方',
    industry: '建材・工芸材のブランド化',
    culture: '林業文化と木材加工の技術伝承',
    keyword: '長伐期林業'
  },
  {
    name: '淡路島のタマネギ',
    feature: '甘味と辛味のバランスが良いブランド玉ねぎ',
    location: '兵庫県淡路島',
    industry: 'タマネギ栽培と加工品、農産物流通',
    culture: '島の農村文化と食のブランド化',
    keyword: '淡路島ブランド'
  },
  {
    name: '神戸港',
    feature: '日本有数の国際貿易港でコンテナ取扱量が多い',
    location: '兵庫県神戸市中央区',
    industry: '国際物流とクルーズ観光、港湾関連産業',
    culture: '開港以来の国際都市文化',
    keyword: '国際貿易港'
  },
  {
    name: '尼崎の鉄鋼業',
    feature: '阪神工業地帯を支える重工業の一角',
    location: '兵庫県尼崎市の臨海部',
    industry: '電炉による鉄鋼再生産や金属加工',
    culture: '工業と生活が近接する都市構造',
    keyword: '電炉の街'
  },
  {
    name: '近江米',
    feature: '琵琶湖の豊富な水で育つブランド米',
    location: '滋賀県全域',
    industry: '稲作農業と直販・6次産業化',
    culture: 'ふなずしなど湖魚との食文化',
    keyword: 'ブランド米'
  },
  {
    name: '舞鶴港',
    feature: '日本海側の重要な軍港・商港として発展',
    location: '京都府舞鶴市',
    industry: '海上自衛隊基地と物流・造船関連産業',
    culture: '赤れんが倉庫群など近代化遺産',
    keyword: '日本海側の港'
  },
  {
    name: '奈良公園のシカ',
    feature: '国の天然記念物に指定された鹿が生息',
    location: '奈良県奈良市の奈良公園一帯',
    industry: '観光資源として国内外から来訪者が多い',
    culture: '鹿せんべい文化と神鹿信仰',
    keyword: '神鹿'
  },
  {
    name: '大阪万博記念公園',
    feature: '1970年万国博覧会跡地を整備した広域公園',
    location: '大阪府吹田市',
    industry: '観光・レクリエーション施設とMICE需要',
    culture: '太陽の塔など現代芸術の象徴',
    keyword: '万博のレガシー'
  }
];

const chubuRegionItems = [
  {
    name: '愛知県',
    feature: '自動車産業を中心に製造品出荷額が全国トップクラス',
    location: '中部地方南西部の尾張・三河地域',
    industry: 'トヨタ自動車など輸送機器工業と化学工業が発達',
    culture: '熱田神宮や犬山城など歴史資源と名古屋めしの食文化',
    keyword: '工業王国'
  },
  {
    name: '静岡県',
    feature: '富士山を望む温暖な気候で工業と農業が盛ん',
    location: '太平洋沿岸の駿河湾・遠州灘に面する',
    industry: '輸送機器・楽器・製紙と茶業・みかん栽培',
    culture: '富士山本宮浅間大社や三保松原など世界文化遺産',
    keyword: '東海道の要地'
  },
  {
    name: '長野県',
    feature: '日本アルプスに囲まれた内陸県で高原が広がる',
    location: '中央高地の盆地と山岳地帯',
    industry: '精密機械や電子部品、レタスなど高原野菜の栽培',
    culture: '善光寺や松本城、避暑地文化',
    keyword: '信州'
  },
  {
    name: '岐阜県',
    feature: '飛騨山脈と美濃平野からなる内陸県',
    location: '中部地方内陸で三重・愛知と接する',
    industry: '航空宇宙産業と美濃和紙、陶磁器などの地場産業',
    culture: '岐阜提灯や鵜飼、郡上おどりが有名',
    keyword: '飛山濃水'
  },
  {
    name: '山梨県',
    feature: '富士山北麓と甲府盆地を中心に果樹栽培が盛ん',
    location: '中部高地の富士・南アルプス山麓',
    industry: 'ぶどう・もも栽培とワイン醸造、宝飾加工',
    culture: '武田神社や身延山久遠寺などの歴史文化',
    keyword: 'フルーツ王国'
  },
  {
    name: '新潟県',
    feature: '日本海側最大の平野と米どころとして知られる',
    location: '越後平野と佐渡島を含む広大な県域',
    industry: 'コシヒカリなど稲作、石油・天然ガス、金属加工',
    culture: '佐渡の能・花笠踊りや雪国文化',
    keyword: '越後'
  },
  {
    name: '富山県',
    feature: '巨大な扇状地と豊かな水資源を活かした工業地帯',
    location: '北陸地方の富山湾沿岸',
    industry: '医薬品・アルミ・機械工業とチューリップ栽培',
    culture: 'おわら風の盆や薬売り文化',
    keyword: 'くすりの富山'
  },
  {
    name: '石川県',
    feature: '加賀百万石として栄えた伝統工芸と観光県',
    location: '能登半島と加賀平野に広がる',
    industry: '輪島塗や九谷焼など伝統工芸と精密機械',
    culture: '金沢の茶屋街と兼六園、加賀友禅',
    keyword: '加賀百万石'
  },
  {
    name: '福井県',
    feature: '繊維産業と原子力発電所が立地する北陸の県',
    location: '若狭湾と越前海岸を有する',
    industry: '眼鏡フレームや合成繊維、若狭塗り箸',
    culture: '永平寺と恐竜博物館が学習観光資源',
    keyword: '越前'
  },
  {
    name: '三重県北勢地域',
    feature: '中京工業地帯の一角を担う臨海工業地帯',
    location: '三重県四日市市から鈴鹿市にかけて',
    industry: '石油化学・金属・自動車部品工業',
    culture: '四日市祭りや鈴鹿サーキットによる観光',
    keyword: '四日市コンビナート'
  },
  {
    name: '中京工業地帯',
    feature: '自動車産業を中心に日本最大規模の工業地帯',
    location: '愛知県西部から岐阜県南部、三重県北部',
    industry: '輸送用機械、航空宇宙、鉄鋼・化学工業',
    culture: '工場夜景や産業観光が注目される',
    keyword: 'ものづくり拠点'
  },
  {
    name: '北陸工業地域',
    feature: '臨海・内陸両方で化学繊維や機械工業が発達',
    location: '富山・石川・福井に広がる',
    industry: '化学繊維、アルミ加工、水力発電を活かした工業',
    culture: '雪国ならではの生活文化と祭礼',
    keyword: '雪と水の工業'
  },
  {
    name: '甲府盆地',
    feature: '果樹栽培と宝飾加工が集中する内陸盆地',
    location: '山梨県中央部の盆地',
    industry: 'ぶどう・ももなどの果樹園芸と宝飾産業',
    culture: '甲州印伝や武田氏ゆかりの史跡',
    keyword: 'フルーツ盆地'
  },
  {
    name: '諏訪湖周辺',
    feature: '精密機械と時計産業が発達した内陸工業地域',
    location: '長野県諏訪市・岡谷市周辺',
    industry: '精密機械・電子部品・光学機器の製造',
    culture: '御柱祭や諏訪大社など地域の祭礼',
    keyword: '東洋のスイス'
  },
  {
    name: '富士山麓の高原野菜',
    feature: '冷涼な気候を活かしたレタス・キャベツ栽培',
    location: '長野県南部や山梨県富士北麓の高原地帯',
    industry: '夏秋野菜の大規模栽培と出荷調整',
    culture: '移動農業従事者による季節労働文化',
    keyword: '高原レタス'
  },
  {
    name: '飛騨高山',
    feature: '江戸期の町並みが残る山間の観光都市',
    location: '岐阜県高山市',
    industry: '観光と家具製造、飛騨牛ブランド',
    culture: '高山祭や飛騨民芸の伝統',
    keyword: '小京都'
  },
  {
    name: '白川郷の合掌造り',
    feature: '急勾配の茅葺き屋根を持つ集落景観',
    location: '岐阜県白川村',
    industry: '世界遺産観光と民宿経営',
    culture: '合掌造りの共同生活と養蚕文化',
    keyword: '世界遺産'
  },
  {
    name: '金沢市の伝統工芸',
    feature: '加賀友禅や金箔など工芸が息づく城下町',
    location: '石川県金沢市',
    industry: '伝統工芸品の製造・販売と観光サービス',
    culture: '茶屋街や兼六園、加賀料理',
    keyword: '工芸都市'
  },
  {
    name: '富山湾のホタルイカ漁',
    feature: '春に光るホタルイカが水揚げされる漁業',
    location: '富山県滑川市沖の富山湾',
    industry: '底引き網漁と加工品の出荷',
    culture: 'ホタルイカ観光と発光ショー',
    keyword: 'ホタルイカ'
  },
  {
    name: '新潟魚沼地域の米作',
    feature: '豪雪地帯で雪解け水を利用した良質米生産',
    location: '新潟県魚沼市・南魚沼市',
    industry: 'コシヒカリを中心としたブランド米販売',
    culture: '雪室保存や季節行事が残る豪雪文化',
    keyword: '魚沼産コシヒカリ'
  },
  {
    name: '静岡牧之原台地の茶業',
    feature: '広大な台地に茶畑が広がる日本有数の茶産地',
    location: '静岡県島田市・牧之原市',
    industry: '深蒸し茶の生産と製茶工場が立地',
    culture: '八十八夜の新茶摘みや茶業文化',
    keyword: '深蒸し茶'
  },
  {
    name: '浜松市の楽器産業',
    feature: 'ピアノや楽器メーカーが集積する工業都市',
    location: '静岡県浜松市',
    industry: 'ヤマハやカワイなど楽器・輸送機器製造',
    culture: '浜松まつりの凧揚げと音楽イベント',
    keyword: '楽器の街'
  },
  {
    name: '豊田市（トヨタ自動車）',
    feature: 'トヨタ自動車の本社が立地する企業城下町',
    location: '愛知県東部の三河地域',
    industry: '自動車組立と研究開発、関連企業の集積',
    culture: '企業スポーツや地域交通整備',
    keyword: 'モビリティシティ'
  },
  {
    name: '中部国際空港（セントレア）',
    feature: '海上人工島に建設された国際拠点空港',
    location: '愛知県常滑市沖の伊勢湾',
    industry: '航空貨物・旅客輸送と免税店・整備業務',
    culture: '空港島の観光施設や祭礼イベント',
    keyword: 'セントレア'
  },
  {
    name: '能登半島観光',
    feature: '里山里海の景観と漁村文化が残る観光地域',
    location: '石川県能登半島',
    industry: '観光・漁業・塩づくりなど伝統産業',
    culture: 'あえのことや輪島の朝市など民俗行事',
    keyword: '里山里海'
  }
];

const kantoRegionItems = [
  {
    name: '東京都',
    feature: '日本の首都として政治・経済・文化が集中する',
    location: '関東平野南部の東京湾沿岸',
    industry: '金融・情報通信・メディアなど第3次産業が圧倒的',
    culture: '江戸以来の下町文化と最新の都市文化が共存',
    keyword: '首都'
  },
  {
    name: '神奈川県',
    feature: '横浜・川崎の臨海工業と湘南の観光が共存する',
    location: '相模湾と東京湾に面し丹沢山地を内陸に抱く',
    industry: '自動車・化学・電気機械と観光業が盛ん',
    culture: '横浜港開港以来の国際文化と鎌倉の歴史遺産',
    keyword: '港町と湘南'
  },
  {
    name: '埼玉県',
    feature: '首都圏のベッドタウンと工業団地が広がる内陸県',
    location: '関東平野中央部で荒川・利根川流域',
    industry: '自動車部品・電機・食品加工と物流業',
    culture: '川越の蔵造りの町並みや秩父の祭礼',
    keyword: '彩の国'
  },
  {
    name: '千葉県',
    feature: '成田空港と京葉工業地域、農漁業も盛んな県',
    location: '房総半島と東京湾東岸',
    industry: '石油化学・鉄鋼・農業（落花生・野菜）・水産業',
    culture: '成田山新勝寺や房総の祭礼・海女文化',
    keyword: '房総'
  },
  {
    name: '茨城県',
    feature: '農業生産額が高く工業・研究施設も立地',
    location: '太平洋に面した関東北東部',
    industry: '鹿島臨海工業地帯の化学工業とメロン・レンコン栽培',
    culture: '水戸の梅まつりや笠間焼などの伝統',
    keyword: 'いばらき'
  },
  {
    name: '栃木県',
    feature: '日光など観光資源と自動車関連工業が発達',
    location: '関東北部で那須・日光の山地と関東平野が並ぶ',
    industry: '自動車・機械・食品加工、いちご生産',
    culture: '日光東照宮や益子焼、宇都宮餃子',
    keyword: '日光の国'
  },
  {
    name: '群馬県',
    feature: '内陸工業と温泉観光が盛んな県',
    location: '関東北西部で上毛三山を抱く',
    industry: '自動車部品・電機・製糸業の歴史',
    culture: '草津温泉や富岡製糸場、上州の祭り',
    keyword: '上州'
  },
  {
    name: '横浜港',
    feature: '日本を代表するコンテナ港で貿易量が多い',
    location: '神奈川県横浜市の東京湾沿岸',
    industry: '国際物流・造船・港湾関連サービス',
    culture: '赤レンガ倉庫や中華街など観光資源',
    keyword: '開港港'
  },
  {
    name: '川崎臨海工業地帯',
    feature: '石油化学・鉄鋼など重化学工業が集中',
    location: '神奈川県川崎市の東京湾沿岸',
    industry: '石油化学コンビナートと製鉄所、発電所',
    culture: '工場夜景観光や川崎大師の信仰',
    keyword: '京浜工業地帯'
  },
  {
    name: '京葉工業地域',
    feature: '石油化学・製鉄・電力施設が並ぶ臨海工業地域',
    location: '千葉県市原市から千葉市にかけての東京湾岸',
    industry: '石油化学・製鉄・火力発電・食品加工',
    culture: '工場夜景と千葉港の物流文化',
    keyword: '京葉コンビナート'
  },
  {
    name: '成田国際空港',
    feature: '日本の空の玄関口として国際便を担う',
    location: '千葉県成田市',
    industry: '国際航空旅客・貨物輸送と空港関連サービス',
    culture: '空港見学や成田山参拝と連携した観光',
    keyword: '成田空港'
  },
  {
    name: '筑波研究学園都市',
    feature: '科学技術研究機関が集積する計画都市',
    location: '茨城県つくば市',
    industry: '国立研究所・大学・ベンチャー企業',
    culture: '科学博覧会やつくばマラソンなど地域イベント',
    keyword: 'サイエンスシティ'
  },
  {
    name: '日光東照宮',
    feature: '徳川家康を祀る豪華絢爛な社殿が並ぶ世界遺産',
    location: '栃木県日光市',
    industry: '観光業と土産物産業',
    culture: '三猿や眠り猫の彫刻、二荒山信仰',
    keyword: '世界遺産'
  },
  {
    name: '関東ローム層',
    feature: '火山灰が堆積した肥沃だが水はけの良い赤土',
    location: '関東平野全域に広がる台地',
    industry: '畑作や住宅地造成に活用',
    culture: '畑作文化と都市開発を支える地盤',
    keyword: '赤土台地'
  },
  {
    name: '霞ヶ浦',
    feature: '日本で2番目に大きい湖で水資源と漁業の拠点',
    location: '茨城県南東部',
    industry: 'レンコン栽培やコイ・ワカサギ漁、淡水養殖',
    culture: '帆引き船観光や水郷の祭り',
    keyword: '水郷'
  },
  {
    name: '草津温泉',
    feature: '日本三名泉の一つで豊富な湯量と強い酸性泉',
    location: '群馬県吾妻郡草津町',
    industry: '温泉観光と旅館業、湯畑を中心とした商業',
    culture: '湯もみ・踊りなど温泉街の伝統行事',
    keyword: '湯畑'
  },
  {
    name: '那須高原',
    feature: '避暑地として知られる高原リゾート',
    location: '栃木県那須町・那須塩原市',
    industry: '観光・酪農・リゾート開発',
    culture: '那須御用邸やアウトドア文化',
    keyword: '避暑地'
  },
  {
    name: '鹿島臨海工業地帯',
    feature: '鉄鋼・石油化学・発電が集積した新興工業地域',
    location: '茨城県鹿嶋市・神栖市の太平洋岸',
    industry: '製鉄・石油化学・火力発電と港湾物流',
    culture: '鹿島神宮やサッカー文化との共存',
    keyword: '鹿島コンビナート'
  },
  {
    name: '房総半島の沿岸漁業',
    feature: '黒潮の影響で暖流系の魚が豊富に水揚げされる',
    location: '千葉県房総半島沿岸',
    industry: 'イセエビ・カツオ・サンマの漁業と水産加工',
    culture: '勝浦朝市や海女文化、漁師料理',
    keyword: '房総漁業'
  },
  {
    name: '川越の蔵造りの町並み',
    feature: '江戸の商家建築が残る歴史的景観',
    location: '埼玉県川越市中心部',
    industry: '観光・菓子屋横丁の土産産業',
    culture: '川越まつりと蔵造り建築の保存',
    keyword: '小江戸'
  },
  {
    name: '東京臨海副都心',
    feature: '再開発されたウォーターフロントの業務・観光拠点',
    location: '東京都江東区・港区のお台場周辺',
    industry: '国際展示場・IT企業・観光施設',
    culture: '未来的な都市景観とイベント',
    keyword: 'お台場'
  },
  {
    name: '首都圏外郭放水路',
    feature: '地下に建設された巨大な洪水調整施設',
    location: '埼玉県春日部市から庄和地区',
    industry: '洪水対策インフラで水害防止に寄与',
    culture: '地下神殿と呼ばれる見学ツアーが人気',
    keyword: '地下放水路'
  },
  {
    name: '千葉県の落花生生産',
    feature: '国内生産量の約8割を占める特産農作物',
    location: '千葉県北西部の台地',
    industry: '落花生栽培と加工、直売所ビジネス',
    culture: '煎り落花生やピーナツ味噌など郷土食',
    keyword: '落花生'
  },
  {
    name: '湘南観光',
    feature: '海水浴やサーフィンが盛んな海岸観光地',
    location: '神奈川県藤沢市・茅ヶ崎市・鎌倉市の太平洋岸',
    industry: '海浜レジャー・観光サービス・飲食業',
    culture: '江ノ電沿線の風景とサーフカルチャー',
    keyword: '湘南'
  },
  {
    name: '太田市の自動車工業',
    feature: 'SUBARUの本拠地として自動車生産が盛ん',
    location: '群馬県太田市',
    industry: '自動車組立とエンジン、航空機部品製造',
    culture: '企業城下町としての地域一体のものづくり',
    keyword: 'スバルの街'
  }
];

const tohokuRegionItems = [
  {
    name: '青森県',
    feature: '本州最北端で冷涼な気候と豊かな森林資源を持つ',
    location: '津軽半島と下北半島に囲まれた津軽平野と八甲田山系',
    industry: 'りんご栽培やヒバ材の林業、水産業',
    culture: 'ねぶた祭りや津軽三味線などの伝統芸能',
    keyword: '津軽'
  },
  {
    name: '岩手県',
    feature: '本州最大の面積を持ち山岳と沿岸が広がる',
    location: '北上高地と奥羽山脈、三陸海岸沿い',
    industry: '乳牛・畜産、鉄鋼・セメント、漁業',
    culture: 'チャグチャグ馬コや盛岡さんさ踊り',
    keyword: 'いわて'
  },
  {
    name: '宮城県',
    feature: '東北地方の経済・行政の中心',
    location: '仙台平野と三陸海岸の南部',
    industry: '電子部品・食品加工と稲作、漁業',
    culture: '仙台七夕まつりや伊達文化',
    keyword: '杜の都'
  },
  {
    name: '秋田県',
    feature: '日本海側で米作と資源開発が盛んな県',
    location: '秋田平野と出羽山地、大潟村干拓地',
    industry: 'あきたこまちの稲作、油田と地熱、木材加工',
    culture: 'なまはげや竿燈まつり',
    keyword: 'あきた'
  },
  {
    name: '山形県',
    feature: '盆地が連なり果樹園芸と稲作が盛ん',
    location: '庄内平野と最上・置賜・村山盆地',
    industry: 'さくらんぼ・ラ・フランス、金属加工',
    culture: '花笠まつりや山寺の信仰',
    keyword: 'さくらんぼ王国'
  },
  {
    name: '福島県',
    feature: '浜通り・中通り・会津の地域性が異なる広大な県',
    location: '太平洋沿岸から内陸盆地、会津山地まで',
    industry: '電子機器・食品加工、果物（桃・梨）、エネルギー関連',
    culture: '会津藩の歴史と大内宿、相馬野馬追',
    keyword: 'みちのく玄関'
  },
  {
    name: '仙台市',
    feature: '人口100万を超える東北最大の都市',
    location: '宮城県中央部の仙台平野',
    industry: '情報サービス・金融・大学研究機関、製造業',
    culture: '青葉まつりや牛たんなどの食文化',
    keyword: '杜の都'
  },
  {
    name: '三陸海岸',
    feature: 'リアス式海岸が続き漁業資源が豊富',
    location: '青森県南部から岩手・宮城沿岸',
    industry: 'ワカメ・カキ養殖や遠洋漁業、水産加工',
    culture: '海と共生する祭礼や漁師文化',
    keyword: 'リアス式海岸'
  },
  {
    name: '奥羽山脈',
    feature: '東北地方を南北に貫く山脈で豪雪地帯を形成',
    location: '青森県から福島県に連なる内陸部',
    industry: '林業・水力発電とスキー観光',
    culture: '山岳信仰と温泉文化',
    keyword: '東北の背骨'
  },
  {
    name: '十和田湖',
    feature: 'カルデラ湖と奥入瀬渓流が観光地',
    location: '青森県と秋田県の県境',
    industry: '観光・旅館業と淡水漁業',
    culture: '湖水祭りや奥入瀬散策',
    keyword: 'カルデラ湖'
  },
  {
    name: '津軽平野のりんご生産',
    feature: '寒冷地に適したりんごがブランド化',
    location: '青森県弘前市周辺の津軽平野',
    industry: 'りんごの栽培・選果・ジュース加工',
    culture: '弘前りんご花まつりや剪定技術の伝承',
    keyword: '津軽りんご'
  },
  {
    name: '八戸港の水産業',
    feature: 'イカ・サバなど北洋漁業の基地',
    location: '青森県八戸市の太平洋岸',
    industry: '遠洋漁業・冷凍加工・フィッシュミール',
    culture: '八戸えんぶりや朝市文化',
    keyword: '八戸漁港'
  },
  {
    name: '南部鉄器',
    feature: '盛岡と水沢で作られる伝統的な鉄器',
    location: '岩手県盛岡市・奥州市水沢',
    industry: '鉄瓶・茶器などの工芸品製造',
    culture: '鋳物師の技術継承と茶道文化',
    keyword: '伝統工芸'
  },
  {
    name: '花巻温泉郷',
    feature: '豊富な湯量と多彩な温泉宿が集まる',
    location: '岩手県花巻市の山あい',
    industry: '温泉旅館・観光、農業と連携した食文化',
    culture: '宮沢賢治ゆかりの地と花巻祭り',
    keyword: '温泉郷'
  },
  {
    name: '大潟村干拓地',
    feature: '八郎潟を干拓して造成された大型農地',
    location: '秋田県中央部の日本海側',
    industry: '大規模稲作と機械化農業',
    culture: '干拓の歴史を伝える資料館と農村祭',
    keyword: '干拓農地'
  },
  {
    name: '庄内平野の稲作',
    feature: '日本海側で良質な米を生産する平野',
    location: '山形県庄内地域',
    industry: 'つや姫・はえぬきなどのブランド米栽培',
    culture: '庄内藩の米文化と酒蔵',
    keyword: '庄内米'
  },
  {
    name: '置賜盆地の果樹園',
    feature: '昼夜の気温差を生かした果樹栽培',
    location: '山形県南部の置賜盆地',
    industry: 'ぶどう・りんご・ラ・フランスの栽培とワイン醸造',
    culture: '上杉まつりや農家民宿の文化',
    keyword: '果樹王国'
  },
  {
    name: '会津若松の伝統産業',
    feature: '漆器や鶴ヶ城を中心とした歴史都市',
    location: '福島県会津若松市',
    industry: '会津塗・日本酒・観光業',
    culture: '鶴ヶ城・白虎隊の史跡と会津絵ろうそく',
    keyword: '会津'
  },
  {
    name: 'いわき市の工業とエネルギー',
    feature: '常磐炭鉱に由来するエネルギー産業と工業団地',
    location: '福島県いわき市の太平洋岸',
    industry: '化学工業・発電所・医療機器',
    culture: 'ハワイアンズなど観光と炭鉱遺産',
    keyword: '常磐'
  },
  {
    name: '三陸の養殖漁業',
    feature: 'ワカメ・カキ・ホタテの養殖が盛ん',
    location: '岩手県・宮城県の三陸沿岸',
    industry: '養殖・加工・ブランド化',
    culture: '海女や漁師の祭礼と震災復興の取り組み',
    keyword: '養殖王国'
  },
  {
    name: '東北新幹線',
    feature: '東京と新青森を結ぶ高速鉄道',
    location: '関東から東北を南北に貫通',
    industry: '高速輸送によるビジネス・観光振興',
    culture: '沿線イベントと駅弁文化',
    keyword: '新幹線'
  },
  {
    name: '青函トンネル',
    feature: '本州と北海道を結ぶ世界有数の海底トンネル',
    location: '青森県津軽半島と北海道渡島半島の間',
    industry: '鉄道貨物・旅客輸送の大動脈',
    culture: '建設史や海峡文化を伝える記念館',
    keyword: '海底トンネル'
  },
  {
    name: '仙台平野の米作',
    feature: '広大な沖積平野で良質米を生産',
    location: '宮城県中部の阿武隈川・鳴瀬川流域',
    industry: 'ひとめぼれなどの稲作と集約農業',
    culture: '田植え踊りや農村祭礼',
    keyword: 'ひとめぼれ'
  },
  {
    name: '気仙沼のフカヒレ加工',
    feature: 'サメ漁とフカヒレ加工で知られる港町',
    location: '宮城県気仙沼市',
    industry: 'サメ漁・フカヒレ加工・水産加工品',
    culture: '海の市や港祭り、震災復興の取組',
    keyword: 'フカヒレ'
  },
  {
    name: '盛岡さんさ踊り',
    feature: '太鼓と踊りで知られる日本一の太鼓パレード',
    location: '岩手県盛岡市',
    industry: '観光イベントとして地域経済を活性化',
    culture: '夏祭りとして市民が参加し伝統を継承',
    keyword: 'さんさ踊り'
  }
];

const hokkaidoRegionItems = [
  {
    name: '札幌市',
    feature: '北海道の道庁所在地で人口約200万の中枢都市',
    location: '石狩平野の南西部',
    industry: '行政・情報サービス・食品加工・観光',
    culture: '札幌雪まつりや時計台など都市景観',
    keyword: '北の都'
  },
  {
    name: '函館市',
    feature: '津軽海峡に面し夜景と歴史的建造物が残る港町',
    location: '北海道南端の函館山周辺',
    industry: '観光・水産加工・物流',
    culture: '五稜郭や朝市、和洋折衷建築',
    keyword: '函館夜景'
  },
  {
    name: '旭川市',
    feature: '道北の中核都市で内陸の物流拠点',
    location: '上川盆地を流れる石狩川沿い',
    industry: '機械・木工・食品加工と観光',
    culture: '旭山動物園や冬まつり',
    keyword: '旭山動物園'
  },
  {
    name: '釧路市',
    feature: '湿原と港湾を有する道東の拠点都市',
    location: '太平洋に面した釧路湿原の南部',
    industry: '水産業・紙パルプ・観光',
    culture: '炉端焼きや霧の街の風情',
    keyword: '霧の港'
  },
  {
    name: '帯広市',
    feature: '十勝平野の中心都市で畑作と酪農が盛ん',
    location: '北海道東部の十勝平野中央',
    industry: '小麦・豆・ビートの畑作と食品加工',
    culture: 'ばんえい競馬やスイーツ文化',
    keyword: '十勝'
  },
  {
    name: '稚内市',
    feature: '日本最北端の市でロシアとの交流拠点',
    location: '宗谷岬を含む宗谷丘陵',
    industry: '漁業・観光・風力発電',
    culture: '宗谷岬の碑や北方文化の交流',
    keyword: '最北端'
  },
  {
    name: '石狩平野',
    feature: '北海道最大の平野で稲作と都市が広がる',
    location: '札幌周辺から石狩湾にかけて',
    industry: '米作・野菜栽培と都市型工業',
    culture: '屯田兵開拓の歴史と農村文化',
    keyword: '北海道の穀倉'
  },
  {
    name: '根釧台地',
    feature: '広大な火山灰台地で酪農が盛ん',
    location: '根室半島と釧路にまたがる台地',
    industry: '牧草地を利用した大規模酪農',
    culture: '放牧景観と乳製品ブランド',
    keyword: '酪農王国'
  },
  {
    name: '知床半島',
    feature: '世界自然遺産に登録された野生生物の宝庫',
    location: 'オホーツク海に突き出た半島',
    industry: 'エコツーリズムと漁業',
    culture: '流氷ウォークや熊と共生する文化',
    keyword: '世界自然遺産'
  },
  {
    name: '大雪山国立公園',
    feature: '北海道の屋根と呼ばれる火山群と高山植物',
    location: '北海道中央部',
    industry: '登山・観光・温泉業',
    culture: 'アイヌの山岳信仰と自然保護活動',
    keyword: 'カムイミンタラ'
  },
  {
    name: '富良野のラベンダー畑',
    feature: '初夏に紫色の花が一面に咲く観光地',
    location: '北海道富良野市・中富良野町',
    industry: '観光農業と香料・加工品',
    culture: '北の国からロケ地や花の祭り',
    keyword: 'ラベンダーフィールド'
  },
  {
    name: 'ニセコのスキーリゾート',
    feature: 'パウダースノーで世界的に人気のリゾート',
    location: '北海道虻田郡ニセコ町・倶知安町',
    industry: '冬季観光・リゾート開発・不動産',
    culture: '国際的な観光客とアウトドア文化',
    keyword: 'パウダースノー'
  },
  {
    name: 'オホーツク海の流氷',
    feature: '冬季に海面を覆う流氷が漂着する自然現象',
    location: '網走・紋別・知床沿岸',
    industry: '観光クルーズと海洋研究',
    culture: '流氷祭りや氷下魚漁',
    keyword: '流氷'
  },
  {
    name: 'サロマ湖のホタテ養殖',
    feature: '汽水湖を利用した大規模ホタテ養殖',
    location: '北海道オホーツク地域のサロマ湖',
    industry: 'ホタテ養殖と加工、輸出',
    culture: 'ホタテ祭りと海産物グルメ',
    keyword: 'ホタテ'
  },
  {
    name: '札幌雪まつり',
    feature: '巨大な雪氷像が並ぶ冬の一大イベント',
    location: '札幌市大通公園・すすきの・つどーむ会場',
    industry: '観光・イベント・飲食業',
    culture: '雪像制作の市民参加と国際交流',
    keyword: '雪まつり'
  },
  {
    name: '室蘭の製鉄業',
    feature: '戦前から続く鉄鋼と造船の重工業都市',
    location: '北海道室蘭市の内浦湾沿い',
    industry: '製鉄・造船・石油化学',
    culture: '工場夜景やカレーラーメンなどB級グルメ',
    keyword: '鉄のまち'
  },
  {
    name: '苫小牧港の紙パルプ産業',
    feature: '製紙工場やコンテナ港が集積する',
    location: '北海道苫小牧市の太平洋岸',
    industry: '紙パルプ・石油化学・国際港湾',
    culture: '港祭りと白鳥飛来地',
    keyword: '苫小牧港'
  },
  {
    name: '北見のタマネギ',
    feature: '寒暖差を活かした甘い玉ねぎの産地',
    location: '北海道北見市周辺',
    industry: 'タマネギ栽培と加工、冷凍食品',
    culture: 'オホーツク玉ねぎまつりや焼肉文化',
    keyword: 'オホーツク玉ねぎ'
  },
  {
    name: '十勝帯広の畑作酪農',
    feature: '大規模な輪作と酪農が組み合わされた農業',
    location: '北海道十勝平野',
    industry: '小麦・豆・馬鈴薯と酪農、加工業',
    culture: '帶広農業高校の教育やお菓子文化',
    keyword: '輪作農業'
  },
  {
    name: '釧路湿原',
    feature: '日本最大の湿原でタンチョウが生息',
    location: '北海道東部の釧路平野',
    industry: '自然保護・観光・研究',
    culture: 'タンチョウ観察とカヌー体験',
    keyword: '湿原'
  },
  {
    name: '別海町の酪農',
    feature: '牛の頭数が人口を大きく上回る大型酪農地帯',
    location: '北海道野付半島付近の別海町',
    industry: '大規模酪農と乳製品加工',
    culture: 'ミルクフェスティバルと牧場体験',
    keyword: 'ミルク王国'
  },
  {
    name: '宗谷岬',
    feature: '日本最北端の岬として知られる観光地',
    location: '北海道稚内市宗谷村',
    industry: '観光と風力発電',
    culture: '最北限の碑と流氷観測、北方領土啓発',
    keyword: '宗谷岬'
  },
  {
    name: '留萌のニシン文化',
    feature: 'ニシン漁で栄えた歴史を持つ',
    location: '北海道日本海側の留萌市',
    industry: '水産加工・昆布・水産観光',
    culture: 'ニシン御殿や祭りで往時を伝える',
    keyword: 'ニシン御殿'
  },
  {
    name: '小樽運河',
    feature: '石造倉庫が並ぶ観光スポット',
    location: '北海道小樽市の港湾地区',
    industry: '観光・ガラス工芸・海産物販売',
    culture: '雪あかりの路や港町の歴史',
    keyword: '運河の街'
  },
  {
    name: '北海道新幹線（新函館北斗駅）',
    feature: '本州と北海道を結ぶ新幹線の北海道側玄関口',
    location: '北海道北斗市',
    industry: '高速鉄道による観光・物流の強化',
    culture: '開業イベントや地域振興の取り組み',
    keyword: '北海道新幹線'
  }
];

const edoEarlyPoliticsItems = [
  {
    name: '大坂の陣',
    feature: '豊臣氏を滅ぼし徳川による全国支配を確立した戦い',
    period: '1614年（冬の陣）・1615年（夏の陣）',
    person: '徳川家康と徳川秀忠が総大将、豊臣秀頼が籠城',
    impact: '大坂城を破壊し諸大名の軍事力を抑えて幕府の権威を高めた',
    keyword: '豊臣氏滅亡'
  },
  {
    name: '徳川家康の征夷大将軍就任',
    feature: '1603年に征夷大将軍となり江戸幕府を開いた',
    period: '1603年（慶長8年）',
    person: '徳川家康',
    impact: '武家政権を江戸に置き全国統治の基盤を築いた',
    keyword: '江戸幕府創設'
  },
  {
    name: '武家諸法度（元和令）',
    feature: '諸大名の行動規範を定め幕府の統制を強化した法令',
    period: '1615年（元和元年）',
    person: '徳川秀忠が公布し金地院崇伝が起草',
    impact: '城の無断修築や他大名との結婚を禁止し反乱を防止した',
    keyword: '武家諸法度'
  },
  {
    name: '禁中並公家諸法度',
    feature: '朝廷・公家の行動を規制し幕府が朝廷を管理する体制を整えた',
    period: '1615年（元和元年）',
    person: '徳川秀忠と金地院崇伝',
    impact: '天皇の学問専念を示し政治介入を制限した',
    keyword: '朝廷統制'
  },
  {
    name: '大名の改易・転封',
    feature: '反抗的・無嗣の大名を取り潰し配置換えで勢力を弱めた政策',
    period: '1600年代前半（関ヶ原以後）',
    person: '徳川家康・秀忠・家光',
    impact: '親藩・譜代中心の体制を整え外様大名を周辺に配置した',
    keyword: '改易'
  },
  {
    name: '天領支配の拡大',
    feature: '幕府直轄地を増やし年貢収入と軍事拠点を確保した',
    period: '17世紀前半',
    person: '徳川幕府の郡代・代官',
    impact: '金山・銀山・港など重要地を直接支配し財政を安定させた',
    keyword: '天領'
  },
  {
    name: '五街道の整備',
    feature: '江戸を起点に主要街道を整備し交通と軍事支配を強化した',
    period: '1600年代前半',
    person: '徳川家康・家光と奉行伊奈忠次ら',
    impact: '宿場制度を整え参勤交代や物流が円滑になった',
    keyword: '五街道'
  },
  {
    name: '参勤交代の制度化',
    feature: '大名が江戸と国元を交代で往復する義務を課した',
    period: '1635年（寛永12年）',
    person: '徳川家光が命令',
    impact: '大名の財政を圧迫し人質確保で反乱抑止に役立った',
    keyword: '参勤交代'
  },
  {
    name: '老中・若年寄の職制',
    feature: '幕府政務を統括する老中と旗本を管理する若年寄を置いた',
    period: '17世紀前半',
    person: '土井利勝や酒井忠世など老中',
    impact: '将軍を補佐する合議制が確立し幕政が安定した',
    keyword: '老中'
  },
  {
    name: '寺社奉行と寺請制度',
    feature: '寺社を統制し庶民を寺院に所属させる制度をつくった',
    period: '17世紀前半',
    person: '幕府寺社奉行（天海・崇伝ら）',
    impact: '宗教統制とキリシタン摘発、戸籍管理に利用された',
    keyword: '寺請'
  },
  {
    name: '朱印船貿易',
    feature: '幕府が朱印状を与えた商人が東南アジアと貿易した',
    period: '1604年〜1635年',
    person: '徳川家康・角倉了以・末次平蔵など',
    impact: '日本町が成立し銅・銀の輸出で利益を得たがのちに停止',
    keyword: '朱印状'
  },
  {
    name: '慶長遣欧使節（支倉常長）',
    feature: '仙台藩がスペインやローマに派遣した外交使節',
    period: '1613年〜1620年',
    person: '支倉常長と伊達政宗',
    impact: '通商・宣教を求めたが幕府の禁教政策で実現せず',
    keyword: '慶長使節'
  },
  {
    name: '島原・天草一揆',
    feature: '重税と禁教に反発した農民・浪人・キリシタンが起こした大規模蜂起',
    period: '1637年〜1638年',
    person: '天草四郎時貞（益田時貞）',
    impact: '幕府が鎮圧しキリシタン弾圧と鎖国政策を徹底した',
    keyword: '島原の乱'
  },
  {
    name: 'キリシタン禁教と絵踏',
    feature: 'キリスト教信仰を禁止し踏絵で信者を摘発した',
    period: '1612年以降段階的に強化',
    person: '徳川家康・秀忠・家光',
    impact: '潜伏キリシタンが各地に生まれ宗教統制が完成した',
    keyword: '禁教'
  },
  {
    name: '出島の完成',
    feature: '長崎に扇形の人工島を築きオランダ商館を移転させた',
    period: '1636年完成、1641年オランダ移転',
    person: '長崎奉行・徳川家光',
    impact: 'ポルトガル商人を追放し対外貿易を管理した',
    keyword: '出島'
  },
  {
    name: 'オランダ商館長と通詞',
    feature: '出島の商館長が年に一度江戸参府し情報を提供した',
    period: '1641年以降',
    person: 'オランダ商館長（カピタン）と阿蘭陀通詞',
    impact: '洋書翻訳や蘭学発展の基礎となった',
    keyword: 'オランダ風説書'
  },
  {
    name: '唐人屋敷',
    feature: '中国人商人を隔離し貿易管理するための居留地',
    period: '1635年以降',
    person: '長崎奉行が運営',
    impact: '中国貿易を限定し銀と生糸の取引を統制した',
    keyword: '唐人屋敷'
  },
  {
    name: '琉球王国と薩摩藩の関係',
    feature: '薩摩藩が琉球に侵攻し実質支配したが名目上は中国との朝貢を継続',
    period: '1609年の薩摩侵攻以降',
    person: '薩摩藩島津家と琉球国王尚寧',
    impact: '貿易収益を薩摩藩が得つつ中国との外交面目を保った',
    keyword: '二重朝貢'
  },
  {
    name: '朝鮮通信使の江戸参府',
    feature: '徳川将軍就任祝いとして朝鮮王朝から派遣された使節団',
    period: '1607年から1811年にかけ12回',
    person: '李氏朝鮮の使節団と対馬藩宗氏',
    impact: '文化交流を促し幕府の権威を国際的に示した',
    keyword: '通信使'
  },
  {
    name: '松前藩とアイヌ交易',
    feature: '松前藩が独占的にアイヌとの交易を行い蝦夷地を支配した',
    period: '17世紀前半',
    person: '松前氏とアイヌの首長（シャクシャインら）',
    impact: 'アイヌに負担をかけ一揆を招きつつ商品流通を統制した',
    keyword: '場所請負'
  },
  {
    name: '金銀の統一（慶長小判）',
    feature: '全国の金銀貨幣を統一し貨幣制度を整備した',
    period: '1601年〜1603年',
    person: '徳川家康と後藤庄三郎家による鋳造',
    impact: '経済活動を活性化し幕府財政の根幹となった',
    keyword: '慶長小判'
  },
  {
    name: '江戸城普請と城下町整備',
    feature: '巨大な江戸城と城下町を諸大名に築かせた',
    period: '1603年以降',
    person: '諸大名の天下普請と徳川家康',
    impact: '城下町の人口が急増し政治・経済の中心となった',
    keyword: '天下普請'
  },
  {
    name: '京都所司代・大阪城代の設置',
    feature: '朝廷監視と西国支配のため京都と大坂に役職を置いた',
    period: '1600年代初頭',
    person: '板倉勝重（初代京都所司代）・片桐且元など',
    impact: '西国大名の監視と治安維持を強化した',
    keyword: '所司代'
  },
  {
    name: '大坂町人と蔵屋敷制度',
    feature: '諸藩が蔵屋敷を設けて年貢米を集散させた',
    period: '17世紀前半から',
    person: '大坂の豪商と各藩の蔵元',
    impact: '天下の台所として大坂経済が発達し幕府財政にも寄与した',
    keyword: '蔵屋敷'
  },
  {
    name: '海禁政策と鎖国令',
    feature: 'ポルトガル船来航禁止や海外渡航禁止で交易を制限した',
    period: '1633年〜1639年にかけて段階的に布告',
    person: '徳川家光と老中松平信綱',
    impact: '長崎・出島など限定された窓口のみで対外関係を管理した',
    keyword: '鎖国'
  }
];

const edoCultureIndustryItems = [
  {
    name: '新田開発と用水普請',
    feature: '干拓や用水路整備によって新たな耕地を生み出した',
    period: '17世紀後半〜18世紀前半',
    person: '川崎手右衛門や田中丘隅など郡代・名主',
    impact: '米の増収が都市人口を支え、年貢収入が向上した',
    keyword: '新田開発'
  },
  {
    name: '干鰯・油粕など金肥の普及',
    feature: '海産物や菜種油の搾りかすを肥料として利用した',
    period: '17世紀末〜18世紀',
    person: '九十九里や紀州の漁民、近郊農民',
    impact: '商品作物の収量が増え換金作物栽培が拡大した',
    keyword: '金肥'
  },
  {
    name: '綿作と菜種栽培の拡大',
    feature: '西国を中心に綿や菜種が広く栽培されるようになった',
    period: '17世紀後半',
    person: '河内・摂津・尾張などの農民',
    impact: '木綿や菜種油が都市消費を支え、農村の貨幣収入が増えた',
    keyword: '商品作物'
  },
  {
    name: '問屋制家内工業',
    feature: '問屋が原材料を支給し農民が加工する生産形態',
    period: '17世紀後半〜18世紀',
    person: '近江商人や上方の問屋',
    impact: '農家副業が広まり手工業生産が地域に拡大した',
    keyword: '問屋制'
  },
  {
    name: '藩札の発行',
    feature: '各藩が領内流通のために独自の紙幣を発行した',
    period: '17世紀後半から',
    person: '各藩の財政担当（勘定奉行）',
    impact: '領内経済を刺激しつつ信用不安や通用制限の課題も生じた',
    keyword: '藩札'
  },
  {
    name: '三井越後屋の掛値なし現金正札販売',
    feature: '定価販売と現金決済で都市消費者に支持された商法',
    period: '17世紀後半',
    person: '三井高利',
    impact: '商業取引の近代化を進め百貨店の原型となった',
    keyword: '越後屋'
  },
  {
    name: '堂島米会所',
    feature: '大坂で米の先物取引を扱った市場',
    period: '1730年（享保15年）公許',
    person: '淀屋・鴻池家など大坂商人',
    impact: '米価の指標となり幕府が米市場を統制する拠点となった',
    keyword: '米会所'
  },
  {
    name: '菱垣廻船',
    feature: '大阪と江戸間で日用品を運んだ船運業',
    period: '17世紀後半から',
    person: '上方の豪商と江戸問屋',
    impact: '江戸の町人文化を支え物資の大量輸送が可能になった',
    keyword: '菱垣廻船'
  },
  {
    name: '樽廻船',
    feature: '酒・醤油など桶詰商品を江戸へ運送した船',
    period: '18世紀初頭から',
    person: '灘の酒蔵や伊丹の醸造家',
    impact: '江戸の酒需要に応え灘の酒が全国ブランドとなった',
    keyword: '樽廻船'
  },
  {
    name: '河村瑞賢の西廻り航路開発',
    feature: '日本海回りの航路を整備し物流を安定させた',
    period: '1672年以降',
    person: '河村瑞賢',
    impact: '北陸・東北の米を江戸へ安定供給できるようになった',
    keyword: '西廻り航路'
  },
  {
    name: '松尾芭蕉の俳諧',
    feature: '蕉風俳諧を確立し俳句を文芸として高めた',
    period: '17世紀後半（元禄期）',
    person: '松尾芭蕉',
    impact: '『奥の細道』などで旅と自然を詠む文化が広がった',
    keyword: '蕉風'
  },
  {
    name: '井原西鶴の浮世草子',
    feature: '町人の生活と欲望を描いた文学作品を多数執筆',
    period: '17世紀後半',
    person: '井原西鶴',
    impact: '町人文化を代表する娯楽文学が発展した',
    keyword: '好色一代男'
  },
  {
    name: '近松門左衛門の浄瑠璃',
    feature: '恋愛や武士の義理をテーマに劇作を行った',
    period: '18世紀初頭',
    person: '近松門左衛門',
    impact: '人形浄瑠璃の人気が高まり歌舞伎にも取り入れられた',
    keyword: '曽根崎心中'
  },
  {
    name: '市川団十郎の荒事',
    feature: '勇壮な演技で江戸歌舞伎を代表する役者として人気',
    period: '17世紀後半',
    person: '市川団十郎（初代）',
    impact: '江戸歌舞伎のスタイルが確立し町人文化が隆盛した',
    keyword: '荒事'
  },
  {
    name: '竹本義太夫と人形浄瑠璃',
    feature: '義太夫節を創始し太夫と三味線の語り芸を確立',
    period: '17世紀末',
    person: '竹本義太夫',
    impact: '大阪を中心に文楽が発展し全国に広まった',
    keyword: '義太夫節'
  },
  {
    name: '菱川師宣の浮世絵',
    feature: '肉筆浮世絵と木版画で町人の日常を描いた',
    period: '17世紀末',
    person: '菱川師宣',
    impact: '浮世絵版画が人気となり江戸の流行が全国に伝わった',
    keyword: '見返り美人図'
  },
  {
    name: '蔦屋重三郎の出版文化',
    feature: '黄表紙や錦絵を出版し江戸の流行を発信した',
    period: '18世紀後半',
    person: '蔦屋重三郎',
    impact: '戯作や浮世絵の発展を支え町人文化の中心となった',
    keyword: '黄表紙'
  },
  {
    name: '寺子屋教育の普及',
    feature: '町や農村で読み書きそろばんを教える教育機関が広まった',
    period: '18世紀',
    person: '町人や僧侶・武士が師匠となった',
    impact: '庶民の識字率が高まり実用的な学習が普及した',
    keyword: '寺子屋'
  },
  {
    name: '藩校の設立',
    feature: '藩士子弟の教育を目的とする学校が各藩に設けられた',
    period: '18世紀中頃以降',
    person: '各藩の藩主（長州・薩摩など）',
    impact: '朱子学を中心とした武士教育が整備された',
    keyword: '藩校'
  },
  {
    name: '関孝和の和算',
    feature: '独自の数学理論を展開し算額文化を生み出した',
    period: '17世紀後半',
    person: '関孝和',
    impact: '和算家が全国に生まれ数学の水準が高まった',
    keyword: '和算'
  },
  {
    name: '貝原益軒の本草学',
    feature: '薬草や動植物を研究し百科事典的著作を残した',
    period: '17世紀末〜18世紀初頭',
    person: '貝原益軒',
    impact: '『大和本草』が医薬・農業の知識として活用された',
    keyword: '本草学'
  },
  {
    name: '契沖の国学',
    feature: '和歌研究を通じ古典の注釈を行った国学の先駆',
    period: '17世紀後半',
    person: '契沖',
    impact: '後の国学者に影響を与え古典研究が深化した',
    keyword: '国学の萌芽'
  },
  {
    name: '西川如見の経済論',
    feature: '町人の視点で貿易や経済を論じた思想家',
    period: '17世紀末',
    person: '西川如見',
    impact: '『町人考見録』で商業活動の意義を説き経済思想が芽生えた',
    keyword: '町人考見録'
  },
  {
    name: '青木昆陽の甘藷栽培奨励',
    feature: '飢饉対策としてサツマイモの普及に努めた',
    period: '18世紀前半（享保期）',
    person: '青木昆陽',
    impact: '甘藷栽培が広がり救荒作物として定着した',
    keyword: '甘藷先生'
  },
  {
    name: '平賀源内の蘭学とエレキテル',
    feature: '蘭学者として電気装置や鉱山開発に取り組んだ',
    period: '18世紀後半',
    person: '平賀源内',
    impact: '博物学や技術への関心を高め都市文化に刺激を与えた',
    keyword: 'エレキテル'
  }
];

const edoMidReformItems = [
  {
    name: '生類憐れみの令',
    feature: '徳川綱吉が人や動物の殺生を禁じた法令',
    period: '1685年頃〜1707年',
    person: '徳川綱吉',
    impact: '武士や庶民に負担をかけたが後に新井白石らが廃止した',
    keyword: '綱吉政治'
  },
  {
    name: '新井白石の正徳の治',
    feature: '貨幣改鋳と外交規制で幕政の建て直しを図った改革',
    period: '1709年〜1716年',
    person: '新井白石',
    impact: '金銀含有量を戻し貿易赤字を抑えようとした',
    keyword: '正徳の治'
  },
  {
    name: '海舶互市新例',
    feature: '長崎貿易の制限を強化し銀流出を防ぐための法令',
    period: '1715年',
    person: '新井白石',
    impact: '輸入量を制限し輸出を増やして貿易収支の改善を図った',
    keyword: '海舶互市新例'
  },
  {
    name: '正徳小判改鋳',
    feature: '質の落ちた貨幣を金含有量の高い貨幣に戻した',
    period: '1714年',
    person: '新井白石と勘定奉行荻原重秀の後任',
    impact: '物価の安定を狙ったが経済に混乱も生じた',
    keyword: '正徳小判'
  },
  {
    name: '享保の改革',
    feature: '徳川吉宗が幕政の倹約と農政強化を進めた改革',
    period: '1716年〜1745年',
    person: '徳川吉宗',
    impact: '倹約を徹底し財政再建を図ったが農民負担が増した',
    keyword: '享保の改革'
  },
  {
    name: '上げ米の制',
    feature: '諸大名に石高1万石につき100石の米を献上させた',
    period: '1722年',
    person: '徳川吉宗',
    impact: '幕府の財政を補う代わりに参勤交代在府期間を短縮した',
    keyword: '上げ米'
  },
  {
    name: '公事方御定書',
    feature: '裁判基準を定めた成文法',
    period: '1742年',
    person: '徳川吉宗と大岡忠相ら',
    impact: '武士や庶民の訴訟処理が統一され法治が強化された',
    keyword: '公事方御定書'
  },
  {
    name: '目安箱の設置',
    feature: '庶民の投書を幕政に反映させるための箱を設けた',
    period: '1721年',
    person: '徳川吉宗',
    impact: '蘭学者青木昆陽登用など民意を取り入れる契機になった',
    keyword: '目安箱'
  },
  {
    name: '青木昆陽の甘藷栽培奨励',
    feature: '救荒作物としてサツマイモを広めた',
    period: '1735年頃',
    person: '青木昆陽（徳川吉宗に登用）',
    impact: '飢饉対策として甘藷栽培が定着した',
    keyword: '甘藷普及'
  },
  {
    name: '大岡忠相の町奉行改革',
    feature: '町人の生活改善と火事対策を進めた江戸町奉行',
    period: '1717年〜1736年',
    person: '大岡忠相',
    impact: '町火消や町年寄制度を整備し江戸の治安が向上した',
    keyword: '大岡裁き'
  },
  {
    name: '倹約令と質素倹約',
    feature: '幕府や大名に倹約を命じ贅沢を禁じた政策',
    period: '享保年間',
    person: '徳川吉宗',
    impact: '武家の財政負担を軽減し幕府支出を抑制した',
    keyword: '倹約令'
  },
  {
    name: '田沼意次の政治',
    feature: '商業を活用した改革で財政再建を図った',
    period: '1767年〜1786年',
    person: '田沼意次',
    impact: '重商主義政策で経済活性化を試みたが賄賂横行も招いた',
    keyword: '田沼政治'
  },
  {
    name: '株仲間の公認',
    feature: '商人組合を許可し課税と流通統制を行った',
    period: '1770年代',
    person: '田沼意次',
    impact: '流通が効率化したが商人独占が批判を受けた',
    keyword: '株仲間'
  },
  {
    name: '長崎俵物輸出奨励',
    feature: '干しアワビ・フカヒレなど俵物の輸出を促進した',
    period: '田沼時代（18世紀後半）',
    person: '田沼意次と長崎奉行',
    impact: '銀の獲得を目指したが外国銀の流入も続いた',
    keyword: '俵物'
  },
  {
    name: '蝦夷地調査（最上徳内）',
    feature: '北方開発とロシア警備のため蝦夷地を探査した',
    period: '1770年代〜1780年代',
    person: '最上徳内',
    impact: '蝦夷地開拓計画や北方警備の重要性が認識された',
    keyword: '蝦夷地調査'
  },
  {
    name: '南鐐二朱銀の発行',
    feature: '良質の銀貨を発行し小額決済を円滑にした',
    period: '1772年',
    person: '田沼意次政権の勘定奉行向井将監ら',
    impact: '貨幣の信用を高め江戸での商取引が活性化した',
    keyword: '南鐐二朱銀'
  },
  {
    name: '印旛沼・手賀沼干拓計画',
    feature: '新田開発を目的に大規模干拓を試みた',
    period: '1770年代',
    person: '田沼意次と平賀源内ら技術者',
    impact: '計画は難航したが大規模土木への挑戦が行われた',
    keyword: '干拓計画'
  },
  {
    name: '寛政の改革',
    feature: '松平定信が倹約と農村復興を目指した改革',
    period: '1787年〜1793年',
    person: '松平定信',
    impact: '幕府財政は改善したが武士・町人の不満も生んだ',
    keyword: '寛政の改革'
  },
  {
    name: '棄捐令',
    feature: '旗本・御家人の借金を帳消しにした法令',
    period: '1789年',
    person: '松平定信',
    impact: '借金整理で武士階層を救済したが商人の反発を招いた',
    keyword: '棄捐令'
  },
  {
    name: '旧里帰農令',
    feature: '失業した農民を故郷に帰して再び農業に従事させた',
    period: '1790年',
    person: '松平定信',
    impact: '農村の人口回復を狙ったが実効性は乏しかった',
    keyword: '帰農'
  },
  {
    name: '寛政異学の禁',
    feature: '朱子学以外の学問を幕府学校で禁止した',
    period: '1790年',
    person: '松平定信',
    impact: '昌平坂学問所で朱子学が正学とされ他学派が排除された',
    keyword: '異学の禁'
  },
  {
    name: '人足寄場の設置',
    feature: '無宿人を収容し職業訓練を行った施設',
    period: '1790年',
    person: '松平定信',
    impact: '治安対策と社会救済を兼ねた施策だった',
    keyword: '人足寄場'
  },
  {
    name: '囲米の制',
    feature: '各藩に米を蓄えさせ飢饉時に備えさせた制度',
    period: '1790年',
    person: '松平定信',
    impact: '飢饉対策として備蓄を促した',
    keyword: '囲米'
  },
  {
    name: '七分積金',
    feature: '江戸町会所に積立金を義務付け救済財源とした',
    period: '1791年',
    person: '松平定信',
    impact: '災害時の救済資金として用いられた',
    keyword: '七分積金'
  },
  {
    name: '風俗改良令（寛政の改革）',
    feature: '贅沢や芝居を制限し風紀を取り締まった',
    period: '1787年以降',
    person: '松平定信',
    impact: '娯楽が制限され町人文化は一時的に停滞した',
    keyword: '風俗統制'
  }
];

const europeModernRevolutionItems = [
  {
    name: 'ピューリタン革命',
    feature: '王権に反発した議会派が共和政を樹立した内戦',
    period: '1642年〜1649年',
    person: 'クロムウェル',
    impact: 'チャールズ1世が処刑されイギリスで共和政が試みられた',
    keyword: '清教徒革命'
  },
  {
    name: '名誉革命',
    feature: '無血で国王を交代させ立憲君主制を確立した革命',
    period: '1688年〜1689年',
    person: 'ウィリアム3世とメアリ2世',
    impact: '議会主権の原則が確立し王権に対する議会の優位が認められた',
    keyword: '無血革命'
  },
  {
    name: '権利章典',
    feature: '国王の権限を制限し議会の権利を明文化した文書',
    period: '1689年',
    person: 'イギリス議会',
    impact: '立憲君主制の基本原則となり市民の自由を保障した',
    keyword: '権利章典'
  },
  {
    name: 'ロックの社会契約説',
    feature: '政府は人民の信託によるという政治思想',
    period: '1690年『統治二論』',
    person: 'ジョン・ロック',
    impact: '名誉革命を理論的に支えアメリカ独立思想にも影響した',
    keyword: '抵抗権'
  },
  {
    name: 'アメリカ独立戦争',
    feature: 'イギリスの重商政策に反発した13植民地の独立戦争',
    period: '1775年〜1783年',
    person: 'ジョージ・ワシントン',
    impact: 'パリ条約で合衆国の独立が承認された',
    keyword: '独立戦争'
  },
  {
    name: 'バージニア権利章典',
    feature: '人民の自然権を明記したアメリカ最初の人権宣言',
    period: '1776年6月',
    person: 'ジョージ・メイソンら',
    impact: '独立宣言に影響を与え世界的な人権思想の先駆となった',
    keyword: '自然権'
  },
  {
    name: 'アメリカ独立宣言',
    feature: '植民地が英国からの独立を宣言した文書',
    period: '1776年7月4日',
    person: 'トマス・ジェファソンが起草',
    impact: '自由・平等・人民主権の理念を世界に示した',
    keyword: '独立宣言'
  },
  {
    name: '合衆国憲法',
    feature: '連邦政府と州政府の権限分担を定めた成文憲法',
    period: '1787年制定、1789年施行',
    person: 'フィラデルフィア憲法制定会議',
    impact: '三権分立と連邦制が確立し近代憲法のモデルとなった',
    keyword: '連邦制'
  },
  {
    name: 'フランス革命の勃発',
    feature: '第三身分が国民議会を結成し旧制度に対抗した',
    period: '1789年',
    person: 'ミラボーやシェイエスなど',
    impact: '特権身分の廃止と人権宣言の採択につながった',
    keyword: '国民議会'
  },
  {
    name: 'バスティーユ牢獄の襲撃',
    feature: 'パリ市民が王権の象徴である牢獄を攻撃した事件',
    period: '1789年7月14日',
    person: 'パリ市民',
    impact: '革命の象徴的事件として革命記念日となった',
    keyword: 'バスティーユ'
  },
  {
    name: '人権宣言',
    feature: '自由・平等・国民主権をうたった宣言',
    period: '1789年8月26日',
    person: 'フランス国民議会',
    impact: '人権思想を世界に広げ後の民主主義の基礎となった',
    keyword: '人権宣言'
  },
  {
    name: '立法議会と戦争',
    feature: 'フランス革命政府がオーストリアに宣戦しヨーロッパが戦争に',
    period: '1792年',
    person: 'ジロンド派指導者',
    impact: '王政が廃止され第一共和政が成立した',
    keyword: '第一共和政'
  },
  {
    name: 'ジャコバン独裁',
    feature: 'ロベスピエールら急進派が恐怖政治を行った',
    period: '1793年〜1794年',
    person: 'ロベスピエール',
    impact: '王妃マリー・アントワネットが処刑され農奴制が廃止された',
    keyword: '恐怖政治'
  },
  {
    name: 'テルミドールの反動',
    feature: 'ロベスピエールが処刑され穏健派が権力を握った',
    period: '1794年7月',
    person: 'ブルジョワ共和派',
    impact: 'ジャコバン派が排除され総裁政府が成立した',
    keyword: 'テルミドール'
  },
  {
    name: 'ナポレオンの台頭',
    feature: 'ブリュメール18日のクーデタで権力を掌握した',
    period: '1799年',
    person: 'ナポレオン・ボナパルト',
    impact: '統領政府が発足し帝政への道が開かれた',
    keyword: 'ブリュメール'
  },
  {
    name: 'ナポレオン法典',
    feature: '民法を整備し法の前の平等を明文化した',
    period: '1804年',
    person: 'ナポレオン',
    impact: '私有財産の尊重や市民社会の原則がヨーロッパ各地に広がった',
    keyword: '民法典'
  },
  {
    name: '大陸封鎖令',
    feature: 'イギリスを経済的に孤立させるためヨーロッパ大陸の貿易を禁止した',
    period: '1806年',
    person: 'ナポレオン',
    impact: '大陸経済が混乱しロシアとの対立を招いた',
    keyword: '大陸封鎖'
  },
  {
    name: 'ワーテルローの戦い',
    feature: 'ナポレオンが敗北し最終的に失脚した決戦',
    period: '1815年6月',
    person: 'ナポレオンとウェリントン公、プロイセン軍',
    impact: 'ナポレオンがセントヘレナ島に流されウィーン体制が確立した',
    keyword: 'ワーテルロー'
  },
  {
    name: 'ウィーン会議',
    feature: 'ナポレオン戦争後の国際秩序を再建する会議',
    period: '1814年〜1815年',
    person: 'メッテルニヒら各国代表',
    impact: '正統主義と勢力均衡に基づくウィーン体制が成立した',
    keyword: 'ウィーン体制'
  },
  {
    name: '産業革命（イギリス）',
    feature: '蒸気機関を利用した機械工業が発展した革命',
    period: '18世紀後半〜19世紀前半',
    person: '産業資本家と技術者',
    impact: '工場制機械工業が成立し資本主義が進展した',
    keyword: '産業革命'
  },
  {
    name: 'ジェームズ・ワットの蒸気機関改良',
    feature: '蒸気機関の効率を高め工場の動力源を提供した',
    period: '1769年特許',
    person: 'ジェームズ・ワット',
    impact: '工場や交通で蒸気機関が普及し産業革命が加速した',
    keyword: '蒸気機関'
  },
  {
    name: 'フライングシャトルと紡績機',
    feature: '織機や紡績機の発明で綿織物の生産が飛躍的に増えた',
    period: '1733年フライングシャトル、1764年紡績機',
    person: 'ジョン・ケイ、ハーグリーヴズ',
    impact: '綿工業が工場制へ移行し手工業から機械工場へ変化した',
    keyword: '綿工業'
  },
  {
    name: 'アダム・スミスの国富論',
    feature: '自由放任主義を唱え市場経済の仕組みを解説した',
    period: '1776年',
    person: 'アダム・スミス',
    impact: '自由貿易と産業資本主義を理論的に支えた',
    keyword: '自由放任'
  },
  {
    name: 'モンテスキューの三権分立論',
    feature: '権力を立法・行政・司法に分け相互抑制を説いた',
    period: '1748年『法の精神』',
    person: 'モンテスキュー',
    impact: 'アメリカやフランスの憲法に影響し権力分立が採用された',
    keyword: '三権分立'
  },
  {
    name: 'ルソーの人民主権',
    feature: '人民が主権を持つとする社会契約論を展開した',
    period: '1762年『社会契約論』',
    person: 'ジャン＝ジャック・ルソー',
    impact: 'フランス革命の思想的基盤となり民主政治を後押しした',
    keyword: '人民主権'
  },
  {
    name: '工場法の制定',
    feature: '労働時間や児童労働を規制した社会立法',
    period: '1833年（イギリス）',
    person: 'イギリス議会',
    impact: '労働条件が改善され労働運動と社会政策が発展した',
    keyword: '工場法'
  }
];

const westAsiaTokugawaFallItems = [
  {
    name: 'アヘン戦争',
    feature: 'イギリスが清にアヘン貿易を強制した戦争',
    period: '1840年〜1842年',
    person: '英：パーマストン、清：林則徐',
    impact: '南京条約で清が不平等な開港を強いられた',
    keyword: '南京条約'
  },
  {
    name: '南京条約',
    feature: 'アヘン戦争を終結させた不平等条約',
    period: '1842年',
    person: '清朝代表とイギリス代表',
    impact: '香港割譲と五港開港で清の半植民地化が進んだ',
    keyword: '五港開港'
  },
  {
    name: '東インド会社によるインド支配',
    feature: 'イギリス東インド会社がインドを商業的に支配した体制',
    period: '18世紀後半〜1858年',
    person: 'ロバート・クライブなど会社役員',
    impact: 'インド産品を独占し植民地経済が形成された',
    keyword: '会社支配'
  },
  {
    name: 'プラッシーの戦い',
    feature: '東インド会社がベンガル太守を破った戦い',
    period: '1757年',
    person: 'ロバート・クライブ',
    impact: 'イギリスがベンガル地方を支配しインド進出の転機となった',
    keyword: 'ベンガル支配'
  },
  {
    name: 'インド大反乱',
    feature: 'シパーヒーが会社支配に反発して起こした反乱',
    period: '1857年〜1859年',
    person: 'シパーヒー兵士と各地の王侯',
    impact: '東インド会社が解散しインドがイギリス直轄領となった',
    keyword: 'シパーヒー'
  },
  {
    name: '太平天国の乱',
    feature: '洪秀全が率いた清朝に対する大規模農民反乱',
    period: '1851年〜1864年',
    person: '洪秀全',
    impact: '清朝が弱体化し外国勢力の干渉が強まった',
    keyword: '太平天国'
  },
  {
    name: 'プチャーチンの来航',
    feature: 'ロシア艦隊が開国交渉のため長崎に来航した',
    period: '1853年〜1854年',
    person: 'エフィム・プチャーチン',
    impact: '日露和親条約締結につながり北方境界が画定した',
    keyword: '日露和親条約'
  },
  {
    name: 'ペリー艦隊の来航',
    feature: 'アメリカが交易を求め浦賀に来航した事件',
    period: '1853年・1854年',
    person: 'マシュー・ペリー',
    impact: '幕府が和親条約を締結し鎖国が終わった',
    keyword: '黒船'
  },
  {
    name: '日米和親条約',
    feature: '下田・函館を開港した通商前の条約',
    period: '1854年',
    person: '阿部正弘とペリー',
    impact: 'アメリカ船への補給を認め幕府が開国へ舵を切った',
    keyword: '和親条約'
  },
  {
    name: '日米修好通商条約',
    feature: '関税自主権を欠く不平等条約',
    period: '1858年',
    person: '井伊直弼とハリス',
    impact: '開港と領事裁判権を認め列強と同様の条約が結ばれた',
    keyword: '不平等条約'
  },
  {
    name: '安政の大獄',
    feature: '条約調印に反対する尊攘派を弾圧した事件',
    period: '1858年〜1859年',
    person: '井伊直弼',
    impact: '吉田松陰らが処刑され反幕府感情が高まった',
    keyword: '安政の大獄'
  },
  {
    name: '桜田門外の変',
    feature: '水戸・薩摩藩士が井伊直弼を暗殺した事件',
    period: '1860年',
    person: '水戸浪士・薩摩藩士',
    impact: '幕府の権威が大きく失われた',
    keyword: '桜田門外'
  },
  {
    name: '尊王攘夷運動',
    feature: '天皇を尊び外国勢力を排除しようとする運動',
    period: '1850年代後半〜1860年代',
    person: '長州藩・土佐藩などの志士',
    impact: '倒幕運動へ発展し幕府の統制力が弱まった',
    keyword: '尊王攘夷'
  },
  {
    name: '長州藩の下関外国船砲撃',
    feature: '攘夷を実行し関門海峡で外国船を砲撃した',
    period: '1863年',
    person: '長州藩',
    impact: '四国艦隊の報復を受け幕府権威がさらに低下した',
    keyword: '下関事件'
  },
  {
    name: '薩英戦争',
    feature: '生麦事件を契機に薩摩藩がイギリスと交戦した',
    period: '1863年',
    person: '薩摩藩島津久光・英国艦隊',
    impact: '薩摩藩が西洋技術の必要性を認識し英薩関係が改善した',
    keyword: '薩英戦争'
  },
  {
    name: '四国艦隊下関砲撃',
    feature: '英仏米蘭が連合して下関を攻撃した事件',
    period: '1864年',
    person: '連合艦隊と長州藩',
    impact: '長州藩が攘夷を断念し幕府の対外権威が失墜した',
    keyword: '四国艦隊'
  },
  {
    name: '第一次長州征討',
    feature: '幕府が長州藩を攻めたが薩摩の仲介で和議となった',
    period: '1864年',
    person: '幕府軍・長州藩',
    impact: '長州藩は勢力を回復し倒幕運動が強まった',
    keyword: '長州征討'
  },
  {
    name: '薩長同盟',
    feature: '薩摩と長州が倒幕で協力することを秘密裏に約した',
    period: '1866年',
    person: '坂本龍馬・中岡慎太郎',
    impact: '倒幕派が結束し幕府打倒の体制が整った',
    keyword: '薩長同盟'
  },
  {
    name: '第二次長州征討の失敗',
    feature: '幕府軍が長州に敗れ幕府威信が失墜した',
    period: '1866年',
    person: '徳川慶喜（将軍後見職）、長州藩',
    impact: '幕府軍が敗北し徳川家茂の死と慶喜の大政奉還につながった',
    keyword: '長州勝利'
  },
  {
    name: '大政奉還',
    feature: '徳川慶喜が政権を朝廷に返上した',
    period: '1867年10月',
    person: '徳川慶喜',
    impact: '形式上幕府が政権を返し新政府樹立への道が開けた',
    keyword: '大政奉還'
  },
  {
    name: '王政復古の大号令',
    feature: '朝廷が旧幕府勢力を排除し新政府樹立を宣言した',
    period: '1867年12月',
    person: '岩倉具視・薩長藩士',
    impact: '小御所会議で慶喜の辞官納地が決まり倒幕が本格化した',
    keyword: '王政復古'
  },
  {
    name: '鳥羽・伏見の戦い',
    feature: '新政府軍と旧幕府軍が初めて激突した戦い',
    period: '1868年正月',
    person: '西郷隆盛・大久保利通・徳川慶喜',
    impact: '新政府軍が勝利し慶喜が江戸へ退き戊辰戦争が始まった',
    keyword: '鳥羽伏見'
  },
  {
    name: '戊辰戦争',
    feature: '新政府軍と旧幕府勢力が全国で戦った内戦',
    period: '1868年〜1869年',
    person: '新政府軍（薩長土肥）と奥羽越列藩同盟',
    impact: '函館五稜郭の陥落で旧幕府勢力が消滅した',
    keyword: '戊辰戦争'
  },
  {
    name: '江戸無血開城',
    feature: '勝海舟と西郷隆盛が交渉して江戸城を明け渡した',
    period: '1868年4月',
    person: '勝海舟・西郷隆盛',
    impact: '江戸が戦場とならず新政府への平和移行が進んだ',
    keyword: '無血開城'
  },
  {
    name: '五箇条の御誓文',
    feature: '新政府が国の方針を示した宣言',
    period: '1868年4月',
    person: '明治天皇・木戸孝允ら新政府',
    impact: '広く会議を興すことや知識を世界に求める姿勢が明示された',
    keyword: '御誓文'
  },
  {
    name: '版籍奉還',
    feature: '旧領主が領地と人民を天皇に返還した改革',
    period: '1869年',
    person: '木戸孝允・大久保利通ら',
    impact: '中央集権国家への移行が進み藩政が終わった',
    keyword: '版籍奉還'
  }
];

const meijiModernizationItems = [
  {
    name: '廃藩置県',
    feature: '全国の藩を廃止し中央政府直轄の県へ改編した改革',
    period: '1871年',
    person: '大久保利通・木戸孝允ら',
    impact: '中央集権国家が完成し地方行政が統一された',
    keyword: '廃藩置県'
  },
  {
    name: '徴兵令',
    feature: '満20歳以上の男子に兵役義務を課した法律',
    period: '1873年',
    person: '山県有朋・大村益次郎の構想',
    impact: '近代的な国民軍が編成され士族特権が解体した',
    keyword: '国民皆兵'
  },
  {
    name: '地租改正',
    feature: '土地所有者に地価の3%を金納させる税制改革',
    period: '1873年〜1876年',
    person: '大久保利通・井上毅・前島密ら',
    impact: '国家財政が安定したが農民の負担が増えて一揆が起こった',
    keyword: '地租改正'
  },
  {
    name: '学制の公布',
    feature: '全国に小学校・中学校・大学校を置く教育制度を定めた',
    period: '1872年',
    person: '文部省・森有礼ら',
    impact: '義務教育が始まり近代的な学校制度の基礎が築かれた',
    keyword: '学制'
  },
  {
    name: '太陽暦採用',
    feature: '旧暦を廃止しグレゴリオ暦を導入した',
    period: '1873年（明治6年）',
    person: '明治政府',
    impact: '国際基準に合わせ行政や貿易が円滑になった',
    keyword: '改暦'
  },
  {
    name: '鉄道開業',
    feature: '新橋〜横浜間に日本初の鉄道が開通した',
    period: '1872年',
    person: '大隈重信・モレル（技師）',
    impact: '国内交通が近代化し人や物の流通が活発になった',
    keyword: '新橋横浜間'
  },
  {
    name: '郵便制度の創設',
    feature: '全国一律料金の郵便制度を導入した',
    period: '1871年',
    person: '前島密',
    impact: '情報通信が迅速になり全国統合が進んだ',
    keyword: '郵便制度'
  },
  {
    name: '富岡製糸場',
    feature: '政府が設立した官営模範工場',
    period: '1872年操業開始',
    person: 'フランス人技師ブリュナと日本人工女',
    impact: '生糸輸出が増え殖産興業の象徴となった',
    keyword: '官営工場'
  },
  {
    name: '大阪造幣寮',
    feature: '近代的貨幣を鋳造する官営工場',
    period: '1871年操業',
    person: '大蔵省・トーマス・ウォートルス',
    impact: '新貨条例に基づく円・銭・厘の貨幣制度が整備された',
    keyword: '新貨条例'
  },
  {
    name: '殖産興業政策',
    feature: '官営工場や外資導入で近代産業を育成した政策',
    period: '1870年代',
    person: '大久保利通・伊藤博文ら',
    impact: '他の産業のモデルとなり民間企業の成長を促した',
    keyword: '殖産興業'
  },
  {
    name: '岩倉使節団の派遣',
    feature: '条約改正と西洋制度視察のため欧米に派遣された使節団',
    period: '1871年〜1873年',
    person: '岩倉具視、木戸孝允、大久保利通ら',
    impact: '近代化政策の参考となり留学生派遣が進められた',
    keyword: '岩倉使節団'
  },
  {
    name: '明治六年の政変',
    feature: '征韓論をめぐって政府が分裂した事件',
    period: '1873年',
    person: '西郷隆盛・板垣退助と岩倉・大久保',
    impact: '西郷らが下野し民撰議院設立建白書の提出につながった',
    keyword: '征韓論政変'
  },
  {
    name: '征韓論',
    feature: '朝鮮に武力で開国を迫るべきだとする意見',
    period: '1873年',
    person: '西郷隆盛・板垣退助',
    impact: '政府内の対立を招き自由民権運動の発端となった',
    keyword: '征韓論'
  },
  {
    name: '台湾出兵',
    feature: '琉球漂流民殺害事件を理由に台湾へ出兵した',
    period: '1874年',
    person: '西郷従道・大久保利通',
    impact: '清国と交渉して賠償金を得たが国際的批判も受けた',
    keyword: '台湾出兵'
  },
  {
    name: '江華島事件と日朝修好条規',
    feature: '日本が朝鮮に砲艦外交を行い不平等条約を結んだ',
    period: '1875年事件、1876年条約',
    person: '黒田清隆・井上馨',
    impact: '朝鮮の開国が進み日本の朝鮮進出が始まった',
    keyword: '江華島'
  },
  {
    name: '散髪脱刀令',
    feature: '武士のちょんまげと帯刀を廃止した命令',
    period: '1871年',
    person: '明治政府',
    impact: '身分制が解体され洋装化が進んだ',
    keyword: '散髪脱刀'
  },
  {
    name: '秩禄処分',
    feature: '士族に支給していた家禄・賞典禄を廃止した',
    period: '1876年',
    person: '大蔵卿大久保利通・大隈重信',
    impact: '士族の収入源が断たれ士族反乱の一因となった',
    keyword: '秩禄処分'
  },
  {
    name: '西南戦争',
    feature: '不満を抱えた士族が西郷隆盛を擁して起こした反乱',
    period: '1877年',
    person: '西郷隆盛と政府軍（谷干城・山県有朋）',
    impact: '士族反乱が終結し政府軍の強さが証明された',
    keyword: '西南戦争'
  },
  {
    name: '自由民権運動の高まり',
    feature: '国会開設と憲法制定を求める民衆運動',
    period: '1870年代後半〜1880年代',
    person: '板垣退助・中江兆民・植木枝盛',
    impact: '国会開設の勅諭につながり政党政治が始まった',
    keyword: '自由民権'
  },
  {
    name: '民選議院設立建白書',
    feature: '国民選挙による議会設立を求めた意見書',
    period: '1874年',
    person: '板垣退助・江藤新平ら',
    impact: '政府が民権派を弾圧する一方で政治参加の要求が高まった',
    keyword: '建白書'
  },
  {
    name: '大阪会議',
    feature: '政府と民権派が妥協を試みた政治会議',
    period: '1875年',
    person: '大久保利通・木戸孝允・板垣退助',
    impact: '立憲政体案が議論され元老院と漸次立憲政体樹立の詔が出た',
    keyword: '大阪会議'
  },
  {
    name: '讒謗律・新聞紙条例',
    feature: '政府批判を禁じる言論弾圧法',
    period: '1875年',
    person: '大久保利通ら政府要人',
    impact: '新聞・雑誌の発行が制限され民権運動が弾圧された',
    keyword: '言論弾圧'
  },
  {
    name: '文明開化の生活改革',
    feature: 'ガス灯・洋食・鹿鳴館など西洋文化が流行した',
    period: '1870年代〜1880年代',
    person: '政府高官・都市住民',
    impact: '都市の生活様式が欧化し伝統文化との摩擦が生じた',
    keyword: '文明開化'
  },
  {
    name: '福沢諭吉の「学問のすすめ」',
    feature: '独立自尊を説いた啓蒙書',
    period: '1872年〜1876年',
    person: '福沢諭吉',
    impact: '国民の啓蒙と自由民権思想の普及に大きな影響を与えた',
    keyword: '学問のすすめ'
  },
  {
    name: '太政官制から内閣制度への移行',
    feature: '内務省や太政官制を整備し後に内閣制度へつながった',
    period: '1871年太政官制再編',
    person: '岩倉具視・大久保利通',
    impact: '行政組織が整備され中央官庁による統治が進んだ',
    keyword: '太政官制'
  }
];

const constitutionAndWarsItems = [
  {
    name: '国会開設の勅諭',
    feature: '1890年までに国会を開設すると表明した詔書',
    period: '1881年',
    person: '明治天皇・政府',
    impact: '政党結成が活発になり立憲政治への道が開かれた',
    keyword: '国会開設'
  },
  {
    name: '自由党の結成',
    feature: '板垣退助を中心に結成された民権派政党',
    period: '1881年',
    person: '板垣退助',
    impact: '農民層に民権思想が広まり各地で激化事件が発生した',
    keyword: '自由党'
  },
  {
    name: '立憲改進党の結成',
    feature: '大隈重信が中心となり欧米型立憲制を目指した政党',
    period: '1882年',
    person: '大隈重信・福地源一郎',
    impact: '東京で都市型の民権運動を展開した',
    keyword: '改進党'
  },
  {
    name: '保安条例',
    feature: '政府が自由民権運動を弾圧するための条例',
    period: '1887年',
    person: '山県有朋内閣',
    impact: '多数の政治運動家が東京から追放され運動が一時後退した',
    keyword: '保安条例'
  },
  {
    name: '大同団結運動',
    feature: '自由党系と改進党系が共通の国会請願を行った運動',
    period: '1887年〜1889年',
    person: '後藤象二郎・星亨など',
    impact: '民権派が団体請願を行い政府に圧力をかけた',
    keyword: '三大事件建白'
  },
  {
    name: '明治憲法の起草とドイツ流憲法学',
    feature: '伊藤博文がドイツ憲法を参考に憲法草案を作成した',
    period: '1882年以降',
    person: '伊藤博文・井上毅・金子堅太郎',
    impact: '欽定憲法として君主大権を重視する体制が準備された',
    keyword: 'プロイセン憲法'
  },
  {
    name: '枢密院の設置',
    feature: '憲法草案を審議する天皇の諮問機関',
    period: '1888年',
    person: '伊藤博文',
    impact: '立憲制度における天皇の諮問機関として重要な役割を果たした',
    keyword: '枢密院'
  },
  {
    name: '大日本帝国憲法の公布',
    feature: '君主大権を基礎とする近代憲法が公布された',
    period: '1889年2月11日',
    person: '伊藤博文ら',
    impact: '天皇主権と立憲政治が両立する体制が成立した',
    keyword: '帝国憲法'
  },
  {
    name: '教育勅語',
    feature: '忠君愛国を説いた教育の基本方針',
    period: '1890年',
    person: '山県有朋内閣・井上毅',
    impact: '学校教育で道徳教育の中心となり国民統合を図った',
    keyword: '教育勅語'
  },
  {
    name: '第一回帝国議会',
    feature: '衆議院と貴族院からなる国会が初めて開かれた',
    period: '1890年',
    person: '初代首相山県有朋・衆議院議員',
    impact: '政府と民党の対立が激化し政党政治の課題が表面化した',
    keyword: '帝国議会'
  },
  {
    name: '軍人勅諭',
    feature: '軍人の精神規範を示した勅諭',
    period: '1882年',
    person: '山縣有朋・井上毅',
    impact: '軍隊が天皇への絶対忠誠を誓う性格を持った',
    keyword: '軍人勅諭'
  },
  {
    name: '日英通商航海条約改正',
    feature: '不平等条約のうち領事裁判権を撤廃した条約改正',
    period: '1894年',
    person: '外務大臣陸奥宗光',
    impact: '治外法権が撤廃され条約改正が前進した',
    keyword: '陸奥外交'
  },
  {
    name: '日清戦争',
    feature: '朝鮮半島をめぐって日本と清が争った戦争',
    period: '1894年〜1895年',
    person: '伊藤博文内閣・山県有朋（大本営）',
    impact: '下関条約で遼東半島・台湾を獲得したが三国干渉で遼東を返還した',
    keyword: '日清戦争'
  },
  {
    name: '下関条約',
    feature: '日清戦争の講和条約',
    period: '1895年',
    person: '日本：伊藤博文・陸奥宗光、清：李鴻章',
    impact: '遼東半島・台湾の割譲と賠償金を獲得した',
    keyword: '下関条約'
  },
  {
    name: '三国干渉',
    feature: '露仏独が日本に遼東半島返還を迫った事件',
    period: '1895年',
    person: 'ロシア・フランス・ドイツの列強',
    impact: '日本は遼東半島を返還し対露敵愾心が高まった',
    keyword: '三国干渉'
  },
  {
    name: '八幡製鉄所の操業',
    feature: '官営の製鉄所が操業を開始し軍需産業を支えた',
    period: '1901年',
    person: '内務大臣原敬・技師',
    impact: '鉄鋼の国産化が進み重工業化の基盤となった',
    keyword: '八幡製鉄所'
  },
  {
    name: '日英同盟',
    feature: 'イギリスと相互にアジアで協力する同盟を結んだ',
    period: '1902年',
    person: '小村寿太郎・ヘンリー・ランズダウン',
    impact: '日本は国際的地位を高め日露戦争への布石となった',
    keyword: '日英同盟'
  },
  {
    name: '日露戦争',
    feature: '朝鮮半島と満州を巡り日本とロシアが戦った戦争',
    period: '1904年〜1905年',
    person: '桂太郎内閣・小村寿太郎、大山巌・東郷平八郎',
    impact: 'ポーツマス条約で南樺太・満州利権を得た',
    keyword: '日露戦争'
  },
  {
    name: 'ポーツマス条約',
    feature: '日露戦争の講和条約',
    period: '1905年',
    person: '小村寿太郎とロシアのウィッテ',
    impact: '南樺太割譲・満州撤兵が決まり賠償金は得られなかった',
    keyword: 'ポーツマス'
  },
  {
    name: '日比谷焼打ち事件',
    feature: 'ポーツマス条約の内容に不満を持つ民衆が暴動を起こした',
    period: '1905年',
    person: '東京市民・社会主義者',
    impact: '政府が戒厳令を敷き言論弾圧が強化された',
    keyword: '日比谷焼打ち'
  },
  {
    name: '韓国併合',
    feature: '大韓帝国を日本が併合し朝鮮総督府を設置した',
    period: '1910年',
    person: '伊藤博文・寺内正毅',
    impact: '朝鮮の主権が奪われ植民地支配が始まった',
    keyword: '韓国併合'
  },
  {
    name: '桂園時代と政党勢力',
    feature: '桂太郎と西園寺公望が交互に内閣を担った時代',
    period: '1901年〜1913年',
    person: '桂太郎・西園寺公望',
    impact: '政党勢力と官僚勢力の駆け引きが続き政党内閣の道が整った',
    keyword: '桂園時代'
  },
  {
    name: '第一次護憲運動',
    feature: '民衆が藩閥打破と憲政の実現を求めた運動',
    period: '1912年〜1913年',
    person: '尾崎行雄・犬養毅',
    impact: '桂内閣が倒れ政党中心の大正政変が起こった',
    keyword: '護憲運動'
  },
  {
    name: '小村寿太郎の条約改正',
    feature: '関税自主権の一部回復を実現した',
    period: '1911年',
    person: '外務大臣小村寿太郎',
    impact: '関税自主権がほぼ回復し不平等条約改正が完了した',
    keyword: '小村外交'
  },
  {
    name: '文官任用令の改正',
    feature: '政党の影響力を制限するため文官任用資格を変更した',
    period: '1899年',
    person: '山県有朋',
    impact: '政党の官僚掌握を阻み藩閥政府の力が維持された',
    keyword: '文官任用令'
  }
];

const modernIndustryCultureItems = [
  {
    name: '第一次世界大戦と大戦景気',
    feature: '欧州戦争の好況で日本の輸出が急増した',
    period: '1914年〜1918年',
    person: '商社・造船業者など',
    impact: '重化学工業が発展し企業勃興が再燃した',
    keyword: '大戦景気'
  },
  {
    name: '企業勃興と財閥の形成',
    feature: '戦前の繊維・鉄道ブームに続き重工業で企業が急成長した',
    period: '1890年代・1900年代',
    person: '三井・三菱・住友・安田など財閥',
    impact: '財閥が経済を支配し政府との結びつきが強まった',
    keyword: '財閥'
  },
  {
    name: '足尾銅山鉱毒事件',
    feature: '鉱毒が農地を汚染し住民が被害を受けた公害事件',
    period: '1890年代',
    person: '田中正造',
    impact: '公害問題が社会問題化し政府の対応が問われた',
    keyword: '鉱毒事件'
  },
  {
    name: '労働組合期成会',
    feature: '労働組合結成を促した日本初期の労働運動団体',
    period: '1897年',
    person: '高野房太郎・片山潜',
    impact: '労働運動が全国に広がる契機となった',
    keyword: '労働組合'
  },
  {
    name: '友愛会の結成',
    feature: '鈴木文治が中心となった労働団体',
    period: '1912年',
    person: '鈴木文治',
    impact: '後の総同盟へ発展し労働運動の母体となった',
    keyword: '友愛会'
  },
  {
    name: '女工哀史と製糸工場',
    feature: '長時間労働と低賃金で女性労働者が酷使された',
    period: '明治末〜大正期',
    person: '製糸女工・紡績女工',
    impact: '労働条件改善運動や社会政策の議論が進んだ',
    keyword: '女工哀史'
  },
  {
    name: '米騒動',
    feature: '米価高騰に反発した民衆暴動が全国に広がった',
    period: '1918年',
    person: '富山の漁民から全国の都市住民',
    impact: '寺内内閣が総辞職し政党内閣（原敬内閣）が誕生した',
    keyword: '米騒動'
  },
  {
    name: '農地制度と寄生地主制',
    feature: '小作農が増え地主に多くの小作料を納めた',
    period: '明治後期〜大正期',
    person: '地主・小作農',
    impact: '小作争議が激化し農地改革の必要性が議論された',
    keyword: '寄生地主'
  },
  {
    name: '八幡製鉄所と重化学工業化',
    feature: '官営製鉄所を中心に軍需産業が発展した',
    period: '1901年操業以降',
    person: '技師や政府',
    impact: '後の鉄鋼・造船・軍需生産の基盤となった',
    keyword: '重化学工業'
  },
  {
    name: '原敬内閣と政党内閣制',
    feature: '本格的な政党内閣が誕生し政党政治が進展した',
    period: '1918年〜1921年',
    person: '原敬',
    impact: '政党政治の拡大と護憲三派内閣へつながった',
    keyword: '国民内閣'
  },
  {
    name: '大正デモクラシー',
    feature: '普通選挙・男女平等など民主主義思想が高まった',
    period: '大正期',
    person: '吉野作造・美濃部達吉など',
    impact: '護憲運動や普通選挙運動、社会運動が活発になった',
    keyword: '民本主義'
  },
  {
    name: '普通選挙法の成立',
    feature: '満25歳以上の男子すべてに選挙権を認めた',
    period: '1925年',
    person: '加藤高明内閣',
    impact: '有権者が2000万人近くに増え政党政治が拡大した',
    keyword: '普通選挙'
  },
  {
    name: '治安維持法',
    feature: '共産主義や社会運動を弾圧するための法律',
    period: '1925年制定',
    person: '加藤高明内閣',
    impact: '思想弾圧が強化され民主主義の後退を招いた',
    keyword: '治安維持法'
  },
  {
    name: '関東大震災',
    feature: '東京・横浜を中心に甚大な被害を出した大地震',
    period: '1923年9月1日',
    person: '被災した住民・政府の復興計画',
    impact: '帝都復興計画が実施され都市計画が再編された',
    keyword: '関東大震災'
  },
  {
    name: 'ラジオ放送の開始',
    feature: '社団法人東京放送局がラジオ放送を始めた',
    period: '1925年',
    person: '日本放送協会（NHKの前身）',
    impact: '大衆文化と情報伝達の新時代が開かれた',
    keyword: 'ラジオ'
  },
  {
    name: '映画と活動写真の普及',
    feature: '無声映画からトーキーへ移行し娯楽として定着した',
    period: '1910年代〜1930年代',
    person: '日活や松竹など映画会社',
    impact: '大衆文化が発展しスター俳優が人気を集めた',
    keyword: '活動写真'
  },
  {
    name: '白樺派文学',
    feature: '人道主義を掲げた文芸雑誌『白樺』出身の文学グループ',
    period: '1910年代',
    person: '武者小路実篤・志賀直哉',
    impact: '個人主義と人間尊重の文学が広まった',
    keyword: '白樺派'
  },
  {
    name: '夏目漱石と近代文学',
    feature: '近代人の内面を描いた文明批判的文学',
    period: '1900年代〜1910年代',
    person: '夏目漱石',
    impact: '『こころ』『三四郎』などが日本文学の近代化を象徴した',
    keyword: '漱石'
  },
  {
    name: '青鞜社と女性解放運動',
    feature: '女性の自立を掲げた雑誌「青鞜」を中心とした運動',
    period: '1911年創刊',
    person: '平塚らいてう',
    impact: '婦人運動の先駆となり新婦人協会へ発展した',
    keyword: '青鞜'
  },
  {
    name: '新婦人協会',
    feature: '女性の参政権や夜間外出の自由を求めた団体',
    period: '1920年',
    person: '平塚らいてう・市川房枝',
    impact: '婦人保護法改正など女性の社会進出へ影響した',
    keyword: '新婦人協会'
  },
  {
    name: 'プロレタリア文学運動',
    feature: '労働者や農民の視点から社会変革を目指した文学',
    period: '1920年代',
    person: '小林多喜二・葉山嘉樹',
    impact: '社会問題を文学で告発し治安維持法による弾圧を受けた',
    keyword: 'プロレタリア文学'
  },
  {
    name: 'モダン・ガールと都市文化',
    feature: '洋装や化粧で自由な生活を楽しむ女性像が現れた',
    period: '1920年代',
    person: '都市の若い女性',
    impact: '大衆消費社会の一面を象徴し保守層の批判も受けた',
    keyword: 'モガ'
  },
  {
    name: '農村恐慌と昭和恐慌',
    feature: '農産物価格の暴落で農民が困窮した',
    period: '1930年〜1931年',
    person: '米作農家・政府（井上準之助）',
    impact: '欠食児童問題が深刻化し農村救済策が求められた',
    keyword: '農村恐慌'
  },
  {
    name: '満鉄調査部と東亜研究',
    feature: '南満州鉄道が調査部を設置し満州経営を推進した',
    period: '1910年代〜1930年代',
    person: '南満州鉄道株式会社',
    impact: '満州支配の情報拠点となり後の満州国統治に寄与した',
    keyword: '満鉄'
  },
  {
    name: '農本主義思想',
    feature: '農村共同体を理想とし都市化・工業化を批判した思想',
    period: '1920年代',
    person: '石原莞爾・安藤昌益の再評価など',
    impact: '右翼・国家主義思想と結びつき国家改造運動に影響した',
    keyword: '農本主義'
  }
];

function generateLocalCommunityQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    localSurveyScenarios,
    idPrefix,
    [
      {
        field: 'method',
        questionBuilder: (item) => `身近な地域の調査で${item.scenario}場合に、最も適切な調査方法はどれですか。`,
        explanationBuilder: (item) => `${item.scenario}では、${item.method}ことで現状を具体的に把握できます。`
      },
      {
        field: 'indicator',
        questionBuilder: (item) => `${item.scenario}ときに重点的に記録すべき指標として最も適切なものはどれですか。`,
        explanationBuilder: (item) => `${item.indicator}を追うことで、${item.scenario}の課題を数量的に捉えられます。`
      },
      {
        field: 'dataSource',
        questionBuilder: (item) => `${item.scenario}ための資料として最も信頼できるものはどれですか。`,
        explanationBuilder: (item) => `${item.dataSource}により、${item.scenario}に関する客観的な情報を得られます。`
      },
      {
        field: 'presentation',
        questionBuilder: (item) => `${item.scenario}の調査結果を共有する際に、最も適したまとめ方はどれですか。`,
        explanationBuilder: (item) => `${item.presentation}とすることで、${item.scenario}の結果を分かりやすく伝えられます。`
      },
      {
        field: 'interview',
        questionBuilder: (item) => `${item.scenario}ときに聞き取り調査の相手として最も適切なのはだれですか。`,
        explanationBuilder: (item) => `${item.interview}は${item.scenario}に日常的に関わっており、現場の声を聞けます。`
      }
    ],
    100
  );
}

function generateJapanLandformsClimateQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    japanLandformsClimateItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `${item.name}について正しく説明しているものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}ことが特徴です。`
      },
      {
        field: 'region',
        questionBuilder: (item) => `${item.name}が位置する地域として最も適切なものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.region}に位置しています。`
      },
      {
        field: 'climateEffect',
        questionBuilder: (item) => `${item.name}が周辺の気候に与える影響として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.climateEffect}影響をもたらします。`
      },
      {
        field: 'risk',
        questionBuilder: (item) => `${item.name}に関連して注意すべき自然災害・リスクはどれですか。`,
        explanationBuilder: (item) => `${item.name}では、${item.risk}点に注意が必要です。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}に関するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は「${item.keyword}」に分類されます。`
      }
    ],
    100
  );
}

function generateJapanPopulationIndustryQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    japanPopulationIndustryItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `${item.name}についての特徴として最も適切なものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}地域・産業です。`
      },
      {
        field: 'region',
        questionBuilder: (item) => `${item.name}が主に見られる地域として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.region}で展開しています。`
      },
      {
        field: 'strength',
        questionBuilder: (item) => `${item.name}の強みや代表的な産業として適切なものはどれですか。`,
        explanationBuilder: (item) => `${item.name}では、${item.strength}点が強みです。`
      },
      {
        field: 'challenge',
        questionBuilder: (item) => `${item.name}が直面している課題として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}では、${item.challenge}ことが課題になっています。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}に関連するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateKinkiRegionQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    kinkiRegionItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `近畿地方の${item.name}についての説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}ことが特徴です。`
      },
      {
        field: 'location',
        questionBuilder: (item) => `${item.name}の位置・広がりとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.location}に位置しています。`
      },
      {
        field: 'industry',
        questionBuilder: (item) => `${item.name}に関連する主要な産業・経済活動として適切なものはどれですか。`,
        explanationBuilder: (item) => `${item.name}では、${item.industry}ことが地域経済を支えています。`
      },
      {
        field: 'culture',
        questionBuilder: (item) => `${item.name}に関わる文化・歴史資源として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}には、${item.culture}といった文化的特色があります。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateChubuRegionQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    chubuRegionItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `中部地方の${item.name}についての説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}ことが特徴です。`
      },
      {
        field: 'location',
        questionBuilder: (item) => `${item.name}の位置・広がりとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.location}に位置しています。`
      },
      {
        field: 'industry',
        questionBuilder: (item) => `${item.name}に関連する主要な産業・経済活動として適切なものはどれですか。`,
        explanationBuilder: (item) => `${item.name}では、${item.industry}ことが地域経済を支えています。`
      },
      {
        field: 'culture',
        questionBuilder: (item) => `${item.name}に関わる文化・歴史資源として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}には、${item.culture}といった文化的特色があります。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateKantoRegionQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    kantoRegionItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `関東地方の${item.name}についての説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}ことが特徴です。`
      },
      {
        field: 'location',
        questionBuilder: (item) => `${item.name}の位置・広がりとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.location}に位置しています。`
      },
      {
        field: 'industry',
        questionBuilder: (item) => `${item.name}に関連する主要な産業・経済活動として適切なものはどれですか。`,
        explanationBuilder: (item) => `${item.name}では、${item.industry}ことが地域経済を支えています。`
      },
      {
        field: 'culture',
        questionBuilder: (item) => `${item.name}に関わる文化・歴史資源として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}には、${item.culture}といった文化的特色があります。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateTohokuRegionQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    tohokuRegionItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `東北地方の${item.name}についての説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}ことが特徴です。`
      },
      {
        field: 'location',
        questionBuilder: (item) => `${item.name}の位置・広がりとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.location}に位置しています。`
      },
      {
        field: 'industry',
        questionBuilder: (item) => `${item.name}に関連する主要な産業・経済活動として適切なものはどれですか。`,
        explanationBuilder: (item) => `${item.name}では、${item.industry}ことが地域経済を支えています。`
      },
      {
        field: 'culture',
        questionBuilder: (item) => `${item.name}に関わる文化・歴史資源として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}には、${item.culture}といった文化的特色があります。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateHokkaidoRegionQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    hokkaidoRegionItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `北海道の${item.name}についての説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}ことが特徴です。`
      },
      {
        field: 'location',
        questionBuilder: (item) => `${item.name}の位置・広がりとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.location}に位置しています。`
      },
      {
        field: 'industry',
        questionBuilder: (item) => `${item.name}に関連する主要な産業・経済活動として適切なものはどれですか。`,
        explanationBuilder: (item) => `${item.name}では、${item.industry}ことが地域経済を支えています。`
      },
      {
        field: 'culture',
        questionBuilder: (item) => `${item.name}に関わる文化・歴史資源として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}には、${item.culture}といった文化的特色があります。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateEdoEarlyPoliticsQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    edoEarlyPoliticsItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `江戸初期の${item.name}についての説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}出来事です。`
      },
      {
        field: 'period',
        questionBuilder: (item) => `${item.name}が行われた時期として最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.period}に実施・発生しました。`
      },
      {
        field: 'person',
        questionBuilder: (item) => `${item.name}に深く関わった人物として適切なのは誰ですか。`,
        explanationBuilder: (item) => `${item.name}には${item.person}が関与しました。`
      },
      {
        field: 'impact',
        questionBuilder: (item) => `${item.name}がもたらした影響として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}によって、${item.impact}ことが起こりました。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を表すキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を象徴するキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateEdoCultureIndustryQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    edoCultureIndustryItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `江戸時代の産業・文化に関する${item.name}の説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}動きです。`
      },
      {
        field: 'period',
        questionBuilder: (item) => `${item.name}が盛んになった時期として最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.period}に進展しました。`
      },
      {
        field: 'person',
        questionBuilder: (item) => `${item.name}に関わった人物・主体として適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}には${item.person}が携わりました。`
      },
      {
        field: 'impact',
        questionBuilder: (item) => `${item.name}がもたらした影響として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}によって、${item.impact}ことが起こりました。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateEdoMidReformQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    edoMidReformItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `江戸中期の政治改革に関する${item.name}の説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}改革・施策です。`
      },
      {
        field: 'period',
        questionBuilder: (item) => `${item.name}が行われた時期として最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.period}に実施されました。`
      },
      {
        field: 'person',
        questionBuilder: (item) => `${item.name}を主導した人物として適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}には${item.person}が関わりました。`
      },
      {
        field: 'impact',
        questionBuilder: (item) => `${item.name}がもたらした影響として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}によって、${item.impact}という結果になりました。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を表すキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を象徴するキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateEuropeModernRevolutionQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    europeModernRevolutionItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `ヨーロッパの近代革命に関する${item.name}の説明で正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}出来事です。`
      },
      {
        field: 'period',
        questionBuilder: (item) => `${item.name}が起こった時期として最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.period}に展開しました。`
      },
      {
        field: 'person',
        questionBuilder: (item) => `${item.name}に重要な役割を果たした人物として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}には${item.person}が関与しました。`
      },
      {
        field: 'impact',
        questionBuilder: (item) => `${item.name}がもたらした影響として適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}によって、${item.impact}ことが実現しました。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を表すキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を象徴するキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateWestAsiaTokugawaFallQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    westAsiaTokugawaFallItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `西欧のアジア進出と幕末の動きに関する${item.name}の説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}出来事です。`
      },
      {
        field: 'period',
        questionBuilder: (item) => `${item.name}が起こった・行われた時期として最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.period}に生じました。`
      },
      {
        field: 'person',
        questionBuilder: (item) => `${item.name}に関わった人物として適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}には${item.person}が関与しました。`
      },
      {
        field: 'impact',
        questionBuilder: (item) => `${item.name}が与えた影響として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}によって、${item.impact}ことになりました。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateMeijiModernizationQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    meijiModernizationItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `明治政府と文明開化に関する${item.name}の説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}政策・出来事です。`
      },
      {
        field: 'period',
        questionBuilder: (item) => `${item.name}が行われた時期として最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.period}に実施・制定されました。`
      },
      {
        field: 'person',
        questionBuilder: (item) => `${item.name}に携わった人物として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}には${item.person}が関与しました。`
      },
      {
        field: 'impact',
        questionBuilder: (item) => `${item.name}の結果として適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}によって、${item.impact}ことになりました。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateConstitutionAndWarsQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    constitutionAndWarsItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `憲法と議会の制定、日清・日露戦争期の${item.name}について正しい説明はどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}出来事です。`
      },
      {
        field: 'period',
        questionBuilder: (item) => `${item.name}が行われた時期・年度として最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.period}に実施・発生しました。`
      },
      {
        field: 'person',
        questionBuilder: (item) => `${item.name}に関係した人物として適切なのは誰ですか。`,
        explanationBuilder: (item) => `${item.name}には${item.person}が関わりました。`
      },
      {
        field: 'impact',
        questionBuilder: (item) => `${item.name}の結果として生じた影響で正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}によって、${item.impact}ことになりました。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

function generateModernIndustryCultureQuestions(idPrefix) {
  return generateQuestionsFromConfigs(
    modernIndustryCultureItems,
    idPrefix,
    [
      {
        field: 'feature',
        questionBuilder: (item) => `近代の産業と文化に関する${item.name}の説明として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}は、${item.feature}出来事・動きです。`
      },
      {
        field: 'period',
        questionBuilder: (item) => `${item.name}が展開した時期として最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}は${item.period}に展開しました。`
      },
      {
        field: 'person',
        questionBuilder: (item) => `${item.name}に関わった人物・主体として適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}には${item.person}が関わりました。`
      },
      {
        field: 'impact',
        questionBuilder: (item) => `${item.name}がもたらした影響として正しいものはどれですか。`,
        explanationBuilder: (item) => `${item.name}によって、${item.impact}ことが生じました。`
      },
      {
        field: 'keyword',
        questionBuilder: (item) => `${item.name}を象徴するキーワードとして最も適切なのはどれですか。`,
        explanationBuilder: (item) => `${item.name}を表すキーワードは「${item.keyword}」です。`
      }
    ],
    100
  );
}

const units = [
  {
    file: 'social-local-community-research.json',
    unitId: 'geography-local-community-research',
    unitName: '身近な地域の調査',
    category: '地理',
    idPrefix: 'soc-local',
    generator: generateLocalCommunityQuestions
  },
  {
    file: 'social-japan-landforms-climate.json',
    unitId: 'geography-japan-landforms-climate',
    unitName: '日本の地形と気候',
    category: '地理',
    idPrefix: 'soc-land',
    generator: generateJapanLandformsClimateQuestions
  },
  {
    file: 'social-japan-population-industry.json',
    unitId: 'geography-japan-population-industry',
    unitName: '日本の人口と産業',
    category: '地理',
    idPrefix: 'soc-pop',
    generator: generateJapanPopulationIndustryQuestions
  },
  {
    file: 'social-kinki-region.json',
    unitId: 'geography-kinki-region',
    unitName: '近畿地方',
    category: '地理',
    idPrefix: 'soc-kinki',
    generator: generateKinkiRegionQuestions
  },
  {
    file: 'social-chubu-region.json',
    unitId: 'geography-chubu-region',
    unitName: '中部地方',
    category: '地理',
    idPrefix: 'soc-chubu',
    generator: generateChubuRegionQuestions
  },
  {
    file: 'social-kanto-region.json',
    unitId: 'geography-kanto-region',
    unitName: '関東地方',
    category: '地理',
    idPrefix: 'soc-kanto',
    generator: generateKantoRegionQuestions
  },
  {
    file: 'social-tohoku-region.json',
    unitId: 'geography-tohoku-region',
    unitName: '東北地方',
    category: '地理',
    idPrefix: 'soc-tohoku',
    generator: generateTohokuRegionQuestions
  },
  {
    file: 'social-hokkaido-region.json',
    unitId: 'geography-hokkaido-region',
    unitName: '北海道',
    category: '地理',
    idPrefix: 'soc-hokkaido',
    generator: generateHokkaidoRegionQuestions
  },
  {
    file: 'social-edo-early-politics.json',
    unitId: 'history-edo-early-politics',
    unitName: '江戸の政治と外交（江戸初期）',
    category: '歴史',
    idPrefix: 'soc-edo-early',
    generator: generateEdoEarlyPoliticsQuestions
  },
  {
    file: 'social-edo-industry-culture.json',
    unitId: 'history-edo-industry-culture',
    unitName: '江戸の産業と文化',
    category: '歴史',
    idPrefix: 'soc-edo-culture',
    generator: generateEdoCultureIndustryQuestions
  },
  {
    file: 'social-edo-mid-reforms.json',
    unitId: 'history-edo-mid-reforms',
    unitName: '江戸の政治改革（江戸中期）',
    category: '歴史',
    idPrefix: 'soc-edo-reform',
    generator: generateEdoMidReformQuestions
  },
  {
    file: 'social-europe-modern-revolutions.json',
    unitId: 'history-europe-modern-revolutions',
    unitName: 'ヨーロッパの近代革命',
    category: '歴史',
    idPrefix: 'soc-euro-rev',
    generator: generateEuropeModernRevolutionQuestions
  },
  {
    file: 'social-western-asia-and-bakumatsu.json',
    unitId: 'history-western-asia-and-bakumatsu',
    unitName: '西欧のアジア進出と江戸幕府の滅亡',
    category: '歴史',
    idPrefix: 'soc-bakumatsu',
    generator: generateWestAsiaTokugawaFallQuestions
  },
  {
    file: 'social-meiji-modernization.json',
    unitId: 'history-meiji-modernization',
    unitName: '明治政府と文明開化',
    category: '歴史',
    idPrefix: 'soc-meiji',
    generator: generateMeijiModernizationQuestions
  },
  {
    file: 'social-constitution-and-wars.json',
    unitId: 'history-constitution-and-wars',
    unitName: '憲法と議会の制定、日清・日露戦争',
    category: '歴史',
    idPrefix: 'soc-constitution',
    generator: generateConstitutionAndWarsQuestions
  },
  {
    file: 'social-modern-industry-culture.json',
    unitId: 'history-modern-industry-culture',
    unitName: '近代の産業と文化',
    category: '歴史',
    idPrefix: 'soc-modern-culture',
    generator: generateModernIndustryCultureQuestions
  }
];

for (const unit of units) {
  const questions = unit.generator(unit.idPrefix);
  if (questions.length !== 100) {
    throw new Error(`${unit.unitName} の問題数が100問ではありません: ${questions.length}`);
  }
  const data = {
    subject: 'social',
    subjectName: '社会',
    unitId: unit.unitId,
    unitName: unit.unitName,
    category: unit.category,
    questions
  };
  const outPath = path.join(outDir, unit.file);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Generated ${unit.file}`);
}

