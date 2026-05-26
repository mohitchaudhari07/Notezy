# Notezy Backend

Welcome to the backend service of Notezy, a premium Engineering Past Year Questions (PYQs), Notes, and Syllabus sharing and analysis platform. Built with Node.js, Express, MongoDB, Google Gemini AI, and Cloudinary.

## Features
- **Authentication**: JWT-based secure signup, login, password recovery, and email verification.
- **Resource Management**: Structured storage for Universities, Branches, Subjects, and study resources (PYQs, Notes, Syllabus).
- **AI Analysis**: Integrates with Google Gemini API to analyze PDF study resources, extract key chapters/topics, and generate key takeaways.
- **Cloud Storage**: Seamless PDF/image uploads integrated with Cloudinary.
- **Background Jobs**: Asynchronous processing queue simulations for processing large PDFs and summary generation.

## Directory Structure

```
├── src/
│   ├── config/          # DB, Cloudinary, Gemini, and CORS initializations
│   ├── models/          # Mongoose DB schemas (User, Subject, Resource, etc.)
│   ├── controllers/     # Route handlers mapping requests to responses
│   ├── services/        # Business logic, third-party APIs (Cloudinary, Gemini, PDF)
│   ├── routes/          # Express route registration
│   ├── middleware/      # Auth, Role, File Upload, Validations, Global Error Handler
│   ├── validators/      # Schemas checking request payloads (express-validator)
│   ├── utils/           # Custom standard error, success response formatters, JWT
│   ├── jobs/            # Background tasks/jobs simulator
│   ├── templates/       # HTML email templates
│   ├── docs/            # API documentation (Swagger)
│   ├── app.js           # Express app setup and middleware registration
│   └── server.js        # Main server bootstrapper & DB connector
├── .env                 # Local variables (ignored by git)
├── .env.example         # Shared variables template
├── .gitignore           # Git exclusions
├── package.json         # Node.js dependencies
└── README.md            # Documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)
- Google Gemini API Key
- Cloudinary Account (Cloud Name, API Key, and Secret)

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (already installed, or run):
   ```bash
   npm install
   ```
3. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Fill in your environment variables in `.env`.

### Running Locally
- Run the server in development mode with hot reloading:
  ```bash
  npm run dev
  ```
- Start the server in production mode:
  ```bash
  npm start
  ```
