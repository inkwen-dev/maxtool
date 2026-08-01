# Pomodoro Timer技术设计文档

## 1. 概述

Pomodoro Timer是一款基于番茄工作法的时间管理工具，帮助用户通过专注工作和短暂休息的交替提高生产力。该工具支持自定义工作时长、休息时长和长休息间隔，提供计时、提醒和统计功能。

## 2. 功能设计

### 2.1 核心功能
- 支持番茄工作法的计时（工作时间、短休息时间、长休息时间）
- 提供开始、暂停、重置功能
- 支持自定义工作时长、短休息时长和长休息时长
- 支持自定义长休息间隔（每完成几个番茄工作后）
- 支持声音和视觉提醒
- 支持深色/浅色模式
- 支持全屏显示
- 提供番茄工作统计（今日、本周、本月完成的番茄数）

### 2.2 辅助功能
- 支持自动开始下一个番茄周期
- 支持跳过当前周期
- 支持自定义番茄标签
- 支持保存和加载用户偏好设置
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `PomodoroTimerTool`: 主组件，包含所有功能
  - `TimerDisplay`: 计时器显示组件（工作/休息状态、剩余时间）
  - `ControlButtons`: 控制按钮组件（开始、暂停、重置、跳过）
  - `SettingsPanel`: 设置面板组件（时长设置、提醒设置、标签设置）
  - `StatisticsPanel`: 统计面板组件（完成的番茄数）
  - `FullscreenButton`: 全屏按钮组件

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  currentPhase: 'work' as 'work' | 'shortBreak' | 'longBreak',
  isRunning: false,
  isPaused: false,
  startTime: null as number | null,
  pausedTime: null as number | null,
  elapsedTime: 0,
  completedPomodoros: 0,
  settings: {
    workDuration: 25 * 60, // 25 minutes in seconds
    shortBreakDuration: 5 * 60, // 5 minutes in seconds
    longBreakDuration: 15 * 60, // 15 minutes in seconds
    longBreakInterval: 4, // Every 4 pomodoros
    autoStartNext: false,
    playSound: true,
    showNotification: true
  },
  currentLabel: '',
  isFullscreen: false
})

// 开始计时器
const startTimer = () => {
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
    // 新开始或重新开始
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

// 暂停计时器
const pauseTimer = () => {
  setToolState(prev => ({
    ...prev,
    isRunning: false,
    isPaused: true,
    pausedTime: Date.now()
  }))
}

// 重置计时器
const resetTimer = () => {
  setToolState(prev => ({
    ...prev,
    isRunning: false,
    isPaused: false,
    startTime: null,
    pausedTime: null,
    elapsedTime: 0,
    currentPhase: 'work'
  }))
}

// 跳过当前周期
const skipCurrentPhase = () => {
  completeCurrentPhase()
}

// 完成当前周期
const completeCurrentPhase = () => {
  setToolState(prev => {
    let newPhase: 'work' | 'shortBreak' | 'longBreak' = 'work'
    let newCompletedPomodoros = prev.completedPomodoros
    
    if (prev.currentPhase === 'work') {
      // 工作时间结束
      newCompletedPomodoros++
      
      // 决定是短休息还是长休息
      if (newCompletedPomodoros % prev.settings.longBreakInterval === 0) {
        newPhase = 'longBreak'
      } else {
        newPhase = 'shortBreak'
      }
      
      // 保存完成的番茄数到本地存储
      saveCompletedPomodoros(newCompletedPomodoros)
    } else if (prev.currentPhase === 'shortBreak' || prev.currentPhase === 'longBreak') {
      // 休息时间结束，回到工作时间
      newPhase = 'work'
    }
    
    // 播放提醒声音
    if (prev.settings.playSound) {
      playNotificationSound()
    }
    
    // 显示浏览器通知
    if (prev.settings.showNotification) {
      showBrowserNotification(newPhase)
    }
    
    // 返回新状态
    return {
      ...prev,
      currentPhase: newPhase,
      completedPomodoros: newCompletedPomodoros,
      isRunning: prev.settings.autoStartNext,
      isPaused: false,
      startTime: prev.settings.autoStartNext ? Date.now() : null,
      pausedTime: null,
      elapsedTime: 0
    }
  })
}

// 更新计时器显示
const updateTimer = () => {
  if (!toolState.isRunning) return
  
  const currentTime = Date.now()
  const elapsed = currentTime - (toolState.startTime || 0)
  const elapsedSeconds = Math.floor(elapsed / 1000)
  
  // 获取当前阶段的总时长
  const getCurrentPhaseDuration = () => {
    switch (toolState.currentPhase) {
      case 'work':
        return toolState.settings.workDuration
      case 'shortBreak':
        return toolState.settings.shortBreakDuration
      case 'longBreak':
        return toolState.settings.longBreakDuration
      default:
        return toolState.settings.workDuration
    }
  }
  
  const currentPhaseDuration = getCurrentPhaseDuration()
  
  if (elapsedSeconds >= currentPhaseDuration) {
    // 当前周期结束
    completeCurrentPhase()
  } else {
    // 更新经过的时间
    setToolState(prev => ({
      ...prev,
      elapsedTime: elapsed
    }))
  }
}

// 获取剩余时间
const getRemainingTime = () => {
  const elapsedSeconds = Math.floor(toolState.elapsedTime / 1000)
  const getCurrentPhaseDuration = () => {
    switch (toolState.currentPhase) {
      case 'work':
        return toolState.settings.workDuration
      case 'shortBreak':
        return toolState.settings.shortBreakDuration
      case 'longBreak':
        return toolState.settings.longBreakDuration
      default:
        return toolState.settings.workDuration
    }
  }
  
  const currentPhaseDuration = getCurrentPhaseDuration()
  const remainingSeconds = currentPhaseDuration - elapsedSeconds
  
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  
  return {
    minutes,
    seconds,
    formatted: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    percentage: (elapsedSeconds / currentPhaseDuration) * 100
  }
}

// 播放提醒声音
const playNotificationSound = () => {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3')
  audio.play().catch(err => console.error('Failed to play sound:', err))
}

// 显示浏览器通知
const showBrowserNotification = (newPhase: 'work' | 'shortBreak' | 'longBreak') => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications')
    return
  }
  
  if (Notification.permission === 'granted') {
    let title = ''
    let body = ''
    
    switch (newPhase) {
      case 'work':
        title = '开始工作！'
        body = '专注工作，提高生产力！'
        break
      case 'shortBreak':
        title = '短休息时间到！'
        body = '休息一下，放松身心！'
        break
      case 'longBreak':
        title = '长休息时间到！'
        body = '好好休息，恢复精力！'
        break
    }
    
    new Notification(title, { body })
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showBrowserNotification(newPhase)
      }
    })
  }
}

