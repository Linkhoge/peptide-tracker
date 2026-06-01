const OPTIONS = ['daily', 'weekly']

export function FrequencyToggle({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">Frequency</label>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border capitalize ${
              value === opt
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white border-transparent shadow-glow-sm'
                : 'bg-dark-bg text-gray-400 border-dark-border hover:border-accent-primary/50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
