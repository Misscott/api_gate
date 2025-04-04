import { defineConfig } from 'eslint-define-config'
import antfu from '@antfu/eslint-config'

export default defineConfig({
  ...antfu,
  languageOptions: {
    globals: {
      es2021: true, // ECMAScript 2021 features (including structuredClone)
      node: true,   // Node.js global variables
    }
  },
  rules: {
    ...antfu.rules,
    'accessor-pairs': 'off',
    'no-dupe-args': 'error'
  }
})
