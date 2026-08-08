import os
from typing import Optional

from dotenv import load_dotenv

from ..models import Email, ReplyResponse
from .analysis import analyze_email


load_dotenv()


class AIService:
    """
    AI orchestration layer.

    The application intentionally supports deterministic analysis so the
    hackathon demo works without requiring an external API key.

    A future provider can be connected through this class without changing
    the frontend.
    """

    def __init__(self):
        self.api_key = os.getenv("AI_API_KEY")
        self.api_url = os.getenv("AI_API_URL")
        self.model = os.getenv("AI_MODEL")

    async def analyze(self, email: Email):
        return analyze_email(email)

    async def generate_reply(
        self,
        email: Email,
        tone: str,
    ) -> ReplyResponse:

        analysis = analyze_email(email)

        if tone == "Concise":
            reply = analysis.suggested_replies[0]

        elif tone == "Friendly":
            reply = (
                f"Hi {email.sender_name.split()[0]},\n\n"
                f"Thanks for reaching out! {analysis.suggested_replies[0]}\n\n"
                "Best,"
            )

        elif tone == "Confident":
            reply = (
                f"Hi {email.sender_name.split()[0]},\n\n"
                f"{analysis.suggested_replies[0]} "
                "I’ll make sure this is handled promptly.\n\n"
                "Best regards,"
            )

        else:
            reply = (
                f"Hi {email.sender_name.split()[0]},\n\n"
                f"{analysis.suggested_replies[0]}\n\n"
                "Best regards,"
            )

        return ReplyResponse(
            email_id=email.id,
            tone=tone,
            reply=reply,
        )


ai_service = AIService()