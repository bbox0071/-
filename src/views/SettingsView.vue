<template>
  <div class="settings-view">
    <div class="page-header">
      <h1>设置</h1>
    </div>

    <div class="settings-section">
      <h2>主题设置</h2>
      
      <div class="setting-item">
        <div class="setting-info">
          <h3>颜色主题</h3>
          <p>选择您喜欢的界面配色方案</p>
        </div>
        <div class="theme-selector">
          <button 
            v-for="(theme, key) in themes" 
            :key="key"
            class="theme-btn"
            :class="{ active: currentTheme === key }"
            :style="{ '--theme-color': theme.primaryColor }"
            @click="changeTheme(key)"
            :title="theme.name"
          >
            <span class="theme-preview" :style="{ background: theme.primaryGradient }"></span>
            <span class="theme-name">{{ theme.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h2>数据管理</h2>
      
      <div class="setting-item">
        <div class="setting-info">
          <h3>导出数据</h3>
          <p>将所有任务数据导出为JSON文件</p>
        </div>
        <button class="btn btn-primary" @click="exportData">导出数据</button>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <h3>导入数据</h3>
          <p>从JSON文件导入任务数据（将覆盖现有数据）</p>
        </div>
        <div class="file-upload">
          <input 
            type="file" 
            accept=".json" 
            id="importFile" 
            class="file-input"
            @change="importData"
          />
          <label for="importFile" class="btn btn-secondary">选择文件</label>
        </div>
      </div>

      <div class="setting-item danger">
        <div class="setting-info">
          <h3>清空全部数据</h3>
          <p>删除所有任务数据，此操作不可恢复</p>
        </div>
        <button class="btn btn-danger" @click="clearAllData">清空数据</button>
      </div>
    </div>

    <div class="settings-section">
      <h2>关于</h2>
      <div class="about-info">
        <p>任务管理系统 v1.0.0</p>
        <p>基于 Vue 3 + Vite 构建</p>
        <p>数据存储：localStorage</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { storage } from '../utils/storage'
import { toast } from '../utils/toast'
import { themes, applyTheme, getCurrentTheme } from '../utils/theme'

export default {
  name: 'SettingsView',
  setup() {
    const currentTheme = ref(getCurrentTheme())

    const changeTheme = (themeKey) => {
      try {
        applyTheme(themeKey)
        currentTheme.value = themeKey
        // 触发主题变更事件，通知其他组件
        window.dispatchEvent(new CustomEvent('themeChanged', {
          detail: { theme: themeKey }
        }))
        toast.success(`已切换到「${themes[themeKey].name}」主题`)
      } catch (error) {
        console.error('Error changing theme:', error)
        toast.error('主题切换失败，请重试')
      }
    }

    const exportData = () => {
      const data = storage.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tasks_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('数据导出成功')
    }

    const importData = (event) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = storage.importData(e.target.result)
        if (result) {
          toast.success('数据导入成功')
        } else {
          toast.error('数据导入失败，请确保文件格式正确')
        }
      }
      reader.readAsText(file)
    }

    const clearAllData = () => {
      if (!confirm('确定要清空所有数据吗？此操作不可恢复！')) {
        return
      }
      storage.clearAll()
      toast.warning('数据已清空')
    }

    return {
      themes,
      currentTheme,
      changeTheme,
      exportData,
      importData,
      clearAllData
    }
  }
}
</script>

<style scoped>
.settings-view {
  max-width: 600px;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: var(--text-primary);
}

.settings-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color);
}

.settings-section h2 {
  margin-bottom: 1.25rem;
  color: var(--text-primary);
  font-size: 1.15rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--border-color);
  font-weight: 600;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.danger .setting-info h3 {
  color: var(--danger-color);
}

.setting-info {
  flex: 1;
}

.setting-info h3 {
  margin-bottom: 0.375rem;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.setting-info p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.theme-selector {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.theme-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--card-bg);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 80px;
}

.theme-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.theme-btn.active {
  border-color: var(--primary-color);
  background: rgba(14, 165, 233, 0.08);
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.15);
}

.theme-preview {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-name {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
  min-width: 100px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  background: var(--bg-color);
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
  border-color: var(--text-secondary);
  transform: translateY(-1px);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
  border: 2px solid rgba(239, 68, 68, 0.2);
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: var(--danger-color);
}

.file-upload {
  position: relative;
}

.file-input {
  display: none;
}

.about-info {
  color: var(--text-secondary);
  line-height: 1.6;
}

.about-info p {
  margin: 0.375rem 0;
}

@media (max-width: 640px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .btn {
    width: 100%;
  }
  
  .theme-selector {
    justify-content: flex-start;
  }
}
</style>