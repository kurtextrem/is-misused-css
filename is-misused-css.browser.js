var isMisusedCSS = (function (exports) {
	'use strict';

	const UserMetrics = { CSSHintType: {}};

	const i18n = { getLocalizedString(str, input) {
		const keys = Object.keys(input);
		for (let i = 0; i < keys.length; ++i)
			str = str.replace('{' + keys[i] + '}', input[keys[i]]);
		return str
	 } 
	};

	/**
	 * @source https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/core/sdk/CSSPropertyParser.js
	 * @license https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/core/sdk/CSSPropertyParser.js
	 */
	const globalValues = /* @__PURE__ */ new Set(["inherit", "initial", "unset"]);
	const tagRegexp = /[\x20-\x7E]{4}/;
	const numRegexp = /[+-]?(?:\d*\.)?\d+(?:[eE]\d+)?/;
	const fontVariationSettingsRegexp = new RegExp(`(?:'(${tagRegexp.source})')|(?:"(${tagRegexp.source})")\\s+(${numRegexp.source})`);
	function parseFontVariationSettings(value) {
	  if (globalValues.has(value.trim()) || value.trim() === "normal") {
	    return [];
	  }
	  const results = [];
	  for (const setting of splitByComma(stripComments(value))) {
	    const match = setting.match(fontVariationSettingsRegexp);
	    if (match) {
	      results.push({
	        tag: match[1] || match[2],
	        value: parseFloat(match[3])
	      });
	    }
	  }
	  return results;
	}
	const fontFamilyRegexp = /^"(.+)"|'(.+)'$/;
	function parseFontFamily(value) {
	  if (globalValues.has(value.trim())) {
	    return [];
	  }
	  const results = [];
	  for (const family of splitByComma(stripComments(value))) {
	    const match = family.match(fontFamilyRegexp);
	    if (match) {
	      results.push(match[1] || match[2]);
	    } else {
	      results.push(family);
	    }
	  }
	  return results;
	}
	function splitByComma(value) {
	  return value.split(",").map((part) => part.trim());
	}
	function stripComments(value) {
	  return value.replaceAll(/(\/\*(?:.|\s)*?\*\/)/g, "");
	}

	/**
	 * @source https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/panels/elements/CSSRuleValidatorHelper.js
	 * @license https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/panels/elements/CSSRuleValidatorHelper.js
	 */
	const buildPropertyDefinitionText = (property, value) => {
	  if (value === void 0) {
	    return buildPropertyName(property);
	  }
	  return '<code class="unbreakable-text"><span class="property">' + property + "</span>: " + value + "</code>";
	};
	const buildPropertyName = (property) => {
	  return '<code class="unbreakable-text"><span class="property">' + property + "</span></code>";
	};
	const buildPropertyValue = (property) => {
	  return '<code class="unbreakable-text">' + property + "</code>";
	};
	const isFlexContainer = (computedStyles) => {
	  if (!computedStyles) {
	    return false;
	  }
	  const display = computedStyles.get("display");
	  return display === "flex" || display === "inline-flex";
	};
	const isInlineElement = (computedStyles) => {
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
	const isPossiblyReplacedElement = (nodeName) => {
	  if (!nodeName) {
	    return false;
	  }
	  return possiblyReplacedElements.has(nodeName);
	};
	const isGridContainer = (computedStyles) => {
	  if (!computedStyles) {
	    return false;
	  }
	  const display = computedStyles.get("display");
	  return display === "grid" || display === "inline-grid";
	};
	const isMulticolContainer = (computedStyles) => {
	  if (!computedStyles) {
	    return false;
	  }
	  const columnWidth = computedStyles.get("column-width");
	  const columnCount = computedStyles.get("column-count");
	  return columnWidth !== "auto" || columnCount !== "auto";
	};

	/**
	 * @source https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/panels/elements/CSSRuleValidator.js
	 * @license https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/panels/elements/CSSRuleValidator.js
	 */

	const UIStrings = {
	  ruleViolatedBySameElementRuleReason: "The {REASON_PROPERTY_DECLARATION_CODE} property prevents {AFFECTED_PROPERTY_DECLARATION_CODE} from having an effect.",
	  ruleViolatedBySameElementRuleFix: "Try setting {PROPERTY_NAME} to something other than {PROPERTY_VALUE}.",
	  ruleViolatedBySameElementRuleChangeSuggestion: "Try setting the {EXISTING_PROPERTY_DECLARATION} property to {TARGET_PROPERTY_DECLARATION}.",
	  ruleViolatedByParentElementRuleReason: "The {REASON_PROPERTY_DECLARATION_CODE} property on the parent element prevents {AFFECTED_PROPERTY_DECLARATION_CODE} from having an effect.",
	  ruleViolatedByParentElementRuleFix: "Try setting the {EXISTING_PARENT_ELEMENT_RULE} property on the parent to {TARGET_PARENT_ELEMENT_RULE}.",
	  fontVariationSettingsWarning: "Value for setting \u201C{PH1}\u201D {PH2} is outside the supported range [{PH3}, {PH4}] for font-family \u201C{PH5}\u201D."
	};
	//const str_ = i18n.i18n.registerUIStrings("panels/elements/CSSRuleValidator.ts", UIStrings);
	const i18nString = i18n.getLocalizedString;//.bind(void 0, str_);
	class Hint {
	  #hintMessage;
	  #possibleFixMessage;
	  #learnMoreLink;
	  constructor(hintMessage, possibleFixMessage, learnMoreLink) {
	    this.#hintMessage = hintMessage;
	    this.#possibleFixMessage = possibleFixMessage;
	    this.#learnMoreLink = learnMoreLink;
	  }
	  getMessage() {
	    return this.#hintMessage;
	  }
	  getPossibleFixMessage() {
	    return this.#possibleFixMessage;
	  }
	  getLearnMoreLink() {
	    return this.#learnMoreLink;
	  }
	}
	class CSSRuleValidator {
	  getMetricType() {
	    return UserMetrics.CSSHintType.Other;
	  }
	  #affectedProperties;
	  constructor(affectedProperties) {
	    this.#affectedProperties = affectedProperties;
	  }
	  getApplicableProperties() {
	    return this.#affectedProperties;
	  }
	}
	class AlignContentValidator extends CSSRuleValidator {
	  constructor() {
	    super(["align-content"]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.AlignContent;
	  }
	  getHint(_propertyName, computedStyles) {
	    if (!computedStyles) {
	      return;
	    }
	    if (!isFlexContainer(computedStyles)) {
	      return;
	    }
	    if (computedStyles.get("flex-wrap") !== "nowrap") {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("flex-wrap", "nowrap");
	    const affectedPropertyDeclarationCode = buildPropertyName("align-content");
	    return new Hint(i18nString(UIStrings.ruleViolatedBySameElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedBySameElementRuleFix, {
	      PROPERTY_NAME: buildPropertyName("flex-wrap"),
	      PROPERTY_VALUE: buildPropertyValue("nowrap")
	    }));
	  }
	}
	class FlexItemValidator extends CSSRuleValidator {
	  constructor() {
	    super(["flex", "flex-basis", "flex-grow", "flex-shrink"]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.FlexItem;
	  }
	  getHint(propertyName, computedStyles, parentComputedStyles) {
	    if (!parentComputedStyles) {
	      return;
	    }
	    if (isFlexContainer(parentComputedStyles)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("display", parentComputedStyles?.get("display"));
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    const targetParentPropertyDeclaration = buildPropertyDefinitionText("display", "flex");
	    return new Hint(i18nString(UIStrings.ruleViolatedByParentElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedByParentElementRuleFix, {
	      "EXISTING_PARENT_ELEMENT_RULE": reasonPropertyDeclaration,
	      "TARGET_PARENT_ELEMENT_RULE": targetParentPropertyDeclaration
	    }));
	  }
	}
	class FlexContainerValidator extends CSSRuleValidator {
	  constructor() {
	    super(["flex-direction", "flex-flow", "flex-wrap"]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.FlexContainer;
	  }
	  getHint(propertyName, computedStyles) {
	    if (!computedStyles) {
	      return;
	    }
	    if (isFlexContainer(computedStyles)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("display", computedStyles?.get("display"));
	    const targetRuleCode = buildPropertyDefinitionText("display", "flex");
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedBySameElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedBySameElementRuleChangeSuggestion, {
	      "EXISTING_PROPERTY_DECLARATION": reasonPropertyDeclaration,
	      "TARGET_PROPERTY_DECLARATION": targetRuleCode
	    }));
	  }
	}
	class GridContainerValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "grid",
	      "grid-auto-columns",
	      "grid-auto-flow",
	      "grid-auto-rows",
	      "grid-template",
	      "grid-template-areas",
	      "grid-template-columns",
	      "grid-template-rows"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.GridContainer;
	  }
	  getHint(propertyName, computedStyles) {
	    if (isGridContainer(computedStyles)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("display", computedStyles?.get("display"));
	    const targetRuleCode = buildPropertyDefinitionText("display", "grid");
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedBySameElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedBySameElementRuleChangeSuggestion, {
	      "EXISTING_PROPERTY_DECLARATION": reasonPropertyDeclaration,
	      "TARGET_PROPERTY_DECLARATION": targetRuleCode
	    }));
	  }
	}
	class GridItemValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "grid-area",
	      "grid-column",
	      "grid-row",
	      "grid-row-end",
	      "grid-row-start",
	      "justify-self"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.GridItem;
	  }
	  getHint(propertyName, computedStyles, parentComputedStyles) {
	    if (!parentComputedStyles) {
	      return;
	    }
	    if (isGridContainer(parentComputedStyles)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("display", parentComputedStyles?.get("display"));
	    const targetParentPropertyDeclaration = buildPropertyDefinitionText("display", "grid");
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedByParentElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedByParentElementRuleFix, {
	      "EXISTING_PARENT_ELEMENT_RULE": reasonPropertyDeclaration,
	      "TARGET_PARENT_ELEMENT_RULE": targetParentPropertyDeclaration
	    }));
	  }
	}
	class FlexOrGridItemValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "place-self",
	      "align-self",
	      "order"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.FlexOrGridItem;
	  }
	  getHint(propertyName, computedStyles, parentComputedStyles) {
	    if (!parentComputedStyles) {
	      return;
	    }
	    if (isFlexContainer(parentComputedStyles) || isGridContainer(parentComputedStyles)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("display", parentComputedStyles?.get("display"));
	    const targetParentPropertyDeclaration = `${buildPropertyDefinitionText("display", "flex")} or ${buildPropertyDefinitionText("display", "grid")}`;
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedByParentElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedByParentElementRuleFix, {
	      "EXISTING_PARENT_ELEMENT_RULE": reasonPropertyDeclaration,
	      "TARGET_PARENT_ELEMENT_RULE": targetParentPropertyDeclaration
	    }));
	  }
	}
	class FlexGridValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "justify-content",
	      "align-content",
	      "place-content",
	      "align-items"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.FlexGrid;
	  }
	  getHint(propertyName, computedStyles) {
	    if (!computedStyles) {
	      return;
	    }
	    if (isFlexContainer(computedStyles) || isGridContainer(computedStyles)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("display", computedStyles?.get("display"));
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedBySameElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedBySameElementRuleFix, {
	      PROPERTY_NAME: buildPropertyName("display"),
	      PROPERTY_VALUE: buildPropertyValue(computedStyles?.get("display"))
	    }));
	  }
	}
	class MulticolFlexGridValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "gap",
	      "column-gap",
	      "row-gap",
	      "grid-gap",
	      "grid-column-gap",
	      "grid-column-end",
	      "grid-row-gap"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.MulticolFlexGrid;
	  }
	  getHint(propertyName, computedStyles) {
	    if (!computedStyles) {
	      return;
	    }
	    if (isMulticolContainer(computedStyles) || isFlexContainer(computedStyles) || isGridContainer(computedStyles)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("display", computedStyles?.get("display"));
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedBySameElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedBySameElementRuleFix, {
	      PROPERTY_NAME: buildPropertyName("display"),
	      PROPERTY_VALUE: buildPropertyValue(computedStyles?.get("display"))
	    }));
	  }
	}
	class PaddingValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "padding",
	      "padding-top",
	      "padding-right",
	      "padding-bottom",
	      "padding-left"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.Padding;
	  }
	  getHint(propertyName, computedStyles) {
	    const display = computedStyles?.get("display");
	    if (!display) {
	      return;
	    }
	    const tableAttributes = [
	      "table-row-group",
	      "table-header-group",
	      "table-footer-group",
	      "table-row",
	      "table-column-group",
	      "table-column"
	    ];
	    if (!tableAttributes.includes(display)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("display", computedStyles?.get("display"));
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedBySameElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedBySameElementRuleFix, {
	      PROPERTY_NAME: buildPropertyName("display"),
	      PROPERTY_VALUE: buildPropertyValue(computedStyles?.get("display"))
	    }));
	  }
	}
	class PositionValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "top",
	      "right",
	      "bottom",
	      "left"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.Position;
	  }
	  getHint(propertyName, computedStyles) {
	    const position = computedStyles?.get("position");
	    if (!position) {
	      return;
	    }
	    if (position !== "static") {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("position", computedStyles?.get("position"));
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedBySameElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedBySameElementRuleFix, {
	      PROPERTY_NAME: buildPropertyName("position"),
	      PROPERTY_VALUE: buildPropertyValue(computedStyles?.get("position"))
	    }));
	  }
	}
	class ZIndexValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "z-index"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.ZIndex;
	  }
	  getHint(propertyName, computedStyles, parentComputedStyles) {
	    const position = computedStyles?.get("position");
	    if (!position) {
	      return;
	    }
	    if (["absolute", "relative", "fixed", "sticky"].includes(position) || isFlexContainer(parentComputedStyles) || isGridContainer(parentComputedStyles)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("position", computedStyles?.get("position"));
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedBySameElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedBySameElementRuleFix, {
	      PROPERTY_NAME: buildPropertyName("position"),
	      PROPERTY_VALUE: buildPropertyValue(computedStyles?.get("position"))
	    }));
	  }
	}
	class SizingValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "width",
	      "height"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.Sizing;
	  }
	  getHint(propertyName, computedStyles, parentComputedStyles, nodeName) {
	    if (!computedStyles || !nodeName) {
	      return;
	    }
	    if (!isInlineElement(computedStyles)) {
	      return;
	    }
	    if (isPossiblyReplacedElement(nodeName)) {
	      return;
	    }
	    const reasonPropertyDeclaration = buildPropertyDefinitionText("display", computedStyles?.get("display"));
	    const affectedPropertyDeclarationCode = buildPropertyName(propertyName);
	    return new Hint(i18nString(UIStrings.ruleViolatedBySameElementRuleReason, {
	      "REASON_PROPERTY_DECLARATION_CODE": reasonPropertyDeclaration,
	      "AFFECTED_PROPERTY_DECLARATION_CODE": affectedPropertyDeclarationCode
	    }), i18nString(UIStrings.ruleViolatedBySameElementRuleFix, {
	      PROPERTY_NAME: buildPropertyName("display"),
	      PROPERTY_VALUE: buildPropertyValue(computedStyles?.get("display"))
	    }));
	  }
	}
	class FontVariationSettingsValidator extends CSSRuleValidator {
	  constructor() {
	    super([
	      "font-variation-settings"
	    ]);
	  }
	  getMetricType() {
	    return UserMetrics.CSSHintType.FontVariationSettings;
	  }
	  getHint(propertyName, computedStyles, parentComputedStyles, nodeName, fontFaces) {
	    if (!computedStyles) {
	      return;
	    }
	    const value = computedStyles.get("font-variation-settings");
	    if (!value) {
	      return;
	    }
	    const fontFamily = computedStyles.get("font-family");
	    if (!fontFamily) {
	      return;
	    }
	    const fontFamilies = new Set(parseFontFamily(fontFamily));
	    const matchingFontFaces = (fontFaces || []).filter((f) => fontFamilies.has(f.getFontFamily()));
	    const variationSettings = parseFontVariationSettings(value);
	    const warnings = [];
	    for (const elementSetting of variationSettings) {
	      for (const font of matchingFontFaces) {
	        const fontSetting = font.getVariationAxisByTag(elementSetting.tag);
	        if (!fontSetting) {
	          continue;
	        }
	        if (elementSetting.value < fontSetting.minValue || elementSetting.value > fontSetting.maxValue) {
	          warnings.push(i18nString(UIStrings.fontVariationSettingsWarning, {
	            PH1: elementSetting.tag,
	            PH2: elementSetting.value,
	            PH3: fontSetting.minValue,
	            PH4: fontSetting.maxValue,
	            PH5: font.getFontFamily()
	          }));
	        }
	      }
	    }
	    if (!warnings.length) {
	      return;
	    }
	    return new Hint(warnings.join(" "), "");
	  }
	}
	const CSS_RULE_VALIDATORS = [
	  AlignContentValidator,
	  FlexContainerValidator,
	  FlexGridValidator,
	  FlexItemValidator,
	  FlexOrGridItemValidator,
	  FontVariationSettingsValidator,
	  GridContainerValidator,
	  GridItemValidator,
	  MulticolFlexGridValidator,
	  PaddingValidator,
	  PositionValidator,
	  SizingValidator,
	  ZIndexValidator
	];
	const setupCSSRulesValidators = () => {
	  const validatorsMap = /* @__PURE__ */ new Map();
	  for (const validatorClass of CSS_RULE_VALIDATORS) {
	    const validator = new validatorClass();
	    const affectedProperties = validator.getApplicableProperties();
	    for (const affectedProperty of affectedProperties) {
	      let propertyValidators = validatorsMap.get(affectedProperty);
	      if (propertyValidators === void 0) {
	        propertyValidators = [];
	      }
	      propertyValidators.push(validator);
	      validatorsMap.set(affectedProperty, propertyValidators);
	    }
	  }
	  return validatorsMap;
	};
	const cssRuleValidatorsMap = setupCSSRulesValidators();

	const validatorsWithoutFonts = cssRuleValidatorsMap.remove('font-variation-settings');

	function scan(el) {
		if (!(el instanceof Element)) return;

		if (style.get('font-variation-settings').toString() !== 'normal') {
			console.warn('[font-variation-settings] Detected a value unequal to "normal", please use DevTools to check if it applies correctly');
		}

		const style = el.computedStyleMap();
		const parentStyle = el.parentElement && el.parentElement.computedStyleMap();
		const nodeName = el.nodeName;
		//const fonts = Array.from(document.fonts)
		const hints = new Set();
		validatorsWithoutFonts.forEach((validators, propertyName) => {
			validators.forEach(validator => {
				const hint = validator.getHint(propertyName, style, parentStyle, nodeName); // , fonts
				if (hint) hints.add(hint);
			});
		});	
		return hints
	}

	exports.scan = scan;

	return exports;

})({});
