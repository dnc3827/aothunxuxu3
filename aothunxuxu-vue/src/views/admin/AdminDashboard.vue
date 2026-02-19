<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productService, authService } from '../../api/services'
import apiClient from '../../api/client'
import SmartImport from '../../components/admin/SmartImport.vue'

const router = useRouter()
const products = ref([])
const loading = ref(true)
const showModal = ref(false)
const showImportModal = ref(false)
const modalLoading = ref(false)
const importFile = ref(null)
const importLoading = ref(false)

// Stats computed from products
const totalProducts = computed(() => products.value.length)
const totalValue = computed(() => products.value.reduce((acc, p) => acc + (Number(p.price) || 0), 0))
const categoryCount = computed(() => new Set(products.value.map(p => p.category)).size)

const initialForm = {
  id: 0,
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  category: 'AoThun'
}

const form = ref({ ...initialForm })
const isEditing = ref(false)

const fetchProducts = async () => {
  try {
    const response = await productService.getAll()
    products.value = response.data
  } catch (err) {
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authService.logout()
  router.push({ name: 'home' })
}

const openModal = (product = null) => {
  if (product) {
    form.value = { ...product }
    isEditing.value = true
  } else {
    form.value = { ...initialForm }
    isEditing.value = false
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiClient.post('/api/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    form.value.imageUrl = response.data.url
  } catch (err) {
    alert('Lỗi khi tải ảnh lên')
  }
}

const saveProduct = async () => {
  modalLoading.value = true
  try {
    if (isEditing.value) {
      await productService.update(form.value.id, form.value)
    } else {
      await productService.create(form.value)
    }
    await fetchProducts()
    closeModal()
  } catch (err) {
    alert('Lỗi khi lưu sản phẩm')
  } finally {
    modalLoading.value = false
  }
}

const deleteProduct = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    try {
      await productService.delete(id)
      await fetchProducts()
    } catch (err) {
      alert('Lỗi khi xóa sản phẩm')
    }
  }
  
}

const openImportModal = () => {
  showImportModal.value = true
}

const closeImportModal = () => {
  showImportModal.value = false
}

const onImported = async () => {
  showImportModal.value = false
  await fetchProducts()
}

// Category badge colors
const getCategoryBadgeClass = (cat) => {
  const map = {
    AoThun: 'bg-primary-subtle text-primary',
    BaoBi: 'bg-success-subtle text-success',
    QuangCao: 'bg-warning-subtle text-warning',
    Laser: 'bg-danger-subtle text-danger',
    InAn: 'bg-info-subtle text-info'
  }
  return map[cat] || 'bg-secondary-subtle text-secondary'
}

