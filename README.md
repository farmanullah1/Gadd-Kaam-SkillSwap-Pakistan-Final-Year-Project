# Gadd Kaam – SkillSwap Pakistan

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC.svg)](https://tailwindcss.com/)

> **A Comprehensive Full-Stack Skill-Exchange and Collaborative Learning Ecosystem Tailored for Pakistan.**  
> *Final Year Project (Session 2025) – Department of Software Engineering, University of Sindh, Jamshoro.*

---

## 🎓 Academic Project Information

- **Project Title:** Gadd Kaam – SkillSwap Pakistan
- **Project ID:** 2022-SWE-14
- **Academic Session:** Final Year Projects (FYP) – 2025
- **Department:** Department of Software Engineering, Faculty of Engineering and Technology
- **Institution:** University of Sindh, Jamshoro, Sindh, Pakistan
- **Project Developer:**
  - **Farmanullah Ansari** (Roll No: `2k22/SWE/40`) – Full-Stack Development & System Architecture
- **Supervisors:**
  - **Dr. Rahat Ali Khan** (Supervisor)
  - **Engr. Mohsin Jokhio** (Co-Supervisor)

---

## 📌 Executive Summary & Abstract

In contemporary Pakistan, formal vocational education and private tutoring services frequently present prohibitive financial and geographic barriers. Concurrently, thousands of individuals possess rich vocational, technical, linguistic, or artisanal skills that lack a structured medium for equitable barter and collaboration.

**Gadd Kaam (گڏ ڪم – "Working Together")** is a community-driven digital skill-swapping platform designed specifically to address Pakistan's socio-economic landscape. By transforming knowledge exchange into a trusted, accessible network, Gadd Kaam empowers learners and educators to exchange skills directly without monetary constraints. The platform combines CNIC identity verification, safety-first Women Zones, location-filtered discovery across Pakistani districts, automated dispute mediation, real-time messaging, and community gamification.

---

## 🚀 Key Modules & System Features

### 1. 👤 Verified User Profiles & CNIC Security
- Identity confirmation via hashed National Identity Card (CNIC) records.
- Comprehensive user profiles showcasing skills offered, skills desired, ratings, and social proof.
- Profile picture uploads and dynamic verified swapper badge indicators.

### 2. 🛠️ Skill Marketplace & Geo-Discovery
- **Categorized Offerings:** Academics, IT & Software, Arts & Handicrafts, Home Services, Beauty & Fashion, Health & Wellness, and Languages.
- **Provincial & City Filtering:** Target listings in Karachi, Lahore, Islamabad, Hyderabad, Jamshoro, Quetta, Peshawar, and regional districts.
- **Search & Price Models:** Toggle between pure barter swaps and affordable service offerings (PKR).

### 3. 👩 Women Zone (Dedicated Safe Space)
- Specialized ecosystem dedicated to female artisans, home tutors, crafters, and professionals.
- Strict privacy filters and moderated interaction protocols to ensure safety and comfort.

### 4. 💬 Real-Time Messaging & Swap Requests
- Direct messaging between swappers via WebSockets (Socket.io) to coordinate schedules, milestones, and session formats.
- Formal swap proposal workflow: `Pending` → `Accepted` → `Completed` → `Reviewed`.

### 5. 🛡️ Trust, Safety & Dispute Mediation Hub
- **Swapper Safety Certification Quiz:** Interactive evaluation validating safe swap practices with instant badge rewards.
- **Dispute Filing Wizard:** Multi-step dispute resolution mechanism with evidence tracking and admin mediation.
- **User Reporting System:** Instant flagging of fraudulent, inappropriate, or non-compliant accounts.

### 6. 🌐 Multilingual & Regional Language Support (i18n)
- **Tri-lingual Ecosystem:** Seamless real-time switching between **English (EN)**, **Urdu (اردو)**, and **Sindhi (سنڌي)**.
- **Native RTL Layout Engine:** Automatic Right-To-Left direction toggle (`dir="rtl"`) with dedicated Pakistani typography (`Noto Nastaliq Urdu` & `Noto Sans Arabic`).
- **Persistent Preferences:** LocalStorage-backed language memory across page reloads and sessions.
- **Dual Selector:** Accessible language switchers on both desktop header and mobile drawer navigation.

### 7. 🔒 Enterprise Security & Resilience
- **Helmet HTTP Security Headers:** Strict MIME type protection, clickjacking defense, and XSS filtering.
- **Rate Limiting:** Granular rate limiting on API and authentication routes (`/api/auth/login`, `/api/auth/register`) to stop brute-force attacks.
- **Dual-Header JWT Authentication:** Supports standard `Authorization: Bearer <token>` and `x-auth-token` headers.
- **React ErrorBoundary:** Isolated component error catching with graceful fallback and one-click recovery.
- **Automated Session Cleanup:** Automatic 401 response interceptor clearing stale credentials and routing to login.

### 8. 🏆 Community Gamification & Leaderboard
- Dynamic 3D winners podium recognizing Pakistan's top-rated contributors and mentors.
- Achievement badges (e.g., *Early Pioneer*, *Top Mentor*, *Verified Pro*, *Safety Certified*).

### 9. 🌐 Platform Status Monitor & Health API
- Live backend health monitoring (`GET /api/health`) reporting server uptime and live MongoDB connectivity state.
- Real-time regional latency and ping monitoring across Pakistan's network nodes.

### 10. 🛠️ Administrator Control Center
- Unified moderation suite for reviewing user credentials, approving badges, inspecting reports, and resolving platform disputes.

---

## 🏗️ System Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT TIER                           │
│  React 19 + Vite + Tailwind CSS + Lucide Icons + Axios      │
│  (Modern SPA, JSX Architecture, Multilingual RTL & Dark Mode) │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST / JSON / WebSocket
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER TIER                           │
│  Node.js + Express.js REST API + Socket.io                  │
│  Helmet + Rate Limiting + JWT Auth + Bcrypt + Multer        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE TIER                          │
│  MongoDB NoSQL Database (Users, SkillOffers, SwapRequests,   │
│  Reviews, Badges, Reports, Notifications, Chats)            │
└─────────────────────────────────────────────────────────────┘
```

### Technology Breakdown

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 | Declarative component hierarchy and reactive state management |
| **Build Tool** | Vite | Lightning-fast HMR and optimized production bundling |
| **Components** | Native JSX (`.jsx`) | Component-scoped architecture across 56 view and layout modules |
| **Internationalization** | i18next + RTL | English, Urdu, and Sindhi with automated direction & calligraphy fonts |
| **Styling & UI** | Tailwind CSS + CSS3 | Custom responsive utility classes, glassmorphism, animations |
| **Icons & Typography** | Lucide React + Noto Fonts | Accessible iconography with Inter, Noto Nastaliq Urdu, and Noto Sans Arabic |
| **Backend Runtime** | Node.js (v18+) | High-throughput asynchronous server runtime |
| **Web Framework** | Express.js | Routing, rate limiting, and REST controller endpoints |
| **Security Suite** | Helmet + RateLimit | HTTP security headers and brute-force mitigation |
| **Real-Time Layer** | Socket.io | Bi-directional WebSocket communication for live messaging and alerts |
| **Database** | MongoDB | Document-oriented NoSQL persistence |
| **Data Modeling** | Mongoose ODM | Schema enforcement, validation hooks, and relationships |
| **Authentication** | JWT & Bcrypt.js | Stateless JSON Web Tokens with salted password hashing |
| **File Storage** | Multer | Multipart/form-data upload management for images |

---

## 📂 Project Repository Structure

```
Gadd-Kaam-SkillSwap-Pakistan-Final-Year-Project/
├── Gadd Kaam – SkillSwap Pakistan -frontend/    # Client application (React 19 + Vite)
│   ├── public/                                  # Static brand assets and favicons
│   ├── src/                                     # Components, Pages, State, Styles
│   │   ├── components/                          # Navbar, Footer, ProtectedRoute, ErrorBoundary
│   │   ├── pages/                               # Marketplace, WomenZone, Profile, Admin, etc.
│   │   ├── services/                            # Centralized Axios API client (api.js)
│   │   ├── hooks/                               # useAuth, useScrollReveal
│   │   ├── i18n.js                              # Tri-lingual (EN, UR, SD) translation engine
│   │   ├── index.css                            # Unified Tailwind CSS & RTL typography
│   │   ├── App.jsx                              # Client routing & layout wrapper
│   │   └── index.jsx                            # Application entry point with ErrorBoundary
│   ├── index.html                               # SPA HTML template
│   ├── vite.config.js                           # Streamlined Vite build configuration
│   └── package.json                             # Frontend dependencies & scripts
│
├── Gadd Kaam – SkillSwap Pakistan _backend/     # Server application (Node + Express)
│   ├── config/                                  # MongoDB connection & environment keys
│   ├── middleware/                              # Auth (Dual Header), AdminAuth, Upload, etc.
│   ├── models/                                  # Mongoose schemas (User, SkillOffer, etc.)
│   ├── routes/                                  # REST API endpoint route handlers
│   ├── utils/                                   # Helper functions & badge assigners
│   ├── server.js                                # Application bootstrap, Helmet, RateLimit, Socket.io
│   ├── db_check.js                              # Database diagnostic script
│   ├── api_integration_test.js                  # Integration test suite
│   ├── makeAdmin.js                             # Admin role promotion script
│   └── package.json                             # Backend dependencies & scripts
│
├── docs/                                        # Final Year Project Documentation
│   ├── SWE FYP Final Presentation ID 14 Gadd kamm.pptx # Official Final Presentation Slides
│   ├── ARCHITECTURE.md                          # Detailed architectural specification
│   ├── API_DOCUMENTATION.md                     # Comprehensive REST API specifications
│   └── TESTING_REPORT.md                        # Testing suite & verification logs
│
├── .gitignore                                   # Global production ignore rules
├── CHANGELOG.md                                 # Full release history from v1.1 to Final
├── CONTRIBUTING.md                              # Development & contribution guidelines
├── LICENSE                                      # MIT License
└── README.md                                    # Master project documentation
```

---

## ⚡ Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Version `18.x` or `20.x` recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/farmanullah1/Gadd-Kaam-SkillSwap-Pakistan-Final-Year-Project.git
cd Gadd-Kaam-SkillSwap-Pakistan-Final-Year-Project
```

### 2. Configure Backend
```bash
cd "Gadd Kaam – SkillSwap Pakistan _backend"
npm install
```

Create a `.env` file in `Gadd Kaam – SkillSwap Pakistan _backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap_pakistan
JWT_SECRET=super_secret_jwt_key_pakistan_2025
NODE_ENV=development
```

Start the backend service:
```bash
npm run dev
# Server runs on: http://localhost:5000
# Health check available at: http://localhost:5000/api/health
```

### 3. Configure Frontend
Open a new terminal window:
```bash
cd "Gadd Kaam – SkillSwap Pakistan -frontend"
npm install
```

Create a `.env` file in `Gadd Kaam – SkillSwap Pakistan -frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
# Application accessible at: http://localhost:5173
```

---

## 🧪 Testing & Verification

Comprehensive testing scripts are provided in the backend directory:
```bash
cd "Gadd Kaam – SkillSwap Pakistan _backend"

# Test MongoDB connectivity:
node db_check.js

# Run integration tests against endpoints:
node api_integration_test.js

# Seed initial badges & gamification data:
node seedBadges.js
```

Full testing logs and results are documented in [`docs/TESTING_REPORT.md`](docs/TESTING_REPORT.md).

---

## 📜 Version History & Git Milestones

Every sequential release of this Final Year Project has been preserved:

| Milestone | Release Description |
| :--- | :--- |
| `v1.1` – `v2.0` | Initial UI architecture, page foundations, registration, and component design system |
| `v2.2` – `v2.9` | Women Zone, review system, helpline, notification feed, and user dashboards |
| `v3.1` – `v3.6` | Express.js & MongoDB backend integration, JWT security, and swap APIs |
| `v3.8` – `v4.4` | Admin dashboard, gamification badges, dispute resolution, and testing suite |
| `v-final` / `final` | **Production Release:** Full-stack integration, Vite migration, presentation & docs |
| `Latest Updates` | **Security & i18n Hardening:** Helmet headers, rate limiting, React 19 `.jsx` migration, centralized API service, ErrorBoundary, and full English / Urdu / Sindhi RTL support |

---

## 🤝 Acknowledgements

We express our sincere gratitude to:
- **Dr. Rahat Ali Khan** (Supervisor) and **Engr. Mohsin Jokhio** (Co-Supervisor) for their invaluable mentorship, guidance, and continuous encouragement throughout the development of this Final Year Project.
- The faculty and staff of the **Department of Software Engineering, University of Sindh, Jamshoro** for their academic support.
- Our families and peers who assisted with user acceptance testing and feedback.

---

## 📄 License

This project is licensed under the terms of the [MIT License](LICENSE).  
Copyright © 2025 Farmanullah Ansari.
