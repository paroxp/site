import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import functional from 'eslint-plugin-functional';
import { createNodeResolver, importX } from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['coverage/', 'dist/', 'node_modules/']),
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      importX.flatConfigs.errors,
      importX.flatConfigs.warnings,
    ],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@stylistic': stylistic,
      functional,
    },
    rules: {
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/max-len': ['warn', { code: 120 }],
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/padding-line-between-statements': ['warn', { blankLine: 'always', next: 'return', prev: '*' }],
      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/naming-convention': ['error', { format: ['camelCase', 'PascalCase'], selector: 'function' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      'functional/no-let': 'warn',
      'functional/prefer-readonly-type': ['warn', { ignoreClass: true }],
      'import-x/no-amd': 'error',
      'import-x/no-commonjs': 'error',
      'import-x/order': ['warn', { alphabetize: { caseInsensitive: true, order: 'asc' }, 'newlines-between': 'always' }],
      'no-case-declarations': 'warn',
      'no-delete-var': 'error',
      'no-eval': 'error',
      'no-octal': 'error',
      'no-param-reassign': 'error',
      'no-sequences': 'error',
      'no-unused-expressions': 'warn',
      'prefer-const': 'warn',
      'prefer-object-spread': 'warn',
      'prefer-template': 'warn',
      'require-await': 'error',
      'sort-imports': ['warn', { ignoreCase: true, ignoreDeclarationSort: true }],
      'sort-keys': ['warn', 'asc', { caseSensitive: false, minKeys: 2, natural: false }],
      'use-isnan': 'error',
    },
    settings: {
      'import-x/resolver-next': [createNodeResolver({ extensions: ['.ts', '.tsx', '.js'] })],
    },
  },
]);
