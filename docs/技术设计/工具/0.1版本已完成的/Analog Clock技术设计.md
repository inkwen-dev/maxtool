# Analog Clock技术设计文档

## 1. 概述

Analog Clock是一款在线全屏模拟时钟工具，用户可以查看当前时间，支持多种表盘样式和显示选项，提供深色模式支持。该工具适用于需要模拟时钟显示的场景，如办公室、家庭、学校等，提供复古而优雅的时间查看体验。

## 2. 功能设计

### 2.1 核心功能
- 实时显示当前时间（时、分、秒指针）
- 支持多种表盘样式（经典、现代、复古、简约等）
- 支持自定义表盘颜色和指针颜色
- 支持显示日期（可选）
- 支持显示星期（可选）
- 支持显示24小时制数字时间（可选）
- 支持深色/浅色模式
- 支持全屏显示
- 支持设置时区
- 支持显示秒钟指针（可选）

### 2.2 辅助功能
- 响应式设计，适配不同设备
- 使用说明和示例
- 支持保存时钟配置

## 3. 技术设计

### 3.1 组件结构
- `AnalogClockTool`: 主组件，包含所有功能
  - `ClockFace`: 表盘组件（表盘背景、刻度、数字）
  - `ClockHands`: 指针组件（时针、分针、秒针）
  - `DateTimeDisplay`: 日期时间显示组件（可选）
  - `SettingsPanel`: 设置面板组件（表盘样式、颜色、显示选项）
  - `FullscreenButton`: 全屏按钮组件

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  currentTime: new Date(),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  clockStyle: 'classic' as 'classic' | 'modern' | 'retro' | 'minimal',
  showDate: true,
  showDay: true,
  showDigitalTime: true,
  showSecondsHand: true,
  colors: {
    face: '#ffffff',
    hands: {
      hour: '#000000',
      minute: '#000000',
      second: '#ff0000'
    },
    numbers: '#000000',
    background: '#f3f4f6'
  },
  isFullscreen: false
})

// 更新时间
const updateTime = () => {
  setToolState(prev => ({
    ...prev,
    currentTime: new Date()
  }))
}

// 计算指针角度
const calculateHandAngles = () => {
  const now = toolState.currentTime
  
  // 计算秒针角度
  const seconds = now.getSeconds()
  const secondsAngle = (seconds / 60) * 360 - 90
  
  // 计算分针角度
  const minutes = now.getMinutes()
  const minutesAngle = (minutes / 60) * 360 + (seconds / 60) * 6 - 90
  
  // 计算时针角度
  const hours = now.getHours() % 12
  const hoursAngle = (hours / 12) * 360 + (minutes / 60) * 30 - 90
  
  return {
    hours: hoursAngle,
    minutes: minutesAngle,
    seconds: secondsAngle
  }
}

// 设置时区
const setTimezone = (timezone: string) => {
  setToolState(prev => ({
    ...prev,
    timezone
  }))
}

// 切换表盘样式
const setClockStyle = (style: 'classic' | 'modern' | 'retro' | 'minimal') => {
  setToolState(prev => ({
    ...prev,
    clockStyle: style
  }))
}

// 切换显示选项
const toggleDisplayOption = (option: 'showDate' | 'showDay' | 'showDigitalTime' | 'showSecondsHand') => {
  setToolState(prev => ({
    ...prev,
    [option]: !prev[option]
  }))
}

// 设置颜色
const setColor = (element: 'face' | 'hourHand' | 'minuteHand' | 'secondHand' | 'numbers' | 'background', color: string) => {
  setToolState(prev => {
    if (element === 'hourHand') {
      return {
        ...prev,
        colors: {
          ...prev.colors,
          hands: {
            ...prev.colors.hands,
            hour: color
          }
        }
      }
    } else if (element === 'minuteHand') {
      return {
        ...prev,
        colors: {
          ...prev.colors,
          hands: {
            ...prev.colors.hands,
            minute: color
          }
        }
      }
    } else if (element === 'secondHand') {
      return {
        ...prev,
        colors: {
          ...prev.colors,
          hands: {
            ...prev.colors.hands,
            second: color
          }
        }
      }
    } else {
      return {
        ...prev,
        colors: {
          ...prev.colors,
          [element]: color
        }
      }
    }
  })
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

// 获取所有可用时区
const getAllTimezones = () => {
  return Intl.supportedValuesOf('timeZone')
}

// 保存配置到本地存储
const saveConfig = () => {
  const configToSave = {
    timezone: toolState.timezone,
    clockStyle: toolState.clockStyle,
    showDate: toolState.showDate,
    showDay: toolState.showDay,
    showDigitalTime: toolState.showDigitalTime,
    showSecondsHand: toolState.showSecondsHand,
    colors: toolState.colors
  }
  
  localStorage.setItem('analogClockConfig', JSON.stringify(configToSave))
}

// 加载配置从本地存储
const loadConfig = () => {
  const savedConfig = localStorage.getItem('analogClockConfig')
  if (savedConfig) {
    setToolState(prev => ({
      ...prev,
      ...JSON.parse(savedConfig),
      currentTime: new Date()
    }))
  }
}

// 组件挂载时的初始化
useEffect(() => {
  // 每秒更新一次时间
  const intervalId = setInterval(() => {
    updateTime()
  }, 1000)
  
  // 加载保存的配置
  loadConfig()
  
  // 组件卸载时清除定时器
  return () => clearInterval(intervalId)
}, [])

// 保存配置到本地存储
useEffect(() => {
  saveConfig()
}, [toolState.timezone, toolState.clockStyle, toolState.showDate, toolState.showDay, toolState.showDigitalTime, toolState.showSecondsHand, toolState.colors])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Select`: 选择组件（时区、表盘样式）
- `ColorPicker`: 颜色选择器组件
- `Toggle`: 开关组件（显示选项）
- `FullscreenButton`: 全屏按钮组件（与其他计时器工具复用）
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计
- `formatTime`: 时间格式化功能（与其他时间工具复用）

## 4. 数据结构

```typescript
interface ClockColors {
  face: string
  hands: {
    hour: string
    minute: string
    second: string
  }
  numbers: string
  background: string
}

interface AnalogClockState {
  currentTime: Date
  timezone: string
  clockStyle: 'classic' | 'modern' | 'retro' | 'minimal'
  showDate: boolean
  showDay: boolean
  showDigitalTime: boolean
  showSecondsHand: boolean
  colors: ClockColors
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
- 指针转动的准确性
- 表盘样式切换功能
- 颜色自定义功能
- 显示选项切换功能
- 时区设置功能
- 全屏显示功能

### 6.2 边界测试
- 时区切换到不同地区的情况
- 表盘样式的兼容性
- 颜色设置的边界值

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 不同表盘样式的显示效果
- 全屏模式下的显示效果

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化时钟功能
- 增加更多表盘样式和自定义选项

## 8. 总结

Analog Clock工具采用组件化设计，核心功能使用JavaScript实现模拟时钟的显示和更新逻辑，支持多种表盘样式、颜色自定义和显示选项。工具具有良好的用户体验和可维护性，适用于各种需要模拟时钟显示的场景。