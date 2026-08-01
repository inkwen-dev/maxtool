# TypeScript 基础

## 什么是 TypeScript？

TypeScript 是 JavaScript 的超集，添加了**类型系统**。代码写完后会编译成 JavaScript。

**优点：**
- ✅ 类型安全，减少错误
- ✅ 更好的 IDE 提示
- ✅ 代码更易维护

---

## 基础语法

### 1. 变量类型

```typescript
// 基本类型
let name: string = "John"
let age: number = 30
let isActive: boolean = true

// 数组
let numbers: number[] = [1, 2, 3]
let names: string[] = ["Alice", "Bob"]

// 对象
let user: { name: string; age: number } = {
  name: "John",
  age: 30
}
```

### 2. 函数类型

```typescript
// 函数参数和返回值类型
function add(a: number, b: number): number {
  return a + b
}

// 箭头函数
const multiply = (a: number, b: number): number => {
  return a * b
}
```

### 3. 接口（Interface）

```typescript
// 定义对象结构
interface User {
  id: string
  name: string
  email?: string  // ? 表示可选
}

// 使用
const user: User = {
  id: "1",
  name: "John"
}
```

### 4. 类型别名（Type）

```typescript
// 定义类型别名
type Status = "pending" | "completed" | "failed"

// 使用
let status: Status = "pending"
```

---

## 在项目中的使用

### 1. 组件 Props

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export default function Button({ variant, children }: ButtonProps) {
  return <button className={variant}>{children}</button>
}
```

### 2. 工具函数

```typescript
// lib/utils.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // 实现...
}
```

### 3. API 响应

```typescript
// app/api/track-usage/route.ts
export async function POST(request: Request) {
  const { tool } = await request.json()  // tool 自动推断为 any
  // 需要验证类型
  if (typeof tool !== 'string') {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }
}
```

---

## 常见类型

### React 相关

```typescript
// React 组件
import { ReactNode } from 'react'

interface Props {
  children: ReactNode  // React 子元素
}

// 事件处理
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // ...
}
```

### Next.js 相关

```typescript
// 页面 Props
interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// API Route
import { NextRequest, NextResponse } from 'next/server'
```

---

## 实用技巧

### 1. 类型推断

TypeScript 可以自动推断类型：

```typescript
let count = 0  // 自动推断为 number
let name = "John"  // 自动推断为 string
```

### 2. 类型断言

当你确定类型时：

```typescript
const element = document.getElementById('root') as HTMLElement
```

### 3. 可选链

```typescript
const name = user?.profile?.name  // 如果 user 或 profile 为 null，返回 undefined
```

---

## 项目中的类型定义

查看 `types/index.ts` 了解项目中定义的类型：

- `ToolName` - 工具名称类型
- `ToolCategory` - 工具分类类型
- `Tool` - 工具信息接口

---

## 学习资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript 中文网](https://www.tslang.cn/)

---

## 总结

- TypeScript = JavaScript + 类型
- 类型帮助发现错误，提高代码质量
- 项目使用 TypeScript 确保类型安全

