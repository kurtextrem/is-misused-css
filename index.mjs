import { cssRuleValidatorsMap } from './chromium-devtools/CSSRuleValidator.mjs'

const validatorsWithoutFonts = cssRuleValidatorsMap.remove('font-variation-settings')

export function scan(el) {
	if (!(el instanceof Element)) return;

	if (style.get('font-variation-settings').toString() !== 'normal') {
		console.warn('[font-variation-settings] Detected a value unequal to "normal", please use DevTools to check if it applies correctly')
	}

	const style = new Map(Object.entries(getComputedStyle(el)))
	const parentStyle = el.parentElement && new Map(Object.entries(getComputedStyle(el.parentElement)))
	const nodeName = el.nodeName
	//const fonts = Array.from(document.fonts)
	const hints = new Set()
	validatorsWithoutFonts.forEach((validators, propertyName) => {
		validators.forEach(validator => {
			const hint = validator.getHint(propertyName, style, parentStyle, nodeName) // , fonts
			if (hint) hints.add(hint)
		})
	})	
	return hints
}