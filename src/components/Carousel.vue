<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useMainStore } from '@/stores/main';
import { memoize, withStopwatch, throttle } from '@/utils'

const isLoading = ref(true);

function drawImage(img) {
  ctx.canvas.width = img.naturalWidth;
  ctx.canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
}

async function buildImg(newIndex) {
  const newImage = store.images[newIndex].file;
  const newSrc = URL.createObjectURL(newImage);
  const img = document.createElement('img');
  img.src = newSrc;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  return img;
}

const [memoizedBuildImg, invalidateCachedImages] = memoize(buildImg);

async function updateImage() {
  const newIndex = store.index;

  withStopwatch(async () => {
    const img = await memoizedBuildImg(newIndex);
    drawImage(img);
  })

  isLoading.value = false;
}

const throttledUpdateImage = throttle(updateImage, 1000)

async function changeImage(newIndex) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  isLoading.value = true;

  throttledUpdateImage(newIndex);

  store.index = newIndex;
}

let ctx;

const store = useMainStore();
onMounted(() => {
  // clear cache
  invalidateCachedImages();

  const canvas = document.querySelector('#canvas');

  ctx = canvas.getContext('2d');
  changeImage(store.index);
})

onUnmounted(() => {
  // clear cache
  invalidateCachedImages();
})

watch(
  () => store.images,
  () => {
    // clear cache
    invalidateCachedImages();
    store.index = 0;
    changeImage(store.index);
  })

watch(
  () => store.index,
  (index) => {
    changeImage(index);
  });

</script>

<template>
  <div class="canvas-container">
    <button @click="count()">average</button>
    <div v-show="isLoading" style="position: absolute; color: white; width: 200px; height: 200px; font-size: 4em;">
      загрузка...</div>
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
