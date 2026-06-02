<template>
  <div class="dashboard">
    <div class="page-header" :style="headerStyle">
      <h1>欢迎回来</h1>
      <p>{{ greeting }}，今天是 {{ todayStr }}</p>
    </div>

    <StatPanel :stats="stats" />

    <div class="section">
      <h2>待办任务</h2>
      <div v-if="pendingTasks.length === 0" class="empty-state">
        <span class="empty-icon">🎉</span>
        <p>暂无待办任务，快去创建一个吧！</p>
        <router-link to="/tasks/new" class="btn btn-primary">创建任务</router-link>
      </div>
      <div v-else class="task-list">
        <TaskCard 
          v-for="task in pendingTasks" 
          :key="task.id" 
          :task="task"
          @edit="editTask"
          @delete="confirmDelete"
          @changeStatus="changeStatus"
        />
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h2>进行中的任务</h2>
        <router-link to="/tasks" class="view-all">查看全部</router-link>
      </div>
      <div v-if="inProgressTasks.length === 0" class="empty-state">
        <span class="empty-icon">📋</span>
        <p>暂无进行中的任务</p>
      </div>
      <div v-else class="task-list">
        <TaskCard 
          v-for="task in inProgressTasks.slice(0, 3)" 
          :key="task.id" 
          :task="task"
          @edit="editTask"
          @delete="confirmDelete"
          @changeStatus="changeStatus"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storage } from '../utils/storage'
import { toast } from '../utils/toast'
import { getCurrentTheme, themes } from '../utils/theme'
import StatPanel from '../components/StatPanel.vue'
import TaskCard from '../components/TaskCard.vue'

export default {
  name: 'DashboardView',
  components: { StatPanel, TaskCard },
  setup() {
    const tasks = ref([])
    const currentTheme = ref(getCurrentTheme())

    const loadTasks = () => {
      const newTasks = storage.getAllTasks()
      tasks.value = []
      tasks.value.push(...newTasks)
    }

    const loadTheme = () => {
      currentTheme.value = getCurrentTheme()
    }

    const headerStyle = computed(() => {
      try {
        const theme = themes[currentTheme.value]
        if (!theme) {
          console.warn('Theme not found:', currentTheme.value)
          return {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            transition: 'background 0.5s ease-in-out'
          }
        }
        return {
          background: theme.primaryGradient,
          boxShadow: `0 20px 25px -5px ${theme.primaryColor}33`,
          transition: 'background 0.5s ease-in-out, box-shadow 0.5s ease-in-out'
        }
      } catch (error) {
        console.error('Error loading theme style:', error)
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          transition: 'background 0.5s ease-in-out'
        }
      }
    })

    onMounted(() => {
      loadTasks()
      loadTheme()
    })

    // 监听主题变更事件
    const handleThemeChange = () => {
      loadTheme()
    }

    // 使用window事件来监听主题变更
    const themeChangeListener = () => {
      loadTheme()
    }

    // 挂载时添加监听器
    window.addEventListener('themeChanged', themeChangeListener)

    const greeting = computed(() => {
      const hour = new Date().getHours()
      if (hour < 6) return '夜深了'
      if (hour < 12) return '早上好'
      if (hour < 14) return '中午好'
      if (hour < 18) return '下午好'
      return '晚上好'
    })

    const todayStr = computed(() => {
      return new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    })

    const stats = computed(() => {
      const total = tasks.value.length
      const pending = tasks.value.filter(t => t.status === '待办').length
      const inProgress = tasks.value.filter(t => t.status === '进行中').length
      const completed = tasks.value.filter(t => t.status === '已完成').length
      
      const overdue = tasks.value.filter(t => {
        if (!t.dueDate || t.status === '已完成') return false
        const dueDate = new Date(t.dueDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return dueDate < today
      }).length

      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

      return { total, pending, inProgress, completed, overdue, completionRate }
    })

    const pendingTasks = computed(() => {
      return tasks.value
        .filter(t => t.status === '待办')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    })

    const inProgressTasks = computed(() => {
      return tasks.value
        .filter(t => t.status === '进行中')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

    const editTask = (task) => {
      window.location.href = `/tasks/${task.id}/edit`
    }

    const confirmDelete = (id) => {
      if (!confirm('确定要删除这个任务吗？')) {
        return
      }
      storage.deleteTask(id)
      loadTasks()
      toast.info('任务已删除')
    }

    const changeStatus = (task) => {
      const statuses = ['待办', '进行中', '已完成']
      const currentIndex = statuses.indexOf(task.status)
      const nextStatus = statuses[(currentIndex + 1) % statuses.length]
      storage.updateTask(task.id, { status: nextStatus })
      loadTasks()
      toast.success(`任务状态已更新为「${nextStatus}」`)
    }

    // 卸载时移除监听器
    onUnmounted(() => {
      window.removeEventListener('themeChanged', themeChangeListener)
    })

    return {
      tasks,
      greeting,
      todayStr,
      stats,
      pendingTasks,
      inProgressTasks,
      editTask,
      confirmDelete,
      changeStatus,
      headerStyle
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 100%;
}

.page-header {
  margin-bottom: 2.5rem;
  padding: 2rem;
  border-radius: 20px;
}

.page-header h1 {
  font-size: 2.25rem;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.page-header p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.15rem;
}

.section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section h2 {
  font-size: 1.4rem;
  color: #1f2937;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section h2::before {
  content: '';
  width: 3px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.view-all {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.view-all:hover {
  background: rgba(102, 126, 234, 0.1);
  text-decoration: none;
}

.task-list {
  display: grid;
  gap: 1.25rem;
}

.empty-state {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px dashed #e5e7eb;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1.25rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(14, 165, 233, 0.4);
}

.btn-primary:active {
  transform: scale(0.98);
}

@media (max-width: 640px) {
  .page-header {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .page-header p {
    font-size: 1rem;
  }
  
  .empty-state {
    padding: 2.5rem 1.5rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .section h2 {
    font-size: 1.25rem;
  }
}
</style>