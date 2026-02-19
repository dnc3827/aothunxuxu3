<script setup>
const points = [
  'May, in, thêu đồng phục công ty, khách sạn - nhà hàng, cửa hàng cà phê,...',
  'Quảng cáo: Băng rôn - PP standee - Poster - Tem nhãn - Tranh canvas - Giấy ảnh,...',
  'Bao bì: Túi shop thời trang - Túi siêu thị - Túi giấy - Túi nhà thuốc,...',
  'Quà tặng doanh nghiệp: Gấu bông, quạt tay, ly sứ, cúp pha lê, bút, tranh ghép, lót chuột, bình giữ nhiệt,...',
  'Khắc laser: Dưa hấu, Dừa trọc đầu, gỗ, da,...',
  'In ấn: Đào tạo in lụa, cung cấp vật tư ngành in,...'
]
</script>

<template>
  <section id="about" class="about section">
    <div class="container">
      <div class="row gy-4">
        <div class="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
          <p class="who-we-are">CHÚNG TÔI LÀ:</p>
          <h3>ÁO THUN XUXU (CTY TNHH MTV TRƯƠNG BẢO PHÁT)</h3>
          <p class="fst-italic">
            Công ty TNHH MTV Trương Bảo Phát được thành lập 15/10/2014, với thương hiệu áo thun xuxu (khởi đầu từ năm 2010). Chúng tôi cung cấp các dịch vụ về in ấn.
          </p>
          <ul>
            <li v-for="(point, index) in points" :key="index">
              <i class="bi bi-check-circle"></i> <span>{{ point }}</span>
            </li>
          </ul>
          <a href="#" class="read-more"><span>Xem thêm</span><i class="bi bi-arrow-right"></i></a>
        </div>

        <div class="col-lg-6 about-images" data-aos="fade-up" data-aos-delay="200">
          <div class="row gy-4">
            <div class="col-lg-6">
              <img src="/dong-phuc-min.jpg" class="img-fluid" alt="" @error="$event.target.src = 'https://placehold.co/400x500?text=Đồng+Phục'">
            </div>
            <div class="col-lg-6">
              <div class="row gy-4">
                <div class="col-lg-12">
                  <img src="/quang-cao-min.jpg" class="img-fluid" alt="" @error="$event.target.src = 'https://placehold.co/400x240?text=Quảng+Cáo'">
                </div>
                <div class="col-lg-12">
                  <img src="/bao-bi-min.jpg" class="img-fluid" alt="" @error="$event.target.src = 'https://placehold.co/400x240?text=Bao+Bì'">
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
.who-we-are {
  text-transform: uppercase;
  margin-bottom: 15px;
  color: var(--accent-color);
  font-weight: 600;
  letter-spacing: 1px;
}

.content h3 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

.content ul {
  list-style: none;
  padding: 0;
}

.content ul li {
  padding-bottom: 10px;
  display: flex;
  align-items: flex-start;
}

.content ul i {
  font-size: 20px;
  padding-right: 10px;
  color: var(--accent-color);
  line-height: 0;
}

.read-more {
  background: var(--accent-color);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 25px;
  border-radius: 50px;
  transition: 0.3s;
  text-decoration: none;
}

.read-more:hover {
  background: #2a6d82;
}

.read-more i {
  font-size: 18px;
  margin-left: 5px;
  line-height: 0;
}

.about-images img {
  border-radius: 10px;
}
</style>
