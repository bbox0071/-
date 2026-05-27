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
      :visible="toast.visible" 
      :message="toast.message" 
      :type="toast.type" 
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import Toast from './components/Toast.vue'
import { toast } from './utils/toast'

export default {
  name: 'App',
  components: { Toast },
  setup() {
    const mobileMenuOpen = ref(false)
    
    return {
      mobileMenuOpen,
      toast
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
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
  background-color: #4a6cf7;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.logo {
  font-size: 1.5rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #4a6cf7;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    display: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .nav-links.open {
    display: flex;
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
    border-radius: 4px;
  }
  
  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-brand span:last-child {
    display: none;
  }
}
</style>