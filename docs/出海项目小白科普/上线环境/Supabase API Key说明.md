# Supabase API Key 说明

## 两种 API Key 的区别

Supabase 提供两种 API Key，用途完全不同：

---

## 1. Anon Key（匿名密钥）- 必需 ✅

**环境变量名：** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**特点：**
- ✅ **公开密钥**：可以暴露在前端代码中（`NEXT_PUBLIC_` 前缀表示可以在浏览器中使用）
- ✅ **受 Row Level Security (RLS) 保护**：即使暴露，也受到数据库安全策略保护
- ✅ **适合前端使用**：客户端代码可以直接使用
- ⚠️ **权限受限**：只能执行数据库安全策略允许的操作

**用途：**
- 前端直接连接 Supabase
- 客户端数据查询和插入
- 受 RLS 策略保护的操作

**当前项目使用：**
```typescript
// lib/database.ts
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
supabaseClient = createClient(supabaseUrl, supabaseKey)
```

---

## 2. Service Role Key（服务角色密钥）- 可选 ⚠️

**环境变量名：** `SUPABASE_SERVICE_ROLE_KEY`

**特点：**
- 🔒 **私密密钥**：**绝对不能暴露在前端代码中**
- ⚠️ **绕过 RLS**：拥有完全管理员权限，可以绕过所有 Row Level Security 策略
- ⚠️ **危险**：如果泄露，攻击者可以完全控制数据库
- ✅ **适合服务端使用**：只能在服务器端代码中使用（API Routes、Server Actions）

**用途：**
- 服务端需要绕过 RLS 的操作
- 管理员操作（如批量删除、数据迁移）
- 需要完全控制数据库的场景

**什么时候需要：**
- 需要绕过 RLS 策略
- 需要执行管理员操作
- 需要批量操作数据

---

## 当前项目是否需要 Service Role Key？

### ✅ **不需要**（当前情况）

**原因：**
1. **项目功能简单**：只需要记录工具使用统计（`usage_stats` 表）
2. **使用 Anon Key 足够**：Anon Key 可以执行插入和查询操作
3. **RLS 策略允许**：如果配置了正确的 RLS 策略，Anon Key 可以正常使用

**当前代码：**
```typescript
// lib/database.ts - 只使用 Anon Key
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
supabaseClient = createClient(supabaseUrl, supabaseKey)
```

---

## 如何配置 RLS 策略（如果使用 Anon Key）

如果使用 Anon Key，需要在 Supabase 中配置 Row Level Security (RLS) 策略：

### 1. 启用 RLS

在 Supabase Dashboard：
1. 进入项目 → Table Editor
2. 选择 `usage_stats` 表
3. 点击 "Enable RLS"（启用行级安全）

### 2. 创建策略（Policy）

允许匿名用户插入和查询：

```sql
-- 允许任何人插入（记录使用统计）
CREATE POLICY "Allow anonymous insert" ON usage_stats
FOR INSERT
TO anon
WITH CHECK (true);

-- 允许任何人查询（查看统计）
CREATE POLICY "Allow anonymous select" ON usage_stats
FOR SELECT
TO anon
USING (true);
```

**执行方式：**
1. 进入 Supabase Dashboard → SQL Editor
2. 粘贴上面的 SQL
3. 点击 "Run"

---

## 什么时候需要 Service Role Key？

### 场景 1：需要绕过 RLS

如果某些操作需要绕过 RLS 策略，可以使用 Service Role Key：

```typescript
// 只在服务端使用（API Route）
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 服务端密钥
)

// 这个客户端可以绕过所有 RLS 策略
```

### 场景 2：管理员操作

如果需要执行管理员操作（如批量删除、数据迁移）：

```typescript
// app/api/admin/cleanup/route.ts
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // 删除 30 天前的数据（需要管理员权限）
  await supabaseAdmin
    .from('usage_stats')
    .delete()
    .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
}
```

### 场景 3：数据迁移

如果需要执行数据迁移或批量操作：

```typescript
// 批量更新数据
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 可以执行任何操作，不受 RLS 限制
```

---

## 安全建议

### ✅ 使用 Anon Key（推荐）

**优点：**
- 安全：即使暴露，也受 RLS 保护
- 简单：配置 RLS 策略即可
- 适合大多数场景

**配置：**
1. 在 Supabase 中启用 RLS
2. 创建允许匿名操作的策略
3. 使用 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ⚠️ 使用 Service Role Key（谨慎）

**注意事项：**
- 🔒 **绝对不能暴露在前端**：不要使用 `NEXT_PUBLIC_` 前缀
- 🔒 **只在服务端使用**：API Routes、Server Actions
- 🔒 **不要提交到 Git**：确保在 `.gitignore` 中
- 🔒 **限制使用范围**：只在必要时使用

**配置：**
```env
# .env.local（本地）
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vercel 环境变量（生产环境）
# 只在 Vercel Dashboard 中配置，不要提交到代码
```

---

## 总结

### 当前项目配置

**必需：**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - 项目 URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 匿名密钥（前端使用）

**可选：**
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` - 服务角色密钥（**当前项目不需要**）

### 推荐配置

对于当前项目（工具使用统计），**只需要 Anon Key**：

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**不需要配置 `SUPABASE_SERVICE_ROLE_KEY`**，除非：
- 需要执行管理员操作
- 需要绕过 RLS 策略
- 需要批量操作数据

---

## 快速参考

| 特性 | Anon Key | Service Role Key |
|------|----------|------------------|
| **环境变量** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `SUPABASE_SERVICE_ROLE_KEY` |
| **是否可暴露** | ✅ 可以（前端） | ❌ 绝对不能 |
| **权限** | 受 RLS 限制 | 完全管理员权限 |
| **使用场景** | 前端、客户端 | 服务端、管理员操作 |
| **当前项目** | ✅ 必需 | ❌ 不需要 |

---

## 相关文档

- [Supabase 官方文档 - API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [项目数据库配置](../上线资源/数据库设计.md)

