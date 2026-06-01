const UNITS = ['mcg', 'mg', 'g', 'IU', 'units']

export function DosageInput({ amount, unit, onAmountChange, onUnitChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">Dosage</label>
      <div className="relative">
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="250"
          className="input pr-24 text-sm py-2.5"
          required
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-dark-hover border border-dark-border rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:border-accent-primary focus:outline-none"
        >
          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
    </div>
  )
}
