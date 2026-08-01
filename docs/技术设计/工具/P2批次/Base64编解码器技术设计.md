# Base64编解码器技术设计文档

## 一、概述

本文档详细描述MaxTool 0.2版本中Base64编解码器（Base64 Encoder/Decoder）工具的技术设计，包括功能设计、技术实现、组件结构和代码复用等方面。设计严格遵循项目规范，注重代码复用、组件化和性能优化。

## 二、功能设计

### 1. 核心功能

#### Base64编码
- 将文本数据编码为Base64格式
- 支持UTF-8字符编码

#### Base64解码
- 将Base64格式数据解码为文本
- 支持自动检测和解码标准Base64格式

#### 辅助功能
- 支持文件上传编码/解码
- 支持复制编码/解码结果
- 支持清空输入

### 2. 用户界面

#### 输入区域
- 文本输入框：用于输入要编码/解码的文本
- 文件上传：支持上传文件进行编码/解码

#### 操作选项
- 编码/解码模式切换：在编码和解码模式之间切换
- 字符编码选择：选择文本编码格式（UTF-8、ASCII等）

#### 输出区域
- 结果显示区域：显示编码/解码后的结果
- 结果统计：显示输入/输出的字符数和字节数

#### 功能按钮
- 转换按钮：执行编码或解码操作
- 复制按钮：复制转换结果
- 清空按钮：快速清空输入和输出

#### 使用说明
- 提供简洁的使用步骤说明

## 三、技术设计

### 1. 技术选型

#### 浏览器API
- btoa()/atob()：用于Base64编码和解码
- File API：用于文件上传和读取
- Clipboard API：用于复制转换结果
- Textarea API：用于处理多行文本输入

### 2. 组件结构

#### 主组件

