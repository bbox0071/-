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
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.task-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.task-card:hover::before {
  opacity: 1;
}

.status-待办 {
  border-left-color: var(--status-pending);
}

.status-进行中 {
  border-left-color: var(--status-progress);
}

.status-已完成 {
  border-left-color: var(--status-completed);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.task-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 1rem;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.task-card:hover .task-title {
  color: #667eea;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-badge, .priority-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.status-待办 .status-badge {
  background: linear-gradient(135deg, var(--border-color) 0%, var(--border-color) 100%);
  color: var(--status-pending);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.status-进行中 .status-badge {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0.25) 100%);
  color: var(--status-progress);
  box-shadow: 0 1px 2px rgba(14, 165, 233, 0.2);
}

.status-已完成 .status-badge {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.25) 100%);
  color: var(--status-completed);
  box-shadow: 0 1px 2px rgba(16, 185, 129, 0.2);
}

.priority-低 {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #16a34a;
  box-shadow: 0 1px 2px rgba(34, 197, 94, 0.15);
}

.priority-中 {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  color: #d97706;
  box-shadow: 0 1px 2px rgba(245, 158, 11, 0.15);
}

.priority-高 {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.15);
}

.task-description {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0.75rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
}

.task-details {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.task-card:hover .detail-item {
  background: #f3f4f6;
}

.detail-item.overdue {
  color: #ef4444;
  font-weight: 600;
  background: #fef2f2;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.icon {
  font-size: 0.9rem;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.update-time {
  font-size: 0.75rem;
  color: #9ca3af;
  font-style: italic;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 10px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}

.edit-btn {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #4b5563;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
}

.delete-btn {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
}

.status-btn {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #4338ca;
  font-weight: 600;
}

.status-btn:hover {
  background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
}

.status-已完成 .task-title {
  text-decoration: line-through;
  color: #9ca3af;
}

.status-已完成 .task-description {
  color: #d1d5db;
  background: #f3f4f6;
}

.status-已完成 .detail-item {
  color: #d1d5db;
  background: #f3f4f6;
}

.status-已完成 .detail-item.overdue {
  background: #f3f4f6;
  animation: none;
}

@media (max-width: 640px) {
  .task-card {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .task-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .task-title {
    font-size: 1rem;
    margin-right: 0;
  }
  
  .task-meta {
    justify-content: flex-start;
  }
  
  .status-badge, .priority-badge {
    padding: 0.25rem 0.6rem;
    font-size: 0.7rem;
  }
  
  .task-description {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .task-details {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .detail-item {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .task-footer {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .update-time {
    font-size: 0.7rem;
    order: 1;
  }
  
  .task-actions {
    order: 0;
    justify-content: flex-end;
  }
  
  .action-btn {
    min-width: 36px;
    padding: 0.4rem 0.7rem;
    font-size: 0.75rem;
  }
  
  .status-btn {
    font-size: 0.65rem;
    padding: 0.4rem 0.5rem;
  }
}
</style>