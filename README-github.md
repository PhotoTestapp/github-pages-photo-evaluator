# Photo Evaluator

写真をアップロードすると、ブラウザ内で写真の見え方を分析し、総合点と項目別スコアを返す写真評価アプリです。  
このファイルは、GitHub でプロジェクト全体を把握するための要約版 README です。

## 概要

このプロジェクトは、次の4系統で構成されています。

1. 公開版
一般ユーザー向けの写真評価アプリです。GitHub Pages に置く前提のフロントです。

2. DL版
DL 推論を使った別画面です。点数評価・ジャンル評価のフィードバック保存やタイムライン確認に対応しています。

3. 開発者ラボ
学習データ作成、レビュー管理、統計確認、モデル更新を行う管理画面です。

4. ローカル API / 学習環境
ML 補正、フィードバック保存、DL 推論、統計集計を支えるローカル実行系です。

## 主な機能

### 公開版

- 写真を最大5枚まで選択して評価
- 総合点と項目別スコアを表示
- 改善コメントを表示
- 端末内履歴の保存と表示
- 履歴の JSON / CSV 書き出し
- 統計タブで全体統計と端末内集計を表示
- 感想保存
- ジャンル自動判定

### DL版

- 写真を1枚ずつ評価
- DL 推論またはフォールバック推論で結果表示
- 点数評価フィードバック
- ジャンル正誤フィードバック
- 端末内タイムライン表示
- 共有保存先 API への評価送信

### 開発者ラボ

- 学習用評価データの保存
- 保存履歴の確認
- レビュー管理
- Exif 統計
- DL 統計
- 学習データのエクスポート
- GitHub Pages 用モデル反映

## 現在の判定方式

### 公開版の基本フロー

1. ブラウザ内で画像特徴量を抽出
2. ルールベースで項目別スコアを計算
3. 総合点のみ ML で補正
4. ジャンル判定は `標準 / 学習 / 学習＋` の表示体系で扱う

### 用語

- `標準`
ルールベースのみ

- `学習`
ML 補正ありの通常評価

- `学習＋`
DL を使ったジャンル補助判定

補足:

- 公開版は `DL評価そのもの` を行う画面ではありません
- 公開版で DL を使うのは、主にジャンル判定補助です

## 現在のUI仕様

### 公開版

- タブ: `写真をみる / 統計 / 履歴`
- バージョン表記: `PUBLIC_UI v2026-04-09-b`
- 統計の「この端末の集計」では
  - 表示あり: 評価件数、平均総合点、カテゴリ正答率、自動判定カテゴリ、選択カテゴリ、カテゴリ別正答率
  - 非表示: 総合点ヒストグラム、項目別平均
- 結果画面では
  - `次の写真を見る` は非表示
  - `新しい写真をチェックする` は感想保存後に有効化

### DL版

- 上部ナビに `PHOTO EVAL` を表示
- 本文の大きなタイトルは非表示
- タイムライン形式で履歴表示
- 件数表示、全件削除、個別削除に対応

## 主要ファイル

### 公開版

- `github-pages-photo-evaluator/index.html`
- `github-pages-photo-evaluator/photo_eval_model.json`
- `github-pages-photo-evaluator/photo_eval_public_stats.json`

### DL版

- `github-pages-photo-evaluator/photo-evaluator-dl-beta.html`

### 開発者ラボ

- `photo-evaluator-training-lab-app/photo-evaluator-training-lab.html`
- `photo-evaluator-training-lab-app/photo_eval_ml_server.py`

### ローカル API / 学習コア

- `photo_eval_ml_server.py`
- `photo_eval_ml_core.py`

## GitHub Pages に上げるもの

通常の公開版更新では、主に次を反映します。

- `github-pages-photo-evaluator/index.html`
- `github-pages-photo-evaluator/photo_eval_model.json`
- `github-pages-photo-evaluator/photo_eval_public_stats.json`
- `github-pages-photo-evaluator/manifest.webmanifest`
- `github-pages-photo-evaluator/service-worker.js`

## 補足

- 学習処理自体は GitHub Pages 上では行いません
- 学習済みモデルと統計 JSON は別環境で更新して反映します
- 詳細な運用手順や内部構成は [README.md](/Users/haradasusumuwataru/Library/Mobile%20Documents/com~apple~CloudDocs/名称未設定フォルダ/アプリ/README.md) を参照してください
