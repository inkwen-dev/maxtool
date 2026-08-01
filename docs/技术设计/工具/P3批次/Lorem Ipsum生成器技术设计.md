# Lorem Ipsum生成器技术设计文档

## 1. 概述

Lorem Ipsum生成器是一款帮助用户生成占位文本的在线工具。用户可以指定文本的类型（段落、句子、单词）、数量和语言，生成用于设计和开发的填充文本。

## 2. 功能设计

### 2.1 核心功能
- 多种文本类型选择（段落、句子、单词）
- 生成数量调节
- 语言选择（英语、拉丁语等）
- 实时预览
- 复制和下载功能

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `LoremIpsumGenerator`: 主组件，包含所有功能
  - `TextSettings`: 文本设置组件（类型、数量、语言）
  - `TextPreview`: 实时预览组件
  - `ActionButtons`: 操作按钮（生成、复制、下载）
  - `UsageInstructions`: 使用说明组件

### 3.2 核心实现逻辑
```javascript
// Lorem Ipsum基本文本库
const loremIpsumTexts = {
  latin: {
    words: [
      'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'Ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      // 更多拉丁语单词...
    ],
    sentences: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      // 更多拉丁语句子...
    ]
  },
  english: {
    words: [
      'The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog',
      'A', 'journey', 'of', 'a', 'thousand', 'miles', 'begins', 'with', 'a', 'single', 'step',
      // 更多英语单词...
    ],
    sentences: [
      'The quick brown fox jumps over the lazy dog.',
      'A journey of a thousand miles begins with a single step.',
      'All that glitters is not gold.',
      // 更多英语句子...
    ]
  }
}

// 生成Lorem Ipsum文本
const generateLoremIpsum = (type, count, language = 'latin') => {
  const texts = loremIpsumTexts[language] || loremIpsumTexts.latin
  
  switch (type) {
    case 'words':
      return generateWords(texts.words, count)
    case 'sentences':
      return generateSentences(texts.sentences, count)
    case 'paragraphs':
      return generateParagraphs(texts.sentences, count)
    default:
      return generateParagraphs(texts.sentences, count)
  }
}

// 生成单词
const generateWords = (words, count) => {
  const result = []
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length)
    result.push(words[randomIndex])
  }
  return result.join(' ')
}

// 生成句子
const generateSentences = (sentences, count) => {
  const result = []
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * sentences.length)
    result.push(sentences[randomIndex])
  }
  return result.join(' ')
}

// 生成段落
const generateParagraphs = (sentences, count) => {
  const result = []
  for (let i = 0; i < count; i++) {
    // 每个段落在3-8个句子之间
    const sentencesPerParagraph = Math.floor(Math.random() * 6) + 3
    const paragraph = generateSentences(sentences, sentencesPerParagraph)
    result.push(paragraph)
  }
  return result.join('\n\n')
}
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Select`: 通用选择组件
- `Input`: 通用输入组件
- `Textarea`: 通用文本区域组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `copyToClipboard`: 复制功能
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
type TextType = 'paragraphs' | 'sentences' | 'words'
type LanguageType = 'latin' | 'english'

interface LoremIpsumState {
  textType: TextType
  count: number
  language: LanguageType
  output: string
  isGenerating: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 基本文本生成
- 不同文本类型的生成
- 语言选择功能
- 数量调节功能
- 复制和下载功能

### 6.2 边界测试
- 大量文本生成（性能测试）
- 特殊字符处理
- 不同语言的支持

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 交互流畅性
- 实时预览的准确性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化生成算法
- 定期添加新的语言和文本类型

## 8. 总结

Lorem Ipsum生成器采用组件化设计，核心功能使用JavaScript实现，无需额外的第三方库。工具提供多种文本类型和语言选择，界面简洁直观，适合用户快速生成占位文本。