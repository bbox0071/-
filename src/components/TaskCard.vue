<template>
  <div class="task-card" :class="[statusClass, priorityClass]">
    <div class="task-header">
      <h3 class="task-title">{{ task.title }}</h3>
      <div class="task-meta">
        <span class="status-badge" :class="statusClass">{{ task.status }}</span>
        <span class="priority-badge" :class="priorityClass">{{ task.priority }}</span>
      </div>
    </div>
    <p class="task-description" v-if="task.description">{{ task.description }}</p>
    <div class="task-details">
      <div class="detail-item">
        <span class="icon">📁</span>
        <span>{{ task.category }}</span>
      </div>
      <div class="detail-item" :class="{ overdue: isOverdue }">
        <span class="icon">📅</span>
        <span>{{ formatDate(task.dueDate) }}</span>
      </div>
    </div>
    <div class="task-footer">
      <span class="update-time">更新于 {{ formatDateTime(task.updatedAt) }}</span>
      <div class="task-actions">
        <button class="action-btn edit-btn" @click="$emit('edit', task)" title="编辑任务">
          ✏️
        </button>
        <button class="action-btn delete-btn" @click="$emit('delete', task.id)" title="删除任务">
          🗑️
        </button>
        <button class="action-btn status-btn" @click="$emit('changeStatus', task)" :title="`切换到${nextStatus}`">
          {{ nextStatus }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { taskStatuses } from '../utils/storage'

export default {
  name: 'TaskCard',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete', 'changeStatus'],
  setup(props) {
    const statusClass = computed(() => `status-${props.task.status}`)
    const priorityClass = computed(() => `priority-${props.task.priority}`)
    
    const isOverdue = computed(() => {
      if (!props.task.dueDate) return false
      const dueDate = new Date(props.task.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return props.task.status !== '已完成' && dueDate < today
    })

    const nextStatus = computed(() => {
      const currentIndex = taskStatuses.indexOf(props.task.status)
      return taskStatuses[(currentIndex + 1) % taskStatuses.length]
    })

    const formatDate = (dateStr) => {
      if (!dateStr) return '无截止日期'
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN')
    }

    const formatDateTime = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      statusClass,
      priorityClass,
      isOverdue,
      nextStatus,
      formatDate,
      formatDateTime
    }
  }
}
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid transparent;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-待办 {
  border-left-color: #9ca3af;
}

.status-进行中 {
  border-left-color: #3b82f6;
}

.status-已完成 {
  border-left-color: #22c55e;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.task-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 0.75rem;
  line-height: 1.3;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-badge, .priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-待办 .status-badge {
  background-color: #f3f4f6;
  color: #6b7280;
}

.status-进行中 .status-badge {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-已完成 .status-badge {
  background-color: #dcfce7;
  color: #16a34a;
}

.priority-低 {
  background-color: #f0fdf4;
  color: #22c55e;
}

.priority-中 {
  background-color: #fffbeb;
  color: #f59e0b;
}

.priority-高 {
  background-color: #fef2f2;
  color: #ef4444;
}

.task-description {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-details {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #9ca3af;
}

.detail-item.overdue {
  color: #ef4444;
  font-weight: 500;
}

.icon {
  font-size: 0.85rem;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.update-time {
  font-size: 0.7rem;
  color: #9ca3af;
}

.task-actions {
  display: flex;
  gap: 0.375rem;
}

.action-btn {
  padding: 0.4rem 0.7rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
}

.edit-btn {
  background-color: #f3f4f6;
  color: #4b5563;
}

.edit-btn:hover {
  background-color: #e5e7eb;
}

.delete-btn {
  background-color: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background-color: #fecaca;
}

.status-btn {
  background-color: #dbeafe;
  color: #1d4ed8;
  font-weight: 500;
}

.status-btn:hover {
  background-color: #bfdbfe;
}

.status-已完成 .task-title {
  text-decoration: line-through;
  color: #9ca3af;
}

.status-已完成 .task-description {
  color: #d1d5db;
}

.status-已完成 .detail-item {
  color: #d1d5db;
}

@media (max-width: 640px) {
  .task-card {
    padding: 0.875rem;
  }
  
  .task-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .task-title {
    font-size: 1rem;
    margin-right: 0;
  }
  
  .task-meta {
    justify-content: flex-start;
  }
  
  .task-details {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .task-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .update-time {
    font-size: 0.65rem;
    order: 1;
  }
  
  .task-actions {
    order: 0;
    justify-content: flex-end;
  }
  
  .action-btn {
    min-width: 32px;
    padding: 0.35rem 0.6rem;
  }
  
  .status-btn {
    font-size: 0.7rem;
    padding: 0.35rem 0.5rem;
  }
}
</style>