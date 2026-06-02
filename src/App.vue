<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">📋</span>
        <span>任务管理系统</span>
      </div>
      <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
        ☰
      </button>
      <div class="nav-links" :class="{ open: mobileMenuOpen }">
        <router-link to="/" class="nav-link" @click="mobileMenuOpen = false">首页</router-link>
        <router-link to="/tasks" class="nav-link" @click="mobileMenuOpen = false">任务列表</router-link>
        <router-link to="/stats" class="nav-link" @click="mobileMenuOpen = false">统计分析</router-link>
        <router-link to="/settings" class="nav-link" @click="mobileMenuOpen = false">设置</router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <Toast 
      :visible="toastVisible" 
      :message="toastMessage" 
      :type="toastType" 
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Toast from './components/Toast.vue'
import { toast } from './utils/toast'

export default {
  name: 'App',
  components: { Toast },
  setup() {
    const mobileMenuOpen = ref(false)
    
    const toastVisible = computed(() => toast.visible.value)
    const toastMessage = computed(() => toast.message.value)
    const toastType = computed(() => toast.type.value)
    
    return {
      mobileMenuOpen,
      toastVisible,
      toastMessage,
      toastType
    }
  }
}
</script>

<style>
:root {
  --primary-gradient: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  --primary-color: #0ea5e9;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --info-color: #3b82f6;
  --bg-color: #f0f9ff;
  --card-bg: #ffffff;
  --text-primary: #0c4a6e;
  --text-secondary: #475569;
  --border-color: #e0f2fe;
  --status-pending: #64748b;
  --status-progress: #0ea5e9;
  --status-completed: #10b981;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.logo {
  font-size: 1.75rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.mobile-menu-btn {
  display: none;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  transition: all 0.25s ease;
  font-weight: 500;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: white;
  border-radius: 2px;
}

.main-content {
  flex: 1;
  padding: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: white;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-danger {
  background: #fee2e2;
  color: var(--danger-color);
}

.btn-danger:hover {
  background: #fecaca;
}

.card {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.875rem 1rem;
  }
  
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-links {
    position: absolute;
    top: calc(100% + 8px);
    left: 1rem;
    right: 1rem;
    background: white;
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.25rem;
    display: none;
    box-shadow: var(--shadow-xl);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .nav-links.open {
    display: flex;
    animation: slideDown 0.25s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .nav-link {
    color: var(--text-secondary);
    padding: 0.75rem 1rem;
    border-radius: 8px;
  }
  
  .nav-link:hover,
  .nav-link.router-link-active {
    background: var(--bg-color);
    color: var(--primary-color);
  }
  
  .nav-link.router-link-active::after {
    display: none;
  }
  
  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-brand span:last-child {
    display: none;
  }
  
  .logo {
    font-size: 1.5rem;
  }
}
</style>