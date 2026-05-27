# 任务管理系统

基于 Vue 3 + Vite 构建的现代化任务管理系统。

## 功能特性

- 📋 **任务管理**: 创建、编辑、删除任务
- 🏷️ **状态管理**: 支持待办、进行中、已完成状态切换
- 🔍 **搜索筛选**: 支持关键词搜索和多维度筛选
- 📊 **统计分析**: 可视化图表展示任务数据
- 💾 **数据持久化**: 使用 localStorage 存储数据
- 📱 **响应式设计**: 适配桌面和移动端

## 技术栈

- Vue 3
- Vite
- Vue Router
- ECharts

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── TaskCard.vue      # 任务卡片组件
│   │   ├── TaskForm.vue      # 任务表单组件
│   │   ├── TaskFilter.vue    # 筛选组件
│   │   └── StatPanel.vue     # 统计面板组件
│   ├── views/
│   │   ├── DashboardView.vue # 首页仪表盘
│   │   ├── TaskListView.vue  # 任务列表页
│   │   ├── TaskEditView.vue  # 任务编辑页
│   │   ├── StatsView.vue     # 统计分析页
│   │   └── SettingsView.vue  # 设置页
│   ├── router/
│   │   └── index.js          # 路由配置
│   ├── utils/
│   │   └── storage.js        # 本地存储工具
│   ├── App.vue
│   └── main.js
├── package.json
├── vite.config.js
└── README.md
```

## 路由说明

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 统计概览和待办任务 |
| `/tasks` | 任务列表 | 任务列表和筛选 |
| `/tasks/new` | 新建任务 | 创建新任务 |
| `/tasks/:id/edit` | 编辑任务 | 修改任务 |
| `/stats` | 统计分析 | 数据统计和图表 |
| `/settings` | 设置 | 数据管理 |

## 任务数据结构

```javascript
{
  id: Number,           // 唯一标识
  title: String,        // 任务标题
  description: String,  // 任务描述
  status: String,       // 状态：待办、进行中、已完成
  priority: String,     // 优先级：低、中、高
  category: String,     // 分类：学习、生活、工作、娱乐、其他
  dueDate: String,      // 截止日期
  createdAt: String,    // 创建时间
  updatedAt: String     // 更新时间
}
```

## 功能说明

### 任务管理
- 支持创建、编辑、删除任务
- 支持任务状态切换
- 支持批量清除已完成任务

### 搜索筛选
- 关键词搜索（标题和描述）
- 状态筛选
- 优先级筛选
- 分类筛选
- 逾期任务筛选

### 排序功能
- 按创建时间排序
- 按截止日期排序
- 按优先级排序
- 支持升序/降序切换

### 数据管理
- 导出数据到 JSON 文件
- 从 JSON 文件导入数据
- 清空全部数据

## Git版本控制

本项目采用Git进行版本控制，提交记录遵循规范格式：

```bash
<类型>: <简要说明本次提交内容>
```

### 提交类型说明
- `init`: 项目初始化操作
- `feat`: 新增功能开发
- `fix`: 缺陷修复
- `style`: 样式调整
- `refactor`: 代码重构
- `docs`: 文档修改

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
docs: 完善README文件添加使用说明
```

## 许可证

MIT License