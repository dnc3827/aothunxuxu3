<script setup>
import { ref, computed } from 'vue'
import { productService } from '../../api/services'

const emit = defineEmits(['close', 'imported'])

// ─── State ───────────────────────────────────────────────────
const step = ref(1) // 1=Upload, 2=Mapping, 3=Preview/Confirm

const file = ref(null)
const isDragging = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Step 2 data
const headers = ref([])            // [{ index, original, detectedField }]
const previewRows = ref([])        // [[val, val, ...], ...]
const totalRows = ref(0)
const tempFilename = ref('')
const headerRowIndex = ref(0)

// Mapping: { name: null|colIndex, price: null|colIndex, ... }
const FIELDS = [
  { key: 'name',        label: 'Tên sản phẩm', required: true },
  { key: 'price',       label: 'Giá',           required: true },
  { key: 'category',    label: 'Danh mục',      required: false },
  { key: 'description', label: 'Mô tả',         required: false },
  { key: 'imageUrl',    label: 'Link ảnh',      required: false },
]
const mapping = ref({})

// Step 3 data
const importResult = ref(null)

// ─── Computed ─────────────────────────────────────────────────
const mappingComplete = computed(() =>
  FIELDS.filter(f => f.required).every(f => mapping.value[f.key] !== undefined && mapping.value[f.key] !== '')
)

// ─── Step 1: File handling ────────────────────────────────────
const onFileChange = (e) => {
  const f = e.target.files[0]
  if (f) setFile(f)
}

const onDrop = (e) => {
  isDragging.value = false
  const f = e.dataTransfer.files[0]
  if (f) setFile(f)
}

const setFile = (f) => {
  const allowed = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ]
  if (!allowed.includes(f.type) && !f.name.match(/\.(xls|xlsx|csv)$/i)) {
    errorMsg.value = 'Chỉ chấp nhận file .xls, .xlsx hoặc .csv!'
    return
  }
  errorMsg.value = ''
  file.value = f
}

const parseFile = async () => {
  if (!file.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file.value)
    const res = await productService.importParse(fd)
    headers.value = res.data.headers
    previewRows.value = res.data.previewRows
    totalRows.value = res.data.totalRows
    tempFilename.value = res.data.tempFilename
    headerRowIndex.value = res.data.headerRowIndex

    // Auto-apply detected mappings
    const m = {}
    for (const h of headers.value) {
      if (h.detectedField) m[h.detectedField] = String(h.index)
    }
    mapping.value = m
    step.value = 2
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Lỗi đọc file! Vui lòng kiểm tra định dạng.'
  } finally {
    loading.value = false
  }
}

// ─── Step 3: Confirm ──────────────────────────────────────────
const confirmImport = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await productService.importConfirm({
      tempFilename: tempFilename.value,
      headerRowIndex: headerRowIndex.value,
      mapping: mapping.value
    })
    importResult.value = res.data
    step.value = 3
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Lỗi khi lưu dữ liệu!'
  } finally {
    loading.value = false
  }
}

const finish = () => {
  emit('imported')
  emit('close')
}

const reset = () => {
  step.value = 1
  file.value = null
  headers.value = []
  previewRows.value = []
  mapping.value = {}
  importResult.value = null
  errorMsg.value = ''
  successMsg.value = ''
}

const previewMapped = computed(() => {
  return previewRows.value.map(row => {
    const obj = {}
    for (const f of FIELDS) {
      const idx = mapping.value[f.key]
      obj[f.key] = (idx !== undefined && idx !== '') ? (row[Number(idx)] || '') : '—'
    }
    return obj
  })
})
</script>

