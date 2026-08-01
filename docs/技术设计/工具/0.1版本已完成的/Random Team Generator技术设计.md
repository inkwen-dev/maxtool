# Random Team Generator技术设计文档

## 1. 概述

Random Team Generator是一款随机组队工具，用户可以输入成员列表，设置队伍数量，快速公平地生成随机队伍。该工具适用于团队活动、比赛分组、项目分配等场景。

## 2. 功能设计

### 2.1 核心功能
- 输入成员列表（支持单行输入多个成员，用逗号、空格或换行分隔）
- 设置队伍数量
- 随机生成队伍
- 支持自定义队伍名称
- 支持设置每队人数限制
- 显示生成结果
- 复制结果功能
- 重置功能
- 支持导入/导出成员列表

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例
- 支持保存队伍配置

## 3. 技术设计

### 3.1 组件结构
- `RandomTeamTool`: 主组件，包含所有功能
  - `MemberInput`: 成员列表输入组件
  - `TeamSettings`: 队伍设置组件（队伍数量、每队人数限制）
  - `TeamNaming`: 队伍命名组件（自定义队伍名称）
  - `GenerateControls`: 生成控制组件（生成按钮、重置按钮）
  - `TeamsDisplay`: 队伍显示组件（生成的队伍列表）
  - `ImportExport`: 导入/导出功能组件

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  inputMembers: '',
  allMembers: [],
  teamCount: 2,
  maxMembersPerTeam: null,
  customTeamNames: [],
  generatedTeams: [],
  isGenerating: false
})

// 解析输入的成员列表
const parseInputMembers = (input: string): string[] => {
  if (!input.trim()) return []
  
  // 按逗号、空格、换行符分割成员
  const members = input.split(/[,\s\n]+/)
    .map(member => member.trim())
    .filter(member => member.length > 0)
  
  // 去重
  return [...new Set(members)]
}

// 更新成员列表
const updateMemberList = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const input = e.target.value
  const members = parseInputMembers(input)
  
  setToolState(prev => ({
    ...prev,
    inputMembers: input,
    allMembers: members,
    generatedTeams: []
  }))
}

// 设置队伍数量
const setTeamCount = (count: number) => {
  // 限制队伍数量在1-10之间，且不超过成员总数
  const maxCount = Math.min(10, toolState.allMembers.length)
  const newCount = Math.max(1, Math.min(maxCount, count))
  
  setToolState(prev => ({
    ...prev,
    teamCount: newCount,
    // 自动调整自定义队伍名称数量
    customTeamNames: Array.from({ length: newCount }, (_, i) => 
      prev.customTeamNames[i] || `Team ${i + 1}`
    )
  }))
}

// 设置每队人数限制
const setMaxMembersPerTeam = (max: number | null) => {
  setToolState(prev => ({
    ...prev,
    maxMembersPerTeam: max
  }))
}

// 设置自定义队伍名称
const setCustomTeamName = (index: number, name: string) => {
  setToolState(prev => {
    const newNames = [...prev.customTeamNames]
    newNames[index] = name
    return {
      ...prev,
      customTeamNames: newNames
    }
  })
}

// 随机生成队伍
const generateTeams = () => {
  const { allMembers, teamCount, maxMembersPerTeam, customTeamNames } = toolState
  
  if (allMembers.length === 0) return
  
  setToolState(prev => ({
    ...prev,
    isGenerating: true
  }))
  
  // 生成过程模拟延迟
  const generationDuration = 1000
  
  setTimeout(() => {
    // 打乱成员列表
    const shuffledMembers = [...allMembers]
    for (let i = shuffledMembers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledMembers[i], shuffledMembers[j]] = [shuffledMembers[j], shuffledMembers[i]]
    }
    
    // 创建队伍
    const teams = []
    const defaultNames = customTeamNames.length < teamCount 
      ? [...customTeamNames, ...Array.from({ length: teamCount - customTeamNames.length }, (_, i) => `Team ${i + 1}`)]
      : customTeamNames
    
    for (let i = 0; i < teamCount; i++) {
      teams.push({
        name: defaultNames[i],
        members: []
      })
    }
    
    // 分配成员到队伍
    shuffledMembers.forEach(member => {
      // 找到成员数量最少的队伍
      let targetTeamIndex = 0
      let minMembers = Infinity
      
      teams.forEach((team, index) => {
        // 如果设置了每队人数限制，跳过已满的队伍
        if (maxMembersPerTeam && team.members.length >= maxMembersPerTeam) return
        
        if (team.members.length < minMembers) {
          minMembers = team.members.length
          targetTeamIndex = index
        }
      })
      
      teams[targetTeamIndex].members.push(member)
    })
    
    // 保存生成的队伍
    setToolState(prev => ({
      ...prev,
      generatedTeams: teams,
      isGenerating: false
    }))
    
    // 记录使用事件
    trackUsage('random-team', { teamCount, memberCount: allMembers.length })
  }, generationDuration)
}

