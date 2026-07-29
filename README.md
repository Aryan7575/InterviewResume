🚀 InterviewResume

An AI-powered MERN Stack Interview Preparation Platform that helps users prepare for technical interviews with personalized questions, AI-generated feedback, and secure authentication.

✨ Features

- 🔐 Secure User Authentication (JWT + bcrypt)
- 👤 User Registration & Login
- 🤖 AI-powered interview assistance using Groq API with Meta Llama models
- 📄 Resume-based interview question generation
- 💬 Intelligent responses based on user input
- 📊 RESTful API architecture
- ⚡ Fast and responsive React UI
- 🔒 Protected routes and authenticated sessions

🛠️ Tech Stack

Frontend

- React.js
- Vite
- HTML5
- CSS3
- JavaScript (ES6+)

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt Password Hashing

AI Integration

- Groq API
- Meta Llama Models

📂 Project Structure

InterviewResume/
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── Backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── package.json
│
└── README.md

🔑 Authentication

- JWT-based authentication
- Passwords securely hashed using bcrypt
- Protected API routes
- Token-based authorization

⚙️ API Integration

The application integrates with the Groq API using Meta Llama models to generate intelligent interview questions and provide AI-powered responses based on user interactions.

🚀 Getting Started

Clone the Repository

git clone https://github.com/your-username/InterviewResume.git

Install Dependencies

Frontend

cd Frontend
npm install
npm run dev

Backend

cd Backend
npm install
npm start

🌍 Environment Variables

Create a ".env" file inside the Backend folder.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key

🎯 Future Improvements

- Resume upload & parsing
- Mock interview sessions
- AI performance scoring
- Interview history
- Admin dashboard
- Email verification
- Password reset

👨‍💻 Author

Aryan Vishwakarma

B.Sc. Computer Science Graduate | Full Stack MERN Developer

Passionate about building scalable web applications, integrating AI into modern software, and continuously learning new technologies.

---

⭐ If you found this project useful, consider giving it a star!
