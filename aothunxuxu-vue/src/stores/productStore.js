import { defineStore } from 'pinia'
import { productService } from '@/api/services'

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [],
        searchResults: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchProducts(params = {}) {
            console.log('Fetching products with params:', params)
            this.loading = true
            this.error = null
            try {
                const response = await productService.search(params)
                console.log('Received response:', response.data)
                this.searchResults = response.data
                return response.data
            } catch (error) {
                console.error('API Error:', error)
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async addProduct(product) {
            const response = await productService.create(product)
            await this.fetchProducts({ page: 1, pageSize: 12 })
            return response.data
        },

        async updateProduct(id, product) {
            const response = await productService.update(id, product)
            await this.fetchProducts({ page: 1, pageSize: 12 })
            return response.data
        },

        async deleteProduct(id) {
            const response = await productService.delete(id)
            await this.fetchProducts({ page: 1, pageSize: 12 })
            return response.data
        }
    }
})
