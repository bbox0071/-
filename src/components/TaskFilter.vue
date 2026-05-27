<template>
  <div class="task-filter">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input 
        v-model="localSearch" 
        type="text" 
        placeholder="搜索任务标题或描述..."
        class="search-input"
      />
    </div>
    
    <div class="filter-row">
      <div class="filter-group">
        <label>状态</label>
        <select v-model="localStatus" class="filter-select">
          <option value="">全部</option>
          <option v-for="status in taskStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>优先级</label>
        <select v-model="localPriority" class="filter-select">
          <option value="">全部</option>
          <option v-for="p in priorities" :key="p" :value="p">
            {{ p }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>分类</label>
        <select v-model="localCategory" class="filter-select">
          <option value="">全部</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>排序</label>
        <select v-model="localSortBy" class="filter-select">
          <option value="createdAt">创建时间</option>
          <option value="dueDate">截止日期</option>
          <option value="priority">优先级</option>
        </select>
      </div>

      <div class="filter-group sort-direction">
        <button 
          class="sort-btn" 
          :class="{ ascending: localSortOrder === 'asc' }"
          @click="toggleSortOrder"
        >
          ↑↓
        </button>
      </div>

      <div class="filter-group checkbox-group">
        <label class="checkbox-label">
          <input 
            v-model="localOverdueOnly" 
            type="checkbox" 
            class="filter-checkbox"
          />
          仅逾期
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { taskStatuses, priorities, categories } from '../utils/storage'

export default {
  name: 'TaskFilter',
  props: {
    search: String,
    status: String,
    priority: String,
    category: String,
    sortBy: String,
    sortOrder: String,
    overdueOnly: Boolean
  },
  emits: ['update:search', 'update:status', 'update:priority', 'update:category', 'update:sortBy', 'update:sortOrder', 'update:overdueOnly'],
  setup(props, { emit }) {
    const localSearch = ref(props.search || '')
    const localStatus = ref(props.status || '')
    const localPriority = ref(props.priority || '')
    const localCategory = ref(props.category || '')
    const localSortBy = ref(props.sortBy || 'createdAt')
    const localSortOrder = ref(props.sortOrder || 'desc')
    const localOverdueOnly = ref(props.overdueOnly || false)

    watch(localSearch, val => emit('update:search', val))
    watch(localStatus, val => emit('update:status', val))
    watch(localPriority, val => emit('update:priority', val))
    watch(localCategory, val => emit('update:category', val))
    watch(localSortBy, val => emit('update:sortBy', val))
    watch(localSortOrder, val => emit('update:sortOrder', val))
    watch(localOverdueOnly, val => emit('update:overdueOnly', val))

    const toggleSortOrder = () => {
      localSortOrder.value = localSortOrder.value === 'asc' ? 'desc' : 'asc'
    }

    return {
      localSearch,
      localStatus,
      localPriority,
      localCategory,
      localSortBy,
      localSortOrder,
      localOverdueOnly,
      taskStatuses,
      priorities,
      categories,
      toggleSortOrder
    }
  }
}
</script>

<style scoped>
.task-filter {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.search-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #4a6cf7;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.filter-group label {
  margin-bottom: 0.375rem;
  font-size: 0.85rem;
  color: #666;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.filter-select:focus {
  outline: none;
  border-color: #4a6cf7;
}

.sort-direction {
  min-width: auto;
}

.sort-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.sort-btn:hover {
  background: #f5f5f5;
}

.sort-btn.ascending {
  background: #4a6cf7;
  color: white;
  border-color: #4a6cf7;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #666;
}

.filter-checkbox {
  cursor: pointer;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
}
</style>