# React 基础

## 什么是 React？

React 是 Facebook 开发的**前端 UI 库**，用于构建用户界面。

**核心概念：**
- 组件化开发
- 虚拟 DOM
- 单向数据流

---

## 基础概念

### 1. 组件（Component）

组件是 UI 的独立部分，可以复用。

```typescript
// 函数组件
function Button() {
  return <button>Click me</button>
}

// 使用组件
<Button />
```

### 2. JSX

JSX 是 JavaScript 的扩展，可以在 JS 中写 HTML：

```typescript
const element = <h1>Hello, World!</h1>
```

---

## React Hooks

Hooks 是 React 16.8+ 的功能，让函数组件也能使用状态。

### 1. useState - 状态管理

```typescript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)  // 初始值为 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

### 2. useEffect - 副作用

用于处理副作用（API 调用、订阅等）：

```typescript
import { useState, useEffect } from 'react'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    // 组件挂载时执行
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // 组件卸载时清理
    return () => clearInterval(timer)
  }, [])  // [] 表示只在挂载时执行一次

  return <div>{time.toLocaleTimeString()}</div>
}
```

### 3. useRef - 引用

保存可变值，不触发重新渲染：

```typescript
import { useRef } from 'react'

function Timer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const start = () => {
    intervalRef.current = setInterval(() => {
      // ...
    }, 1000)
  }

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }
}
```

---

## 在项目中的使用

### 1. 工具组件示例

```typescript
// components/tools/Counter.tsx
'use client'  // Next.js 客户端组件标记

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

### 2. 组件 Props

```typescript
// 父组件传递数据给子组件
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}
```

### 3. 条件渲染

```typescript
function Tool({ isActive }: { isActive: boolean }) {
  return (
    <div>
      {isActive && <p>Tool is active</p>}
      {!isActive && <p>Tool is inactive</p>}
    </div>
  )
}
```

---

## 常用模式

### 1. 列表渲染

```typescript
const tools = ['draw-lots', 'random-number', 'flip-coin']

return (
  <div>
    {tools.map((tool) => (
      <div key={tool}>{tool}</div>
    ))}
  </div>
)
```

### 2. 事件处理

```typescript
const handleClick = () => {
  console.log('Clicked!')
}

<button onClick={handleClick}>Click</button>
```

### 3. 表单处理

```typescript
const [value, setValue] = useState('')

<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

## Next.js 中的 React

### 客户端组件 vs 服务端组件

```typescript
// 服务端组件（默认）
export default function Page() {
  return <div>Server Component</div>
}

// 客户端组件（需要交互）
'use client'
export default function Interactive() {
  const [state, setState] = useState(0)
  return <div>Client Component</div>
}
```

**规则：**
- 默认是服务端组件（更快）
- 需要 `useState`、`useEffect` 等时，添加 `'use client'`

---

## 学习资源

- [React 官方文档](https://react.dev/)
- [React 中文文档](https://zh-hans.react.dev/)

---

## 总结

- React = 组件化 UI 库
- Hooks 让函数组件也能用状态
- 项目使用 React 19 + Next.js 16

