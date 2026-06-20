# 🌊 JalRakshak - Real-Time Survey & Monitoring of Water Bodies in Delhi

## Smart India Hackathon (SIH) 2024 - Problem Statement ID: 1619

A centralized digital platform that enables government officials to monitor, survey, analyze, and manage water bodies across Delhi in real time.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Python 3.9+ (for AI module)
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd jalRakshak

# Install all dependencies
npm run install:all

# Or install individually:
cd frontend && npm install
cd ../backend && npm install
cd ../ai-module && pip install -r requirements.txt
```

### Environment Setup

```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and other credentials

# Frontend environment
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your API URLs

# AI Module environment (optional)
cd ../ai-module
cp .env.example .env
```

### Database Seeding

```bash
cd backend
node scripts/seed.js
node scipts/seedWQ.js
node scripts/seedAlert.js
```

This will create:
- 1 Admin user
- 2 Field officers
- 1 Government official
- Sample water bodies in Delhi

### Run Development Servers

```bash
# From root directory - run all services
npm run dev

# Or run individually:
cd frontend && npm run dev          # Next.js on http://localhost:3000
cd backend && npm run dev          # Express on http://localhost:5000
cd ai-module && uvicorn main:app --reload --host 0.0.0.0 --port 8000  # FastAPI on http://localhost:8000
```

---

## 📁 Project Structure

```
jalrakshak/
├── frontend/                 # Next.js 15 frontend (JavaScript)
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   ├── map/         # GIS map page
│   │   │   ├── alerts/      # Alerts management
│   │   │   └── login/       # Authentication
│   │   ├── components/      # Reusable components
│   │   │   └── ui/          # UI components (Button, Card, Input)
│   │   ├── lib/             # Utilities (axios, utils)
│   │   ├── store/           # Zustand state management
│   │   └── types/           # Type definitions (reference)
│   ├── package.json
│   └── jsconfig.json
├── backend/                  # Express.js backend API (JavaScript)
│   ├── config/              # Database configuration
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── WaterBody.js
│   │   ├── Survey.js
│   │   ├── WaterQuality.js
│   │   ├── Alert.js
│   │   └── CitizenReport.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── waterBodies.js
│   │   ├── surveys.js
│   │   ├── waterQuality.js
│   │   ├── alerts.js
│   │   ├── citizenReports.js
│   │   └── dashboard.js
│   ├── utils/               # Helper functions
│   │   └── healthScore.js   # Health score calculation
│   ├── scripts/             # Database seeding
│   │   └── seed.js
│   ├── server.js            # Main server file
│   └── package.json
├── ai-module/               # Python FastAPI AI module
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── README.md
├── package.json             # Root package.json
├── README.md                # This file
└── .gitignore
```

---

## 🔐 Default Credentials

After running the seed script, you can use these credentials:

### Admin
- Email: admin@delhi.gov.in
- Password: admin123
- Access: Full system access

### Field Officer
- Email: officer@delhi.gov.in
- Password: officer123
- Access: Conduct surveys, upload photos

### Government Official
- Email: official@delhi.gov.in
- Password: official123
- Access: View dashboards, review reports, resolve alerts

---

## 🏗 Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (Button, Card, Input)
- **State Management**: Zustand
- **Maps**: Leaflet.js + React Leaflet
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Express Validator
- **Security**: Helmet, Rate Limiting
- **CORS**: Configured for frontend

### AI Module
- **Framework**: FastAPI
- **Language**: Python
- **Image Processing**: OpenCV, PIL
- **ML Model**: YOLOv11 (placeholder - color-based analysis)
- **Dependencies**: PyTorch, Ultralytics

---

## 📊 Features

### Core Modules

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Admin, Officer, Official, Citizen)
   - Password hashing with bcrypt

2. **Water Body Management**
   - CRUD operations for water bodies
   - Geo-location storage (GeoJSON)
   - GIS integration with Leaflet
   - Category classification (lake, pond, wetland, reservoir, river)

3. **GIS Mapping**
   - Interactive map of all Delhi water bodies
   - Color-coded markers based on health status
   - Click to view water body details
   - Filter by district and status

4. **Survey Management**
   - Digital survey forms for field officers
   - Photo upload support
   - Pollution and encroachment reporting
   - Survey history tracking

5. **Water Quality Monitoring**
   - Track DO, pH, BOD, Nitrate, Coliform
   - Historical trend analysis
   - Lab test recording
   - Quality parameter validation

6. **Health Score Engine**
   - Automatic health score calculation (0-100)
   - Based on water quality parameters
   - Status classification (Healthy, Moderate, Critical)
   - Real-time score updates

7. **Alert Management**
   - Automatic alert generation
   - Threshold-based alerts (BOD, DO, Fecal Coliform)
   - Alert acknowledgment and resolution
   - Severity levels (Low, Medium, High, Critical)

8. **Dashboard Analytics**
   - Real-time statistics
   - District-wise breakdown
   - Recent alerts and surveys
   - Quality trend charts

9. **Citizen Reporting**
   - Public pollution reporting
   - Image upload
   - Location sharing
   - Admin verification workflow

10. **AI Image Analysis**
    - Pollution detection from images
    - Water hyacinth detection
    - Murky water identification
    - Foam pollution detection

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Water Bodies
- `GET /api/waterbodies` - Get all water bodies
- `GET /api/waterbodies/nearby` - Get nearby water bodies
- `GET /api/waterbodies/:id` - Get single water body
- `POST /api/waterbodies` - Create water body (Admin)
- `PUT /api/waterbodies/:id` - Update water body (Admin)
- `DELETE /api/waterbodies/:id` - Delete water body (Admin)

### Surveys
- `GET /api/surveys` - Get all surveys
- `GET /api/surveys/:id` - Get single survey
- `POST /api/surveys` - Create survey (Officer)
- `PUT /api/surveys/:id` - Update survey (Officer)

### Water Quality
- `GET /api/waterquality` - Get all quality records
- `GET /api/waterquality/:id` - Get single record
- `POST /api/waterquality` - Create quality record (Officer)
- `GET /api/waterquality/waterbody/:id/trends` - Get trends

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/unresolved` - Get unresolved alerts
- `PUT /api/alerts/:id/acknowledge` - Acknowledge alert
- `PUT /api/alerts/:id/resolve` - Resolve alert (Official)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/district-stats` - District-wise stats
- `GET /api/dashboard/recent-alerts` - Recent alerts
- `GET /api/dashboard/recent-surveys` - Recent surveys
- `GET /api/dashboard/quality-trends` - Quality trends

---

## 🤖 AI Module API

### Endpoints
- `GET /` - API info
- `GET /health` - Health check
- `POST /analyze` - Analyze single image
- `POST /batch-analyze` - Analyze multiple images

### Response Format
```json
{
  "success": true,
  "detected_pollutants": [
    {
      "label": "water_hyacinth",
      "confidence": 0.85,
      "bbox": [0, 0, 640, 480]
    }
  ],
  "overall_pollution_level": "medium"
}
```

---

## 🧪 Health Score Calculation

The health score is calculated based on:

- **Dissolved Oxygen (DO)**: Optimal >6 mg/L
- **pH**: Optimal 6.5-8.5
- **BOD**: Optimal <3 mg/L
- **Fecal Coliform**: Safe <2500 MPN/100mL
- **Nitrate**: Safe <45 mg/L

**Formula**: Health Score = 100 - Pollution Penalty

**Categories**:
- 80-100: Healthy (Green)
- 50-79: Moderate (Yellow)
- 0-49: Critical (Red)

---

## 🔔 Alert Thresholds

Automatic alerts are generated when:

- **Pollution Alert**: BOD > 3 mg/L
- **Low Oxygen Alert**: DO < 5 mg/L
- **Contamination Alert**: Fecal Coliform > 2500 MPN/100mL
- **pH Alert**: pH < 6 or > 9

---

## 📝 Development Notes

### Adding New Features

1. **Backend**: Add routes in `backend/routes/`, update models in `backend/models/`
2. **Frontend**: Add pages in `frontend/src/app/`, components in `frontend/src/components/`
3. **Database**: Update seed script in `backend/scripts/seed.js`

### Database Schema

All schemas are in `backend/models/`:
- User: Authentication and roles
- WaterBody: Water body information with GeoJSON
- Survey: Field officer surveys
- WaterQuality: Water quality parameters
- Alert: System alerts
- CitizenReport: Public reports

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Backend (Render/Heroku)
```bash
cd backend
# Set environment variables
# Deploy to your preferred platform
```

### AI Module (Render/Heroku)
```bash
cd ai-module
# Set environment variables
# Deploy with Python runtime
```

### MongoDB
- Use MongoDB Atlas for production
- Set MONGODB_URI in environment variables

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Team

Smart India Hackathon 2024 Team

---

## 📞 Support

For issues and questions, please open an issue on GitHub.
