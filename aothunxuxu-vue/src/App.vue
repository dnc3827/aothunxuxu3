<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ToastProvider from './components/ToastProvider.vue'

const route = useRoute()
const isAdminPage = computed(() => route.path.startsWith('/admin'))

const showPreloader = ref(true)
const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 100
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // Hide preloader after 1 second or when window is loaded
  setTimeout(() => {
    showPreloader.value = false
  }, 1000)
})
</script>

<template>
  <div id="app-wrapper">
    <!-- Preloader -->
    <div v-if="showPreloader" id="preloader"></div>

    <Navbar v-if="!isAdminPage" />

    <router-view />

    <Footer v-if="!isAdminPage" />

    <!-- Scroll Top -->
    <a 
      href="#" 
      id="scroll-top" 
      class="scroll-top d-flex align-items-center justify-content-center"
      :class="{ 'active': showScrollTop }"
      @click.prevent="scrollToTop"
    >
      <i class="bi bi-arrow-up-short"></i>
    </a>

    <ToastProvider />
  </div>
</template>

<style>
/* Global styles for main container */
.main {
  margin-top: 0;
}

/* Scroll Top Button */
.scroll-top {
  position: fixed;
  visibility: hidden;
  opacity: 0;
  right: 15px;
  bottom: 15px;
  z-index: 99999;
  background-color: var(--accent-color);
  width: 40px;
  height: 40px;
  border-radius: 4px;
  transition: all 0.4s;
}

.scroll-top i {
  font-size: 24px;
  color: #fff;
  line-height: 0;
}

.scroll-top:hover {
  background-color: #4ab1d1;
  color: #fff;
}

.scroll-top.active {
  visibility: visible;
  opacity: 1;
}

/* Preloader */
#preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  background-color: #fff;
  transition: all 0.6s ease-out;
}

#preloader:before {
  content: "";
  position: fixed;
  top: calc(50% - 30px);
  left: calc(50% - 30px);
  border: 6px solid #f2f2f2;
  border-top-color: var(--accent-color);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: animate-preloader 1s linear infinite;
}

@keyframes animate-preloader {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
