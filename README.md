# 写真評価アプリ 総合ガイド

このファイルを、このシステム全体の唯一のガイドとして使います。  
公開アプリ、ローカル確認、開発用ラボ、深層学習実験、学習更新、公開反映までをここにまとめています。

GitHub に載せるための要約版は `README-github.md` を参照してください。

## 1. システム全体像

この環境は次の4系統で構成されています。

### 1. 公開アプリ

一般ユーザー向けの写真評価アプリです。  
今後の画面修正の正本は次です。

- `github-pages-photo-evaluator/index.html`

### 2. ローカル用入口

ローカル確認用の入口です。  
現行の正式入口は `local-main-app/index.html` です。

- `local-main-app/index.html`
- `local-main-app/photo-evaluator-pro-delivery-webhook-set.html`
- `photo-evaluator-pro-delivery-webhook-set.html`

### 3. 開発用ラボ / レビュー管理 / 学習更新環境

開発者が学習データを作成し、公開フィードバックを確認し、モデルを再学習するための統合環境です。

- `photo-evaluator-training-lab-app/`
- `photo_eval_ml_core.py`
- `photo_eval_ml_server.py`
- `import_public_feedback.py`
- `train_photo_eval_model.py`
- `update_public_feedback_model.py`
- `maintenance-tools/`

### 4. 深層学習実験環境

開発者ラボから切り出した深層学習の実験環境です。

- `photo-evaluator-training-lab-app/dl-lab/`

## 1.1 現状の実動構成

以下は、2026-03-28 時点でファイル内容と起動スクリプトから確認できた事実です。

### 本番入口

- `github-pages-photo-evaluator/index.html`

### ローカル確認入口

- `local-main-app/index.html`
- `local-main-app/photo-evaluator-pro-delivery-webhook-set.html`

補足:

- `local-main-app/index.html` を正式なローカル入口として扱います
- `local-main-app/photo-evaluator-pro-delivery-webhook-set.html` は別名入口です
- ルート `index.html` は削除済みです

### 開発者入口

- `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html`
- `developer-review.html` はレビュー管理タブへの互換入口です

### 公開版の実際の判定フロー

公開版 `github-pages-photo-evaluator/index.html` で確認できる現状フローは次です。

1. 画像解析とルールベース評価をブラウザ内で実行
2. 総合点補正は、通常は `github-pages-photo-evaluator/photo_eval_model.json` をブラウザで読み込んで計算
3. `file:` または `http://127.0.0.1` / `http://localhost` で開いた場合のみ、`/api/ml/*` を使う分岐あり
4. ジャンル判定の `学習＋` は `https://photo-evaluator-dl-api.onrender.com/api/dl/predict` を呼ぶ
5. Render 側の応答が使えない場合は、メトリクス由来の標準カテゴリ推定へフォールバック

補足:

- 現行公開版は `DL評価` 自体は行っていません
- 現行公開版が使っているのは、ジャンル判定補助としての `/api/dl/predict` のみです
- そのため、現行公開版の通常評価結果は `DL評価写真統計` には入りません

### ローカル時のみ有効なAPI

公開版・ローカル版のHTMLで `127.0.0.1` / `localhost` 条件時に利用するAPI:

- `/api/ml/status`
- `/api/ml/predict`
- `/api/ml/feedback`
- `/api/ml/export`
- `/api/ml/stats`
- `/api/dl/status`
- `/api/dl/predict`

提供元:

- ルート側: `photo_eval_ml_server.py` (`8787`)
- 開発者ラボ側: `photo-evaluator-training-lab-app/photo_eval_ml_server.py` (`8788`)

### Render 依存箇所

現状、コード上で Render 依存が確認できる箇所:

- 公開版のDLカテゴリ判定 API
  - `https://photo-evaluator-dl-api.onrender.com/api/dl/predict`
- Render 用設定ファイル
  - `photo-evaluator-training-lab-app/render.yaml`

確認が必要:

- Render 上で `/api/ml/predict` を本番経路として利用しているかどうか
- Render 側へ反映されている学習済みモデルの更新運用

### 実体HTMLの場所

現時点で実体HTMLとして確認できるファイル:

- 公開本体: `github-pages-photo-evaluator/index.html`
- ローカル確認入口: `local-main-app/index.html`
- 開発者ラボ本体: `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html`

互換入口または転送入口:

- `developer-review.html`
- `local-main-app/photo-evaluator-pro-delivery-webhook-set.html`
- `photo-evaluator-pro-delivery-webhook-set.html`

### 旧ファイルの扱い方針

