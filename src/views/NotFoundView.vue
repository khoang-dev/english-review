<template>
  <div class="flex flex-col items-center gap-4 px-4 py-20 text-center">
    <p class="text-5xl font-bold text-indigo-600">404</p>
    <p class="text-slate-600">Sorry, this page doesn't exist.</p>
    <RouterLink :to="{ name: 'review' }">
      <a-button type="primary" size="large">Back to today's review</a-button>
    </RouterLink>
  </div>
</template>
