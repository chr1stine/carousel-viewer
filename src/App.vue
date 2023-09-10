<script setup>
import { useMainStore } from '@/stores/main';
import HomeView from './views/HomeView.vue'
import idb from './services/idb';
import { watch } from 'vue';
import { storeToRefs } from 'pinia';

const store = useMainStore();

// rehydrate if persisted
(async () => {
  if (!store.images.length) {
    const persistedImages = await idb.getImages();
    store.assignNewImages(persistedImages.map(i => i.file))
  }
})();

const { mode, index, images } = storeToRefs(store);

// persist on change
watch(
  [mode, index],
  async ([mode, index]) => {
    localStorage.setItem('mode', mode);
    localStorage.setItem('index', index);
  },
  { deep: true }
)

watch(
  images,
  async (images) => {
    await idb.deleteAllImages();
    await idb.saveImages(images);
  },
  { deep: true }
)

</script>

<template>
  <HomeView />
</template>