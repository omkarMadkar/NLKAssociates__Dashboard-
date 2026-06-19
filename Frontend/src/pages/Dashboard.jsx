import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DEMO_MODE, MOCK_DASHBOARD } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';
import { Briefcase, Clock, CheckCircle, Landmark, TrendingUp, Database} from 'lucide-react';

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
  const COLORS = ['#000000', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'created': return '#64748b';
      case 'assigned': return '#3b82f6';
      case 'in_progress': return '#f59e0b';
      case 'draft_ready': return '#a855f7';
      case 'under_review': return '#dc2626';
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
          {role === 'admin' && (
            <button onClick={() => navigate('/masterDb')} style={{ background: 'var(--navy)', color: 'white', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <Database/>
                Master Database
              </div>
            </button>
          )}
          {role === 'senior' && (
            <button onClick={() => navigate('/approvals')} style={{ background: 'var(--black)', color: 'white', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              📋 View Approvals
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <StatCard 
          title="Total Cases" 
          value={stats.totalCases} 
          accentColor="#1e293b" 
          icon={<Briefcase size={20} color="#1e293b" />} 
          iconBg="#f1f5f9"
          subtitle="Cases in database"
          delay={0} 
        />
        <StatCard 
          title="Pending Approval" 
          value={stats.pendingApproval} 
          accentColor="#1e293b" 
          icon={<Clock size={20} color="#1e293b" />} 
          iconBg="#f1f5f9"
          subtitle="Awaiting review"
          delay={1} 
        />
        <StatCard 
          title="Approved Today" 
          value={stats.approvedToday} 
          accentColor="#1e293b" 
          icon={<CheckCircle size={20} color="#1e293b" />} 
          iconBg="#f1f5f9"
          subtitle="Completed today"
          delay={2} 
        />
        <StatCard 
          title="Active Banks" 
          value={stats.activeBanks} 
          accentColor="#1e293b" 
          icon={<Landmark size={20} color="#1e293b" />} 
          iconBg="#f1f5f9"
          subtitle="Integrated bank partners"
          delay={3} 
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        <div className="animate-in-delay" style={{ '--i': 4, background: 'white', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--navy)', fontSize: 16 }}>Cases by Bank</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bankStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#475569" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(8px)', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: 12, 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' 
                  }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="animate-in-delay" style={{ '--i': 5, background: 'white', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--navy)', fontSize: 16 }}>Cases by Status</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={statusStats} 
                  dataKey="count" 
                  nameKey="_id" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={85} 
                  paddingAngle={3}
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(8px)', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: 12, 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' 
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: '#64748b', textTransform: 'capitalize', paddingTop: 10 }}
                  formatter={(value) => value.replace(/_/g, ' ')}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Cases Table */}
      <div className="animate-in-delay" style={{ '--i': 6, background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--navy)', fontSize: 16 }}>Recent Cases</h3>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>Showing latest entries</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Case ID</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Client</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Bank</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Status</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                    <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                      {c.caseId}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#334155', fontWeight: 500 }}>{c.clientId?.name || 'N/A'}</td>
                  <td style={{ padding: '16px 24px', color: '#475569' }}>{c.bank}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      background: getStatusColor(c.status) + '15', 
                      color: getStatusColor(c.status), 
                      padding: '4px 10px', 
                      borderRadius: 20, 
                      fontSize: 12, 
                      fontWeight: 600, 
                      textTransform: 'capitalize',
                      border: `1px solid ${getStatusColor(c.status)}30`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: getStatusColor(c.status) }} />
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#64748b' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, accentColor, icon, iconBg, subtitle, delay }) {
  return (
    <div className="animate-in-delay" style={{ 
      '--i': delay, 
      background: 'white', 
      padding: '24px 28px', 
      borderRadius: 16, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 12, 
      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05), 0 2px 6px -1px rgba(0,0,0,0.02)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.03)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(0,0,0,0.05), 0 2px 6px -1px rgba(0,0,0,0.02)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2 }}>{title}</div>
        <div style={{ 
          background: iconBg, 
          padding: 8, 
          borderRadius: 12, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {icon}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ color: '#0f172a', fontSize: 36, fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>
          {value}
        </div>
        <div style={{ color: '#94a3b8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrendingUp size={12} color="#94a3b8" />
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
}