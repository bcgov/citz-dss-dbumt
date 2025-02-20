import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Specify the parser for TypeScript
    languageOptions: {
      parser: tseslint.parser,
    },
    // Define your ESLint rules
    rules: {
      'no-extra-boolean-cast': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-prototype-builtins': 'off',
      // 'no-console': 'error', // Will uncomment when logger is setup
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
    },
    // Include these files in linting
    files: ['**/*.ts', '**/*.js'],
  },
  {
    // Ignore specific files and directories. node_modules ignored by default
    ignores: ['package-lock.json', 'dist/', 'coverage/'],
  },
);
