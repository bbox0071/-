<template>
  <div class="stats-view">
    <div class="page-header">
      <h1>统计分析</h1>
    </div>

    <StatPanel :stats="stats" />

    <div class="charts-container">
      <div class="chart-card">
        <h3>任务状态分布</h3>
        <div ref="statusChart" class="chart"></div>
      </div>

      <div class="chart-card">
        <h3>任务优先级分布</h3>
        <div ref="priorityChart" class="chart"></div>
      </div>

      <div class="chart-card">
        <h3>任务分类分布</h3>
        <div ref="categoryChart" class="chart"></div>
      </div>

      <div class="chart-card">
        <h3>近7天任务完成趋势</h3>
        <div ref="trendChart" class="chart"></div>
      </div>
    </div>

    <div class="detail-section">
      <h2>任务详情统计</h2>
      <div class="stats-table">
        <table>
          <thead>
            <tr>
              <th>分类</th>
              <th>总数</th>
              <th>待办</th>
              <th>进行中</th>
              <th>已完成</th>
              <th>完成率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, category) in categoryStats" :key="category">
              <td>{{ category }}</td>
              <td>{{ data.total }}</td>
              <td>{{ data.pending }}</td>
              <td>{{ data.inProgress }}</td>
              <td>{{ data.completed }}</td>
              <td>{{ data.rate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { storage, categories } from '../utils/storage'
import StatPanel from '../components/StatPanel.vue'

export default {
  name: 'StatsView',
  components: { StatPanel },
  setup() {
    const tasks = ref([])
    const statusChart = ref(null)
    const priorityChart = ref(null)
    const categoryChart = ref(null)
    const trendChart = ref(null)

    const loadTasks = () => {
      tasks.value = storage.getAllTasks()
    }

    onMounted(() => {
      loadTasks()
      nextTick(() => {
        initCharts()
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

    const categoryStats = computed(() => {
      const result = {}
      categories.forEach(cat => {
        const catTasks = tasks.value.filter(t => t.category === cat)
        const pending = catTasks.filter(t => t.status === '待办').length
        const inProgress = catTasks.filter(t => t.status === '进行中').length
        const completed = catTasks.filter(t => t.status === '已完成').length
        const total = catTasks.length
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0
        result[cat] = { total, pending, inProgress, completed, rate }
      })
      return result
    })

    const getLast7DaysTrend = () => {
      const trend = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        const endDate = new Date(date)
        endDate.setDate(endDate.getDate() + 1)
        
        const completedOnDay = tasks.value.filter(t => {
          if (t.status !== '已完成' || !t.updatedAt) return false
          const updateTime = new Date(t.updatedAt)
          return updateTime >= date && updateTime < endDate
        }).length
        
        trend.push({
          date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
          count: completedOnDay
        })
      }
      return trend
    }

    const initCharts = () => {
      if (statusChart.value) {
        const chart = echarts.init(statusChart.value)
        const statusData = [
          { value: stats.value.pending, name: '待办' },
          { value: stats.value.inProgress, name: '进行中' },
          { value: stats.value.completed, name: '已完成' }
        ]
        chart.setOption({
          series: [{
            type: 'pie',
            data: statusData,
            radius: ['40%', '70%'],
            label: { show: true },
            itemStyle: {
              color: ['#f5576c', '#4facfe', '#43e97b']
            }
          }]
        })
      }

      if (priorityChart.value) {
        const chart = echarts.init(priorityChart.value)
        const priorityCounts = {
          '高': tasks.value.filter(t => t.priority === '高').length,
          '中': tasks.value.filter(t => t.priority === '中').length,
          '低': tasks.value.filter(t => t.priority === '低').length
        }
        chart.setOption({
          xAxis: { type: 'category', data: ['高', '中', '低'] },
          yAxis: { type: 'value' },
          series: [{
            type: 'bar',
            data: [priorityCounts['高'], priorityCounts['中'], priorityCounts['低']],
            itemStyle: {
              color: ['#ef4444', '#f59e0b', '#22c55e']
            }
          }]
        })
      }

      if (categoryChart.value) {
        const chart = echarts.init(categoryChart.value)
        const categoryCounts = categories.map(cat => 
          tasks.value.filter(t => t.category === cat).length
        )
        chart.setOption({
          series: [{
            type: 'pie',
            data: categories.map((cat, i) => ({
              value: categoryCounts[i],
              name: cat
            })),
            label: { show: true }
          }]
        })
      }

      if (trendChart.value) {
        const chart = echarts.init(trendChart.value)
        const trend = getLast7DaysTrend()
        chart.setOption({
          xAxis: { type: 'category', data: trend.map(t => t.date) },
          yAxis: { type: 'value' },
          series: [{
            type: 'line',
            data: trend.map(t => t.count),
            smooth: true,
            areaStyle: {},
            itemStyle: { color: '#4a6cf7' }
          }]
        })
      }
    }

    return {
      tasks,
      stats,
      categoryStats,
      statusChart,
      priorityChart,
      categoryChart,
      trendChart
    }
  }
}
</script>

<style scoped>
.stats-view {
  max-width: 100%;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-card h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1rem;
}

.chart {
  height: 200px;
}

.detail-section {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-section h2 {
  margin-bottom: 1rem;
  color: #333;
}

.stats-table {
  overflow-x: auto;
}

.stats-table table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th,
.stats-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.stats-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #555;
}

@media (max-width: 640px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>