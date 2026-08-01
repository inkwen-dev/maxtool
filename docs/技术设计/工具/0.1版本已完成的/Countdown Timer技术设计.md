# Countdown Timer技术设计文档

## 1. 概述

Countdown Timer是一款在线倒计时应用，用户可以设置特定的倒计时时间，工具会实时显示剩余时间并在时间结束时发出提醒。该工具适用于各种需要计时的场景，如会议、考试、运动、烹饪等。

## 2. 功能设计

### 2.1 核心功能
- 支持设置时、分、秒级别的倒计时时间
- 实时显示倒计时剩余时间
- 提供开始、暂停、重置功能
- 支持多个倒计时器同时运行
- 支持倒计时结束时发出声音提醒
- 支持倒计时结束时显示弹窗提醒
- 支持全屏显示倒计时

### 2.2 辅助功能
- 支持保存常用倒计时模板
- 支持自定义倒计时样式（颜色、字体、背景）
- 支持设置倒计时标签
- 支持深色/浅色模式
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `CountdownTimerTool`: 主组件，包含所有功能
  - `TimeInput`: 时间输入组件（时、分、秒）
  - `CountdownDisplay`: 倒计时显示组件
  - `ControlButtons`: 控制按钮组件（开始、暂停、重置）
  - `MultipleTimers`: 多计时器管理组件
  - `TemplateManager`: 模板管理组件（保存、加载模板）
  - `StyleCustomization`: 样式自定义组件
  - `FullscreenButton`: 全屏按钮组件

### 3.2 核心实现逻辑
```javascript
// 单个计时器状态类型
interface Timer {
  id: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  remainingSeconds: number
  isRunning: boolean
  isPaused: boolean
  label: string
  color: string
}

// 工具状态管理
const [toolState, setToolState] = useState({
  timers: [] as Timer[],
  currentTimerId: null as number | null,
  showTemplateManager: false,
  isFullscreen: false
})

// 添加新计时器
const addTimer = (hours: number = 0, minutes: number = 0, seconds: number = 0, label: string = '', color: string = '#4f46e5') => {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  const newTimer: Timer = {
    id: Date.now(),
    hours,
    minutes,
    seconds,
    totalSeconds,
    remainingSeconds: totalSeconds,
    isRunning: false,
    isPaused: false,
    label,
    color
  }
  
  setToolState(prev => ({
    ...prev,
    timers: [...prev.timers, newTimer],
    currentTimerId: newTimer.id
  }))
}

// 开始计时器
const startTimer = (timerId: number) => {
  setToolState(prev => ({
    ...prev,
    timers: prev.timers.map(timer => 
      timer.id === timerId ? { ...timer, isRunning: true, isPaused: false } : timer
    )
  }))
}

// 暂停计时器
const pauseTimer = (timerId: number) => {
  setToolState(prev => ({
    ...prev,
    timers: prev.timers.map(timer => 
      timer.id === timerId ? { ...timer, isRunning: false, isPaused: true } : timer
    )
  }))
}

// 重置计时器
const resetTimer = (timerId: number) => {
  setToolState(prev => ({
    ...prev,
    timers: prev.timers.map(timer => 
      timer.id === timerId ? {
        ...timer,
        remainingSeconds: timer.totalSeconds,
        isRunning: false,
        isPaused: false
      } : timer
    )
  }))
}

// 删除计时器
const deleteTimer = (timerId: number) => {
  setToolState(prev => ({
    ...prev,
    timers: prev.timers.filter(timer => timer.id !== timerId),
    currentTimerId: prev.currentTimerId === timerId ? (prev.timers.length > 1 ? prev.timers[0].id : null) : prev.currentTimerId
  }))
}

// 更新计时器显示
const updateTimers = () => {
  setToolState(prev => ({
    ...prev,
    timers: prev.timers.map(timer => {
      if (!timer.isRunning) return timer
      
      if (timer.remainingSeconds <= 1) {
        // 计时器结束
        alert(`倒计时结束！${timer.label ? `标签: ${timer.label}` : ''}`)
        // 播放提醒声音
        playNotificationSound()
        return {
          ...timer,
          remainingSeconds: 0,
          isRunning: false
        }
      }
      
      return {
        ...timer,
        remainingSeconds: timer.remainingSeconds - 1
      }
    })
  }))
}

// 播放提醒声音
const playNotificationSound = () => {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-digital-clock-digital-alarm-buzzer-992.mp3')
  audio.play().catch(err => console.error('Failed to play sound:', err))
}

// 格式化剩余时间
const formatRemainingTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return {
    hours,
    minutes,
    seconds: secs,
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
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

// 保存模板
const saveTemplate = (name: string, hours: number, minutes: number, seconds: number, color: string) => {
  const templates = JSON.parse(localStorage.getItem('countdownTemplates') || '[]')
  const newTemplate = {
    id: Date.now(),
    name,
    hours,
    minutes,
    seconds,
    color
  }
  templates.push(newTemplate)
  localStorage.setItem('countdownTemplates', JSON.stringify(templates))
  return newTemplate
}

// 加载模板
const loadTemplate = (templateId: number) => {
  const templates = JSON.parse(localStorage.getItem('countdownTemplates') || '[]')
  const template = templates.find((t: any) => t.id === templateId)
  if (template) {
    addTimer(template.hours, template.minutes, template.seconds, template.name, template.color)
  }
}

// 组件挂载时的初始化
useEffect(() => {
  // 每秒更新一次计时器
  const intervalId = setInterval(() => {
    updateTimers()
  }, 1000)
  
  // 加载保存的计时器
  const savedTimers = localStorage.getItem('countdownTimers')
  if (savedTimers) {
    setToolState(prev => ({
      ...prev,
      timers: JSON.parse(savedTimers)
    }))
  }
  
  // 组件卸载时清除定时器
  return () => clearInterval(intervalId)
}, [])

// 保存计时器到本地存储
useEffect(() => {
  if (toolState.timers.length > 0) {
    localStorage.setItem('countdownTimers', JSON.stringify(toolState.timers))
  }
}, [toolState.timers])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 输入组件
- `ColorPicker`: 颜色选择器组件
- `FullscreenButton`: 全屏按钮组件（与Digital Clock工具复用）
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface Timer {
  id: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  remainingSeconds: number
  isRunning: boolean
  isPaused: boolean
  label: string
  color: string
}

interface CountdownTimerState {
  timers: Timer[]
  currentTimerId: number | null
  showTemplateManager: boolean
  isFullscreen: boolean
}

interface Template {
  id: number
  name: string
  hours: number
  minutes: number
  seconds: number
  color: string
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 单个计时器的设置和运行功能
- 多计时器同时运行功能
- 开始、暂停、重置功能
- 倒计时结束提醒功能（声音和弹窗）
- 模板保存和加载功能
- 样式自定义功能
- 全屏显示功能

### 6.2 边界测试
- 设置非常长时间的倒计时
- 设置0秒的倒计时
- 多个计时器同时结束的情况
- 浏览器刷新后计时器的恢复情况

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 多计时器的管理界面
- 全屏模式下的显示效果

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化倒计时功能
- 增加更多预设模板
- 优化提醒声音和方式

## 8. 总结

Countdown Timer工具采用组件化设计，核心功能使用JavaScript实现倒计时逻辑，支持单个和多个计时器，提供模板保存、样式自定义等功能。工具具有良好的用户体验和可维护性，适用于各种需要计时的场景。