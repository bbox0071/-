<template>
  <div class="task-form-container">
    <h2>{{ isEdit ? '编辑任务' : '新建任务' }}</h2>
    <form @submit.prevent="handleSubmit" class="task-form">
      <div class="form-group">
        <label>任务标题 *</label>
        <input 
          v-model="form.title" 
          type="text" 
          placeholder="请输入任务标题"
          class="form-input"
        />
        <span class="error" v-if="errors.title">{{ errors.title }}</span>
      </div>
      
      <div class="form-group">
        <label>任务描述</label>
        <textarea 
          v-model="form.description" 
          placeholder="请输入任务描述"
          rows="3"
          class="form-textarea"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>任务状态</label>
          <select v-model="form.status" class="form-select">
            <option v-for="status in taskStatuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>优先级</label>
          <select v-model="form.priority" class="form-select">
            <option v-for="p in priorities" :key="p" :value="p">
              {{ p }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>分类</label>
          <select v-model="form.category" class="form-select">
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>截止日期</label>
          <input 
            v-model="form.dueDate" 
            type="date" 
            class="form-input"
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          取消
        </button>
        <button type="submit" class="btn btn-primary">
          {{ isEdit ? '保存修改' : '创建任务' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { taskStatuses, priorities, categories } from '../utils/storage'

export default {
  name: 'TaskForm',
  props: {
    task: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const isEdit = ref(!!props.task)
    
    const form = reactive({
      title: '',
      description: '',
      status: '待办',
      priority: '中',
      category: '工作',
      dueDate: ''
    })

    const errors = reactive({})

    watch(() => props.task, (newTask) => {
      if (newTask) {
        isEdit.value = true
        form.title = newTask.title
        form.description = newTask.description || ''
        form.status = newTask.status
        form.priority = newTask.priority
        form.category = newTask.category
        form.dueDate = newTask.dueDate ? newTask.dueDate.split('T')[0] : ''
      } else {
        isEdit.value = false
        resetForm()
      }
    }, { immediate: true })

    const resetForm = () => {
      form.title = ''
      form.description = ''
      form.status = '待办'
      form.priority = '中'
      form.category = '工作'
      form.dueDate = ''
      Object.keys(errors).forEach(key => delete errors[key])
    }

    const validate = () => {
      Object.keys(errors).forEach(key => delete errors[key])
      
      if (!form.title.trim()) {
        errors.title = '任务标题不能为空'
        return false
      }
      
      return true
    }

    const handleSubmit = () => {
      if (!validate()) return
      
      emit('submit', {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        category: form.category,
        dueDate: form.dueDate ? `${form.dueDate}T00:00:00` : ''
      })
    }

    return {
      isEdit,
      form,
      errors,
      taskStatuses,
      priorities,
      categories,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.task-form-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.task-form-container h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.3rem;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #4a6cf7;
}

.form-textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
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

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>