import { cssRuleValidatorsMap } from './chromium-devtools/CSSRuleValidator.mjs'

// fonts not (yet?) supported
cssRuleValidatorsMap.delete('font-variation-settings')

// from https://stackoverflow.com/a/56408175/2927230
class Styles {
    // Returns a dummy iframe with no styles or content
    // This allows us to get default styles from the browser for an element
    static getStylesIframe() {
        if (typeof window.blankIframe != 'undefined') {
            return window.blankIframe;
        }

        window.blankIframe = document.createElement('iframe');
        document.body.appendChild(window.blankIframe);

        return window.blankIframe;
    }

    // Turns a CSSStyleDeclaration into a regular object, as all values become "" after a node is removed
    static getStylesMap(node, parentWindow) {
        const styles = parentWindow.getComputedStyle(node);
        let stylesMap = new Map();

        for (let i = 0; i < styles.length; ++i) {
            const property = styles[i];
            stylesMap.set(property, styles[property]);
        }

        return stylesMap;
    }

    // Returns a styles object with the browser's default styles for the provided node
    static getDefaultStyles(node) {
        const iframe = Styles.getStylesIframe();
        const iframeDocument = iframe.contentDocument;
        const targetElement = iframeDocument.createElement(node.tagName);

        iframeDocument.body.appendChild(targetElement);
        const defaultStyles = Styles.getStylesMap(targetElement, iframe.contentWindow);

        targetElement.remove();

        return defaultStyles;
    }

    // Returns a styles object with only the styles applied by the user's CSS that differ from the browser's default styles
    static getUserStyles(node) {
        const defaultStyles = Styles.getDefaultStyles(node);
        const styles = Styles.getStylesMap(node, window);
        let userStyles = new Map();

        for (let [property, value] of defaultStyles) {
            if (styles.get(property) != value) {
                userStyles.set(property, styles.get(property));
            }
        }

        return userStyles;
    }
}

export function scan(el) {
	if (!(el instanceof Element)) return;

	const style = Styles.getUserStyles(el)
	//const fonts = Array.from(document.fonts)
	if (style.has('font-variation-settings')) {
		console.warn('[font-variation-settings] Please use DevTools to check if it applies correctly')
	}

	const parentStyle = el.parentElement && Styles.getUserStyles(el.parentElement)
	const nodeName = el.nodeName
	const hints = new Set()
	cssRuleValidatorsMap.forEach((validators, propertyName) => {
		if (!style.has(propertyName)) return;

		validators.forEach(validator => {
			const hint = validator.getHint(propertyName, style, parentStyle, nodeName) // , fonts
			if (hint) hints.add(hint)
		})
	})	
	return hints
}