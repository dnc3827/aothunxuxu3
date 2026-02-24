<script setup>
const currentYear = new Date().getFullYear()

const quickLinks = [
  { name: 'Trang chủ', url: '#' },
  { name: 'Giới thiệu', url: '#about' },
  { name: 'Sản phẩm', url: '#features' },
  { name: 'Điều khoản dịch vụ', url: '#' },
  { name: 'Chính sách bảo mật', url: '#' }
]

const socialLinks = [
  { icon: 'bi-facebook', url: 'https://www.facebook.com/AOLOP.AONHOM.XUXU.BIENHOA' },
  { icon: 'bi-youtube', url: 'https://www.youtube.com/@aothunxuxubienhoa' },
  { icon: 'bi-tiktok', url: 'https://www.tiktok.com/@cherryphuong00' }
]
</script>

<template>
  <footer id="footer" class="footer position-relative light-background">
    <div class="container footer-top">
      <div class="row gy-4">
        <div class="col-lg-4 col-md-6 footer-about">
          <a href="/" class="logo d-flex align-items-center">
            <span class="sitename">Áo thun xuxu</span>
          </a>
          <div class="footer-contact pt-3">
            <p>38/16 đường Đặng Đức Thuật, KP.6, P. Tam Hiệp</p>
            <p>TP. Biên Hoà, tỉnh Đồng Nai</p>
            <div class="mt-3">
              <strong>Điện thoại:</strong>
              <div class="footer-hotline">
                <h3 class="phone-number">076-771-0030</h3>
              </div>
            </div>
            <p><strong>Email:</strong> <span>dongphucxuxu@gmail.com</span></p>
          </div>
          <div class="social-links d-flex mt-4">
            <a v-for="(link, index) in socialLinks" :key="index" :href="link.url" target="_blank">
              <i :class="['bi', link.icon]"></i>
            </a>
          </div>
        </div>

        <div class="col-lg-2 col-md-3 footer-links">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li v-for="(link, index) in quickLinks" :key="index">
              <a :href="link.url">{{ link.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="container copyright text-center mt-4">
      <p>© <span>Copyright</span> <strong class="px-1 sitename">Áo thun xuxu</strong><span>2010 - {{ currentYear }} All Rights Reserved</span></p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-top: 60px;
  background-color: #f4f7f9;
  border-top: 1px solid #e1e9ed;
}

.sitename {
  font-size: 24px;
  font-weight: 700;
  color: var(--heading-color);
}

.footer-contact p {
  margin-bottom: 5px;
}

.footer-hotline {
  padding: 5px 0;
}

.phone-number {
  color: red;
  font-family: var(--heading-font);
  border-top: 2px solid #6c6c6c;
  border-bottom: 2px solid #6c6c6c;
  padding: 5px 10px;
  display: inline-block;
  margin: 10px 0;
  font-size: 24px;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #c9ccd0;
  margin-right: 10px;
  color: var(--heading-color);
  transition: 0.3s;
  text-decoration: none;
}

.social-links a:hover {
  background: var(--accent-color);
  color: #fff;
  border-color: var(--accent-color);
}

.footer-links h4 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  padding: 5px 0;
}

.footer-links a {
  color: var(--default-color);
  text-decoration: none;
  transition: 0.3s;
}

.footer-links a:hover {
  color: var(--accent-color);
}

.copyright {
  border-top: 1px solid #e1e9ed;
  padding: 25px 0;
}
</style>
