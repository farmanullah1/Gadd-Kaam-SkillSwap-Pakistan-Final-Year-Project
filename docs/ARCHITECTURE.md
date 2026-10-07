# System Architecture Specification

## Overview
**Gadd Kaam – SkillSwap Pakistan** is architected as a modular 3-tier client-server web application utilizing the MERN (MongoDB, Express, React, Node.js) technology stack, augmented with Vite for high-speed client bundling and Tailwind CSS for responsive presentation.

---

## Tier-by-Tier Architecture

### 1. Presentation Tier (Client)
- **Framework:** React 18 SPA.
- **Routing:** React Router v6 managing client-side views (`/`, `/marketplace`, `/women-zone`, `/dashboard`, `/admin`, `/status`, `/quiz`, `/disputes`).
- **State Management:** React Context API and local state hooks managing auth sessions, filter criteria, and modal states.
- **Styling Architecture:** Utility-first Tailwind CSS alongside curated CSS animations, glassmorphism filters, and mobile-adaptive flex/grid containers.

### 2. Application Tier (Server & Business Logic)
- **Runtime & Framework:** Node.js with Express.js REST application.
- **Security & Authorization:**
  - JSON Web Tokens (JWT) for stateless session handling.
  - Role-Based Access Control (`role: 'user' | 'admin' | 'moderator'`).
  - Bcrypt hashing with 10 salt rounds for password security.
- **Middleware Pipeline:**
  - `auth.js`: Validates bearer tokens on protected endpoints.
  - `adminAuth.js`: Enforces administrative privileges for management actions.
  - `upload.js`: Configures Multer storage engines for profile and skill images.

### 3. Data Tier (Persistence)
- **Engine:** MongoDB (Document-based NoSQL persistence).
- **Core Collections:**
  - `users`: Credentials, CNIC hash, profile metadata, badges array.
  - `skilloffers`: Public skill listings, categories, pricing, provider reference.
  - `womenskilloffers`: Curated female-led skill offerings.
  - `requests`: Swap lifecycle records (requester, recipient, status).
  - `reviews`: Star ratings and qualitative feedback between swappers.
  - `badges`: Gamification awards and criteria definitions.
  - `reports`: Moderation complaints and resolution status.
