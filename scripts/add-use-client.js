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
