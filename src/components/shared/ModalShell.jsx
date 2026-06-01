import { X } from 'lucide-react'

export function ModalShell({ title, onClose, children, maxWidth = '500px' }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-dark-card border border-dark-border rounded-2xl w-full shadow-glow-lg"
        style={{ maxWidth, maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-5 py-3 flex items-center justify-between backdrop-blur-xl z-10 rounded-t-2xl">
          <h3 className="text-lg font-bold text-gradient">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-dark-hover rounded-lg transition-colors text-gray-400 hover:text-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 56px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
