# Tracker - Peptide Dosage Management

A modern, educational-style web app for tracking peptide cycles, dosages, and schedules with real-time monitoring.

## Features

- 🔒 **Anonymous Authentication** - Start tracking immediately without signup
- 🔍 **Smart Search** - Real-time peptide search with caching via Peppy API
- 📅 **Cycle Tracking** - Monitor daily/weekly dosages with automatic reminders
- ⏰ **Overdue Indicators** - Visual alerts when doses are missed
- 📊 **Clean UI** - Modern educational design with smooth animations
- 🔄 **Real-time Sync** - Firebase Firestore for instant updates

## Setup

1. **Clone the repository**
```bash
git clone https://github.com/Linkhoge/peptide-tracker.git
cd peptide-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable Anonymous Authentication (Authentication → Sign-in method → Anonymous)
- Create Firestore database (Firestore Database → Create database)
- Copy your config from Project Settings → General → Your apps
- Create `.env` file:
```bash
cp .env.example .env
```
- Fill in your Firebase config values in `.env`

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel
```bash
npm i -g vercel
vercel --prod
```

## Project Structure

```
src/
├── components/
│   ├── HomePage.jsx          # Main stack view
│   ├── PeptideCard.jsx       # Individual peptide display
│   ├── AddPeptideModal.jsx   # Add new peptide form
│   └── SearchAutocomplete.jsx # Peptide search
├── firebase/
│   ├── config.js             # Firebase setup
│   └── auth.js               # Anonymous auth
├── utils/
│   └── searchCache.js        # Search caching logic
└── App.jsx                   # Main app wrapper
```

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Firebase (Auth + Firestore)
- **Icons**: Lucide React
- **Date Utils**: date-fns
- **API**: Peppy HQ Peptide Database

## Data Schema

Firestore collection structure:
```
users/{userId}/peptides/{peptideId}
  - name: string
  - dosage: string
  - frequency: 'daily' | 'weekly'
  - lastTaken: timestamp | null
  - nextDue: timestamp
  - takenCount: number
  - createdAt: timestamp
```

## License

MIT License - Built with ❤️ by Tom Pets