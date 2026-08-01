# Supabase 环境变量优化说明

## 问题：为什么需要 NEXT_PUBLIC_ 前缀？

### 当前项目的情况

**数据流：**
```
客户端组件 → API Route (/api/track-usage) → lib/database.ts → Supabase
```

**关键发现：**
- ✅ Supabase 客户端只在**服务端**使用（API Route 中）
- ✅ 客户端组件**不直接**连接 Supabase
- ✅ 客户端通过 API 调用，API 在服务端处理数据库操作

**结论：理论上不需要 `NEXT_PUBLIC_` 前缀！**

---

## 两种方案对比

### 方案 1：使用 NEXT_PUBLIC_ 前缀（当前）

**优点：**
- ✅ 如果未来需要在客户端直接使用 Supabase，无需修改
- ✅ Anon Key 本身就是公开的，暴露也无安全风险
- ✅ 受 RLS 保护

**缺点：**
- ⚠️ 会暴露在客户端代码中（虽然安全，但不必要）

**适用场景：**
- 未来可能需要在客户端直接连接 Supabase
- 使用 Supabase 的实时功能（Realtime）
- 使用 Supabase 的存储功能（Storage）

### 方案 2：不使用 NEXT_PUBLIC_ 前缀（推荐）

**优点：**
- ✅ 更符合最佳实践：只在需要的地方暴露
- ✅ 不会暴露在客户端代码中
- ✅ 更安全（即使 Anon Key 是公开的，也不应该不必要地暴露）

**缺点：**
- ⚠️ 如果未来需要在客户端使用，需要修改环境变量

**适用场景：**
- ✅ **当前项目**：只在服务端使用 Supabase
- ✅ 通过 API 路由访问数据库
- ✅ 不需要客户端直接连接

---

## 推荐方案：移除 NEXT_PUBLIC_ 前缀

### 原因

1. **当前项目只在服务端使用**
   - `lib/database.ts` 在服务端运行
   - API Route 在服务端运行
   - 客户端不直接访问 Supabase

2. **符合安全最佳实践**
   - 最小权限原则
   - 只在需要的地方暴露

3. **Anon Key 虽然是公开的，但不应该不必要地暴露**
   - 即使安全，也应该遵循最佳实践

---

## 如何修改

### 步骤 1：修改环境变量名

**从：**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**改为：**
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 步骤 2：修改代码

**lib/database.ts：**
```typescript
// 从
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 改为
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
```

### 步骤 3：更新 env.example

更新 `env.example` 文件，移除 `NEXT_PUBLIC_` 前缀。

---

## 总结

### 当前项目的最佳实践

**推荐配置：**
```env
# 服务端使用（不需要 NEXT_PUBLIC_ 前缀）
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**原因：**
- ✅ 只在服务端使用
- ✅ 更符合安全最佳实践
- ✅ 不会不必要地暴露在客户端

### 什么时候需要 NEXT_PUBLIC_ 前缀？

**需要 `NEXT_PUBLIC_` 前缀的情况：**
- 客户端组件直接连接 Supabase
- 使用 Supabase Realtime（实时功能）
- 使用 Supabase Storage（存储功能）
- 客户端需要直接查询数据

**不需要 `NEXT_PUBLIC_` 前缀的情况：**
- ✅ **当前项目**：只在服务端通过 API 访问
- 所有数据库操作都在服务端完成
- 客户端通过 API 调用，不直接连接数据库

---

## 相关文档

- [Next.js 环境变量说明](../开发环境/Next.js环境变量说明.md)
- [Supabase API Key 说明](./Supabase%20API%20Key说明.md)

