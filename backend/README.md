# Todo App Backend

A TypeScript-based Express.js backend for a Todo application with MongoDB integration.

## Features

- RESTful API endpoints for Todo CRUD operations
- TypeScript support
- MongoDB integration
- Error handling middleware
- Environment configuration
- Security middleware (Helmet)
- Request logging (Morgan)
- CORS support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/todo-app
   NODE_ENV=development
   ```

## Development

To run the development server:
```bash
npm run dev
```

## Production

To build and run in production:
```bash
npm run build
npm start
```

## API Endpoints

- `POST /api/todos` - Create a new todo
- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # Route definitions
└── index.ts        # Application entry point
```

## Testing

To run tests:
```bash
npm test
```

## License

MIT 