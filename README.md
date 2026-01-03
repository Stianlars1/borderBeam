# @stianlarsen/border-beam

[![npm version](https://img.shields.io/npm/v/@stianlarsen/border-beam.svg)](https://www.npmjs.com/package/@stianlarsen/border-beam)
[![npm downloads](https://img.shields.io/npm/dm/@stianlarsen/border-beam.svg)](https://www.npmjs.com/package/@stianlarsen/border-beam)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@stianlarsen/border-beam)](https://bundlephobia.com/package/@stianlarsen/border-beam)
[![license](https://img.shields.io/npm/l/@stianlarsen/border-beam.svg)](https://github.com/Stianlars1/borderBeam/blob/main/LICENSE)

An animated border component that creates a visually stunning beam of light traveling along the borders of any container.

![Border Beam Preview](https://raw.githubusercontent.com/Stianlars1/borderBeam/main/borderbeam.png)

## Installation

```bash
npm install @stianlarsen/border-beam
```

## Usage

<<<<<<< HEAD
```tsx
import { BorderBeam } from "@stianlarsen/border-beam";
import "@stianlarsen/border-beam/styles.css";
=======
### Border Beam

Import the component and its styles in your React project:

```jsx
import { BorderBeam } from "@stianlarsen/border-beam";
import "@stianlarsen/border-beam/css";
>>>>>>> 9da553f (Claude fix)

function Card() {
  return (
    <div style={{ position: "relative", padding: "2rem", borderRadius: "8px" }}>
      <h2>Your content here</h2>
      <BorderBeam />
    </div>
  );
}
```

<<<<<<< HEAD
> **Important:** The parent container must have `position: relative` and a `border-radius` for the beam to follow the container shape.
=======
**Important:** You must import the CSS file separately as shown above for the component to work properly.

## `BorderBeam` Component Props
>>>>>>> 9da553f (Claude fix)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `200` | Size of the animated beam in pixels |
| `duration` | `number` | `15` | Animation duration in seconds |
| `borderWidth` | `number` | `1.5` | Border width in pixels |
| `anchor` | `number` | `90` | Anchor point of the beam (percentage) |
| `colorFrom` | `string` | `"#ffaa40"` | Gradient start color |
| `colorTo` | `string` | `"#9c40ff"` | Gradient end color |
| `delay` | `number` | `0` | Animation delay in seconds |
| `className` | `string` | — | Additional CSS class |

## Examples

### Custom Colors

```tsx
<BorderBeam colorFrom="#00ff88" colorTo="#0088ff" />
```

### Faster Animation

```tsx
<BorderBeam duration={5} size={150} />
```

### Multiple Beams

```tsx
<div style={{ position: "relative" }}>
  <BorderBeam colorFrom="#ff0000" colorTo="#ff8800" delay={0} />
  <BorderBeam colorFrom="#00ff00" colorTo="#00ffff" delay={5} />
</div>
```

## Framework Compatibility

- **Next.js** (App Router & Pages Router)
- **Vite**
- **Create React App**
- **Remix**

This component includes the `"use client"` directive for React Server Components compatibility.

## Requirements

- React 18.0.0 or higher (including React 19)

## License

MIT

## Author

[Stian Larsen](https://stianlarsen.com) · [GitHub](https://github.com/stianlars1) · [stian.larsen@mac.com](mailto:stian.larsen@mac.com)
