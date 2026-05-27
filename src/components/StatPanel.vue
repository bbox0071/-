<template>
  <div class="stat-panel">
    <div class="stat-item">
      <div class="stat-icon total">📊</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总任务数</div>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon pending">📝</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.pending }}</div>
        <div class="stat-label">待办任务</div>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon inProgress">🚀</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.inProgress }}</div>
        <div class="stat-label">进行中</div>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon completed">✅</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.completed }}</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon overdue">⚠️</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.overdue }}</div>
        <div class="stat-label">逾期任务</div>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon rate">📈</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.completionRate }}%</div>
        <div class="stat-label">完成率</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatPanel',
  props: {
    stats: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.stat-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.inProgress {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon.overdue {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon.rate {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}
</style>