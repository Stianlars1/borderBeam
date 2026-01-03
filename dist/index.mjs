"use client";
import { jsx } from 'react/jsx-runtime';

// src/index.tsx
var BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        "--size": `${size}px`,
        "--duration": `${duration}s`,
        "--anchor": `${anchor}%`,
        "--border-width": `${borderWidth}px`,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--delay": `-${delay}s`
      },
      className: `borderBeam ${className || ""}`
    }
  );
};

export { BorderBeam };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map