| ファイル | ラベル | 現在用途 | 現在使用有無 | 代替ファイル | 編集可否 |
| --- | --- | --- | --- | --- | --- |
| `photo-evaluator-dl-test.html` | `LEGACY_KEEP` | 旧DL採点テスト画面 | 確認が必要 | 確認が必要 | 原則非推奨 |
| `github-pages-photo-evaluator/photo-evaluator-dl-beta.html` | `LEGACY_KEEP` | 公開系の旧DLベータ画面 | 確認が必要 | `github-pages-photo-evaluator/index.html` | 原則非推奨 |
| `photo-evaluator-training-lab.html` | `LEGACY_KEEP` | 旧開発者ラボ画面 | 確認が必要 | `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html` | 原則非推奨 |
| `developer-review.html` | `ACTIVE` | レビュー管理タブへの互換入口 | 使用中 | `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html#review` | 可 |

不明点は削除判断をせず、確認後に再判定します。

### 現在の主運用4系統

| 系統 | 正式入口 / 主ファイル | 主用途 | 補足 |
| --- | --- | --- | --- |
| 公開アプリ | `github-pages-photo-evaluator/index.html` | 一般ユーザー向けの評価、履歴、フィードバック送信 | `学習＋` のジャンル判定補助として Render の DL API を利用 |
| ローカル確認 | `local-main-app/index.html` | ローカル確認とローカル API 利用 | `local-main-app/photo-evaluator-pro-delivery-webhook-set.html` は別名入口 |
| 開発者ラボ | `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html` | 学習入力、再評価、レビュー管理、統計 | `Exif統計`, `DL学習統計`, `DL評価写真統計` を確認可能 |
| DL実験 | `photo-evaluator-training-lab-app/dl-lab/` | 項目別点、総合点、ジャンルのDL実験 | 公開版ではジャンル判定 `学習＋` に使用 |

## 2. 正本と更新先

今後のメイン更新先は次の2系統だけです。

### 公開アプリの正本

- `github-pages-photo-evaluator/index.html`

### 開発用・学習用の更新先

- `photo-evaluator-training-lab-app/` 以下一式

`local-main-app/` は入口用途を優先して扱います。

### 低頻度ファイルの配置

設定・メンテナンス・学習更新の補助ファイルは `maintenance-tools/` にまとめています。

- `maintenance-tools/run-model-update.py`
- `maintenance-tools/run-model-update.command`
- `maintenance-tools/run-model-update.bat`
- `maintenance-tools/update-public-feedback.command`
- `maintenance-tools/reset_learning_state.py`
- `maintenance-tools/reset-learning-state.command`
- `maintenance-tools/start-photo-eval-ml-server.command`
- `maintenance-tools/stop-photo-eval-ml-server.command`
- `maintenance-tools/google-apps-script-public-feedback-collector.gs`

## 3. URL と起動方法

### ローカル起動

ローカルサーバー起動:

```bash
python3 photo_eval_ml_server.py
```

ダブルクリック起動:

- `start-developer-review.command`
  - 開発者向け統合ラボのレビュー管理タブを開く
- `maintenance-tools/start-photo-eval-ml-server.command`
  - サーバーのみ起動
- `local-main-app/start-developer-review.command`
  - `local-main-app` から開きたいときの入口
- `local-main-app/stop-photo-eval-ml-server.command`
  - `local-main-app` から停止したいときの入口

開くURL:

- 現行案内先: `http://127.0.0.1:8787/local-main-app/index.html`
- 別名入口: `http://127.0.0.1:8787/local-main-app/photo-evaluator-pro-delivery-webhook-set.html`
- 開発者向け統合ラボ: `http://127.0.0.1:8788/photo-evaluator-training-lab.html`
- レビュー管理タブ直開き: `http://127.0.0.1:8788/photo-evaluator-training-lab.html#review`

### GitHub Pages

公開URLの形:

- `https://<username>.github.io/<repo>/`
- `https://<username>.github.io/<repo>/photo-evaluator-pro-delivery-webhook-set.html`

### ローカル入口整理後の確認事項

- 正式なローカル入口は `local-main-app/index.html`
- 別名入口は `local-main-app/photo-evaluator-pro-delivery-webhook-set.html`
- 手作業運用で旧入口を使っていないことを確認済み
- 起動スクリプトの案内文を更新済み

## 4. 公開時に GitHub へ上げるもの

GitHub に反映する公開物は、基本的に `github-pages-photo-evaluator/` 配下です。