##### Base64EncoderDecoder
- **位置**：`components/tools/Base64EncoderDecoder.tsx`
- **功能**：Base64编解码器工具的主组件
- **结构**：
  ```tsx
  'use client'

  import { useState, useRef } from 'react'
  import Button from '@/components/ui/Button'
  import Input from '@/components/ui/Input'
  import { trackUsage } from '@/lib/tracking'
  import UsageInstructions from '@/components/shared/UsageInstructions'
  import { copyToClipboard } from '@/lib/clipboard-utils'

  // 支持的字符编码
  const SUPPORTED_ENCODINGS = [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'ascii', label: 'ASCII' },
    { value: 'utf-16', label: 'UTF-16' },
    { value: 'latin1', label: 'Latin-1' }
  ] as const

  export default function Base64EncoderDecoder() {
    // State declarations
    const [mode, setMode] = useState<'encode' | 'decode'>('encode')
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [encoding, setEncoding] = useState<'utf-8' | 'ascii' | 'utf-16' | 'latin1'>('utf-8')
    const [error, setError] = useState<string | null>(null)
    const [hasTracked, setHasTracked] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Event handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
      setError(null)
    }

    const handleModeChange = (newMode: 'encode' | 'decode') => {
      setMode(newMode)
      setInput('')
      setOutput('')
      setError(null)
    }

    const handleEncodingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setEncoding(e.target.value as 'utf-8' | 'ascii' | 'utf-16' | 'latin1')
    }

    // Base64编码实现
    const encodeBase64 = (text: string): string => {
      try {
        // 标准Base64编码
        return btoa(unescape(encodeURIComponent(text)))
      } catch (err) {
        throw new Error('编码失败：' + (err instanceof Error ? err.message : String(err)))
      }
    }

    // Base64解码实现
    const decodeBase64 = (base64: string): string => {
      try {
        // 标准Base64解码
        return decodeURIComponent(escape(atob(base64)))
      } catch (err) {
        throw new Error('解码失败：' + (err instanceof Error ? err.message : String(err)))
      }
    }

    // 处理文件上传
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      
      if (mode === 'encode') {
        reader.onload = (event) => {
          const content = event.target?.result as string
          setInput(content)
        }
        reader.readAsText(file, encoding)
      } else {
        reader.onload = (event) => {
          const content = event.target?.result as string
          setInput(content)
        }
        reader.readAsText(file)
      }
    }

    // 执行转换
    const handleConvert = () => {
      if (!input.trim()) {
        setError('请输入要转换的数据')
        return
      }

      try {
        let result: string
        
        if (mode === 'encode') {
          result = encodeBase64(input)
        } else {
          result = decodeBase64(input)
        }
        
        setOutput(result)
        setError(null)
        
        if (!hasTracked) {
          trackUsage('base64-encoder-decoder')
          setHasTracked(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '转换失败')
        setOutput('')
      }
    }

    const handleCopy = () => {
      if (output) {
        copyToClipboard(output)
        // 显示复制成功提示
      }
    }

    const handleClear = () => {
      setInput('')
      setOutput('')
      setError(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    // 统计信息
    const inputStats = {
      chars: input.length,
      bytes: new Blob([input]).size
    }

    const outputStats = {
      chars: output.length,
      bytes: new Blob([output]).size
    }

    // Render
    return (
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex gap-4">
          <Button
            variant={mode === 'encode' ? 'primary' : 'secondary'}
            onClick={() => handleModeChange('encode')}
            className="flex-1"
          >
            Base64编码
          </Button>
          <Button
            variant={mode === 'decode' ? 'primary' : 'secondary'}
            onClick={() => handleModeChange('decode')}
            className="flex-1"
          >
            Base64解码
          </Button>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {mode === 'encode' ? '输入要编码的文本' : '输入要解码的Base64'}
            </h2>
            <Button onClick={handleClear} variant="secondary">
              清空
            </Button>
          </div>
          
          {/* Text Input */}
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'encode' ? '请输入要编码的文本...' : '请输入要解码的Base64字符串...'}
            className="w-full h-60 p-3 border rounded-lg resize-y"
          />
          
          {/* File Upload */}
          <div className="flex gap-4 items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="secondary">上传文件</Button>
            </label>
            
            {/* Encoding Selection */}
            {mode === 'encode' && (
              <div className="flex items-center gap-2">
                <label>字符编码：</label>
                <select
                  value={encoding}
                  onChange={handleEncodingChange}
                  className="p-2 border rounded"
                >
                  {SUPPORTED_ENCODINGS.map(enc => (
                    <option key={enc.value} value={enc.value}>
                      {enc.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Input Stats */}
          <div className="text-sm text-text-secondary">
            输入：{inputStats.chars} 字符 ({inputStats.bytes} 字节)
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={handleConvert} disabled={!input.trim()} size="lg">
            {mode === 'encode' ? '编码为Base64' : '解码Base64'}
          </Button>
          <Button onClick={handleCopy} disabled={!output} variant="secondary" size="lg">
            复制结果
          </Button>
        </div>

        {/* Error Section */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">错误信息：</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Output Section */}
        {output && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {mode === 'encode' ? 'Base64编码结果' : '解码结果'}
              </h2>
            </div>
            
            <div className="p-4 bg-bg-secondary rounded-lg overflow-auto">
              <textarea
                value={output}
                readOnly
                className="w-full h-60 p-3 border rounded-lg resize-y font-mono text-sm"
              />
            </div>
            
            {/* Output Stats */}
            <div className="text-sm text-text-secondary">
              输出：{outputStats.chars} 字符 ({outputStats.bytes} 字节)
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <UsageInstructions
          items={[
            mode === 'encode' 
              ? '在输入框中输入要编码的文本，或上传文件' 
              : '在输入框中输入要解码的Base64字符串，或上传文件',
            mode === 'encode' && '选择适当的字符编码格式（默认UTF-8）',
            '点击"' + (mode === 'encode' ? '编码为Base64' : '解码Base64') + '"按钮执行转换',
            '查看转换结果和统计信息',
            '点击"复制结果"按钮复制转换后的内容'
          ].filter(Boolean) as string[]}
        />
      </div>
    )
  }
  ```

### 3. 组件复用

#### 现有组件复用

##### UsageInstructions组件
- **位置**：`components/shared/UsageInstructions.tsx`
- **用途**：显示工具的使用步骤说明
- **复用原因**：项目规范要求所有工具组件必须使用此组件

##### Button组件
- **位置**：`components/ui/Button.tsx`
- **用途**：用于模式切换、转换、复制和清空按钮
- **复用原因**：保持UI一致性

##### Input组件
- **位置**：`components/ui/Input.tsx`
- **用途**：用于文件上传输入
- **复用原因**：保持UI一致性

#### 工具函数复用

