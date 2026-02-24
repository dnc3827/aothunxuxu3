<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../api/services'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await authService.login({
      username: username.value,
      password: password.value
    })
    
    // Use store to set auth (handles localStorage and reactive state)
    authStore.setAuth(response.data.token, response.data.user.role)
    
    if (authStore.isAdmin) {
        toastStore.success('Chào mừng quay trở lại, Administrator!')
        router.push({ name: 'admin' })
    } else {
        toastStore.success('Đăng nhập thành công!')
        router.push({ name: 'home' })
    }

  } catch (err) {
    console.error('Login error:', err)
    toastStore.error('Tên đăng nhập hoặc mật khẩu không đúng')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <!-- Left Side: Login Form -->
    <div class="auth-form-side">
      <div class="form-container" data-aos="fade-right">
        <div class="form-header">
          <router-link to="/" class="back-link">
            <i class="bi bi-arrow-left me-2"></i> Quay về trang chủ
          </router-link>
          <h1 class="auth-title mt-4">Đăng nhập</h1>
          <p class="auth-subtitle">Vui lòng nhập thông tin để tiếp tục.</p>
        </div>

        <form @submit.prevent="handleLogin" class="mt-4">
          <div class="input-group-custom">
            <label>Tên đăng nhập</label>
            <div class="input-wrapper">
              <i class="bi bi-person"></i>
              <input v-model="username" type="text" placeholder="admin_xuxu" required>
            </div>
          </div>

          <div class="input-group-custom mt-4">
            <label>Mật khẩu</label>
            <div class="input-wrapper">
              <i class="bi bi-lock"></i>
              <input v-model="password" type="password" placeholder="••••••••" required>
            </div>
          </div>

          <button type="submit" class="btn-auth-submit mt-5" :disabled="loading">
            <span v-if="!loading">Đăng nhập ngay</span>
            <div v-else class="spinner-border spinner-border-sm" role="status"></div>
          </button>
        </form>

        <div class="form-footer mt-5">
          <p>Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link></p>
        </div>
      </div>
    </div>

    <!-- Right Side: Brand Imagery -->
    <div class="auth-image-side">
      <div class="image-overlay"></div>
      <img src="/ao-thun-co-tru-min.jpg" alt="Xuxu Premium">
      <div class="brand-content" data-aos="fade-up">
        <h2 class="brand-title">Xuxu Premium</h2>
        <p class="brand-tagline">Nâng tầm phong cách, khẳng định bản sắc.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #fff;
}

/* Image Side */
.auth-image-side {
  flex: 1.2;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-image-side img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.7));
  z-index: 1;
}

.brand-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 40px;
}

.brand-title {
  font-family: var(--heading-font);
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.brand-tagline {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 400;
}

/* Form Side */
.auth-form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: hsl(0, 0%, 98%);
}

.form-container {
  width: 100%;
  max-width: 420px;
}

.back-link {
  color: hsl(215, 20%, 50%);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--accent-color);
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: hsl(215, 25%, 20%);
  letter-spacing: -0.01em;
}

.auth-subtitle {
  color: hsl(215, 15%, 55%);
  margin-top: 8px;
}

/* Custom Inputs */
.input-group-custom label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: hsl(215, 20%, 40%);
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 16px;
  color: hsl(215, 15%, 70%);
  font-size: 1.1rem;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border-radius: 12px;
  border: 1px solid hsl(215, 20%, 90%);
  background: white;
  font-family: var(--default-font);
  transition: all 0.3s;
  outline: none;
}

.input-wrapper input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px hsla(194, 60%, 44%, 0.1);
}

/* Button */
.btn-auth-submit {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: var(--accent-color);
  color: white;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all 0.3s;
  box-shadow: 0 8px 20px hsla(194, 60%, 44%, 0.3);
}

.btn-auth-submit:hover:not(:disabled) {
  background: #2a88a3;
  transform: translateY(-2px);
  box-shadow: 0 12px 25px hsla(194, 60%, 44%, 0.4);
}

.btn-auth-submit:active {
  transform: translateY(0);
}

.btn-auth-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-footer p {
  color: hsl(215, 15%, 55%);
  font-size: 0.95rem;
}

.form-footer a {
  color: var(--accent-color);
  font-weight: 600;
  text-decoration: none;
}

/* Responsive */
@media (max-width: 991px) {
  .auth-image-side {
    display: none;
  }
}

@media (max-width: 576px) {
  .auth-form-side {
    padding: 24px;
  }
  .auth-title {
    font-size: 1.75rem;
  }
}
</style>