- `github-pages-photo-evaluator/index.html`
- `github-pages-photo-evaluator/photo-evaluator-pro-delivery-webhook-set.html`
- `github-pages-photo-evaluator/photo_eval_model.json`
- `github-pages-photo-evaluator/photo_eval_public_stats.json`
- `github-pages-photo-evaluator/service-worker.js`
- `github-pages-photo-evaluator/manifest.webmanifest`
- `github-pages-photo-evaluator/.nojekyll`

この中身をリポジトリ直下へ置く運用を前提にしています。

### 公開統計JSONの更新運用

公開版の統計タブは live API ではなく、`github-pages-photo-evaluator/photo_eval_public_stats.json` を読みます。  
そのため、開発者ハブの件数を更新しただけでは公開版統計は更新されません。

現行運用では、次のコマンド実行時に `photo-evaluator-training-lab-app/export_github_stats.py` が走り、公開統計JSONを再生成します。

- `photo-evaluator-training-lab-app/train-and-sync-to-github.command`
- `photo-evaluator-training-lab-app/merge-public-feedback-and-sync.command`

更新後に GitHub へ反映すべき公開ファイルは少なくとも次です。

- `github-pages-photo-evaluator/photo_eval_model.json`
- `github-pages-photo-evaluator/photo_eval_public_stats.json`

公開版の統計件数が古い場合は、次の順で確認します。

1. 上記コマンドのどちらかを最後に実行したか
2. `github-pages-photo-evaluator/photo_eval_public_stats.json` が更新されているか
3. GitHub Pages 側へ `photo_eval_public_stats.json` を反映したか
4. ブラウザキャッシュではなく最新公開物を見ているか

## 5. アプリの機能一覧

## 5.1 UI バージョン表記ルール

公開版と開発者版の画面には、UI バージョン表記を置きます。

例:

- `PUBLIC_UI v2026-04-09-b`
- `LAB_UI v2026-03-24-a`

公開版の `PUBLIC_UI` は、次のルールで更新します。

- `a:画面`
  - レイアウト、導線、文言、見た目など画面仕様が変わったとき
- `b:統計`
  - 統計の表示項目、集計対象、表示方式、統計ロジックが変わったとき
- `c:内部`
  - 保存形式、内部処理、API 連携、非表示ロジックなどが変わったとき

注意:

- 単に統計値の中身が日々増減しただけでは `PUBLIC_UI` は更新しません
- `PUBLIC_UI` は公開版の仕様変更ラベルであり、データ更新ラベルではありません
- 公開版の表示ラベルは `github-pages-photo-evaluator/index.html` の `PUBLIC_UI_VERSION` を更新して反映します
- `PUBLIC_UI` はその日の更新順で枝番を進めます
- 例: `a`, `b`, `c` ... `z`, `aa`, `ab`
- 更新内容の種類には関係なく、その日に公開版へ変更が入るたびに次の枝番へ進めます

### 公開アプリ / ローカル確認で使える機能

- 写真のアップロード
- 複数枚キュー表示
- 1枚ずつの評価
- 履歴保存
- 履歴一覧と詳細表示
- 結果へのフィードバック保存
- Webhook / Drive 連携
- ルールベース評価
- 学習済みモデルが有効な場合の ML 補正

### 公開版とローカル確認の役割整理表

| 機能 | 公開版 | ローカル確認 | 備考 |
| --- | --- | --- | --- |
| 総合点補正 | 通常は `github-pages-photo-evaluator/photo_eval_model.json` をブラウザ読込 | `file:` / `127.0.0.1` / `localhost` 条件時にローカル API 分岐あり | 判定式自体は変えていない |
| ジャンル判定 | `学習＋` は Render の DL API | ローカル条件では `/api/dl/*` を利用可能 | Render 応答不可時は標準カテゴリ推定へフォールバック |
| ローカルAPI分岐 | 通常は未使用 | `file:` / `127.0.0.1` / `localhost` 条件で有効 | `/api/ml/*`, `/api/dl/*` |
| Render依存 | `学習＋` のジャンル判定 | なし | Render 用設定は `photo-evaluator-training-lab-app/render.yaml` |

### 開発用統合ラボで使える機能

- 開発者向けの学習データ作成
- 補正点付き保存
- ラボ専用 DB / モデルでの独立運用
- 公開フィードバック一覧の読み込み
- ローカル学習 DB 一覧の読み込み
- Google Drive 画像リンク付きレコードの確認
- 確認済み / 要確認 / 除外 のローカル管理
- 公開フィードバック取り込み
- 再学習
- GitHub Pages 用モデルへの同期
- 画像のサムネイル表示
- ファイル名、画像ID、種類での検索
- `photo-evaluator-training-lab-app/dl-lab/` による深層学習実験環境

