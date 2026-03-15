/**
 * Simple markdown-to-HTML renderer for basic blog post formatting.
 * Handles headings, bold, italic, links, lists, code, blockquotes, and HR.
 */
export function renderMarkdown(content: string): string {
  let html = content
    // Code blocks
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre><code class="lang-$1">$2</code></pre>'
    )
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Headings
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold & Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr/>")
    // Paragraphs
    .replace(/\n\n/g, "</p><p>")
    // Line breaks
    .replace(/\n/g, "<br/>");

  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/g, "").replace(/<p><br\/><\/p>/g, "");

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li>.*?<\/li>(?:<br\/>)?)+/g,
    (match) => `<ul>${match.replace(/<br\/>/g, "")}</ul>`
  );

  return html;
}

/**
 * Extract headings from markdown content for table of contents.
 */
export function extractHeadings(
  content: string
): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /^(#{2,4}) (.+)$/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const hashes = match[1];
    const text = match[2];
    if (!hashes || !text) continue;
    const level = hashes.length;
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ level, text, id });
  }

  return headings;
}

/**
 * CSS styles for rendered markdown content.
 */
export const PROSE_STYLES = `
  .prose-custom { line-height: 1.75; font-size: 1rem; }
  .prose-custom h1, .prose-custom h2, .prose-custom h3, .prose-custom h4 {
    font-family: var(--brand-font-heading);
    color: var(--brand-text);
    margin-top: 2em;
    margin-bottom: 0.5em;
    letter-spacing: -0.025em;
  }
  .prose-custom h2 { font-size: 1.5rem; font-weight: 700; }
  .prose-custom h3 { font-size: 1.25rem; font-weight: 600; }
  .prose-custom h4 { font-size: 1.125rem; font-weight: 600; }
  .prose-custom p { margin-bottom: 1em; color: var(--brand-text); }
  .prose-custom a { color: var(--brand-link-color); text-decoration: underline; }
  .prose-custom strong { font-weight: 600; }
  .prose-custom ul, .prose-custom ol { padding-left: 1.5em; margin-bottom: 1em; }
  .prose-custom li { margin-bottom: 0.25em; color: var(--brand-text); }
  .prose-custom blockquote {
    border-left: 3px solid var(--brand-link-color);
    padding-left: 1em;
    margin: 1em 0;
    font-style: italic;
    color: var(--brand-muted);
  }
  .prose-custom code {
    background: var(--brand-border);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.875em;
  }
  .prose-custom pre {
    background: var(--brand-surface);
    border: 1px solid var(--brand-border);
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1em 0;
  }
  .prose-custom pre code { background: none; padding: 0; }
  .prose-custom hr {
    border: none;
    border-top: 1px solid var(--brand-border);
    margin: 2em 0;
  }
`;
