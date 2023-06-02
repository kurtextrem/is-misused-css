/**
 * @source https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/panels/elements/CSSRuleValidator.js
 * @license https://source.chromium.org/chromium/chromium/src/+/main:out/win-Debug/gen/third_party/devtools-frontend/src/front_end/panels/elements/CSSRuleValidator.js
 */

import * as Host from "./host.mjs";
import * as i18n from "./i18n.mjs";
import * as SDK from "./sdk.mjs";
import {
  buildPropertyDefinitionText,
  buildPropertyName,
  buildPropertyValue,
  isFlexContainer,
  isGridContainer,
  isInlineElement,
  isMulticolContainer,
  isPossiblyReplacedElement
} from "./CSSRuleValidatorHelper.mjs";
const UIStrings = {
  ruleViolatedBySameElementRuleReason: "The {REASON_PROPERTY_DECLARATION_CODE} property prevents {AFFECTED_PROPERTY_DECLARATION_CODE} from having an effect.",
  ruleViolatedBySameElementRuleFix: "Try setting {PROPERTY_NAME} to something other than {PROPERTY_VALUE}.",
  ruleViolatedBySameElementRuleChangeSuggestion: "Try setting the {EXISTING_PROPERTY_DECLARATION} property to {TARGET_PROPERTY_DECLARATION}.",
  ruleViolatedByParentElementRuleReason: "The {REASON_PROPERTY_DECLARATION_CODE} property on the parent element prevents {AFFECTED_PROPERTY_DECLARATION_CODE} from having an effect.",
  ruleViolatedByParentElementRuleFix: "Try setting the {EXISTING_PARENT_ELEMENT_RULE} property on the parent to {TARGET_PARENT_ELEMENT_RULE}.",
  fontVariationSettingsWarning: "Value for setting \u201C{PH1}\u201D {PH2} is outside the supported range [{PH3}, {PH4}] for font-family \u201C{PH5}\u201D."
};
//const str_ = i18n.i18n.registerUIStrings("panels/elements/CSSRuleValidator.ts", UIStrings);
const i18nString = i18n.i18n.getLocalizedString//.bind(void 0, str_);
export var HintType = /* @__PURE__ */ ((HintType2) => {
  HintType2["INACTIVE_PROPERTY"] = "ruleValidation";
  HintType2["DEPRECATED_PROPERTY"] = "deprecatedProperty";
  return HintType2;
})(HintType || {});
export class Hint {
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
export class CSSRuleValidator {
  getMetricType() {
    return Host.UserMetrics.CSSHintType.Other;
  }
  #affectedProperties;
  constructor(affectedProperties) {
    this.#affectedProperties = affectedProperties;
  }
  getApplicableProperties() {
    return this.#affectedProperties;
  }
}
export class AlignContentValidator extends CSSRuleValidator {
  constructor() {
    super(["align-content"]);
  }
  getMetricType() {
    return Host.UserMetrics.CSSHintType.AlignContent;
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
export class FlexItemValidator extends CSSRuleValidator {
  constructor() {
    super(["flex", "flex-basis", "flex-grow", "flex-shrink"]);
  }
  getMetricType() {
    return Host.UserMetrics.CSSHintType.FlexItem;
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
export class FlexContainerValidator extends CSSRuleValidator {
  constructor() {
    super(["flex-direction", "flex-flow", "flex-wrap"]);
  }
  getMetricType() {
    return Host.UserMetrics.CSSHintType.FlexContainer;
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
export class GridContainerValidator extends CSSRuleValidator {
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
    return Host.UserMetrics.CSSHintType.GridContainer;
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
export class GridItemValidator extends CSSRuleValidator {
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
    return Host.UserMetrics.CSSHintType.GridItem;
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
export class FlexOrGridItemValidator extends CSSRuleValidator {
  constructor() {
    super([
      "place-self",
      "align-self",
      "order"
    ]);
  }
  getMetricType() {
    return Host.UserMetrics.CSSHintType.FlexOrGridItem;
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
export class FlexGridValidator extends CSSRuleValidator {
  constructor() {
    super([
      "justify-content",
      "align-content",
      "place-content",
      "align-items"
    ]);
  }
  getMetricType() {
    return Host.UserMetrics.CSSHintType.FlexGrid;
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
export class MulticolFlexGridValidator extends CSSRuleValidator {
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
    return Host.UserMetrics.CSSHintType.MulticolFlexGrid;
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
export class PaddingValidator extends CSSRuleValidator {
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
    return Host.UserMetrics.CSSHintType.Padding;
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
export class PositionValidator extends CSSRuleValidator {
  constructor() {
    super([
      "top",
      "right",
      "bottom",
      "left"
    ]);
  }
  getMetricType() {
    return Host.UserMetrics.CSSHintType.Position;
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
export class ZIndexValidator extends CSSRuleValidator {
  constructor() {
    super([
      "z-index"
    ]);
  }
  getMetricType() {
    return Host.UserMetrics.CSSHintType.ZIndex;
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
export class SizingValidator extends CSSRuleValidator {
  constructor() {
    super([
      "width",
      "height"
    ]);
  }
  getMetricType() {
    return Host.UserMetrics.CSSHintType.Sizing;
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
export class FontVariationSettingsValidator extends CSSRuleValidator {
  constructor() {
    super([
      "font-variation-settings"
    ]);
  }
  getMetricType() {
    return Host.UserMetrics.CSSHintType.FontVariationSettings;
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
    const fontFamilies = new Set(SDK.CSSPropertyParser.parseFontFamily(fontFamily));
    const matchingFontFaces = (fontFaces || []).filter((f) => fontFamilies.has(f.getFontFamily()));
    const variationSettings = SDK.CSSPropertyParser.parseFontVariationSettings(value);
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
export const cssRuleValidatorsMap = setupCSSRulesValidators();
//# sourceMappingURL=CSSRuleValidator.js.map