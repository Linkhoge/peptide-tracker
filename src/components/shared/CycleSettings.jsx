import { ToggleLeft, ToggleRight } from 'lucide-react'

export function CycleSettings({ enabled, onToggle, onDays, offDays, onOnDaysChange, onOffDaysChange }) {
  return (
    <div className="card bg-dark-bg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-100">Cycle Mode</h4>
          <p className="text-xs text-gray-500 mt-0.5">Track on/off cycles</p>
        </div>
        <button type="button" onClick={onToggle} className="transition-colors">
          {enabled
            ? <ToggleRight className="w-9 h-9 text-accent-primary" />
            : <ToggleLeft className="w-9 h-9 text-gray-600" />}
        </button>
      </div>

      {enabled && (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dark-border">
          {[['On (days)', onDays, onOnDaysChange], ['Off (days)', offDays, onOffDaysChange]].map(([label, val, handler]) => (
            <div key={label}>
              <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
              <input
                type="number"
                value={val}
                onChange={(e) => handler(parseInt(e.target.value))}
                min="1"
                className="input text-sm py-1.5"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
