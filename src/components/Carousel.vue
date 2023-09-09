<script setup>
import { onMounted, ref, watch } from 'vue';
import { useMainStore } from '@/stores/main';
import pica from 'pica'

const IMAGE_MAX_WIDTH = ref(null);
const IMAGE_MAX_HEIGHT = ref(null);

function drawImage(img) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
}

async function scaleTofit(img) {
  return new Promise((resolve => {
    const wRatio = img.width / ctx.canvas.width;
    const hRatio = img.height / ctx.canvas.height;
    const ratio = Math.max(wRatio, hRatio);

    const newCanvas = document.createElement('canvas');
    newCanvas.width = img.width / ratio;
    newCanvas.height = img.height / ratio;

    pica().resize(img, newCanvas, {
      filter: 'box',
    }).then(() => {
      const url = newCanvas.toDataURL();
      const newImg = document.createElement('img');
      newImg.src = url;
      newImg.onload = (e) => {
        resolve(e.target);
      }
    }).catch(err => {
      console.log('err', err)
    });
  }))
}

function changeImage(newIndex) {
  const newImage = store.images[newIndex].file;
  const newSrc = URL.createObjectURL(newImage);
  const img = document.createElement('img');
  img.src = newSrc;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  // const newImg = await scaleTofit(img);
  const newImg = img;

  drawImage(newImg);
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
