<template>
  <div class="settings-view">
    <div class="page-header">
      <h1>设置</h1>
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
import { storage } from '../utils/storage'
import { toast } from '../utils/toast'

export default {
  name: 'SettingsView',
  setup() {
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
  color: #333;
}

.settings-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.settings-section h2 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.danger .setting-info h3 {
  color: #dc2626;
}

.setting-info h3 {
  margin-bottom: 0.25rem;
  color: #333;
  font-size: 1rem;
}

.setting-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
  min-width: 100px;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
}

.btn-primary:hover {
  background-color: #3b5bdb;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-danger {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-danger:hover {
  background-color: #fecaca;
}

.file-upload {
  position: relative;
}

.file-input {
  display: none;
}

.about-info {
  color: #666;
  line-height: 1.6;
}

.about-info p {
  margin: 0.25rem 0;
}

@media (max-width: 640px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .btn {
    width: 100%;
  }
}
</style>