import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
    const toasts = ref([])

    const show = (message, type = 'success', duration = 3000) => {
        const id = Date.now()
        toasts.value.push({ id, message, type })

        setTimeout(() => {
            remove(id)
        }, duration)
    }

    const success = (message) => show(message, 'success')
    const error = (message) => show(message, 'error')

    const remove = (id) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return { toasts, success, error, remove }
})
