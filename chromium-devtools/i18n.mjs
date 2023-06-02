export const i18n = { getLocalizedString(str, input) {
	const keys = Object.keys(input)
	for (let i = 0; i < keys.length; ++i)
		str = str.replace('{' + keys[i] + '}', input[keys[i]])
	return str
 } 
}