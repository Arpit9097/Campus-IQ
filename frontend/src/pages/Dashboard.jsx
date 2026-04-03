import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";
import './Dashboard.css';

const COLORS = ['#fb7185', '#f43f5e', '#fda4af', '#e11d48'];
const Dashboard = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/analysis`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnalysis(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex-center h-screen" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center h-screen" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)', flexDirection: 'column', gap: '1rem' }}>
        <p className="text-danger">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ width: 'auto' }}>Retry</button>
      </div>
    );
  }

  const readinessData = analysis?.scoreBreakdown || [
    { name: "Base", value: 20 },
    { name: "Skills", value: 0 },
    { name: "Projects", value: 0 },
    { name: "Education", value: 0 },
  ];

  const companyData =
    analysis?.eligibleCompanies?.map((c) => ({
      name: c.name,
      score: c.score,
    })) || [];

  if (loading) {
    return (
      <div className="flex-center h-screen" style={{ backgroundColor: 'var(--bg-dark)', color: 'white' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Background Glow */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="dashboard-container container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Your placement preparation progress</p>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-grid">
          <StatCard title="Placement Readiness" value={`${analysis?.readinessScore || 0}%`} />
          <StatCard title="Eligible Companies" value={analysis?.eligibleCompanies?.length || 0} />
          <StatCard title="Skill Gaps" value={analysis?.skillGaps?.length || 0} />
        </div>

        {/* Charts */}
        <div className="charts-grid">

          {/* Pie Chart */}
          <div className="glass-card p-4">
            <h3 className="chart-title">
              Readiness Breakdown
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={readinessData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {readinessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-card p-4">
            <h3 className="chart-title">
              Company Match Scores
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyData}>
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="score" fill="#fb7185" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Lists */}
        <div className="lists-grid">

          {/* Skill Gaps */}
          {analysis?.skillGaps?.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="chart-title">
                Areas to Improve
              </h3>
              <div className="skill-list">
                {analysis.skillGaps.map((skill, i) => (
                  <div key={i} className="skill-tag">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Companies */}
          {analysis?.eligibleCompanies?.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="chart-title">
                Recommended Companies
              </h3>
              <div className="company-list">
                {analysis.eligibleCompanies.map((c, i) => (
                  <div key={i} className="company-item">
                    <span>{c.name}</span>
                    <span className="company-score">
                      {c.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="glass-card p-4">
    <div className="stat-title">{title}</div>
    <div className="stat-value">
      {value}
    </div>
  </div>
);

export default Dashboard;
