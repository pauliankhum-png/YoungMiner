# Design Brief

**Tone & Differentiation**: Dark futuristic cyberpunk with neon glow accents. Mining game aesthetic emphasizes active state feedback via glowing neon effects. Tech-grid background pattern adds atmosphere without clutter.

**Color Palette**

| Token               | OKLCH Values       | Purpose                           |
| ------------------- | ------------------ | --------------------------------- |
| background          | 0.08 0 0           | Near-black viewport base          |
| foreground          | 0.92 0 0           | High-contrast text               |
| card                | 0.12 0.005 280     | Subtle blue-tinted panels         |
| primary (blue)      | 0.70 0.25 120      | Secondary UI, stats panels        |
| accent (green)      | 0.75 0.27 120      | Mining button, active glow states |
| border              | 0.2 0.01 280       | Grid lines, subtle dividers       |

**Typography**

- **Display**: General Sans (tech, modern, clean)
- **Body**: General Sans (legible UI text)
- **Mono**: JetBrains Mono (stats, coin counts, real-time values)

**Structural Zones**

| Zone        | Treatment                                              |
| ----------- | ------------------------------------------------------ |
| Game Canvas | Full viewport, grid-bg pattern overlay (optional tint) |
| Mining Area | Center focus, glowing animation, mining-pulse effect   |
| Stats Panel | Overlay (top/side), card with glow-neon-blue shadow    |
| Upgrade Shop| Floating card, glow-neon-green highlights on hover    |

**Component Patterns**

- **Mining Button**: `glow-neon-green` shadow, `animation-mining-pulse` on active, scales up when hovered
- **Stats Display**: Monospace font, `text-glow-accent` for live values, updates in real-time
- **Cards**: `glow-neon-blue` for secondary info, thin borders with `border-border`
- **Buttons**: Neon glow on hover/active, smooth transitions

**Motion**

- `transition-smooth`: 0.3s cubic-bezier for interactive elements
- `animation-pulse-glow`: 2s infinite pulsing border glow on mining button
- `animation-mining-pulse`: 0.6s scale pulse during active mining

**Shape Language**

- Border radius: 0.5rem (rounded, not hard-edged)
- Interactive elements: Minimal padding, sharp geometric outlines
- Cards: Subtle glow shadows replace drop-shadow depth

**Constraints**

- No full-page gradients; use grid pattern + solid near-black for atmosphere
- Neon glows used sparingly on: primary interactive elements, active mining state, upgrade highlights
- Text contrast maintained via high L value (0.92 foreground on 0.08 background = ≥8:1)
- All colors use OKLCH; no hex or RGB literals in component styles

**Signature Detail**: Neon glow effects on active mining button + stats panel create cyberpunk visual feedback loop. Real-time text-glow reflects coin generation activity.
