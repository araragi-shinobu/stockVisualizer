# VS Code 前端开发配置指南

## 📋 环境准备

### 必备软件
- ✅ Visual Studio Code (最新版)
- ✅ Node.js 18+ (推荐 LTS 版本)
- ✅ npm (Node.js 自带) 或 yarn

---

## 🚀 快速开始 (3 分钟)

### 步骤 1: 打开项目

1. **启动 VS Code**
2. **选择**: `File` → `Open Folder...`
3. **选择**: `stock-visualizer/frontend` 文件夹
4. **点击**: `Select Folder`

### 步骤 2: 安装依赖

打开终端 (`` Ctrl+` `` 或 `View` → `Terminal`):

```bash
# 使用 npm (推荐)
npm install

# 或使用 yarn
yarn install
```

等待依赖安装完成 (~2 分钟)。

### 步骤 3: 配置环境变量

在 `frontend` 目录创建 `.env.local` 文件:

```bash
# 开发环境 API 地址
VITE_API_URL=http://localhost:8080/api
```

**注意**: Vite 要求环境变量必须以 `VITE_` 开头!

### 步骤 4: 启动开发服务器

```bash
npm run dev
```

看到以下输出表示成功:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 步骤 5: 验证

打开浏览器访问 `http://localhost:3000`,应该能看到应用界面。

**前提**: 后端服务必须已启动 (http://localhost:8080)

---

## 🔌 必装插件

打开扩展面板 (Ctrl+Shift+X),搜索并安装:

### 1. 核心插件 (必须)

| 插件名称 | 用途 |
|---------|------|
| **ESLint** | 代码检查和格式化 |
| **Prettier** | 代码格式化 |
| **Tailwind CSS IntelliSense** | Tailwind 类名自动补全 |
| **TypeScript Vue Plugin (Volar)** | TypeScript 支持 |

### 2. 推荐插件

| 插件名称 | 用途 |
|---------|------|
| **ES7+ React/Redux/React-Native snippets** | React 代码片段 |
| **Auto Rename Tag** | 自动重命名配对标签 |
| **Path Intellisense** | 路径自动补全 |
| **Import Cost** | 显示导入包大小 |
| **GitLens** | Git 增强工具 |
| **Error Lens** | 行内显示错误 |
| **Thunder Client** | API 测试工具 |

### 3. 主题和图标 (可选)

- **One Dark Pro** - 流行的深色主题
- **Material Icon Theme** - 美观的文件图标

---

## ⚙️ VS Code 配置

### 1. 创建工作区配置

在 `frontend` 目录创建 `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["class:\\s*?[\"'`]([^\"'`]*).*?[\"'`]", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 2. 创建推荐扩展列表

在 `frontend` 目录创建 `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "wix.vscode-import-cost",
    "eamodio.gitlens"
  ]
}
```

### 3. 创建调试配置

在 `frontend` 目录创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
```

---

## 📁 项目结构导航

```
frontend/
├── src/
│   ├── components/              ← React 组件
│   │   ├── SearchBox.tsx           搜索框组件
│   │   ├── QuoteCard.tsx           报价卡片组件
│   │   └── StockChart.tsx          图表组件
│   ├── pages/                   ← 页面组件
│   │   └── HomePage.tsx            主页面
│   ├── services/                ← 服务层
│   │   ├── api.ts                  API 调用封装
│   │   └── storage.ts              本地存储工具
│   ├── types/                   ← TypeScript 类型
│   │   └── index.ts                类型定义
│   ├── App.tsx                  ← 应用主组件
│   ├── main.tsx                 ← 入口文件
│   └── index.css                ← 全局样式
├── public/                      ← 静态资源
├── index.html                   ← HTML 模板
├── package.json                 ← 依赖配置
├── vite.config.ts              ← Vite 配置
├── tsconfig.json               ← TypeScript 配置
├── tailwind.config.js          ← Tailwind 配置
└── postcss.config.js           ← PostCSS 配置
```

---

## 🛠️ 常用开发任务

### 1. 开发服务器

```bash
# 启动开发服务器 (带热重载)
npm run dev

# 指定端口
npm run dev -- --port 3001

# 暴露到局域网
npm run dev -- --host
```

### 2. 构建生产版本

```bash
# 构建
npm run build

# 构建后的文件在 dist/ 目录

# 预览生产构建
npm run preview
```

### 3. 代码检查

```bash
# 运行 ESLint
npm run lint

# 自动修复
npm run lint -- --fix
```

### 4. 类型检查

```bash
# TypeScript 类型检查
npx tsc --noEmit
```

---

## ⌨️ VS Code 快捷键

### 常用快捷键

| 功能 | Windows/Linux | macOS |
|------|--------------|-------|
| 命令面板 | Ctrl+Shift+P | ⌘⇧P |
| 快速打开文件 | Ctrl+P | ⌘P |
| 终端 | Ctrl+` | ⌃` |
| 侧边栏 | Ctrl+B | ⌘B |
| 搜索文件 | Ctrl+Shift+F | ⌘⇧F |
| 格式化代码 | Shift+Alt+F | ⇧⌥F |
| 转到定义 | F12 | F12 |
| 查找引用 | Shift+F12 | ⇧F12 |
| 重命名符号 | F2 | F2 |
| 多光标 | Ctrl+D | ⌘D |

### React 开发快捷键

| 操作 | 快捷方式 |
|------|---------|
| 创建函数组件 | `rafce` + Tab |
| 创建箭头函数组件 | `rafc` + Tab |
| 导入 React | `imr` + Tab |
| useState | `useState` + Tab |
| useEffect | `useEffect` + Tab |

---

## 🎨 代码片段

### 创建自定义代码片段

`File` → `Preferences` → `User Snippets` → `typescriptreact.json`:

```json
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "interface ${1:Component}Props {",
      "  $2",
      "}",
      "",
      "export function ${1:Component}({ $3 }: ${1:Component}Props) {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "}"
    ],
    "description": "React Function Component with TypeScript"
  }
}
```

---

## 🧪 测试 API

### 使用 Thunder Client (推荐)

1. 安装 Thunder Client 扩展
2. 点击左侧闪电图标
3. 创建新请求:

**测试健康检查**:
```
GET http://localhost:8080/api/stocks/health
```

**测试报价查询**:
```
GET http://localhost:8080/api/stocks/quote/AAPL
```

### 使用浏览器开发者工具

1. 按 F12 打开开发者工具
2. 切换到 `Network` 标签
3. 在应用中触发 API 请求
4. 查看请求和响应详情

---

## 🐛 调试技巧

### 1. 浏览器调试

1. 在 VS Code 中设置断点(点击行号左侧)
2. 按 F5 启动调试
3. 在 Chrome 中操作应用,触发断点

### 2. Console 调试

在代码中添加:
```typescript
console.log('变量值:', variable);
console.table(arrayData);
console.error('错误信息:', error);
```

在浏览器 Console 查看输出。

### 3. React DevTools

安装浏览器扩展:
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

功能:
- 查看组件树
- 检查 props 和 state
- 性能分析

---

## 🎯 开发工作流

### 1. 创建新组件

```bash
# 在 src/components 目录
touch src/components/NewComponent.tsx
```

```typescript
// NewComponent.tsx
interface NewComponentProps {
  title: string;
}

