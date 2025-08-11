# TM Pull Quote Format Plugin

A WordPress inline formatting tool for creating pull quotes using a custom web component. Works like **bold** or _italic_ formatting - just highlight text and click the pull quote button.

Note, this version of the plugin was develped for use on https://tampamonitor.com, thus the `theme-integration.css` for that site's colors. It may evolve into more as time permits. YMMV

## Features

- 🖱️ **Inline Formatting**: Highlight text and click the pull quote button in the rich text toolbar
- ⌨️ **Keyboard Shortcut**: `Ctrl/Cmd + Q` for quick formatting
- 📱 **Responsive**: Auto-adjusts layout on mobile devices
- 🎨 **Theme Integration**: Automatically uses your theme's colors and typography
- ⚡ **Lightweight**: Only loads when pull quotes are actually used
- **Efficient Loading**: Component only loads when pull quotes are present
- **Clean HTML Output**: Simple `<pull-quote>` tags inline with content

## Installation

1. Upload the `tm-pullquote` folder to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Start using it in the block editor by highlighting text and clicking the pull quote button

## Usage

1. **In any paragraph, heading, or list block:**

   - Select/highlight text you want to emphasize
   - Click the pull quote button in the formatting toolbar (next to Bold, Italic, etc.)
   - Or use the keyboard shortcut: Ctrl+Q (Cmd+Q on Mac)
   - The text becomes an inline pull quote

2. **Alignment options:**

   - **Single Button Cycling**: Click the pull quote button repeatedly to cycle through alignments:
     1. **First click**: Left alignment (default) - floats left with right border
     2. **Second click**: Center alignment - centered with top/bottom borders
     3. **Third click**: Right alignment - floats right with left border
     4. **Fourth click**: Removes pull quote formatting
   - **Button shows next action**: The button title indicates what the next click will do
   - **HTML output examples:**
     - `<pull-quote>Left aligned</pull-quote>`
     - `<pull-quote align="center">Center aligned</pull-quote>`
     - `<pull-quote align="right">Right aligned</pull-quote>`

3. **The result:** Clean, semantic HTML integrated naturally in your content.

## Theme Integration

### Monitor Twenty-Five Theme

This plugin is specifically configured for the Monitor Twenty-Five theme and automatically uses:

- **Colors**: Theme accent colors (#E6B45E, #E6A4A1, #1D636B)
- **Typography**: Libre Franklin font family from your theme
- **Layout**: Responsive design that works with the theme's content width

The theme integration CSS (`assets/theme-integration.css`) uses CSS custom properties to style the web component with your theme's colors and fonts.

### Custom Theme Integration

To integrate with other themes, modify `/assets/theme-integration.css`:

```css
:root {
  /* Update these custom properties to match your theme */
  --pullquote-border-right: 4px solid #your-accent-color;
  --pullquote-color: #your-text-color;
  --pullquote-left-bg: #your-background-color;
}

pull-quote {
  font-family: var(--wp--preset--font-family--your-font);
}
```

## Web Component

This format uses the [pull-quote web component](https://github.com/miklb/pull-quote) for rendering pull quotes. The component provides:

- **Accessibility by default**: Text is read only once by screen readers
- **Shadow DOM encapsulation**: Styles won't conflict with your CSS
- **CSS `:host` selectors**: Clean attribute-based styling without JavaScript
- **Modern browser support**: Uses native web standards (94%+ coverage)
- **Framework agnostic**: Works with any JavaScript framework or vanilla HTML

### Latest Updates (v2.0)

- **`:host` selectors**: Now uses modern CSS host selectors for cleaner styling
- **Shadow DOM**: Open shadow root for better debugging and accessibility
- **Slot-based content**: Preserves original content for SEO and screen readers
- **Center alignment**: Added support for centered pull quotes
- Cross-browser compatibility

## Why Inline Format vs Block?

**Inline Format (this approach):**

- ✅ Natural workflow like bold/italic
- ✅ Works within any block (paragraphs, headings, lists)
- ✅ Keeps content in normal flow
- ✅ More efficient - only loads when needed
- ✅ Clean, simple HTML output

**Block Approach (alternative):**

- ❌ Requires separate block insertion
- ❌ Interrupts writing flow
- ❌ Less intuitive for content creators
- ❌ More complex HTML structure

## File Structure

```
tm-pullquote/
├── tm-pullquote.php           # Main plugin file
├── README.md                  # This file
└── assets/
    ├── format.js              # Block editor integration
    ├── format.css             # Editor styling
    ├── pull-quote.js          # Web component definition
    └── theme-integration.css  # Frontend theme styling
```

## Customization

### CSS Custom Properties

The web component responds to these CSS custom properties (applied directly to `pull-quote` elements):

```css
/* Default (Left) Alignment */
pull-quote {
  --pullquote-inline-size: 25%;
  --pullquote-font-size: 1.5em;
  --pullquote-margin-block-start: 0;
  --pullquote-margin-block-end: 1.5em;
  --pullquote-margin-inline-start: 0;
  --pullquote-margin-inline-end: 1.5em;
  --pullquote-padding-block: 1em;
  --pullquote-padding-inline: 1.25em;
  --pullquote-float: left;
  --pullquote-border-inline-end: 4px solid #666;
  --pullquote-color: #666;
  --pullquote-background: #f9f9f9;
  --pullquote-clear: none;
}

/* Right Alignment */
pull-quote[right] {
  --pullquote-right-border-inline-start: 4px solid #e74c3c;
  --pullquote-right-margin-inline-start: 1.5em;
  --pullquote-right-margin-inline-end: 0;
  --pullquote-right-color: #fff;
  --pullquote-right-background: #e74c3c;
}

/* Center Alignment */
pull-quote[center] {
  --pullquote-center-margin-inline: auto;
  --pullquote-center-margin-block-start: 2em;
  --pullquote-center-margin-block-end: 2em;
  --pullquote-center-text-align: center;
  --pullquote-center-border-block-start: 3px solid #3498db;
  --pullquote-center-border-block-end: 3px solid #3498db;
  --pullquote-center-color: #2c3e50;
  --pullquote-center-background: #ecf0f1;
  --pullquote-center-font-style: italic;
  --pullquote-center-inline-size: min(90%, 40em);
}
```

### Responsive Breakpoints

- **Mobile** (≤768px): Full width, no floating
- **Desktop** (≥960px): Larger size and enhanced positioning

## Technical Details

### WordPress Integration

- **Inline Format Registration**: Uses `wp.richText.registerFormatType()`
- **KSES Filter**: Allows `<pull-quote>` tags with `align` and `right` attributes
- **Conditional Loading**: Only loads frontend assets when pull quotes are present
- **Module Loading**: Uses ES6 modules for the web component

### Web Component Architecture

- **Shadow DOM**: Open shadow root for style encapsulation and debugging
- **Slot-based content**: Preserves original text for accessibility and SEO
- **CSS `:host` selectors**: Modern attribute-based styling approach
- **ARIA attributes**: Uses `aria-hidden="true"` and `role="presentation"` on decorative elements
- **No dependencies**: Pure vanilla JavaScript implementation

### Browser Support

- **Excellent modern support** (94%+ global coverage):
  - Chrome 54+, Firefox 63+, Safari 10+, Edge 79+
- **Shadow DOM and :host selectors**: Native web standards
- **Progressive enhancement**: Graceful degradation for older browsers

## License

MIT License - see the code header for full details.
