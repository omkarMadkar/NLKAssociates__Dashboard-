import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_MODE, MOCK_CASES } from '../data/mockData';
import API from '../api/axios';

function StatusBadge({ status }) {
  const styles = {
    approved:       { bg: '#dcfce7', color: '#16a34a', label: 'Approved' },
    shared_to_bank: { bg: '#cffafe', color: '#0e7490', label: 'Shared to Bank' },
  };
  const s = styles[status] || { bg: '#f1f5f9', color: '#475569', label: status };
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
}

export default function Reports() {
  const [approvedCases, setApprovedCases] = useState([]);
  const [sharedCases, setSharedCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      setApprovedCases(MOCK_CASES.filter(c => c.status === 'approved'));
      setSharedCases(MOCK_CASES.filter(c => c.status === 'shared_to_bank'));
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const fetchReports = async () => {
      try {
        const [appRes, shRes] = await Promise.all([
          API.get('/cases?status=approved', { headers: { Authorization: `Bearer ${token}` } }),
          API.get('/cases?status=shared_to_bank', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setApprovedCases(appRes.data.cases || []);
        setSharedCases(shRes.data.cases || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  const handleShare = async (id) => {
    if (DEMO_MODE) {
      setApprovedCases(prev => prev.filter(c => c._id !== id));
      alert('✅ Case marked as shared to bank! (Demo mode)');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await API.put(`/cases/${id}/status`, { status: 'shared_to_bank' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setApprovedCases(prev => prev.filter(c => c._id !== id));
        const sharedCase = approvedCases.find(c => c._id === id);
        if (sharedCase) {
          setSharedCases(prev => [
            { ...sharedCase, status: 'shared_to_bank', updatedAt: new Date().toISOString() },
            ...prev
          ]);
        }
        alert('✅ Case marked as shared to bank!');
      } else {
        alert(`❌ Failed to share: ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert(`❌ Error sharing case: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div style={{ padding: 40, color: 'var(--muted)' }}>Loading...</div>;

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: 28, color: 'var(--navy)', margin: '0 0 8px 0' }}>Reports & Sharing</h1>
        <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>Generate final PDFs and share approved reports with banks.</p>
      </div>

      {/* Ready to Share */}
      <div>
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: 20, color: 'var(--navy)', marginBottom: 16 }}>Ready to Share (Approved)</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {approvedCases.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>No approved cases ready to share.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Case ID', 'Client', 'Bank', 'Approved Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {approvedCases.map((c) => (
                  <tr key={c._id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{c.caseId}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.clientId?.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.bank}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{new Date(c.updatedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px', display: 'flex', gap: 8 }}>
                      <button onClick={() => alert('📄 PDF generation is a Phase 2 feature.')} style={{ background: 'white', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        📄 PDF
                      </button>
                      <button onClick={() => handleShare(c._id)} style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        🏦 Share
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Shared History */}
      <div>
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: 20, color: 'var(--navy)', marginBottom: 16 }}>Shared History</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {sharedCases.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>No cases have been shared yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Case ID', 'Client', 'Bank', 'Shared Date', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sharedCases.map((c) => (
                  <tr key={c._id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{c.caseId}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.clientId?.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.bank}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{new Date(c.updatedAt).toLocaleDateString()}</td>
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
    </div>
  );
}