export function NewComponent({ title }: NewComponentProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
```

### 2. 添加新 API

在 `src/services/api.ts` 中添加:

```typescript
async getNewData(): Promise<NewDataType> {
  const response = await this.api.get<ApiResponse<NewDataType>>('/stocks/new-endpoint');
  return response.data.data!;
}
```

### 3. Git 工作流

```bash
# 查看状态
git status

# 添加文件
git add .

# 提交
git commit -m "feat: 添加新功能"

# 推送
git push
```

---

## 🔧 常见问题

### 问题 1: 模块找不到

**症状**: `Cannot find module 'xxx'`

**解决方案**:
```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 2: 端口被占用

**症状**: `Port 3000 is already in use`

**解决方案**:
```bash
# 查找占用进程
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# 或使用其他端口
npm run dev -- --port 3001
```

### 问题 3: Tailwind 类名不生效

**症状**: 样式没有应用

**解决方案**:
1. 确保 `tailwind.config.js` 配置正确
2. 检查 `index.css` 是否导入 Tailwind
3. 重启开发服务器

### 问题 4: TypeScript 类型错误

**症状**: 红色波浪线,类型不匹配

**解决方案**:
1. 检查 `types/index.ts` 类型定义
2. 使用 `as` 类型断言(谨慎使用)
3. 添加可选属性 `?` 或联合类型 `|`

### 问题 5: API 请求失败

**症状**: Network Error 或 CORS 错误

**解决方案**:
1. 确保后端已启动
2. 检查 API URL 配置
3. 查看浏览器 Console 错误详情
4. 检查后端 CORS 配置

---

## 📊 性能优化

### 1. 分析包大小

```bash
# 构建并分析
npm run build
```

查看 `dist/` 目录文件大小。

### 2. 懒加载组件

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 3. 使用 React.memo

```typescript
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  // 只在 props 变化时重新渲染
  return <div>{data}</div>;
});
```

---

## 🎨 Tailwind CSS 技巧

### 1. 常用类名

```html
<!-- 布局 -->
<div className="flex items-center justify-between">
<div className="grid grid-cols-3 gap-4">

<!-- 间距 -->
<div className="p-4 m-2">  <!-- padding, margin -->
<div className="px-6 py-3"> <!-- padding x, y -->

<!-- 文字 -->
<h1 className="text-2xl font-bold text-gray-900">
<p className="text-sm text-gray-600">

<!-- 颜色 -->
<div className="bg-blue-500 text-white">
<button className="hover:bg-blue-600">

<!-- 圆角和阴影 -->
<div className="rounded-lg shadow-md">
```

### 2. 响应式设计

```html
<div className="w-full md:w-1/2 lg:w-1/3">
  <!-- 移动端全宽,平板半宽,桌面三分之一宽 -->
</div>
```

### 3. 自定义类名

在 `tailwind.config.js` 中扩展:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#667eea',
      },
    },
  },
}
```

---

## 📚 学习资源

- [React 官方文档](https://react.dev/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Recharts 文档](https://recharts.org/)

---

## 💡 VS Code 插件推荐

### 提升效率

1. **Multiple cursor case preserve** - 保持大小写的多光标编辑
2. **Bracket Pair Colorizer** - 彩色括号匹配
3. **TODO Highlight** - 高亮 TODO 注释
4. **Better Comments** - 美化注释

### 代码质量

1. **SonarLint** - 代码质量检查
2. **Code Spell Checker** - 拼写检查

---

## 🎓 开发建议

### 1. 组件设计原则

- ✅ 单一职责:每个组件只做一件事
- ✅ Props 类型化:使用 TypeScript 接口
- ✅ 可复用性:提取共用逻辑
- ✅ 避免深层嵌套

### 2. 状态管理

- ✅ 状态提升:共享状态放在父组件
- ✅ 使用 Context:跨层级数据共享
- ✅ 避免过度状态:能计算的不存储

### 3. 性能优化

- ✅ 使用 React.memo 避免不必要的渲染
- ✅ 使用 useCallback 缓存函数
- ✅ 使用 useMemo 缓存计算结果
- ✅ 懒加载大组件

---

## 📞 需要帮助?

- 查看项目根目录的 `README.md`
- 查看 `QUICKSTART.md` 常见问题
- 参考 React 和 Vite 官方文档
- 使用 VS Code 内置帮助 (Ctrl+Shift+P → Help)

---

祝你开发顺利! 🚀

**提示**: 配置完成后,可以在终端运行 `npm run dev` 开始开发!
