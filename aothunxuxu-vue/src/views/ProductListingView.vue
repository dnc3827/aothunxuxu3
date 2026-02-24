<template>
  <div class="product-page">
    <!-- Luxury Lite Hero Slider -->
    <header class="hero-slider">
      <div class="slider-container">
        <transition-group name="slide-fade" tag="div" class="slides-wrapper">
          <div 
            v-for="(slide, index) in heroSlides" 
            :key="slide.id"
            v-show="currentSlide === index"
            class="hero-slide"
            :style="{ 
              backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${slide.image})` 
            }"
          >
            <div class="container text-center py-5" data-aos="zoom-out">
              <span class="badge rounded-pill bg-light text-primary mb-3 shadow-sm">{{ slide.badge }}</span>
              <h1 class="display-3 fw-bold hero-title">{{ slide.title }}</h1>
              <p class="lead hero-subtitle">{{ slide.desc }}</p>
            </div>
          </div>
        </transition-group>

        <!-- Slider Controls -->
        <button class="slider-btn prev" @click="prevSlide" aria-label="Previous slide">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="slider-btn next" @click="nextSlide" aria-label="Next slide">
          <i class="bi bi-chevron-right"></i>
        </button>

        <!-- Slider Indicators -->
        <div class="slider-indicators">
          <span 
            v-for="(_, index) in heroSlides" 
            :key="index"
            :class="{ active: currentSlide === index }"
            @click="setSlide(index)"
          ></span>
        </div>
      </div>
    </header>

    <div class="container py-5">
      <!-- Search & Filter Area (Luxury Lite) -->
      <div class="search-filter-section mb-5 p-4">
        <div class="row g-4 align-items-center">
          <div class="col-lg-8">
            <div class="category-scroll">
              <button 
                class="btn btn-filter" 
                :class="{ active: selectedCategory === '' }"
                @click="selectedCategory = ''; loadProducts()">
                Tất cả sản phẩm
              </button>
              <button 
                v-for="(label, key) in categoryMap"
                :key="key"
                class="btn btn-filter"
                :class="{ active: selectedCategory === key }"
                @click="selectedCategory = key; loadProducts()">
                {{ label }}
              </button>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="search-input-group">
              <i class="bi bi-search"></i>
              <input 
                v-model="searchKeyword" 
                @input="onSearchChange"
                type="text" 
                class="form-control rounded-pill border-0" 
                placeholder="Tìm kiếm cảm hứng..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Showcase Grid -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Đang tải sản phẩm...</p>
      </div>

      <div v-else-if="products.length === 0" class="empty-results text-center py-5">
        <i class="bi bi-box-seam display-1 text-muted mb-4 d-block"></i>
        <h3>Không tìm thấy sản phẩm nào</h3>
        <p class="text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
        <button class="btn btn-primary mt-3 px-4 rounded-pill" @click="resetFilters">Xem tất cả</button>
      </div>

      <div v-else class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        <div v-for="product in products" :key="product.id" class="col" data-aos="fade-up">
          <div class="card product-card border-0 h-100 shadow-hover transition">
            <div class="product-img-wrapper position-relative overflow-hidden">
              <img 
                :src="product.imageUrl || 'https://placehold.co/400x400/f8f9fa/3d4348?text=Áo+thun+Xuxu'" 
                class="card-img-top" 
                :alt="product.name"
                @error="$event.target.src = 'https://placehold.co/400x400/f8f9fa/3d4348?text=Áo+thun+Xuxu'"
              />
              <div class="badge-category position-absolute top-0 start-0 m-3 rounded-pill">
                {{ getCategoryName(product.category) }}
              </div>
            </div>
            <div class="card-body p-4 d-flex flex-column">
              <h5 class="card-title mb-2">{{ product.name }}</h5>
              <p class="card-text small mb-4 flex-grow-1">
                {{ truncateText(product.description, 60) }}
              </p>
              <div class="d-flex justify-content-between align-items-center mt-auto">
                <span class="price-tag fw-bold">{{ formatPrice(product.price) }}</span>
                <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="openDetail(product)">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Professional Detail Modal -->
      <transition name="fade">
        <div v-if="showDetailModal && selectedProduct" class="modal-overlay" @click.self="closeDetail">
          <div class="modal-content-custom card shadow-lg animate-slide-up">
            <!-- Fixed Header -->
            <div class="modal-header-fixed">
              <div class="d-flex justify-content-between align-items-center w-100 px-4 py-3">
                <span class="badge bg-light text-primary shadow-sm">{{ getCategoryName(selectedProduct.category) }}</span>
                <button class="btn-close-modern" @click="closeDetail"><i class="bi bi-x-lg"></i></button>
              </div>
            </div>

            <div class="modal-body-container scroll-container">
              <div class="row g-0 h-100">
                <!-- Left: Sticky Image -->
                <div class="col-md-6 sticky-image-col">
                  <div class="modal-img-wrapper">
                    <img :src="selectedProduct.imageUrl || 'https://placehold.co/600x600/f8f9fa/3d4348?text=Áo+thun+Xuxu'" :alt="selectedProduct.name">
                  </div>
                </div>

                <!-- Right: Content area with independent scroll and sticky footer -->
                <div class="col-md-6 d-flex flex-column right-content-wrapper">
                  <!-- Scrollable Content -->
                  <div class="scroll-content-col flex-grow-1" style="overflow-y: scroll;">
                    <div class="card-body p-4 p-lg-5 pt-5"> 
                      <div class="mt-4"></div> <!-- Extra spacing for header -->
                      <h2 class="fw-bold mb-3">{{ selectedProduct.name }}</h2>
                      <div class="price-large mb-4">{{ formatPrice(selectedProduct.price) }}</div>
                      
                      <div class="description-section mb-0">
                        <h6 class="text-uppercase fw-bold small text-muted mb-3">Thông tin sản phẩm</h6>
                        <div class="product-description-text text-secondary mb-5">
                          {{ selectedProduct.description || 'Chưa có mô tả chi tiết cho sản phẩm này.' }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Sticky Action Section (Outside Scroll) -->
                  <div class="modal-footer-sticky p-4 border-top bg-white">
                    <p class="small mb-3 text-muted"><i class="bi bi-info-circle me-2"></i> Liên hệ để được tư vấn thiết kế miễn phí.</p>
                    <div class="d-flex gap-2">
                      <a href="tel:0901234567" class="btn btn-primary flex-grow-1 rounded-pill py-3 fw-bold">Gọi ngay cho Xuxu</a>
                      <button class="btn btn-outline-secondary rounded-pill px-4" @click="closeDetail">Đóng</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Modern Pagination -->
      <nav v-if="totalPages > 1" class="mt-5 pt-4 d-flex justify-content-center">
        <ul class="pagination pagination-modern">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">‹</button>
          </li>
          
          <li v-for="page in displayPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">›</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useRouter } from 'vue-router'
import AOS from 'aos'

const productStore = useProductStore()
const router = useRouter()

// Sync categories with Admin & Home
const categoryMap = {
  AoThun: 'Áo thun',
  BaoBi: 'Bao bì',
  QuangCao: 'Quảng cáo',
  Laser: 'Khắc Laser',
  InAn: 'In ấn'
}

// Slider State
const currentSlide = ref(0)
const heroSlides = [
  { 
    id: 1, 
    badge: 'BST 2024', 
    title: 'Dịch vụ In ấn & Đồng phục', 
    desc: 'Giải pháp in ấn chất lượng cao, thiết kế độc bản theo yêu cầu.',
    image: '/dong-phuc-min.jpg'
  },
  { 
    id: 2, 
    badge: 'CHẤT LƯỢNG CAO', 
    title: 'Áo thun Đồng phục Cao cấp', 
    desc: 'Chất liệu thun cá sấu, cotton 100% thấm hút mồ hôi tốt.',
    image: '/ao-thun-co-tru-min.jpg'
  },
  { 
    id: 3, 
    badge: 'MỚI LẠ', 
    title: 'In Quảng cáo & Quà tặng', 
    desc: 'Băng rôn, tờ rơi, khắc laser trên dưa hấu, bình giữ nhiệt.',
    image: '/quang-cao-min.jpg'
  }
]
let sliderInterval = null

// State
const selectedCategory = ref('')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = 12
let searchDebounce = null

// Modal state
const showDetailModal = ref(false)
const selectedProduct = ref(null)

// Computed
const loading = computed(() => productStore.loading)
const products = computed(() => {
  const rs = productStore.searchResults
  if (!rs) return []
  return rs.items || rs.Items || []
})
const totalPages = computed(() => {
  const rs = productStore.searchResults
  return rs?.totalPages || rs?.TotalPages || 0
})

const displayPages = computed(() => {
  const pages = []
  const maxDisplay = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + maxDisplay - 1)
  if (end - start < maxDisplay - 1) start = Math.max(1, end - maxDisplay + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// Methods
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length
}

const setSlide = (index) => {
  currentSlide.value = index
  resetInterval()
}

const startInterval = () => {
  sliderInterval = setInterval(nextSlide, 3000)
}

const resetInterval = () => {
  if (sliderInterval) clearInterval(sliderInterval)
  startInterval()
}

const loadProducts = async () => {
  try {
    await productStore.fetchProducts({
      search: searchKeyword.value,
      category: selectedCategory.value,
      sortBy: 'newest',
      page: currentPage.value,
      pageSize
    })
  } catch (err) {
    console.error('Failed to load products:', err)
  }
}

const onSearchChange = () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    currentPage.value = 1
    loadProducts()
  }, 500)
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadProducts()
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

const resetFilters = () => {
  selectedCategory.value = ''
  searchKeyword.value = ''
  currentPage.value = 1
  loadProducts()
}

const formatPrice = (price) => {
  if (!price) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const getCategoryName = (category) => categoryMap[category] || category

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const openDetail = (product) => {
  selectedProduct.value = product
  showDetailModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeDetail = () => {
  showDetailModal.value = false
  setTimeout(() => {
    selectedProduct.value = null
    document.body.style.overflow = 'auto'
  }, 300)
}

onMounted(() => {
  loadProducts()
  startInterval()
  AOS.init({ duration: 800, once: true })
})

onUnmounted(() => {
  if (sliderInterval) clearInterval(sliderInterval)
})
</script>

<style scoped>
.product-page {
  background: linear-gradient(to right, #ffffff 0%, #ffffff 100%);
  min-height: 100vh;
  padding-bottom: 100px;
}

/* Hero Slider Styles */
.hero-slider {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.slider-container {
  height: 100%;
  position: relative;
}

.slides-wrapper {
  height: 100%;
}

.hero-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.hero-title {
  color: #1e293b;
  letter-spacing: -1.5px;
  line-height: 1.1;
  text-shadow: 0 2px 10px rgba(255,255,255,0.5);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #475569;
  max-width: 800px;
  margin: 20px auto 0;
}

/* Slider Controls */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
}

.slider-btn:hover {
  background: #3d8cae;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.slider-btn.prev { left: 30px; }
.slider-btn.next { right: 30px; }

/* Indicators */
.slider-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.slider-indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e1;
  cursor: pointer;
  transition: all 0.3s;
}

.slider-indicators span.active {
  background: #3d8cae;
  width: 30px;
  border-radius: 10px;
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.8s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Search & Filter Section */
.search-filter-section {
  position: relative;
  z-index: 20;
  margin-top: -40px;
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
}

.category-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: none;
}
.category-scroll::-webkit-scrollbar { display: none; }

.btn-filter {
  white-space: nowrap;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 10px 24px;
  border-radius: 50px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.4s;
}

.btn-filter:hover, .btn-filter.active {
  background: linear-gradient(to right, #3d8cae 0%, #3d8cae 100%);
  color: white;
  border-color: #3d8cae;
  box-shadow: 0 10px 20px rgba(61, 140, 174, 0.2);
  transform: translateY(-2px);
}

.search-input-group {
  position: relative;
}
.search-input-group i {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #3d8cae;
}
.search-input-group input {
  padding-left: 55px !important;
  font-size: 0.95rem;
  height: 52px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.search-input-group input:focus {
  background: #fff;
  border-color: #3d8cae;
  box-shadow: 0 0 0 4px rgba(61, 140, 174, 0.1);
}

/* Product Cards */
.product-card {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.shadow-hover:hover {
  transform: translateY(-15px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08) !important;
  border-color: rgba(61, 140, 174, 0.2);
}

.product-img-wrapper {
  aspect-ratio: 1/1;
  background-color: #f8fafc;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
}

.product-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: 0.6s transform;
}

.product-card:hover .product-img-wrapper img {
  transform: scale(1.1) rotate(-2deg);
}

.badge-category {
  background: rgba(255, 255, 255, 0.9);
  color: #3d8cae;
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
}

.price-tag {
  font-size: 1.25rem;
  color: #3d8cae;
  letter-spacing: -0.5px;
}

.btn-outline-primary {
  border-color: #3d8cae;
  color: #3d8cae;
}

.btn-outline-primary:hover {
  background: linear-gradient(to right, #3d8cae 0%, #3d8cae 100%);
  border-color: #3d8cae;
  color: white;
}

/* Pagination */
.pagination-modern .page-link {
  border: 1px solid #e2e8f0;
  margin: 0 6px;
  border-radius: 12px !important;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-weight: 700;
  transition: all 0.3s;
}

.pagination-modern .page-item.active .page-link {
  background: linear-gradient(to right, #3d8cae 0%, #3d8cae 100%);
  color: white;
  border-color: #3d8cae;
  box-shadow: 0 10px 20px rgba(61, 140, 174, 0.2);
}

/* Professional Modal Styling */
.modal-overlay {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(16px);
  z-index: 10000;
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content-custom {
  max-width: 1100px;
  width: 100%;
  height: 85vh; /* Fixed height for robust scrolling */
  min-height: 600px;
  border-radius: 32px;
  border: none;
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.25) !important;
  overflow: hidden;
  background: white;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-header-fixed {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0));
  pointer-events: none;
}

.modal-header-fixed > div {
  pointer-events: auto;
}

.btn-close-modern {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: #64748b;
}

.btn-close-modern:hover {
  background: #f8fafc;
  transform: rotate(90deg);
  color: #1e293b;
}

.modal-body-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.right-content-wrapper {
  height: 100%;
  overflow: hidden;
}

.modal-img-wrapper {
  width: 100%;
  height: 100%;
  max-height: 600px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-img-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
}

.modal-content-custom:hover .modal-img-wrapper img {
  transform: scale(1.05);
}

.scroll-content-col {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  flex: 1; /* Critical for scrolling inside flex */
}

.modal-footer-sticky {
  flex-shrink: 0; /* Don't shrink the footer */
  box-shadow: 0 -10px 30px rgba(0,0,0,0.03);
  z-index: 10;
  background: white;
}

.scroll-content-col::-webkit-scrollbar {
  width: 6px;
}
.scroll-content-col::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

.price-large {
  font-size: 2.5rem;
  color: #3d8cae;
  font-weight: 800;
  letter-spacing: -1.5px;
}

.product-description-text {
  line-height: 1.8;
  font-size: 1.05rem;
  white-space: pre-wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #3d8cae 0%, #2a6d82 100%);
  border: none;
  box-shadow: 0 10px 20px rgba(61, 140, 174, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(61, 140, 174, 0.35);
}

@media (max-width: 991px) {
  .modal-content-custom { 
    max-height: 95vh; 
    border-radius: 24px;
    margin: 10px;
  }
  .modal-body-container { overflow-y: auto; }
  .sticky-image-col { height: 350px; }
  .scroll-content-col { height: auto; overflow-y: visible; flex: none; }
  .modal-footer-sticky { position: sticky; bottom: 0; background: white; }
  .modal-img-wrapper { height: 350px; padding: 20px; }
  .price-large { font-size: 2rem; }
}
</style>
