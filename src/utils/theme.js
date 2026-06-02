export const themes = {
  ocean: {
    name: '海洋蓝',
    primaryGradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    primaryColor: '#0ea5e9',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    dangerColor: '#ef4444',
    infoColor: '#3b82f6',
    bgColor: '#f0f9ff',
    cardBg: '#ffffff',
    textPrimary: '#0c4a6e',
    textSecondary: '#475569',
    borderColor: '#e0f2fe',
    statusPending: '#64748b',
    statusProgress: '#0ea5e9',
    statusCompleted: '#10b981'
  },
  forest: {
    name: '森林绿',
    primaryGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    primaryColor: '#10b981',
    successColor: '#059669',
    warningColor: '#f59e0b',
    dangerColor: '#ef4444',
    infoColor: '#06b6d4',
    bgColor: '#f0fdf4',
    cardBg: '#ffffff',
    textPrimary: '#047857',
    textSecondary: '#365314',
    borderColor: '#dcfce7',
    statusPending: '#64748b',
    statusProgress: '#10b981',
    statusCompleted: '#059669'
  },
  sunset: {
    name: '落日橙',
    primaryGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    primaryColor: '#f97316',
    successColor: '#10b981',
    warningColor: '#eab308',
    dangerColor: '#ef4444',
    infoColor: '#3b82f6',
    bgColor: '#fff7ed',
    cardBg: '#ffffff',
    textPrimary: '#9a3412',
    textSecondary: '#7c2d12',
    borderColor: '#fed7aa',
    statusPending: '#64748b',
    statusProgress: '#f97316',
    statusCompleted: '#10b981'
  },
  lavender: {
    name: '薰衣草紫',
    primaryGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    primaryColor: '#8b5cf6',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    dangerColor: '#ef4444',
    infoColor: '#3b82f6',
    bgColor: '#faf5ff',
    cardBg: '#ffffff',
    textPrimary: '#4c1d95',
    textSecondary: '#581c87',
    borderColor: '#e9d5ff',
    statusPending: '#64748b',
    statusProgress: '#8b5cf6',
    statusCompleted: '#10b981'
  },
  dark: {
    name: '暗夜模式',
    primaryGradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    primaryColor: '#6366f1',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    dangerColor: '#ef4444',
    infoColor: '#3b82f6',
    bgColor: '#1e1e2e',
    cardBg: '#2a2a3e',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    borderColor: '#3f3f5a',
    statusPending: '#94a3b8',
    statusProgress: '#6366f1',
    statusCompleted: '#10b981'
  }
}

export const applyTheme = (themeKey) => {
  const theme = themes[themeKey] || themes.ocean
  const root = document.documentElement
  
  Object.entries(theme).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVar, value)
  })
  
  localStorage.setItem('task_manager_theme', themeKey)
}

export const getCurrentTheme = () => {
  return localStorage.getItem('task_manager_theme') || 'ocean'
}