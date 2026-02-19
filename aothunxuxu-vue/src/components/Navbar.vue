<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const authStore = useAuthStore()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.classList.add('mobile-nav-active')
  } else {
    document.body.classList.remove('mobile-nav-active')
  }
}

const logout = () => {
  authStore.clearAuth()
  window.location.href = '/'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header id="header" :class="['header d-flex align-items-center fixed-top', { 'scrolled': isScrolled }]">
    <div class="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">

      <a href="/" class="logo d-flex align-items-center">
        <img src="/logo-xuxu.png" alt="logo áo thun xuxu" @error="$event.target.src = 'https://placehold.co/150x50?text=Logo+Xuxu'">
        <h1 class="sitename d-none d-sm-block">Áo thun xuxu</h1>
      </a>

      <nav id="navmenu" :class="['navmenu', { 'active': mobileMenuOpen }]">
        <ul>
          <li><a href="#hero" class="active">Trang chủ</a></li>
          <li><a href="#about">Giới thiệu</a></li>
          <li><a href="#features">Sản phẩm</a></li>
          <li><a href="#contact">Liên hệ</a></li>
          
          <!-- Auth mobile links -->
          <li class="d-xl-none" v-if="!authStore.isAuthenticated">
            <router-link to="/login" @click="toggleMobileMenu">Đăng nhập</router-link>
          </li>
          <li class="d-xl-none" v-if="!authStore.isAuthenticated">
            <router-link to="/register" @click="toggleMobileMenu">Đăng ký</router-link>
          </li>
          <li class="d-xl-none" v-if="authStore.isAdmin">
            <router-link to="/admin" @click="toggleMobileMenu">Quản lý</router-link>
          </li>
          <li class="d-xl-none" v-if="authStore.isAuthenticated">
            <a href="#" @click.prevent="logout">Đăng xuất</a>
          </li>
        </ul>
        <i class="mobile-nav-toggle d-xl-none bi bi-list" @click="toggleMobileMenu"></i>
      </nav>

      <div class="header-social-links d-flex align-items-center">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="auth-link d-none d-xl-block">Đăng nhập</router-link>
          <router-link to="/register" class="btn-getstarted d-none d-xl-block">Đăng ký</router-link>
        </template>
        <template v-else>
          <router-link v-if="authStore.isAdmin" to="/admin" class="auth-link d-none d-xl-block">Quản lý</router-link>
          <a href="#" @click.prevent="logout" class="btn-getstarted btn-red d-none d-xl-block">Đăng xuất</a>
        </template>
        
        <!-- Mobile support icon for auth -->
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="d-xl-none me-2 text-dark">
          <i class="bi bi-person-circle fs-4"></i>
        </router-link>
      </div>

    </div>
  </header>
</template>

<style scoped>
.header {
  transition: all 0.5s;
  z-index: 997;
  padding: 15px 0;
  background-color: #fff;
}

.header.scrolled {
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 0;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
}

.logo img {
  max-height: 40px;
  margin-right: 8px;
}

.sitename {
  font-size: 20px;
  font-weight: 700;
  color: #3d4348;
  margin: 0;
}

/* Nav Menu */
.navmenu {
  padding: 0;
}

.navmenu ul {
  margin: 0;
  padding: 0;
  display: flex;
  list-style: none;
  align-items: center;
}

.navmenu li {
  position: relative;
}

.navmenu a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  font-family: var(--nav-font);
  font-size: 15px;
  font-weight: 500;
  color: #3d4348;
  white-space: nowrap;
  transition: 0.3s;
  text-decoration: none;
}

.navmenu a:hover,
.navmenu .active {
  color: var(--accent-color);
}

/* Auth Links and Buttons */
.header-social-links {
  gap: 15px;
}

.auth-link {
  font-size: 15px;
  font-weight: 500;
  color: #3d4348;
  text-decoration: none;
  transition: 0.3s;
}

.auth-link:hover {
  color: var(--accent-color);
}

.btn-getstarted {
  background: var(--accent-color);
  color: #fff;
  padding: 8px 20px;
  border-radius: 50px;
  transition: 0.3s;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.btn-getstarted:hover {
  background: #2a6d82;
  color: #fff;
}

.btn-red {
  background: #e9ecef;
  color: #dc3545;
}

.btn-red:hover {
  background: #dc3545;
  color: #fff;
}

/* Mobile Navigation */
@media (max-width: 1199px) {
  .mobile-nav-toggle {
    color: #3d4348;
    font-size: 28px;
    cursor: pointer;
    line-height: 0;
    transition: 0.5s;
    margin-left: 15px;
  }

  .navmenu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    bottom: 0;
    background-color: #fff;
    box-shadow: -10px 0 20px rgba(0, 0, 0, 0.1);
    transition: 0.3s;
    z-index: 999;
    padding-top: 60px;
  }
  
  .navmenu.active {
    right: 0;
  }

  .navmenu ul {
    display: block;
  }

  .navmenu a {
    padding: 12px 20px;
    font-size: 16px;
  }
}
</style>
