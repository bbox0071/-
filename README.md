# 任务管理系统

## 项目名称

任务管理系统 (Task Management System)

## 项目简介

基于 Vue 3 + Vite 构建的现代化任务管理系统，提供完整的任务CRUD操作、状态管理、搜索筛选、统计分析等功能，支持多主题切换和响应式布局。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **路由管理**: Vue Router 4
- **图表库**: ECharts
- **数据存储**: localStorage
- **样式**: CSS3 + CSS Variables
- **语言**: JavaScript (ES6+)

## 功能列表

### 📋 任务管理
- 创建新任务（标题、描述、状态、优先级、分类、截止日期）
- 编辑现有任务
- 删除单个任务
- 批量清除已完成任务
- 任务状态切换（待办 → 进行中 → 已完成）

### 🔍 搜索与筛选
- 关键词搜索（标题和描述）
- 状态筛选（待办/进行中/已完成）
- 优先级筛选（低/中/高）
- 分类筛选（学习/生活/工作/娱乐/其他）
- 逾期任务筛选

### 📊 数据统计
- 总任务数统计
- 各状态任务数量（待办/进行中/已完成）
- 任务完成率计算
- 逾期任务数统计
- 优先级分布图表
- 分类分布图表
- 近7天任务完成趋势

### 🎨 主题系统
- 5套预设主题（海洋蓝、森林绿、落日橙、薰衣草紫、暗夜模式）
- 主题色实时同步到页面元素
- 平滑过渡动画

### 💾 数据管理
- localStorage本地持久化
- 数据导出为JSON文件
- 从JSON文件导入数据
- 清空全部数据（带确认提示）

### 📱 响应式设计
- 适配桌面端和移动端
- 移动端汉堡菜单导航

## 项目运行步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

开发服务器启动后访问: http://localhost:5173/

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 项目结构

```
├── public/                  # 静态资源
├── src/
│   ├── assets/             # 资源文件
│   ├── components/         # 可复用组件
│   │   ├── TaskCard.vue    # 任务卡片组件
│   │   ├── TaskForm.vue    # 任务表单组件
│   │   ├── TaskFilter.vue  # 筛选组件
│   │   ├── StatPanel.vue   # 统计面板组件
│   │   └── Toast.vue       # 提示组件
│   ├── views/             # 页面视图
│   │   ├── DashboardView.vue  # 首页仪表盘
│   │   ├── TaskListView.vue   # 任务列表页
│   │   ├── TaskEditView.vue   # 任务编辑页
│   │   ├── StatsView.vue      # 统计分析页
│   │   └── SettingsView.vue   # 设置页
│   ├── router/            # 路由配置
│   │   └── index.js       # 路由定义
│   ├── utils/             # 工具函数
│   │   ├── storage.js     # 本地存储工具
│   │   ├── theme.js       # 主题配置
│   │   └── toast.js       # Toast工具
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

## 路由说明

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 统计概览和近期任务 |
| `/tasks` | 任务列表 | 任务列表和筛选排序 |
| `/tasks/new` | 新建任务 | 创建新任务表单 |
| `/tasks/:id/edit` | 编辑任务 | 修改现有任务 |
| `/stats` | 统计分析 | 数据统计和图表展示 |
| `/settings` | 设置 | 主题切换和数据管理 |

## 数据持久化方案说明

### 方案选择

本项目采用 **localStorage** 作为数据持久化方案，具有以下特点：

### 实现方式

1. **存储结构**: 将任务数据序列化为JSON字符串存储在localStorage中
2. **存储键名**: `task_manager_tasks`
3. **操作封装**: 通过 `src/utils/storage.js` 封装所有存储操作

### 核心API

| 方法 | 说明 |
|------|------|
| `getAllTasks()` | 获取所有任务 |
| `saveTasks(tasks)` | 保存任务列表 |
| `addTask(task)` | 添加新任务 |
| `updateTask(id, task)` | 更新指定任务 |
| `deleteTask(id)` | 删除指定任务 |
| `clearAllTasks()` | 清空所有任务 |

### 数据结构

```javascript
{
  id: Number,           // 唯一标识（时间戳）
  title: String,        // 任务标题（必填）
  description: String,  // 任务描述（可选）
  status: String,       // 状态：待办、进行中、已完成
  priority: String,     // 优先级：低、中、高
  category: String,     // 分类：学习、生活、工作、娱乐、其他
  dueDate: String,      // 截止日期（YYYY-MM-DD）
  createdAt: String,    // 创建时间（ISO格式）
  updatedAt: String     // 更新时间（ISO格式）
}
```

### 数据导入导出

- **导出**: 将任务数据导出为JSON文件下载
- **导入**: 从本地JSON文件导入任务数据
- **数据格式**: 标准JSON数组格式

## Git 提交记录说明

### 提交规范

本项目遵循统一的Commit提交规范：

```bash
<类型>: <简要说明本次提交内容>
```

### 提交类型说明

| 类型 | 说明 | 示例 |
|------|------|------|
| `init` | 项目初始化 | `init: 创建Vue 3项目基础结构` |
| `feat` | 新增功能 | `feat: 实现任务搜索和筛选功能` |
| `fix` | 缺陷修复 | `fix: 修复任务状态切换异常` |
| `style` | 样式调整 | `style: 优化任务卡片样式布局` |
| `refactor` | 代码重构 | `refactor: 拆分任务表单组件` |
| `docs` | 文档修改 | `docs: 补充README使用说明` |

### 查看提交历史

```bash
git log --oneline --graph --decorate
```

### 项目开发提交记录

```
init: 创建Vue 3 + Vite项目基础架构
feat: 配置Vue Router实现页面路由功能
feat: 实现localStorage本地数据存储工具
feat: 开发任务卡片组件TaskCard
feat: 开发任务表单组件TaskForm
feat: 开发任务筛选组件TaskFilter
feat: 开发统计面板组件StatPanel
feat: 开发首页仪表盘DashboardView
feat: 开发任务列表页TaskListView
feat: 开发任务编辑页TaskEditView
feat: 开发统计分析页StatsView
feat: 开发设置页SettingsView
feat: 开发Toast提示组件
style: 优化任务卡片样式和状态标识
style: 实现响应式布局适配移动端
feat: 实现任务搜索和筛选功能
feat: 实现任务排序功能
feat: 实现数据统计和图表展示
feat: 实现数据导入导出功能
feat: 实现主题切换功能
docs: 完善README文件添加使用说明
```

## Git 仓库地址

**GitHub**: https://github.com/bbox0071/-

## 许可证

MIT License
