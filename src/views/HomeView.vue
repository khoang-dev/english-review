<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { SmileOutlined } from '@ant-design/icons-vue'

const count = ref(0)

function increment() {
  count.value++
  message.success(`Count is now ${count.value}`)
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <a-card title="Welcome">
      <p class="mb-4 text-gray-600">
        Vue 3 + Vue Router + Ant Design Vue + Tailwind CSS v4 are ready.
      </p>
      <a-space>
        <a-button type="primary" @click="increment">
          <template #icon><SmileOutlined /></template>
          Count: {{ count }}
        </a-button>
        <span class="rounded bg-blue-50 px-2 py-1 text-sm text-blue-600">Tailwind utility</span>
      </a-space>
    </a-card>
  </div>
</template>
