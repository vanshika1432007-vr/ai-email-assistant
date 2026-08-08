export default function StatCard({
  icon,
  label,
  value,
  detail,
  danger = false,
}) {

  return (
    <div
      className={
        danger
          ? "stat-card danger"
          : "stat-card"
      }
    >

      <div className="stat-top">

        <div className="stat-icon">
          {icon}
        </div>

        <span className="stat-label">
          {label}
        </span>

      </div>


      <div className="stat-value">
        {value}
      </div>


      <div className="stat-detail">
        {detail}
      </div>

    </div>
  );
}