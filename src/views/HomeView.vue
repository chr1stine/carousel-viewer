<script setup>
import Carousel from '@/components/Carousel.vue';
import Controls from '@/components/Controls.vue';
import { useMainStore } from '@/stores/main';

const store = useMainStore();
</script>

<template>
  <Controls />
  <Carousel v-if="store.images?.length" />
</template>
<style scoped>

</style>