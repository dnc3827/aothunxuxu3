<script setup>
import { ref } from 'vue'

const activeTabA = ref('features-tab-1a')
const activeTabB = ref('features-tab-1b')
const activeTabC = ref('features-tab-1c')
const activeTabD = ref('features-tab-1d')

const categories = ref([
  {
    id: 'may-in-theu',
    title: 'Sản phẩm',
    subtitle: 'MAY - IN - THÊU ÁO THUN, NÓN, TẠP DỀ ĐỒNG PHỤC',
    activeTab: activeTabA,
    tabs: [
      { id: 'features-tab-1a', label: 'ÁO THUN CỔ TRÒN', desc: 'Cotton 100% hoặc Cotton 65%. Thấm hút mồ hôi tốt. Có nhiều màu sắc để lựa chọn.', img: '/ao-thun-co-tron-min.jpg' },
      { id: 'features-tab-2a', label: 'ÁO THUN CỔ TRỤ (CỔ BẺ)', desc: 'Hạt cá sấu mịn, đẹp. Không chảy vải giặt, không bám bẩn, không ra màu, bền.', img: '/ao-thun-co-tru-min.jpg' },
      { id: 'features-tab-3a', label: 'ÁO SƠ MI', desc: 'May theo yêu cầu. Có nhiều màu sắc để lựa chọn.', img: '/ao-so-mi-min.jpg' },
      { id: 'features-tab-4a', label: 'TẠP DỀ', desc: 'Tạp dề ngắn - dài. Có nhiều màu sắc để lựa chọn.', img: '/tap-de-min.jpg' },
      { id: 'features-tab-5a', label: 'NÓN ĐỒNG PHỤC', desc: 'Nón lưỡi trai - Nón kết - Nón tai bèo. Có nhiều màu sắc để lựa chọn.', img: '/non-dong-phuc-min.jpg' }
    ]
  },
  {
    id: 'bao-bi',
    title: '',
    subtitle: 'BAO BÌ TÚI BÓNG - TÚI NI LÔNG - TÚI GIẤY',
    activeTab: activeTabB,
    tabs: [
      { id: 'features-tab-1b', label: 'TÚI HỘT XOÀI LDPE', desc: 'Dạng túi cao cấp dành cho shop thời trang. Dẻo dai, rất đẹp.', img: '/bao-bi-min.jpg' },
      { id: 'features-tab-2b', label: 'TÚI QUAI SỮA', desc: 'Dùng đựng thực phẩm, tự phân huỷ, thân thiện môi trường.', img: '/baothu.jpg' },
      { id: 'features-tab-3b', label: 'TÚI NIÊM PHONG', desc: 'Dùng đóng gói sản phẩm, xé sẽ rách để niêm phong.', img: '/baothu.jpg' },
      { id: 'features-tab-4b', label: 'TÚI GIẤY', desc: 'Thân thiện môi trường, màu trắng hoặc da bò.', img: '/tui-giay.jpg' }
    ]
  },
  {
    id: 'quang-cao',
    title: '',
    subtitle: 'IN QUẢNG CÁO & GIA CÔNG IN QUẢNG CÁO',
    activeTab: activeTabC,
    tabs: [
      { id: 'features-tab-1c', label: 'BĂNG RÔN', desc: 'In băng rôn với chất liệu bạt Hiflex.', img: '/quang-cao-min.jpg' },
      { id: 'features-tab-2c', label: 'POSTER - TEM NHÃN', desc: 'In trên chất liệu decal trắng sữa, trong suốt.', img: '/bo-cuc-catalogue.jpg' },
      { id: 'features-tab-3c', label: 'PP STANDEE', desc: 'Dùng quảng cáo sự kiện, hình ảnh sắc nét.', img: '/toroi.jpg' },
      { id: 'features-tab-4c', label: 'TRANH VẢI CANVAS', desc: 'Kháng nước, tính thẩm mỹ cao dùng trang trí.', img: '/quang-cao-min.jpg' },
      { id: 'features-tab-5c', label: 'BACKLIT FILM', desc: 'Ứng dụng làm hộp đèn, Menu LED. Ưu điểm: không cần phải dán.', img: '/folder.webp' },
      { id: 'features-tab-6c', label: 'GIA CÔNG IN QUẢNG CÁO', desc: 'Đơn vị gia công vật liệu quảng cáo uy tín.', img: '/brochure.webp' }
    ]
  },
  {
    id: 'laser',
    title: '',
    subtitle: 'KHẮC LASER',
    activeTab: activeTabD,
    tabs: [
      { id: 'features-tab-1d', label: 'DỪA TRỌC ĐẦU', desc: 'Quà tặng lễ, liên hoan, sinh nhật.', img: '/dua-troc-dau-khac-laser-min.jpg' },
      { id: 'features-tab-2d', label: 'DƯA HẤU', desc: 'Trưng bày dịp Tết Nguyên Đán.', img: '/dua-hau-khac-laser-min.jpg' },
      { id: 'features-tab-3d', label: 'GỖ', desc: 'Khắc logo lên các sản phẩm gỗ.', img: '/khac-laser-tren-go-min.jpg' },
      { id: 'features-tab-4d', label: 'BÌNH GIỮ NHIỆT', desc: 'Làm quà tặng sự kiện.', img: '/binh-giu-nhiet-khac-laser-min.jpg' },
      { id: 'features-tab-5d', label: 'GIA CÔNG KHẮC LASER', desc: 'Khắc laser trên vật liệu khách hàng cung cấp.', img: '/gia-cong-khac-laser-min.jpg' }
    ]
  }
])

