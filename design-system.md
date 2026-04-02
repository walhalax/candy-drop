# Design System — CandyDrop
> Generated 2026-04-03 | Last updated 2026-04-03

## Direction artistique
- **Tone :** Playful / Toy-like
- **Style :** Bright pastel candy aesthetic with pink primary gradient
- **Differenciateur :** Wrapped candy pieces with shiny 3D effect, sparkle effects on chain combos
- **Anti-patterns :** Generic gradients, system fonts for display, flat design

## Palette
| Role | Hex | Usage |
|------|-----|-------|
| Primary | #ff69b4 | Buttons, borders, main accents |
| Primary Dark | #ff1493 | Active states, highlights |
| Pink Light | #fff0f5 | Button backgrounds, cards |
| Pink Gradient | linear-gradient(135deg, #ffd6e7 0%, #ffb6d9 25%, #ffc8dd 50%, #ffe0f0 75%, #ffd6e7 100%) | Body background |
| Text Dark | #333 | Primary text |
| Text Muted | #666 | Secondary text |
| Success | #33ff88 | Positive feedback |
| Warning | #ff8800 | Warnings |
| Error | #ff3377 | Errors |

### Dark mode
| Role | Light | Dark |
|------|-------|------|
| Primary | #ff69b4 | #ff69b4 |
| Background | linear-gradient pastel | linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 40%, #2a1a4e 70%, #0a0a1a 100%) |
| Text | #333 | #e0e0ff |

## Typographie
- **Display :** Nunito — titles, scores, popups
- **Body :** Hiragino Sans, Yu Gothic UI, Meiryo — Japanese text, UI labels
- **Fallback :** Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji

### Type scale (Tablet default)
| Token | Taille | Weight | Usage |
|-------|--------|--------|-------|
| xs | 18px | 400 | Fine print, captions |
| sm | 21px | 400 | Labels, secondary |
| md | 21px | 400 | Body text |
| lg | 23px | 500 | Emphasis |
| xl | 26px | 600 | Section titles |
| 2xl | 31px | 700 | Major headings |
| 3xl | 36px | 700 | H1 titles |
| title | 68px | 700 | Game title |

### Type scale (Mobile < 768px)
| Token | Taille | Weight | Usage |
|-------|--------|--------|-------|
| xs | 13px | 400 | Fine print |
| sm | 15px | 400 | Labels |
| md | 15px | 400 | Body text |
| lg | 16px | 500 | Emphasis |
| xl | 18px | 600 | Section titles |
| 2xl | 22px | 700 | Major headings |
| 3xl | 25px | 700 | H1 titles |
| title | 48px | 700 | Game title |

## Spacing & Layout
- **Base unit :** 8px
- **Scale :** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96
- **Breakpoints :** 768px (mobile / tablet distinction)
- **Z-index :** base 0 / dropdown 10 / sticky 20 / modal 40 / toast 100 / overlay 1000

## Responsive Strategy
### Tablet (>= 768px) — Default
- BASE_CELL: 38px
- Touch controls: 62px buttons, full opacity
- Game field: 95% screen height
- SCALE cap: 3.0

### Mobile (< 768px)
- BASE_CELL: 28px
- Touch controls: 48px buttons, reduced padding
- Font sizes: ~0.7x tablet
- SCALE cap: 2.0
- Game container: tighter gaps

## Composants clés
### Touch Controls
- **Variantes :** left (D-pad), right (rotate)
- **États :** default (opacity 0.35), active (scale 0.9)
- **Classe :** .touch-btn, #touch-controls-left, #touch-controls-right

### Game Area
- **Variantes :** light mode (rgba 255,255,255,0.70), dark mode (rgba 10,10,26,0.9)
- **Classe :** #game-area

### Ranking Display
- **Variantes :** rank-first (42px), rank-second (36px), rank-third (30px)
- **Mobile :** rank-first (26px), rank-second (22px), rank-third (18px)
- **Classe :** #ranking-list .rank-first/second/third
