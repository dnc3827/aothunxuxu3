<script setup>
const phoneNumber = '0901234567'; // Anh/Chị có thể thay số điện thoại tại đây
const zaloLink = `https://zalo.me/${phoneNumber}`;
</script>

<template>
  <div class="zalo-floating-container" data-aos="fade-left" data-aos-delay="1000">
    <!-- Label with Glassmorphism -->
    <div class="zalo-label">
      <span>Tư vấn thêm</span>
    </div>
    
    <!-- Pulse Effect Layers -->
    <a :href="zaloLink" target="_blank" class="zalo-btn" title="Chat qua Zalo">
      <div class="pulse-ring"></div>
      <div class="pulse-ring delay-1"></div>
      
      <!-- Zalo Icon (SVG) -->
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" class="zalo-icon">
        <path d="M20 0C8.95 0 0 7.56 0 16.89C0 23.3 4.29 28.87 10.61 31.86L8.84 37.49C8.61 38.22 9.4 38.83 10.02 38.38L17.16 33.15C18.09 33.31 19.03 33.39 20 33.39C31.05 33.39 40 25.83 40 16.5C40 7.17 31.05-0.39 20-0.39L20 0Z" fill="white"/>
        <path d="M26.83 20.89C26.11 20.17 24.89 20.17 24.18 20.89L21.61 23.46C21.43 23.64 21.14 23.64 20.96 23.46C18.61 21.11 16.26 18.76 13.91 16.41C13.73 16.23 13.73 15.94 13.91 15.76L16.48 13.19C17.2 12.47 17.2 11.25 16.48 10.54L13.91 7.97C13.19 7.25 11.97 7.25 11.26 7.97L8.69 10.54C7.97 11.26 7.5 12.41 7.5 13.43C7.5 16.14 8.78 19.64 11.72 22.58C14.66 25.52 18.16 26.8 20.87 26.8C21.89 26.8 23.04 26.33 23.76 25.61L26.33 23.04C27.05 22.32 27.05 21.1 26.33 20.39L26.83 20.89Z" fill="hsl(214, 100%, 50%)"/>
      </svg>
    </a>
  </div>
</template>

<style scoped>
.zalo-floating-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 9999;
}

/* Glassmorphism Label */
.zalo-label {
  background: hsla(0, 0%, 100%, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 50px;
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  box-shadow: 0 4px 15px hsla(0, 0%, 0%, 0.1);
  animation: float 3s ease-in-out infinite;
}

.zalo-label span {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155; /* Slate 700 */
  letter-spacing: -0.01em;
  white-space: nowrap;
}

/* Zalo Button Base */
.zalo-btn {
  width: 56px;
  height: 56px;
  background-color: hsl(214, 100%, 50%); /* Zalo Blue */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px hsla(214, 100%, 50%, 0.4);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  text-decoration: none;
}

.zalo-btn:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 30px hsla(214, 100%, 50%, 0.5);
}

.zalo-icon {
  width: 32px;
  height: 32px;
  z-index: 2;
}

/* Pulse Rings */
.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: hsl(214, 100%, 50%);
  border-radius: 50%;
  opacity: 0.6;
  animation: pulse 2.5s cubic-bezier(0.25, 0, 0, 1) infinite;
  z-index: 1;
}

.delay-1 {
  animation-delay: 1.2s;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .zalo-floating-container {
    bottom: 20px;
    right: 20px;
    gap: 8px;
  }
  .zalo-btn {
    width: 48px;
    height: 48px;
  }
  .zalo-icon {
    width: 26px;
    height: 26px;
  }
  .zalo-label span {
    font-size: 0.75rem;
  }
}
</style>
