import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import TaskListView from '../views/TaskListView.vue'
import TaskEditView from '../views/TaskEditView.vue'
import StatsView from '../views/StatsView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/tasks', name: 'TaskList', component: TaskListView },
  { path: '/tasks/new', name: 'TaskNew', component: TaskEditView },
  { path: '/tasks/:id/edit', name: 'TaskEdit', component: TaskEditView },
  { path: '/stats', name: 'Stats', component: StatsView },
  { path: '/settings', name: 'Settings', component: SettingsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router