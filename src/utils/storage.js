const STORAGE_KEY = 'task_manager_tasks'

export const storage = {
  getAllTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  addTask(task) {
    const tasks = this.getAllTasks()
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tasks.push(newTask)
    this.saveTasks(tasks)
    return newTask
  },

  updateTask(id, updates) {
    const tasks = this.getAllTasks()
    const index = tasks.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      this.saveTasks(tasks)
      return tasks[index]
    }
    return null
  },

  deleteTask(id) {
    const tasks = this.getAllTasks()
    const filtered = tasks.filter(t => t.id !== id)
    this.saveTasks(filtered)
    return filtered
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEY)
  },

  exportData() {
    const tasks = this.getAllTasks()
    return JSON.stringify(tasks, null, 2)
  },

  importData(jsonString) {
    try {
      const tasks = JSON.parse(jsonString)
      this.saveTasks(tasks)
      return true
    } catch {
      return false
    }
  }
}

export const taskStatuses = ['待办', '进行中', '已完成']
export const priorities = ['低', '中', '高']
export const categories = ['学习', '生活', '工作', '娱乐', '其他']