module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,html,css}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};