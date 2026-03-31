# Task Plan: マジックボタン・リデザイン + 最大連鎖数カウント

## Status
実装完了

## 実装内容

### マジックボタン レイヤー構造変更
- **背景円** (Layer 1): グラデーション背景
- **魔女の帽子** (Layer 2): 半透明(alpha=0.5) - 帽子のみ透明度を適用
- **メーターバー** (Layer 3): 帽子の上に描画（最前面）- 視認性最重要
- **円形フレーム** (Layer 4): 最前面に線描画

### メーターバー デザイン変更
- stroke/outline方式を廃止し、fill方式に統一
- Filled bars: 純粋な橙色 `rgb(255, 85, 0)` + グロー効果
- Empty bars: 暗い灰色 `rgb(60, 60, 75)` （完全不透明）
- サイズ: バー高さ2.6px × 30本、バー間隔0、円周全覆盖
- startX=1, startY=2, divWidth=78

### 最大連鎖数(maxChain)カウント追加
- `maxChain`変数追加（track maximum chain）
- `cascadeChain > maxChain`時に更新
- ゲーム開始時(`init`)にmaxChain = 0にリセット
- ランキング保存時にmaxChainを使用（DOM参照から変数直接参照に変更）
- デバッグ用console.log追加

### マジック、メーター増加除外
- `magicClearingInProgress`フラグ使用
- マジック発動時〜gravity/chain settlement完了まで(~500ms)メーター増加を停止

---

# Task Plan: iOS/iPad Optimization - PWA Complete

## Goal
iPhone/iPadでプレイするためのPWA完全対応（オフラインプレイ、インストールプロンプト、アプリアイコン自動生成）を実装する。

## Current Phase
Phase 3: Implementation

## Phases

### Phase 1: Requirements & Discovery
- [x] ユーザー要件確認（PWA完全版、希望）
- [x] アイコン生成方法確認（Canvasで動的生成）
- [x] 设计spec作成・コミット済み
- **Status:** complete

### Phase 2: Planning & Structure
- [x] ファイル構成決定
- [x] manifest.json, sw.js, icons/構成計画
- **Status:** complete

### Phase 3: Implementation
- [x] manifest.json作成
- [x] sw.js（Service Worker）作成
- [x] index.htmlにmanifest link + sw registration追加
- [x] インストールバナーUI実装
- [x] アイコン生成機能実装（デバッグモード）
- **Status:** complete

### Phase 4: Testing & Verification
- [ ] Service Worker登録確認
- [ ] オフライン動作確認
- [ ] インストールバナー表示確認
- [ ] アイコン生成テスト
- **Status:** pending

### Phase 5: Delivery
- [x] 全ファイルreview
- [x] コミット（746de62）
- **Status:** complete

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Cache-First戦略 | ゲームアセットはimmutableのため、最も効率的 |
| アイコンはCanvas生成 | ゲーム内アートワークを使い、外部ツール不要 |
| iOS独自インストールUI | beforeinstallprompt未対応のため必須 |
| 24時間バナー再表示抑制 | ユーザー体験向上のため |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| | | |

---

# Task Plan: 難易度選択時のチュートリアルポップアップ

## Goal
「ふつう」「っちゃムズ」各モード選択時に、適切なチュートリアル動画をポップアップで表示する機能を実装する。

## Status
実装完了

## Implementation Details

### 追加した機能

#### 1. っちゃムズモード（透明ブロック説明）
- **ファイル:** extreme-demo.js（index.htmlから分離）
- **内容:** 赤4連結→透明ブロック消除のデモ動画
- **ロジック:** 赤3連結に落下ペアが合流→4連結→burst、隣接透明ブロックも消除

#### 2. ふつうモード（あそび方説明）
- **ファイル:** normal-demo.js（新規作成）
- **内容:** 基本ルールの説明（2パターンでループ再生）
- **パターン(1):** 基本4連結 - 赤3連結に落下ペアが合流→4連結→burst
- **パターン(2):** 2連鎖 - ピンク4連結→消除→重力→緑4連結→2連鎖目

#### 3. ポップアップUI
- **normal-warning-popup**: 「あそび方」ポップアップ（ふつう選択時）
- **extreme-warning-popup**: 「おジャマブロックの消し方」ポップアップ（っちゃムズ選択時）
- localStorageフラグ管理（`candyDrops_showNormalWarning`, `candyDrops_showExtremeWarning`）

### ファイル変更
- **index.html**
  - normal-warning-popup HTML追加
  - normal-warning-popup CSS追加（ダークモード対応含む）
  - normal-warning-popup JavaScript制御ロジック追加
  - extreme-demo.js / normal-demo.js 外部スクリプト読み込み
  - インライン демо コード削除（externalized）
- **extreme-demo.js**: index.htmlから分離したっちゃムズデモ
- **normal-demo.js**: 新規作成したふつうモードデモ

### 動作仕様
1. 「ふつう」選択→「ゲームスタート」で「あそび方」ポップアップ表示（初回のみ）
2. 「っちゃムズ」選択→「ゲームスタート」で「おジャマブロックの消し方」ポップアップ表示（初回のみ）
3. 「次からは見ない」チェック→下次부터 팝업非表示
4. 「もどる」でタイトル画面に戻る
5. デモは (1)→(2)→(1) とループ再生
