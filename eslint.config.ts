import antfu from '@antfu/eslint-config';

export default antfu({
  test: false,
  typescript: true,
  vue: true,
  rules: {
    'consistent-list-newline': 'off',
    'no-console': 0,
    'curly': ['error', 'multi-line'],
    'max-statements-per-line': 0,
    'brace-style': 'off',
    'vue/multi-word-component-names': 0,
    'vue/no-v-text-v-html-on-component': 'off',
    'node/prefer-global/process': 'off',
    'import/no-duplicates': 'off',
    'unused-imports/no-unused-vars': 'off',
    'style/brace-style': ['error', '1tbs'],
    'style/semi': 'off',
    'ts/consistent-type-imports': ['off'],
    'ts/semi': ['error', 'always'],
  },
});
