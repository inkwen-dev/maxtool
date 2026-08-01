'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { trackUsage } from '@/lib/tracking'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import UsageInstructions from '@/components/shared/UsageInstructions'

interface Team {
  name: string
  score: number
}

export default function Scoreboard() {
  const [teams, setTeams] = useLocalStorage<Team[]>('scoreboard-teams', [
    { name: 'Team 1', score: 0 },
    { name: 'Team 2', score: 0 },
  ])
  const [newTeamName, setNewTeamName] = useState('')

  // Add team
  const addTeam = () => {
    if (newTeamName.trim()) {
      setTeams([...teams, { name: newTeamName.trim(), score: 0 }])
      setNewTeamName('')
    }
  }

  // Remove team
  const removeTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index))
  }

  // Update score
  const updateScore = (index: number, delta: number) => {
    // Track usage (called on actual use, only track on first use)
    if (teams.every(t => t.score === 0) && delta > 0) {
      trackUsage('scoreboard')
    }
    const newTeams = [...teams]
    newTeams[index].score = Math.max(0, newTeams[index].score + delta)
    setTeams(newTeams)
  }

  // Reset all scores
  const resetScores = () => {
    setTeams(teams.map(team => ({ ...team, score: 0 })))
  }

  // Reset all
  const resetAll = () => {
    setTeams([
      { name: 'Team 1', score: 0 },
      { name: 'Team 2', score: 0 },
    ])
  }

  // Rename team
  const renameTeam = (index: number, newName: string) => {
    const newTeams = [...teams]
    newTeams[index].name = newName
    setTeams(newTeams)
  }

  return (
    <div className="space-y-6">
      {/* Add team */}
      <div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Team name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTeam()}
            className="flex-1"
          />
          <Button onClick={addTeam} disabled={!newTeamName.trim()}>
            Add Team
          </Button>
        </div>
      </div>

      {/* Teams list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team, index) => (
          <div key={index} className="bg-bg-card border-2 border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={team.name}
                onChange={(e) => renameTeam(index, e.target.value)}
                className="text-xl font-bold bg-transparent border-b-2 border-transparent hover:border-border focus:border-accent focus:outline-none text-text-primary"
              />
              {teams.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeTeam(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-4">
                {team.score}
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => updateScore(index, -1)}
                  variant="secondary"
                >
                  -1
                </Button>
                <Button
                  onClick={() => updateScore(index, -5)}
                  variant="secondary"
                >
                  -5
                </Button>
                <Button
                  onClick={() => updateScore(index, 1)}
                >
                  +1
                </Button>
                <Button
                  onClick={() => updateScore(index, 5)}
                >
                  +5
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={resetScores} variant="outline">
          Reset Scores
        </Button>
        <Button onClick={resetAll} variant="outline">
          Reset All
        </Button>
      </div>

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Add teams using the input field',
          'Click +/- buttons to adjust scores',
          'Click on team names to rename them',
          'Remove teams if needed',
          'Scores are automatically saved',
        ]}
      />
    </div>
  )
}

