import { X, Syringe, Clock, Calendar, Target, Info } from 'lucide-react'

function PeptideInfoModal({ peptideName, onClose }) {
  const info = require('../data/peptideInfo').getPeptideInfo(peptideName)

  if (!info) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-100">Peptide Info</h3>
              <button onClick={onClose} className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-gray-400">No detailed information available for {peptideName} yet.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4 backdrop-blur-xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gradient">{peptideName}</h3>
              <p className="text-sm text-gray-400 mt-1">{info.fullName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-hover rounded-lg transition-colors text-gray-400 hover:text-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <span className="badge-glow text-sm">{info.category}</span>
            <p className="text-gray-300 mt-3 leading-relaxed">{info.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Syringe className="w-5 h-5 text-accent-primary" />
                <h4 className="font-semibold text-gray-100">Standard Dosage</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <span className="text-gray-300 ml-2 font-medium">{info.dosage.standard}</span>
                </div>
                <div>
                  <span className="text-gray-500">Range:</span>
                  <span className="text-gray-300 ml-2">{info.dosage.range}</span>
                </div>
                <div>
                  <span className="text-gray-500">Timing:</span>
                  <span className="text-gray-300 ml-2">{info.dosage.timing}</span>
                </div>
                <div>
                  <span className="text-gray-500">Route:</span>
                  <span className="text-gray-300 ml-2">{info.dosage.administration}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-accent-secondary" />
                <h4 className="font-semibold text-gray-100">Protocol</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="text-gray-300 ml-2">{info.protocol.duration}</span>
                </div>
                <div>
                  <span className="text-gray-500">Frequency:</span>
                  <span className="text-gray-300 ml-2">{info.protocol.frequency}</span>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <Clock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-xs">Half-life: {info.halfLife}</span>
                </div>
              </div>
            </div>
          </div>

          {info.protocol.notes && (
            <div className="card bg-dark-bg border-accent-primary/20">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-100 mb-1">Important Notes</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{info.protocol.notes}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-glow-purple" />
              <h4 className="font-semibold text-gray-100">Common Uses</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {info.uses.map((use, idx) => (
                <span key={idx} className="badge bg-dark-bg text-gray-300 border border-dark-border">
                  {use}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-dark-border">
            <p className="text-xs text-gray-500">
              <strong>References:</strong> {info.references}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              ⚠️ This information is for educational purposes only. Always consult healthcare professionals before use.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeptideInfoModal