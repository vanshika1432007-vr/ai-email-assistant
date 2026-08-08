import {
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";


export default function ActionPlan({
  dashboard,
}) {

  if (!dashboard) {
    return null;
  }


  return (
    <div className="action-plan">

      <div className="section-heading">

        <div>

          <h2>
            Today's Action Plan
          </h2>

          <p>
            AI-ranked next steps from
            your inbox
          </p>

        </div>

        <div className="plan-badge">
          AI Optimized
        </div>

      </div>


      <div className="action-list">

        {dashboard.action_items.map(
          (item, index) => (

            <div
              className="action-item"
              key={`${item.source_email_id}-${index}`}
            >

              <div className="action-number">
                {index + 1}
              </div>


              <div className="action-content">

                <div className="action-title">
                  {item.title}
                </div>

                <p>
                  {item.description}
                </p>

              </div>


              <div
                className={
                  item.priority === "High"
                    ? "priority high"
                    : item.priority === "Medium"
                    ? "priority medium"
                    : "priority low"
                }
              >
                {item.priority}
              </div>


              <ArrowUpRight size={17} />

            </div>

          )
        )}

      </div>


      <div className="follow-up-card">

        <div className="card-heading">

          <Clock size={17} />

          Follow-up Radar

        </div>

        <p>
          {dashboard.follow_ups.length} conversations
          may need your attention.
        </p>

        <div className="follow-up-list">

          {dashboard.follow_ups
            .slice(0, 3)
            .map((item, index) => (

              <div
                className="follow-up"
                key={index}
              >
                <CheckCircle2 size={15} />
                {item.title}
              </div>

            ))}

        </div>

      </div>

    </div>
  );
}