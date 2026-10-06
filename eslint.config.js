// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/features/*/*'],
          message: '다른 도메인은 @/features/<domain> (index.ts)으로만 import하세요.',
        }],
      }],
    },
  },
]);
