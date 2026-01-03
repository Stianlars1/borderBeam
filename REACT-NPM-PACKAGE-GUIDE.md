# From Broken to Production-Ready: The Complete Guide to React NPM Packages

**A comprehensive journey from understanding what went wrong to building professional React packages**

---

## Table of Contents

1. [What Went Wrong: Understanding Your Package's Failure](#what-went-wrong)
2. [The Fundamental Misconception](#the-fundamental-misconception)
3. [How JavaScript Modules Really Work](#how-javascript-modules-really-work)
4. [The Complete Guide: Building a React Package From Scratch](#complete-guide)
5. [Advanced Topics](#advanced-topics)
6. [Common Pitfalls and How to Avoid Them](#common-pitfalls)
7. [Publishing Checklist](#publishing-checklist)

---

## What Went Wrong: Understanding Your Package's Failure

### The Error Message Decoded

```
Module [project]/node_modules/@stianlarsen/border-beam/dist/css/borderBeam.css
[app-client] (css) was instantiated because it was required from module
[project]/node_modules/@stianlarsen/border-beam/dist/index.js [app-client]
(ecmascript), but the module factory is not available. It might have been
deleted in an HMR update.
```

**What this really means**: Your JavaScript file tried to import a CSS file at runtime, but Next.js with Turbopack couldn't handle it.

### The Root Causes

Your package failed for **three interconnected reasons**:

#### 1. **CSS Import in Component Source** (Primary Issue)
```tsx
// src/index.tsx (YOUR OLD CODE)
import React from "react";
import { BorderBeamProps } from "../types/types";
import "./css/borderBeam.css";  // ❌ THIS WAS THE PROBLEM
```

**Why this broke:**

When TypeScript compiled your code, it transformed it to:
```javascript
// dist/index.js (COMPILED OUTPUT)
"use strict";
var __importDefault = require("react");
require("./css/borderBeam.css");  // ❌ JavaScript trying to load CSS!
```

**The fundamental issue**: JavaScript files cannot directly import CSS files. That's a **build-time feature** provided by bundlers (Webpack, Vite, etc.), not a runtime JavaScript capability.

When a user installed your package:
1. They got the compiled `dist/index.js` file (JavaScript)
2. That JavaScript file had `require("./css/borderBeam.css")`
3. Node.js and browsers **cannot execute** this - CSS is not JavaScript
4. Next.js/Turbopack tried to handle it but failed because the file wasn't part of their build pipeline

#### 2. **Incorrect Build Configuration** (Secondary Issue)

```json
// Your old package.json
{
  "main": "dist/index.js",  // Only CommonJS, no ESM
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"  // No conditional exports
    }
  }
}
```

**Problems:**
- No ESM (`.mjs`) output for modern bundlers
- No conditional exports for different module systems
- Missing `sideEffects: false` flag (prevents tree-shaking)
- No `module` field for bundlers

#### 3. **Wrong Build Tool** (Tertiary Issue)

```bash
# Your old build script
"build": "tsc && shx mkdir -p dist/css/ && shx cp src/css/borderBeam.css dist/css/"
```

Using **plain TypeScript compiler (`tsc`)** meant:
- Only outputs CommonJS **or** ESM, not both
- No bundling or optimization
- No automatic handling of directives like `"use client"`
- Manual file copying required

---

## The Fundamental Misconception

### What You Thought Was Happening

```
┌─────────────────────────────────────────────┐
│  User installs package                      │
│  → Imports component                        │
│  → Component auto-loads its CSS             │
│  → Everything works ✓                       │
└─────────────────────────────────────────────┘
```

This works in **application code** (Next.js, Create React App) because the bundler processes everything.

### What Was Actually Happening

```
┌─────────────────────────────────────────────┐
│  User installs package                      │
│  → Gets pre-compiled JavaScript              │
│  → JavaScript has require("./css/...")      │
│  → Browser/Node can't execute this ✗        │
│  → ERROR: Module factory not available      │
└─────────────────────────────────────────────┘
```

### The Core Lesson

**Application code ≠ Library code**

| Aspect | Application Code | Library Code |
|--------|------------------|--------------|
| CSS Imports | ✅ Works (bundler handles it) | ❌ Breaks (no bundler) |
| Build Output | For your app only | For other people's apps |
| Bundler | You control it | User controls it |
| File Types | Mix JS/CSS/images freely | Only ship compiled JS + separate assets |

---

## How JavaScript Modules Really Work

Before building packages, you need to understand JavaScript's module systems.

### The Evolution of JavaScript Modules

#### 1. **No Modules (Pre-2009)**
```html
<script src="file1.js"></script>
<script src="file2.js"></script>
<!-- Everything in global scope, order matters -->
```

#### 2. **CommonJS (2009 - Node.js)**
```javascript
// math.js
module.exports = { add: (a, b) => a + b };

// app.js
const math = require('./math');
math.add(2, 3);
```

**Characteristics:**
- Synchronous loading (works in Node.js)
- Dynamic: `require()` can be in conditionals
- File extension: `.js`
- Used by: Node.js, older bundlers

#### 3. **ES Modules / ESM (2015 - Standard)**
```javascript
// math.js
export const add = (a, b) => a + b;

// app.js
import { add } from './math';
add(2, 3);
```

**Characteristics:**
- Static imports (analyzed at build time)
- Asynchronous loading (works in browsers)
- File extension: `.mjs` (or `.js` with `"type": "module"`)
- Used by: Modern browsers, Node.js 12+, Vite, modern bundlers

### Why Your Package Needs Both

Different tools expect different formats:

```
Your Package
├── dist/index.js       (CommonJS - for Node.js, Webpack 4, older tools)
├── dist/index.mjs      (ESM - for Vite, modern bundlers, browsers)
└── dist/index.d.ts     (TypeScript types - for IDE autocomplete)
```

**Example usage:**

```javascript
// User with Webpack 4 (old)
const { BorderBeam } = require('@stianlarsen/border-beam'); // Uses .js

// User with Vite (modern)
import { BorderBeam } from '@stianlarsen/border-beam'; // Uses .mjs

// User with TypeScript
import { BorderBeam } from '@stianlarsen/border-beam'; // Uses .d.ts for types
```

### The CSS Problem Revisited

```javascript
// ❌ THIS DOESN'T WORK IN LIBRARIES
import "./styles.css";

// ✅ THIS WORKS IN APPLICATIONS
// Because webpack/vite transforms it to:
require.ensure(["./styles.css"], function(require) {
  // Bundler injects CSS into page
});
```

**Why libraries can't do this:**
1. Libraries ship **compiled code**, not source code
2. Compiled JavaScript can't import CSS (not a JavaScript feature)
3. Each user's bundler is different (Webpack, Vite, Turbopack, etc.)
4. You must let the **user** import CSS in **their** bundler

---

## Complete Guide: Building a React Package From Scratch

Let's build a complete package step-by-step.

### Step 1: Project Initialization

```bash
mkdir my-react-component
cd my-react-component
npm init -y
git init
```

### Step 2: Project Structure

Create this structure:

```
my-react-component/
├── src/
│   ├── components/
│   │   └── MyButton/
│   │       ├── MyButton.tsx
│   │       ├── MyButton.types.ts
│   │       └── index.ts
│   ├── styles/
│   │   └── button.css
│   └── index.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── .gitignore
├── .npmignore
└── README.md
```

### Step 3: Install Dependencies

```bash
# Peer dependencies (users must install these)
# Don't install React - only declare as peer dependency

# Dev dependencies (for building)
npm install -D typescript tsup @types/react @types/react-dom
npm install -D react react-dom  # For local development only

# Production dependencies (shipped with package)
# Only add if you need runtime libraries (e.g., framer-motion, classnames)
```

### Step 4: Configure TypeScript

**tsconfig.json:**
```json
{
  "compilerOptions": {
    // Target modern JavaScript
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],

    // Module resolution for libraries
    "moduleResolution": "bundler",

    // JSX configuration
    "jsx": "react-jsx",  // Modern JSX transform (React 17+)

    // Type generation
    "declaration": true,
    "declarationMap": true,

    // Strict mode (catches more bugs)
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    // Compatibility
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,

    // Performance
    "skipLibCheck": true,

    // Don't emit - tsup handles building
    "noEmit": true,

    // Path aliases (optional)
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Why these settings:**
- `"noEmit": true` - tsup builds, tsc only type-checks
- `"jsx": "react-jsx"` - More efficient than `"react"` (no React import needed)
- `"moduleResolution": "bundler"` - Modern resolution for tools like Vite
- `"strict": true` - Catch type errors early

### Step 5: Configure tsup (Build Tool)

**tsup.config.ts:**
```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  // Entry point
  entry: ["src/index.ts"],

  // Output both ESM and CommonJS
  format: ["esm", "cjs"],

  // Generate TypeScript declarations
  dts: true,

  // Source maps for debugging
  sourcemap: true,

  // Clean dist before build
  clean: true,

  // Don't bundle peer dependencies
  external: ["react", "react-dom"],

  // Code splitting (set false for libraries)
  splitting: false,

  // Tree shaking
  treeshake: true,

  // Minification (false for readable output, true for production)
  minify: false,

  // Target environment
  target: "es2020",

  // Copy CSS files after build
  onSuccess: "shx mkdir -p dist/styles && shx cp src/styles/*.css dist/styles/",
});
```

### Step 6: Configure package.json

```json
{
  "name": "@yourscope/my-react-component",
  "version": "1.0.0",
  "description": "A reusable React component",
  "author": "Your Name <your@email.com>",
  "license": "MIT",

  // Entry points
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",

  // Modern exports (CRITICAL!)
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "./styles": "./dist/styles/button.css"
  },

  // Tree-shaking flag
  "sideEffects": false,

  // Files to publish
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],

  // Scripts
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build"
  },

  // Peer dependencies (user must install)
  "peerDependencies": {
    "react": ">=18.0.0 <20.0.0",
    "react-dom": ">=18.0.0 <20.0.0"
  },

  // Dev dependencies (not published)
  "devDependencies": {
    "@types/react": "^18.2.0 || ^19.0.0",
    "@types/react-dom": "^18.2.0 || ^19.0.0",
    "react": "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0",
    "shx": "^0.3.4",
    "tsup": "^8.0.0",
    "typescript": "^5.5.4"
  }
}
```

**Critical fields explained:**

- `"main"` - CommonJS entry (Node.js, Webpack 4)
- `"module"` - ESM entry (modern bundlers)
- `"types"` - TypeScript definitions
- `"exports"` - Modern conditional exports (replaces main/module in newer tools)
- `"sideEffects": false` - Tells bundlers your code has no side effects (enables tree-shaking)

### Step 7: Write Your Component

**src/components/MyButton/MyButton.types.ts:**
```typescript
export interface MyButtonProps {
  /**
   * Button label text
   */
  children: React.ReactNode;

  /**
   * Visual style variant
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "outline";

  /**
   * Size of the button
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

**src/components/MyButton/MyButton.tsx:**
```tsx
"use client";  // For Next.js App Router compatibility

import React from "react";
import { MyButtonProps } from "./MyButton.types";

export const MyButton: React.FC<MyButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  className = "",
}) => {
  const baseClass = "my-button";
  const variantClass = `my-button--${variant}`;
  const sizeClass = `my-button--${size}`;

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};
```

**src/components/MyButton/index.ts:** (Barrel export)
```typescript
export { MyButton } from "./MyButton";
export type { MyButtonProps } from "./MyButton.types";
```

**src/index.ts:** (Main entry point)
```typescript
// Components
export { MyButton } from "./components/MyButton";

// Types
export type { MyButtonProps } from "./components/MyButton";
```

### Step 8: CSS Handling (IMPORTANT!)

**src/styles/button.css:**
```css
.my-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.my-button--primary {
  background-color: #0070f3;
  color: white;
}

.my-button--secondary {
  background-color: #666;
  color: white;
}

.my-button--outline {
  background-color: transparent;
  border: 2px solid #0070f3;
  color: #0070f3;
}

.my-button--small {
  padding: 6px 12px;
  font-size: 14px;
}

.my-button--medium {
  padding: 10px 20px;
  font-size: 16px;
}

.my-button--large {
  padding: 14px 28px;
  font-size: 18px;
}

.my-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.my-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**DO NOT import CSS in your component!** Users will import it separately.

### Step 9: Git and NPM Ignore Files

**.gitignore:**
```
# Dependencies
node_modules/

# Build output
dist/

# Logs
*.log

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Misc
*.tsbuildinfo
```

**.npmignore:**
```
# Source files
src/

# Config files
tsconfig.json
tsup.config.ts
.gitignore

# Development
node_modules/
.vscode/
.idea/

# Tests
**/*.test.ts
**/*.test.tsx
**/*.spec.ts
**/*.spec.tsx

# Misc
*.log
.DS_Store
```

### Step 10: Create README.md

```markdown
# @yourscope/my-react-component

A reusable React button component.

## Installation

\`\`\`bash
npm install @yourscope/my-react-component
\`\`\`

## Usage

\`\`\`tsx
import { MyButton } from "@yourscope/my-react-component";
import "@yourscope/my-react-component/styles";  // Import CSS separately!

function App() {
  return (
    <MyButton variant="primary" size="medium" onClick={() => alert("Clicked!")}>
      Click Me
    </MyButton>
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Button content |
| `variant` | `"primary" \| "secondary" \| "outline"` | `"primary"` | Visual style |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Button size |
| `onClick` | `() => void` | - | Click handler |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | `""` | Additional classes |

## License

MIT
\`\`\`

### Step 11: Build and Test Locally

```bash
# Build the package
npm run build

# Check output
ls -la dist/

# Should see:
# dist/
#   index.js         (CommonJS)
#   index.mjs        (ESM)
#   index.d.ts       (TypeScript types CJS)
#   index.d.mts      (TypeScript types ESM)
#   styles/
#     button.css
```

**Test locally with npm link:**

```bash
# In your package directory
npm link

# In a test Next.js/React app
npm link @yourscope/my-react-component

# Use it
import { MyButton } from "@yourscope/my-react-component";
import "@yourscope/my-react-component/styles";
```

### Step 12: Publish to NPM

```bash
# Login to NPM
npm login

# Check what will be published
npm pack --dry-run

# Publish
npm publish --access public  # For scoped packages
```

---

## Advanced Topics

### Adding "use client" Directive for Next.js

Next.js App Router requires client components to have `"use client"` at the top.

**Option 1: Add to source file** (simplest)
```tsx
"use client";

import React from "react";
// ... rest of component
```

**Option 2: Post-build script** (if tsup strips it)

Create `scripts/add-use-client.js`:
```javascript
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const files = ["dist/index.js", "dist/index.mjs"];

files.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    if (!content.startsWith('"use client";')) {
      fs.writeFileSync(filePath, `"use client";\n${content}`);
      console.log(`✓ Added "use client" to ${file}`);
    }
  }
});
```

Update `tsup.config.ts`:
```typescript
export default defineConfig({
  // ... other config
  onSuccess: "node scripts/add-use-client.js",
});
```

### Handling Multiple Components

**src/index.ts:**
```typescript
export { Button } from "./components/Button";
export { Card } from "./components/Card";
export { Modal } from "./components/Modal";

export type { ButtonProps } from "./components/Button";
export type { CardProps } from "./components/Card";
export type { ModalProps } from "./components/Modal";
```

**package.json exports:**
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./Button": {
      "import": "./dist/components/Button.mjs",
      "require": "./dist/components/Button.js",
      "types": "./dist/components/Button.d.ts"
    },
    "./styles": "./dist/styles/index.css"
  }
}
```

### CSS-in-JS Alternative (No CSS Import Needed!)

If you want to avoid CSS import issues entirely, use inline styles or CSS-in-JS:

```tsx
import React from "react";

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  } as React.CSSProperties,
};

export const MyButton: React.FC<Props> = ({ children }) => {
  return <button style={styles.button}>{children}</button>;
};
```

**Pros:**
- No CSS file imports needed
- No separate stylesheet to load
- Type-safe styles

**Cons:**
- Limited CSS features (no pseudo-classes like `:hover`)
- Less performant for complex styles
- Harder to override for users

### Using CSS Modules

**MyButton.module.css:**
```css
.button {
  padding: 10px 20px;
}
```

**MyButton.tsx:**
```tsx
import styles from "./MyButton.module.css";

export const MyButton = () => <button className={styles.button}>Click</button>;
```

**tsup.config.ts:**
```typescript
export default defineConfig({
  // ... other config
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      ".module.css": "local-css",
    };
  },
});
```

This requires additional setup and may not work in all consumers' environments.

---

## Common Pitfalls and How to Avoid Them

### Pitfall 1: Importing CSS in Component Files

❌ **Wrong:**
```tsx
import "./styles.css";
import React from "react";
```

✅ **Correct:**
```tsx
// Component file - NO CSS import
import React from "react";

// User's app file
import { MyComponent } from "my-package";
import "my-package/styles";  // User imports CSS
```

### Pitfall 2: Bundling React

❌ **Wrong package.json:**
```json
{
  "dependencies": {
    "react": "^18.0.0"  // DON'T DO THIS!
  }
}
```

✅ **Correct:**
```json
{
  "peerDependencies": {
    "react": ">=18.0.0 <20.0.0"
  },
  "devDependencies": {
    "react": "^18.0.0"  // Only for development
  }
}
```

**Why:** Bundling React causes "Invalid Hook Call" errors.

### Pitfall 3: Not Externalizing Dependencies

❌ **Wrong tsup config:**
```typescript
export default defineConfig({
  // No external field - bundles everything!
});
```

✅ **Correct:**
```typescript
export default defineConfig({
  external: ["react", "react-dom"],
});
```

### Pitfall 4: Publishing Source Files

❌ **Wrong .npmignore:**
```
# Empty or missing .npmignore
```

✅ **Correct:**
```
src/
tsconfig.json
tsup.config.ts
```

**Or use package.json:**
```json
{
  "files": ["dist"]  // Only publish dist/
}
```

### Pitfall 5: Missing prepublishOnly Script

❌ **Wrong:**
```json
{
  "scripts": {
    "build": "tsup"
  }
}
```

You might forget to build before publishing!

✅ **Correct:**
```json
{
  "scripts": {
    "build": "tsup",
    "prepublishOnly": "npm run build"
  }
}
```

### Pitfall 6: Incorrect Module Fields

❌ **Wrong:**
```json
{
  "main": "./dist/index.mjs"  // Should be .js for CommonJS!
}
```

✅ **Correct:**
```json
{
  "main": "./dist/index.js",     // CommonJS
  "module": "./dist/index.mjs",  // ESM
}
```

### Pitfall 7: Not Testing Locally

Always test with `npm link` or `npm pack` before publishing:

```bash
# Option 1: npm link
npm link
cd ../test-app
npm link your-package

# Option 2: npm pack
npm pack  # Creates tarball
cd ../test-app
npm install ../your-package/your-package-1.0.0.tgz
```

### Pitfall 8: Forgetting sideEffects Field

Without `"sideEffects": false`, bundlers can't tree-shake your package:

```json
{
  "sideEffects": false  // Enables tree-shaking
}
```

If you have files with side effects (like global CSS):
```json
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

---

## Publishing Checklist

Before running `npm publish`, verify:

- [ ] `npm run build` completes successfully
- [ ] `dist/` contains all expected files
- [ ] `npm pack --dry-run` shows only necessary files
- [ ] Tested locally with `npm link` or `npm pack`
- [ ] README.md has installation and usage instructions
- [ ] LICENSE file exists
- [ ] Version number is correct in package.json
- [ ] Git commits are pushed
- [ ] No sensitive data in package (API keys, etc.)
- [ ] `prepublishOnly` script runs build
- [ ] TypeScript types are generated (`.d.ts` files)
- [ ] Both ESM and CommonJS outputs exist
- [ ] `"use client"` directive added (if needed)
- [ ] peerDependencies are correct
- [ ] No dependencies that should be peerDependencies

---

## Key Takeaways

### The Golden Rules

1. **Never import CSS in library component files** - Let users import it
2. **Always externalize React** - Use peerDependencies
3. **Build both ESM and CommonJS** - Support all tools
4. **Test locally before publishing** - Use npm link/pack
5. **Use a bundler (tsup)** - Don't use plain tsc
6. **Add "use client" for Next.js** - RSC compatibility
7. **Enable tree-shaking** - Set `"sideEffects": false`
8. **Include TypeScript types** - Generate `.d.ts` files
9. **Document CSS imports** - Tell users how to import styles
10. **Version carefully** - Follow semver

### Understanding the Build Pipeline

```
Source Code (TypeScript + CSS)
        ↓
[tsup with TypeScript]
        ↓
Compiled Code (JavaScript + Types)
        ├─ index.js (CommonJS)
        ├─ index.mjs (ESM)
        ├─ index.d.ts (Types for CJS)
        └─ index.d.mts (Types for ESM)

CSS Files (copied separately)
        └─ styles/button.css

        ↓
Published to NPM
        ↓
User's Project
        ↓
User's Bundler (Webpack/Vite/Turbopack)
        ↓
Final Application
```

### Why This All Matters

- **Users have different build tools** - Your package must work with all of them
- **JavaScript can't import CSS** - Only bundlers can handle that
- **Module systems evolved** - Support both CommonJS and ESM
- **React must be external** - Avoid duplicate React instances
- **Type safety matters** - Ship TypeScript definitions
- **Performance matters** - Enable tree-shaking with proper configuration

---

## Conclusion

Your original package failed because you treated library code like application code. The fundamental difference is:

**Application code**: Processed by your bundler before running
**Library code**: Pre-compiled and used by other people's bundlers

By understanding this distinction and following the patterns in this guide, you can build professional, production-ready React packages that work seamlessly across all modern JavaScript tools.

Now go build something amazing! 🚀

---

## Further Reading

- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [tsup Documentation](https://tsup.egoist.dev/)
- [NPM package.json Documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [React Server Components](https://react.dev/reference/react/use-client)
- [Semantic Versioning](https://semver.org/)
