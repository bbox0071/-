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
      console.log('TaskForm handleSubmit called')
      console.log('Form data:', form)
      if (!validate()) {
        console.log('Validation failed:', errors)
        return
      }
      console.log('Validation passed, emitting submit')
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
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.task-form-container h2 {
  margin-bottom: 2rem;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.task-form-container h2::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.625rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--bg-color);
  color: var(--text-primary);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--card-bg);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  transform: translateY(-1px);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);
  pointer-events: auto;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(14, 165, 233, 0.4);
}

.btn-primary:active {
  transform: scale(0.98);
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

@media (max-width: 640px) {
  .task-form-container {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .task-form-container h2 {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-input,
  .form-textarea,
  .form-select {
    padding: 0.75rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
}
</style>