# 🔗 URL Shortener Service

A scalable, secure, and modern URL shortening service built with **NestJS**, **MongoDB**, and **Docker**. It supports custom aliases, redirection, and includes API rate limiting and Swagger-based documentation.

---

## 📌 Features

- Create short URLs with optional custom aliases
- Redirect to original URLs
- View analytics for shortened URLs
- API Rate Limiting (using NestJS Throttler)
- Swagger API documentation
- Dockerized for easy setup

---

## 🧪 API Endpoints

| Method | Endpoint                         | Description                        | Request Body                                                 | Response                                                                                                    |
| ------ | -------------------------------- | ---------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/shorten`                   | Create a short URL                 | `{ "url": "https://example.com", "customCode": "optional" }` | `{ "originalUrl": "...", "shortUrl": "...", "createdAt": "...", "createdAtFormatted": "..." }`              |
| `GET`  | `/r/{shortCode}`                 | Redirect to original URL           | -                                                            | Redirects to original URL                                                                                   |
| `GET`  | `/api/stats/{shortCode}`         | Get URL statistics                 | -                                                            | `{ "originalUrl": "...", "shortUrl": "...", "clicks": 5, "createdAt": "...", "createdAtFormatted": "..." }` |
| `POST` | `/auth/register`                 | Register new user                  | `{ "email": "user@example.com", "password": "password123" }` | Success message                                                                                             |
| `POST` | `/auth/login`                    | User login                         | `{ "email": "user@example.com", "password": "password123" }` | `{ "access_token": "jwt_token" }`                                                                           |
                                                                        


Full interactive docs available at `/api` via Swagger UI.

---

## 🧑‍💻 Local Setup Instructions

### 🔧 Without Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/url-shortener-service.git
   cd url-shortener-service
2. **Install Dependencies**
   ```bash
   npm install
3. **Setup environment**
   Create a .env file in the root directory:
    MONGO_URI=mongodb://localhost:27017/url-shortener
    PORT=3000
    JWT_SECRET=your_jwt_secret_key
4. **Start the development server**
   ```bash
   npm run start:dev
   Open: http://localhost:3000/api to view Swagger API Docs

🐳 With Docker
Make sure Docker and Docker Compose are installed.

1. Run using Docker Compose
   ```bash
    docker compose up --build

2. Once running:

    Swagger Docs: http://localhost:3000/api
    MongoDB runs inside its own container
