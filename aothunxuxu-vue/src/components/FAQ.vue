<script setup>
import { ref } from 'vue'

const faqs = [
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
]

const toggleFaq = (index) => {
  faqs[index].isOpen = !faqs[index].isOpen
}
</script>

<template>
  <section id="faq" class="faq section">
    <div class="container section-title" data-aos="fade-up">
      <h2>Câu hỏi thường gặp</h2>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10" data-aos="fade-up" data-aos-delay="100">
          <div class="faq-container">
            <div v-for="(faq, index) in faqs" :key="index" class="faq-item" :class="{ 'faq-active': faq.isOpen }">
              <h3 @click="toggleFaq(index)">{{ faq.q }}</h3>
              <div class="faq-content" v-show="faq.isOpen">
                <p>{{ faq.a }}</p>
              </div>
              <i class="faq-toggle bi" :class="faq.isOpen ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-container {
  overflow: hidden;
}

.faq-item {
  position: relative;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0px 5px 25px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.faq-item h3 {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  margin: 0;
  padding: 0 30px 0 0;
  cursor: pointer;
  color: var(--heading-color);
  transition: 0.3s;
}

.faq-item h3:hover {
  color: var(--accent-color);
}

.faq-content {
  padding-top: 10px;
}

.faq-content p {
  margin-bottom: 0;
}

.faq-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 16px;
  line-height: 0;
  color: #c9ccd0;
}

.faq-active .faq-toggle {
  color: var(--accent-color);
}
</style>
