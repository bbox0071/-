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
  top: 20px;
  right: 20px;
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 280px;
}

.toast-icon {
  font-size: 1.25rem;
}

.toast-message {
  color: white;
  font-weight: 500;
}

.toast.success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.toast.error {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.toast.warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.toast.info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
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
    transform: translateX(100%);
  }
}

@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .toast {
    min-width: auto;
  }
}
</style>