### レビュー管理の起動

- ダブルクリック: `start-developer-review.command`
- 直接URL: `http://127.0.0.1:8788/photo-evaluator-training-lab.html#review`

## 6. フィードバックと保存の流れ

公開アプリでは、評価後にユーザーがフィードバックを送れます。  
保存先は次の2系統です。

### 1. ローカル学習保存

- `/api/ml/feedback`
- `photo_eval_ml.sqlite3` に保存

### 2. 公開フィードバック collector

- Apps Script の公開エンドポイントへ送信
- 後で `import_public_feedback.py` で取り込み

`review_mode` は内部互換のため残していますが、一般ユーザー画面では表示せず `general` 固定で扱います。

## 7. 写真の種類と保存ルール

UI 表示は日本語ですが、内部保存コードは次です。

| UI表示 | 保存コード |
| --- | --- |
| 人物 | `portrait` |
| 風景 | `landscape` |
| 動物 | `animal` |
| 花・植物 | `flora` |
| 食べ物 | `food` |
| その他 | `other` |

ルール:

- `other` を除いて最大2項目まで
- `other` は単独選択のみ
- 保存値は `|` 区切り

例:

- `portrait`
- `landscape|animal`
- `food|flora`
- `other`

## 8. ML / 学習の仕組み

現在の学習方式は、ルールベース総合点に対する残差補正モデルです。

- モデル種別: `linear_residual_regression_v2`
- 目的変数: `delta = corrected_score - rule_score`
- 学習データ保存先: `photo_eval_ml.sqlite3`
- 学習済みモデル: `photo_eval_model.json`
- 公開版モデル: `github-pages-photo-evaluator/photo_eval_model.json`

### しきい値

- ML有効化の最低件数: `30`
- 安定運用の推奨件数: `100`

30件未満の間は、モデルファイルがあっても `Rule-based` を優先します。

## 8.1 設定値の棚卸し一覧

この章は、設定値の一元化ではなく、現状コードに存在する主な設定値の確認用一覧です。

| 項目名 | 現在値 | 所在ファイル | 用途 | 本番影響有無 | 将来共通化対象か |
| --- | --- | --- | --- | --- | --- |
| ML API 既定値 | `http://127.0.0.1:8787` | `github-pages-photo-evaluator/index.html` | ローカル条件時の ML API 接続先 | あり | はい |
| DLカテゴリ API 既定値 | `https://photo-evaluator-dl-api.onrender.com` | `github-pages-photo-evaluator/index.html` | 公開版の `学習＋` 接続先 | あり | はい |
| 公開フィードバック collector URL | Apps Script URL 固定文字列 | `github-pages-photo-evaluator/index.html` | フィードバック送信先 | あり | はい |
| ブラウザ用モデルパス | `./photo_eval_model.json` | `github-pages-photo-evaluator/index.html` | 公開版の総合点補正モデル読込 | あり | はい |
| ローカル API 利用条件 | `file:` / `http://127.0.0.1` / `http://localhost` | `github-pages-photo-evaluator/index.html` | ローカル確認時の API 分岐 | あり | はい |
| DLカテゴリ request timeout | `5000ms` | `github-pages-photo-evaluator/index.html` | Render ジャンル判定待ち時間 | あり | はい |
| 公開版表示名 | `標準` / `学習` / `学習＋` | `github-pages-photo-evaluator/index.html` | 公開版の UI 表示 | あり | はい |
| ローカル ML サーバーポート | `8787` | `photo_eval_ml_server.py` | ローカル確認用 API 提供 | なし | はい |
| ルート学習DB | `photo_eval_ml.sqlite3` | `photo_eval_ml_server.py`, `photo_eval_ml_core.py` | 学習データ保存 | なし | いいえ |
| ルート学習モデル | `photo_eval_model.json` | `photo_eval_ml_server.py`, `photo_eval_ml_core.py` | ローカル ML 補正 | あり | いいえ |
| ML 最低件数 | `30` | `photo_eval_ml_core.py`, `github-pages-photo-evaluator/index.html`, `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html` | ML 有効化判定 | あり | はい |
| ML 推奨件数 | `100` | `photo_eval_ml_core.py`, `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html` | 運用目安 | なし | はい |
| ラボ ML API 既定値 | `http://127.0.0.1:8788` | `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html` | ラボ接続先 | なし | はい |
| ラボ ブラウザ用モデルパス | `./photo_eval_model.json` | `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html` | ラボ内モデル読込 | なし | はい |
| ラボ timeout | `2000ms` | `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html` | ML補正 API / ブラウザML待ち時間 | なし | はい |
| ラボ表示名 | `AI補正あり` / `標準判定` | `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html` | ラボ UI 表示 | なし | はい |
| DL画像サイズ | `224` | `photo-evaluator-training-lab-app/dl-lab/config.json`, `.../dl_residual_model_meta.json` | DL学習入力サイズ | なし | いいえ |
| batch size | `8` | `photo-evaluator-training-lab-app/dl-lab/config.json`, `.../dl_residual_model_meta.json` | DL学習設定 | なし | いいえ |
| epochs | `12` | `photo-evaluator-training-lab-app/dl-lab/config.json`, `.../dl_residual_model_meta.json` | DL学習設定 | なし | いいえ |
| learning rate | `0.001` | `photo-evaluator-training-lab-app/dl-lab/config.json`, `.../dl_residual_model_meta.json` | DL学習設定 | なし | いいえ |
| genre loss weight | `1.0` | `photo-evaluator-training-lab-app/dl-lab/config.json` | ジャンル損失重み | なし | いいえ |
| DLモデルファイル名 | `dl_residual_model.pt` | `photo-evaluator-training-lab-app/dl-lab/` | DL推論モデル | 間接的にあり | いいえ |
| DLメタファイル名 | `dl_residual_model_meta.json` | `photo-evaluator-training-lab-app/dl-lab/` | 学習結果記録 | なし | いいえ |

