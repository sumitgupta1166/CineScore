# 🎬 Movie Review Platform (MERN + Vite + Tailwind)

An interactive full-stack web application where users can browse movies, read & write reviews, manage their watchlist, and rate films.  
Built with **MongoDB, Express, React (Vite), Node.js, and Tailwind CSS**.

---

## ✨ Features

### 👤 Authentication
- User registration & login with JWT authentication.
- Option to sign up as **User** or **Admin** (for testing).
- Secure token handling with refresh tokens and logout functionality.

### 🎥 Movies
- Browse all movies with pagination.
- Search & filter by genre, year, and rating.
- View detailed movie pages with synopsis, cast, poster, and reviews.
- Admins can **create & delete movies**.

### 📝 Reviews
- Add star ratings and text reviews.
- Edit or delete own reviews.
- View aggregated average rating for each movie.

### 📌 Watchlist
- Add/remove movies from your personal watchlist.
- View watchlist from profile page.

### 🛠️ Admin Dashboard
- Create and manage movies.
- (Optional) Manage users (if backend provides endpoint).

### 🎨 UI/UX
- Responsive, mobile-friendly layout.
- TailwindCSS styling with gradients, hover effects, and interactive components.
- Clear navigation with **role-based access** (user/admin).

---

## 🗂️ Project Structure

movie-review-platform/
│── backend/ # Node.js + Express + MongoDB API
│ ├── src/
│ ├── package.json
│ └── .env.example
│
│── frontend/ # React (Vite) + Tailwind UI
│ ├── src/
│ ├── package.json
│ └── .env.example
│
└── README.md


---

## ⚙️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt (password hashing)
- CORS + Cookie-parser
- Express Rate Limit

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/movie-review-platform.git
cd movie-review-platform

2️⃣ Setup Backend
cd backend
npm install
cp .env.example .env   # add your environment variables
npm run dev

3️⃣ Setup Frontend
cd ../frontend
npm install
cp .env.example .env   # set API base URL (e.g. http://localhost:8000/api/v1)
npm run dev

4️⃣ Access App

Frontend: http://localhost:5173

Backend API: http://localhost:8000/api/v1

🔑 Environment Variables
Backend (backend/.env)
PORT=8000
MONGODB_URI=your-mongodb-uri
DB_NAME=cinescope
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRY=7d
BCRYPT_SALT_ROUNDS=10

Frontend (frontend/.env)
VITE_API_BASE=http://localhost:8000/api/v1

📬 API Endpoints
Auth

POST /auth/register → Register user/admin

POST /auth/login → Login

POST /auth/refresh → Refresh access token

POST /auth/logout → Logout

Movies

GET /movies → List all movies (pagination, filters)

GET /movies/:id → Get movie details with reviews

POST /movies → Create movie (admin)

DELETE /movies/:id → Delete movie (admin)

Reviews

POST /movies/:id/reviews → Add review

GET /movies/:id/reviews → Get reviews for movie

PUT /reviews/:id → Update review

DELETE /reviews/:id → Delete review

Users

GET /users/:id → User profile with reviews & watchlist

PUT /users/:id → Update profile

GET /users/:id/watchlist → Get watchlist

POST /users/:id/watchlist → Add movie to watchlist

DELETE /users/:id/watchlist/:movieId → Remove movie from watchlist

🧪 Testing

Postman collection available: movie-review-platform.postman_collection.json

Run API tests directly in Postman.

Frontend tested with manual user flows.

🌐 Deployment

Frontend: Deploy with Vercel/Netlify

Backend: Deploy with Render/Heroku

Database: MongoDB Atlas

📸 Screenshots

(Add screenshots of homepage, movie page, admin dashboard, etc.)

🤝 Contributing

Fork repo

Create feature branch (git checkout -b feature-name)

Commit changes (git commit -m "Add feature")

Push branch (git push origin feature-name)

Open Pull Request

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Built by [Your Name] ✨


---

👉 Do you want me to also **create the Postman collection file (`.json`) properly structured** and add a section in the README that links to it, so recruiters can test your API quickly?