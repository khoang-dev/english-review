import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/.responsive-shots/**', '**/coverage/**', '**/node_modules/**'],
  },
  {
    name: 'app/globals',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    name: 'app/rules',
    rules: {
      'vue/multi-word-component-names': 'off',
      // Styling goes through Tailwind classes — see .claude/skills/tailwind-styling
      'vue/no-restricted-block': [
        'error',
        { element: 'style', message: 'Use Tailwind utility classes instead of <style> blocks.' },
      ],
      'vue/no-static-inline-styles': ['error', { allowBinding: false }],
    },
  },
  // Must be last: turns off rules that conflict with Prettier
  skipFormatting,
]
