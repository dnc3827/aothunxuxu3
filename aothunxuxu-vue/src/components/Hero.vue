<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'

onMounted(() => {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  })
})
</script>

<template>
  <section id="hero" class="hero section">
    <div class="hero-bg">
      <img src="https://placehold.co/1920x1080?text=Hero+Background" alt="" class="bg-img" style="opacity: 0.1;">
    </div>
    <div class="container text-center">
      <div class="d-flex flex-column justify-content-center align-items-center">
        <h1 data-aos="fade-up">Chúng tôi cung cấp các <span>DỊCH VỤ IN ẤN</span></h1>
        <div class="d-flex" data-aos="fade-up" data-aos-delay="200">
          <a href="#about" class="btn-get-started">Giới thiệu</a>
          <a href="https://www.youtube.com/@aothunxuxubienhoa" target="_blank" class="btn-watch-video d-flex align-items-center">
            <i class="bi bi-play-circle"></i><span>Kênh YouTube của Áo thun xuxu</span>
          </a>
        </div>
        <img src="/may-in-theu-ao-dong-phuc-bien-hoa-dong-nai-min.png" class="img-fluid hero-img" alt="" data-aos="zoom-out" data-aos-delay="300" @error="$event.target.src = 'https://placehold.co/800x400?text=May+In+Theu+Ao+Dong+Phục'">
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 120px 0 60px 0;
  position: relative;
  background-color: #f4f7f9;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero .container {
  position: relative;
  z-index: 2;
}

.hero h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
}

.hero h1 span {
  color: var(--accent-color);
}

.btn-get-started {
  background: var(--accent-color);
  color: #fff;
  padding: 10px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  margin-right: 20px;
  transition: 0.3s;
}

.btn-get-started:hover {
  background: #2a6d82;
}

.btn-watch-video {
  color: var(--heading-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: 0.3s;
}

.btn-watch-video i {
  font-size: 32px;
  margin-right: 8px;
  color: var(--accent-color);
}

.hero-img {
  margin-top: 60px;
  max-width: 80%;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 32px;
  }
}
</style>
