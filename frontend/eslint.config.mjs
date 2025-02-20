import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // ignore specific directories from linting
  { ignores: ['node_modules/', 'package-lock.json', 'dist/', '/coverage'] },
  {
    // extend from the default configs to use reccomended rules
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // Override settings for these specific file types
    files: ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
    languageOptions: {
      // enable all global variables
      globals: { ...globals.browser},
      // Use a parser for TypeScript
      parser: tseslint.parser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
