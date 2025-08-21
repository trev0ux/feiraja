import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    typescript: true,
    vue: true,
  },
}).append({
  rules: {
    'no-console': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/require-toggle-inside-transition': 'warn',
    'vue/this-in-template': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  ignores: ['node_modules', '.output', '.data', '.nuxt', '.nitro', '.cache', 'dist'],
})
