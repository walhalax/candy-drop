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
- [ ] manifest.json作成
- [ ] sw.js（Service Worker）作成
- [ ] index.htmlにmanifest link + sw registration追加
- [ ] インストールバナーUI実装
- [ ] アイコン生成機能実装（デバッグモード）
- **Status:** pending

### Phase 4: Testing & Verification
- [ ] Service Worker登録確認
- [ ] オフライン動作確認
- [ ] インストールバナー表示確認
- [ ] アイコン生成テスト
- **Status:** pending

### Phase 5: Delivery
- [ ] 全ファイルreview
- [ ] コミット
- **Status:** pending

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
