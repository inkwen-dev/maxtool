# Stopwatch技术设计文档

## 1. 概述

Stopwatch是一款精确的时间跟踪工具，用户可以使用它来测量经过的时间，适用于运动计时、实验测量、任务追踪等场景。该工具提供开始、暂停、重置和计次功能，支持毫秒级精度的时间显示。

## 2. 功能设计

### 2.1 核心功能
- 实时显示经过的时间（时、分、秒、毫秒）
- 提供开始、暂停、重置功能
- 支持计次功能（记录多个时间点）
- 支持清除计次记录
- 支持复制计次结果
- 支持全屏显示

### 2.2 辅助功能
- 支持自定义显示精度（毫秒、秒、分钟）
- 支持深色/浅色模式
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `StopwatchTool`: 主组件，包含所有功能
  - `StopwatchDisplay`: 秒表显示组件（时、分、秒、毫秒）
  - `ControlButtons`: 控制按钮组件（开始、暂停、重置、计次）
  - `LapList`: 计次列表组件
  - `PrecisionSelector`: 精度选择组件
  - `FullscreenButton`: 全屏按钮组件

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  isRunning: false,
  isPaused: false,
  startTime: null as number | null,
  pausedTime: null as number | null,
  elapsedTime: 0,
  laps: [] as Lap[],
  displayPrecision: 'milliseconds' as 'milliseconds' | 'seconds' | 'minutes',
  isFullscreen: false
})

// 开始秒表
const startStopwatch = () => {
  if (toolState.isPaused) {
    // 从暂停状态恢复
    setToolState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTime: Date.now() - prev.elapsedTime,
      pausedTime: null
    }))
  } else {
    // 新开始
    setToolState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTime: Date.now(),
      pausedTime: null,
      elapsedTime: 0
    }))
  }
}

// 暂停秒表
const pauseStopwatch = () => {
  setToolState(prev => ({
    ...prev,
    isRunning: false,
    isPaused: true,
    pausedTime: Date.now()
  }))
}

// 重置秒表
const resetStopwatch = () => {
  setToolState(prev => ({
    ...prev,
    isRunning: false,
    isPaused: false,
    startTime: null,
    pausedTime: null,
    elapsedTime: 0,
    laps: []
  }))
}

// 计次功能
const recordLap = () => {
  if (!toolState.isRunning) return
  
  const lapTime = Date.now() - (toolState.startTime || 0)
  const lap: Lap = {
    id: toolState.laps.length + 1,
    time: lapTime,
    splitTime: lapTime - (toolState.laps[toolState.laps.length - 1]?.time || 0)
  }
  
  setToolState(prev => ({
    ...prev,
    laps: [...prev.laps, lap]
  }))
}

// 清除计次记录
const clearLaps = () => {
  setToolState(prev => ({
    ...prev,
    laps: []
  }))
}

// 更新秒表显示
const updateStopwatch = () => {
  if (!toolState.isRunning) return
  
  const currentTime = Date.now()
  const elapsed = currentTime - (toolState.startTime || 0)
  
  setToolState(prev => ({
    ...prev,
    elapsedTime: elapsed
  }))
}

// 格式化时间显示
const formatTime = (ms: number) => {
  const totalSeconds = ms / 1000
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const milliseconds = Math.floor((ms % 1000) / 10)
  
  let timeString = ''
  
  if (hours > 0) {
    timeString += `${hours.toString().padStart(2, '0')}:`
  }
  
  timeString += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  
  if (toolState.displayPrecision === 'milliseconds') {
    timeString += `.${milliseconds.toString().padStart(2, '0')}`
  }
  
  return {
    hours,
    minutes,
    seconds,
    milliseconds,
    formatted: timeString
  }
}

// 切换显示精度
const setDisplayPrecision = (precision: 'milliseconds' | 'seconds' | 'minutes') => {
  setToolState(prev => ({
    ...prev,
    displayPrecision: precision
  }))
}

// 切换全屏模式
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`全屏模式失败: ${err.message}`)
    })
    setToolState(prev => ({
      ...prev,
      isFullscreen: true
    }))
  } else {
    document.exitFullscreen()
    setToolState(prev => ({
      ...prev,
      isFullscreen: false
    }))
  }
}

// 复制计次结果
const copyLapResults = () => {
  if (toolState.laps.length === 0) return
  
  let textToCopy = `Stopwatch Results\n`
  textToCopy += `Total Time: ${formatTime(toolState.elapsedTime).formatted}\n\n`
  textToCopy += `Laps:\n`
  
  toolState.laps.forEach(lap => {
    textToCopy += `Lap ${lap.id}: ${formatTime(lap.time).formatted} (Split: ${formatTime(lap.splitTime).formatted})\n`
  })
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('计次结果已复制到剪贴板')
  }).catch(err => {
    console.error('复制失败:', err)
  })
}

// 组件挂载时的初始化
useEffect(() => {
  let intervalId: NodeJS.Timeout | null = null
  
  if (toolState.isRunning) {
    // 每10毫秒更新一次显示（毫秒级精度）
    intervalId = setInterval(() => {
      updateStopwatch()
    }, 10)
  }
  
  // 组件卸载时清除定时器
  return () => {
    if (intervalId) clearInterval(intervalId)
  }
}, [toolState.isRunning])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Select`: 选择组件（精度选择）
- `FullscreenButton`: 全屏按钮组件（与Digital Clock和Countdown Timer工具复用）
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface Lap {
  id: number
  time: number // 累计时间（毫秒）
  splitTime: number // 与上一次计次的时间差（毫秒）
}

interface StopwatchState {
  isRunning: boolean
  isPaused: boolean
  startTime: number | null
  pausedTime: number | null
  elapsedTime: number
  laps: Lap[]
  displayPrecision: 'milliseconds' | 'seconds' | 'minutes'
  isFullscreen: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 秒表的开始、暂停、重置功能
- 计次记录和清除功能
- 显示精度切换功能
- 复制计次结果功能
- 全屏显示功能

### 6.2 边界测试
- 长时间运行秒表（数小时）
- 快速连续计次
- 暂停后长时间再恢复
- 浏览器刷新后秒表状态的处理

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 不同显示精度下的界面效果
- 计次列表的滚动和显示

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化秒表功能
- 增加计次结果导出功能
- 优化高精度计时的性能

## 8. 总结

Stopwatch工具采用组件化设计，核心功能使用JavaScript实现精确的时间测量和显示逻辑，支持计次、精度调整和全屏显示等功能。工具具有良好的用户体验和可维护性，适用于各种需要精确时间测量的场景。