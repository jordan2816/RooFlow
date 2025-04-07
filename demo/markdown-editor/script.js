document.addEventListener("DOMContentLoaded", () => {
  const editorTextArea = document.getElementById("editor");
  const previewElement = document.getElementById("preview");
  const wordCountElement = document.getElementById("word-count");
  const charCountElement = document.getElementById("char-count");

  // --- Initialize CodeMirror ---
  const editor = CodeMirror.fromTextArea(editorTextArea, {
    mode: "markdown",
    lineNumbers: true,
    theme: "default", // Match the CSS theme linked
    lineWrapping: true,
  });

  // --- Load Initial Content ---
  const initialContent =
    localStorage.getItem("markdownContent") ||
    "# Welcome to Markdown Editor\n\nStart typing!";
  editor.setValue(initialContent);

  // --- Update Preview Function ---
  function updatePreview() {
    const content = editor.getValue();
    // WARNING: Direct HTML insertion from user content can be unsafe.
    // In a real app, sanitize this output before rendering.
    previewElement.innerHTML = marked.parse(content);
    updateCounts(content);
    localStorage.setItem("markdownContent", content);
  }

  // --- Update Word/Character Count Function ---
  function updateCounts(text) {
    const words = text.match(/\b\w+\b/g) || [];
    const chars = text.length;
    wordCountElement.textContent = `Words: ${words.length}`;
    charCountElement.textContent = `Characters: ${chars}`;
  }

  // --- Event Listener for Editor Changes ---
  editor.on("change", () => {
    updatePreview();
  });

  // --- Initial Update ---
  updatePreview(); // Run once on load

  // --- Toolbar Button Listeners (Placeholders) ---
  document.getElementById("bold-btn").addEventListener("click", () => {
    const selection = editor.getSelection();
    editor.replaceSelection(`**${selection || "bold text"}**`);
    editor.focus(); // Keep focus on the editor
  });
  document.getElementById("italic-btn").addEventListener("click", () => {
    const selection = editor.getSelection();
    editor.replaceSelection(`*${selection || "italic text"}*`);
    editor.focus();
  });
  document.getElementById("link-btn").addEventListener("click", () => {
    const selection = editor.getSelection();
    const url = prompt("Enter link URL:", "http://");
    if (url) {
      // Proceed only if user entered a URL
      editor.replaceSelection(`[${selection || "link text"}](${url})`);
      editor.focus();
    }
  });
  document.getElementById("image-btn").addEventListener("click", () => {
    const selection = editor.getSelection(); // Use selection as alt text if available
    const url = prompt("Enter image URL:", "http://");
    if (url) {
      editor.replaceSelection(`![${selection || "alt text"}](${url})`);
      editor.focus();
    }
  });
  document.getElementById("code-btn").addEventListener("click", () => {
    const selection = editor.getSelection();
    // Wrap selection in triple backticks, adding newlines for clarity
    editor.replaceSelection(`\`\`\`\n${selection || "code block"}\n\`\`\``);
    editor.focus();
  });
  document.getElementById("ul-btn").addEventListener("click", () => {
    const selection = editor.getSelection();
    if (selection) {
      // Prepend '- ' to each selected line
      const lines = selection.split("\n");
      const newList = lines.map((line) => `- ${line}`).join("\n");
      editor.replaceSelection(newList);
    } else {
      editor.replaceSelection("- List item");
    }
    editor.focus();
  });
  document.getElementById("ol-btn").addEventListener("click", () => {
    const selection = editor.getSelection();
    if (selection) {
      // Prepend '1. ' to each selected line (simple numbering)
      const lines = selection.split("\n");
      // Note: This simple version doesn't renumber existing lists.
      const newList = lines
        .map((line, index) => `${index + 1}. ${line}`)
        .join("\n");
      editor.replaceSelection(newList);
    } else {
      editor.replaceSelection("1. List item");
    }
    editor.focus();
  });

  // --- Helper function for downloading files ---
  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // Required for Firefox
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
  }

  // --- Save Button Listeners ---
  document.getElementById("save-html-btn").addEventListener("click", () => {
    const content = editor.getValue();
    const htmlContent = marked.parse(content);
    // Basic HTML structure for the saved file
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Markdown Export</title></head><body>${htmlContent}</body></html>`;
    downloadFile("markdown_export.html", fullHtml, "text/html");
  });

  document.getElementById("save-text-btn").addEventListener("click", () => {
    const content = editor.getValue();
    downloadFile("markdown_export.md", content, "text/plain");
  });
});
