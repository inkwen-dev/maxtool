# JWT解码器工具技术设计文档

## 1. 概述

JWT解码器工具是一款帮助用户解码、验证和分析JSON Web Tokens (JWT)的在线工具。用户可以输入JWT令牌，工具会自动解码出各个组成部分（头部、载荷、签名），并提供验证和分析功能。

## 2. 功能设计

### 2.1 核心功能
- JWT解码（分解为头部、载荷、签名）
- JWT验证（使用密钥验证签名）
- JWT结构分析
- 过期时间检查
- 实时预览
- 复制功能
- JWT构建（可选功能）

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `JwtDecoderTool`: 主组件，包含所有功能
  - `JwtInput`: JWT输入组件
  - `JwtComponents`: JWT组成部分展示和分析组件
  - `JwtVerification`: JWT验证组件
  - `JwtPreview`: 实时预览组件
  - `ActionButtons`: 操作按钮（解码、验证、复制）
  - `UsageInstructions`: 使用说明组件

### 3.2 核心实现逻辑
```javascript
// JWT解码
const decodeJwt = (jwtString) => {
  try {
    const parts = jwtString.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format: must have exactly 3 parts')
    }

    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))
    const signature = parts[2]

    // 检查过期时间
    const isExpired = payload.exp && Date.now() >= payload.exp * 1000
    const timeRemaining = payload.exp ? Math.max(0, payload.exp * 1000 - Date.now()) : null

    return {
      header,
      payload,
      signature,
      isExpired,
      timeRemaining,
      original: jwtString
    }
  } catch (error) {
    throw new Error('Failed to decode JWT: ' + error.message)
  }
}

// JWT验证（简化版，实际实现需要支持不同的签名算法）
const verifyJwt = (jwtString, secretOrPublicKey) => {
  try {
    // 这里使用简单的验证方式，实际项目中可能需要使用专门的JWT库
    const parts = jwtString.split('.')
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid JWT format' }
    }

    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))
    const signature = parts[2]

    // 检查过期时间
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { valid: false, error: 'JWT has expired' }
    }

    // 注意：这里没有实现完整的签名验证，只是检查了格式和过期时间
    // 完整的实现需要使用加密库来验证签名
    return { valid: true, error: null, header, payload }
  } catch (error) {
    return { valid: false, error: 'Verification failed: ' + error.message }
  }
}

// 格式化JWT部分
const formatJwtPart = (part) => {
  return JSON.stringify(part, null, 2)
}

// 检查JWT是否有效
const isValidJwt = (jwtString) => {
  try {
    const parts = jwtString.split('.')
    if (parts.length !== 3) return false
    
    // 检查各部分是否能正确解码
    JSON.parse(atob(parts[0]))
    JSON.parse(atob(parts[1]))
    
    return true
  } catch (error) {
    return false
  }
}
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Textarea`: 通用文本区域组件
- `JsonViewer`: JSON查看组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `copyToClipboard`: 复制功能
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface JwtHeader {
  alg: string
  typ: string
  [key: string]: any
}

interface JwtPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
  [key: string]: any
}

interface JwtDecoded {
  header: JwtHeader
  payload: JwtPayload
  signature: string
  isExpired: boolean
  timeRemaining: number | null
  original: string
}

interface JwtVerificationResult {
  valid: boolean
  error: string | null
  header?: JwtHeader
  payload?: JwtPayload
}

interface JwtDecoderState {
  inputJwt: string
  decodedJwt: JwtDecoded | null
  verificationResult: JwtVerificationResult | null
  isDecoding: boolean
  verificationKey: string
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 基本JWT解码功能
- JWT验证功能
- 过期时间检查
- 复制功能

### 6.2 边界测试
- 无效格式的JWT
- 过期的JWT
- 无效签名的JWT
- 包含各种自定义声明的JWT

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 交互流畅性
- 错误提示的友好性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化JWT解析和验证功能
- 定期更新功能和修复bug

## 8. 总结

JWT解码器工具采用组件化设计，核心功能使用原生JavaScript实现，无需额外的第三方库。工具提供JWT解码、验证和分析功能，界面直观易用，适合开发者快速处理JWT相关操作。