"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderBeam = void 0;
const react_1 = __importDefault(require("react"));
require("./css/borderBeam.css");
const BorderBeam = ({ className, size = 200, duration = 15, anchor = 90, borderWidth = 1.5, colorFrom = "#ffaa40", colorTo = "#9c40ff", delay = 0, }) => {
    return (react_1.default.createElement("div", { style: {
            "--size": `${size}px`,
            "--duration": `${duration}s`,
            "--anchor": `${anchor}%`,
            "--border-width": `${borderWidth}px`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            "--delay": `-${delay}s`,
        }, className: `borderBeam ${className || ""}` }));
};
exports.BorderBeam = BorderBeam;
