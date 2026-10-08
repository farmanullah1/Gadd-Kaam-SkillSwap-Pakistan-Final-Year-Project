# Gadd Kaam – SkillSwap Pakistan (Frontend)

React frontend for Gadd Kaam / SkillSwap Pakistan, built with React 19, Vite, and Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your backend API base URL:
```env
VITE_API_URL=http://localhost:5000
```
*(Note: If using legacy React environment format, `REACT_APP_API_URL` is also supported as fallback in API helpers).*

### Available Scripts

#### `npm start`
Runs the application in development mode with Vite hot module replacement (HMR).
Open [http://localhost:5173](http://localhost:5173) (or the port output in your terminal).

#### `npm run build`
Bundles the production-ready assets into the `dist` directory.

#### `npm run preview`
Locally previews the production build.
