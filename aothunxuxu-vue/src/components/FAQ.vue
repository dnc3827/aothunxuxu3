<script setup>
import { ref } from 'vue'

const faqs = ref([
  {
    q: 'Tôi cần đặt đồng phục (áo thun, tạp dề, nón,...), tem nhãn, name card, tờ rơi, voucher,...nhưng không có mẫu thì có làm được không?',
    a: 'Bạn có thể đưa ý tưởng, chúng tôi sẽ thiết kế theo yêu cầu của bạn',
    isOpen: true
  },
  {
    q: 'Làm đồng phục số lượng từ bao nhiêu là được?',
    a: 'Chúng tôi nhận làm đồng phục số lượng ít (5 cái, 10 cái,...) đến số lượng lớn (may theo yêu cầu khách hàng). Ngoài ra chúng tôi nhận in lẻ từ 1 áo (mẫu áo may sẵn hoặc áo khách hàng mang đến).',
    isOpen: false
  },
  {
    q: 'Giá cả đồng phục được tính như thế nào?',
    a: 'Tuỳ thuộc vào số lượng (nhiều hay ít), kiểu áo (cổ tròn, cổ bẻ, phối bo viền,...), chất liệu vải, size áo (lớn, nhỏ), nhiều vị trí in, thêu (trước, sau, tay trái, tay phải),.. mà giá sẽ khác nhau. Bạn có thể biết chính xác giá đồng phục khi liên hệ trực tiếp với chúng tôi qua số hotline 076 771 0030.',
    isOpen: false
  },
  {
    q: 'Thời gian làm xong đồng phục là bao lâu?',
    a: 'Từ 1 đến 3 ngày (mẫu áo và thiết kế có sẵn), 5-10 ngày may theo yêu cầu của khách hàng.',
    isOpen: false
  },
  {
    q: 'Có nhận in trên áo khách hàng mang tới?',
    a: 'Chúng tôi nhận in trên áo khách hàng mang đến.',
    isOpen: false
  }
])

const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}
</script>

<template>
  <section id="faq" class="faq section">
    <div class="container section-title" data-aos="fade-up">
      <h2 class="text-gradient">Câu hỏi thường gặp</h2>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10" data-aos="fade-up" data-aos-delay="100">
          <div class="faq-container">
            <div 
              v-for="(faq, index) in faqs" 
              :key="index" 
              class="faq-item" 
              :class="{ 'faq-active': faq.isOpen }"
              @click="toggleFaq(index)"
            >
              <div class="faq-header">
                <h3>{{ faq.q }}</h3>
                <i class="faq-toggle bi" :class="faq.isOpen ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
              </div>
              <div class="faq-content-wrapper">
                <div class="faq-content">
                  <p>{{ faq.a }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid #e2e8f0;
  padding: 18px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.faq-item:hover {
  background: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  border-color: var(--accent-color);
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.faq-item h3 {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
  color: #2c3e50;
  transition: color 0.3s;
}

.faq-active h3 {
  color: var(--accent-color);
}

.faq-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-active .faq-content-wrapper {
  grid-template-rows: 1fr;
}

.faq-content {
  overflow: hidden;
}

.faq-content p {
  padding-top: 15px;
  margin-bottom: 0;
  color: #5d6770;
  line-height: 1.6;
}

.faq-toggle {
  font-size: 1.2rem;
  color: #94a3b8;
  transition: all 0.3s;
}

.faq-active .faq-toggle {
  color: var(--accent-color);
  transform: rotate(180deg);
}

.text-gradient {
  background: linear-gradient(135deg, #1e293b 0%, #388da8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
