# Counter技术设计文档

## 1. 概述

Counter是一款简单的计数器工具，用户可以使用它来计数人数、分数、鼠标点击次数或其他需要计数的项目。该工具支持增减计数、设置初始值、重置和保存计数结果等功能，适用于各种需要简单计数的场景。

## 2. 功能设计

### 2.1 核心功能
- 支持增加计数（+1）
- 支持减少计数（-1）
- 支持设置步长（每次增加或减少的数量）
- 支持设置初始值
- 支持重置计数
- 支持保存当前计数
- 支持加载保存的计数
- 支持多个计数器同时使用
- 支持为每个计数器设置标签
- 支持自定义计数器颜色

### 2.2 辅助功能
- 响应式设计，适配不同设备
- 使用说明和示例
- 支持深色/浅色模式

## 3. 技术设计

### 3.1 组件结构
- `CounterTool`: 主组件，包含所有功能
  - `CounterDisplay`: 计数显示组件
  - `ControlButtons`: 控制按钮组件（+、-、重置）
  - `StepControl`: 步长控制组件
  - `InitialValueControl`: 初始值控制组件
  - `MultipleCounters`: 多计数器管理组件
  - `CounterLabel`: 计数器标签组件
  - `ColorPicker`: 颜色选择器组件

### 3.2 核心实现逻辑
```javascript
// 单个计数器状态类型
interface Counter {
  id: number
  count: number
  step: number
  initialValue: number
  label: string
  color: string
}

// 工具状态管理
const [toolState, setToolState] = useState({
  counters: [] as Counter[],
  currentCounterId: null as number | null
})

// 添加新计数器
const addCounter = (initialValue: number = 0, step: number = 1, label: string = '', color: string = '#4f46e5') => {
  const newCounter: Counter = {
    id: Date.now(),
    count: initialValue,
    step,
    initialValue,
    label,
    color
  }
  
  setToolState(prev => ({
    ...prev,
    counters: [...prev.counters, newCounter],
    currentCounterId: newCounter.id
  }))
}

// 增加计数
const incrementCounter = (counterId: number) => {
  setToolState(prev => ({
    ...prev,
    counters: prev.counters.map(counter => 
      counter.id === counterId ? { ...counter, count: counter.count + counter.step } : counter
    )
  }))
}

// 减少计数
const decrementCounter = (counterId: number) => {
  setToolState(prev => ({
    ...prev,
    counters: prev.counters.map(counter => 
      counter.id === counterId ? { ...counter, count: counter.count - counter.step } : counter
    )
  }))
}

// 设置步长
const setStep = (counterId: number, step: number) => {
  // 确保步长为正数
  const validStep = Math.max(1, Math.abs(step))
  
  setToolState(prev => ({
    ...prev,
    counters: prev.counters.map(counter => 
      counter.id === counterId ? { ...counter, step: validStep } : counter
    )
  }))
}

// 设置初始值
const setInitialValue = (counterId: number, initialValue: number) => {
  setToolState(prev => ({
    ...prev,
    counters: prev.counters.map(counter => 
      counter.id === counterId ? { ...counter, initialValue } : counter
    )
  }))
}

// 重置计数
const resetCounter = (counterId: number) => {
  setToolState(prev => ({
    ...prev,
    counters: prev.counters.map(counter => 
      counter.id === counterId ? { ...counter, count: counter.initialValue } : counter
    )
  }))
}

// 删除计数器
const deleteCounter = (counterId: number) => {
  setToolState(prev => ({
    ...prev,
    counters: prev.counters.filter(counter => counter.id !== counterId),
    currentCounterId: prev.currentCounterId === counterId ? (prev.counters.length > 1 ? prev.counters[0].id : null) : prev.currentCounterId
  }))
}

// 设置计数器标签
const setCounterLabel = (counterId: number, label: string) => {
  setToolState(prev => ({
    ...prev,
    counters: prev.counters.map(counter => 
      counter.id === counterId ? { ...counter, label } : counter
    )
  }))
}

// 设置计数器颜色
const setCounterColor = (counterId: number, color: string) => {
  setToolState(prev => ({
    ...prev,
    counters: prev.counters.map(counter => 
      counter.id === counterId ? { ...counter, color } : counter
    )
  }))
}

// 保存计数器到本地存储
const saveCounters = () => {
  localStorage.setItem('counters', JSON.stringify(toolState.counters))
}

// 加载计数器从本地存储
const loadCounters = () => {
  const savedCounters = localStorage.getItem('counters')
  if (savedCounters) {
    const counters = JSON.parse(savedCounters)
    setToolState(prev => ({
      ...prev,
      counters,
      currentCounterId: counters.length > 0 ? counters[0].id : null
    }))
  }
}

// 组件挂载时的初始化
useEffect(() => {
  // 加载保存的计数器
  loadCounters()
  
  // 如果没有保存的计数器，创建一个默认计数器
  if (toolState.counters.length === 0) {
    addCounter(0, 1, '默认计数器', '#4f46e5')
  }
}, [])

// 保存计数器到本地存储
useEffect(() => {
  if (toolState.counters.length > 0) {
    saveCounters()
  }
}, [toolState.counters])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 输入组件
- `ColorPicker`: 颜色选择器组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface Counter {
  id: number
  count: number
  step: number
  initialValue: number
  label: string
  color: string
}

interface CounterState {
  counters: Counter[]
  currentCounterId: number | null
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 单个计数器的增加、减少功能
- 步长设置功能
- 初始值设置功能
- 重置功能
- 多计数器管理功能
- 标签和颜色设置功能
- 保存和加载功能

### 6.2 边界测试
- 设置非常大的步长
- 设置负数的初始值
- 多个计数器同时操作的情况
- 浏览器刷新后计数器的恢复情况

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 多计数器的管理界面

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化计数器功能
- 增加更多计数器样式和自定义选项

## 8. 总结

Counter工具采用组件化设计，核心功能使用JavaScript实现计数逻辑，支持单个和多个计数器，提供步长设置、初始值设置、标签和颜色自定义等功能。工具具有良好的用户体验和可维护性，适用于各种需要计数的场景。