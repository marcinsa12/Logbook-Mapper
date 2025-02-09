<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
  </div>
</template>

<style scoped>
.greetings {
  flex-shrink: 0;
  min-width: 200px;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  white-space: nowrap;
  margin: 0;
  line-height: 1.2;
}

@media (max-width: 1024px) {
  h1 {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
  }
}
</style>
