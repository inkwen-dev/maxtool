# Text to Speech技术设计文档

## 1. 概述

Text to Speech是一款将文本转换为语音的在线工具，用户可以输入或粘贴文本，选择不同的语音类型和语言，然后生成对应的语音输出。该工具适用于内容朗读、语音内容创作、无障碍访问等场景。

## 2. 功能设计

### 2.1 核心功能
- 支持输入或粘贴文本内容
- 支持多种语言和语音类型选择
- 支持调整语音语速和音调
- 支持文本转语音播放
- 支持生成的语音下载功能
- 支持文本分段处理
- 支持实时预览语音效果
- 支持深色/浅色模式
- 支持响应式设计

### 2.2 辅助功能
- 提供常见文本模板
- 支持快捷键操作
- 支持批量文本转换
- 提供使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `TextToSpeechTool`: 主组件，包含所有功能
  - `TextInput`: 文本输入组件
  - `VoiceSelector`: 语音选择组件
  - `SettingsPanel`: 设置面板组件（语速、音调等）
  - `Controls`: 控制组件（播放、暂停、下载等）
  - `PreviewPlayer`: 预览播放器组件
  - `TemplateLibrary`: 文本模板库组件

### 3.2 核心实现逻辑
```javascript
// 语音列表数据
const voices: Voice[] = [
  { id: 'en-US-JennyNeural', name: 'Jenny', language: 'English (US)', gender: 'Female' },
  { id: 'en-US-GuyNeural', name: 'Guy', language: 'English (US)', gender: 'Male' },
  { id: 'zh-CN-XiaoxiaoNeural', name: 'Xiaoxiao', language: 'Chinese (Mainland)', gender: 'Female' },
  { id: 'zh-CN-YunxiNeural', name: 'Yunxi', language: 'Chinese (Mainland)', gender: 'Male' },
  { id: 'zh-TW-HsiaoChenNeural', name: 'HsiaoChen', language: 'Chinese (Taiwan)', gender: 'Female' },
  { id: 'zh-TW-YunJheNeural', name: 'YunJhe', language: 'Chinese (Taiwan)', gender: 'Male' },
  { id: 'ja-JP-NanamiNeural', name: 'Nanami', language: 'Japanese', gender: 'Female' },
  { id: 'ja-JP-KeitaNeural', name: 'Keita', language: 'Japanese', gender: 'Male' },
  { id: 'ko-KR-SunHiNeural', name: 'SunHi', language: 'Korean', gender: 'Female' },
  { id: 'ko-KR-InJoonNeural', name: 'InJoon', language: 'Korean', gender: 'Male' },
  // 更多语音类型...
]

// 工具状态管理
const [toolState, setToolState] = useState({
  text: '',
  selectedVoice: voices[0],
  rate: 1.0, // 语速 (0.5 - 2.0)
  pitch: 1.0, // 音调 (0.5 - 2.0)
  isPlaying: false,
  isPaused: false,
  audioUrl: '',
  currentTime: 0,
  duration: 0
})

// 创建语音合成器实例
const synth = window.speechSynthesis

// 获取浏览器支持的语音列表
const getBrowserVoices = () => {
  return synth.getVoices()
}

// 合成语音
const synthesizeSpeech = () => {
  if (toolState.text.trim() === '') return
  
  // 清除之前的语音队列
  synth.cancel()
  
  // 创建语音对象
  const utterance = new SpeechSynthesisUtterance(toolState.text)
  utterance.voice = toolState.selectedVoice
  utterance.rate = toolState.rate
  utterance.pitch = toolState.pitch
  
  // 设置事件监听器
  utterance.onstart = () => {
    setToolState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
  }
  
  utterance.onend = () => {
    setToolState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentTime: 0 }))
  }
  
  utterance.onerror = (event) => {
    console.error('语音合成错误:', event.error)
    setToolState(prev => ({ ...prev, isPlaying: false, isPaused: false }))
  }
  
  // 开始合成
  synth.speak(utterance)
}

// 暂停语音
const pauseSpeech = () => {
  if (toolState.isPlaying) {
    synth.pause()
    setToolState(prev => ({ ...prev, isPlaying: false, isPaused: true }))
  }
}

// 继续语音
const resumeSpeech = () => {
  if (toolState.isPaused) {
    synth.resume()
    setToolState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
  }
}

// 停止语音
const stopSpeech = () => {
  synth.cancel()
  setToolState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentTime: 0 }))
}

// 下载语音
const downloadSpeech = async () => {
  if (toolState.text.trim() === '') return
  
  // 使用Web Audio API将语音转换为Blob
  // 注意：这是一个简化的实现，实际可能需要更复杂的处理
  const audioContext = new AudioContext()
  const mediaStreamDestination = audioContext.createMediaStreamDestination()
  
  // 这里需要结合语音合成和音频录制
  // 实际实现可能需要使用第三方库或服务
  
  // 创建下载链接
  const link = document.createElement('a')
  link.href = toolState.audioUrl
  link.download = 'text-to-speech.mp3'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 选择语音
const selectVoice = (voiceId: string) => {
  const voice = voices.find(v => v.id === voiceId) || voices[0]
  setToolState(prev => ({ ...prev, selectedVoice: voice }))
}

// 调整语速
const adjustRate = (rate: number) => {
  setToolState(prev => ({ ...prev, rate }))
}

// 调整音调
const adjustPitch = (pitch: number) => {
  setToolState(prev => ({ ...prev, pitch }))
}

// 输入文本变化
const handleTextChange = (text: string) => {
  setToolState(prev => ({ ...prev, text }))
}

// 组件挂载时的初始化
useEffect(() => {
  // 监听语音列表变化
  const handleVoicesChanged = () => {
    // 更新可用语音列表
    console.log('可用语音列表更新:', getBrowserVoices())
  }
  
  // 添加事件监听器
  speechSynthesis.onvoiceschanged = handleVoicesChanged
  
  // 初始获取语音列表
  handleVoicesChanged()
  
  // 组件卸载时清理
  return () => {
    // 取消所有语音合成
    speechSynthesis.cancel()
    // 移除事件监听器
    speechSynthesis.onvoiceschanged = null
  }
}, [])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 输入组件
- `Textarea`: 文本域组件
- `Select`: 选择器组件
- `RangeSlider`: 滑块组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface Voice {
  id: string
  name: string
  language: string
  gender: 'Male' | 'Female' | 'Neutral'
}

interface TextToSpeechState {
  text: string
  selectedVoice: Voice
  rate: number
  pitch: number
  isPlaying: boolean
  isPaused: boolean
  audioUrl: string
  currentTime: number
  duration: number
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 文本输入和语音生成功能
- 不同语音类型和语言的选择功能
- 语速和音调调整功能
- 语音播放、暂停、停止功能
- 语音下载功能
- 实时预览功能

### 6.2 边界测试
- 处理非常长的文本内容
- 处理特殊字符和标点符号
- 网络连接问题处理
- 浏览器兼容性测试

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 加载状态和错误提示
- 各种浏览器和设备上的表现

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化语音质量和功能
- 增加更多语言和语音类型
- 优化下载功能和文件格式

## 8. 总结

Text to Speech工具采用组件化设计，核心功能使用Web Speech API实现文本转语音，支持多种语言和语音类型选择，提供播放、暂停、下载等功能。工具具有良好的用户体验和可维护性，适用于各种文本转语音场景。