const getPlaceholder = (label) => `https://placehold.co/600x600?text=${label.replace(/\s+/g, '+')}`
</script>

<template>
  <div id="features-container">
    <section v-for="cat in categories" :key="cat.id" :id="cat.id" class="features section">
      <div class="container section-title" data-aos="fade-up">
        <h2 v-if="cat.title">{{ cat.title }}</h2>
        <h3 v-if="cat.subtitle">{{ cat.subtitle }}</h3>
      </div>

      <div class="container mt-n4">
        <div class="row justify-content-between g-4">
          <div class="col-lg-6">
            <ul class="nav nav-pills flex-column w-100" data-aos="fade-up" data-aos-delay="100">
              <li v-for="tab in cat.tabs" :key="tab.id" class="nav-item mb-2">
                <a 
                  class="nav-link d-flex align-items-start p-2" 
                  :class="{ 'active': cat.activeTab === tab.id }" 
                  @click.prevent="cat.activeTab = tab.id"
                >
                  <div class="icon-circle me-3">
                    <i class="bi bi-check"></i>
                  </div>
                  <div class="product-info">
                    <h4 class="mb-1"><u>{{ tab.label }}</u></h4>
                    <p class="text-muted small mb-0">{{ tab.desc }}</p>
                  </div>
                </a>
              </li>
            </ul>
            <div class="mt-4 ms-2">
               <router-link to="/products" class="btn btn-teal">
                 <span>Xem thêm</span> <i class="bi bi-arrow-right ms-2"></i>
               </router-link>
            </div>
          </div>

          <div class="col-lg-6 d-flex justify-content-end">
            <div class="tab-content w-100" data-aos="fade-up" data-aos-delay="200">
              <div 
                v-for="tab in cat.tabs" 
                :key="tab.id" 
                class="tab-pane fade h-100" 
                :class="{ 'active show': cat.activeTab === tab.id }"
              >
                <img :src="tab.img" :alt="tab.label" class="img-fluid product-display-img" @error="$event.target.src = getPlaceholder(tab.label)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 60px 0;
}

.section-title {
  margin-bottom: 30px;
}

.mt-n4 {
  margin-top: -20px;
}

.nav-pills .nav-link {
  background: transparent;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: 0.3s all ease;
  text-align: left;
  color: inherit;
  cursor: pointer;
}

.nav-pills .nav-link.active {
  background: #f0f7f9 !important;
  color: #388da8 !important;
  border-color: #e0eef1;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.nav-pills .nav-link h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #388da8;
  margin-top: 4px;
}

.nav-pills .nav-link p {
  font-size: 0.8rem;
  line-height: 1.4;
}

.icon-circle {
  width: 28px;
  height: 28px;
  min-width: 28px;
  border: 1px solid #388da8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #388da8;
  font-size: 1rem;
}

.product-display-img {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 4/5;
  object-fit: cover;
  border-radius: 12px;
  background-color: #f8f9fa;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.btn-teal {
  background-color: #3c8d9d;
  color: white;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  transition: 0.3s;
}

.btn-teal:hover {
  background-color: #2e6e7b;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 991px) {
  .product-display-img {
    max-height: 400px;
    margin-top: 20px;
  }
}
</style>
