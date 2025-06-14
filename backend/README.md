
# AI Toolbox Backend

A FastAPI backend service for the AI Toolbox application, providing secure API endpoints for AI content generation.

## Features

- **Content Generation**: OpenAI-powered content generation for various use cases
- **Jira Ticket Generation**: Professional ticket creation with proper formatting
- **Social Media Posts**: Platform-specific content generation
- **Comment Generation**: Contextual comment creation
- **Communication Tools**: Meeting agendas, descriptions, and Slack messages
- **YouTube Integration**: Transcript extraction from YouTube videos

## Setup

### Local Development

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. **Run the server**:
   ```bash
   python main.py
   # Or: uvicorn main:app --reload
   ```

### Docker Deployment

1. **Using Docker Compose**:
   ```bash
   docker-compose up -d
   ```

2. **Using Docker directly**:
   ```bash
   docker build -t ai-toolbox-backend .
   docker run -p 8000:8000 --env-file .env ai-toolbox-backend
   ```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Content Generation
- `POST /api/generate` - Generic content generation
- `POST /api/jira/generate` - Jira ticket generation
- `POST /api/social/generate` - Social media post generation
- `POST /api/comment/generate` - Comment generation
- `POST /api/communication/generate` - Communication content generation

### YouTube
- `POST /api/youtube/transcript` - Extract YouTube video transcripts

## Environment Variables

Required:
- `OPENAI_API_KEY`: Your OpenAI API key

Optional:
- `PORT`: Server port (default: 8000)
- `DEBUG`: Enable debug mode (default: True)
- `ALLOWED_ORIGINS`: CORS allowed origins
- `YOUTUBE_API_KEY`: YouTube Data API key (for enhanced features)

## Frontend Integration

Update your frontend `openaiService.ts` to point to your backend:

```typescript
const API_BASE_URL = 'http://localhost:8000'; // Your backend URL

export const generateWithOpenAI = async ({ prompt, context = '', model = 'gpt-4-turbo-preview' }: OpenAIRequest): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, context, model }),
  });
  
  const data = await response.json();
  return data.content;
};
```

## Production Deployment

1. **Security**: Update CORS settings in `main.py`
2. **Environment**: Set production environment variables
3. **SSL**: Configure HTTPS with reverse proxy (nginx/traefik)
4. **Monitoring**: Add logging and monitoring solutions
5. **Scaling**: Consider using multiple workers with Gunicorn

## API Documentation

Once running, visit:
- **Interactive API docs**: http://localhost:8000/docs
- **ReDoc documentation**: http://localhost:8000/redoc
