<script setup>
import TheWelcome from '../components/TheWelcome.vue'
function selectDir() {
  console.log('selectDir')
}
</script>

<template>
  <main>
    <button @click="selectDir">
      Выбрать папку
    </button>
  </main>
</template>
