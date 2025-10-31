# 🔧 前端启动问题修复指南

## ❌ 错误信息

```
TSConfckParseError: Failed to scan for dependencies from entries:
/Users/xxx/stock-visualizer/frontend/index.html
```

## 🎯 原因

缺少 `tsconfig.node.json` 配置文件,导致 Vite 无法正确解析 TypeScript。

## ✅ 解决方案

### 方法 1: 创建缺失的配置文件(推荐)

在 `frontend` 目录创建 `tsconfig.node.json` 文件:

```bash
cd frontend
```

创建文件并添加以下内容:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 方法 2: 使用命令行快速创建

**Mac/Linux**:
```bash
cd frontend
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF
```

**Windows (PowerShell)**:
```powershell
cd frontend
@"
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
"@ | Out-File -FilePath tsconfig.node.json -Encoding UTF8
```

### 方法 3: 在 VS Code 中创建

1. 在 VS Code 中打开 `frontend` 文件夹
2. 右键 → New File → 输入 `tsconfig.node.json`
3. 粘贴上面的 JSON 内容
4. 保存文件

---

## 🔄 重新启动

创建文件后,重新启动开发服务器:

```bash
# 确保在 frontend 目录
cd frontend

# 清理缓存(可选但推荐)
rm -rf node_modules/.vite

# 重新启动
npm run dev
```

---

## ✅ 验证是否修复

成功启动后应该看到:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

## 🐛 如果还是不行

### 步骤 1: 完全清理

```bash
cd frontend

# 删除 node_modules 和缓存
rm -rf node_modules
rm -rf node_modules/.vite
rm -rf dist
rm package-lock.json

# 重新安装依赖
npm install
```

### 步骤 2: 检查 Node.js 版本

```bash
node -v
```

确保版本 >= 18.0.0

如果版本过低,安装最新的 LTS 版本:
- 访问 https://nodejs.org/
- 下载并安装 LTS 版本

### 步骤 3: 验证所有配置文件

确保以下文件都存在:

```bash
ls -la frontend/
```

应该看到:
- ✅ `tsconfig.json`
- ✅ `tsconfig.node.json` (新创建的)
- ✅ `vite.config.ts`
- ✅ `package.json`
- ✅ `index.html`

### 步骤 4: 检查文件内容

确认 `tsconfig.json` 中有以下配置:

```json
{
  "compilerOptions": {
    // ... 其他配置
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**注意**: 最后一行 `"references"` 很重要!

---

## 📋 完整的 frontend 配置文件清单

### 1. tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. tsconfig.node.json (新创建的)
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 3. vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 🎯 常见问题

### Q1: 为什么需要 tsconfig.node.json?

**A**: Vite 需要单独的 TypeScript 配置来处理构建工具相关的文件(如 vite.config.ts)。这是 Vite 的标准配置要求。

### Q2: 我可以直接禁用 TypeScript 检查吗?

**A**: 不推荐。TypeScript 提供类型安全,帮助避免运行时错误。正确配置比禁用更好。

### Q3: 还是报同样的错误怎么办?

**A**: 尝试:
1. 完全删除 node_modules 重新安装
2. 检查 tsconfig.json 中是否有 `"references": [{ "path": "./tsconfig.node.json" }]`
3. 确保所有配置文件编码为 UTF-8
4. 重启 VS Code
5. 重启终端

---

## 💡 预防措施

为避免类似问题,建议:

1. ✅ 始终使用推荐的项目结构
2. ✅ 不要删除配置文件
3. ✅ 使用 VS Code 的 TypeScript 支持
4. ✅ 定期更新依赖: `npm update`

---

## 📞 需要帮助?

如果按照以上步骤仍然无法解决:

1. 查看完整错误日志
2. 检查 VS Code 的 TypeScript 版本
3. 确认 Node.js 版本 >= 18
4. 查看 `frontend/VSCODE_SETUP.md` 获取更多配置信息

---

## ✅ 快速检查清单

- [ ] 创建了 `tsconfig.node.json` 文件
- [ ] 文件内容正确(JSON 格式)
- [ ] `tsconfig.json` 中有 references 配置
- [ ] 删除了 node_modules 重新安装
- [ ] Node.js 版本 >= 18
- [ ] 重启了开发服务器
- [ ] 看到 Vite 启动成功的消息

完成以上清单,99% 的问题都能解决! ✨

---

**记得下次下载项目时,这个文件已经包含在内了!** 📦
