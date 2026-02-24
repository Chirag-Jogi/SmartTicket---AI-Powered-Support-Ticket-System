# 🎫 SmartTicket - AI-Powered Support Ticket Management System

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An intelligent support ticket management system with **AI-powered automatic categorization** using Google Gemini API. Built with Django REST Framework, React, PostgreSQL, and Docker.

---

## ✨ Features at a Glance

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/homepage.png" alt="Dashboard">
      <p align="center"><b>📊 Stats Dashboard</b></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/ai-suggestion.png" alt="AI Classification">
      <p align="center"><b>🤖 AI-Powered Classification</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/ticket-list.png" alt="Ticket List">
      <p align="center"><b>🔍 Advanced Filtering</b></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/stats-dashboard.png" alt="Analytics">
      <p align="center"><b>📈 Real-Time Analytics</b></p>
    </td>
  </tr>
</table>

---

## 🚀 Key Features

- 🤖 **AI-Powered Ticket Classification** - Automatic categorization and priority assignment using Google Gemini 1.5 Flash
- 📊 **Real-Time Analytics Dashboard** - Live statistics with priority and category breakdowns
- 🔍 **Advanced Filtering & Search** - Multi-parameter filtering with full-text search
- ⚡ **Database-Level Aggregation** - High-performance stats using Django ORM
- 🐳 **One-Command Deployment** - Fully containerized with Docker Compose
- ✅ **Smart Validation** - User can accept or override AI suggestions
- 🔄 **Status Management** - Track tickets from open to resolved
- 🎯 **RESTful API** - Clean, well-documented API endpoints

---

## 🏗️ Tech Stack

**Backend:**
- Django 5.0 + Django REST Framework
- PostgreSQL 15
- Google Gemini 1.5 Flash API
- Python 3.11

**Frontend:**
- React 18
- Axios for API communication
- Responsive design

**Infrastructure:**
- Docker + Docker Compose
- Automated database migrations
- Health checks & dependency management

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Docker Desktop** installed and running ([Download here](https://www.docker.com/products/docker-desktop))
- **Google Gemini API Key** ([Get free key](https://ai.google.dev/))
- **Git** (for cloning the repository)

---

## 🚀 Quick Start

### Step 1: Clone the Repository
```bash
git clone https://github.com/Chirag-Jogi/SmartTicket---AI-Powered-Support-Ticket-System.git
cd SmartTicket
```

### Step 2: Configure Environment Variables

**Create `.env` file from template:**
```bash
# On Linux/Mac:
cp .env.example .env

# On Windows:
copy .env.example .env
```

**Get your free Gemini API key:**

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Click **"Get API Key"**
3. Sign in with your Google account
4. Click **"Create API Key"**
5. Copy the key (starts with `AIzaSy...`)

**Edit `.env` file and add your API key:**
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Replace `AIzaSyXXX...` with your actual key.

### Step 3: Start the Application
```bash
docker-compose up --build
```

**First run takes 5-10 minutes** (downloading images and building)

**Subsequent runs take ~20 seconds**

**Wait for these messages:**
```
✅ smartticket_db       | database system is ready to accept connections
✅ smartticket_backend  | Starting development server at http://0.0.0.0:8000/
✅ smartticket_frontend | Compiled successfully!
```

### Step 4: Access the Application

Open your browser and navigate to:

- 🌐 **Frontend Application:** http://localhost:3000
- 📡 **Backend API:** http://localhost:8000/api/tickets/
- 🔧 **Django Admin Panel:** http://localhost:8000/admin

### Step 5: Create Admin User (Optional)

To access the Django admin panel:
```bash
docker exec -it smartticket_backend python manage.py createsuperuser
```

Follow the prompts to create username, email, and password.

Then login at: http://localhost:8000/admin

---

## 📚 API Documentation

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tickets/` | Create a new ticket |
| `GET` | `/api/tickets/` | List all tickets (with filters) |
| `PATCH` | `/api/tickets/<id>/` | Update ticket |
| `GET` | `/api/tickets/stats/` | Get statistics |
| `POST` | `/api/tickets/classify/` | AI classification |

### Query Parameters (GET /api/tickets/)

Combine multiple filters in a single request:
```bash
# Filter by category
GET /api/tickets/?category=billing

# Filter by priority
GET /api/tickets/?priority=high

# Filter by status
GET /api/tickets/?status=open

# Search in title and description
GET /api/tickets/?search=password

# Combine filters
GET /api/tickets/?category=technical&priority=high&search=crash
```

**Available Filter Values:**

- **Category:** `billing`, `technical`, `account`, `general`
- **Priority:** `low`, `medium`, `high`, `critical`
- **Status:** `open`, `in_progress`, `resolved`, `closed`

### Example API Usage

**Create a Ticket:**
```bash
curl -X POST http://localhost:8000/api/tickets/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Payment issue",
    "description": "I was charged twice for my subscription",
    "category": "billing",
    "priority": "high"
  }'
```

**Get AI Classification:**
```bash
curl -X POST http://localhost:8000/api/tickets/classify/ \
  -H "Content-Type: application/json" \
  -d '{
    "description": "My app crashes every time I open it"
  }'
```

**Response:**
```json
{
  "suggested_category": "technical",
  "suggested_priority": "high"
}
```

---

## 🏛️ Architecture

### Database Schema
```sql
CREATE TABLE tickets_ticket (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Constraints:**
- Category: `billing`, `technical`, `account`, `general`
- Priority: `low`, `medium`, `high`, `critical`
- Status: `open`, `in_progress`, `resolved`, `closed`

---

## 🎯 Design Decisions

### Why Google Gemini?

- ✅ **Free Tier:** 1,500 requests/day at no cost
- ✅ **Fast Response:** 1-2 second classification time
- ✅ **High Accuracy:** 90%+ correct categorization
- ✅ **No Credit Card:** Start immediately without payment

### Why Database-Level Aggregation?

Uses Django ORM's `aggregate()` and `annotate()` instead of Python loops for 10-100x better performance on large datasets.

### Why Docker?

- ✅ One-command setup
- ✅ Consistent environment across machines
- ✅ Production-ready deployment
- ✅ Easy CI/CD integration

---

## 🛠️ Development

### Run Without Docker (Local Development)

**Backend Setup:**
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm start
```

---

## 🚫 Stopping the Application

**Stop containers (keeps data):**
```bash
docker-compose down
```

**Stop and remove all data:**
```bash
docker-compose down -v
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

### Docker Build Fails
```bash
docker system prune -a --volumes
docker-compose up --build
```

### AI Classification Not Working

1. Check if `GEMINI_API_KEY` is set in `.env`
2. Verify key is valid at https://ai.google.dev/
3. Check backend logs: `docker logs smartticket_backend`

---

## 📁 Project Structure
```
SmartTicket/
├── backend/                    # Django settings
├── tickets/                    # Main app
│   ├── models.py              # Ticket model
│   ├── views.py               # API views
│   ├── serializers.py         # DRF serializers
│   └── llm_service.py         # Gemini integration
├── frontend/                   # React app
│   └── src/
│       ├── App.js
│       ├── TicketForm.js
│       ├── TicketList.js
│       └── Stats.js
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── requirements.txt
└── README.md
```

## 👤 Author

**Chirag Jogi**

- GitHub: https://github.com/Chirag-Jogi
- LinkedIn: https://www.linkedin.com/in/chiragjogi27/

---

