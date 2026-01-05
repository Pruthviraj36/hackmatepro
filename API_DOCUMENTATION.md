# API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "name": "User Name" // optional
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "username": "username",
    "name": "User Name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

**Errors:**
- `400` - Validation error
- `409` - User already exists

---

### POST /api/auth/login
Login and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "username": "username",
    // ... other user fields (password excluded)
  },
  "token": "eyJhbGc...",
  "message": "Login successful"
}
```

**Errors:**
- `400` - Validation error
- `401` - Invalid credentials

---

## User Endpoints

### GET /api/users/me
Get current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "clx...",
  "email": "user@example.com",
  "username": "username",
  "name": "User Name",
  "bio": "Bio text",
  "avatar": "https://...",
  "location": "City, Country",
  "website": "https://...",
  "github": "username",
  "twitter": "username",
  "linkedin": "username",
  "skills": ["React", "TypeScript"],
  "interests": ["AI", "Web3"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `401` - Unauthorized
- `404` - User not found

---

### PUT /api/users/me
Update current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)
```json
{
  "name": "New Name",
  "bio": "New bio",
  "avatar": "https://...",
  "location": "New Location",
  "website": "https://...",
  "github": "newusername",
  "twitter": "newusername",
  "linkedin": "newusername",
  "skills": ["React", "Node.js"],
  "interests": ["AI", "Blockchain"]
}
```

**Response:** `200 OK` (same as GET /api/users/me)

**Errors:**
- `400` - Validation error
- `401` - Unauthorized

---

### GET /api/users/[username]
Get user profile by username.

**Response:** `200 OK`
```json
{
  "id": "clx...",
  "username": "username",
  "name": "User Name",
  "bio": "Bio text",
  "avatar": "https://...",
  "location": "City, Country",
  "website": "https://...",
  "github": "username",
  "twitter": "username",
  "linkedin": "username",
  "skills": ["React", "TypeScript"],
  "interests": ["AI", "Web3"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "hackathonHistory": [...],
  "projects": [...]
}
```

**Errors:**
- `404` - User not found

---

### GET /api/users/discover
Discover users with optional filters.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `skills` (optional) - Comma-separated list of skills
- `interests` (optional) - Comma-separated list of interests
- `limit` (optional, default: 20) - Number of results
- `skip` (optional, default: 0) - Number of results to skip

**Example:** `/api/users/discover?skills=React,TypeScript&limit=10`

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "username": "user1",
    "name": "User One",
    "bio": "Bio...",
    "avatar": "https://...",
    "skills": ["React", "TypeScript"],
    "interests": ["AI"],
    "hackathonHistory": [...],
    "_count": {
      "hackathonHistory": 5
    }
  }
]
```

---

## Invitation Endpoints

### GET /api/invitations
Get all invitations (sent and received).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "senderId": "clx...",
    "receiverId": "clx...",
    "message": "Let's team up!",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "sender": {
      "id": "clx...",
      "username": "sender",
      "name": "Sender Name",
      "avatar": "https://..."
    },
    "receiver": {
      "id": "clx...",
      "username": "receiver",
      "name": "Receiver Name",
      "avatar": "https://..."
    }
  }
]
```

---

### POST /api/invitations
Send an invitation to another user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "receiverId": "clx...",
  "message": "Let's team up!" // optional
}
```

**Response:** `201 Created`
```json
{
  "id": "clx...",
  "senderId": "clx...",
  "receiverId": "clx...",
  "message": "Let's team up!",
  "status": "PENDING",
  // ... includes sender and receiver objects
}
```

**Errors:**
- `400` - Validation error or invalid request
- `401` - Unauthorized
- `409` - Invitation already sent

---

### PATCH /api/invitations/[id]
Accept or reject an invitation.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "ACCEPTED" // or "REJECTED"
}
```

**Response:** `200 OK`
```json
{
  "id": "clx...",
  "status": "ACCEPTED",
  // ... includes sender and receiver objects
}
```

**Note:** Accepting an invitation automatically creates a match.

**Errors:**
- `400` - Validation error or invitation already processed
- `401` - Unauthorized
- `403` - Not authorized to update this invitation
- `404` - Invitation not found

---

## Match Endpoints

### GET /api/matches
Get all matches for the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "user": {
      "id": "clx...",
      "username": "matcheduser",
      "name": "Matched User",
      "avatar": "https://...",
      "bio": "Bio...",
      "skills": ["React", "Node.js"]
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Errors:**
- `401` - Unauthorized

---

## Hackathon Endpoints

### GET /api/hackathons
Get all hackathons.

**Query Parameters:**
- `limit` (optional, default: 20)
- `skip` (optional, default: 0)

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "name": "Hackathon Name",
    "description": "Description...",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-03T00:00:00.000Z",
    "location": "City, Country",
    "website": "https://...",
    "logo": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### POST /api/hackathons
Create a new hackathon.

**Request Body:**
```json
{
  "name": "Hackathon Name",
  "description": "Description...", // optional
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-03T00:00:00.000Z",
  "location": "City, Country", // optional
  "website": "https://...", // optional
  "logo": "https://..." // optional
}
```

**Response:** `201 Created`
```json
{
  "id": "clx...",
  "name": "Hackathon Name",
  // ... other fields
}
```

**Errors:**
- `400` - Validation error (end date must be after start date)

---

### GET /api/hackathons/history
Get hackathon history for current user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "userId": "clx...",
    "hackathonId": "clx...",
    "role": "Frontend Developer",
    "result": "Winner",
    "projectUrl": "https://...",
    "notes": "Notes...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "hackathon": {
      "id": "clx...",
      "name": "Hackathon Name",
      // ... other hackathon fields
    }
  }
]
```

---

### POST /api/hackathons/history
Add hackathon history entry.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "hackathonId": "clx...",
  "role": "Frontend Developer", // optional
  "result": "Winner", // optional
  "projectUrl": "https://...", // optional
  "notes": "Notes..." // optional
}
```

**Response:** `201 Created`
```json
{
  "id": "clx...",
  "userId": "clx...",
  "hackathonId": "clx...",
  // ... other fields
  "hackathon": { ... }
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `404` - Hackathon not found

---

## Project Endpoints

### GET /api/projects
Get projects for a user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `userId` (optional) - User ID to get projects for (defaults to current user)

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "userId": "clx...",
    "title": "Project Title",
    "description": "Description...",
    "url": "https://...",
    "githubUrl": "https://...",
    "imageUrl": "https://...",
    "tags": ["React", "TypeScript"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### POST /api/projects
Create a new project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Project Title",
  "description": "Description...", // optional
  "url": "https://...", // optional
  "githubUrl": "https://...", // optional
  "imageUrl": "https://...", // optional
  "tags": ["React", "TypeScript"] // optional
}
```

**Response:** `201 Created`
```json
{
  "id": "clx...",
  "userId": "clx...",
  "title": "Project Title",
  // ... other fields
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized

---

### PUT /api/projects/[id]
Update a project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "url": "https://...",
  "githubUrl": "https://...",
  "imageUrl": "https://...",
  "tags": ["React", "Node.js"]
}
```

**Response:** `200 OK`
```json
{
  "id": "clx...",
  // ... updated project fields
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Not authorized to update this project
- `404` - Project not found

---

### DELETE /api/projects/[id]
Delete a project.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Project deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Not authorized to delete this project
- `404` - Project not found

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (not authorized for this action)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error
