# Digital Clock技术设计文档

## 1. 概述

Digital Clock是一款全屏数字时钟工具，用户可以查看当前时间，支持多种时间格式和显示样式，提供计时和闹钟功能。该工具适用于需要清晰查看时间的场景，如办公室、家庭、学校等。

## 2. 功能设计

### 2.1 核心功能
- 实时显示当前时间（小时、分钟、秒）
- 支持24小时制和12小时制切换
- 显示日期（年、月、日、星期）
- 支持多种数字时钟样式（简约、现代、复古等）
- 支持自定义字体大小和颜色
- 支持全屏显示
- 支持设置时区
- 支持设置闹钟
- 支持计时器功能

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例
- 支持保存时钟配置

## 3. 技术设计

### 3.1 组件结构
- `DigitalClockTool`: 主组件，包含所有功能
  - `TimeDisplay`: 时间显示组件（小时、分钟、秒）
  - `DateDisplay`: 日期显示组件（年、月、日、星期）
  - `FormatOptions`: 格式选项组件（12小时制/24小时制、时区）
  - `StyleCustomization`: 样式自定义组件（时钟样式、字体大小、颜色）
  - `AlarmComponent`: 闹钟组件（设置闹钟、闹钟列表）
  - `TimerComponent`: 计时器组件（设置计时器）
  - `FullscreenButton`: 全屏按钮组件

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  currentTime: new Date(),
  timeFormat: '24h', // '24h', '12h'
  dateFormat: 'full', // 'full', 'short', 'numeric'
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  clockStyle: 'default', // 'default', 'minimal', 'modern', 'retro'
  fontSize: 100,
  textColor: '#ffffff',
  backgroundColor: '#000000',
  alarms: [],
  timers: [],
  isFullscreen: false
})

// 更新时间
const updateTime = () => {
  setToolState(prev => ({
    ...prev,
    currentTime: new Date()
  }))
}

// 切换时间格式（24小时制/12小时制）
const toggleTimeFormat = () => {
  setToolState(prev => ({
    ...prev,
    timeFormat: prev.timeFormat === '24h' ? '12h' : '24h'
  }))
}

// 设置时区
const setTimezone = (timezone: string) => {
  setToolState(prev => ({
    ...prev,
    timezone
  }))
}

// 自定义时钟样式
const customizeClockStyle = (options: {
  clockStyle?: 'default' | 'minimal' | 'modern' | 'retro'
  fontSize?: number
  textColor?: string
  backgroundColor?: string
}) => {
  setToolState(prev => ({
    ...prev,
    ...options
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

// 添加闹钟
const addAlarm = (alarmTime: Date, label: string = '') => {
  const newAlarm = {
    id: Date.now(),
    time: alarmTime,
    label,
    isActive: true
  }
  
  setToolState(prev => ({
    ...prev,
    alarms: [...prev.alarms, newAlarm]
  }))
}

// 删除闹钟
const deleteAlarm = (alarmId: number) => {
  setToolState(prev => ({
    ...prev,
    alarms: prev.alarms.filter(alarm => alarm.id !== alarmId)
  }))
}

// 切换闹钟状态
const toggleAlarm = (alarmId: number) => {
  setToolState(prev => ({
    ...prev,
    alarms: prev.alarms.map(alarm => 
      alarm.id === alarmId ? { ...alarm, isActive: !alarm.isActive } : alarm
    )
  }))
}

// 检查闹钟
const checkAlarms = () => {
  const now = new Date()
  const currentTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  toolState.alarms.forEach(alarm => {
    if (!alarm.isActive) return
    
    const alarmTime = alarm.time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    
    if (alarmTime === currentTime && now.getSeconds() === 0) {
      // 触发闹钟
      alert(`闹钟响了！${alarm.label ? `标签: ${alarm.label}` : ''}`)
    }
  })
}

// 组件挂载时的初始化
useEffect(() => {
  // 每秒更新一次时间
  const intervalId = setInterval(() => {
    updateTime()
    checkAlarms()
  }, 1000)
  
  // 加载保存的配置
  const savedConfig = localStorage.getItem('digitalClockConfig')
  if (savedConfig) {
    setToolState(prev => ({
      ...prev,
      ...JSON.parse(savedConfig),
      currentTime: new Date()
    }))
  }
  
  // 组件卸载时清除定时器
  return () => clearInterval(intervalId)
}, [])

// 保存配置到本地存储
useEffect(() => {
  const configToSave = {
    timeFormat: toolState.timeFormat,
    dateFormat: toolState.dateFormat,
    timezone: toolState.timezone,
    clockStyle: toolState.clockStyle,
    fontSize: toolState.fontSize,
    textColor: toolState.textColor,
    backgroundColor: toolState.backgroundColor,
    alarms: toolState.alarms
  }
  
  localStorage.setItem('digitalClockConfig', JSON.stringify(configToSave))
}, [toolState.timeFormat, toolState.dateFormat, toolState.timezone, toolState.clockStyle, toolState.fontSize, toolState.textColor, toolState.backgroundColor, toolState.alarms])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Select`: 选择组件（时区、时钟样式）
- `ColorPicker`: 颜色选择器组件
- `Slider`: 滑块组件（字体大小）
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计
- `formatTime`: 时间格式化功能

## 4. 数据结构

```typescript
interface Alarm {
  id: number
  time: Date
  label: string
  isActive: boolean
}

interface Timer {
  id: number
  duration: number
  remainingTime: number
  isRunning: boolean
  isPaused: boolean
}

interface DigitalClockState {
  currentTime: Date
  timeFormat: '24h' | '12h'
  dateFormat: 'full' | 'short' | 'numeric'
  timezone: string
  clockStyle: 'default' | 'minimal' | 'modern' | 'retro'
  fontSize: number
  textColor: string
  backgroundColor: string
  alarms: Alarm[]
  timers: Timer[]
  isFullscreen: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 实时时间显示功能
- 时间格式切换功能（24小时制/12小时制）
- 日期显示功能
- 时钟样式切换功能
- 字体大小和颜色自定义功能
- 全屏显示功能
- 时区设置功能
- 闹钟设置功能
- 计时器功能

### 6.2 边界测试
- 时区切换到不同地区的情况
- 闹钟时间到达的情况
- 全屏模式的兼容性

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 不同时钟样式的显示效果
- 全屏模式下的显示效果

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化时钟功能
- 增加更多时钟样式和自定义选项

## 8. 总结

Digital Clock工具采用组件化设计，核心功能使用JavaScript实现时间更新和格式转换逻辑，支持多种时间格式和显示样式，提供闹钟和计时器功能。工具具有良好的用户体验和可维护性，适用于各种需要查看时间的场景。