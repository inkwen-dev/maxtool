'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { trackUsage } from '@/lib/tracking'
import UsageInstructions from '@/components/shared/UsageInstructions'
import TextImporter from '@/components/shared/TextImporter'

export default function RandomTeam() {
  const [names, setNames] = useState<string[]>([])
  const [teamCount, setTeamCount] = useState(2)
  const [teams, setTeams] = useState<string[][]>([])

  // Import names
  const handleImport = (importedNames: string[]) => {
    setNames(importedNames)
  }

  // Generate random teams
  const generateTeams = () => {
    if (names.length === 0) return

    // Track usage (called on actual use)
    trackUsage('random-team')

    const shuffled = [...names].sort(() => Math.random() - 0.5)
    const newTeams: string[][] = Array.from({ length: teamCount }, () => [])

    shuffled.forEach((name, index) => {
      newTeams[index % teamCount].push(name)
    })

    setTeams(newTeams)
  }

  // Reset
  const reset = () => {
    setNames([])
    setTeams([])
    setTeamCount(2)
  }

  return (
    <div className="space-y-6">
      {/* Import names area */}
      <TextImporter
        onImport={handleImport}
        onReset={reset}
        label="Import Names"
        placeholder="Enter names, one per line..."
        buttonText="Import Names"
        resetButtonText="Reset"
      />

      {/* Team count settings */}
      {names.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Number of Teams: {teamCount}
          </label>
          <input
            type="range"
            min="2"
            max={Math.min(names.length, 10)}
            value={teamCount}
            onChange={(e) => setTeamCount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>2</span>
            <span>{Math.min(names.length, 10)}</span>
          </div>
        </div>
      )}

      {/* Generate button */}
      {names.length > 0 && (
        <div className="text-center">
          <Button onClick={generateTeams} size="lg" className="text-xl px-8 py-4">
            Generate Teams
          </Button>
        </div>
      )}

      {/* Teams display */}
      {teams.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, index) => (
              <div key={index} className="bg-bg-card border-2 border-accent/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-accent mb-3">
                  Team {index + 1} ({team.length})
                </h3>
                <ul className="space-y-2">
                  {team.map((name, nameIndex) => (
                    <li
                      key={nameIndex}
                      className="px-3 py-2 bg-bg-secondary rounded text-sm text-text-primary"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage instructions */}
      <UsageInstructions
        items={[
          'Enter names in the text area, one per line',
          'Click "Import Names" to load the list',
          'Set the number of teams using the slider',
          'Click "Generate Teams" to randomly distribute names',
        ]}
      />
    </div>
  )
}

