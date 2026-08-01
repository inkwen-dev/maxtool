# Scoreboard技术设计文档

## 1. 概述

Scoreboard是一款用于体育比赛和游戏的计分板工具，用户可以使用它来跟踪比赛分数，支持多种比赛类型和计分规则。该工具适用于篮球、足球、排球、乒乓球等各种体育比赛，以及棋类、卡牌等游戏的计分场景。

## 2. 功能设计

### 2.1 核心功能
- 支持设置两个队伍/玩家的名称
- 支持增加和减少分数
- 支持设置比赛时间
- 支持暂停和继续比赛
- 支持设置比赛回合/局数
- 支持设置加分规则（如篮球的2分球、3分球）
- 支持保存比赛记录
- 支持重置计分板
- 支持深色/浅色模式
- 支持全屏显示

### 2.2 辅助功能
- 提供常见比赛类型的预设模板（篮球、足球、排球等）
- 支持自定义计分板颜色
- 支持显示比赛统计数据（如得分、犯规次数等）
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `ScoreboardTool`: 主组件，包含所有功能
  - `TeamNames`: 队伍名称设置组件
  - `ScoreDisplay`: 分数显示组件
  - `ScoreControls`: 分数控制组件（增加/减少分数）
  - `Timer`: 比赛计时器组件
  - `PeriodControl`: 回合/局数控制组件
  - `GameStats`: 比赛统计组件
  - `PresetTemplates`: 预设模板组件
  - `ColorCustomization`: 颜色自定义组件
  - `FullscreenButton`: 全屏按钮组件

