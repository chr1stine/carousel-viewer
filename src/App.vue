<script setup>
import { useMainStore } from '@/stores/main';
import HomeView from './views/HomeView.vue'
import idb from './services/idb';
import { watch } from 'vue';

const store = useMainStore();

// rehydrate if persisted
(async () => {
  if (!store.images.length) {
    const persistedImages = await idb.getImages();
    store.assignNewImages(persistedImages.map(i => i.file))
  }
})();

// persist on change
watch(
  store,
  async (state) => {
    localStorage.setItem('mode', state.mode);
    localStorage.setItem('index', state.index);
    idb.saveImages(state.images);
  },
  { deep: true }
)

</script>

<template>
  <HomeView />
</template>