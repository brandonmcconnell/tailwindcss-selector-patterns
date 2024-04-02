"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = __importDefault(require("tailwindcss/plugin"));
exports.default = (0, plugin_1.default)(({ matchVariant }) => {
    matchVariant("pattern", (pattern_selector) => {
        const [pattern, selector = "*", extraneous] = pattern_selector
            .split(";")
            .map((str) => str.trim());
        const optionalSelector = selector === "*" ? "" : selector;
        if (extraneous)
            throw new Error(`Found more than 2 semicolon-delimited (;) arguments in Tailwind CSS selector pattern '${pattern_selector}'`);
        const combinator = pattern[0];
        const validCombinatorSymbols = ["+", "-", "%", ">", "<", "^"];
        if (!validCombinatorSymbols.includes(combinator))
            throw new Error(`Combinator used '${combinator}' in Tailwind CSS selector pattern '${pattern_selector}' is not one of the valid combinators: ${validCombinatorSymbols.join(", ")}`);
        const isDoubleCombinator = pattern[1] === combinator;
        if (!isDoubleCombinator && validCombinatorSymbols.includes(pattern[1]))
            throw new Error(`Second character in Tailwind CSS selector pattern '${pattern_selector}' ('${pattern[1]}') is a valid combinator but does not match the first combinator used ('${combinator}')`);
        const nthIndex_dir = isDoubleCombinator
            ? pattern.slice(2)
            : pattern.slice(1);
        if (isDoubleCombinator && nthIndex_dir)
            throw new Error(`Double combinator '${combinator.repeat(2)}' in Tailwind CSS selector pattern '${pattern_selector}' can only be followed by an optional selector argument, delimited by a semicolon; instead found '${nthIndex_dir}'`);
        const validDirSymbols = ["<", ">"];
        const hasDir = !isDoubleCombinator && validDirSymbols.includes(nthIndex_dir.slice(-1));
        const [_nthIndex = "1", dir] = !isDoubleCombinator
            ? hasDir
                ? [nthIndex_dir.slice(0, -1), nthIndex_dir.slice(-1)]
                : nthIndex_dir
                    ? [nthIndex_dir]
                    : []
            : [];
        const nthIndex = Number(_nthIndex);
        console.log({
            pattern,
            hasDir,
            _nthIndex,
            dir,
            nthIndex,
        });
        if (!Number.isFinite(nthIndex))
            throw new Error(`Invalid nth-index value '${_nthIndex}' in Tailwind CSS selector pattern '${pattern_selector}'`);
        if (!(nthIndex > 0))
            throw new Error(`nth-index value '${nthIndex}' in Tailwind CSS selector pattern '${pattern_selector}' must be greater than 0`);
        let result = "";
        if (combinator === "+" || combinator === "%") {
            if (isDoubleCombinator) {
                result += `& ~ ${selector}`;
            }
            else if (!dir) {
                result += `& + ${"* + ".repeat(nthIndex - 1)}${selector}`;
            }
            else if (dir === "<") {
                result += [...Array(nthIndex)]
                    .map((_, i) => `& + ${"* + ".repeat(i)}${selector}`)
                    .join(", ");
            }
            else if (dir === ">") {
                result += `& ${"+ * ".repeat(nthIndex - 1)}~ ${selector}`;
            }
        }
        if (combinator === "%")
            result += `, `;
        if (combinator === "-" || combinator === "%") {
            if (isDoubleCombinator) {
                result += `${optionalSelector}:has(~ &)`;
            }
            else if (!dir) {
                result += `${optionalSelector}:has(${"+ * ".repeat(nthIndex - 1)}+ &)`;
            }
            else if (dir === "<") {
                result += `${optionalSelector}:has(${[...Array(nthIndex)]
                    .map((_, i) => `+ ${"* + ".repeat(i)}&`)
                    .join(", ")})`;
            }
            else if (dir === ">") {
                result += `${optionalSelector}:has(~${" * +".repeat(nthIndex - 1)} &)`;
            }
        }
        if (combinator === ">" || combinator === "^") {
            if (isDoubleCombinator) {
                result += `& ${selector}`;
            }
            else if (!dir) {
                result += `& ${"> * ".repeat(nthIndex - 1)}> ${selector}`;
            }
            else if (dir === "<") {
                result += [...Array(nthIndex)]
                    .map((_, i) => `& > ${"* > ".repeat(i)}${selector}`)
                    .join(", ");
            }
            else if (dir === ">") {
                result += `& ${"> * ".repeat(nthIndex - 1)}${selector}`;
            }
        }
        if (combinator === "^")
            result += `, `;
        if (combinator === "<" || combinator === "^") {
            if (isDoubleCombinator) {
                result += `${optionalSelector}:has(&)`;
            }
            else if (!dir) {
                result += `${optionalSelector}:has(${"> * ".repeat(nthIndex - 1)}> &)`;
            }
            else if (dir === "<") {
                result += `${optionalSelector}:has(${[...Array(nthIndex)]
                    .map((_, i) => `${"> * ".repeat(i)}> &`)
                    .join(", ")})`;
            }
            else if (dir === ">") {
                result += `${optionalSelector}:has(${"* > ".repeat(nthIndex - 1)}&)`;
            }
        }
        return `:is(${result})`;
    });
});
