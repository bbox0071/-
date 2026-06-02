<template>
  <div class="task-edit-view">
    <div class="page-header">
      <button class="btn btn-secondary" @click="goBack">← 返回</button>
      <h1>{{ isEdit ? '编辑任务' : '新建任务' }}</h1>
    </div>

    <div class="debug-info">
      <p>isEdit: {{ isEdit }}</p>
      <p>currentTask: {{ currentTask ? '有数据' : '无数据' }}</p>
    </div>

    <div class="simple-form">
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
        <button type="button" class="btn btn-secondary" @click="goBack">
          取消
        </button>
        <button type="submit" class="btn btn-primary" @click="handleSubmitDirect">
          {{ isEdit ? '保存修改' : '创建任务' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storage, taskStatuses, priorities, categories } from '../utils/storage'
import { toast } from '../utils/toast'

console.log('TaskEditView loaded')

export default {
  name: 'TaskEditView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const currentTask = ref(null)

    const isEdit = computed(() => !!route.params.id)

    const form = reactive({
      title: '',
      description: '',
      status: '待办',
      priority: '中',
      category: '工作',
      dueDate: ''
    })

    const errors = reactive({})

    onMounted(() => {
      console.log('onMounted called, id:', route.params.id)
      if (route.params.id) {
        const taskId = parseInt(route.params.id)
        const tasks = storage.getAllTasks()
        currentTask.value = tasks.find(t => t.id === taskId)
        if (currentTask.value) {
          form.title = currentTask.value.title
          form.description = currentTask.value.description || ''
          form.status = currentTask.value.status
          form.priority = currentTask.value.priority
          form.category = currentTask.value.category
          form.dueDate = currentTask.value.dueDate ? currentTask.value.dueDate.split('T')[0] : ''
        }
      }
    })

    const validate = () => {
      Object.keys(errors).forEach(key => delete errors[key])
      if (!form.title.trim()) {
        errors.title = '任务标题不能为空'
        return false
      }
      return true
    }

    const handleSubmitDirect = () => {
      try {
        console.log('handleSubmitDirect called')
        console.log('Form data:', form)
        
        if (!validate()) {
          console.log('Validation failed:', errors)
          return
        }
        
        const taskData = {
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
          priority: form.priority,
          category: form.category,
          dueDate: form.dueDate ? `${form.dueDate}T00:00:00` : ''
        }
        
        if (isEdit.value) {
          storage.updateTask(parseInt(route.params.id), taskData)
          toast.success('任务更新成功')
        } else {
          storage.addTask(taskData)
          toast.success('任务创建成功')
        }
        
        setTimeout(() => {
          router.push('/tasks').then(() => {
            console.log('Navigation successful')
          }).catch(err => {
            console.error('Navigation error:', err)
          })
        }, 1000)
      } catch (error) {
        console.error('Error in handleSubmitDirect:', error)
        toast.error('创建任务失败')
      }
    }

    const goBack = () => {
      router.push('/tasks')
    }

    return {
      currentTask,
      isEdit,
      form,
      errors,
      taskStatuses,
      priorities,
      categories,
      handleSubmitDirect,
      goBack
    }
  }
}
</script>

<style scoped>
.task-edit-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
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

.debug-info {
  background: #f8fafc;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #64748b;
}

.simple-form {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafafa;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #0ea5e9;
  background: white;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
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
  min-width: 80px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  background: #f0f9ff;
  color: #475569;
  border: 2px solid #e0f2fe;
}

.btn-secondary:hover {
  background: #e0f2fe;
  border-color: #475569;
  transform: translateY(-1px);
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

@media (max-width: 640px) {
  .simple-form {
    padding: 1.25rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>