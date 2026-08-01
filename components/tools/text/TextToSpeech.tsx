'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'

export default function TextToSpeech() {
  const [text, setText] = useState('Hello, this is a text to speech example.')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Speak
  const speak = () => {
    setErrorMessage(null)
    
    if (!isSupported) {
      setErrorMessage('Text to speech is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (!text.trim()) {
      setErrorMessage('Please enter some text to speak.')
      return
    }

    // Track usage (called on actual use)
    trackUsage('text-to-speech')

    // Stop previous speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  // Stop
  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="space-y-6">
      {!isSupported && (
        <div className="bg-warning-bg border border-warning rounded-lg p-4">
          <p className="text-warning-text text-sm">
            ⚠️ Text to speech is not supported in your browser. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="bg-error-bg border border-error rounded-lg p-4">
          <p className="text-error-text text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Input area */}
      <div>
        <Input
          label="Enter Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type the text you want to hear..."
        />
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Speed: {rate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Pitch: {pitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={speak}
          disabled={!isSupported || isSpeaking || !text.trim()}
          size="lg"
        >
          {isSpeaking ? 'Speaking...' : '🔊 Speak'}
        </Button>
        <Button
          onClick={stop}
          disabled={!isSpeaking}
          size="lg"
          variant="outline"
        >
          Stop
        </Button>
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Enter the text you want to hear',
          'Adjust speed, pitch, and volume',
          'Click "Speak" to hear the text',
          'Click "Stop" to stop the speech',
        ]}
      />
    </div>
  )
}