<template>
  <div class="smart-import-overlay" @click.self="$emit('close')">
    <div class="smart-import-modal">

      <!-- Header -->
      <div class="si-header">
        <div class="si-header-left">
          <i class="bi bi-file-earmark-spreadsheet-fill si-icon-main"></i>
          <div>
            <h5 class="si-title">Nhập sản phẩm từ Excel</h5>
            <small class="si-subtitle">Hệ thống thông minh – Không cần chỉnh sửa file trước!</small>
          </div>
        </div>
        <button class="si-close" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
      </div>

      <!-- Steps indicator -->
      <div class="si-steps">
        <div v-for="(s, i) in ['Tải lên', 'Khớp cột', 'Kết quả']" :key="i"
             :class="['si-step', { active: step === i+1, done: step > i+1 }]">
          <div class="si-step-num">
            <i v-if="step > i+1" class="bi bi-check-lg"></i>
            <span v-else>{{ i+1 }}</span>
          </div>
          <span class="si-step-label">{{ s }}</span>
        </div>
        <div class="si-step-line"></div>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="si-alert si-alert-error">
        <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMsg }}
      </div>

      <!-- ━━━━━━━━━━━━━━ STEP 1: UPLOAD ━━━━━━━━━━━━━━ -->
      <div v-if="step === 1" class="si-body">
        <div
          class="si-dropzone"
          :class="{ dragging: isDragging, 'has-file': !!file }"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="onDrop"
        >
          <input type="file" id="si-file-input" accept=".xls,.xlsx,.csv" class="si-file-input" @change="onFileChange" />
          <label for="si-file-input" class="si-dropzone-label">
            <i class="bi" :class="file ? 'bi-file-earmark-check-fill si-icon-success' : 'bi-cloud-upload-fill si-icon-upload'"></i>
            <span v-if="!file">
              <strong>Kéo thả</strong> file vào đây hoặc <strong>click để chọn</strong>
            </span>
            <span v-else class="si-filename">
              <strong>{{ file.name }}</strong> <small>({{ (file.size / 1024).toFixed(1) }} KB)</small>
            </span>
          </label>
        </div>

        <div class="si-tips">
          <p><i class="bi bi-info-circle-fill"></i> <strong>Mẹo:</strong> Hệ thống tự nhận tiêu đề cột – dù cột nằm ở bất kỳ vị trí nào!</p>
          <p><i class="bi bi-check2-circle"></i> Hỗ trợ file Excel có cột thừa (Ngày nhập, Ngày bán...) – sẽ được bỏ qua tự động.</p>
        </div>

        <div class="si-actions">
          <button class="btn-si btn-outline" @click="$emit('close')">Hủy</button>
          <button class="btn-si btn-primary" :disabled="!file || loading" @click="parseFile">
            <span v-if="loading"><i class="bi bi-arrow-repeat spin"></i> Đang đọc...</span>
            <span v-else>Tiếp theo <i class="bi bi-arrow-right"></i></span>
          </button>
        </div>
      </div>

      <!-- ━━━━━━━━━━━━━━ STEP 2: MAPPING ━━━━━━━━━━━━━━ -->
      <div v-else-if="step === 2" class="si-body">
        <div class="si-mapping-info">
          <i class="bi bi-magic"></i>
          Yasar đã đọc được <strong>{{ totalRows }} dòng dữ liệu</strong> và <strong>{{ headers.length }} cột</strong>.
          Hãy xác nhận hoặc điều chỉnh cột tương ứng bên dưới.
        </div>

        <div class="si-mapping-grid">
          <div v-for="field in FIELDS" :key="field.key" class="si-mapping-row">
            <div class="si-field-label">
              {{ field.label }}
              <span v-if="field.required" class="si-required">*</span>
            </div>
            <div class="si-arrow"><i class="bi bi-arrow-right"></i></div>
            <select v-model="mapping[field.key]" class="si-select" :class="{ 'detected': !!mapping[field.key] }">
              <option value="">-- Bỏ qua --</option>
              <option v-for="h in headers" :key="h.index" :value="String(h.index)">
                {{ h.original }}
                <template v-if="h.detectedField === field.key"> ✓ (Tự động nhận diện)</template>
              </option>
            </select>
          </div>
        </div>

        <!-- Preview table -->
        <div v-if="previewMapped.length > 0" class="si-preview">
          <div class="si-preview-title"><i class="bi bi-eye-fill"></i> Xem trước (5 dòng đầu)</div>
          <div class="si-table-wrap">
            <table class="si-table">
              <thead>
                <tr>
                  <th v-for="f in FIELDS" :key="f.key">{{ f.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in previewMapped" :key="ri">
                  <td v-for="f in FIELDS" :key="f.key" :class="{ 'si-cell-empty': row[f.key] === '—' && f.required }">
                    {{ row[f.key] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="si-actions">
          <button class="btn-si btn-outline" @click="reset">← Quay lại</button>
          <button class="btn-si btn-primary" :disabled="!mappingComplete || loading" @click="confirmImport">
            <span v-if="loading"><i class="bi bi-arrow-repeat spin"></i> Đang lưu...</span>
            <span v-else>Nhập {{ totalRows }} sản phẩm <i class="bi bi-cloud-check"></i></span>
          </button>
        </div>
      </div>

      <!-- ━━━━━━━━━━━━━━ STEP 3: RESULT ━━━━━━━━━━━━━━ -->
      <div v-else-if="step === 3 && importResult" class="si-body si-result">
        <div class="si-result-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <h4 class="si-result-title">Import hoàn thành!</h4>

        <div class="si-stats">
          <div class="si-stat si-stat-success">
            <span class="si-stat-num">{{ importResult.imported }}</span>
            <span class="si-stat-label">Đã nhập</span>
          </div>
          <div class="si-stat si-stat-warning">
            <span class="si-stat-num">{{ importResult.skipped }}</span>
            <span class="si-stat-label">Bỏ qua</span>
          </div>
          <div class="si-stat si-stat-info">
            <span class="si-stat-num">{{ importResult.duplicates }}</span>
            <span class="si-stat-label">Trùng lặp</span>
          </div>
        </div>

        <!-- Duplicate list -->
        <div v-if="importResult.duplicateNames?.length" class="si-dup-list">
          <p class="si-dup-title"><i class="bi bi-exclamation-circle"></i> Sản phẩm trùng (không được nhập lại):</p>
          <ul>
            <li v-for="name in importResult.duplicateNames" :key="name">{{ name }}</li>
          </ul>
        </div>

        <!-- Error list -->
        <div v-if="importResult.errors?.length" class="si-err-list">
          <p class="si-err-title"><i class="bi bi-x-circle"></i> Dòng lỗi dữ liệu:</p>
          <ul>
            <li v-for="e in importResult.errors" :key="e.row">Dòng {{ e.row }}: {{ e.message }}</li>
          </ul>
        </div>

        <div class="si-actions si-actions-center">
          <button class="btn-si btn-outline" @click="reset"><i class="bi bi-upload"></i> Nhập file khác</button>
          <button class="btn-si btn-primary" @click="finish">Hoàn tất <i class="bi bi-check2"></i></button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ─── Layout ───────────────────────────── */
.smart-import-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(10, 12, 20, 0.75);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
  padding: 1rem;
}
.smart-import-modal {
  background: #1a1d2e;
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 1.25rem;
  width: 100%; max-width: 780px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  display: flex; flex-direction: column;
}

/* ─── Header ──────────────────────────── */
.si-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(99,102,241,0.15);
}
.si-header-left { display: flex; align-items: center; gap: 1rem; }
.si-icon-main { font-size: 2rem; color: #6366f1; }
.si-title { margin: 0; font-size: 1.1rem; font-weight: 700; color: #e2e8f0; }
.si-subtitle { color: #94a3b8; font-size: 0.8rem; }
.si-close {
  background: none; border: none; color: #94a3b8;
  font-size: 1.2rem; cursor: pointer; padding: 0.25rem;
  transition: color 0.2s;
}
.si-close:hover { color: #e2e8f0; }

/* ─── Steps ──────────────────────────── */
.si-steps {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 1rem 1.5rem;
  position: relative;
  border-bottom: 1px solid rgba(99,102,241,0.1);
}
.si-step {
  display: flex; align-items: center; gap: 0.5rem;
  flex: 1; z-index: 1;
}
.si-step-num {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700;
  background: rgba(99,102,241,0.1); color: #6366f1;
  border: 2px solid rgba(99,102,241,0.3);
  transition: all 0.3s;
}
.si-step.active .si-step-num {
  background: #6366f1; color: white; border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.25);
}
.si-step.done .si-step-num { background: #10b981; color: white; border-color: #10b981; }
.si-step-label { font-size: 0.8rem; color: #64748b; font-weight: 500; }
.si-step.active .si-step-label { color: #6366f1; }
.si-step.done .si-step-label { color: #10b981; }

/* ─── Body ───────────────────────────── */
.si-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
.si-alert {
  margin: 0 1.5rem;
  padding: 0.7rem 1rem; border-radius: 0.5rem;
  font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;
}
.si-alert-error { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }

/* ─── Dropzone ───────────────────────── */
.si-dropzone {
  border: 2px dashed rgba(99,102,241,0.4);
  border-radius: 0.75rem; padding: 2rem 1.5rem;
  text-align: center; transition: all 0.2s; cursor: pointer;
  background: rgba(99,102,241,0.04);
}
.si-dropzone.dragging, .si-dropzone:hover {
  border-color: #6366f1; background: rgba(99,102,241,0.1);
}
.si-dropzone.has-file { border-color: #10b981; background: rgba(16,185,129,0.06); }
.si-file-input { display: none; }
.si-dropzone-label { cursor: pointer; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.si-icon-upload { font-size: 3rem; color: #6366f1; }
.si-icon-success { font-size: 3rem; color: #10b981; }
.si-filename { color: #10b981; font-size: 1rem; }

/* ─── Tips ───────────────────────────── */
.si-tips {
  background: rgba(99,102,241,0.06); border-radius: 0.5rem;
  padding: 0.75rem 1rem; font-size: 0.8rem; color: #94a3b8;
}
.si-tips p { margin: 0.25rem 0; display: flex; align-items: flex-start; gap: 0.5rem; }
.si-tips i { color: #6366f1; margin-top: 2px; flex-shrink: 0; }

/* ─── Mapping ────────────────────────── */
.si-mapping-info {
  background: rgba(99,102,241,0.08); border-radius: 0.75rem;
  padding: 0.75rem 1rem; color: #a5b4fc; font-size: 0.875rem;
  display: flex; align-items: center; gap: 0.5rem;
}
.si-mapping-grid { display: flex; flex-direction: column; gap: 0.5rem; }
.si-mapping-row {
  display: grid; grid-template-columns: 160px auto 1fr;
  align-items: center; gap: 0.75rem;
}
.si-field-label { font-size: 0.875rem; font-weight: 600; color: #e2e8f0; }
.si-required { color: #f87171; margin-left: 2px; }
.si-arrow { color: #4b5563; }
.si-select {
  background: #0f1117; border: 1px solid rgba(99,102,241,0.3);
  color: #94a3b8; border-radius: 0.5rem; padding: 0.45rem 0.75rem;
  font-size: 0.85rem; transition: border-color 0.2s; width: 100%;
}
.si-select:focus { border-color: #6366f1; outline: none; color: #e2e8f0; }
.si-select.detected { border-color: #10b981; color: #6ee7b7; }

/* ─── Preview Table ──────────────────── */
.si-preview { }
.si-preview-title { font-size: 0.85rem; color: #6366f1; font-weight: 600; margin-bottom: 0.5rem; }
.si-table-wrap { overflow-x: auto; border-radius: 0.5rem; }
.si-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
.si-table th {
  background: rgba(99,102,241,0.15); color: #a5b4fc;
  padding: 0.5rem 0.75rem; text-align: left; font-weight: 600; white-space: nowrap;
}
.si-table td { padding: 0.4rem 0.75rem; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.05); }
.si-table tr:last-child td { border-bottom: none; }
.si-cell-empty { color: #ef4444 !important; font-style: italic; }

/* ─── Result ─────────────────────────── */
.si-result { align-items: center; text-align: center; }
.si-result-icon { font-size: 3.5rem; color: #10b981; }
.si-result-title { margin: 0; font-size: 1.2rem; font-weight: 700; color: #e2e8f0; }
.si-stats { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.si-stat {
  border-radius: 0.75rem; padding: 0.75rem 1.5rem;
  display: flex; flex-direction: column; align-items: center; min-width: 90px;
}
.si-stat-success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); }
.si-stat-warning { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); }
.si-stat-info { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); }
.si-stat-num { font-size: 1.8rem; font-weight: 800; }
.si-stat-success .si-stat-num { color: #10b981; }
.si-stat-warning .si-stat-num { color: #f59e0b; }
.si-stat-info .si-stat-num { color: #6366f1; }
.si-stat-label { font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem; }

.si-dup-list, .si-err-list {
  width: 100%; text-align: left;
  background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2);
  border-radius: 0.5rem; padding: 0.75rem 1rem; font-size: 0.8rem;
}
.si-err-list { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.2); }
.si-dup-title, .si-err-title { color: #f59e0b; font-weight: 600; margin: 0 0 0.5rem; }
.si-err-title { color: #f87171; }
.si-dup-list ul, .si-err-list ul { margin: 0; padding-left: 1.25rem; color: #94a3b8; }

/* ─── Actions ────────────────────────── */
.si-actions { display: flex; justify-content: flex-end; gap: 0.75rem; flex-wrap: wrap; }
.si-actions-center { justify-content: center; }
.btn-si {
  padding: 0.55rem 1.25rem; border-radius: 0.5rem;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  border: none; display: flex; align-items: center; gap: 0.4rem;
  transition: all 0.2s;
}
.btn-primary { background: #6366f1; color: white; }
.btn-primary:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-outline {
  background: transparent; color: #94a3b8;
  border: 1px solid rgba(99,102,241,0.3);
}
.btn-outline:hover { border-color: #6366f1; color: #a5b4fc; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { display: inline-block; animation: spin 0.8s linear infinite; }
</style>
