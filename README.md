# Brain App - Development Setup

## Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
Create a `.env` file in the backend directory with:
```
JWT_SECRET=your-super-secret-jwt-key-12345
MONGODB_URI=mongodb://localhost:27017/brain-app
PORT=8000
```

3. Start MongoDB (if using local MongoDB):
```bash
mongod
```

4. Start the backend server:
```bash
npm run dev
```

## Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Features

- User authentication (register/login)
- Categories management
- Content management (notes, links, videos, tweets)
- Real-time dashboard with statistics
- Dark theme UI

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Categories
- `GET /api/category` - Get user categories
- `POST /api/category` - Create category
- `PATCH /api/category/:id` - Update category
- `DELETE /api/category/:id` - Delete category

### Content
- `GET /api/content` - Get user content
- `POST /api/content` - Create content
- `PATCH /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Links
- `GET /api/links` - Get user links
- `POST /api/links` - Create short link
- `DELETE /api/links/:id` - Delete link

## Development Notes

- Frontend runs on http://localhost:5173
- Backend runs on http://localhost:8000
- CORS is configured to allow frontend-backend communication
- JWT tokens are stored in localStorage
- All protected routes require authentication
