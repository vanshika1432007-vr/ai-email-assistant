from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    Email,
    EmailAnalysis,
    ReplyRequest,
    ReplyResponse,
    DashboardResponse,
    ActionItem,
)
from .sample_data import get_sample_emails
from .services.ai_service import ai_service
from .services.analysis import analyze_email


app = FastAPI(
    title="MailMind AI",
    description="Competition-ready AI Email Assistant API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


emails = get_sample_emails()


@app.get("/")
async def root():
    return {
        "name": "MailMind AI",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "MailMind AI",
    }


@app.get("/api/emails", response_model=List[Email])
async def get_emails():
    return emails


@app.get(
    "/api/emails/{email_id}",
    response_model=Email,
)
async def get_email(email_id: str):

    for email in emails:
        if email.id == email_id:
            return email

    raise HTTPException(
        status_code=404,
        detail="Email not found",
    )


@app.get(
    "/api/emails/{email_id}/analysis",
    response_model=EmailAnalysis,
)
async def analyze_email_endpoint(email_id: str):

    for email in emails:
        if email.id == email_id:
            return await ai_service.analyze(email)

    raise HTTPException(
        status_code=404,
        detail="Email not found",
    )


@app.post(
    "/api/reply",
    response_model=ReplyResponse,
)
async def generate_reply(request: ReplyRequest):

    for email in emails:
        if email.id == request.email_id:
            return await ai_service.generate_reply(
                email,
                request.tone,
            )

    raise HTTPException(
        status_code=404,
        detail="Email not found",
    )


@app.get(
    "/api/dashboard",
    response_model=DashboardResponse,
)
async def dashboard():

    analyses = [
        analyze_email(email)
        for email in emails
    ]

    categories = {}

    for analysis in analyses:
        categories[analysis.category] = (
            categories.get(analysis.category, 0) + 1
        )

    action_items = []
    follow_ups = []

    for analysis in analyses:

        if analysis.priority == "High":

            action_items.append(
                ActionItem(
                    title="Handle high-priority email",
                    description=analysis.summary,
                    priority="High",
                    source_email_id=analysis.email_id,
                )
            )

        for task in analysis.tasks:

            action_items.append(
                ActionItem(
                    title=task.task,
                    description=(
                        f"Deadline: {task.deadline}"
                        if task.deadline
                        else "No explicit deadline detected."
                    ),
                    priority=task.urgency,
                    source_email_id=analysis.email_id,
                )
            )

        if analysis.priority in ["Medium", "High"]:
            follow_ups.append(
                ActionItem(
                    title="Review and respond",
                    description=analysis.summary,
                    priority=analysis.priority,
                    source_email_id=analysis.email_id,
                )
            )

    security_alerts = sum(
        1
        for analysis in analyses
        if analysis.security.is_phishing
        or analysis.security.is_spam
    )

    total_tasks = sum(
        len(analysis.tasks)
        for analysis in analyses
    )

    return DashboardResponse(
        total_emails=len(emails),
        unread_emails=sum(
            1 for email in emails
            if email.unread
        ),
        high_priority=sum(
            1
            for analysis in analyses
            if analysis.priority == "High"
        ),
        tasks=total_tasks,
        security_alerts=security_alerts,
        categories=categories,
        action_items=action_items[:8],
        follow_ups=follow_ups[:6],
    )


@app.get("/api/action-plan")
async def action_plan():

    analyses = [
        analyze_email(email)
        for email in emails
    ]

    plan = []

    for analysis in analyses:

        if analysis.priority == "High":

            plan.append(
                {
                    "priority": 1,
                    "title": "Act immediately",
                    "description": analysis.summary,
                    "email_id": analysis.email_id,
                }
            )

        elif analysis.tasks:

            plan.append(
                {
                    "priority": 2,
                    "title": "Complete extracted task",
                    "description": analysis.tasks[0].task,
                    "email_id": analysis.email_id,
                }
            )

    return {
        "plan": plan[:6]
    }