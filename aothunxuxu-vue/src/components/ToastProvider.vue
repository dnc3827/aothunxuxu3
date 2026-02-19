<script setup>
import { useToastStore } from '@/stores/toastStore'
import { storeToRefs } from 'pinia'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)

const getIcon = (type) => {
  return type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'
}
</script>

<template>
  <div class="toast-container-custom">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        :class="['toast-item', toast.type]"
        @click="toastStore.remove(toast.id)"
      >
        <div class="toast-icon">
          <i :class="['bi', getIcon(toast.type)]"></i>
        </div>
        <div class="toast-content">
          {{ toast.message }}
        </div>
        <button class="toast-close">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container-custom {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  min-width: 300px;
  max-width: 450px;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: hsla(0, 0%, 100%, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid hsla(0, 0%, 100%, 0.3);
  box-shadow: 0 10px 30px hsla(0, 0%, 0%, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.toast-item.success {
  border-left: 4px solid hsl(142, 70%, 45%);
}

.toast-item.success .toast-icon {
  color: hsl(142, 70%, 45%);
}

.toast-item.error {
  border-left: 4px solid hsl(0, 84%, 60%);
}

.toast-item.error .toast-icon {
  color: hsl(0, 84%, 60%);
}

.toast-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.toast-content {
  flex-grow: 1;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: hsl(215, 25%, 27%);
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: hsl(215, 20%, 65%);
  font-size: 1.25rem;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.toast-close:hover {
  color: hsl(215, 25%, 27%);
}

/* Animations */
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.toast-leave-active {
  position: absolute;
  transition: all 0.3s ease;
}

.toast-move {
  transition: transform 0.4s ease;
}

@media (max-width: 576px) {
  .toast-container-custom {
    top: auto;
    bottom: 24px;
    right: 16px;
    left: 16px;
  }
  .toast-item {
    min-width: 0;
    width: 100%;
  }
}
</style>
