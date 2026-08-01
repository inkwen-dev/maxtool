# Emoji List技术设计文档

## 1. 概述

Emoji List是一款Emoji表情符号集合工具，用户可以浏览、搜索和复制各种Emoji表情。该工具适用于内容创作、社交媒体、聊天应用等场景，提供了丰富的Emoji资源。

## 2. 功能设计

### 2.1 核心功能
- 提供各种类型的Emoji表情分类展示
- 支持Emoji搜索功能
- 支持点击Emoji复制到剪贴板
- 支持按Emoji类型筛选
- 支持Emoji收藏功能
- 支持深色/浅色模式
- 支持响应式设计

### 2.2 辅助功能
- 提供Emoji使用示例
- 支持Emoji分类管理
- 支持Emoji批量复制
- 提供使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `EmojiListTool`: 主组件，包含所有功能
  - `EmojiCategories`: Emoji分类组件
  - `EmojiGrid`: Emoji网格展示组件
  - `SearchBar`: 搜索栏组件
  - `FavoritesPanel`: 收藏面板组件
  - `CategoryFilter`: 分类筛选组件

### 3.2 核心实现逻辑
```javascript
// Emoji分类和Emoji数据
const emojiCategories: EmojiCategory[] = [
  {
    id: 'smileys-emotion',
    name: '笑脸与情感',
    emojis: [
      { id: 'grinning-face', emoji: '😀', description: '露齿笑' },
      { id: 'grinning-face-with-smiling-eyes', emoji: '😄', description: '眯眼笑' },
      { id: 'grinning-squinting-face', emoji: '😆', description: '大笑' },
      { id: 'grinning-face-with-smiling-eyes-and-smiling-mouth', emoji: '😁', description: '开心笑' },
      { id: 'beaming-face-with-smiling-eyes', emoji: '😃', description: '容光焕发' },
      { id: 'grinning-face-with-big-eyes', emoji: '😃', description: '大眼睛笑' },
      { id: 'grinning-face-with-sweat', emoji: '😅', description: '汗颜笑' },
      { id: 'rolling-on-the-floor-laughing', emoji: '🤣', description: '笑到打滚' },
      { id: 'face-with-tears-of-joy', emoji: '😂', description: '笑哭' },
      { id: 'slightly-smiling-face', emoji: '🙂', description: '微微笑' },
      { id: 'upside-down-face', emoji: '🙃', description: '倒脸' },
      { id: 'winking-face', emoji: '😉', description: '眨眼' },
      // 更多笑脸与情感Emoji...
    ]
  },
  {
    id: 'people-body',
    name: '人物与身体',
    emojis: [
      { id: 'person', emoji: '👤', description: '人物' },
      { id: 'man', emoji: '👨', description: '男人' },
      { id: 'woman', emoji: '👩', description: '女人' },
      { id: 'girl', emoji: '👧', description: '女孩' },
      { id: 'boy', emoji: '👦', description: '男孩' },
      { id: 'baby', emoji: '👶', description: '婴儿' },
      { id: 'family', emoji: '👨‍👩‍👧‍👦', description: '家庭' },
      { id: 'hand-with-index-and-middle-fingers-crossed', emoji: '🤞', description: '交叉手指' },
      { id: 'thumbs-up', emoji: '👍', description: '点赞' },
      { id: 'thumbs-down', emoji: '👎', description: '踩' },
      { id: 'ok-hand', emoji: '👌', description: 'OK手势' },
      { id: 'victory-hand', emoji: '✌️', description: '胜利手势' },
      // 更多人物与身体Emoji...
    ]
  },
  {
    id: 'animals-nature',
    name: '动物与自然',
    emojis: [
      { id: 'cat', emoji: '🐱', description: '猫' },
      { id: 'dog', emoji: '🐶', description: '狗' },
      { id: 'mouse', emoji: '🐭', description: '老鼠' },
      { id: 'hamster', emoji: '🐹', description: '仓鼠' },
      { id: 'rabbit', emoji: '🐰', description: '兔子' },
      { id: 'fox', emoji: '🦊', description: '狐狸' },
      { id: 'bear', emoji: '🐻', description: '熊' },
      { id: 'lion', emoji: '🦁', description: '狮子' },
      { id: 'tiger', emoji: '🐯', description: '老虎' },
      { id: 'panda', emoji: '🐼', description: '熊猫' },
      { id: 'elephant', emoji: '🐘', description: '大象' },
      { id: 'giraffe', emoji: '🦒', description: '长颈鹿' },
      // 更多动物与自然Emoji...
    ]
  },
  {
    id: 'food-drink',
    name: '食物与饮料',
    emojis: [
      { id: 'pizza', emoji: '🍕', description: '披萨' },
      { id: 'hamburger', emoji: '🍔', description: '汉堡' },
      { id: 'fries', emoji: '🍟', description: '薯条' },
      { id: 'hot-dog', emoji: '🌭', description: '热狗' },
      { id: 'taco', emoji: '🌮', description: '塔可' },
      { id: 'sushi', emoji: '🍣', description: '寿司' },
      { id: 'ramen', emoji: '🍜', description: '拉面' },
      { id: 'rice', emoji: '🍚', description: '米饭' },
      { id: 'bread', emoji: '🍞', description: '面包' },
      { id: 'cake', emoji: '🍰', description: '蛋糕' },
      { id: 'ice-cream', emoji: '🍦', description: '冰淇淋' },
      { id: 'coffee', emoji: '☕', description: '咖啡' },
      // 更多食物与饮料Emoji...
    ]
  },
  {
    id: 'travel-places',
    name: '旅行与地点',
    emojis: [
      { id: 'airplane', emoji: '✈️', description: '飞机' },
      { id: 'car', emoji: '🚗', description: '汽车' },
      { id: 'train', emoji: '🚂', description: '火车' },
      { id: 'bus', emoji: '🚌', description: '公交车' },
      { id: 'boat', emoji: '⛵', description: '船' },
      { id: 'bicycle', emoji: '🚲', description: '自行车' },
      { id: 'cityscape', emoji: '🏙️', description: '城市风景' },
      { id: 'mountain', emoji: '⛰️', description: '山' },
      { id: 'beach', emoji: '🏖️', description: '海滩' },
      { id: 'sun', emoji: '☀️', description: '太阳' },
      { id: 'moon', emoji: '🌙', description: '月亮' },
      { id: 'stars', emoji: '⭐', description: '星星' },
      // 更多旅行与地点Emoji...
    ]
  },
  {
    id: 'objects',
    name: '物品',
    emojis: [
      { id: 'phone', emoji: '📱', description: '手机' },
      { id: 'laptop', emoji: '💻', description: '笔记本电脑' },
      { id: 'desktop-computer', emoji: '🖥️', description: '台式电脑' },
      { id: 'tablet', emoji: '📱', description: '平板' },
      { id: 'keyboard', emoji: '⌨️', description: '键盘' },
      { id: 'mouse', emoji: '🖱️', description: '鼠标' },
      { id: 'camera', emoji: '📷', description: '相机' },
      { id: 'tv', emoji: '📺', description: '电视' },
      { id: 'headphones', emoji: '🎧', description: '耳机' },
      { id: 'watch', emoji: '⌚', description: '手表' },
      { id: 'glasses', emoji: '👓', description: '眼镜' },
      { id: 'umbrella', emoji: '☂️', description: '雨伞' },
      // 更多物品Emoji...
    ]
  },
  // 更多Emoji分类...
]

// 工具状态管理
const [toolState, setToolState] = useState({
  categories: emojiCategories,
  searchQuery: '',
  selectedCategory: 'all',
  favorites: [] as string[],
  copiedEmoji: null as string | null
})

// 复制Emoji到剪贴板
const copyEmoji = (emoji: string) => {
  navigator.clipboard.writeText(emoji)
    .then(() => {
      // 显示复制成功提示
      setToolState(prev => ({ ...prev, copiedEmoji: emoji }))
      
      // 3秒后清除提示
      setTimeout(() => {
        setToolState(prev => ({ ...prev, copiedEmoji: null }))
      }, 3000)
    })
    .catch(err => {
      console.error('复制失败:', err)
      // 处理复制失败情况
    })
}

// 切换Emoji收藏状态
const toggleFavorite = (emojiId: string) => {
  setToolState(prev => {
    const isFavorited = prev.favorites.includes(emojiId)
    let newFavorites
    
    if (isFavorited) {
      newFavorites = prev.favorites.filter(id => id !== emojiId)
    } else {
      newFavorites = [...prev.favorites, emojiId]
    }
    
    // 保存收藏到本地存储
    localStorage.setItem('emojiFavorites', JSON.stringify(newFavorites))
    
    return { ...prev, favorites: newFavorites }
  })
}

// 搜索Emoji
const handleSearch = (query: string) => {
  setToolState(prev => ({ ...prev, searchQuery: query }))
}

// 选择分类
const selectCategory = (categoryId: string) => {
  setToolState(prev => ({ ...prev, selectedCategory: categoryId }))
}

// 筛选Emoji
const filteredEmojis = () => {
  let emojis = [] as Emoji[]
  
  // 获取所有Emoji或特定分类的Emoji
  if (toolState.selectedCategory === 'all') {
    // 收集所有分类的Emoji
    for (const category of toolState.categories) {
      emojis = emojis.concat(category.emojis)
    }
  } else {
    // 收集特定分类的Emoji
    const category = toolState.categories.find(cat => cat.id === toolState.selectedCategory)
    if (category) {
      emojis = category.emojis
    }
  }
  
  // 应用搜索过滤
  if (toolState.searchQuery.trim()) {
    const query = toolState.searchQuery.toLowerCase()
    emojis = emojis.filter(emoji => 
      emoji.description.toLowerCase().includes(query)
    )
  }
  
  return emojis
}

// 获取收藏的Emoji
const favoriteEmojis = () => {
  let allEmojis = [] as Emoji[]
  
  // 收集所有分类的Emoji
  for (const category of toolState.categories) {
    allEmojis = allEmojis.concat(category.emojis)
  }
  
  // 过滤出收藏的Emoji
  return allEmojis.filter(emoji => toolState.favorites.includes(emoji.id))
}

// 组件挂载时的初始化
useEffect(() => {
  // 从本地存储加载收藏的Emoji
  const savedFavorites = localStorage.getItem('emojiFavorites')
  if (savedFavorites) {
    try {
      const favorites = JSON.parse(savedFavorites)
      setToolState(prev => ({ ...prev, favorites }))
    } catch (error) {
      console.error('解析收藏Emoji失败:', error)
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
interface Emoji {
  id: string
  emoji: string
  description: string
}

interface EmojiCategory {
  id: string
  name: string
  emojis: Emoji[]
}

interface EmojiListState {
  categories: EmojiCategory[]
  searchQuery: string
  selectedCategory: string
  favorites: string[]
  copiedEmoji: string | null
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- Emoji分类展示功能
- Emoji搜索功能
- Emoji复制功能
- Emoji收藏功能
- Emoji分类筛选功能

### 6.2 边界测试
- 搜索不存在的Emoji
- 大量Emoji的加载和显示
- 本地存储不可用的情况
- 浏览器兼容性测试

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- Emoji网格的显示效果
- 复制成功提示的用户体验

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化Emoji库
- 定期更新Emoji分类和Emoji数据
- 优化搜索和筛选功能

## 8. 总结

Emoji List工具采用组件化设计，核心功能使用JavaScript实现Emoji的展示、搜索和复制功能，支持Emoji分类管理和收藏功能。工具具有良好的用户体验和可维护性，适用于各种Emoji使用场景。