// 保存完成的番茄数到本地存储
const saveCompletedPomodoros = (count: number) => {
  // 获取当前日期
  const today = new Date().toISOString().split('T')[0]
  
  // 获取保存的统计数据
  const stats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}')
  
  // 更新今日统计
  stats[today] = count
  
  // 保存回本地存储
  localStorage.setItem('pomodoroStats', JSON.stringify(stats))
}

// 获取完成的番茄数统计
const getCompletedPomodorosStats = () => {
  const stats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}')
  const today = new Date().toISOString().split('T')[0]
  
  // 计算今日完成的番茄数
  const todayCount = stats[today] || 0
  
  // 计算本周完成的番茄数
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekStartStr = weekStart.toISOString().split('T')[0]
  
  let weekCount = 0
  for (const date in stats) {
    if (date >= weekStartStr) {
      weekCount += stats[date]
    }
  }
  
  // 计算本月完成的番茄数
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const monthStartStr = monthStart.toISOString().split('T')[0]
  
  let monthCount = 0
  for (const date in stats) {
    if (date >= monthStartStr) {
      monthCount += stats[date]
    }
  }
  
  return {
    today: todayCount,
    week: weekCount,
    month: monthCount
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

// 保存用户偏好设置
const saveSettings = () => {
  const settings = {
    workDuration: toolState.settings.workDuration,
    shortBreakDuration: toolState.settings.shortBreakDuration,
    longBreakDuration: toolState.settings.longBreakDuration,
    longBreakInterval: toolState.settings.longBreakInterval,
    autoStartNext: toolState.settings.autoStartNext,
    playSound: toolState.settings.playSound,
    showNotification: toolState.settings.showNotification
  }
  
  localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
}

// 组件挂载时的初始化
useEffect(() => {
  let intervalId: NodeJS.Timeout | null = null
  
  if (toolState.isRunning) {
    // 每秒更新一次计时器
    intervalId = setInterval(() => {
      updateTimer()
    }, 1000)
  }
  
  // 加载保存的设置
  const savedSettings = localStorage.getItem('pomodoroSettings')
  if (savedSettings) {
    setToolState(prev => ({
      ...prev,
      settings: JSON.parse(savedSettings)
    }))
  }
  
  // 加载完成的番茄数
  const stats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}')
  const today = new Date().toISOString().split('T')[0]
  const todayCount = stats[today] || 0
  
  setToolState(prev => ({
    ...prev,
    completedPomodoros: todayCount
  }))
  
  // 组件卸载时清除定时器
  return () => {
    if (intervalId) clearInterval(intervalId)
  }
}, [toolState.isRunning])

// 保存设置到本地存储
useEffect(() => {
  saveSettings()
}, [toolState.settings])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 输入组件
- `Toggle`: 开关组件
- `FullscreenButton`: 全屏按钮组件（与其他计时器工具复用）
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface Settings {
  workDuration: number // 工作时长（秒）
  shortBreakDuration: number // 短休息时长（秒）
  longBreakDuration: number // 长休息时长（秒）
  longBreakInterval: number // 长休息间隔（完成的番茄数）
  autoStartNext: boolean // 是否自动开始下一个周期
  playSound: boolean // 是否播放提醒声音
  showNotification: boolean // 是否显示浏览器通知
}

interface PomodoroTimerState {
  currentPhase: 'work' | 'shortBreak' | 'longBreak'
  isRunning: boolean
  isPaused: boolean
  startTime: number | null
  pausedTime: number | null
  elapsedTime: number
  completedPomodoros: number
  settings: Settings
  currentLabel: string
  isFullscreen: boolean
}

interface PomodoroStats {
  [date: string]: number // 日期 -> 完成的番茄数
}

interface PomodoroStatsDisplay {
  today: number
  week: number
  month: number
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 番茄工作法的计时功能（工作、短休息、长休息）
- 开始、暂停、重置、跳过功能
- 自定义时长设置功能
- 提醒功能（声音和浏览器通知）
- 统计功能（完成的番茄数）
- 自动开始下一个周期功能
- 全屏显示功能

### 6.2 边界测试
- 自定义非常长或非常短的时长
- 连续完成多个番茄工作的情况
- 浏览器刷新后状态的恢复情况
- 浏览器通知权限的处理

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 设置面板的使用体验
- 统计面板的信息展示

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化番茄工作法功能
- 增加更多统计图表和分析功能
- 优化提醒方式和音效

## 8. 总结

Pomodoro Timer工具采用组件化设计，核心功能使用JavaScript实现番茄工作法的计时逻辑，支持自定义设置、提醒和统计功能。工具具有良好的用户体验和可维护性，适用于需要提高生产力的用户。