
import openai
import os
from typing import Optional
import asyncio

class OpenAIService:
    def __init__(self):
        self.client = openai.AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    async def generate_content(
        self, 
        prompt: str, 
        context: Optional[str] = "", 
        model: str = "gpt-4-turbo-preview"
    ) -> str:
        """
        Generate content using OpenAI API
        """
        try:
            # Construct the full prompt
            full_prompt = f"{context}\n\n{prompt}" if context else prompt
            
            response = await self.client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant that generates high-quality content for various business and social media purposes. Always provide professional, well-structured, and relevant content."
                    },
                    {
                        "role": "user",
                        "content": full_prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.7,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    async def generate_summary(self, content: str, length: str = "medium") -> str:
        """
        Generate a summary of the provided content
        """
        length_instructions = {
            "short": "Provide a brief 2-3 sentence summary",
            "medium": "Provide a comprehensive summary in 1-2 paragraphs",
            "long": "Provide a detailed summary with key points and main themes"
        }
        
        prompt = f"""Please summarize the following content. {length_instructions.get(length, length_instructions['medium'])}.

Content to summarize:
{content}

Summary:"""

        return await self.generate_content(prompt)