## 9. 学習更新の実行方法

最も簡単な更新方法は次です。

### ワンクリック / ワンコマンド

- Mac: `maintenance-tools/run-model-update.command`
- Windows: `maintenance-tools/run-model-update.bat`
- 直接実行:

```bash
python3 maintenance-tools/run-model-update.py
```

### この統合実行で行うこと

1. 公開フィードバック取得
2. `photo_eval_ml.sqlite3` へ保存
3. `photo_eval_model.json` を再学習で更新
4. `github-pages-photo-evaluator/photo_eval_model.json` に同期

### 成功時に確認するもの

- 取り込み件数
- `sample_count`
- `ml_available`
- 更新された `photo_eval_model.json`
- 更新された `github-pages-photo-evaluator/photo_eval_model.json`

## 10. 個別実行コマンド

公開フィードバックの取り込みだけ:

```bash
python3 import_public_feedback.py
```

再学習だけ:

```bash
python3 train_photo_eval_model.py
```

取り込み + 再学習:

```bash
python3 update_public_feedback_model.py
```

## 11. 開発用ラボの使い方

### 起動

- `photo-evaluator-training-lab-app/start-training-lab.command`

または、フォルダ内で直接:

```bash
python3 photo_eval_ml_server.py
```

### ラボのURL

- `http://127.0.0.1:8788/photo-evaluator-training-lab.html`
- `http://127.0.0.1:8788/photo-evaluator-training-lab.html#review`

### ラボ内の主なタブ

- `学習入力`
- `保存履歴`
- `レビュー管理`

### 停止

- `photo-evaluator-training-lab-app/stop-training-lab.command`

### GitHub版へモデル反映

- `photo-evaluator-training-lab-app/train-and-sync-to-github.command`

### 公開フィードバックも統合して反映

- `photo-evaluator-training-lab-app/merge-public-feedback-and-sync.command`

## 12. 初期化

学習データとモデルを初期状態へ戻したい場合は次を実行します。

```bash
python3 maintenance-tools/reset_learning_state.py
```

または:

- `maintenance-tools/reset-learning-state.command`

この処理で行うこと:

1. 既存 DB / モデルをバックアップ
2. ルート学習 DB を初期化
3. 開発者ラボ DB を初期化
4. モデルを未学習状態へ戻す

## 13. 開発者ラボ専用の深層学習実験環境

深層学習の実験環境は、公開アプリとは分離して `photo-evaluator-training-lab-app/dl-lab/` に置いています。

主なファイル:

- `photo-evaluator-training-lab-app/dl-lab/config.json`
- `photo-evaluator-training-lab-app/dl-lab/requirements-dl.txt`
- `photo-evaluator-training-lab-app/dl-lab/export_dl_dataset.py`
- `photo-evaluator-training-lab-app/dl-lab/train_dl_residual_model.py`
- `photo-evaluator-training-lab-app/dl-lab/run-dl-pipeline.command`

この環境でできること:

- 開発者ラボDBから DL 用データセットを書き出す
- 保存済み画像を使って、小型CNNで総合点補正用の残差回帰モデルを学習する
- 実験モデルを `photo-evaluator-training-lab-app/dl-lab/models/` に保存する

