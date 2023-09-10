<script setup>
import { onMounted, ref, watch } from 'vue';
import { useMainStore } from '@/stores/main';

const IMAGE_MAX_WIDTH = ref(null);
const IMAGE_MAX_HEIGHT = ref(null);

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
}, 1000)

async function changeImage(newIndex) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillText('загрузка...',ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.fillStyle = "white";
  ctx.textAlign = 'middle';

  updateImage(newIndex);

  store.index = newIndex;
}

let ctx;

const store = useMainStore();
onMounted(() => {
  const canvas = document.querySelector('#canvas');

  IMAGE_MAX_WIDTH.value = canvas.offsetWidth;
  IMAGE_MAX_HEIGHT.value = canvas.offsetHeight;

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
