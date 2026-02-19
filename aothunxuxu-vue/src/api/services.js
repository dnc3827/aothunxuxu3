import apiClient from './client';

export const productService = {
    getAll() {
        return apiClient.get('/api/products');
    },
    getById(id) {
        return apiClient.get(`/api/products/${id}`);
    },
    search(params) {
        return apiClient.get('/api/products/search', { params });
    },
    create(product) {
        return apiClient.post('/api/products', product);
    },
    update(id, product) {
        return apiClient.put(`/api/products/${id}`, product);
    },
    delete(id) {
        return apiClient.delete(`/api/products/${id}`);
    },
    import(formData) {
        return apiClient.post('/api/products/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    importParse(formData) {
        return apiClient.post('/api/products/import/parse', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    importConfirm(payload) {
        return apiClient.post('/api/products/import/confirm', payload);
    }
};

export const authService = {
    login(credentials) {
        return apiClient.post('/api/auth/login', credentials);
    },
    register(credentials) {
        return apiClient.post('/api/auth/register', credentials);
    },
    logout() {
        localStorage.removeItem('access_token');
    }
};
