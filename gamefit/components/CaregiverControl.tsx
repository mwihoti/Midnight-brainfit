'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

interface CaregiverControlProps {
  patientAddress: string
  onGrantAccess?: (permissions: string[]) => void
}

export function CaregiverControl({ patientAddress, onGrantAccess }: CaregiverControlProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'view_metrics',
    'view_games',
  ])

  const permissions = [
    { id: 'view_metrics', label: 'View Metrics', icon: '📊' },
    { id: 'view_games', label: 'View Games', icon: '🎮' },
    { id: 'adjust_difficulty', label: 'Adjust Difficulty', icon: '⚙️' },
    { id: 'view_schedule', label: 'View Schedule', icon: '📅' },
  ]

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleGrant = () => {
    onGrantAccess?.(selectedPermissions)
  }

  return (
    <div className="w-full max-w-md bg-slate-800 border border-purple-500/20 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-purple-300 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Access Control
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
        >
          {showDetails ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Patient Info */}
      <div className="mb-4 p-3 bg-slate-700/50 rounded">
        <p className="text-xs text-slate-400">Patient Address</p>
        <p className="text-sm text-slate-200 break-all">{patientAddress}</p>
      </div>

      {/* Permissions */}
      {showDetails && (
        <div className="space-y-3 mb-4">
          {permissions.map((perm) => (
            <label
              key={perm.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedPermissions.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">{perm.icon}</span>
              <span className="text-sm text-slate-300">{perm.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleGrant}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors text-sm font-semibold"
        >
          Grant Access
        </button>
        <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-sm font-semibold">
          Revoke Access
        </button>
      </div>
    </div>
  )
}
