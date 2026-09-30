import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/coverage/**', '**/.responsive-shots/**', 'src/components.d.ts'],
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
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
      // All components are TypeScript
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
    },
  },
  // Must be last: turns off rules that conflict with Prettier
  skipFormatting,
)
