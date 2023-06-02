/**
 * @source https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/panels/elements/CSSRuleValidatorHelper.js
 * @license https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/panels/elements/CSSRuleValidatorHelper.js
 */
export const buildPropertyDefinitionText = (property, value) => {
  if (value === void 0) {
    return buildPropertyName(property);
  }
  return '<code class="unbreakable-text"><span class="property">' + property + "</span>: " + value + "</code>";
};
export const buildPropertyName = (property) => {
  return '<code class="unbreakable-text"><span class="property">' + property + "</span></code>";
};
export const buildPropertyValue = (property) => {
  return '<code class="unbreakable-text">' + property + "</code>";
};
export const isFlexContainer = (computedStyles) => {
  if (!computedStyles) {
    return false;
  }
  const display = computedStyles.get("display");
  return display === "flex" || display === "inline-flex";
};
export const isInlineElement = (computedStyles) => {
  if (!computedStyles) {
    return false;
  }
  return computedStyles.get("display") === "inline";
};
const possiblyReplacedElements = /* @__PURE__ */ new Set([
  "audio",
  "canvas",
  "embed",
  "iframe",
  "img",
  "input",
  "object",
  "video"
]);
export const isPossiblyReplacedElement = (nodeName) => {
  if (!nodeName) {
    return false;
  }
  return possiblyReplacedElements.has(nodeName);
};
export const isGridContainer = (computedStyles) => {
  if (!computedStyles) {
    return false;
  }
  const display = computedStyles.get("display");
  return display === "grid" || display === "inline-grid";
};
export const isMulticolContainer = (computedStyles) => {
  if (!computedStyles) {
    return false;
  }
  const columnWidth = computedStyles.get("column-width");
  const columnCount = computedStyles.get("column-count");
  return columnWidth !== "auto" || columnCount !== "auto";
};
//# sourceMappingURL=CSSRuleValidatorHelper.js.map