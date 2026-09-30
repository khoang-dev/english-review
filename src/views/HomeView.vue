<script setup>
import { ReadOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <a-card title="Welcome">
      <p class="mb-4 text-gray-600">
        Review the corrections on your writing, learn the rules behind them, and practise rewriting
        the sentences until the mistakes stop coming back.
      </p>
      <RouterLink :to="{ name: 'lessons' }">
        <a-button type="primary">
          <template #icon><ReadOutlined /></template>
          Open Knowledge Review
        </a-button>
      </RouterLink>
    </a-card>
  </div>
</template>