### DL統計ページの見方

開発者ラボの `DL統計` ページは、次の2系統を分けて表示します。

#### 1. DL学習統計

対象:

- `dl_dataset.jsonl`
- `dl_residual_model_meta.json`
- 学習時の `sample_count`, `validation_mae`, `genre accuracy` など

用途:

- 何件で学習したか
- モデルの検証誤差がどの程度か
- 学習済みモデルが更新されているか

#### 2. DL評価写真統計

対象:

- `/api/dl/evaluation` で保存された DL評価結果
- `photo-evaluator-training-lab-app/dl-lab/exports/dl_beta_public_results.jsonl`

用途:

- 実際に DL評価として保存された写真の総合点分布
- カテゴリ分布
- 項目別平均
- Exif / GPS / 高度などの傾向
- 匿名 `userId` ベースの想定ユーザー数

重要:

- 現行公開版 `github-pages-photo-evaluator/index.html` の通常評価は `DL評価写真統計` に入りません
- 現行公開版が使うのは `学習＋` のジャンル判定補助であり、DL評価保存ではありません
- `DL評価写真統計` に入るのは、`/api/dl/evaluation` を通った DL専用評価結果だけです

### 旧DLベータ画面と DL評価写真統計

旧DLベータ画面は次です。

- `github-pages-photo-evaluator/photo-evaluator-dl-beta.html`

この画面では、保存先 API を切り替えられます。

- `Render API`
- `ローカルAPI (127.0.0.1:8788)`

`DL評価写真統計` にローカルで反映したい場合は、旧DLベータ画面で `ローカルAPI (127.0.0.1:8788)` を選んで評価します。

理由:

- 旧DLベータ画面の既定保存先は Render 側 API
- 開発者版ハブの `DL評価写真統計` はローカルの `dl_beta_public_results.jsonl` を集計
- 保存先が Render のままだと、ローカル開発者版ハブには反映されません

注意:

- DL 用の元画像は、開発者ラボで新しく保存したレコードから `photo-evaluator-training-lab-app/dl-lab/images/` に保存されます
- 既存の古い学習レコードは元画像が無いため、DL データセットへは自動では入りません
- 学習には `torch` / `torchvision` / `Pillow` が必要です

### DL学習結果の記録様式

現状、DL学習結果の記録先として確認できる主ファイルは次です。

- `photo-evaluator-training-lab-app/dl-lab/models/dl_residual_model_meta.json`

最低限確認できる記録項目:

- 実行日時: `trained_at`
- 学習件数: `sample_count`
- 学習用件数: `train_count`
- 検証件数: `validation_count`
- 総合MAE: `validation_mae`
- 項目別MAE: `validation_mae_by_output`
- ジャンルaccuracy: `validation_genre_accuracy`
- モデルファイル名: `model_path`

標準仕様として管理したい項目:

- `model_name`
- `trained_at`
- `sample_count`
- `train_count`
- `validation_count`
- `test_count`
- `validation_mae`
- `test_mae`
- `validation_mae_by_output`
- `validation_genre_accuracy`
- `test_genre_accuracy`
- `model_path`

確認が必要:

- `model_name` を現行メタへ記録する正式運用の有無
- テスト件数を現行メタへ記録する正式運用の有無
- `test_mae` と `test_genre_accuracy` を現行メタへ記録する正式運用の有無
- 生成環境に依存する絶対パスをメタへ残す方針のままでよいか

### LEGACY_KEEP ファイルの再判定管理

| ファイル | 現在用途 | 用途確定可否 | 最終確認日 | 利用実態確認日 | 次回判定日 | 判定担当 | 状態 | 備考 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `photo-evaluator-dl-test.html` | 旧DL採点テスト画面 | 未確定 | `2026-03-24` | 確認が必要 | 確認が必要 | 未設定 | 継続保留 | 利用実態未確認 |
| `github-pages-photo-evaluator/photo-evaluator-dl-beta.html` | 公開系の旧DLベータ画面 | 未確定 | `2026-03-24` | 確認が必要 | 確認が必要 | 未設定 | 継続保留 | 利用実態未確認 |
| `photo-evaluator-training-lab.html` | 旧開発者ラボ画面 | 未確定 | `2026-03-24` | 確認が必要 | 確認が必要 | 未設定 | 継続保留 | 利用実態未確認 |

### DL学習記録仕様の差分表