##### copyToClipboard函数
- **位置**：`lib/clipboard-utils.ts`
- **用途**：实现复制转换结果到剪贴板的功能
- **复用原因**：项目规范要求所有剪贴板操作必须使用共享函数

##### trackUsage函数
- **位置**：`lib/tracking.ts`
- **用途**：跟踪工具的使用情况
- **复用原因**：项目规范要求所有工具必须实现使用跟踪

### 4. 工具函数设计

#### Base64Service

- **位置**：`lib/base64-service.ts`
- **功能**：封装Base64编码和解码的核心逻辑
- **API**：
  ```typescript
  /**
   * 将文本编码为Base64格式
   * @param text - 要编码的文本
   * @param encoding - 文本编码格式（默认UTF-8）
   * @returns Base64编码后的字符串
   */
  export function encodeBase64(text: string, encoding: string = 'utf-8'): string;

  /**
   * 将Base64格式解码为文本
   * @param base64 - 要解码的Base64字符串
   * @param encoding - 文本编码格式（默认UTF-8）
   * @returns 解码后的文本
   */
  export function decodeBase64(base64: string, encoding: string = 'utf-8'): string;

  /**
   * 从文件中读取内容并编码为Base64
   * @param file - 要读取的文件
   * @returns Base64编码后的字符串
   */
  export function encodeFileToBase64(file: File): Promise<string>;

  /**
   * 验证Base64字符串格式
   * @param base64 - 要验证的Base64字符串
   * @returns 是否为有效的Base64字符串
   */
  export function isValidBase64(base64: string): boolean;
  ```

## 三、技术实现

### 1. Base64编码实现

使用浏览器内置的btoa()函数结合UTF-8编码处理实现Base64编码。

```typescript
export function encodeBase64(text: string, encoding: string = 'utf-8'): string {
  try {
    // 标准Base64编码，支持UTF-8字符
    return btoa(unescape(encodeURIComponent(text)))
  } catch (err) {
    throw new Error('编码失败：' + (err instanceof Error ? err.message : String(err)))
  }
}
```

### 2. Base64解码实现

使用浏览器内置的atob()函数结合UTF-8解码处理实现Base64解码。

```typescript
export function decodeBase64(base64: string, encoding: string = 'utf-8'): string {
  try {
    // 标准Base64解码，支持UTF-8字符
    return decodeURIComponent(escape(atob(base64)))
  } catch (err) {
    throw new Error('解码失败：' + (err instanceof Error ? err.message : String(err)))
  }
}
```

### 3. 文件处理实现

使用FileReader API读取上传的文件内容，然后进行编码或解码处理。

```typescript
export function encodeFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const content = reader.result as string
        const base64 = encodeBase64(content)
        resolve(base64)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsText(file, 'utf-8')
  })
}
```

### 4. 复制功能实现

使用共享的`copyToClipboard`函数将转换结果复制到剪贴板。

```typescript
const handleCopy = () => {
  if (output) {
    copyToClipboard(output)
    // 显示复制成功提示
  }
}
```

## 四、性能优化

### 1. 输入处理优化

- 使用防抖（debounce）技术减少实时转换的频率
- 仅在用户停止输入一段时间后才进行转换

### 2. 大文件处理

- 对大文件进行分段处理，避免内存溢出
- 显示文件处理进度，提升用户体验

### 3. 错误处理

- 提供详细的错误信息，帮助用户定位问题
- 对常见错误（如格式错误、编码错误）进行特殊处理

## 五、测试计划

### 1. 功能测试

- 测试基本Base64编码功能
- 测试基本Base64解码功能
- 测试文件上传编码功能
- 测试文件上传解码功能
- 测试复制功能

### 2. 边界情况测试

- 测试空输入情况
- 测试格式错误的Base64字符串
- 测试包含特殊字符的文本
- 测试大文件的处理

### 3. 兼容性测试

- 测试在不同浏览器中的兼容性
- 测试在不同设备（桌面端、移动端）的显示效果

## 六、总结

本技术设计文档详细描述了MaxTool 0.2版本中Base64编解码器工具的技术实现方案，包括功能设计、技术选型、组件结构和代码复用等方面。设计严格遵循项目规范，注重代码复用、组件化和性能优化，确保实现高质量、可维护的Base64编解码器工具。