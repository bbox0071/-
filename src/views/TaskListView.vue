<template>
  <div class="task-list-view">
    <div class="page-header">
      <h1>任务列表</h1>
      <router-link to="/tasks/new" class="btn btn-primary">+ 新建任务</router-link>
    </div>

    <TaskFilter 
      v-model:search="filters.search"
      v-model:status="filters.status"
      v-model:priority="filters.priority"
      v-model:category="filters.category"
      v-model:sortBy="filters.sortBy"
      v-model:sortOrder="filters.sortOrder"
      v-model:overdueOnly="filters.overdueOnly"
    />

    <div class="tasks-container">
      <div v-if="filteredTasks.length === 0" class="empty-state">
        <span class="empty-icon">📋</span>
        <p>暂无符合条件的任务</p>
        <router-link to="/tasks/new" class="btn btn-primary">创建任务</router-link>
      </div>
      <div v-else class="task-grid">
        <TaskCard 
          v-for="task in filteredTasks" 
          :key="task.id" 
          :task="task"
          @edit="editTask"
          @delete="confirmDelete"
          @changeStatus="changeStatus"
        />
      </div>
    </div>

    <div class="tasks-footer" v-if="filteredTasks.length > 0">
      <span class="tasks-count">共 {{ filteredTasks.length }} 个任务</span>
      <button 
        v-if="hasCompletedTasks"
        class="btn btn-danger"
        @click="clearCompleted"
      >
        清除已完成任务
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { storage } from '../utils/storage'
import { toast } from '../utils/toast'
import TaskFilter from '../components/TaskFilter.vue'
import TaskCard from '../components/TaskCard.vue'

export default {
  name: 'TaskListView',
  components: { TaskFilter, TaskCard },
  setup() {
    const tasks = ref([])

    const filters = ref({
      search: '',
      status: '',
      priority: '',
      category: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      overdueOnly: false
    })

    const loadTasks = () => {
      tasks.value = storage.getAllTasks()
    }

    onMounted(loadTasks)

    const filteredTasks = computed(() => {
      let result = [...tasks.value]

      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase()
        result = result.filter(t => 
          t.title.toLowerCase().includes(searchLower) ||
          (t.description && t.description.toLowerCase().includes(searchLower))
        )
      }

      if (filters.value.status) {
        result = result.filter(t => t.status === filters.value.status)
      }

      if (filters.value.priority) {
        result = result.filter(t => t.priority === filters.value.priority)
      }

      if (filters.value.category) {
        result = result.filter(t => t.category === filters.value.category)
      }

      if (filters.value.overdueOnly) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        result = result.filter(t => {
          if (!t.dueDate || t.status === '已完成') return false
          return new Date(t.dueDate) < today
        })
      }

      result.sort((a, b) => {
        let comparison = 0
        
        switch (filters.value.sortBy) {
          case 'createdAt':
            comparison = new Date(a.createdAt) - new Date(b.createdAt)
            break
          case 'dueDate':
            const aDate = a.dueDate ? new Date(a.dueDate) : new Date(0)
            const bDate = b.dueDate ? new Date(b.dueDate) : new Date(0)
            comparison = aDate - bDate
            break
          case 'priority':
            const priorityOrder = { '高': 3, '中': 2, '低': 1 }
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
            break
        }

        return filters.value.sortOrder === 'asc' ? comparison : -comparison
      })

      return result
    })

    const hasCompletedTasks = computed(() => {
      return tasks.value.some(t => t.status === '已完成')
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

    const clearCompleted = () => {
      if (!confirm('确定要清除所有已完成的任务吗？')) {
        return
      }
      const remaining = tasks.value.filter(t => t.status !== '已完成')
      storage.saveTasks(remaining)
      loadTasks()
      toast.warning('已清除所有已完成任务')
    }

    return {
      tasks,
      filters,
      filteredTasks,
      hasCompletedTasks,
      editTask,
      confirmDelete,
      changeStatus,
      clearCompleted
    }
  }
}
</script>

<style scoped>
.task-list-view {
  max-width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  min-width: 100px;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
}

.btn-primary:hover {
  background-color: #3b5bdb;
}

.btn-danger {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-danger:hover {
  background-color: #fecaca;
}

.tasks-container {
  min-height: 300px;
}

.task-grid {
  display: grid;
  gap: 1rem;
}

.empty-state {
  background: white;
  border-radius: 8px;
  padding: 4rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1rem;
}

.tasks-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.tasks-count {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .btn {
    width: 100%;
  }
}
</style>