onMounted(fetchProducts)
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-box">
          <i class="bi bi-rocket-takeoff-fill"></i>
          <span>XUXU ADMIN</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-label">Main Menu</div>
        <a href="#" class="nav-link active">
          <i class="bi bi-grid-1x2-fill"></i>
          <span>Dashboard</span>
        </a>
        <a href="#" class="nav-link">
          <i class="bi bi-box-seam-fill"></i>
          <span>Sản phẩm</span>
          <span class="badge rounded-pill bg-primary ms-auto">{{ totalProducts }}</span>
        </a>
        <a href="#" class="nav-link">
          <i class="bi bi-cart-fill"></i>
          <span>Đơn hàng</span>
        </a>
        
        <div class="nav-label mt-4">Settings</div>
        <a href="#" class="nav-link">
          <i class="bi bi-person-fill-gear"></i>
          <span>Tài khoản</span>
        </a>
        <a href="#" @click.prevent="handleLogout" class="nav-link logout text-danger">
          <i class="bi bi-box-arrow-left"></i>
          <span>Đăng xuất</span>
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <h5 class="mb-0 fw-bold text-dark d-none d-md-block">Hệ thống quản trị</h5>
        </div>
        <div class="topbar-actions">
          <router-link to="/" class="btn btn-outline-secondary rounded-pill btn-sm px-3">
            <i class="bi bi-house-door me-1"></i> Quay về trang chủ
          </router-link>
        </div>
      </header>

      <div class="content-body">
        <!-- Header Section -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 class="fw-bold mb-1">Tổng quan hệ thống</h4>
            <p class="text-muted small mb-0">Chào mừng bạn quay trở lại, đây là số liệu hôm nay.</p>
          </div>
          <div class="d-flex gap-2">
            <button @click="openImportModal()" class="btn btn-success shadow-sm text-white">
              <i class="bi bi-file-earmark-spreadsheet me-2"></i> Nhập Excel
            </button>
            <button @click="openModal()" class="btn btn-primary shadow-sm">
              <i class="bi bi-plus-lg me-2"></i> Thêm sản phẩm
            </button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="row g-4 mb-5">
          <div class="col-md-4">
            <div class="metric-card">
              <div class="metric-icon bg-primary-subtle text-primary">
                <i class="bi bi-box-seam"></i>
              </div>
              <div class="metric-info">
                <span class="label">Tổng sản phẩm</span>
                <span class="value">{{ totalProducts }}</span>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="metric-card">
              <div class="metric-icon bg-success-subtle text-success">
                <i class="bi bi-tags"></i>
              </div>
              <div class="metric-info">
                <span class="label">Danh mục</span>
                <span class="value">{{ categoryCount }}</span>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="metric-card">
              <div class="metric-icon bg-warning-subtle text-warning">
                <i class="bi bi-currency-dollar"></i>
              </div>
              <div class="metric-info">
                <span class="label">Giá trị trung bình</span>
                <span class="value">{{ (totalValue / (totalProducts || 1)).toLocaleString('vi-VN') }}đ</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header bg-white border-0 py-3">
            <h6 class="fw-bold mb-0">Danh sách sản phẩm</h6>
          </div>
          
          <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4">Sản phẩm</th>
                  <th>Phân loại</th>
                  <th>Giá niên yết</th>
                  <th class="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td class="ps-4">
                    <div class="d-flex align-items-center">
                      <img :src="product.imageUrl || 'https://placehold.co/50x50?text=No+Img'" :alt="product.name" class="product-thumb me-3">
                      <div>
                        <div class="fw-bold">{{ product.name }}</div>
                        <div class="text-muted x-small">ID: #{{ product.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge rounded-pill px-3" :class="getCategoryBadgeClass(product.category)">
                      {{ product.category }}
                    </span>
                  </td>
                  <td class="fw-bold text-dark">{{ product.price.toLocaleString('vi-VN') }}đ</td>
                  <td class="text-end pe-4">
                    <div class="d-flex justify-content-end gap-2">
                      <button @click="openModal(product)" class="btn btn-icon-sm btn-light-primary" title="Chỉnh sửa">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button @click="deleteProduct(product.id)" class="btn btn-icon-sm btn-light-danger" title="Xóa">
                        <i class="bi bi-trash3"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="products.length === 0">
                  <td colspan="4" class="text-center py-5 text-muted">
                    <i class="bi bi-inbox display-4 d-block mb-3"></i>
                    Chưa có sản phẩm nào. Hãy bắt đầu thêm mới!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Form Overhaul -->
    <transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content-custom card border-0 shadow-lg animate-slide-in">
          <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center p-4 pb-0">
            <h5 class="fw-bold mb-0">{{ isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}</h5>
            <button @click="closeModal" class="btn-close-custom-dark"><i class="bi bi-x"></i></button>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="saveProduct">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label small fw-bold">Tên sản phẩm</label>
                  <input v-model="form.name" type="text" class="form-control" placeholder="Nhập tên sản phẩm..." required>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Giá bán (VND)</label>
                  <div class="input-group">
                    <input v-model.number="form.price" type="number" class="form-control" placeholder="0" required>
                    <span class="input-group-text bg-light">đ</span>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold">Phân loại</label>
                  <select v-model="form.category" class="form-select">
                    <option value="AoThun">Áo Thun</option>
                    <option value="BaoBi">Bao Bì</option>
                    <option value="QuangCao">Quảng Cáo</option>
                    <option value="Laser">Khắc Laser</option>
                    <option value="InAn">In Ấn</option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label small fw-bold">Mô tả sản phẩm</label>
                  <textarea v-model="form.description" class="form-control" rows="4" placeholder="Nhập mô tả chi tiết..."></textarea>
                </div>

                <div class="col-12">
                  <label class="form-label small fw-bold">Hình ảnh sản phẩm</label>
                  <div class="upload-area mb-3">
                    <img v-if="form.imageUrl" :src="form.imageUrl" class="preview-img">
                    <div v-else class="upload-placeholder">
                      <i class="bi bi-cloud-arrow-up"></i>
                      <span>Click để tải ảnh lên</span>
                    </div>
                    <input type="file" @change="handleFileUpload" class="file-input" accept="image/*">
                  </div>
                  <input v-model="form.imageUrl" type="text" class="form-control form-control-sm" placeholder="Hoặc dán link ảnh vào đây">
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2 mt-4 pt-3">
                <button type="button" @click="closeModal" class="btn btn-light px-4">Hủy bỏ</button>
                <button type="submit" class="btn btn-primary px-4" :disabled="modalLoading">
                  {{ modalLoading ? 'Đang xử lý...' : 'Lưu dữ liệu' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
    <!-- Smart Import Modal -->
    <SmartImport v-if="showImportModal" @close="closeImportModal" @imported="onImported" />
  </div>
</template>

<style scoped>
/* Layout */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f4f7f6;
  color: #334155;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar-header {
  padding: 30px 24px;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: 1px;
}

.logo-box i {
  color: #38bdf8;
  font-size: 1.5rem;
}

.sidebar-nav {
  padding: 0 16px;
}

.nav-label {
  padding: 0 12px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 700;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 12px;
  transition: 0.3s;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.05);
  color: white;
}

.nav-link.active {
  background-color: #38bdf8;
  color: white;
}

.nav-link.logout:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

/* Topbar */
.topbar {
  height: 70px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 90;
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-bar input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.85rem;
  outline: none;
  transition: 0.3s;
}

.search-bar input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background-color: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.btn-icon:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 20px;
  border-left: 1px solid #e2e8f0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.user-info .name {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
}

