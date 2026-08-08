from .models import Email


SAMPLE_EMAILS = [
    Email(
        id="email-001",
        sender_name="Hackathon Organizers",
        sender_email="organizers@promptwars.example",
        subject="Final submission deadline — PromptWars AI Challenge",
        body="""
Hello Participant,

This is a reminder that the final submission for the PromptWars AI Challenge
must be completed by 11:59 PM tonight.

Please submit your GitHub repository, project documentation, and a
three-minute demo video before the deadline.

Late submissions may not be accepted.

Best,
PromptWars Organizing Team
""",
        timestamp="Today, 10:42 AM",
        unread=True,
    ),
    Email(
        id="email-002",
        sender_name="Dr. Sarah Wilson",
        sender_email="sarah.wilson@university.example",
        subject="Research meeting moved to Monday",
        body="""
Hi,

Our research discussion has been moved to Monday at 11:00 AM.

Please bring the latest experiment results and prepare a short explanation
of the methodology.

Regards,
Sarah
""",
        timestamp="Today, 09:18 AM",
        unread=True,
    ),
    Email(
        id="email-003",
        sender_name="Finance Department",
        sender_email="finance@company.example",
        subject="Expense reimbursement requires action",
        body="""
Your reimbursement request is currently incomplete.

Please upload the missing invoice before Friday so that the reimbursement
can be processed.

Regards,
Finance Team
""",
        timestamp="Yesterday, 04:20 PM",
        unread=True,
    ),
    Email(
        id="email-004",
        sender_name="Unknown Security Team",
        sender_email="security-alert@secure-login.example",
        subject="URGENT: Your account will be deleted",
        body="""
URGENT!

Your account will be permanently deleted within 30 minutes.

Verify your password immediately using the secure verification link below.

Failure to verify your credentials will result in permanent account loss.

Click here to continue.
""",
        timestamp="Today, 08:03 AM",
        unread=True,
    ),
    Email(
        id="email-005",
        sender_name="Alex Johnson",
        sender_email="alex.johnson@example.com",
        subject="Weekend plans",
        body="""
Hey!

Are we still meeting for coffee this weekend?

Let me know what time works for you.

Cheers,
Alex
""",
        timestamp="Yesterday, 07:40 PM",
        unread=False,
    ),
    Email(
        id="email-006",
        sender_name="Campus Placement Cell",
        sender_email="placements@college.example",
        subject="Important: Resume submission for placement drive",
        body="""
Dear Student,

Students interested in the upcoming placement drive must upload their
latest resume by tomorrow at 5 PM.

Please ensure your resume includes your latest projects and technical skills.

Regards,
Placement Cell
""",
        timestamp="Today, 07:30 AM",
        unread=True,
    ),
]


def get_sample_emails():
    return SAMPLE_EMAILS