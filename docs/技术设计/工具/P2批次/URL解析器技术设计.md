# URL解析器工具技术设计文档

## 1. 概述

URL解析器工具是一款帮助用户解析、构建和验证URL的在线工具。用户可以输入URL，工具会自动解析出各个组成部分（协议、域名、路径、查询参数、锚点等），并提供编辑和重新构建URL的功能。

## 2. 功能设计

### 2.1 核心功能
- URL解析（分解为各个组成部分）
- URL构建（从各个组成部分组合成完整URL）
- URL验证（检查URL格式是否正确）
- 实时预览
- 复制和导出功能

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `UrlParserTool`: 主组件，包含所有功能
  - `UrlInput`: URL输入组件
  - `UrlComponents`: URL组成部分展示和编辑组件
  - `UrlPreview`: 实时预览组件
  - `ActionButtons`: 操作按钮（解析、构建、验证、复制、导出）
  - `UsageInstructions`: 使用说明组件

### 3.2 核心实现逻辑
```javascript
// URL解析
const parseUrl = (urlString) => {
  try {
    const url = new URL(urlString)
    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      searchParams: Object.fromEntries(url.searchParams),
      origin: url.origin,
      href: url.href
    }
  } catch (error) {
    throw new Error('Invalid URL format')
  }
}

// URL构建
const buildUrl = (components) => {
  try {
    // 创建URL对象
    const url = new URL(components.protocol + '//' + components.hostname)
    
    // 设置各个部分
    if (components.port) url.port = components.port
    if (components.pathname) url.pathname = components.pathname
    if (components.hash) url.hash = components.hash
    
    // 设置查询参数
    if (components.searchParams && typeof components.searchParams === 'object') {
      Object.entries(components.searchParams).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value)
      })
    }
    
    return url.href
  } catch (error) {
    throw new Error('Failed to build URL')
  }
}

// URL验证
const validateUrl = (urlString) => {
  try {
    new URL(urlString)
    return { valid: true, error: null }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

// 编码URL组件
const encodeUrlComponent = (component) => {
  return encodeURIComponent(component)
}

// 解码URL组件
const decodeUrlComponent = (component) => {
  return decodeURIComponent(component)
}
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 通用输入组件
- `Textarea`: 通用文本区域组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `copyToClipboard`: 复制功能
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface UrlComponents {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  searchParams: Record<string, string>
  origin: string
  href: string
}

interface UrlValidationResult {
  valid: boolean
  error: string | null
}

interface UrlParserState {
  inputUrl: string
  components: UrlComponents | null
  outputUrl: string
  isParsing: boolean
  validationResult: UrlValidationResult
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)
- URL API (浏览器API)

## 6. 测试计划

### 6.1 功能测试
- 基本URL解析功能
- URL构建功能
- URL验证功能
- 实时预览功能
- 复制和导出功能

### 6.2 边界测试
- 复杂URL解析（包含多个查询参数、特殊字符等）
- 相对URL处理
- 特殊协议URL（如mailto:、tel:等）
- 无效URL验证

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 交互流畅性
- 错误提示的友好性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化URL解析和构建功能
- 定期更新功能和修复bug

## 8. 总结

URL解析器工具采用组件化设计，核心功能使用浏览器原生URL API实现，无需额外的第三方库。工具提供URL解析、构建和验证功能，界面直观易用，适合用户快速处理URL相关操作。