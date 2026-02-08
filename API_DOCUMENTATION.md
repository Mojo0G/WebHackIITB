# Cosmic Watch API Documentation

**Base URL:** `https://cosmic-watch-backend.onrender.com`  
**API Version:** 1.0.0  
**Authentication:** JWT Bearer Token

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Asteroid Endpoints](#asteroid-endpoints)
3. [Request/Response Format](#requestresponse-format)
4. [Error Handling](#error-handling)
5. [Using Postman](#using-postman)

---

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user in the system

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | User's full name |
| email | string | Yes | User's email address (must be unique) |
| password | string | Yes | User's password (minimum 8 characters) |

**Success Response (201 - Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY0NDEwMDAwMCwiZXhwIjoxNjQ2NjkyMDAwfQ.signature"
}
```

**Error Responses:**

**400 - Bad Request (User Already Exists):**
```json
{
  "message": "User already exists"
}
```

**500 - Server Error:**
```json
{
  "message": "Server Error"
}
```

**Usage Example (cURL):**
```bash
curl -X POST https://cosmic-watch-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User's registered email |
| password | string | Yes | User's password |

**Success Response (200 - OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY0NDEwMDAwMCwiZXhwIjoxNjQ2NjkyMDAwfQ.signature"
}
```

**Error Responses:**

**401 - Unauthorized (Invalid Credentials):**
```json
{
  "message": "Invalid email or password"
}
```

**500 - Server Error:**
```json
{
  "message": "Server Error"
}
```

**Usage Example (cURL):**
```bash
curl -X POST https://cosmic-watch-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Important Note:**
- Save the returned `token` for use in protected endpoints
- Token expires in 30 days
- Include token in Authorization header as: `Bearer <token>`

---

## Asteroid Endpoints

### 1. Get Asteroid Feed

**Endpoint:** `GET /api/asteroids/feed`

**Description:** Get list of asteroids with risk scores (Public - No authentication required)

**Request Headers:**
```
Accept: application/json
```

**Query Parameters:**
None

**Success Response (200 - OK):**
```json
[
  {
    "id": "2000433",
    "name": "Eros",
    "diameter": 16.8,
    "velocity": 24.5,
    "distance": 0.178,
    "riskScore": 42,
    "riskColor": "green",
    "closeApproachDate": "2026-02-08"
  },
  {
    "id": "2023DW",
    "name": "Unknown Asteroid",
    "diameter": 5.2,
    "velocity": 18.3,
    "distance": 0.045,
    "riskScore": 68,
    "riskColor": "orange",
    "closeApproachDate": "2026-02-15"
  }
]
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique asteroid identifier |
| name | string | Asteroid name |
| diameter | number | Asteroid diameter in kilometers |
| velocity | number | Asteroid velocity in km/s |
| distance | number | Distance from Earth in AU |
| riskScore | number | Calculated risk score (0-100) |
| riskColor | string | Risk level color (green/yellow/orange/red) |
| closeApproachDate | string | Date of closest approach (YYYY-MM-DD) |

**Error Responses:**

**500 - Server Error:**
```json
{
  "message": "Failed to fetch asteroid feed"
}
```

**Usage Example (cURL):**
```bash
curl -X GET https://cosmic-watch-backend.onrender.com/api/asteroids/feed \
  -H "Accept: application/json"
```

**Usage Example (JavaScript):**
```javascript
fetch('https://cosmic-watch-backend.onrender.com/api/asteroids/feed')
  .then(response => response.json())
  .then(asteroids => console.log(asteroids))
  .catch(error => console.error('Error:', error));
```

---

### 2. Add Asteroid to Watchlist

**Endpoint:** `POST /api/asteroids/watch`

**Description:** Add an asteroid to user's watchlist (Protected - Requires authentication)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "asteroidId": "2000433",
  "asteroidName": "Eros",
  "alertThreshold": 50
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| asteroidId | string | Yes | ID of the asteroid |
| asteroidName | string | Yes | Name of the asteroid |
| alertThreshold | number | Yes | Risk score threshold for alerts (0-100) |

**Success Response (201 - Created):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "asteroidId": "2000433",
  "asteroidName": "Eros",
  "alertThreshold": 50,
  "createdAt": "2026-02-08T05:50:00Z"
}
```

**Error Responses:**

**400 - Bad Request (Already in Watchlist):**
```json
{
  "message": "Asteroid already in watchlist"
}
```

**401 - Unauthorized (Missing/Invalid Token):**
```json
{
  "message": "Not authorized to access this route"
}
```

**500 - Server Error:**
```json
{
  "message": "Server Error"
}
```

**Usage Example (cURL):**
```bash
curl -X POST https://cosmic-watch-backend.onrender.com/api/asteroids/watch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "asteroidId": "2000433",
    "asteroidName": "Eros",
    "alertThreshold": 50
  }'
```

**Usage Example (JavaScript with fetch):**
```javascript
const token = "your-jwt-token"; // Received from login

fetch('https://cosmic-watch-backend.onrender.com/api/asteroids/watch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    asteroidId: '2000433',
    asteroidName: 'Eros',
    alertThreshold: 50
  })
})
.then(response => response.json())
.then(data => console.log('Added to watchlist:', data))
.catch(error => console.error('Error:', error));
```

---

### 3. Get User Watchlist

**Endpoint:** `GET /api/asteroids/watchlist`

**Description:** Get all asteroids in user's watchlist (Protected - Requires authentication)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**
None

**Success Response (200 - OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "asteroidId": "2000433",
    "asteroidName": "Eros",
    "alertThreshold": 50,
    "createdAt": "2026-02-08T05:50:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "asteroidId": "2023DW",
    "asteroidName": "Unknown Asteroid",
    "alertThreshold": 75,
    "createdAt": "2026-02-08T06:00:00Z"
  }
]
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| _id | string | Watchlist item ID |
| userId | string | User ID |
| asteroidId | string | Asteroid ID |
| asteroidName | string | Asteroid name |
| alertThreshold | number | Risk score threshold for alerts |
| createdAt | string | Item creation timestamp (ISO 8601) |

**Error Responses:**

**401 - Unauthorized (Missing/Invalid Token):**
```json
{
  "message": "Not authorized to access this route"
}
```

**500 - Server Error:**
```json
{
  "message": "Server Error"
}
```

**Usage Example (cURL):**
```bash
curl -X GET https://cosmic-watch-backend.onrender.com/api/asteroids/watchlist \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Usage Example (JavaScript):**
```javascript
const token = "your-jwt-token";

fetch('https://cosmic-watch-backend.onrender.com/api/asteroids/watchlist', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(watchlist => console.log('Your watchlist:', watchlist))
.catch(error => console.error('Error:', error));
```

---

## Request/Response Format

### Authentication Tokens

JWT tokens are returned from login/register endpoints and must be included in protected routes:

```
Authorization: Bearer <token>
```

**Token Structure:**
- Format: `header.payload.signature`
- Expiration: 30 days from issue
- Scheme: HS256 (HMAC with SHA-256)

### Content Types

All endpoints use:
- **Request:** `Content-Type: application/json`
- **Response:** `Content-Type: application/json`

### Date Format

All dates use ISO 8601 format:
```
2026-02-08T05:50:00Z
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 500 | Server Error | Internal server error |

### Error Response Format

All errors return JSON with a message:

```json
{
  "message": "Error description"
}
```

### Common Error Scenarios

**Missing Authentication Token:**
- Endpoint requires authentication but token not provided
- Response: `401 Unauthorized`

**Invalid Token:**
- Token is expired, malformed, or invalid
- Response: `401 Unauthorized`

**Duplicate Entry:**
- Asteroid already exists in watchlist
- Response: `400 Bad Request`

**Validation Error:**
- Missing required fields in request body
- Response: `400 Bad Request`

---

## Using Postman

### 1. Import Collection

1. Download `POSTMAN_API_DOCUMENTATION.json`
2. Open Postman
3. Click **"Import"** button
4. Select the JSON file
5. Collection will appear in left sidebar

### 2. Setup Environment Variables

1. In Postman, click **"Environments"** (left sidebar)
2. Create new environment: **"Cosmic Watch Production"**
3. Add variables:

| Variable | Type | Initial Value | Current Value |
|----------|------|---------------|---------------|
| baseUrl | string | https://cosmic-watch-backend.onrender.com | https://cosmic-watch-backend.onrender.com |
| authToken | string | (leave empty) | (will be set after login) |

### 3. Get Authentication Token

1. Select **"Authentication"** → **"Login User"**
2. Fill in request body with your credentials
3. Click **"Send"**
4. Copy the `token` from response
5. Go to **"Environments"** → Set `authToken` to the copied token

### 4. Make Protected Requests

All protected endpoints automatically use the `authToken` variable:
- Headers include: `Authorization: Bearer {{authToken}}`

### 5. Testing Workflow

```
1. POST /api/auth/register (create test account)
   ↓
2. POST /api/auth/login (get token)
   ↓
3. GET /api/asteroids/feed (view available asteroids)
   ↓
4. POST /api/asteroids/watch (add to watchlist)
   ↓
5. GET /api/asteroids/watchlist (view your watchlist)
```

---

## Example API Workflows

### Complete User Registration and Setup Flow

```bash
# 1. Register new user
curl -X POST https://cosmic-watch-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePass123!"
  }'

# Response contains: _id, name, email, token

# 2. Login with credentials (alternative to register)
curl -X POST https://cosmic-watch-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePass123!"
  }'

# Save the token from response

# 3. Get public asteroid feed
curl -X GET https://cosmic-watch-backend.onrender.com/api/asteroids/feed

# 4. Add asteroid to watchlist
TOKEN="your-token-here"
curl -X POST https://cosmic-watch-backend.onrender.com/api/asteroids/watch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "asteroidId": "2000433",
    "asteroidName": "Eros",
    "alertThreshold": 50
  }'

# 5. Get your watchlist
curl -X GET https://cosmic-watch-backend.onrender.com/api/asteroids/watchlist \
  -H "Authorization: Bearer $TOKEN"
```

---

## Rate Limiting & Best Practices

### Recommendations

1. **Caching:** Cache asteroid feed data locally when possible
2. **Batch Operations:** Where applicable, batch requests to reduce API calls
3. **Error Handling:** Always handle error responses gracefully
4. **Token Management:** 
   - Store token securely (never in plain text)
   - Refresh token before expiration if needed
   - Logout by clearing token on client

### API Limits

- No documented rate limits on current deployment
- Consider implementing rate limiting for production
- NASA API has limits (50 requests/hour on free tier)

---

## Troubleshooting

### 401 Unauthorized on Protected Endpoints

**Solution:**
1. Verify token is included in Authorization header
2. Ensure token format is: `Bearer <token>`
3. Check token hasn't expired (30 day expiration)
4. Get new token by logging in again

### 400 Bad Request

**Solution:**
1. Verify all required fields are in request body
2. Check field types match documentation
3. Validate email format and password strength
4. Ensure no duplicate asteroids in watchlist

### 500 Server Error

**Solution:**
1. Check backend logs in Render dashboard
2. Verify database connection
3. Ensure all environment variables are set
4. Contact support if error persists

---

## Support & Resources

- **API Base URL:** https://cosmic-watch-backend.onrender.com
- **Frontend App:** https://cosmic-watch-frontend.onrender.com
- **Postman Downloads:** https://www.postman.com/downloads/
- **JWT Info:** https://jwt.io
- **API Status:** Check Render dashboard for uptime

---

**Last Updated:** February 8, 2026  
**API Version:** 1.0.0  
**Documentation Version:** 1.0
