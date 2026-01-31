import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content server-side (works in both Node.js and browser).
 * Uses isomorphic-dompurify which bundles jsdom for server environments.
 * Use this in Server Components; use sanitizeHtml from ./sanitize for Client Components.
 */
export function sanitizeHtmlServer(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p", "br", "b", "i", "em", "strong", "u", "s", "strike",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "pre", "code",
      "a", "img", "video", "source", "iframe",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "span", "hr", "figure", "figcaption",
      "sup", "sub", "mark", "small",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "class", "style", "target", "rel",
      "width", "height", "id", "name", "type", "controls", "autoplay",
      "frameborder", "allowfullscreen", "allow", "loading",
      "colspan", "rowspan", "align", "valign",
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"],
  });
}
