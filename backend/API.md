# Designetica Backend API Documentation

## Overview

The Designetica backend provides AI-powered wireframe generation services using Azure OpenAI. The API includes enhanced error handling, rate limiting, caching, and comprehensive logging.

## Base URL

```
http://localhost:5001
```

## Authentication

Currently, no authentication is required for local development. All endpoints are publicly accessible.

## Rate Limiting

- **Limit**: 10 requests per minute per IP address
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Unix timestamp when rate limit resets

## Common Headers

All responses include:

- `X-Correlation-ID`: Unique request identifier for tracking
- `Content-Type`: application/json

## Endpoints

### Health Check

**GET** `/health`

Check the health status of the service and its dependencies.

#### Response

```json
{
  "status": "OK|DEGRADED",
  "timestamp": "2025-06-29T12:00:00.000Z",
  "port": 5001,
  "environment": "development",
  "correlationId": "uuid-v4",
  "services": {
    "database": "N/A",
    "openai": "healthy|unhealthy|not_configured",
    "circuitBreaker": "CLOSED|OPEN|HALF_OPEN"
  },
  "uptime": 12345.67,
  "memory": {
    "rss": 123456,
    "heapTotal": 123456,
    "heapUsed": 123456,
    "external": 123456,
    "arrayBuffers": 123456
  },
  "version": "1.0.0"
}
```

### Generate HTML Wireframe

**POST** `/api/generate-html-wireframe`

Generate an HTML wireframe based on a description with optional style and complexity parameters.

#### Request Body

```json
{
  "description": "A landing page for a SaaS product with hero section, features, and pricing",
  "style": "default|minimal|detailed|mobile",
  "complexity": "simple|medium|complex"
}
```

#### Parameters

- **description** (required): Text description of the wireframe (max 1000 characters)
- **style** (optional): Visual style of the wireframe
  - `default`: Standard wireframe styling
  - `minimal`: Clean, minimal design with thin borders
  - `detailed`: More detailed with form inputs, buttons, and content placeholders
  - `mobile`: Optimized for mobile devices
- **complexity** (optional): Layout complexity level
  - `simple`: 3-5 main sections
  - `medium`: 5-8 sections with sub-components (default)
  - `complex`: Comprehensive layout with multiple sections and sidebars

#### Response

```json
{
  "html": "<div>...wireframe HTML...</div>",
  "cached": false,
  "fallback": false,
  "correlationId": "uuid-v4",
  "processingTimeMs": 1500
}
```

#### Error Response

```json
{
  "html": "<div>...fallback wireframe...</div>",
  "fallback": true,
  "error": "Used fallback wireframe due to API error",
  "errorMessage": "Circuit breaker is OPEN",
  "correlationId": "uuid-v4",
  "processingTimeMs": 50
}
```

### Generate AI Suggestions

**POST** `/api/generate-suggestions`

Generate AI-powered suggestions to improve a wireframe design.

#### Request Body

```json
{
  "description": "A dashboard for project management"
}
```

#### Response

```json
{
  "suggestions": [
    "Add learning progress indicators and completion badges",
    "Include skill assessment components with difficulty levels",
    "Add interactive Azure sandbox environment",
    "Consider personalized learning recommendations"
  ]
}
```

## Error Handling

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `408`: Request Timeout
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error
- `503`: Service Unavailable (circuit breaker open)

### Error Response Format

```json
{
  "error": "Error description",
  "correlationId": "uuid-v4",
  "message": "Additional error details (development only)"
}
```

## Caching

- Generated wireframes are cached for 30 minutes
- Cache key is based on description, style, and complexity
- Cache hits are indicated in the response with `"cached": true`

## Circuit Breaker

- Protects against cascading failures when OpenAI API is unavailable
- States: CLOSED (normal), OPEN (blocking requests), HALF_OPEN (testing recovery)
- Automatically falls back to static wireframes when circuit is open

## Monitoring and Logging

- All requests include correlation IDs for tracking
- Comprehensive logging with structured metadata
- Performance metrics included in responses
- Health checks monitor OpenAI connectivity

## Development Notes

- Set `NODE_ENV=development` for detailed error messages
- Use correlation IDs to trace requests across logs
- Rate limiting is per-IP address for development simplicity
- Fallback wireframes ensure service availability even without OpenAI access
