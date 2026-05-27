<template>
  <div class="dashboard">
    <div class="page-header">
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
import { ref, computed, onMounted } from 'vue'
import { storage } from '../utils/storage'
import { toast } from '../utils/toast'
import StatPanel from '../components/StatPanel.vue'
import TaskCard from '../components/TaskCard.vue'

export default {
  name: 'DashboardView',
  components: { StatPanel, TaskCard },
  setup() {
    const tasks = ref([])

    const loadTasks = () => {
      tasks.value = storage.getAllTasks()
    }

    onMounted(loadTasks)

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

    return {
      tasks,
      greeting,
      todayStr,
      stats,
      pendingTasks,
      inProgressTasks,
      editTask,
      confirmDelete,
      changeStatus
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 100%;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section h2 {
  font-size: 1.3rem;
  color: #333;
}

.view-all {
  color: #4a6cf7;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.task-list {
  display: grid;
  gap: 1rem;
}

.empty-state {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
}

.btn-primary:hover {
  background-color: #3b5bdb;
}

@media (max-width: 640px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .empty-state {
    padding: 2rem;
  }
}
</style>