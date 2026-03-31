# Findings: iOS/iPad Optimization

## 既存状況（index.html先頭500行より）

### 既に実装済みのiOS最適化
- viewport meta: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`
- apple-mobile-web-app-capable: yes
- apple-mobile-web-app-status-bar-style: black-translucent
- safe-area-inset対応（CSS padding: env(safe-area-inset-*)）
- overscroll-behavior: none
- touch-action: manipulation
- -webkit-tap-highlight-color: transparent
- touch-callout: none
- -webkit-user-select: none
- タッチコントロールUI（#touch-controls）実装済み

### 未実装
- Service Worker（PWA）
- manifest.json
- インストールバナーUI
- アプリアイコン生成

## iOS Safari PWA制限
- beforeinstallpromptイベント未対応
- 独自UIで「ホーム画面に追加」案内が必要
- アイコンはapple-touch-iconで別途指定が必要（manifest iconsとは別）

## Service Worker参考
- Cache-First戦略が適切（ゲームアセットは変わらない）
- キャッシュ対象: index.html, Google Fonts, BGM audio
- バージョン管理でキャッシュ更新制御

## アイコン生成
- Canvas 1024x1024に描画
- toBlob() → PNG生成
- 複数サイズ出力（1024, 512, 180, 167, 152, 120）
