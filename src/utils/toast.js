import { ref } from 'vue'

export const toast = {
  visible: ref(false),
  message: ref(''),
  type: ref('info'),
  
  show(message, type = 'info', duration = 3000) {
    this.message.value = message
    this.type.value = type
    this.visible.value = true
    
    if (duration > 0) {
      setTimeout(() => {
        this.hide()
      }, duration)
    }
  },
  
  hide() {
    this.visible.value = false
  },
  
  success(message, duration = 3000) {
    this.show(message, 'success', duration)
  },
  
  error(message, duration = 3000) {
    this.show(message, 'error', duration)
  },
  
  warning(message, duration = 3000) {
    this.show(message, 'warning', duration)
  },
  
  info(message, duration = 3000) {
    this.show(message, 'info', duration)
  }
}