/**
 * Tool component mapping
 * Maps tool IDs to their component import paths
 */

import { ComponentType } from 'react'

// Component import functions - lazy loading
export const toolComponentMap: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  // Random tools
  'draw-lots': () => import('@/components/tools/random/DrawLots'),
  'random-number': () => import('@/components/tools/random/RandomNumber'),
  'flip-coin': () => import('@/components/tools/random/FlipCoin'),
  'roll-dice': () => import('@/components/tools/random/RollDice'),
  'roulette': () => import('@/components/tools/random/Roulette'),
  'random-team': () => import('@/components/tools/random/RandomTeam'),
  'random-list': () => import('@/components/tools/random/RandomList'),

  // Time tools
  'digital-clock': () => import('@/components/tools/time/DigitalClock'),
  'countdown-timer': () => import('@/components/tools/time/CountdownTimer'),
  'stopwatch': () => import('@/components/tools/time/Stopwatch'),
  'pomodoro': () => import('@/components/tools/time/PomodoroTimer'),
  'analog-clock': () => import('@/components/tools/time/AnalogClock'),

  // Text tools
  'font-generator': () => import('@/components/tools/text/FontGenerator'),
  'instagram-fonts': () => import('@/components/tools/text/InstagramFonts'),
  'text-to-speech': () => import('@/components/tools/text/TextToSpeech'),

  // Utilities
  'counter': () => import('@/components/tools/utilities/Counter'),
  'scoreboard': () => import('@/components/tools/utilities/Scoreboard'),
  'symbol': () => import('@/components/tools/utilities/Symbol'),
  'emoji-list': () => import('@/components/tools/utilities/EmojiList'),
  'percentage': () => import('@/components/tools/utilities/PercentageCalculator'),
}

/**
 * Get tool component by tool ID
 * @param toolId - Tool ID
 * @returns Component or null if not found
 */
export async function getToolComponent(toolId: string): Promise<ComponentType<any> | null> {
  const loader = toolComponentMap[toolId]
  if (!loader) {
    console.warn(`Component loader not found for tool: ${toolId}`)
    return null
  }

  try {
    const module = await loader()
    return module.default
  } catch (error) {
    console.error(`Failed to load component for tool: ${toolId}`, error)
    return null
  }
}

