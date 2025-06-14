
import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # OpenAI Configuration
    openai_api_key: str
    openai_model: str = "gpt-4-turbo-preview"
    openai_max_tokens: int = 2000
    openai_temperature: float = 0.7
    
    # Server Configuration
    port: int = 8000
    debug: bool = True
    
    # CORS Configuration
    allowed_origins: List[str] = ["*"]
    
    # YouTube Configuration
    youtube_api_key: str = ""
    
    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 3600  # 1 hour
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()
