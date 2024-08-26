
# Border Beam

An animated border component that creates a visually stunning beam of light traveling along the borders of any container. Perfect for adding a modern, dynamic touch to your web components.

**Check out the [website](https://your-website-link.com) for demos, examples, and further info.**

## Features

- **Customizable Border Component**: Easily adaptable border beam component for various use cases, allowing for dynamic, animated borders with customizable colors and timing.
- **Ease of Use**: Designed for developers who want to add a unique, eye-catching effect to their components with minimal setup.
- **Fully Configurable**: Adjust the size, duration, border width, colors, and delay to fit your project's needs.
- **SCSS Modules**: The component is styled using SCSS modules, making it easy to integrate and customize within your existing project.

## Installation

Install the package using npm:

```bash
npm install @stianlarsen/border-beam
```

Or using yarn:

```bash
yarn add @stianlarsen/border-beam
```

## Usage

### Border Beam

Import and use the Border Beam component in your React project:

```jsx
import { BorderBeam } from "@stianlarsen/border-beam";

function App() {
  return (
    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
      <BorderBeam size={300} duration={10} />
    </div>
  );
}
```

### Default CSS Variables

Add the variables below to your `global.css` (or equivalent stylesheet) to customize the colors and themes.

```css
/* Default styles */
:root {
  --size: 200px;
  --duration: 15s;
  --anchor: 90%;
  --border-width: 1.5px;
  --color-from: #ffaa40;
  --color-to: #9c40ff;
  --delay: 0s;
}
```

### Customizing Styles with CSS Variables

The component leverages CSS variables, which makes it easy to customize the appearance of the border beam effect. You can redefine these variables in your project’s stylesheet.

Example of customizing the border beam colors:

```css
:root {
  --color-from: #ff0000;
  --color-to: #0000ff;
}
```

By utilizing these CSS variables, you can tailor the `BorderBeam` component to match your project’s design aesthetics seamlessly.

### Applying the Variables

The BorderBeam component automatically uses the variables mentioned above, so you only need to change the values in your global stylesheet to apply your custom styles.

## Contributing

Contributions are always welcome! Please contact me for further info.

## License

`@stianlarsen/border-beam` is [MIT licensed](./LICENSE).

## Contact

For any questions or suggestions, feel free to reach out.

- GitHub: [@stianlars1](https://github.com/stianlars1)
- Website: [https://stianlarsen.com](https://stianlarsen.com)
- Email: [stian.larsen@mac.com](mailto:stian.larsen@mac.com)
