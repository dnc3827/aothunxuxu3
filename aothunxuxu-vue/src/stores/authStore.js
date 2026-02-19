import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('access_token'))
    const userRole = ref(localStorage.getItem('user_role'))

    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => userRole.value === 'Admin')

    const setAuth = (newToken, role) => {
        token.value = newToken
        userRole.value = role
        localStorage.setItem('access_token', newToken)
        localStorage.setItem('user_role', role)
    }

    const clearAuth = () => {
        token.value = null
        userRole.value = null
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_role')
    }

    return { token, userRole, isAuthenticated, isAdmin, setAuth, clearAuth }
})
