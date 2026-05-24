import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_MODE, MOCK_DASHBOARD } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const role = localStorage.getItem('role') || 'senior';
  const navigate = useNavigate();

  useEffect(() => {
    if (DEMO_MODE) {
      // Use mock data instantly — no API call
      setData(MOCK_DASHBOARD);
      return;
    }
    // --- REAL API ---
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';
        const res = await axios.get(`${backendUrl}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setData(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  if (!data) return <div style={{ padding: 40 }}>Loading...</div>;

  const { stats, bankStats, statusStats, recentCases } = data;
  const COLORS = ['#1a2744', '#2563eb', '#c9a84c', '#16a34a', '#d97706', '#dc2626'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'created': return '#64748b';
      case 'assigned': return '#3b82f6';
      case 'in_progress': return '#f59e0b';
      case 'draft_ready': return '#a855f7';
      case 'under_review': return '#f97316';
      case 'approved': return '#22c55e';
      case 'shared_to_bank': return '#14b8a6';
      default: return '#64748b';
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 28, color: 'var(--navy)', margin: 0 }}>Overview</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          {role === 'admin' && (
            <button onClick={() => navigate('/cases/new')} style={{ background: 'var(--navy)', color: 'white', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              ➕ New Case
            </button>
          )}
          {role === 'senior' && (
            <button onClick={() => navigate('/approvals')} style={{ background: 'var(--gold)', color: 'white', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              📋 View Approvals
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <StatCard title="Total Cases" value={stats.totalCases} bg="#1a2744" color="#c9a84c" delay={0} />
        <StatCard title="Pending Approval" value={stats.pendingApproval} bg="#fef3c7" color="#d97706" delay={1} />
        <StatCard title="Approved Today" value={stats.approvedToday} bg="#dcfce7" color="#16a34a" delay={2} />
        <StatCard title="Active Banks" value={stats.activeBanks} bg="#dbeafe" color="#2563eb" delay={3} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        <div className="animate-in-delay" style={{ '--i': 4, background: 'white', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--navy)', fontSize: 16 }}>Cases by Bank</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bankStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="count" fill="var(--navy)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="animate-in-delay" style={{ '--i': 5, background: 'white', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--navy)', fontSize: 16 }}>Cases by Status</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusStats} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} label>
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Cases Table */}
      <div className="animate-in-delay" style={{ '--i': 6, background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, color: 'var(--navy)', fontSize: 16 }}>Recent Cases</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 24px', fontWeight: 600 }}>Case ID</th>
                <th style={{ padding: '12px 24px', fontWeight: 600 }}>Client</th>
                <th style={{ padding: '12px 24px', fontWeight: 600 }}>Bank</th>
                <th style={{ padding: '12px 24px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 24px', fontWeight: 600 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--navy)' }}>{c.caseId}</td>
                  <td style={{ padding: '12px 24px' }}>{c.clientId?.name || 'N/A'}</td>
                  <td style={{ padding: '12px 24px' }}>{c.bank}</td>
                  <td style={{ padding: '12px 24px' }}>
                    <span style={{ background: getStatusColor(c.status) + '20', color: getStatusColor(c.status), padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 24px', color: 'var(--muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, bg, color, delay }) {
  return (
    <div className="animate-in-delay" style={{ '--i': delay, background: bg, padding: 24, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div style={{ color: color, fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>{title}</div>
      <div style={{ color: bg === '#1a2744' ? 'var(--gold)' : color, fontSize: 36, fontWeight: 700, fontFamily: 'Playfair Display' }}>
        {value}
      </div>
    </div>
  );
}