import {
  ShieldAlert,
  Clock3,
  ChevronRight,
} from "lucide-react";


function priorityClass(priority) {

  if (priority === "High") {
    return "priority high";
  }

  if (priority === "Medium") {
    return "priority medium";
  }

  return "priority low";
}


export default function EmailList({
  emails,
  analyses,
  selectedId,
  onSelect,
  search,
}) {

  const filtered = emails.filter(
    (email) => {

      const query =
        search.toLowerCase();

      return (
        email.subject
          .toLowerCase()
          .includes(query) ||
        email.sender_name
          .toLowerCase()
          .includes(query) ||
        email.body
          .toLowerCase()
          .includes(query)
      );
    }
  );


  return (
    <div className="email-list">

      <div className="section-heading">

        <div>
          <h2>Smart Inbox</h2>
          <p>
            AI-ranked messages requiring
            your attention
          </p>
        </div>

        <div className="inbox-count">
          {filtered.length} messages
        </div>

      </div>


      <div className="email-items">

        {filtered.map((email) => {

          const analysis =
            analyses[email.id];

          const selected =
            email.id === selectedId;

          return (
            <button
              key={email.id}
              className={
                selected
                  ? "email-item selected"
                  : "email-item"
              }
              onClick={() =>
                onSelect(email.id)
              }
            >

              <div className="email-avatar">
                {email.sender_name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>


              <div className="email-content">

                <div className="email-header">

                  <strong>
                    {email.sender_name}
                  </strong>

                  <span>
                    {email.timestamp}
                  </span>

                </div>


                <div className="email-subject">
                  {email.subject}
                </div>


                <div className="email-preview">
                  {email.body
                    .replace(/\s+/g, " ")
                    .trim()
                    .slice(0, 100)}
                  ...
                </div>


                {analysis && (

                  <div className="email-tags">

                    <span
                      className={priorityClass(
                        analysis.priority
                      )}
                    >
                      {analysis.priority}
                    </span>


                    <span className="tag">
                      {analysis.category}
                    </span>


                    {analysis.security
                      .is_phishing && (

                      <span className="security-tag">
                        <ShieldAlert size={13} />
                        Phishing Risk
                      </span>

                    )}


                    {analysis.tasks.length > 0 && (

                      <span className="deadline-tag">
                        <Clock3 size={13} />
                        Action
                      </span>

                    )}

                  </div>

                )}

              </div>


              <ChevronRight
                className="email-arrow"
                size={18}
              />

            </button>
          );
        })}

      </div>

    </div>
  );
}