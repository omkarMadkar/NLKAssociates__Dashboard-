import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_MODE, MOCK_CASES } from '../data/mockData';

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

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [bank, setBank] = useState('');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);

    // --- REAL API ---
    const token = localStorage.getItem('token');
    const doSearch = async () => {
      try {
        const qBank = bank ? `&bank=${bank}` : '';
        const qStatus = status ? `&status=${status}` : '';
        const { default: axios } = await import('axios');
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';
        const res = await axios.get(`${backendUrl}/api/cases?search=${query}${qBank}${qStatus}`, { headers: { Authorization: `Bearer ${token}` } });
        setResults(res.data.cases || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    doSearch();
  };

  const handleClear = () => {
    setQuery(''); setBank(''); setStatus('');
    setResults([]); setSearched(false);
  };

  const inputStyle = { border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none' };

  return (
    <div className="animate-in">
      {/* Search Header */}
      <div style={{ background: 'white', borderRadius: 12, padding: '24px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: 24, color: 'var(--navy)', margin: '0 0 20px 0' }}>Search & Filter</h1>
        
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by Case ID, client name, property..." style={{ ...inputStyle, flex: 1, fontSize: 16, padding: '14px 20px' }} />
            <button type="submit" style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '0 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Search
            </button>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <select value={bank} onChange={e => setBank(e.target.value)} style={{ ...inputStyle, width: 200 }}>
              <option value="">All Banks</option>
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="Aditya Birla">Aditya Birla</option>
              <option value="Bajaj Finserv">Bajaj Finserv</option>
            </select>

            <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, width: 200 }}>
              <option value="">All Statuses</option>
              <option value="created">Created</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="draft_ready">Draft Ready</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="shared_to_bank">Shared</option>
            </select>

            <button type="button" onClick={handleClear} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 14, fontWeight: 600, textDecoration: 'underline' }}>
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
            Showing {results.length} results
          </div>

          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Searching...</div>
            ) : results.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <div style={{ fontFamily: 'Playfair Display', fontSize: 20, color: 'var(--navy)' }}>No results found</div>
                <div style={{ color: 'var(--muted)', marginTop: 8 }}>Try adjusting your search terms or filters.</div>
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
                  {results.map((c) => (
                    <tr key={c._id} style={{ borderTop: '1px solid var(--border)' }}>
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
      )}
    </div>
  );
}
