import { defineConfig } from "tsup";

export default defineConfig({
  // Entry point - the main barrel export
  entry: ["src/index.tsx"],

  // Output formats: ESM for modern bundlers, CJS for Node.js/older tools
  format: ["esm", "cjs"],

  // Generate TypeScript declaration files (.d.ts)
  dts: true,

  // Enable source maps for debugging
  sourcemap: true,

  // Clean dist folder before build
  clean: true,

  // External dependencies - don't bundle these
  external: ["react", "react-dom"],

  // Splitting and directives
  splitting: false,

  // Tree-shaking for smaller bundles
  treeshake: true,

  // Minify production builds (set to false for readable output)
  minify: false,

  // Target modern browsers/Node.js
  target: "es2020",

  // Copy CSS files and add "use client" directive after build
  onSuccess:
    "shx mkdir -p dist/css && shx cp src/css/borderBeam.css dist/css/ && node scripts/add-use-client.js",
});
