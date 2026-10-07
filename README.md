# Gadd Kaam – SkillSwap Pakistan

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
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
- Direct messaging between swappers to coordinate schedules, milestones, and session formats.
- Formal swap proposal workflow: `Pending` → `Accepted` → `Completed` → `Reviewed`.

### 5. 🛡️ Trust, Safety & Dispute Mediation Hub
- **Swapper Safety Certification Quiz:** Interactive evaluation validating safe swap practices with instant badge rewards.
- **Dispute Filing Wizard:** Multi-step dispute resolution mechanism with evidence tracking and admin mediation.
- **User Reporting System:** Instant flagging of fraudulent, inappropriate, or non-compliant accounts.

### 6. 🏆 Community Gamification & Leaderboard
- Dynamic 3D winners podium recognizing Pakistan's top-rated contributors and mentors.
- Achievement badges (e.g., *Early Pioneer*, *Top Mentor*, *Verified Pro*, *Safety Certified*).
- Province-by-province filter capsules.

### 7. 🌐 Platform Status Monitor & Success Stories
- Real-time regional latency and ping monitoring across Pakistan's network nodes.
- Interactive community success stories with upvoting and heart counters.

### 8. 🛠️ Administrator Control Center
- Unified moderation suite for reviewing user credentials, approving badges, inspecting reports, and resolving platform disputes.

---

## 🏗️ System Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT TIER                           │
│  React 18 + Vite + Tailwind CSS + Lucide Icons + Axios      │
│  (Modern SPA with Glassmorphic UI & Mobile-First Design)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER TIER                           │
│  Node.js + Express.js RESTful API                           │
│  JWT Authentication + Bcrypt Encryption + Multer Storage    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE TIER                          │
│  MongoDB NoSQL Database (Collections: Users, SkillOffers,   │
│  WomenSkillOffers, SwapRequests, Reviews, Badges, Reports)  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Breakdown

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 | Declarative component hierarchy and reactive state management |
| **Build Tool** | Vite | Lightning-fast HMR and optimized production bundling |
| **Styling & UI** | Tailwind CSS + CSS3 | Custom responsive utility classes, glassmorphism, animations |
| **Icons & Typography** | Lucide React + Inter | Modern accessible iconography and typography |
| **Backend Runtime** | Node.js (v18+) | High-throughput asynchronous server runtime |
| **Web Framework** | Express.js | Robust routing, middleware pipeline, and REST controller endpoints |
| **Database** | MongoDB | Document-oriented NoSQL persistence |
| **Data Modeling** | Mongoose ODM | Schema enforcement, validation hooks, and relationships |
| **Authentication** | JWT & Bcrypt.js | Stateless JSON Web Tokens with salted password hashing |
| **File Storage** | Multer | Multipart/form-data upload management for images and credentials |

---

## 📂 Project Repository Structure

```
Gadd-Kaam-SkillSwap-Pakistan-Final-Year-Project/
├── Gadd Kaam – SkillSwap Pakistan -frontend/    # Client application (React + Vite)
│   ├── public/                                  # Static brand assets and favicons
│   ├── src/                                     # Components, Pages, State, Styles
│   │   ├── components/                          # Navbar, Footer, Cards, Modals, Forms
│   │   ├── pages/                               # Marketplace, WomenZone, Profile, Admin, etc.
│   │   ├── index.css                            # Unified Tailwind CSS & animations
│   │   └── App.jsx                              # Client routing & layout wrapper
│   ├── index.html                               # SPA HTML template
│   ├── vite.config.js                           # Vite build configuration
│   └── package.json                             # Frontend dependencies & scripts
│
├── Gadd Kaam – SkillSwap Pakistan _backend/     # Server application (Node + Express)
│   ├── config/                                  # MongoDB connection & environment keys
│   ├── middleware/                              # Auth, AdminAuth, Multer upload filters
│   ├── models/                                  # Mongoose schemas (User, SkillOffer, etc.)
│   ├── routes/                                  # REST API endpoint route handlers
│   ├── utils/                                   # Helper functions & badge assigners
│   ├── server.js                                # Application bootstrap & server listener
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
```

### 3. Configure Frontend
Open a new terminal window:
```bash
cd "Gadd Kaam – SkillSwap Pakistan -frontend"
npm install
```

Create a `.env` file in `Gadd Kaam – SkillSwap Pakistan -frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
# Application accessible at: http://localhost:5173 (or http://localhost:3000)
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

Every sequential release of this Final Year Project has been preserved and tagged:

| Milestone Tag | Release Description |
| :--- | :--- |
| `v1.1` – `v2.0` | Initial UI architecture, page foundations, registration, and component design system |
| `v2.2` – `v2.9` | Women Zone, review system, helpline, notification feed, and user dashboards |
| `v3.1` – `v3.6` | Express.js & MongoDB backend integration, JWT security, and swap APIs |
| `v3.8` – `v4.4` | Admin dashboard, gamification badges, dispute resolution, and testing suite |
| `v-final` / `final` | **Production Release:** Full-stack integration, Vite migration, presentation & docs |

You can check out and explore any historical milestone directly via Git:
```bash
git checkout v1.1      # Inspect the initial v1.1 prototype
git checkout v3.1      # Inspect early backend integration
git checkout final     # Return to the complete production release
```

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
