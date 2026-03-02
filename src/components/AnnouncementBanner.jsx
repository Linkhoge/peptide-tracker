import { Megaphone } from 'lucide-react'

function AnnouncementBanner() {
  const announcements = [
    'Track your peptide cycles with precision',
    'Configure custom on/off cycle durations',
    'View comprehensive dosing information',
    'Monitor adherence and timing',
    'Private mode - Your data stays secure'
  ]

  return (
    <div className="bg-dark-card/50 border-b border-dark-border overflow-hidden">
      <div className="flex items-center gap-4 py-2 px-4">
        <div className="flex items-center gap-2 text-accent-primary shrink-0">
          <Megaphone className="w-4 h-4" />
          <span className="text-sm font-semibold">UPDATES:</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-scroll-left whitespace-nowrap">
            <span className="text-sm text-gray-400">
              {announcements.map((msg, idx) => (
                <span key={idx} className="mx-8">
                  {msg}
                  <span className="text-accent-primary mx-2">•</span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBanner