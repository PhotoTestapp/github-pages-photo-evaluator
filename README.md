# Photo Evaluator Public Bundle

このフォルダは、写真評価アプリの GitHub Pages 公開用一式です。

## 現行の公開入口

- `index.html`

現行公開版はこのファイルを正本として扱います。

## 同梱ファイル

- `index.html`
  - 現行公開版
- `photo_eval_model.json`
  - 公開版で使うブラウザ側 ML 補正モデル
- `photo_eval_public_stats.json`
  - 公開版の統計表示に使う JSON
- `photo-evaluator-pro-delivery-webhook-set.html`
  - 配送・保存先設定用の補助ページ
- `manifest.webmanifest`
  - PWA 設定
- `service-worker.js`
  - キャッシュ制御

## 旧DLベータ画面

- `photo-evaluator-dl-beta.html`

この画面は `LEGACY_KEEP` 扱いです。

補足:

- 現行公開版 `index.html` とは分離しています
- 旧DLベータ画面では `/api/dl/predict` と `/api/dl/evaluation` を使います
- 保存先 API は `Render API` と `ローカルAPI (127.0.0.1:8788)` を切り替え可能です
- 開発者版ハブの `DL評価写真統計` に反映したい場合は、旧DLベータ画面で `ローカルAPI (127.0.0.1:8788)` を選んで評価します

## 現行公開版の仕様

- 写真を選んで評価
- 総合点と項目別スコアを表示
- 履歴表示
- 統計表示
- フィードバック保存
- 推定カテゴリ表示

## 現行公開版の判定フロー

1. ブラウザ内で画像解析とルールベース評価を実行
2. 総合点補正は `photo_eval_model.json` をブラウザで読んで計算
3. `file:` または `127.0.0.1` / `localhost` 条件時のみ、`/api/ml/*` を使う分岐あり
4. ジャンル判定の `学習＋` は `https://photo-evaluator-dl-api.onrender.com/api/dl/predict` を使用
5. 外部 DL 応答が使えない場合は標準カテゴリ推定へフォールバック

重要:

- 現行公開版は `DL評価` 自体は行いません
- 現行公開版が使うのは、ジャンル判定補助としての `/api/dl/predict` のみです
- そのため、現行公開版の通常評価結果は `DL評価写真統計` には入りません

## 公開版の統計

`index.html` の統計タブは `photo_eval_public_stats.json` を読みます。

統計に含まれる主な値:

- 総件数
- 想定ユーザー数
- モデル反映件数
- 総合点ヒストグラム
- カテゴリ分布
- 項目別平均

## UI バージョン表記

現行公開版には `PUBLIC_UI` の表記を置きます。

例:

- `PUBLIC_UI v2026-03-28-b（a:画面 / b:統計 / c:内部）`

更新ルール:

- `a`
  - 画面、導線、見た目、文言を変更したとき
- `b`
  - 統計の表示項目、集計対象、表示方法、統計ロジックを変更したとき
- `c`
  - 内部処理、保存形式、API 連携を変更したとき

注意:

- 単に統計値が増減しただけでは `PUBLIC_UI` は更新しません
- `PUBLIC_UI` はデータ更新ではなく、公開版仕様の更新ラベルです

公開版の表示ラベルは `index.html` の `PUBLIC_UI_VERSION` を更新して反映します。

## 更新時の対象

### 公開版を更新する場合

- `index.html`
- 必要に応じて `photo_eval_model.json`
- 必要に応じて `photo_eval_public_stats.json`

### 旧DLベータ画面を更新する場合

- `photo-evaluator-dl-beta.html`

### 共通更新の場合

- `manifest.webmanifest`
- `service-worker.js`

## デプロイ

このフォルダの内容を GitHub Pages の公開リポジトリ直下へ反映します。

想定:

- Branch: `main`
- Folder: `/ (root)`

## 補足

- 公開版の学習は GitHub Pages 上では行いません
- 学習済みモデルや統計 JSON は別環境で更新して反映します
- 詳しい全体仕様は親フォルダの `README.md` を参照してください
