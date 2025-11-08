# 問題データの移行ガイド

## 変更内容

従来の `data.js` から、`questions/` フォルダ内のJSONファイルに問題データを移行しました。

## 主な変更点

### 旧仕様（data.js）
- 全ての問題データが1つの巨大なJavaScriptファイルに格納
- 問題を追加する際は大きなファイルを編集する必要があった

### 新仕様（questions/*.json）
- **問題が単元ごとに分割されたJSONファイルとして管理される**
- **新しい問題を追加する際は、新しいJSONファイルを作成して配置するだけ**
- **index.json がファイルリストを管理**
- フォルダ内の全JSONファイルが自動的に読み込まれる

## メリット

1. **問題の追加が簡単**: 新しいJSONファイルを作成して `questions/` フォルダに置くだけ
2. **ファイルが小さい**: 1つの巨大なファイルではなく、単元ごとに分割
3. **編集しやすい**: 特定の単元だけを編集できる
4. **バージョン管理が容易**: Gitなどで差分を確認しやすい
5. **並列読み込み**: 複数のJSONファイルを並列で読み込めるため高速

## JSONファイルの形式

```json
{
  "subject": "english",           // 科目ID
  "subjectName": "英語",          // 科目名
  "unitId": "grammar-basic",     // 単元ID
  "unitName": "be動詞・一般動詞",  // 単元名
  "category": "文法",             // カテゴリ
  "questions": [                 // 問題の配列
    {
      "id": "eng-gb-001",
      "question": "I ___ a student.",
      "type": "multiple",
      "choices": ["am", "is", "are", "be"],
      "answer": 0,
      "explanation": "I（私は）の後は \"am\" を使います。"
    }
  ]
}
```

## 新しい問題を追加する手順

1. `questions/` フォルダに新しいJSONファイルを作成
   - 例: `questions/english-grammar-tense.json`

2. 上記の形式でJSONデータを記述

3. `questions/index.json` の `files` 配列にファイル名を追加

```json
{
  "files": [
    "english-grammar-basic.json",
    "math-polynomial.json",
    "japanese-kanji-reading.json",
    "science-force.json",
    "social-japan-geography.json",
    "english-grammar-tense.json"  ← 新規追加
  ]
}
```

4. ページをリロード → 自動的に読み込まれます！

## 既存のdata.jsについて

- `data.js` は `data.js.backup` にリネームしてバックアップされています
- 必要に応じて参照できますが、アプリケーションからは読み込まれません

## テスト方法

`test_json_loading.html` を開いて、問題データが正しく読み込まれるか確認できます。

```bash
# Webサーバーを起動して確認
python3 -m http.server 8000
# ブラウザで http://localhost:8000/test_json_loading.html を開く
```

## トラブルシューティング

### 問題が表示されない場合

1. ブラウザの開発者ツール（F12）を開いてコンソールを確認
2. `test_json_loading.html` でテストを実行
3. JSONファイルの構文エラーがないか確認（VSCodeなどのエディタで検証）

### JSONの構文エラー

- 末尾のカンマに注意（最後の要素の後にカンマは不要）
- ダブルクォーテーション（"）を使用（シングルクォーテーションは不可）
- エスケープが必要な文字に注意（`\n`, `\"`, `\\` など）

## サンプルファイル

以下の5つのサンプルJSONファイルが用意されています：

1. `english-grammar-basic.json` - 英語：be動詞・一般動詞（10問）
2. `math-polynomial.json` - 数学：多項式の加法・減法（5問）
3. `japanese-kanji-reading.json` - 国語：漢字の読み（5問）
4. `science-force.json` - 理科：力と運動（5問）
5. `social-japan-geography.json` - 社会：日本の地理（5問）

これらを参考に、新しい問題ファイルを作成してください。
