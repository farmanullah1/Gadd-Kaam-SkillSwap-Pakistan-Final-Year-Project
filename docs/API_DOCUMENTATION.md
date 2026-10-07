# REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate credentials and receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user's profile | Private (Token) |
| `PUT` | `/api/auth/profile` | Update profile information | Private (Token) |

---

## 2. Skill Offerings Endpoints (`/api/skills`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | List all skill offerings with category/location filters | Public |
| `GET` | `/api/skills/:id` | Retrieve single skill offering details | Public |
| `POST` | `/api/skills` | Create a new skill listing (with image upload) | Private (Token) |
| `PUT` | `/api/skills/:id` | Update an existing skill listing | Private (Owner) |
| `DELETE` | `/api/skills/:id` | Remove a skill listing | Private (Owner/Admin) |

---

## 3. Swap Requests (`/api/requests`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/requests` | Send a new skill swap request | Private (Token) |
| `GET` | `/api/requests/my-requests` | View all incoming and outgoing swap requests | Private (Token) |
| `PATCH` | `/api/requests/:id/status` | Update swap request status (`accepted`, `rejected`, `completed`) | Private (Recipient) |

---

## 4. Admin & Moderation (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | List all platform users with role filters | Admin Only |
| `PATCH` | `/api/admin/users/:id/role` | Promote or demote user roles | Admin Only |
| `GET` | `/api/admin/reports` | Retrieve user dispute and violation reports | Admin Only |
| `PATCH` | `/api/admin/reports/:id` | Resolve or dismiss reports | Admin Only |
