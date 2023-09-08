<script setup>
import { onMounted, ref } from 'vue';
import { useMainStore } from '@/stores/main';

const dirSelector = ref(null);
const store = useMainStore();
onMounted(() => {
    dirSelector.value = document.querySelector('#file');
    dirSelector.value.addEventListener('change', (e) => {
        const files = e.target.files;

        // filtering to accept images only
        const acceptedTypes = [
            'image/jpeg',
            'image/avif',
            'image/gif',
            'image/jpeg',
            'image/png',
            'image/svg+xml',
        ];
        const images = [...files].filter(f => acceptedTypes.includes(f.type));
        store.assignNewImages(images);
    });
})

</script>

<template>
    <div id="controls">
        <button style="grid-area: folder" id="folder" @click="dirSelector.click()">Выбрать
            папку</button>
        <input id="file" hidden type="file" webkitdirectory>
        <select style="grid-area: modes" name="modes" id="modes" v-model="store.mode" value="none">
            <option value="none" disabled>Выбрать режим</option>
            <option value="full">целиком</option>
            <option value="vertical">по вертикали</option>
            <option value="horizontal">по горизонтали</option>
            <option value="square">1к1</option>
        </select>
        <button v-show="store.images.length" style="grid-area: prev;" id="prev" @click="store.index--"
            :disabled="store.index === 0">пред</button>
        <span v-show="store.images.length" id="index" style="grid-area: index;">{{ store.index + 1 }} / {{
            store.images.length }}</span>
        <button v-show="store.images.length" style="grid-area: next;" id="next" @click="store.index++"
            :disabled="store.index === store.images?.length - 1">след</button>
    </div>
</template>

<style scoped>
#controls {
    position: absolute;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
        "folder modes quality"
        "prev index next";
    gap: 1em;
    background-color: rgba(255, 255, 255, 0.4);
    z-index: 1;
}

#controls>* {
    margin: 1em;
}

</style>