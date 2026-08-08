import re
from typing import List

from ..models import (
    Email,
    EmailAnalysis,
    SecurityAnalysis,
    Task,
)


HIGH_PRIORITY_WORDS = [
    "urgent",
    "immediately",
    "deadline",
    "tonight",
    "today",
    "final submission",
    "account will be deleted",
    "required",
    "must",
    "before",
]

MEDIUM_PRIORITY_WORDS = [
    "tomorrow",
    "friday",
    "meeting",
    "please",
    "submit",
    "upload",
    "action",
    "request",
]

PHISHING_WORDS = [
    "password",
    "verify your credentials",
    "click here",
    "account will be deleted",
    "security alert",
    "urgent",
    "verification link",
]

TASK_PATTERNS = [
    r"please\s+(.+?)(?:\.|\n)",
    r"must\s+(.+?)(?:\.|\n)",
    r"required\s+to\s+(.+?)(?:\.|\n)",
    r"bring\s+(.+?)(?:\.|\n)",
]


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def detect_priority(email: Email) -> str:
    text = normalize(f"{email.subject} {email.body}")

    high_score = sum(
        1 for keyword in HIGH_PRIORITY_WORDS
        if keyword in text
    )

    medium_score = sum(
        1 for keyword in MEDIUM_PRIORITY_WORDS
        if keyword in text
    )

    if high_score >= 2:
        return "High"

    if high_score >= 1 and medium_score >= 1:
        return "High"

    if medium_score >= 1:
        return "Medium"

    return "Low"


def detect_category(email: Email) -> str:
    text = normalize(f"{email.subject} {email.body}")

    if any(word in text for word in ["password", "security", "credentials"]):
        return "Security"

    if any(word in text for word in ["placement", "student", "college", "research"]):
        return "Academic"

    if any(word in text for word in ["reimbursement", "invoice", "finance", "payment"]):
        return "Finance"

    if any(word in text for word in ["meeting", "discussion", "agenda"]):
        return "Meeting"

    if any(word in text for word in ["coffee", "weekend", "plans"]):
        return "Personal"

    if any(word in text for word in ["project", "submission", "work"]):
        return "Work"

    return "Other"


def detect_sentiment(email: Email) -> str:
    text = normalize(email.body)

    negative_words = [
        "urgent",
        "deleted",
        "failure",
        "late",
        "missing",
        "incomplete",
        "problem",
    ]

    positive_words = [
        "thank",
        "great",
        "congratulations",
        "welcome",
        "success",
    ]

    negative_score = sum(word in text for word in negative_words)
    positive_score = sum(word in text for word in positive_words)

    if negative_score > positive_score:
        return "Concerned"

    if positive_score > negative_score:
        return "Positive"

    return "Neutral"


def detect_security(email: Email) -> SecurityAnalysis:
    text = normalize(f"{email.subject} {email.body}")

    indicators: List[str] = []

    for word in PHISHING_WORDS:
        if word in text:
            indicators.append(f"Contains suspicious phrase: '{word}'")

    if "password" in text or "credentials" in text:
        indicators.append("Requests sensitive authentication information")

    if "30 minutes" in text or "immediately" in text:
        indicators.append("Uses artificial urgency")

    is_phishing = (
        len(indicators) >= 3
        or (
            "password" in text
            and "click here" in text
        )
    )

    is_spam = is_phishing or "winner" in text or "free prize" in text

    risk_score = min(100, len(indicators) * 22)

    if is_phishing:
        recommendation = (
            "Do not click links or provide credentials. "
            "Verify the sender through an independent channel."
        )
    elif is_spam:
        recommendation = "Avoid interacting with the message and consider reporting it."
    else:
        recommendation = "No major security threat detected."

    return SecurityAnalysis(
        is_spam=is_spam,
        is_phishing=is_phishing,
        risk_score=risk_score,
        indicators=indicators,
        recommendation=recommendation,
    )


def extract_tasks(email: Email) -> List[Task]:
    body = email.body
    tasks: List[Task] = []

    for pattern in TASK_PATTERNS:
        matches = re.findall(pattern, body, flags=re.IGNORECASE)

        for match in matches:
            task_text = match.strip()

            if len(task_text) < 5:
                continue

            deadline = detect_deadline(task_text, body)

            urgency = "Medium"

            if deadline:
                urgency = "High"

            tasks.append(
                Task(
                    task=task_text,
                    deadline=deadline,
                    urgency=urgency,
                )
            )

    unique = {}

    for task in tasks:
        unique[task.task.lower()] = task

    return list(unique.values())


def detect_deadline(task_text: str, body: str):
    text = normalize(f"{task_text} {body}")

    deadline_patterns = [
        "tonight",
        "today",
        "tomorrow",
        "friday",
        "monday",
        "before the deadline",
    ]

    for pattern in deadline_patterns:
        if pattern in text:
            return pattern.title()

    return None


def generate_summary(email: Email) -> str:
    subject = email.subject

    body_sentences = [
        sentence.strip()
        for sentence in re.split(r"[.!?]", email.body)
        if sentence.strip()
    ]

    if not body_sentences:
        return subject

    important_sentences = body_sentences[:2]

    return f"{subject}. " + " ".join(important_sentences)


def generate_why_it_matters(
    email: Email,
    priority: str,
    tasks: List[Task],
    security: SecurityAnalysis,
) -> List[str]:

    reasons = []

    if priority == "High":
        reasons.append("This email contains time-sensitive or consequential information.")

    if tasks:
        reasons.append(f"{len(tasks)} actionable task(s) were detected.")

    if any(task.deadline for task in tasks):
        reasons.append("A deadline or time constraint was detected.")

    if security.is_phishing:
        reasons.append("The message contains multiple phishing indicators.")

    if not reasons:
        reasons.append("No immediate action appears to be required.")

    return reasons


def generate_replies(email: Email, priority: str) -> List[str]:
    category = detect_category(email)

    if category == "Security":
        return [
            "Thanks for the alert. I will verify this through the official channel.",
            "I won't use the provided link. I'll contact the official support team directly.",
        ]

    if category == "Academic":
        return [
            "Thanks for the update. I’ll review the requirements and complete the requested action.",
            "Thank you. I’ll prepare the requested material and submit it before the deadline.",
        ]

    if category == "Finance":
        return [
            "Thanks for letting me know. I’ll upload the missing document as soon as possible.",
            "Understood. I’ll provide the required invoice so the reimbursement can be processed.",
        ]

    if category == "Meeting":
        return [
            "Thanks for the update. Monday at 11:00 AM works for me. I’ll bring the latest results.",
            "Confirmed. I’ll prepare the requested material before the meeting.",
        ]

    return [
        "Thanks for reaching out. I’ll take a look and get back to you shortly.",
        "Thanks for the update. I’ll review this and follow up soon.",
    ]


def analyze_email(email: Email) -> EmailAnalysis:
    priority = detect_priority(email)
    category = detect_category(email)
    sentiment = detect_sentiment(email)
    security = detect_security(email)
    tasks = extract_tasks(email)

    confidence = 92

    if security.is_phishing:
        confidence = 97
    elif priority == "Low":
        confidence = 88

    return EmailAnalysis(
        email_id=email.id,
        summary=generate_summary(email),
        priority=priority,
        category=category,
        sentiment=sentiment,
        confidence=confidence,
        why_it_matters=generate_why_it_matters(
            email,
            priority,
            tasks,
            security,
        ),
        tasks=tasks,
        security=security,
        suggested_replies=generate_replies(email, priority),
    )