| 項目 | 文書上の標準項目 | 現行出力項目 | 欠落項目 | 実装判断要否 | 本番影響有無 |
| --- | --- | --- | --- | --- | --- |
| モデル名 | `model_name` | なし | `model_name` | 要 | なし |
| 実行日時 | `trained_at` | `trained_at` | なし | 不要 | なし |
| 学習件数 | `sample_count` | `sample_count` | なし | 不要 | なし |
| 学習用件数 | `train_count` | `train_count` | なし | 不要 | なし |
| 検証件数 | `validation_count` | `validation_count` | なし | 不要 | なし |
| テスト件数 | `test_count` | なし | `test_count` | 要 | なし |
| 検証MAE | `validation_mae` | `validation_mae` | なし | 不要 | なし |
| テストMAE | `test_mae` | なし | `test_mae` | 要 | なし |
| 項目別MAE | `validation_mae_by_output` | `validation_mae_by_output` | なし | 不要 | なし |
| 検証ジャンルaccuracy | `validation_genre_accuracy` | `validation_genre_accuracy` | なし | 不要 | なし |
| テストジャンルaccuracy | `test_genre_accuracy` | なし | `test_genre_accuracy` | 要 | なし |
| モデルパス | `model_path` | `model_path` | なし | 不要 | なし |

## 14. 削除しないファイル

次は削除しないでください。

- `github-pages-photo-evaluator/index.html`
- `github-pages-photo-evaluator/photo_eval_model.json`
- `photo_eval_ml.sqlite3`
- `photo_eval_ml_core.py`
- `photo_eval_ml_server.py`
- `import_public_feedback.py`
- `train_photo_eval_model.py`
- `update_public_feedback_model.py`
- `maintenance-tools/`
- `photo-evaluator-training-lab-app/` 以下一式

## 15. 削除してよいものの考え方

現在、古いガイド類はこの `README.md` に統合しました。  
今後は、このファイル以外の README / 手順書を増やさない運用を推奨します。

## 16. 補足

- 一般ユーザー画面では `review_mode` を見せません
- 内部互換のため `review_mode` フィールド自体は残しています
- 公開版の学習は GitHub Pages 上では行いません
- 学習済みモデルを別環境で更新し、公開物へ反映します

## 17. 未確定事項管理表

| 管理ID | 未確定事項 | 現状 | 確認方法 | 確認対象 | 担当 | 期限 | 状態 | 確定後の対応 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `UNC-001` | `photo-evaluator-dl-test.html` の利用実態 | 旧DL採点テスト画面として残置、利用実態は未確認 | 実運用確認 | `photo-evaluator-dl-test.html` | 未設定 | 未設定 | 未確定 | `LEGACY_KEEP` 維持可否を更新 |
| `UNC-002` | `github-pages-photo-evaluator/photo-evaluator-dl-beta.html` の利用実態 | 公開系旧DLベータ画面として残置、利用実態は未確認 | 実運用確認 | `github-pages-photo-evaluator/photo-evaluator-dl-beta.html` | 未設定 | 未設定 | 未確定 | `LEGACY_KEEP` 維持可否を更新 |
| `UNC-003` | `photo-evaluator-training-lab.html` の利用実態 | 旧開発者ラボ画面として残置、利用実態は未確認 | 実運用確認 | `photo-evaluator-training-lab.html` | 未設定 | 未設定 | 未確定 | `LEGACY_KEEP` 維持可否を更新 |
| `UNC-004` | Render 側 `/api/ml/predict` の本番利用有無 | コード上では Render 利用候補があるが、本番利用は断定不可 | Render 運用確認 | Render デプロイ環境 | 未設定 | 未設定 | 未確定 | README の Render 依存箇所を更新 |
| `UNC-005` | DLメタ未実装標準項目の実装可否 | `model_name`, `test_count`, `test_mae`, `test_genre_accuracy` は現行未出力 | 実装判断会話 | `photo-evaluator-training-lab-app/dl-lab/models/dl_residual_model_meta.json` | 未設定 | 未設定 | 未確定 | 差分表と記録仕様を更新 |
| `UNC-006` | DLメタに絶対パスを残す方針 | 現行メタは絶対パスを保持 | 運用判断確認 | `photo-evaluator-training-lab-app/dl-lab/models/dl_residual_model_meta.json` | 未設定 | 未設定 | 未確定 | 記録仕様を更新 |

## 17. README 更新ルール

この章は、今後の構成変更や案内変更で README と管理表の記述ずれを防ぐための更新ルールです。

### どの変更で README を更新するか

- 入口変更時
  - 更新するもの: `## 1. システム全体像`, `## 1.1 現状の実動構成`, `## 3. URL と起動方法`
  - 更新箇所: 正式入口、別名入口、互換入口の記述
