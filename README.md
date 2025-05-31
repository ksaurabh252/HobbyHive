# 🐝 HobbyHive - Hobby Sharing Platform

**HobbyHive** is a vibrant platform where users can discover, share, and connect through various hobbies. Whether it's painting, gardening, cooking, or photography, users can find like-minded individuals, join groups, participate in community events, exchange skills, and grow together around their interests.

Built with Node.js, Express, MongoDB, and Socket.IO, HobbyHive is a feature-rich social platform offering real-time interaction, event scheduling, gamification, matchmaking, and more — designed to build thriving, hobby-driven communities.

---

## 🚀 Features

- 🔐 **User Authentication** with JWT
- 🧑‍🤝‍🧑 **Groups & Forums** for collaboration
- 🗓️ **Event Management** with Google Calendar integration
- 📚 **Resource Sharing** and rating system
- 🤝 **Skill Exchange** with smart matchmaking
- 🧩 **User Matchmaking** based on shared hobbies
- 🎮 **Gamification** through points and badges
- 📬 **Email Reminders** for upcoming events
- ⚡ **Real-Time Messaging** and notifications via Socket.IO
- 🧱 **Rate Limiting** using Redis

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-Time**: Socket.IO
- **Email Service**: Nodemailer
- **Calendar Integration**: Google Calendar API
- **Rate Limiting**: Redis + `rate-limiter-flexible`
- **Testing**: Jest, Supertest, MongoMemoryServer

---

## 📦 Installation

### Prerequisites

- Node.js v16+
- MongoDB
- Redis

### Setup

```bash
# Clone the repo
git clone https://github.com/ksaurabh252/hobbyhive.git
cd hobbyhive

# Install dependencies
npm install

# Copy and edit environment variables
cp .env.example .env
```

---

## 🔑 Environment Variables

Configure your `.env` file with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hobbyhive
JWT_SECRET=your_jwt_secret

REDIS_URI=redis://localhost:6379

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=Gmail

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/oauth2callback
```

For running tests, create a `.env.test` file:

```env
MONGODB_URI_TEST=mongodb://localhost:27017/hobbyhive_test
NODE_ENV=test
JWT_SECRET=test-secret
```

---

## ▶️ Running the App

```bash
# Start the development server
npm run dev
```

The server will run on `http://localhost:5000` by default.

---

## 🧪 Running Tests

```bash
npm test
```

- Uses **Jest** for unit and integration testing.
- **MongoMemoryServer** spins up a temporary in-memory MongoDB instance.
- **Supertest** is used to simulate HTTP requests.

---

## 📁 Project Structure

```
.
├── controllers       # Route handler logic for each feature
├── models            # Mongoose schemas and data models
├── routes            # Express route definitions
├── services          # Business logic (email, matchmaking, gamification, calendar, etc.)
├── middlewares       # Express middlewares (auth, rate limiting, etc.)
├── tests             # Automated test cases (Jest/Supertest)
├── utils             # Utility functions and event emitters
├── app.js            # Main application entry point
├── .env              # Environment variables configuration
└── jest.config.js    # Jest test configuratio

---

## 🎮 Gamification & Matchmaking

- Users earn points by engaging (sharing resources, RSVPing, logging in, etc.)
- Points unlock badges:
  - **Novice**: 50 pts
  - **Contributor**: 200 pts
  - **Expert**: 500 pts
  - **Master**: 1000 pts
- Daily matchmaking suggests users with similar hobbies, using a score-based algorithm.

---

## 📬 Notifications & Calendar

- 📧 Event reminders sent via email
- 🗓️ Events can be synced to Google Calendar (OAuth2 required)
- 🔔 Real-time notifications and group messages through Socket.IO

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---
```
