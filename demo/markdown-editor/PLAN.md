# Markdown Editor Plan

This document outlines the plan to build the Markdown editor web application.

**1. Project Structure:**

Create the following file structure:

```
RooFlow/
└── demo/
    └── markdown-editor/
        ├── index.html       # Main application page
        ├── style.css        # CSS styles
        ├── script.js        # JavaScript logic
        └── lib/             # Folder for external libraries
            ├── marked.min.js  # Markdown parsing library (Example: Marked.js)
            └── codemirror/    # Syntax highlighting library (Example: CodeMirror)
                ├── lib/
                │   └── codemirror.js
                ├── mode/
                │   └── markdown/
                │       └── markdown.js
                ├── theme/
                │   └── default.css  # Or another theme
                └── lib/codemirror.css
```

_(Note: Obtain library files for Marked.js and CodeMirror, either by download or CDN link initially)_

**2. HTML (`index.html`):**

- Basic HTML5 structure linking `style.css` and CodeMirror's CSS.
- Main container using Flexbox/Grid for split layout.
- **Toolbar:** `div` with buttons (`<button>`) for Bold, Italic, Link, Image, Code Block, Unordered List, Ordered List.
- **Editor Pane:** `<textarea>` (enhanced by CodeMirror).
- **Preview Pane:** `div` for rendered HTML.
- **Status Bar:** `div` for word/character counts.
- **Save Area:** Buttons "Save as HTML", "Save as Text".
- Script tags for `marked.min.js`, CodeMirror JS, and `script.js`.

**3. CSS (`style.css`):**

- Basic styling resets.
- Layout styles for split-screen (e.g., `display: flex`).
- Styling for toolbar and buttons.
- Styling for preview pane (headings, lists, code blocks, etc.).
- Styling for status bar.
- Responsive rules (`@media` queries) for tablet/desktop.

**4. JavaScript (`script.js`):**

- **Initialization:**
  - Initialize CodeMirror on `<textarea>`.
  - Get DOM element references.
- **Core Logic:**
  - **Live Preview:** On CodeMirror `change`, parse with Marked.js, sanitize, update preview pane `innerHTML`.
  - **Toolbar Actions:** Event listeners for buttons to insert/wrap markdown syntax via CodeMirror API.
  - **Word/Character Count:** On editor `change`, update status bar.
  - **localStorage:** On editor `change` (debounced), save content via `localStorage.setItem`. On load, retrieve via `localStorage.getItem`.
  - **Save Functionality:**
    - _Save as HTML:_ Parse content, create `Blob` (`text/html`), generate download link, simulate click.
    - _Save as Text:_ Get content, create `Blob` (`text/plain`), generate download link, simulate click.
- **Library Integration:** Ensure Marked.js and CodeMirror are loaded.

**5. Component Interaction Diagram:**

```mermaid
graph TD
    subgraph "User Interface (HTML/CSS)"
        UI_Toolbar[Toolbar] --> UI_Editor[Editor (CodeMirror)]
        UI_Editor --> UI_Preview[Preview Pane]
        UI_Editor --> UI_StatusBar[Status Bar]
        UI_SaveButtons[Save Buttons] -- Triggers --> JS_Logic
    end

    subgraph "App Logic (script.js)"
        JS_Logic -- Reads/Writes --> UI_Editor
        JS_Logic -- Updates --> UI_Preview
        JS_Logic -- Updates --> UI_StatusBar
        JS_Logic -- Reads/Writes --> LocalStorage[Browser localStorage]
        JS_Logic -- Uses --> Lib_Marked[Marked.js]
        JS_Logic -- Uses --> Lib_CodeMirror[CodeMirror API]
        JS_Logic -- Creates --> FileDownloads[File Downloads]
    end

    subgraph "External Libraries (lib/)"
        Lib_Marked
        Lib_CodeMirror
    end

    UI_Toolbar -- Triggers --> JS_Logic
    UI_Editor -- Change Events --> JS_Logic
```
