<template>
  <div class="toast-container" v-if="visible">
    <div class="toast" :class="type">
      <span class="toast-icon">{{ icon }}</span>
      <span class="toast-message">{{ message }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Toast',
  props: {
    visible: Boolean,
    message: String,
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    }
  },
  setup(props) {
    const icon = computed(() => {
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      }
      return icons[props.type] || icons.info
    })

    return { icon }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 99999;
  animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 300px;
  backdrop-filter: blur(10px);
}

.toast-icon {
  font-size: 1.5rem;
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.toast-message {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  flex: 1;
}

.toast.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.toast.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.toast.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.toast.info {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(120%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(120%);
  }
}

@media (max-width: 768px) {
  .toast-container {
    top: 80px;
    right: 1rem;
    left: 1rem;
  }
  
  .toast {
    min-width: auto;
    padding: 1rem 1.25rem;
    border-radius: 12px;
  }
  
  .toast-icon {
    font-size: 1.25rem;
  }
  
  .toast-message {
    font-size: 0.9rem;
  }
}
</style>