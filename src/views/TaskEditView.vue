<template>
  <div class="task-edit-view">
    <div class="page-header">
      <button class="btn btn-secondary" @click="goBack">← 返回</button>
      <h1>{{ isEdit ? '编辑任务' : '新建任务' }}</h1>
    </div>

    <TaskForm 
      :task="currentTask"
      @submit="handleSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { storage } from '../utils/storage'
import { toast } from '../utils/toast'
import TaskForm from '../components/TaskForm.vue'

export default {
  name: 'TaskEditView',
  components: { TaskForm },
  setup() {
    const currentTask = ref(null)
    const taskId = ref(null)

    const isEdit = computed(() => !!taskId.value)

    onMounted(() => {
      const path = window.location.pathname
      const match = path.match(/\/tasks\/(\d+)\/edit/)
      if (match) {
        taskId.value = parseInt(match[1])
        const tasks = storage.getAllTasks()
        currentTask.value = tasks.find(t => t.id === taskId.value)
      }
    })

    const handleSubmit = (taskData) => {
      if (isEdit.value) {
        storage.updateTask(taskId.value, taskData)
        toast.success('任务更新成功')
      } else {
        storage.addTask(taskData)
        toast.success('任务创建成功')
      }
      setTimeout(() => {
        goBack()
      }, 1000)
    }

    const goBack = () => {
      window.location.href = '/tasks'
    }

    return {
      currentTask,
      isEdit,
      handleSubmit,
      goBack
    }
  }
}
</script>

<style scoped>
.task-edit-view {
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  color: #333;
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
  min-width: 80px;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>