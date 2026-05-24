import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DEMO_MODE, MOCK_CASES } from '../../data/mockData';

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

export default function CaseList() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');

  useEffect(() => {
    // --- REAL API ---
    const token = localStorage.getItem('token');
    const fetchCases = async () => {
      try {
        const { default: axios } = await import('axios');
        const res = await axios.get(`http://localhost:5555/api/cases`, { headers: { Authorization: `Bearer ${token}` } });
        setCases(res.data.cases || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchCases();
  }, []);

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: 28, color: 'var(--navy)', margin: 0 }}>All Cases</h1>
        {role === 'admin' && (
          <button onClick={() => navigate('/cases/new')} style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            + New Case
          </button>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Loading cases...</div>
        ) : cases.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: 'var(--navy)' }}>No cases found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Case ID', 'Client', 'Property', 'Bank', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => (
                <tr key={c._id} style={{ borderTop: '1px solid var(--border)', animation: `fadeSlideUp 0.3s ease forwards`, animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{c.caseId}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.clientId?.name || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--muted)', maxWidth: 180 }}>{c.propertyId?.address || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.bank}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={c.status} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--muted)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link to={`/cases/${c._id}`} style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>View →</Link>
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