// 重置功能
const resetTeams = () => {
  setToolState(prev => ({
    ...prev,
    generatedTeams: []
  }))
}

// 复制结果
const copyResults = () => {
  if (toolState.generatedTeams.length === 0) return
  
  const resultsText = toolState.generatedTeams.map((team, index) => 
    `${team.name}: ${team.members.join(', ')}`
  ).join('\n\n')
  
  navigator.clipboard.writeText(resultsText)
    .then(() => {
      // 显示复制成功提示
      setToolState(prev => ({
        ...prev,
        showCopySuccess: true
      }))
      
      // 2秒后隐藏提示
      setTimeout(() => {
        setToolState(prev => ({
          ...prev,
          showCopySuccess: false
        }))
      }, 2000)
    })
    .catch(err => {
      console.error('复制失败:', err)
      // 显示复制失败提示
    })
}

// 导入成员列表
const importMembers = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target?.result as string
    const members = parseInputMembers(content)
    
    setToolState(prev => ({
      ...prev,
      inputMembers: content,
      allMembers: members,
      generatedTeams: []
    }))
  }
  reader.readAsText(file)
}

// 导出成员列表
const exportMembers = () => {
  if (toolState.allMembers.length === 0) return
  
  const content = toolState.allMembers.join('\n')
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'members.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 组件挂载时的初始化
useEffect(() => {
  // 加载之前的成员列表
  const savedMembers = localStorage.getItem('randomTeamMembers')
  if (savedMembers) {
    const members = parseInputMembers(savedMembers)
    setToolState(prev => ({
      ...prev,
      inputMembers: savedMembers,
      allMembers: members
    }))
  }
  
  // 加载队伍设置
  const savedSettings = localStorage.getItem('randomTeamSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    setToolState(prev => ({
      ...prev,
      teamCount: settings.teamCount || 2,
      maxMembersPerTeam: settings.maxMembersPerTeam || null,
      customTeamNames: settings.customTeamNames || []
    }))
  }
}, [])

// 保存设置到本地存储
useEffect(() => {
  if (toolState.inputMembers) {
    localStorage.setItem('randomTeamMembers', toolState.inputMembers)
  }
  
  const settings = {
    teamCount: toolState.teamCount,
    maxMembersPerTeam: toolState.maxMembersPerTeam,
    customTeamNames: toolState.customTeamNames
  }
  localStorage.setItem('randomTeamSettings', JSON.stringify(settings))
}, [toolState.inputMembers, toolState.teamCount, toolState.maxMembersPerTeam, toolState.customTeamNames])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Textarea`: 文本输入组件
- `Input`: 输入组件
- `TeamsDisplay`: 队伍显示组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计
- `copyToClipboard`: 复制到剪贴板功能

## 4. 数据结构

```typescript
interface Team {
  name: string
  members: string[]
}

interface RandomTeamState {
  inputMembers: string
  allMembers: string[]
  teamCount: number
  maxMembersPerTeam: number | null
  customTeamNames: string[]
  generatedTeams: Team[]
  isGenerating: boolean
  showCopySuccess?: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 成员列表输入功能（各种分隔符）
- 队伍数量设置功能
- 每队人数限制功能
- 自定义队伍名称功能
- 队伍生成功能
- 结果显示功能
- 复制结果功能
- 重置功能
- 导入/导出功能

### 6.2 边界测试
- 成员数量等于队伍数量的情况
- 设置每队人数限制小于平均值的情况
- 大量成员和队伍的情况

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 生成过程的加载状态
- 队伍显示的清晰度和可阅读性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化组队算法
- 增加更多组队选项和功能

## 8. 总结

Random Team Generator工具采用组件化设计，核心功能使用JavaScript实现随机组队逻辑，支持多种输入方式和自定义选项，帮助用户快速公平地生成随机队伍。工具具有良好的用户体验和可维护性。