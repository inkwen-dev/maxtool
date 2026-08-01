import { ToolName } from '@/types'

// Validate tool name
export const validateToolName = (tool: string): boolean => {
  const validTools: ToolName[] = [
    'draw-lots',
    'random-number',
    'flip-coin',
    'roll-dice',
    'roulette',
    'digital-clock',
    'countdown-timer',
    'stopwatch',
    'counter',
    'scoreboard',
    'random-team',
    'random-list',
    'pomodoro',
    'analog-clock',
    'font-generator',
    'instagram-fonts',
    'text-to-speech',
    'symbol',
    'emoji-list',
    'percentage'
  ]
  
  return validTools.includes(tool as ToolName)
}

