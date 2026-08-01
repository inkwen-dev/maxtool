# Font Generator技术设计文档

## 1. 概述

Font Generator是一款字体样式生成工具，用户可以输入文本，工具会生成各种不同的字体样式，用户可以复制喜欢的字体样式到剪贴板。该工具适用于社交媒体、文案设计、个人签名等需要多样化字体的场景。

## 2. 功能设计

### 2.1 核心功能
- 支持输入文本并生成多种字体样式
- 提供丰富的字体样式库（艺术字、手写体、装饰体、符号体等）
- 支持一键复制生成的字体样式
- 支持实时预览生成的字体效果
- 支持调整生成的字体大小
- 支持深色/浅色模式
- 支持保存常用字体样式
- 支持批量生成字体样式

### 2.2 辅助功能
- 响应式设计，适配不同设备
- 使用说明和示例
- 字体样式分类浏览

## 3. 技术设计

### 3.1 组件结构
- `FontGeneratorTool`: 主组件，包含所有功能
  - `TextInput`: 文本输入组件
  - `FontPreview`: 字体预览组件（展示生成的各种字体样式）
  - `FontCategories`: 字体分类组件
  - `FontSizeControl`: 字体大小控制组件
  - `FavoriteFonts`: 收藏字体组件
  - `CopyButton`: 复制按钮组件

### 3.2 核心实现逻辑
```javascript
// 字体样式生成函数
const generateFontStyles = (text: string) => {
  if (!text) return []
  
  // 使用Unicode字符映射生成不同的字体样式
  const fontStyles = [
    {
      id: 'bold',
      name: 'Bold',
      generatedText: text.replace(/[a-zA-Z]/g, char => {
        const code = char.charCodeAt(0)
        if (code >= 65 && code <= 90) {
          // 大写字母
          return String.fromCharCode(code + 120128)
        } else if (code >= 97 && code <= 122) {
          // 小写字母
          return String.fromCharCode(code + 120160)
        }
        return char
      })
    },
    {
      id: 'italic',
      name: 'Italic',
      generatedText: text.replace(/[a-zA-Z]/g, char => {
        const code = char.charCodeAt(0)
        if (code >= 65 && code <= 90) {
          // 大写字母
          return String.fromCharCode(code + 120256)
        } else if (code >= 97 && code <= 122) {
          // 小写字母
          return String.fromCharCode(code + 120288)
        }
        return char
      })
    },
    {
      id: 'script',
      name: 'Script',
      generatedText: text.replace(/[a-zA-Z]/g, char => {
        const code = char.charCodeAt(0)
        if (code >= 65 && code <= 90) {
          // 大写字母
          return String.fromCharCode(code + 120384)
        } else if (code >= 97 && code <= 122) {
          // 小写字母
          return String.fromCharCode(code + 120416)
        }
        return char
      })
    },
    // 更多字体样式...
  ]
  
  return fontStyles
}

// 工具状态管理
const [toolState, setToolState] = useState({
  inputText: '',
  generatedFonts: [] as GeneratedFont[],
  fontSize: 24,
  selectedCategory: 'all',
  favoriteFonts: [] as string[],
  isLoading: false
})

// 生成字体样式
const handleGenerateFonts = (text: string) => {
  setToolState(prev => ({
    ...prev,
    inputText: text,
    isLoading: true
  }))
  
  // 模拟异步生成（实际是同步的，但为了UI体验可以添加延迟）
  setTimeout(() => {
    const fonts = generateFontStyles(text)
    setToolState(prev => ({
      ...prev,
      generatedFonts: fonts,
      isLoading: false
    }))
  }, 100)
}

// 复制字体样式到剪贴板
const copyFontToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    // 显示复制成功提示
    alert('字体样式已复制到剪贴板')
  }).catch(err => {
    console.error('复制失败:', err)
  })
}

// 切换字体收藏状态
const toggleFavoriteFont = (fontId: string) => {
  setToolState(prev => {
    const isFavorite = prev.favoriteFonts.includes(fontId)
    let newFavorites: string[] = []
    
    if (isFavorite) {
      // 从收藏中移除
      newFavorites = prev.favoriteFonts.filter(id => id !== fontId)
    } else {
      // 添加到收藏
      newFavorites = [...prev.favoriteFonts, fontId]
    }
    
    // 保存收藏到本地存储
    localStorage.setItem('favoriteFonts', JSON.stringify(newFavorites))
    
    return {
      ...prev,
      favoriteFonts: newFavorites
    }
  })
}

// 设置字体大小
const setFontSize = (size: number) => {
  setToolState(prev => ({
    ...prev,
    fontSize: size
  }))
}

// 选择字体分类
const selectCategory = (category: string) => {
  setToolState(prev => ({
    ...prev,
    selectedCategory: category
  }))
}

// 获取分类后的字体样式
const getFilteredFonts = () => {
  if (toolState.selectedCategory === 'all') {
    return toolState.generatedFonts
  }
  
  return toolState.generatedFonts.filter(font => 
    font.categories.includes(toolState.selectedCategory)
  )
}

// 组件挂载时的初始化
useEffect(() => {
  // 加载收藏的字体
  const savedFavorites = localStorage.getItem('favoriteFonts')
  if (savedFavorites) {
    setToolState(prev => ({
      ...prev,
      favoriteFonts: JSON.parse(savedFavorites)
    }))
  }
  
  // 如果有输入文本，自动生成字体
  if (toolState.inputText) {
    handleGenerateFonts(toolState.inputText)
  }
}, [])

// 输入文本变化时生成字体
useEffect(() => {
  if (toolState.inputText) {
    handleGenerateFonts(toolState.inputText)
  }
}, [toolState.inputText])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 输入组件
- `Slider`: 滑块组件（字体大小控制）
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface GeneratedFont {
  id: string
  name: string
  generatedText: string
  categories: string[]
  description?: string
}

interface FontGeneratorState {
  inputText: string
  generatedFonts: GeneratedFont[]
  fontSize: number
  selectedCategory: string
  favoriteFonts: string[]
  isLoading: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 文本输入和字体生成功能
- 各种字体样式的生成效果
- 复制功能
- 收藏功能
- 字体大小调整功能
- 分类浏览功能

### 6.2 边界测试
- 输入非常长的文本
- 输入特殊字符
- 输入不同语言的文本

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 字体预览的视觉效果
- 复制功能的用户体验

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，增加更多字体样式
- 优化字体生成算法
- 增加字体样式的搜索功能

## 8. 总结

Font Generator工具采用组件化设计，核心功能使用Unicode字符映射技术生成各种字体样式，支持实时预览、一键复制、收藏等功能。工具具有良好的用户体验和可维护性，适用于各种需要多样化字体的场景。