### 3.2 核心实现逻辑
```javascript
// 比赛类型预设模板
const gameTemplates: { [key: string]: GameTemplate } = {
  basketball: {
    name: 'Basketball',
    timeLimit: 12 * 60, // 12 minutes per quarter in seconds
    periods: 4,
    scoringOptions: [
      { points: 1, name: 'Free Throw' },
      { points: 2, name: '2-Point Shot' },
      { points: 3, name: '3-Point Shot' }
    ]
  },
  football: {
    name: 'Football',
    timeLimit: 15 * 60, // 15 minutes per quarter in seconds
    periods: 4,
    scoringOptions: [
      { points: 6, name: 'Touchdown' },
      { points: 1, name: 'Extra Point' },
      { points: 2, name: 'Two-Point Conversion' },
      { points: 3, name: 'Field Goal' },
      { points: 2, name: 'Safety' }
    ]
  },
  volleyball: {
    name: 'Volleyball',
    timeLimit: 0, // No time limit
    periods: 5,
    scoringOptions: [
      { points: 1, name: 'Point' }
    ]
  },
  // 更多比赛类型模板...
}

// 工具状态管理
const [toolState, setToolState] = useState({
  team1: {
    name: 'Team 1',
    score: 0,
    color: '#4f46e5'
  },
  team2: {
    name: 'Team 2',
    score: 0,
    color: '#ef4444'
  },
  game: {
    type: 'custom' as keyof typeof gameTemplates | 'custom',
    timeLimit: 0,
    remainingTime: 0,
    isRunning: false,
    isPaused: false,
    currentPeriod: 1,
    totalPeriods: 1,
    scoringOptions: [{ points: 1, name: 'Point' }]
  },
  stats: {
    team1: {},
    team2: {}
  },
  isFullscreen: false
})

// 选择比赛类型模板
const selectGameTemplate = (templateKey: keyof typeof gameTemplates) => {
  const template = gameTemplates[templateKey]
  
  setToolState(prev => ({
    ...prev,
    game: {
      ...prev.game,
      type: templateKey,
      timeLimit: template.timeLimit,
      remainingTime: template.timeLimit,
      totalPeriods: template.periods,
      scoringOptions: template.scoringOptions
    }
  }))
}

// 更新队伍名称
const updateTeamName = (team: 1 | 2, name: string) => {
  setToolState(prev => ({
    ...prev,
    [`team${team}`]: {
      ...prev[`team${team}` as 'team1' | 'team2'],
      name
    }
  }))
}

// 更新队伍分数
const updateScore = (team: 1 | 2, points: number) => {
  setToolState(prev => {
    const teamKey = `team${team}` as 'team1' | 'team2'
    const newScore = prev[teamKey].score + points
    
    // 更新统计数据
    const statKey = points === 1 ? 'points' : `${points}Points`
    const newStats = {
      ...prev.stats,
      [teamKey]: {
        ...prev.stats[teamKey],
        [statKey]: (prev.stats[teamKey][statKey] || 0) + 1
      }
    }
    
    return {
      ...prev,
      [teamKey]: {
        ...prev[teamKey],
        score: newScore
      },
      stats: newStats
    }
  })
}

// 开始比赛计时器
const startTimer = () => {
  if (toolState.game.isPaused) {
    // 从暂停状态恢复
    setToolState(prev => ({
      ...prev,
      game: {
        ...prev.game,
        isRunning: true,
        isPaused: false
      }
    }))
  } else {
    // 新开始
    setToolState(prev => ({
      ...prev,
      game: {
        ...prev.game,
        isRunning: true,
        isPaused: false,
        remainingTime: prev.game.timeLimit
      }
    }))
  }
}

// 暂停比赛计时器
const pauseTimer = () => {
  setToolState(prev => ({
    ...prev,
    game: {
      ...prev.game,
      isRunning: false,
      isPaused: true
    }
  }))
}

// 重置比赛计时器
const resetTimer = () => {
  setToolState(prev => ({
    ...prev,
    game: {
      ...prev.game,
      isRunning: false,
      isPaused: false,
      remainingTime: prev.game.timeLimit
    }
  }))
}

// 更新剩余时间
const updateRemainingTime = () => {
  if (!toolState.game.isRunning || toolState.game.remainingTime <= 0) return
  
  setToolState(prev => ({
    ...prev,
    game: {
      ...prev.game,
      remainingTime: prev.game.remainingTime - 1
    }
  }))
}

// 切换回合/局数
const changePeriod = (direction: 'next' | 'prev') => {
  setToolState(prev => {
    let newPeriod = prev.game.currentPeriod
    
    if (direction === 'next' && newPeriod < prev.game.totalPeriods) {
      newPeriod++
    } else if (direction === 'prev' && newPeriod > 1) {
      newPeriod--
    }
    
    return {
      ...prev,
      game: {
        ...prev.game,
        currentPeriod: newPeriod,
        remainingTime: prev.game.timeLimit,
        isRunning: false,
        isPaused: false
      }
    }
  })
}

// 重置计分板
const resetScoreboard = () => {
  setToolState(prev => ({
    ...prev,
    team1: {
      ...prev.team1,
      score: 0
    },
    team2: {
      ...prev.team2,
      score: 0
    },
    game: {
      ...prev.game,
      isRunning: false,
      isPaused: false,
      remainingTime: prev.game.timeLimit,
      currentPeriod: 1
    },
    stats: {
      team1: {},
      team2: {}
    }
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

// 组件挂载时的初始化
useEffect(() => {
  let intervalId: NodeJS.Timeout | null = null
  
  if (toolState.game.isRunning && toolState.game.remainingTime > 0) {
    // 每秒更新一次计时器
    intervalId = setInterval(() => {
      updateRemainingTime()
    }, 1000)
  }
  
  // 组件卸载时清除定时器
  return () => {
    if (intervalId) clearInterval(intervalId)
  }
}, [toolState.game.isRunning, toolState.game.remainingTime])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 输入组件
- `ColorPicker`: 颜色选择器组件
- `FullscreenButton`: 全屏按钮组件（与其他工具复用）
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface GameTemplate {
  name: string
  timeLimit: number
  periods: number
  scoringOptions: { points: number; name: string }[]
}

interface Team {
  name: string
  score: number
  color: string
}

interface GameState {
  type: string
  timeLimit: number
  remainingTime: number
  isRunning: boolean
  isPaused: boolean
  currentPeriod: number
  totalPeriods: number
  scoringOptions: { points: number; name: string }[]
}

interface Stats {
  team1: { [key: string]: number }
  team2: { [key: string]: number }
}

interface ScoreboardState {
  team1: Team
  team2: Team
  game: GameState
  stats: Stats
  isFullscreen: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 队伍名称设置功能
- 分数增加和减少功能
- 比赛计时器功能（开始、暂停、继续）
- 回合/局数控制功能
- 比赛模板选择功能
- 颜色自定义功能
- 全屏显示功能
- 重置计分板功能

### 6.2 边界测试
- 设置不同比赛时间的情况
- 分数出现负数的情况
- 回合数超过最大限制的情况
- 浏览器刷新后计分板的恢复情况

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 全屏模式下的显示效果
- 不同比赛类型模板的界面效果

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化计分板功能
- 增加更多比赛类型模板
- 优化计分板的显示效果

## 8. 总结

Scoreboard工具采用组件化设计，核心功能使用JavaScript实现计分和计时逻辑，支持多种比赛类型和计分规则，提供模板选择、颜色自定义等功能。工具具有良好的用户体验和可维护性，适用于各种体育比赛和游戏的计分场景。