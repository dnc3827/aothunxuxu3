<script setup>
const services = [
  {
    icon: 'bi-calendar3',
    title: 'Thời gian làm việc:',
    description: 'Từ thứ 2 đến thứ 7<br>Sáng 8:30-12:00 - Chiều 13:30-18:00 hàng ngày.'
  },
  {
    icon: 'bi-heart',
    title: 'Tìm kiếm đối tác:',
    description: 'Nếu bạn đam mê kinh doanh, đặc biệt trong lĩnh vực in ấn, hãy liên hệ với chúng tôi.'
  },
  {
    icon: 'bi-phone',
    title: 'Thông tin liên hệ:',
    description: '076.771.0030 (Bán hàng)<br>081.771.0030 (Kỹ thuật)',
    link: '#contact'
  }
]
</script>

<template>
  <section id="featured-services" class="featured-services section light-background">
    <div class="container">
      <div class="row gy-4">
        <div v-for="(service, index) in services" :key="index" class="col-xl-4 col-lg-6" data-aos="fade-up" :data-aos-delay="100 * (index + 1)">
          <div class="service-item d-flex">
            <div class="icon flex-shrink-0"><i :class="['bi', service.icon]"></i></div>
            <div>
              <h4 class="title">
                <a :href="service.link || '#'" class="stretched-link">{{ service.title }}</a>
              </h4>
              <p class="description" v-html="service.description"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.service-item {
  padding: 30px;
  background: #fff;
  height: 100%;
  transition: 0.3s;
  border-radius: 10px;
  box-shadow: 0px 0 25px rgba(0, 0, 0, 0.05);
  position: relative;
}

.service-item:hover {
  box-shadow: 0px 0 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.icon {
  margin-right: 20px;
  color: var(--accent-color);
  font-size: 36px;
  line-height: 0;
}

.title {
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 18px;
}

.title a {
  color: var(--heading-color);
  text-decoration: none;
}

.description {
  line-height: 24px;
  font-size: 14px;
  margin-bottom: 0;
}
</style>
