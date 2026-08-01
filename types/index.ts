// Tool type definitions
export type ToolName =
  | 'draw-lots'
  | 'random-number'
  | 'flip-coin'
  | 'roll-dice'
  | 'roulette'
  | 'digital-clock'
  | 'countdown-timer'
  | 'stopwatch'
  | 'counter'
  | 'scoreboard'
  | 'random-team'
  | 'random-list'
  | 'pomodoro'
  | 'analog-clock'
  | 'font-generator'
  | 'instagram-fonts'
  | 'text-to-speech'
  | 'symbol'
  | 'emoji-list'
  | 'percentage'

// Tool categories
export type ToolCategory = 'Random' | 'Time' | 'Text' | 'Utilities'

// Tool information interface
export interface Tool {
  id: ToolName
  name: string
  description: string
  category: ToolCategory
  icon: string
  path: string
  tags: string[]
}

