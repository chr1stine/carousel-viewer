import { ref } from 'vue'
import { defineStore } from 'pinia'
import idb from '../services/idb';

const persistedImages = await idb.getImages();
const persistedIndex = Number.parseInt(localStorage.getItem('index'));
const persistedMode = localStorage.getItem('mode');

export const useMainStore = defineStore('main', () => {
  const images = ref(persistedImages ?? []);
  const index = ref( persistedIndex ?? 0);
  const mode = ref(persistedMode ?? 'none');

  function assignNewImages(files) {
    images.value = files.map((file, id) => {
      return { file, id };
    });
  }

  return { images, mode, index, assignNewImages }
})