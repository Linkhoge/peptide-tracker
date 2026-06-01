import { Check } from 'lucide-react'

export function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-2.5"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <Check className="w-4 h-4" />
          <span className="text-sm">{label}</span>
        </>
      )}
    </button>
  )
}
