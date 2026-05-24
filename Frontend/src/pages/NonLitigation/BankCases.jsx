import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DEMO_MODE, MOCK_CASES } from '../../data/mockData';

const BANK_META = {
  icici:          { name: 'ICICI Bank',      color: '#f97316', bg: '#fff7ed', icon: '🏦' },
  'aditya-birla': { name: 'Aditya Birla',   color: '#8b5cf6', bg: '#f5f3ff', icon: '🏢' },
  bajaj:          { name: 'Bajaj Finserv',   color: '#ef4444', bg: '#fef2f2', icon: '⚡' },
};

const STATUS_STYLES = {
  created:        { bg: '#f1f5f9', color: '#475569', label: 'Created' },
  assigned:       { bg: '#dbeafe', color: '#1d4ed8', label: 'Assigned' },
  in_progress:    { bg: '#fef3c7', color: '#d97706', label: 'In Progress' },
  draft_ready:    { bg: '#ede9fe', color: '#7c3aed', label: 'Draft Ready' },
  under_review:   { bg: '#ffedd5', color: '#ea580c', label: 'Under Review' },
  approved:       { bg: '#dcfce7', color: '#16a34a', label: 'Approved' },
  shared_to_bank: { bg: '#cffafe', color: '#0e7490', label: 'Shared' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.created;
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
}

export default function BankCases() {
  const { bank } = useParams();
  const navigate = useNavigate();
  const meta = BANK_META[bank] || { name: bank, color: '#1a2744', bg: '#f1f5f9', icon: '🏦' };
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const role = localStorage.getItem('role');

  useEffect(() => {
    // --- REAL API ---
    const token = localStorage.getItem('token');
    const fetchCases = async () => {
      try {
        const { default: axios } = await import('axios');
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';
        const res = await axios.get(`${backendUrl}/api/cases?bank=${encodeURIComponent(meta.name)}`, { headers: { Authorization: `Bearer ${token}` } });
        setCases(res.data.cases || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchCases();
  }, [bank]);

  const filtered = filter === 'all' ? cases : cases.filter(c => c.status === filter);
  const statusKeys = ['all', 'created', 'assigned', 'in_progress', 'draft_ready', 'under_review', 'approved', 'shared_to_bank'];

  return (
    <div className="animate-in">
      {/* Bank Header Card */}
      <div style={{ background: meta.bg, border: `1px solid ${meta.color}22`, borderRadius: 12,
        padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 40 }}>{meta.icon}</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 700, color: 'var(--navy)' }}>{meta.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{cases.length} total cases</div>
          </div>
        </div>
        {role === 'admin' && (
          <button onClick={() => navigate('/cases/new')}
            style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '10px 20px',
              borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            + New Case
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {statusKeys.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: filter === s ? 'var(--navy)' : 'white',
              color: filter === s ? 'white' : 'var(--muted)',
              boxShadow: filter === s ? 'none' : '0 1px 3px rgba(0,0,0,0.08)' }}>
            {s === 'all' ? 'All' : STATUS_STYLES[s]?.label || s}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>
              ({s === 'all' ? cases.length : cases.filter(c => c.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Cases Table */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Loading cases...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: 'var(--navy)' }}>No cases found</div>
            <div style={{ color: 'var(--muted)', marginTop: 8 }}>
              {role === 'admin' ? 'Create the first case for this bank.' : 'No cases assigned yet.'}
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Case ID', 'Client', 'Property', 'Status', 'Assigned To', 'Date', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11,
                    fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c._id} style={{ borderTop: '1px solid var(--border)',
                  animation: `fadeSlideUp 0.3s ease forwards`, animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{c.caseId}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.clientId?.name || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--muted)', maxWidth: 180 }}>{c.propertyId?.address || '—'}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={c.status} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{c.assignedTo || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--muted)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link to={`/cases/${c._id}`}
                      style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
