# Next.js 环境变量说明

## NEXT_PUBLIC_ 前缀的作用

在 Next.js 中，环境变量有两种类型：

---

## 1. 客户端环境变量（NEXT_PUBLIC_ 前缀）

### 特点：
- ✅ **可以在浏览器中访问**：会被打包到客户端代码中
- ✅ **公开可见**：任何人都可以在浏览器开发者工具中看到
- ⚠️ **会暴露给用户**：不要存储敏感信息（如 API 密钥、密码）

### 命名规则：
必须以 `NEXT_PUBLIC_` 开头

### 使用场景：
- Supabase URL（公开的）
- Supabase Anon Key（公开的，受 RLS 保护）
- 其他需要在客户端使用的配置

### 示例：
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 在代码中使用：
```typescript
// ✅ 客户端组件（可以在浏览器中使用）
'use client'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL

// ✅ 服务端组件（也可以使用）
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
```

### 在浏览器中可见：
```javascript
// 用户可以在浏览器控制台看到
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// 输出: https://xxx.supabase.co
```

---

## 2. 服务端环境变量（无 NEXT_PUBLIC_ 前缀）

### 特点：
- 🔒 **只能在服务器端访问**：不会被打包到客户端代码
- 🔒 **安全**：用户无法在浏览器中看到
- ✅ **适合存储敏感信息**：API 密钥、数据库密码等

### 命名规则：
**不能**以 `NEXT_PUBLIC_` 开头

### 使用场景：
- 数据库密码
- 私密 API 密钥（如 Service Role Key）
- 第三方服务的私密凭证

### 示例：
```env
# .env.local
DB_PASSWORD=your-secret-password
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

### 在代码中使用：
```typescript
// ✅ 服务端组件（可以访问）
// app/api/route.ts
const password = process.env.DB_PASSWORD

// ❌ 客户端组件（无法访问）
'use client'
const password = process.env.DB_PASSWORD // undefined!
```

### 在浏览器中不可见：
```javascript
// 用户无法在浏览器中看到
console.log(process.env.DB_PASSWORD)
// 输出: undefined
```

---

## 为什么 Supabase URL 需要 NEXT_PUBLIC_ 前缀？

### 原因 1：客户端需要访问

Supabase 客户端通常在前端代码中使用，需要直接连接到 Supabase：

```typescript
// components/tools/SomeTool.tsx
'use client' // 客户端组件

import { createClient } from '@supabase/supabase-js'

// 需要访问 Supabase URL 和 Anon Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // ✅ 需要 NEXT_PUBLIC_ 前缀
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ✅ 需要 NEXT_PUBLIC_ 前缀
)
```

### 原因 2：Anon Key 是公开的

Supabase 的 Anon Key 设计上就是可以公开的：
- 受 Row Level Security (RLS) 保护
- 即使暴露，也受到数据库安全策略限制
- 这是 Supabase 的设计理念

### 原因 3：Next.js 的安全机制

Next.js 通过 `NEXT_PUBLIC_` 前缀明确区分：
- **公开变量**：可以暴露给客户端
- **私密变量**：只能在服务器端使用

---

## 实际例子对比

### ✅ 正确使用

```env
# .env.local

# 公开变量（客户端可用）
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...（公开密钥）

# 私密变量（仅服务端）
DB_PASSWORD=secret-password-123
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...（私密密钥）
```

```typescript
// ✅ 客户端组件可以使用 NEXT_PUBLIC_ 变量
'use client'
export default function ClientComponent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL // ✅ 可以访问
  const password = process.env.DB_PASSWORD // ❌ undefined（无法访问）
}

// ✅ 服务端组件可以使用所有变量
export default function ServerComponent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL // ✅ 可以访问
  const password = process.env.DB_PASSWORD // ✅ 可以访问
}
```

### ❌ 错误使用

```env
# ❌ 错误：私密密钥使用 NEXT_PUBLIC_ 前缀
NEXT_PUBLIC_DB_PASSWORD=secret-password-123
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=secret-key

# 这样会导致：
# 1. 密钥暴露在客户端代码中
# 2. 任何人都可以在浏览器中看到
# 3. 安全风险！
```

```typescript
// ❌ 错误：在客户端组件中使用非 NEXT_PUBLIC_ 变量
'use client'
const password = process.env.DB_PASSWORD // undefined（无法访问）
```

---

## 当前项目的环境变量

### 客户端变量（NEXT_PUBLIC_）

```env
# Supabase 配置（客户端需要访问）
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**为什么需要 `NEXT_PUBLIC_`：**
- 客户端组件可能需要直接连接 Supabase
- Anon Key 是公开的，可以暴露
- 受 RLS 策略保护，安全

### 服务端变量（无前缀）

```env
# 本地 PostgreSQL 配置（仅服务端）
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=your-database

# Supabase Service Role Key（仅服务端，可选）
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**为什么不需要 `NEXT_PUBLIC_`：**
- 这些是敏感信息，不能暴露
- 只在服务器端使用
- 客户端不需要访问

---

## 总结

### NEXT_PUBLIC_ 前缀的作用

| 特性 | 有 `NEXT_PUBLIC_` 前缀 | 无 `NEXT_PUBLIC_` 前缀 |
|------|----------------------|---------------------|
| **客户端访问** | ✅ 可以 | ❌ 不可以 |
| **服务端访问** | ✅ 可以 | ✅ 可以 |
| **浏览器可见** | ✅ 可见 | ❌ 不可见 |
| **安全性** | ⚠️ 会暴露 | ✅ 安全 |
| **使用场景** | 公开配置 | 私密配置 |

### 规则

1. **需要客户端访问** → 使用 `NEXT_PUBLIC_` 前缀
2. **敏感信息** → 不要使用 `NEXT_PUBLIC_` 前缀
3. **Supabase URL/Anon Key** → 使用 `NEXT_PUBLIC_` 前缀（公开的）
4. **数据库密码/Service Role Key** → 不要使用 `NEXT_PUBLIC_` 前缀（私密的）

---

## 常见问题

### Q: 为什么 Supabase URL 需要 NEXT_PUBLIC_ 前缀？

**A:** 因为客户端代码需要访问 Supabase URL 来建立连接。如果不用 `NEXT_PUBLIC_` 前缀，客户端组件无法访问这个变量。

### Q: 暴露 Supabase URL 和 Anon Key 安全吗？

**A:** 是的，这是 Supabase 的设计：
- Anon Key 是公开密钥，设计上可以暴露
- 受 Row Level Security (RLS) 策略保护
- 即使暴露，也受到数据库安全策略限制

### Q: 如果我不使用 NEXT_PUBLIC_ 前缀会怎样？

**A:** 
- 在客户端组件中，`process.env.SUPABASE_URL` 会是 `undefined`
- 在服务端组件中，可以正常访问
- 但客户端无法连接 Supabase

### Q: 如何判断是否需要 NEXT_PUBLIC_ 前缀？

**A:** 问自己：
- 这个变量需要在客户端（浏览器）使用吗？
- 如果是 → 使用 `NEXT_PUBLIC_` 前缀
- 如果是敏感信息 → 不要使用 `NEXT_PUBLIC_` 前缀，只在服务端使用

---

## 相关文档

- [Next.js 官方文档 - Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase API Key 说明](../上线环境/Supabase%20API%20Key说明.md)

