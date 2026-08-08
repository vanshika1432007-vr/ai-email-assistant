import {
  Inbox,
  Sparkles,
  ShieldCheck,
  CheckSquare,
  BarChart3,
  Settings,
  HelpCircle,
  Mail,
} from "lucide-react";


export default function Sidebar({
  active,
  onChange,
}) {

  const items = [
    {
      id: "inbox",
      label: "Smart Inbox",
      icon: Inbox,
    },
    {
      id: "action",
      label: "Action Plan",
      icon: CheckSquare,
    },
    {
      id: "security",
      label: "Security Center",
      icon: ShieldCheck,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];


  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-mark">
          <Sparkles size={20} />
        </div>

        <div>
          <div className="brand-name">
            MailMind
          </div>

          <div className="brand-subtitle">
            AI Email Assistant
          </div>
        </div>

      </div>


      <div className="compose-button">
        <Mail size={18} />
        Compose
      </div>


      <nav className="nav">

        {items.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={
                active === item.id
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                onChange(item.id)
              }
            >
              <Icon size={18} />

              <span>
                {item.label}
              </span>
            </button>
          );
        })}

      </nav>


      <div className="sidebar-bottom">

        <button className="nav-item">
          <Settings size={18} />
          Settings
        </button>

        <button className="nav-item">
          <HelpCircle size={18} />
          Help
        </button>

      </div>

    </aside>
  );
}