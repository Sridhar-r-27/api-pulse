# API Pulse 🚀

**Real-time API Monitoring & Health Check System**

A production-ready backend application that monitors API health, tracks response times, and provides detailed analytics. Built with Node.js, Express, and MongoDB.

---

## 🎯 Features

- ✅ **Automatic API Monitoring** - Tests APIs every 5 minutes
- ✅ **Manual Testing** - Test any API on-demand
- ✅ **Bulk Testing** - Test multiple APIs simultaneously
- ✅ **Historical Data** - Track API performance over time
- ✅ **Statistics & Analytics** - Calculate uptime, avg response times
- ✅ **Scheduler Control** - Pause/resume/trigger monitoring
- ✅ **Data Management** - Delete old or specific test results
- ✅ **RESTful API** - 12 well-designed endpoints

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Scheduler:** node-cron
- **HTTP Client:** Axios
- **Environment:** dotenv

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd api-pulse/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env` file in backend folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

4. **Configure monitored APIs**

Edit `src/config/apis.js` to add/remove APIs to monitor:
```javascript
{
  name: 'Your API',
  url: 'https://your-api.com',
  enabled: true,
}
```

5. **Start the server**
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

Server runs on: `http://localhost:5000`

---

## 📡 API Endpoints

### API Testing

#### Test Single API
```http
POST /api/test
Content-Type: application/json

{
  "apiName": "GitHub API",
  "apiUrl": "https://api.github.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "apiName": "GitHub API",
    "apiUrl": "https://api.github.com",
    "statusCode": 200,
    "responseTime": 145,
    "status": "UP",
    "errorMessage": null,
    "testedAt": "2024-12-30T..."
  }
}
```

---

#### Test Multiple APIs (Bulk)
```http
POST /api/test/bulk
Content-Type: application/json

{
  "apis": [
    { "apiName": "GitHub", "apiUrl": "https://api.github.com" },
    { "apiName": "Google", "apiUrl": "https://www.google.com" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [ /* array of test results */ ],
  "summary": {
    "total": 2,
    "successful": 2,
    "failed": 0
  }
}
```

---

#### Get Latest Test Results
```http
GET /api/tests?limit=10
```

Returns the most recent test results (default 10).

---

#### Get Test History for Specific API
```http
GET /api/tests/GitHub%20API?limit=20
```

Returns test history for a specific API (default 20 results).

---

#### Get Statistics for API
```http
GET /api/stats/GitHub%20API
```

**Response:**
```json
{
  "success": true,
  "data": {
    "apiName": "GitHub API",
    "totalTests": 48,
    "upTests": 47,
    "downTests": 1,
    "slowTests": 0,
    "avgResponseTime": 156,
    "uptimePercentage": 97.92
  }
}
```

---

#### Get Summary of All APIs
```http
GET /api/summary
```

Returns overview of all monitored APIs with current status and 24h uptime.

---

#### Delete Old Test Results
```http
DELETE /api/tests/old?days=30
```

Deletes test results older than specified days (default 30).

---

#### Delete Tests for Specific API
```http
DELETE /api/tests/GitHub%20API
```

Deletes all test results for a specific API.

---

### Scheduler Control

#### Get Scheduler Status
```http
GET /api/scheduler/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isRunning": true,
    "monitoredApis": 4,
    "totalApis": 4
  }
}
```

---

#### Trigger Manual Test
```http
POST /api/scheduler/trigger
```

Immediately tests all monitored APIs (doesn't affect automatic schedule).

---

#### Stop Scheduler
```http
POST /api/scheduler/stop
```

Pauses automatic API testing.

---

#### Resume Scheduler
```http
POST /api/scheduler/resume
```

Resumes automatic API testing.

---

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── apis.js           # APIs to monitor
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   └── ApiTest.js        # Test result schema
│   ├── services/
│   │   ├── apiTestService.js # API testing logic
│   │   └── schedulerService.js # Scheduler logic
│   ├── controllers/
│   │   ├── apiTestController.js # Request handlers
│   │   └── schedulerController.js # Scheduler handlers
│   ├── routes/
│   │   ├── apiTestRoutes.js  # API test endpoints
│   │   └── schedulerRoutes.js # Scheduler endpoints
│   └── server.js             # Entry point
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 📊 Data Model

### ApiTest Schema

```javascript
{
  apiName: String,           // Name of the API
  apiUrl: String,            // URL tested
  statusCode: Number,        // HTTP status code (200, 404, etc.)
  responseTime: Number,      // Time in milliseconds
  status: String,            // 'UP', 'DOWN', or 'SLOW'
  errorMessage: String,      // Error if test failed
  testedAt: Date,            // When test was performed
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

---

## ⚙️ Configuration

### Monitored APIs

Edit `src/config/apis.js`:

```javascript
const monitoredApis = [
  {
    name: 'GitHub API',
    url: 'https://api.github.com',
    enabled: true,  // Set to false to disable
  },
  // Add more APIs here
];
```

### Scheduler Frequency

Edit `src/services/schedulerService.js`:

```javascript
// Current: Every 5 minutes
cron.schedule('*/5 * * * *', callback);

// Every 1 minute (for testing)
cron.schedule('*/1 * * * *', callback);

// Every 10 minutes
cron.schedule('*/10 * * * *', callback);

// Every hour
cron.schedule('0 * * * *', callback);
```

---

## 🔧 Status Codes

- **UP** - API responded successfully with status code < 400 and response time < 2000ms
- **DOWN** - API returned error status (≥ 400) or couldn't connect
- **SLOW** - API responded successfully but took > 2000ms

---

## 🧪 Testing with Postman

1. Import endpoints into Postman
2. Test each endpoint to verify functionality
3. Check MongoDB Atlas to see stored data
4. Monitor console logs for scheduler activity

---

## 🚀 Deployment

### Environment Variables for Production

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/api-pulse
NODE_ENV=production
```

### Recommended Platforms
- **Backend:** Railway, Render, Heroku, AWS EC2
- **Database:** MongoDB Atlas (already cloud-based)

---

## 📈 Future Enhancements

- [ ] Email/SMS alerts when APIs go down
- [ ] Multiple testing locations (geo-distributed)
- [ ] API key authentication
- [ ] Webhooks for notifications
- [ ] Custom test intervals per API
- [ ] Export data as CSV/JSON
- [ ] Real-time WebSocket updates
- [ ] Rate limiting
- [ ] API documentation with Swagger

---

## 👨‍💻 Author

**Sridhar R**
- GitHub: [@Sridhar-r-27](https://github.com/Sridhar-r-27)
- LinkedIn: [sridhar-r-116543222](https://linkedin.com/in/sridhar-r-116543222)
- Location: Bengaluru, Karnataka, India

---

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🙏 Acknowledgments

Built as a learning project to demonstrate:
- RESTful API design
- MongoDB integration
- Background job scheduling
- Production-ready architecture
- Clean code organization

---

## 📞 Support

For questions or issues, please:
1. Check the documentation above
2. Review the code comments
3. Open an issue on GitHub
4. Contact via LinkedIn

---

**Built with ❤️ using Node.js, Express, and MongoDB**