from typing import List, Optional, Literal
from pydantic import BaseModel, Field


Priority = Literal["Low", "Medium", "High"]
Category = Literal[
    "Work",
    "Academic",
    "Finance",
    "Meeting",
    "Personal",
    "Security",
    "Other",
]


class Email(BaseModel):
    id: str
    sender_name: str
    sender_email: str
    subject: str
    body: str
    timestamp: str
    unread: bool = True


class Task(BaseModel):
    task: str
    deadline: Optional[str] = None
    urgency: Priority = "Medium"


class SecurityAnalysis(BaseModel):
    is_spam: bool
    is_phishing: bool
    risk_score: int = Field(ge=0, le=100)
    indicators: List[str] = []
    recommendation: str


class EmailAnalysis(BaseModel):
    email_id: str
    summary: str
    priority: Priority
    category: Category
    sentiment: str
    confidence: int = Field(ge=0, le=100)
    why_it_matters: List[str] = []
    tasks: List[Task] = []
    security: SecurityAnalysis
    suggested_replies: List[str] = []


class ReplyRequest(BaseModel):
    email_id: str
    tone: Literal[
        "Professional",
        "Concise",
        "Friendly",
        "Confident",
    ] = "Professional"


class ReplyResponse(BaseModel):
    email_id: str
    tone: str
    reply: str


class ActionItem(BaseModel):
    title: str
    description: str
    priority: Priority
    source_email_id: Optional[str] = None


class DashboardResponse(BaseModel):
    total_emails: int
    unread_emails: int
    high_priority: int
    tasks: int
    security_alerts: int
    categories: dict
    action_items: List[ActionItem]
    follow_ups: List[ActionItem]
