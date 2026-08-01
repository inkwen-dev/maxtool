# Hooks 功能说明

**目录：** `hooks/`  
**用途：** 自定义 React Hooks，封装可复用的逻辑

---

## 📁 文件列表

### 1. `useTimer.ts` - 计时器 Hook

**功能：** 封装倒计时和秒表的通用逻辑

**支持的模式：**
- ✅ **倒计时（Countdown）**：从指定时间倒数到 0
- ✅ **秒表（Stopwatch）**：从 0 开始计时

**主要功能：**
- 开始计时
- 暂停/恢复
- 重置
- 手动设置时间
- 完成回调（倒计时到 0 时触发）
- 每次 tick 回调

**使用场景：**
- CountdownTimer（倒计时器）
- Stopwatch（秒表）
- PomodoroTimer（番茄钟）

**API：**
```typescript
const {
  time,        // 当前时间（秒表：毫秒，倒计时：秒）
  isRunning,   // 是否运行中
  start,       // 开始
  pause,       // 暂停
  resume,      // 恢复
  toggle,      // 切换暂停/恢复
  reset,       // 重置
  setTime,     // 手动设置时间
} = useTimer({
  initialTime: 60,           // 初始时间
  type: 'countdown',         // 'countdown' | 'stopwatch'
  interval: 1000,            // 更新间隔（毫秒）
  onFinish: () => {},        // 完成回调（倒计时）
  onTick: (time) => {},      // 每次 tick 回调
})
```

**特点：**
- ✅ 自动清理 interval，防止内存泄漏
- ✅ 支持函数式更新
- ✅ 类型安全（TypeScript）
- ✅ 灵活的配置选项

---

### 2. `useLocalStorage.ts` - 本地存储 Hook

**功能：** 将 React 状态与 localStorage 同步

**主要功能：**
- 自动从 localStorage 读取初始值
- 状态变化时自动保存到 localStorage
- 支持函数式更新（与 useState 相同的 API）
- 错误处理（SSR 安全）

**使用场景：**
- Counter（计数器）- 保存计数值
- Scoreboard（记分板）- 保存队伍和分数
- DrawLots（抽签）- 保存名字列表和获奖者

**API：**
```typescript
const [value, setValue] = useLocalStorage<string[]>('my-key', [])

// 使用方式与 useState 完全相同
setValue(['item1', 'item2'])
setValue(prev => [...prev, 'newItem'])
```

**当前使用位置：**
- `components/tools/Counter.tsx` - 保存计数值
- `components/tools/Scoreboard.tsx` - 保存队伍和分数
- `components/tools/DrawLots.tsx` - 保存名字列表和获奖者

**特点：**
- ✅ SSR 安全（服务端渲染时返回初始值）
- ✅ 自动同步（状态变化时自动保存）
- ✅ 错误处理（localStorage 不可用时优雅降级）
- ✅ 类型安全（支持泛型）

---

## 🎯 设计目的

### 代码复用
- **useTimer**：避免在多个计时器组件中重复实现相同的逻辑
- **useLocalStorage**：统一 localStorage 的使用方式，避免重复代码

### 逻辑封装
- 将复杂的逻辑封装在 Hook 中，组件代码更简洁
- 便于测试和维护

### 一致性
- 所有使用计时器的组件都使用相同的逻辑，行为一致
- 所有使用 localStorage 的组件都使用相同的同步机制

---

## 📊 使用统计

### useTimer
- **设计用途：** CountdownTimer, Stopwatch, PomodoroTimer
- **实际使用：** 目前 CountdownTimer 和 Stopwatch 还没有使用（它们有自己的实现）
- **建议：** 可以重构这些组件来使用 useTimer，减少代码重复

### useLocalStorage
- **实际使用：** 3 个组件
  - Counter
  - Scoreboard
  - DrawLots

---

## 🔄 潜在改进

### 1. CountdownTimer 和 Stopwatch 可以使用 useTimer

**当前状态：**
- CountdownTimer 有自己的计时逻辑
- Stopwatch 有自己的计时逻辑
- PomodoroTimer 有自己的计时逻辑

**改进建议：**
- 重构这些组件使用 `useTimer` hook
- 减少代码重复
- 统一计时逻辑

### 2. 其他工具也可以使用 useLocalStorage

**潜在使用场景：**
- RandomList - 保存列表
- RandomTeam - 保存名字列表
- Roulette - 保存选项列表

---

## 📝 总结

**hooks/ 目录的作用：**
1. **封装可复用逻辑** - 避免代码重复
2. **提供统一 API** - 确保行为一致
3. **简化组件代码** - 让组件更专注于 UI
4. **便于测试** - 逻辑与 UI 分离

**当前状态：**
- ✅ `useLocalStorage` 已被 3 个组件使用
- ⚠️ `useTimer` 已创建但尚未被使用（组件有自己的实现）
- 💡 建议：重构计时器组件使用 `useTimer` 以减少代码重复

