import { useState, useEffect } from 'react';
import { DEMO_MODE, MOCK_TSR_PENDING } from '../data/mockData';
import API from '../api/axios';

export default function Approvals() {
  const role = localStorage.getItem('role');
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [notes, setNotes] = useState('');
  const [actionDone, setActionDone] = useState({});

  useEffect(() => {
    // --- REAL API ---
    const token = localStorage.getItem('token');
    const fetchPending = async () => {
      if (role !== 'senior') return;
      try {
        const { default: axios } = await import('axios');
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';
        const res = await axios.get(`${backendUrl}/api/approvals/pending`, { headers: { Authorization: `Bearer ${token}` } });
        setPending(res.data.pending || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchPending();
  }, []);

  if (role !== 'senior') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 24, color: 'var(--navy)' }}>Access Denied</div>
        <div style={{ color: 'var(--muted)' }}>Only NLK Sir can view approvals.</div>
      </div>
    );
  }

  const handleAction = async (id, action) => {
    if (DEMO_MODE) {
      setActionDone(prev => ({ ...prev, [id]: action }));
      setExpandedId(null);
      setNotes('');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const endpoint = action === 'approve' ? `/approvals/${id}/approve` : `/approvals/${id}/reject`;
      const res = await API.post(endpoint, { notes }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setActionDone(prev => ({ ...prev, [id]: action }));
        setExpandedId(null);
        setNotes('');
        alert(`✅ TSR successfully ${action === 'approve' ? 'approved' : 'rejected'}`);
      } else {
        alert(`❌ Action failed: ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const activePending = pending.filter(item => !actionDone[item._id]);

  return (
    <div className="animate-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: 28, color: 'var(--navy)', margin: 0 }}>Approval Queue</h1>
        <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>{activePending.length} reports pending your review</p>
      </div>

      {loading ? (
        <div style={{ padding: 40, color: 'var(--muted)', textAlign: 'center' }}>Loading...</div>
      ) : activePending.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: 48, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: 'var(--navy)' }}>You're all caught up!</div>
          <div style={{ color: 'var(--muted)', marginTop: 8 }}>No pending reports to review.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {activePending.map((item) => {
            const isExpanded = expandedId === item._id;
            return (
              <div key={item._id} style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                
                {/* Card Header */}
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>{item.caseId?.caseId}</span>
                      <span style={{ background: '#ffedd5', color: '#ea580c', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Under Review</span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text)' }}>
                      <strong>{item.caseId?.clientId?.name}</strong> • {item.caseId?.bank}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                      Submitted: {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button onClick={() => setExpandedId(isExpanded ? null : item._id)} style={{ background: isExpanded ? 'var(--bg)' : 'var(--navy)', color: isExpanded ? 'var(--navy)' : 'white', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    {isExpanded ? 'Close' : 'Review'}
                  </button>
                </div>

                {/* Expanded Panel */}
                {isExpanded && (
                  <div className="animate-in" style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: '#fafafa' }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>TSR Draft Content</div>
                    <pre style={{ background: 'white', padding: 20, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'monospace', whiteSpace: 'pre-wrap', maxHeight: 400, overflowY: 'auto', marginBottom: 20 }}>
                      {item.draftContent}
                    </pre>

                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Review Notes</div>
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes for the advocate if requesting changes..." style={{ width: '100%', border: '1px solid var(--border)', padding: '12px', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 80, boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                      <button onClick={() => handleAction(item._id, 'reject')} style={{ background: 'white', color: '#dc2626', border: '1px solid #dc2626', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                        🔄 Request Changes
                      </button>
                      <button onClick={() => handleAction(item._id, 'approve')} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                        ✅ Approve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
