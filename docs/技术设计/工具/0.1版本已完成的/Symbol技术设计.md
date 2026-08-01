# Symbol技术设计文档

## 1. 概述

Symbol是一款特殊符号集合工具，用户可以浏览、搜索和复制各种特殊符号。该工具适用于内容创作、文档编辑、社交媒体等场景，提供了丰富的特殊字符和符号资源。

## 2. 功能设计

### 2.1 核心功能
- 提供各种类型的特殊符号分类展示
- 支持符号搜索功能
- 支持点击符号复制到剪贴板
- 支持按符号类型筛选
- 支持符号收藏功能
- 支持深色/浅色模式
- 支持响应式设计

### 2.2 辅助功能
- 提供符号使用示例
- 支持符号分类管理
- 支持符号批量复制
- 提供使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `SymbolTool`: 主组件，包含所有功能
  - `SymbolCategories`: 符号分类组件
  - `SymbolGrid`: 符号网格展示组件
  - `SearchBar`: 搜索栏组件
  - `FavoritesPanel`: 收藏面板组件
  - `CategoryFilter`: 分类筛选组件

### 3.2 核心实现逻辑
```javascript
// 符号分类和符号数据
const symbolCategories: SymbolCategory[] = [
  {
    id: 'punctuation',
    name: '标点符号',
    symbols: [
      { id: 'exclamation', symbol: '!', description: '感叹号' },
      { id: 'question', symbol: '?', description: '问号' },
      { id: 'period', symbol: '.', description: '句号' },
      { id: 'comma', symbol: ',', description: '逗号' },
      { id: 'semicolon', symbol: ';', description: '分号' },
      { id: 'colon', symbol: ':', description: '冒号' },
      { id: 'dash', symbol: '-', description: '破折号' },
      { id: 'hyphen', symbol: '–', description: '连字符' },
      { id: 'ellipsis', symbol: '…', description: '省略号' },
      // 更多标点符号...
    ]
  },
  {
    id: 'mathematical',
    name: '数学符号',
    symbols: [
      { id: 'plus', symbol: '+', description: '加号' },
      { id: 'minus', symbol: '-', description: '减号' },
      { id: 'multiply', symbol: '×', description: '乘号' },
      { id: 'divide', symbol: '÷', description: '除号' },
      { id: 'equals', symbol: '=', description: '等号' },
      { id: 'notEquals', symbol: '≠', description: '不等号' },
      { id: 'lessThan', symbol: '<', description: '小于号' },
      { id: 'greaterThan', symbol: '>', description: '大于号' },
      { id: 'lessThanOrEqual', symbol: '≤', description: '小于等于号' },
      { id: 'greaterThanOrEqual', symbol: '≥', description: '大于等于号' },
      { id: 'pi', symbol: 'π', description: '圆周率' },
      { id: 'infinity', symbol: '∞', description: '无穷大' },
      { id: 'sum', symbol: 'Σ', description: '求和符号' },
      // 更多数学符号...
    ]
  },
  {
    id: 'currency',
    name: '货币符号',
    symbols: [
      { id: 'dollar', symbol: '$', description: '美元' },
      { id: 'euro', symbol: '€', description: '欧元' },
      { id: 'pound', symbol: '£', description: '英镑' },
      { id: 'yen', symbol: '¥', description: '日元' },
      { id: 'yuan', symbol: '¥', description: '人民币' },
      { id: 'rupee', symbol: '₹', description: '卢比' },
      { id: 'ruble', symbol: '₽', description: '卢布' },
      // 更多货币符号...
    ]
  },
  {
    id: 'arrows',
    name: '箭头符号',
    symbols: [
      { id: 'upArrow', symbol: '↑', description: '向上箭头' },
      { id: 'downArrow', symbol: '↓', description: '向下箭头' },
      { id: 'leftArrow', symbol: '←', description: '向左箭头' },
      { id: 'rightArrow', symbol: '→', description: '向右箭头' },
      { id: 'upRightArrow', symbol: '↗', description: '向右上方箭头' },
      { id: 'upLeftArrow', symbol: '↖', description: '向左上方箭头' },
      { id: 'downRightArrow', symbol: '↘', description: '向右下方箭头' },
      { id: 'downLeftArrow', symbol: '↙', description: '向左下方箭头' },
      { id: 'doubleUpArrow', symbol: '⇑', description: '双向上箭头' },
      { id: 'doubleDownArrow', symbol: '⇓', description: '双向下箭头' },
      { id: 'doubleLeftArrow', symbol: '⇐', description: '双向左箭头' },
      { id: 'doubleRightArrow', symbol: '⇒', description: '双向右箭头' },
      // 更多箭头符号...
    ]
  },
  {
    id: 'stars',
    name: '星星符号',
    symbols: [
      { id: 'star', symbol: '★', description: '实心星星' },
      { id: 'emptyStar', symbol: '☆', description: '空心星星' },
      { id: 'starOfDavid', symbol: '✡', description: '大卫之星' },
      { id: 'asterisk', symbol: '✱', description: '星号' },
      // 更多星星符号...
    ]
  },
  {
    id: 'emoticons',
    name: '表情符号',
    symbols: [
      { id: 'smile', symbol: '☺', description: '微笑' },
      { id: 'heart', symbol: '♥', description: '心形' },
      { id: 'brokenHeart', symbol: '♡', description: '破碎的心' },
      { id: 'happyFace', symbol: '☻', description: '开心脸' },
      { id: 'sadFace', symbol: '☹', description: '悲伤脸' },
      // 更多表情符号...
    ]
  },
  // 更多符号分类...
]

// 工具状态管理
const [toolState, setToolState] = useState({
  categories: symbolCategories,
  searchQuery: '',
  selectedCategory: 'all',
  favorites: [] as string[],
  copiedSymbol: null as string | null
})

// 复制符号到剪贴板
const copySymbol = (symbol: string) => {
  navigator.clipboard.writeText(symbol)
    .then(() => {
      // 显示复制成功提示
      setToolState(prev => ({ ...prev, copiedSymbol: symbol }))
      
      // 3秒后清除提示
      setTimeout(() => {
        setToolState(prev => ({ ...prev, copiedSymbol: null }))
      }, 3000)
    })
    .catch(err => {
      console.error('复制失败:', err)
      // 处理复制失败情况
    })
}

// 切换符号收藏状态
const toggleFavorite = (symbolId: string) => {
  setToolState(prev => {
    const isFavorited = prev.favorites.includes(symbolId)
    let newFavorites
    
    if (isFavorited) {
      newFavorites = prev.favorites.filter(id => id !== symbolId)
    } else {
      newFavorites = [...prev.favorites, symbolId]
    }
    
    // 保存收藏到本地存储
    localStorage.setItem('symbolFavorites', JSON.stringify(newFavorites))
    
    return { ...prev, favorites: newFavorites }
  })
}

// 搜索符号
const handleSearch = (query: string) => {
  setToolState(prev => ({ ...prev, searchQuery: query }))
}

// 选择分类
const selectCategory = (categoryId: string) => {
  setToolState(prev => ({ ...prev, selectedCategory: categoryId }))
}

// 筛选符号
const filteredSymbols = () => {
  let symbols = [] as Symbol[]
  
  // 获取所有符号或特定分类的符号
  if (toolState.selectedCategory === 'all') {
    // 收集所有分类的符号
    for (const category of toolState.categories) {
      symbols = symbols.concat(category.symbols)
    }
  } else {
    // 收集特定分类的符号
    const category = toolState.categories.find(cat => cat.id === toolState.selectedCategory)
    if (category) {
      symbols = category.symbols
    }
  }
  
  // 应用搜索过滤
  if (toolState.searchQuery.trim()) {
    const query = toolState.searchQuery.toLowerCase()
    symbols = symbols.filter(symbol => 
      symbol.description.toLowerCase().includes(query) ||
      symbol.symbol.toLowerCase().includes(query)
    )
  }
  
  return symbols
}

// 获取收藏的符号
const favoriteSymbols = () => {
  let allSymbols = [] as Symbol[]
  
  // 收集所有分类的符号
  for (const category of toolState.categories) {
    allSymbols = allSymbols.concat(category.symbols)
  }
  
  // 过滤出收藏的符号
  return allSymbols.filter(symbol => toolState.favorites.includes(symbol.id))
}

// 组件挂载时的初始化
useEffect(() => {
  // 从本地存储加载收藏的符号
  const savedFavorites = localStorage.getItem('symbolFavorites')
  if (savedFavorites) {
    try {
      const favorites = JSON.parse(savedFavorites)
      setToolState(prev => ({ ...prev, favorites }))
    } catch (error) {
      console.error('解析收藏符号失败:', error)
    }
  }
}, [])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 输入组件
- `Card`: 卡片组件
- `SearchBar`: 搜索栏组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface Symbol {
  id: string
  symbol: string
  description: string
}

interface SymbolCategory {
  id: string
  name: string
  symbols: Symbol[]
}

interface SymbolToolState {
  categories: SymbolCategory[]
  searchQuery: string
  selectedCategory: string
  favorites: string[]
  copiedSymbol: string | null
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 符号分类展示功能
- 符号搜索功能
- 符号复制功能
- 符号收藏功能
- 符号分类筛选功能

### 6.2 边界测试
- 搜索不存在的符号
- 大量符号的加载和显示
- 本地存储不可用的情况
- 浏览器兼容性测试

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 符号网格的显示效果
- 复制成功提示的用户体验

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化符号库
- 定期更新符号分类和符号数据
- 优化搜索和筛选功能

## 8. 总结

Symbol工具采用组件化设计，核心功能使用JavaScript实现符号的展示、搜索和复制功能，支持符号分类管理和收藏功能。工具具有良好的用户体验和可维护性，适用于各种特殊符号使用场景。