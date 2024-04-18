<h1 align="center">Selector Patterns for Tailwind CSS</h1>

<div align="center">

[![minified size](https://img.shields.io/bundlephobia/min/tailwindcss-selector-patterns)](https://bundlephobia.com/package/tailwindcss-selector-patterns)
[![license](https://img.shields.io/github/license/brandonmcconnell/tailwindcss-selector-patterns?label=license)](https://github.com/brandonmcconnell/tailwindcss-selector-patterns/blob/main/LICENSE)
[![version](https://img.shields.io/npm/v/tailwindcss-selector-patterns)](https://www.npmjs.com/package/tailwindcss-selector-patterns)
[![twitter](https://img.shields.io/twitter/follow/branmcconnell)](https://twitter.com/branmcconnell)

</div>

This Tailwind CSS plugin introduces a custom variant enabling dynamic targeting of elements matching patterns that would otherwise require multiple CSS selectors, in most cases where this plugin would be especially useful. The more complex selectors are generated by the [Tailwind CSS JIT engine](https://tailwindcss.com/blog/just-in-time-the-next-generation-of-tailwind-css) at build time, so using this plugin is only as expensive—in terms of performance—as the selectors a developer uses it to generate.

Some advantages of using this plugin include:
- **Markup size:** Reduces the number of Tailwind CSS utilities required to target specific element(s) based on their relationship(s) to the current element within the DOM tree
- **Simplicity:** Shorthand syntax, making it easy to use, and the intent easy to convey and understand
- **Precision:** Simple to target a sibling N nodes away in a specified direction
- **Bidirectionality:** Match siblings in prev/next direction (or both), or a parent/child N nodes away in either asc/desc direction (or both). Combining this with the precision benefit allows for truly powerful selectors, while still keeping the syntax simple and easy to understand.
- **Single source of truth:** Avoid coupling custom variants to match elements in different directions (e.g. `pattern-[%]:underline` vs. `[&>*]:underline [:has(>&)]:underline`).

The majority of the magic behind this plugin lies in the [Tailwind CSS JIT engine](https://tailwindcss.com/blog/just-in-time-the-next-generation-of-tailwind-css), allowing for the dynamic processing of custom variants, and the the CSS [`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) selector, which can be used in many ways to target elements based on their relationship to the current element, even if the element you are targeting precedes the current element in the DOM tree. No run-time JS is needed.

## Syntax

```
pattern-[{combinator}{nth-index?}{inclusion-direction?}{;selector?}]
```

- `combinator` (required): Specifies the relationship between the selected element and the target element(s). Available combinators are:
  - `+`: Select the next sibling element
  - `++`: Select all next sibling elements
  - `-`: Select the previous sibling element
  - `--`: Select all previous sibling elements
  - `%`: Select the parent element
  - `%%`: Select all ancestor elements
  - `>`: Select direct child elements
  - `>>`: Select all descendant elements
  - `<`: Select direct parent element
  - `<<`: Select all ancestor elements
  - `^`: Select both parent and child elements
  - `^^`: Select both ancestor and descendant elements
- `nth-index` (optional): Specifies the index of the target element(s) relative to the selected element. It starts at 1 and defaults to 1 if omitted. Not valid if used with a "double combinator".
- `inclusion-direction` (optional): Only valid if `nth-index` is specified. Determines the direction of including matching elements.
  - `<`: Includes matching elements from the specified `nth-index` toward the element (inner/closer elements)
  - `>`: Includes matching elements from the specified `nth-index` away from the element (outer/farther elements)
- `selector` (optional): Specifies a selector to match against the target element(s). If not provided, any selector will match.
  
  ⚠️ Keep in mind that you cannot use any spaces characters in your utility, so if your selector requires a space, use an underscore `_` instead, (e.g. `pattern-[+3<;div_a]:underline`).

## Getting started

### Installation

```bash
npm install tailwindcss-selector-patterns
```

### Tailwind CSS Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('tailwindcss-selector-patterns'),
    // ...
  ],
}
```

### Usage

```html
<!-- targeting div descendants of the selected element, starting 3 DOM tree levels deeper than the current element --> 
<div class="pattern-[>3>;div]">
  <div> <!-- ❌ excluded, nth-index is less than 3 -->
    <div> <!-- ❌ excluded, nth-index is less than 3 -->
      <div> <!-- ✅ included, nth-index is at least 3 -->
        <div> <!-- ✅ included, nth-index is at least 3 -->
          <!-- ... -->
        </div>
        <section> <!-- ❌ excluded, not div -->
          <div> <!-- ✅ included, nth-index is at least 3 -->
            <!-- ... -->
          </div>
        </section>
      </div>
    </div>
  </div>
</div>
```

## Examples

Want to try it out for yourself? Take `tailwindcss-selector-patterns` for a spin [on Tailwind Play](https://play.tailwindcss.com/Yx80jD2QX5).

<table>
  <thead>
    <tr>
      <th>Plugin Usage</th>
      <th>Implementation in CSS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>pattern-[+]</code></td>
      <td><code>x + y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[++]</code></td>
      <td><code>x ~ y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[+3]</code></td>
      <td><code>x + * + * + y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[+3<]</code></td>
      <td><code>x + y, x + * + y, x + * + * + y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[+3>]</code></td>
      <td><code>x + * + * ~ y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[-]</code></td>
      <td><code>y:has(+ x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[--]</code></td>
      <td><code>y:has(~ x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[-3]</code></td>
      <td><code>y:has(+ * + * + x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[-3<]</code></td>
      <td><code>y:has(+ x, + * + x, + * + * + x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[-3>]</code></td>
      <td><code>y:has(~ * + * + x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[%]</code></td>
      <td><code>y:has(+ x),</code><br><code>x + y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[%%]</code></td>
      <td><code>y:has(~ x),</code><br><code>x ~ y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[%3]</code></td>
      <td><code>y:has(+ * + * + x),</code><br><code>x + * + * + y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[%3<]</code></td>
      <td><code>y:has(+ x, + * + x, + * + * + x),</code><br><code>x + y, x + * + y, x + * + * + y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[%3>]</code></td>
      <td><code>y:has(~ * + * + x),</code><br><code>x + * + * ~ y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[>]</code></td>
      <td><code>x > y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[>>]</code></td>
      <td><code>x y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[>2]</code></td>
      <td><code>x > * > y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[>2<]</code></td>
      <td><code>x > y, x > * > y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[>2>]</code></td>
      <td><code>x > * y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[<]</code></td>
      <td><code>y:has(> x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[<<]</code></td>
      <td><code>y:has(x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[<2]</code></td>
      <td><code>y:has(> * > x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[<2<]</code></td>
      <td><code>y:has(> x, > * > x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[<2>]</code></td>
      <td><code>y:has(* > x)</code></td>
    </tr>
    <tr>
      <td><code>pattern-[^]</code></td>
      <td><code>y:has(> x),</code><br><code>x > y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[^^]</code></td>
      <td><code>y:has(x),</code><br><code>x y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[^2]</code></td>
      <td><code>y:has(> * > x),</code><br><code>x > * > y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[^2<]</code></td>
      <td><code>y:has(> x, > * > x),</code><br><code>x > y, x > * > y</code></td>
    </tr>
    <tr>
      <td><code>pattern-[^2>]</code></td>
      <td><code>y:has(* > x),</code><br><code>x > * y</code></td>
    </tr>
  </tbody>
</table>

---

I hope you find `tailwindcss-selector-patterns` a valuable addition to your projects. If you have any issues or suggestions, don't hesitate to open an issue or pull request.

If you liked this, you might also like my other Tailwind CSS plugins:
* [tailwindcss-multi](https://github.com/brandonmcconnell/tailwindcss-multi): Group utilities together by variant
* [tailwindcss-signals](https://github.com/brandonmcconnell/tailwindcss-signals): Apply styles based on parent or ancestor state, a variant-first alterative to groups
* [tailwindcss-mixins](https://github.com/brandonmcconnell/tailwindcss-mixins): Construct reusable & aliased sets of utilities inline
* [tailwindcss-selector-patterns](https://github.com/brandonmcconnell/tailwindcss-selector-patterns): Dynamic CSS selector patterns
* [tailwindcss-js](https://github.com/brandonmcconnell/tailwindcss-js): Effortless build-time JS script injection
* [tailwind-lerp-colors](https://github.com/brandonmcconnell/tailwind-lerp-colors): Expand your color horizons and take the fuss out of generating new—or expanding existing—color palettes
* [tailwindcss-directional-shadows](https://github.com/brandonmcconnell/tailwindcss-directional-shadows): Supercharge your shadow utilities with added directional support (includes directional `shadow-border` utilities too ✨)
