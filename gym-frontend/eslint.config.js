import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

/*
  What is this file?

  This file is the configuration file for "ESLint" in your project.

  What is ESLint?

  ESLint is a tool for identifying and fixing problems in JavaScript (and JSX/TypeScript) code.
  It is often described as a "linter". It checks your code for:
    - Errors (like syntax mistakes or using undefined variables)
    - Best practice violations
    - Code style issues (like missing semicolons or extra spaces)

  Why use ESLint?

  - Helps catch mistakes early, before running your code.
  - Makes your code easier to read and maintain, especially in teams.
  - Can sometimes automatically fix simple issues.

  How does ESLint work here?

  - This configuration file (`eslint.config.js`) tells ESLint **how** to check your code:
      - Which rules or "standards" to use
      - Which parts of your project to check
      - Special settings for React or other tools

  How do you "run" ESLint?
    - Usually you run `npx eslint .` or `npm run lint` (if set up in package.json)
    - It will print issues in your code in the console
    - Some editors (like VSCode) can show warnings as you type, if you have the ESLint extension

  Summary:
    - ESLint = automatic code checker for JavaScript (and JSX, like in React)
    - Helps you write clean and correct code
    - This file configures HOW ESLint works in your project

*/



