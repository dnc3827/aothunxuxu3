<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const status = ref({
  loading: false,
  error: '',
  sent: false
})

const handleSubmit = async () => {
  status.value.loading = true
  status.value.error = ''
  status.value.sent = false
  
  // Simulate form submission
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    status.value.sent = true
    formData.value = { name: '', email: '', subject: '', message: '' }
  } catch (err) {
    status.value.error = 'Đã có lỗi xảy ra. Vui lòng thử lại.'
  } finally {
    status.value.loading = false
  }
}
</script>

<template>
  <section id="contact" class="contact section">
    <div class="container section-title" data-aos="fade-up">
      <h2>Liên hệ</h2>
      <p>Hãy liên hệ ngay với chúng tôi theo thông tin sau</p>
    </div>

    <div class="container" data-aos="fade-up" data-aos-delay="100">
      <div class="row gy-4">
        <div class="col-lg-6">
          <div class="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="200">
            <i class="bi bi-geo-alt"></i>
            <h3>Địa chỉ</h3>
            <p>38/16 đường Đặng Đức Thuật, KP.6, P. Tam Hiệp, TP. Biên Hoà, tỉnh Đồng Nai</p>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="300">
            <i class="bi bi-telephone"></i>
            <h3>Hotline</h3>
            <p>076-771-0030 (Bán hàng)</p>
            <p>081-771-0030 (Kỹ thuật)</p>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="400">
            <i class="bi bi-envelope"></i>
            <h3>Email</h3>
            <p>dongphucxuxu@gmail.com</p>
          </div>
        </div>
      </div>

      <div class="row gy-4 mt-1">
        <div class="col-lg-6" data-aos="fade-up" data-aos-delay="300">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.1140693114444!2d106.85916027573741!3d10.954755255877675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dd007163277b%3A0x18abe8063b563a2e!2zWHV4dSAtIMOBbyDEkeG7k25nIHBo4bulYywgaW4g4bqlbiB0ZW0gbmjDo24sIHF1w6AgdOG6t25n!5e0!3m2!1svi!2s!4v1731039292006!5m2!1svi!2s" 
            frameborder="0" 
            style="border:0; width: 100%; height: 400px;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div class="col-lg-6">
          <form @submit.prevent="handleSubmit" class="php-email-form" data-aos="fade-up" data-aos-delay="400">
            <div class="row gy-4">
              <div class="col-md-6">
                <input v-model="formData.name" type="text" name="name" class="form-control" placeholder="Tên của bạn" required>
              </div>
              <div class="col-md-6">
                <input v-model="formData.email" type="email" class="form-control" name="email" placeholder="Email của bạn" required>
              </div>
              <div class="col-md-12">
                <input v-model="formData.subject" type="text" class="form-control" name="subject" placeholder="Chủ đề" required>
              </div>
              <div class="col-md-12">
                <textarea v-model="formData.message" class="form-control" name="message" rows="6" placeholder="Nội dung" required></textarea>
              </div>

              <div class="col-md-12 text-center">
                <div v-if="status.loading" class="loading d-block">Đang gửi...</div>
                <div v-if="status.error" class="error-message d-block">{{ status.error }}</div>
                <div v-if="status.sent" class="sent-message d-block">Tin nhắn của bạn đã được gửi. Cám ơn!</div>
                <button type="submit" :disabled="status.loading">Gửi Tin Nhắn</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.info-item {
  padding: 20px;
  background: #fff;
  box-shadow: 0px 0 25px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  text-align: center;
  height: 100%;
}

.info-item i {
  font-size: 32px;
  color: var(--accent-color);
  margin-bottom: 20px;
}

.info-item h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.info-item p {
  margin-bottom: 0;
}

.php-email-form {
  background: #fff;
  padding: 30px;
  box-shadow: 0px 0 25px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}

.php-email-form input,
.php-email-form textarea {
  border-radius: 4px;
  box-shadow: none;
  font-size: 14px;
  padding: 10px 15px;
}

.php-email-form button {
  background: var(--accent-color);
  border: 0;
  padding: 10px 30px;
  color: #fff;
  transition: 0.4s;
  border-radius: 50px;
  font-weight: 600;
}

.php-email-form button:hover {
  background: #2a6d82;
}

.loading, .error-message, .sent-message {
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.loading {
  background: #fff;
  color: var(--accent-color);
}

.error-message {
  background: #df3333;
  color: #fff;
}

.sent-message {
  background: #18d26e;
  color: #fff;
}
</style>
