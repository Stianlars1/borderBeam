
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

## `BorderBeam` Component Props

The `BorderBeam` component accepts several props to customize its behavior and appearance:

| Prop         | Type       | Description                                                                                  |
| ------------ | ---------- | -------------------------------------------------------------------------------------------- |
| `className`  | `string`   | An optional CSS class to apply custom styling.                                               |
| `size`       | `number`   | The size of the animated beam. Defaults to `200`.                                            |
| `duration`   | `number`   | The duration of the animation in seconds. Defaults to `15`.                                  |
| `borderWidth`| `number`   | The width of the border in pixels. Defaults to `1.5`.                                        |
| `anchor`     | `number`   | The anchor point of the beam. Defaults to `90`.                                              |
| `colorFrom`  | `string`   | The starting color of the gradient. Defaults to `#ffaa40`.                                   |
| `colorTo`    | `string`   | The ending color of the gradient. Defaults to `#9c40ff`.                                     |
| `delay`      | `number`   | Delay before the animation starts in seconds. Defaults to `0`.                               |

### Customizing Colors

You can easily customize the colors of the border beam by using the `colorFrom` and `colorTo` props. For more advanced customization, you can also use CSS variables within your project.

Example of customizing colors:

```jsx
<BorderBeam colorFrom="#ff0000" colorTo="#0000ff" />
```

## Contributing

Contributions are always welcome! Please contact me for further info.

## License

`@stianlarsen/border-beam` is [MIT licensed](./LICENSE).

## Contact

For any questions or suggestions, feel free to reach out.

- GitHub: [@stianlars1](https://github.com/stianlars1)
- Website: [https://stianlarsen.com](https://stianlarsen.com)
- Email: [stian.larsen@mac.com](mailto:stian.larsen@mac.com)