.user-info .role {
  display: block;
  font-size: 0.7rem;
  color: #94a3b8;
}

/* Content Body */
.content-body {
  padding: 32px;
}

/* Metric Cards */
.metric-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.metric-info .label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 600;
}

.metric-info .value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

/* Table Enhancements */
.product-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 12px;
  background-color: #f1f5f9;
}

.btn-icon-sm {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: 0.3s;
}

.btn-light-primary {
  background-color: #eff6ff;
  color: #2563eb;
}
.btn-light-primary:hover {
  background-color: #2563eb;
  color: white;
}

.btn-light-danger {
  background-color: #fef2f2;
  color: #dc2626;
}
.btn-light-danger:hover {
  background-color: #dc2626;
  color: white;
}

.x-small {
  font-size: 0.7rem;
}

/* Form Upload Area */
.upload-area {
  width: 100%;
  height: 120px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: 0.3s;
}

.upload-area:hover {
  border-color: #38bdf8;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 8px;
}

.upload-placeholder i {
  font-size: 1.5rem;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f8fafc;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content-custom {
  width: 100%;
  max-width: 600px;
  border-radius: 24px;
}

.btn-close-custom-dark {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: 0.3s;
}

.btn-close-custom-dark:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-slide-in {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from { transform: scale(0.9) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

@media (max-width: 991px) {
  .sidebar { width: 80px; }
  .sidebar .logo-box span, .sidebar .nav-link span, .sidebar .nav-label { display: none; }
  .main-content { margin-left: 80px; }
  .topbar { padding: 0 16px; }
  .search-bar { width: 150px; }
}
</style>

