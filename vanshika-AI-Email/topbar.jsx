import {
  Search,
  Bell,
  Sparkles,
} from "lucide-react";


export default function Topbar({
  search,
  setSearch,
}) {

  return (
    <header className="topbar">

      <div className="search-box">

        <Search size={18} />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search emails, people, tasks..."
        />

        <span className="search-shortcut">
          /
        </span>

      </div>


      <div className="topbar-actions">

        <button className="ai-status">
          <Sparkles size={15} />
          AI Online
        </button>

        <button className="icon-button">
          <Bell size={19} />
        </button>

        <div className="avatar">
          AK
        </div>

      </div>

    </header>
  );
}