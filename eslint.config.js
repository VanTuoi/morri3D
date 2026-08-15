import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettierPlugin from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  files: ['**/*.{js,ts,jsx,tsx}'],
  ignores: ['dist', 'node_modules'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      ecmaFeatures: {
        jsx: true
      },
      project: './tsconfig.eslint.json'
    },
    globals: {
      ...globals.browser,
      ...globals.node
    }
  },
  plugins: {
    react,
    'react-hooks': reactHooks,
    import: importPlugin,
    'jsx-a11y': jsxA11y,
    prettier: prettierPlugin
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    ...js.configs.recommended.rules,
    ...tseslint.configs.recommended[0].rules,
    ...tseslint.configs.recommended[1].rules,
    ...react.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-target-blank': 'warn',
    'no-unused-vars': 'off',
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ]
  }
})
