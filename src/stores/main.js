import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  const images = ref([]);
  const index = ref(Number.parseInt(localStorage.getItem('index') ?? 0));
  const mode = ref(localStorage.getItem('mode') ?? 'full');

  function assignNewImages(files) {
    images.value = files.map((file, id) => {
      return { file, id };
    });
  }

  return { images, mode, index, assignNewImages }
})
