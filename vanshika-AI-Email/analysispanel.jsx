import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Copy,
} from "lucide-react";

import { useState } from "react";


export default function AnalysisPanel({
  email,
  analysis,
  loading,
  onGenerateReply,
}) {

  const [tone, setTone] =
    useState("Professional");

  const [copied, setCopied] =
    useState(false);


  if (!email) {
    return (
      <div className="analysis-empty">
        <Sparkles size={36} />

        <h3>
          Select an email
        </h3>

        <p>
          MailMind will analyze it
          instantly.
        </p>
      </div>
    );
  }


  if (loading || !analysis) {
    return (
      <div className="analysis-empty">

        <div className="loader" />

        <h3>
          AI is analyzing...
        </h3>

        <p>
          Extracting intent, priority,
          tasks and security signals.
        </p>

      </div>
    );
  }


  const handleCopy = async () => {

    if (
      analysis.suggested_replies?.[0]
    ) {

      await navigator.clipboard.writeText(
        analysis.suggested_replies[0]
      );

      setCopied(true);

      setTimeout(
        () => setCopied(false),
        1500
      );
    }
  };


  return (
    <div className="analysis-panel">

      <div className="analysis-title">

        <div>
          <span className="eyebrow">
            AI ANALYSIS
          </span>

          <h2>
            {email.subject}
          </h2>

          <p>
            From {email.sender_name} ·{" "}
            {email.sender_email}
          </p>
        </div>

        <div className="confidence">
          <Sparkles size={15} />
          {analysis.confidence}% confidence
        </div>

      </div>


      <div className="summary-card">

        <div className="card-heading">
          <Sparkles size={17} />
          AI Summary
        </div>

        <p>
          {analysis.summary}
        </p>

      </div>


      <div className="insight-grid">

        <div className="insight-card">

          <span>
            Priority
          </span>

          <strong
            className={
              analysis.priority === "High"
                ? "text-danger"
                : analysis.priority === "Medium"
                ? "text-warning"
                : ""
            }
          >
            {analysis.priority}
          </strong>

        </div>


        <div className="insight-card">

          <span>
            Category
          </span>

          <strong>
            {analysis.category}
          </strong>

        </div>


        <div className="insight-card">

          <span>
            Sentiment
          </span>

          <strong>
            {analysis.sentiment}
          </strong>

        </div>

      </div>


      <section className="analysis-section">

        <div className="card-heading">
          <CheckCircle2 size={17} />
          Why This Matters
        </div>

        <ul className="insight-list">

          {analysis.why_it_matters.map(
            (reason, index) => (
              <li key={index}>
                {reason}
              </li>
            )
          )}

        </ul>

      </section>


      {analysis.tasks.length > 0 && (

        <section className="analysis-section">

          <div className="card-heading">
            <Clock size={17} />
            Action Items
          </div>

          <div className="task-list">

            {analysis.tasks.map(
              (task, index) => (

                <div
                  className="task"
                  key={index}
                >

                  <div>
                    <strong>
                      {task.task}
                    </strong>

                    {task.deadline && (
                      <span>
                        Deadline:{" "}
                        {task.deadline}
                      </span>
                    )}
                  </div>

                  <span
                    className={
                      task.urgency === "High"
                        ? "task-urgent"
                        : "task-normal"
                    }
                  >
                    {task.urgency}
                  </span>

                </div>

              )
            )}

          </div>

        </section>

      )}


      <section
        className={
          analysis.security.is_phishing
            ? "security-box danger"
            : "security-box"
        }
      >

        <div className="security-header">

          <div className="card-heading">

            <ShieldAlert size={17} />

            Security Analysis

          </div>

          <strong>
            {analysis.security.risk_score}/100
          </strong>

        </div>


        <p>
          {analysis.security.recommendation}
        </p>


        {analysis.security.indicators.length >
          0 && (

          <ul className="security-indicators">

            {analysis.security.indicators.map(
              (indicator, index) => (
                <li key={index}>
                  {indicator}
                </li>
              )
            )}

          </ul>

        )}

      </section>


      <section className="reply-section">

        <div className="reply-header">

          <div>
            <div className="card-heading">
              <Sparkles size={17} />
              Smart Reply
            </div>

            <p>
              Context-aware response
              suggestion
            </p>
          </div>


          <select
            value={tone}
            onChange={(event) =>
              setTone(event.target.value)
            }
          >
            <option>
              Professional
            </option>

            <option>
              Concise
            </option>

            <option>
              Friendly
            </option>

            <option>
              Confident
            </option>
          </select>

        </div>


        <div className="reply-box">

          <p>
            {analysis.suggested_replies?.[0]}
          </p>

          <button
            className="copy-button"
            onClick={handleCopy}
          >
            <Copy size={15} />

            {copied
              ? "Copied"
              : "Copy"}
          </button>

        </div>


        <button
          className="generate-button"
          onClick={() =>
            onGenerateReply(tone)
          }
        >
          <Sparkles size={17} />

          Generate {tone} Reply

        </button>

      </section>

    </div>
  );
}