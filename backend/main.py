
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
from dotenv import load_dotenv

from services.openai_service import OpenAIService
from services.youtube_service import YouTubeService

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Toolbox Backend",
    description="Backend API for AI content generation tools",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
openai_service = OpenAIService()
youtube_service = YouTubeService()

# Pydantic models for request/response
class GenerateContentRequest(BaseModel):
    prompt: str
    context: Optional[str] = ""
    model: Optional[str] = "gpt-4-turbo-preview"

class GenerateContentResponse(BaseModel):
    content: str
    success: bool
    message: Optional[str] = None

class YouTubeTranscriptRequest(BaseModel):
    video_url: str
    language: Optional[str] = "en"

class YouTubeTranscriptResponse(BaseModel):
    transcript: str
    success: bool
    message: Optional[str] = None

class JiraTicketRequest(BaseModel):
    ticket_type: str
    title: str
    description: Optional[str] = ""
    priority: str
    component: Optional[str] = ""
    labels: Optional[str] = ""
    story_points: Optional[str] = ""
    custom_instructions: Optional[str] = ""

class SocialMediaRequest(BaseModel):
    topic: str
    platform: str
    style: str
    custom_instructions: Optional[str] = ""

class CommentRequest(BaseModel):
    platform: str
    tone: str
    post_content: str
    custom_instructions: Optional[str] = ""

class CommunicationRequest(BaseModel):
    content_type: str
    tone: str
    style: str
    subject: str
    details: Optional[str] = ""
    custom_instructions: Optional[str] = ""

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "AI Toolbox Backend is running"}

# Generic content generation endpoint
@app.post("/api/generate", response_model=GenerateContentResponse)
async def generate_content(request: GenerateContentRequest):
    try:
        content = await openai_service.generate_content(
            prompt=request.prompt,
            context=request.context,
            model=request.model
        )
        return GenerateContentResponse(content=content, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# YouTube transcript endpoint
@app.post("/api/youtube/transcript", response_model=YouTubeTranscriptResponse)
async def get_youtube_transcript(request: YouTubeTranscriptRequest):
    try:
        transcript = await youtube_service.get_transcript(
            video_url=request.video_url,
            language=request.language
        )
        return YouTubeTranscriptResponse(transcript=transcript, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Jira ticket generation endpoint
@app.post("/api/jira/generate", response_model=GenerateContentResponse)
async def generate_jira_ticket(request: JiraTicketRequest):
    try:
        prompt = f"""Create a professional Jira ticket with the following details:
        
Ticket Type: {request.ticket_type}
Title: {request.title}
Description: {request.description}
Priority: {request.priority}
Component: {request.component}
Labels: {request.labels}
Story Points: {request.story_points}

Additional Instructions: {request.custom_instructions}

Please format this as a complete Jira ticket with proper structure, acceptance criteria (if applicable), and all relevant fields. Make it professional and detailed."""

        content = await openai_service.generate_content(
            prompt=f"jira ticket: {prompt}",
            model="gpt-4-turbo-preview"
        )
        return GenerateContentResponse(content=content, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Social media post generation endpoint
@app.post("/api/social/generate", response_model=GenerateContentResponse)
async def generate_social_media_post(request: SocialMediaRequest):
    try:
        prompt = f"""Create a {request.style} social media post for {request.platform} about: {request.topic}

Platform: {request.platform}
Writing Style: {request.style}
Topic: {request.topic}"""

        if request.custom_instructions:
            prompt += f"\n\nCustom Instructions: {request.custom_instructions}"

        prompt += "\n\nPlease create an engaging post that fits the platform's format and audience expectations. Include relevant hashtags and emojis where appropriate."

        content = await openai_service.generate_content(
            prompt=f"social media post: {prompt}",
            model="gpt-4-turbo-preview"
        )
        return GenerateContentResponse(content=content, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Comment generation endpoint
@app.post("/api/comment/generate", response_model=GenerateContentResponse)
async def generate_comment(request: CommentRequest):
    try:
        prompt = f"""Generate a thoughtful comment for a {request.platform} post with a {request.tone} tone.

Post Content: "{request.post_content}"

Platform: {request.platform}
Tone: {request.tone}
{f"Additional Instructions: {request.custom_instructions}" if request.custom_instructions else ""}

Guidelines:
- Keep the comment engaging and relevant to the post
- Match the {request.tone} tone throughout
- Make it platform-appropriate for {request.platform}
- Add value to the conversation
- Be authentic and genuine

Generate only the comment text, no additional formatting or quotes."""

        content = await openai_service.generate_content(
            prompt=f"comment: {prompt}",
            model="gpt-4-turbo-preview"
        )
        return GenerateContentResponse(content=content, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Communication content generation endpoint
@app.post("/api/communication/generate", response_model=GenerateContentResponse)
async def generate_communication(request: CommunicationRequest):
    try:
        if request.content_type == 'meeting-agenda':
            prompt = f"""Create a professional meeting agenda for: {request.subject}
            
Details: {request.details}
Tone: {request.tone}
Style: {request.style}
{f"Additional instructions: {request.custom_instructions}" if request.custom_instructions else ""}

Please create a well-structured meeting agenda with time slots, topics, and clear objectives."""

        elif request.content_type == 'meeting-description':
            prompt = f"""Create a meeting description/invitation for: {request.subject}
            
Details: {request.details}
Tone: {request.tone}
Style: {request.style}
{f"Additional instructions: {request.custom_instructions}" if request.custom_instructions else ""}

Please create a clear and informative meeting description that would work well in calendar invitations."""

        elif request.content_type == 'slack-message':
            prompt = f"""Create a Slack message about: {request.subject}
            
Details: {request.details}
Tone: {request.tone}
Style: {request.style}
{f"Additional instructions: {request.custom_instructions}" if request.custom_instructions else ""}

Please create an appropriate Slack message that fits the tone and style requested."""

        content = await openai_service.generate_content(
            prompt=prompt,
            model="gpt-4-turbo-preview"
        )
        return GenerateContentResponse(content=content, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
