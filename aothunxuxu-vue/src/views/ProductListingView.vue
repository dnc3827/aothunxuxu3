<template>
  <div class="product-page">
    <!-- Simple & Modern Hero -->
    <header class="page-hero">
      <div class="container text-center py-5" data-aos="fade-in">
        <span class="badge rounded-pill bg-light text-primary mb-3">BST 2024</span>
        <h1 class="display-4 fw-bold">Dịch vụ In ấn & Đồng phục</h1>
        <p class="lead text-muted">Giải pháp in ấn chất lượng cao, thiết kế độc bản theo yêu cầu.</p>
      </div>
    </header>

    <div class="container py-5">
      <!-- Search & Filter Area -->
      <div class="search-filter-section mb-5 p-4 bg-white shadow-sm rounded-4">
        <div class="row g-4 align-items-center">
          <div class="col-lg-8">
            <div class="category-scroll">
              <button 
                class="btn btn-filter" 
                :class="{ active: selectedCategory === '' }"
                @click="selectedCategory = ''; loadProducts()">
                Tất cả
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
                class="form-control rounded-pill border-0 bg-light px-4 py-2" 
                placeholder="Tìm kiếm sản phẩm..."
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
              <div class="badge-category position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill">
                {{ getCategoryName(product.category) }}
              </div>
            </div>
            <div class="card-body p-4 d-flex flex-column">
              <h5 class="card-title fw-bold mb-2">{{ product.name }}</h5>
              <p class="card-text text-muted small mb-4 flex-grow-1">
                {{ truncateText(product.description, 60) }}
              </p>
              <div class="d-flex justify-content-between align-items-center mt-auto">
                <span class="price-tag fw-bold text-primary">{{ formatPrice(product.price) }}</span>
                <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="openDetail(product)">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <transition name="fade">
        <div v-if="showDetailModal && selectedProduct" class="modal-overlay" @click.self="closeDetail">
          <div class="modal-content-custom card shadow-lg animate-slide-up">
            <button class="btn-close-custom" @click="closeDetail"><i class="bi bi-x-lg"></i></button>
            <div class="row g-0">
              <div class="col-md-6">
                <div class="modal-img-wrapper">
                  <img :src="selectedProduct.imageUrl || 'https://placehold.co/600x600/f8f9fa/3d4348?text=Áo+thun+Xuxu'" :alt="selectedProduct.name">
                </div>
              </div>
              <div class="col-md-6">
                <div class="card-body p-4 p-lg-5">
                  <span class="badge bg-light text-primary mb-2">{{ getCategoryName(selectedProduct.category) }}</span>
                  <h2 class="fw-bold mb-3">{{ selectedProduct.name }}</h2>
                  <div class="price-large mb-4">{{ formatPrice(selectedProduct.price) }}</div>
                  
                  <div class="description-section mb-4">
                    <h6 class="text-uppercase fw-bold small text-muted mb-2">Thông tin sản phẩm</h6>
                    <p class="text-secondary">{{ selectedProduct.description || 'Chưa có mô tả chi tiết cho sản phẩm này.' }}</p>
                  </div>

                  <div class="contact-section p-3 bg-light rounded-3">
                    <p class="small mb-2"><i class="bi bi-info-circle me-2"></i> Liên hệ để được tư vấn thiết kế miễn phí.</p>
                    <div class="d-flex gap-2">
                      <a href="tel:0901234567" class="btn btn-primary flex-grow-1 rounded-pill">Gọi ngay</a>
                      <button class="btn btn-outline-secondary rounded-pill" @click="closeDetail">Đóng</button>
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
import { ref, computed, onMounted } from 'vue'
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
  window.scrollTo({ top: 300, behavior: 'smooth' })
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

const viewDetail = (id) => router.push(`/products/${id}`)

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
  AOS.init({ duration: 800, once: true })
})
</script>

<style scoped>
.product-page {
  background-color: #fcfcfc;
  min-height: 100vh;
  font-size: 0.9rem;
}

.page-hero {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #eee;
  padding-top: 100px;
}

.page-hero h1 {
  font-size: 2rem;
}

.page-hero .lead {
  font-size: 0.95rem;
}

.search-filter-section {
  position: relative;
  margin-top: -50px;
  z-index: 10;
  border: 1px solid #eee;
}

.category-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: none;
}
.category-scroll::-webkit-scrollbar { display: none; }

.btn-filter {
  white-space: nowrap;
  background: white;
  border: 1px solid #eee;
  padding: 6px 16px;
  border-radius: 50px;
  color: #666;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.btn-filter:hover, .btn-filter.active {
  background: #3d4348;
  color: white;
  border-color: #3d4348;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.search-input-group {
  position: relative;
}
.search-input-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 0.9rem;
}
.search-input-group input {
  padding-left: 45px !important;
  font-size: 0.85rem;
}

/* Product Cards */
.product-card {
  transition: 0.4s ease;
  border-radius: 16px;
}
.shadow-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
}

.product-img-wrapper {
  aspect-ratio: 4/5;
  background-color: #f8f9fa;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.product-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.6s transform;
}
.product-card:hover .product-img-wrapper img {
  transform: scale(1.08);
}

.badge-category {
  background: rgba(255,255,255,0.95);
  color: #333;
  font-size: 0.7rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.card-title {
  font-size: 1rem;
}

.card-text {
  font-size: 0.8rem;
}

.price-tag {
  font-size: 1rem;
  color: #007bff;
}

.btn-sm {
  font-size: 0.75rem;
}

/* Pagination */
.pagination-modern .page-link {
  border: none;
  margin: 0 5px;
  border-radius: 50% !important;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-weight: 600;
  font-size: 0.85rem;
}
.pagination-modern .page-item.active .page-link {
  background-color: #3d4348;
  color: white;
}

/* Modal Details */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content-custom {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 24px;
  overflow: hidden;
  border: none;
  position: relative;
  background: white;
}

.contact-section {
  background: hsl(215, 30%, 97%) !important;
  border: 1px solid hsl(215, 30%, 92%);
}

.modal-img-wrapper {
  height: 100%;
  min-height: 400px;
  background: #f8f9fa;
}

.modal-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-large {
  font-size: 1.5rem;
  color: #0d6efd;
  font-weight: 700;
}

.btn-close-custom {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: 0.3s;
}

.btn-close-custom:hover {
  background: #f8f9fa;
  transform: rotate(90deg);
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 991px) {
  .search-filter-section { margin-top: 0; }
  .page-hero { padding-top: 80px; }
  .page-hero h1 { font-size: 1.5rem; }
  .modal-content-custom { overflow-y: auto; }
  .modal-img-wrapper { min-height: 300px; }
}
</style>
