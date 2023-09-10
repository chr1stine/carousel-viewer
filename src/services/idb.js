const DB_NAME = 'mainDb'
const STORAGE_NAME = 'images'
const DB_VERSION = 1
let DB

import { toRaw } from 'vue';

export default {
    async getDb() {
        return new Promise((resolve, reject) => {
            if (DB) {
                return resolve(DB)
            }
            const request = ((window instanceof Window) ? self : window).indexedDB.open(DB_NAME, DB_VERSION)
            request.onerror = e => {
                console.log('Error opening db', e)
                reject('Error')
            }

            request.onsuccess = e => {
                DB = e.target.result
                resolve(DB)
            }

            request.onupgradeneeded = e => {
                const db = e.target.result
                db.createObjectStore(STORAGE_NAME, { autoIncrement: true, keyPath: 'id' })
            }
        })
    },
    async getImages() {
        const db = await this.getDb()

        return new Promise(resolve => {
            const trans = db.transaction([STORAGE_NAME], 'readonly')
            trans.oncomplete = () => {
                resolve(images)
            }

            const store = trans.objectStore(STORAGE_NAME)
            const images = []

            store.openCursor().onsuccess = e => {
                const cursor = e.target.result
                if (cursor) {
                    images.push(cursor.value)
                    cursor.continue()
                }
            }
        })
    },
    async deleteAllImages() {
        const db = await this.getDb()

        return new Promise((resolve, reject) => {
            const trans = db.transaction([STORAGE_NAME], 'readwrite')
            trans.oncomplete = () => {
                resolve()
            }
            trans.onerror = (err) => {
                reject(err);
            }

            const store = trans.objectStore(STORAGE_NAME)

            store.clear()
        })
    },
    async saveImages(images) {
        const db = await this.getDb()

        return new Promise((resolve, reject) => {
            const trans = db.transaction([STORAGE_NAME], 'readwrite')
            trans.oncomplete = () => {
                resolve()
            }
            trans.onerror = (err) => {
                reject(err);
            }

            const store = trans.objectStore(STORAGE_NAME)
            for (const image of images) {
                store.add(toRaw(image))
            }
        })
    }
}