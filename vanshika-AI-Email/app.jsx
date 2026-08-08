import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Inbox,
  AlertTriangle,
  CheckSquare,
  Mail,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import EmailList from "./components/EmailList";
import AnalysisPanel from "./components/AnalysisPanel";
import ActionPlan from "./components/ActionPlan";
import Charts from "./components/Charts";

import {
  getEmails,
  getEmailAnalysis,
  getDashboard,
  generateReply,
} from "./api";


export default function App() {

  const [activeView, setActiveView] =
    useState("inbox");

  const [emails, setEmails] =
    useState([]);

  const [analyses, setAnalyses] =
    useState({});

  const [dashboard, setDashboard] =
    useState(null);

  const [selectedId, setSelectedId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [analysisLoading, setAnalysisLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [replyLoading, setReplyLoading] =
    useState(false);


  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true);
        setError("");

        const [
          emailData,
          dashboardData,
        ] = await Promise.all([
          getEmails(),
          getDashboard(),
        ]);

        setEmails(emailData);
        setDashboard(dashboardData);

        if (emailData.length > 0) {
          setSelectedId(
            emailData[0].id
          );
        }

      } catch (err) {

        setError(
          err.message ||
          "Unable to connect to backend."
        );

      } finally {

        setLoading(false);

      }
    }

    loadData();

  }, []);


  useEffect(() => {

    if (!selectedId) {
      return;
    }

    if (analyses[selectedId]) {
      return;
    }


    async function loadAnalysis() {

      try {

        setAnalysisLoading(true);

        const data =
          await getEmailAnalysis(
            selectedId
          );

        setAnalyses(
          (previous) => ({
            ...previous,
            [selectedId]: data,
          })
        );

      } catch (err) {

        setError(
          err.message ||
          "Unable to analyze email."
        );

      } finally {

        setAnalysisLoading(false);

      }
    }


    loadAnalysis();

  }, [selectedId, analyses]);


  const selectedEmail =
    useMemo(
      () =>
        emails.find(
          (email) =>
            email.id === selectedId
        ),
      [emails, selectedId]
    );


  const selectedAnalysis =
    selectedId
      ? analyses[selectedId]
      : null;


  async function handleGenerateReply(
    tone
  ) {

    if (!selectedId) {
      return;
    }


    try {

      setReplyLoading(true);

      const result =
        await generateReply(
          selectedId,
          tone
        );


      setAnalyses(
        (previous) => ({
          ...previous,
          [selectedId]: {
            ...previous[selectedId],
            suggested_replies: [
              result.reply,
            ],
          },
        })
      );

    } catch (err) {

      setError(
        err.message ||
        "Unable to generate reply."
      );

    } finally {

      setReplyLoading(false);

    }
  }


  function renderContent() {

    if (loading) {

      return (
        <div className="page-loading">

          <div className="loader" />

          <h2>
            Loading MailMind...
          </h2>

          <p>
            Preparing your intelligent inbox.
          </p>

        </div>
      );
    }


    if (activeView === "action") {

      return (
        <ActionPlan
          dashboard={dashboard}
        />
      );
    }


    if (
      activeView === "analytics"
    ) {

      return (
        <Charts
          dashboard={dashboard}
        />
      );
    }


    if (
      activeView === "security"
    ) {

      const securityEmails =
        emails.filter(
          (email) =>
            analyses[email.id]
              ?.security?.is_phishing
        );


      return (
        <div className="security-dashboard">

          <div className="section-heading">

            <div>

              <h2>
                Security Center
              </h2>

              <p>
                AI-detected suspicious
                communications
              </p>

            </div>

            <div className="security-score">
              <ShieldCheck size={18} />
              Protected
            </div>

          </div>


          <div className="security-overview">

            <div className="security-stat">
              <strong>
                {dashboard?.security_alerts || 0}
              </strong>

              <span>
                Alerts detected
              </span>
            </div>

            <div className="security-stat">
              <strong>
                {securityEmails.length}
              </strong>

              <span>
                Phishing risks
              </span>
            </div>

          </div>


          {securityEmails.length === 0 ? (

            <div className="empty-card">
              <ShieldCheck size={36} />
              <h3>No phishing threats</h3>
              <p>
                MailMind hasn't detected
                suspicious messages.
              </p>
            </div>

          ) : (

            securityEmails.map(
              (email) => (

                <button
                  key={email.id}
                  className="security-email"
                  onClick={() => {
                    setSelectedId(email.id);
                    setActiveView("inbox");
                  }}
                >

                  <AlertTriangle size={20} />

                  <div>

                    <strong>
                      {email.subject}
                    </strong>

                    <span>
                      {email.sender_email}
                    </span>

                  </div>

                </button>

              )
            )

          )}

        </div>
      );
    }


    return (
      <div className="inbox-layout">

        <div className="email-column">

          <div className="stats-grid">

            <StatCard
              icon={<Mail size={18} />}
              label="Total emails"
              value={
                dashboard?.total_emails || 0
              }
              detail="Inbox volume"
            />

            <StatCard
              icon={<Inbox size={18} />}
              label="Unread"
              value={
                dashboard?.unread_emails || 0
              }
              detail="Needs review"
            />

            <StatCard
              icon={
                <AlertTriangle size={18} />
              }
              label="High priority"
              value={
                dashboard?.high_priority || 0
              }
              detail="Requires attention"
              danger
            />

            <StatCard
              icon={
                <CheckSquare size={18} />
              }
              label="Action items"
              value={
                dashboard?.tasks || 0
              }
              detail="Tasks extracted"
            />

          </div>


          <EmailList
            emails={emails}
            analyses={analyses}
            selectedId={selectedId}
            onSelect={setSelectedId}
            search={search}
          />

        </div>


        <div className="analysis-column">

          <AnalysisPanel
            email={selectedEmail}
            analysis={selectedAnalysis}
            loading={
              analysisLoading ||
              replyLoading
            }
            onGenerateReply={
              handleGenerateReply
            }
          />

        </div>

      </div>
    );
  }


  return (
    <div className="app">

      <Sidebar
        active={activeView}
        onChange={setActiveView}
      />


      <main className="main">

        <Topbar
          search={search}
          setSearch={setSearch}
        />


        {error && (

          <div className="error-banner">

            <AlertTriangle size={17} />

            {error}

            <button
              onClick={() =>
                setError("")
              }
            >
              Dismiss
            </button>

          </div>

        )}


        <div className="page">

          {renderContent()}

        </div>

      </main>

    </div>
  );
}