# iOS/iPad最適化設計

## 概要

iPhone/iPadでのプレイ体験を最大化するため、PWA完全対応とホーム画面インストール機能を実装する。

## 1. PWA対応（完全版）

### Service Worker (sw.js)

- **Cache Strategy**: Cache-First（ゲームアセットはimmutableのため）
- **キャッシュ対象**:
  - `index.html`
  - Google Fonts CSS + WOFF2ファイル
  - BGM audioファイル（mp3/wav）
- **オフライン判定**: キャッシュ済みなら完全オフライン動作
- **キャッシュバージョン管理**: `CACHE_VERSION`で制御

### Web App Manifest (manifest.json)

```json
{
  "name": "Candy-Drops",
  "short_name": "CandyDrop",
  "start_url": "/index.html",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffd6e7",
  "theme_color": "#ff69b4",
  "icons": [
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icons/icon-1024.png", "sizes": "1024x1024", "type": "image/png" }
  ]
}
```

### インストールプロンプト

- iOS Safariは`beforeinstallprompt`イベント未対応 → 独自UIで表示
- 初回起動から3秒後にバナーを表示
- 閉じたユーザーは24時間は再表示しない（`localStorage`管理）

## 2. アプリアイコン自動生成

### 生成方式

Canvas APIで1024x1024のPNGを動的生成

### 描画内容

- グラデーション背景（ピンク系）
- ゲーム内キャンディ4色（Red, Blue, Green, Yellow）の描画
- 上部にゲームタイトルテキスト

### 生成サイズ

| 用途 | サイズ |
|------|--------|
| App Store / PWA | 1024x1024 |
| manifest用 | 512x512 |
| iOS touch-icon | 180, 167, 152, 120 |

### 出力方法

- Blob URL生成後、リンククリックでダウンロード
- `icons/`ディレクトリに保存可能

## 3. フォント最適化（現状維持）

- Google Fonts: `display=swap` + `preconnect`済み → 変更なし
- フォールバック: `'Nunito', 'Hiragino Sans', sans-serif`

## ファイル構成

| ファイル | アクション |
|----------|-----------|
| `index.html` | 修正（manifest link, sw registration追加） |
| `sw.js` | 新規作成 |
| `manifest.json` | 新規作成 |
| `icons/` | 新規ディレクトリ（アイコン保存用） |

## コミットタイミング

全作業完了後に1コミットでまとめる
