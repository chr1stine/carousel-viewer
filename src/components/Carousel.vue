<script setup>
import { onMounted, ref, watch } from 'vue';
import { useMainStore } from '@/stores/main';

const isLoading = ref(true);

function drawImage(img) {
  ctx.canvas.width = img.naturalWidth;
  ctx.canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
}

const updateImage = throttle(async () => {
  const newIndex = store.index;
  const newImage = store.images[newIndex].file;
  const newSrc = URL.createObjectURL(newImage);
  const img = document.createElement('img');
  img.src = newSrc;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  drawImage(img);
  isLoading.value = false;
}, 1000)


async function changeImage(newIndex) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  isLoading.value = true;
  
  updateImage(newIndex);

  store.index = newIndex;
}

let ctx;

const store = useMainStore();
onMounted(() => {
  const canvas = document.querySelector('#canvas');

  ctx = canvas.getContext('2d');
  changeImage(store.index);
})

watch(
  () => store.images,
  () => {
    store.index = 0;
    changeImage(store.index);
  })

function throttle(cb, timeout) {
  let busy = false;
  return (...args) => {
    if (busy) {
      return;
    }
    busy = true
    cb(...args);
    setTimeout(() => {
      busy = false;
      cb(...args);
    }, timeout)
  }
}

watch(
  () => store.index,
  (index) => {
    changeImage(index);
  });

</script>

<template>
  <div class="canvas-container">
    <div v-show="isLoading" style="position: absolute; color: white; width: 200px; height: 200px; font-size: 4em;">загрузка...</div>
    <canvas id="canvas" v-bind:class="store.mode"></canvas>
  </div>
</template>

<style scoped>
.canvas-container {
  position: absolute;
  background-color: black;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas.full {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

canvas.horizontal {
  width: 100vw;
  height: 50vh;
}

canvas.vertical {
  width: 50vw;
  height: 100vh;
}

canvas.square {
  width: 50vw;
  height: 50vw;
}
</style>
