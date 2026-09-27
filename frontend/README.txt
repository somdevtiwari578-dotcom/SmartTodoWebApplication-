# SmartTodo Frontend

This frontend is designed to connect to the Spring Boot SmartTodo backend.

## Files

- index.html       -> Login page
- register.html    -> Registration page
- todo.html        -> Todo dashboard
- script.js        -> API calls, JWT handling, CRUD, search, filter, pagination
- style.css        -> UI styling

## Backend expected

Backend:
http://localhost:8080

Expected endpoints:

POST /api/auth/register
POST /api/auth/login

GET    /api/todos
POST   /api/todos
PUT    /api/todos/{id}
DELETE /api/todos/{id}

Pagination/search/filter:
GET /api/todos?page=0&size=5
GET /api/todos?search=Spring
GET /api/todos?completed=false

## Important

If the browser shows a CORS error, the backend needs CORS configuration for the frontend origin.

For easiest testing, serve this folder with a small local HTTP server instead of opening index.html directly.
For example, from this folder:
python -m http.server 5500

Then open:
http://localhost:5500/index.html