- API URL 変更時
  - 更新するもの: `### 公開版の実際の判定フロー`, `### ローカル時のみ有効なAPI`, `## 8.1 設定値の棚卸し一覧`
  - 更新箇所: URL、接続先、用途説明
- timeout 変更時
  - 更新するもの: `## 8.1 設定値の棚卸し一覧`
  - 更新箇所: timeout 値、所在ファイル、用途
- 表示名変更時
  - 更新するもの: `## 8.1 設定値の棚卸し一覧`, 関連する役割整理表
  - 更新箇所: `標準 / 学習 / 学習＋`、`AI補正あり / 標準判定`
- Render依存箇所変更時
  - 更新するもの: `### Render 依存箇所`, 役割整理表, 設定値管理表
  - 更新箇所: Render URL、対象機能、設定ファイル
- ローカルAPI分岐条件変更時
  - 更新するもの: `### 公開版の実際の判定フロー`, `### ローカル時のみ有効なAPI`, `## 8.1 設定値の棚卸し一覧`
  - 更新箇所: `file:` / `127.0.0.1` / `localhost` 条件の説明
- LEGACY_KEEP 判定変更時
  - 更新するもの: `### 旧ファイルの扱い方針`, `### LEGACY_KEEP ファイルの再判定管理`
  - 更新箇所: ラベル、利用実態、代替ファイル、再判定日
- DL評価記録仕様変更時
  - 更新するもの: `### DL評価結果の記録様式`
  - 更新箇所: 標準仕様項目、未実装項目、確認が必要な点
- 起動スクリプト案内変更時
  - 更新するもの: `## 3. URL と起動方法`
  - 更新箇所: 起動時に案内する正式入口、別名入口、対象スクリプト

### 更新責務の対象表

| 変更対象 | 更新が必要な文書 | 更新理由 | 備考 |
| --- | --- | --- | --- |
| 正式入口 | `README.md` の構成説明、URL案内、役割表 | 利用者の入口誤認を防ぐ | 現在は `local-main-app/index.html` |
| 別名入口 | `README.md` の入口説明、URL案内 | 互換導線の誤記防止 | 現在は `local-main-app/photo-evaluator-pro-delivery-webhook-set.html` |
| 公開正本 | `README.md` の正本説明、公開物一覧 | 修正先の誤認防止 | 現在は `github-pages-photo-evaluator/index.html` |
| Render URL | `README.md` の Render 依存箇所、設定値管理表 | 外部依存の誤記防止 | 接続先変更時は要更新 |
| ローカルAPI関連案内 | `README.md` の判定フロー、ローカルAPI説明、設定値管理表 | ローカル確認条件の誤解防止 | 分岐条件変更時は必ず更新 |
| 表示名 | `README.md` の設定値管理表、役割整理表 | UI表示と文書のずれ防止 | 文言変更時は本番/ローカル/ラボを同時確認 |
| LEGACY_KEEP 管理欄 | `README.md` の旧ファイル表、再判定管理表 | 旧ファイルの扱い維持 | 削除は別判断 |
| DL評価記録仕様 | `README.md` の DL評価結果の記録様式 | 学習結果の比較可能性維持 | 未実装項目は未確定として残す |
| 起動スクリプト案内 | `README.md`, `maintenance-tools/start-photo-eval-ml-server.command` | 案内先のずれ防止 | 処理変更ではなく文言確認を行う |

## 18. 確定事項と未確定事項

### 確定事項

- 公開正本は `github-pages-photo-evaluator/index.html`
- 正式なローカル入口は `local-main-app/index.html`
- 別名入口は `local-main-app/photo-evaluator-pro-delivery-webhook-set.html`
- ルート `index.html` は削除済み
- 現在の主運用は `公開アプリ / ローカル確認 / 開発者ラボ / DL実験` の4系統

### 未確定事項

- `photo-evaluator-dl-test.html` の利用実態
- `github-pages-photo-evaluator/photo-evaluator-dl-beta.html` の利用実態
- `photo-evaluator-training-lab.html` の利用実態
- Render 側 `/api/ml/predict` の本番利用有無
- DLメタに `model_name`、`test_count`、`test_mae`、`test_genre_accuracy` を正式記録する運用の有無
- DLメタに絶対パスを残す運用方針

未確定事項は断定せず、確認後に `README.md` の該当表を更新します。

## 19. 今後の保守優先順位

1. 入口と案内文の整合維持
2. 設定値管理表の更新維持
3. LEGACY_KEEP の再判定
4. DL評価記録仕様の実装追随
5. Render運用の確認
