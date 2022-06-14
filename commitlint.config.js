module.exports = {
  // extends: ['@commitlint/config-conventional'] 
  // see https://commitlint.js.org/#/reference-configuration?id=parser-presets
  // see https://www.npmjs.com/package/conventional-changelog-conventionalcommits
  parserPreset: 'conventional-changelog-conventionalcommits',
  // see https://commitlint.js.org/#/reference-rules
  rules: {
		'body-leading-blank': [1, 'always'],
		'footer-leading-blank': [1, 'always'],
		'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
		'subject-case': [
			2,
			'never',
			['sentence-case', 'start-case', 'pascal-case', 'upper-case']
		],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'type-enum': [
			2,
			'always',
			[
        'build',
				'chore',
				'ci',
				'docs',
				'feat',
				'fix',
				'improvement',
				'perf',
				'refactor',
        'release',
				'revert',
				'style',
				'test'
			]
		]
	}
}