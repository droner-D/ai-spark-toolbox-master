
import os
import re
from typing import Optional
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

class YouTubeService:
    def __init__(self):
        self.formatter = TextFormatter()
    
    def extract_video_id(self, url: str) -> str:
        """
        Extract video ID from various YouTube URL formats
        """
        patterns = [
            r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([^&\n?#]+)',
            r'(?:https?://)?(?:www\.)?youtube\.com/embed/([^&\n?#]+)',
            r'(?:https?://)?(?:www\.)?youtu\.be/([^&\n?#]+)',
            r'(?:https?://)?(?:www\.)?youtube\.com/v/([^&\n?#]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        raise ValueError(f"Could not extract video ID from URL: {url}")
    
    async def get_transcript(self, video_url: str, language: str = "en") -> str:
        """
        Get transcript from YouTube video
        """
        try:
            video_id = self.extract_video_id(video_url)
            
            # Try to get transcript in the specified language
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(
                    video_id, 
                    languages=[language]
                )
            except:
                # Fallback to any available language
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            
            # Format transcript as plain text
            transcript_text = self.formatter.format_transcript(transcript_list)
            
            return transcript_text
            
        except Exception as e:
            raise Exception(f"YouTube transcript error: {str(e)}")
    
    async def get_video_info(self, video_url: str) -> dict:
        """
        Get basic video information (this would require additional API setup)
        """
        # This would require YouTube Data API v3
        # For now, return basic info based on URL
        video_id = self.extract_video_id(video_url)
        
        return {
            "video_id": video_id,
            "url": video_url,
            "transcript_available": True
        }
