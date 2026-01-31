import DOMPurify from "dompurify";

const SANITIZE_CONFIG = {
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
};

/**
 * Sanitize HTML content to prevent XSS attacks (client-side only).
 * Allows safe HTML tags for rich content while stripping dangerous elements.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") return dirty;
  return DOMPurify.sanitize(dirty, SANITIZE_CONFIG);
}
