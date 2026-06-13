import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DEMO_MODE, MOCK_CASES, MOCK_DOCUMENTS } from '../../data/mockData';
import API from '../../api/axios';

const STATUS_STYLES = {
  created:        { bg: '#f1f5f9', color: '#475569', label: 'Created' },
  assigned:       { bg: '#dbeafe', color: '#1d4ed8', label: 'Assigned' },
  in_progress:    { bg: '#fef3c7', color: '#d97706', label: 'In Progress' },
  draft_ready:    { bg: '#ede9fe', color: '#7c3aed', label: 'Draft Ready' },
  under_review:   { bg: '#fee2e2', color: '#dc2626', label: 'Under Review' },
  approved:       { bg: '#dcfce7', color: '#16a34a', label: 'Approved' },
  shared_to_bank: { bg: '#cffafe', color: '#0e7490', label: 'Shared to Bank' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.created;
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const [caseData, setCaseData] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [docType, setDocType] = useState('Sale Deed');

  const STATUS_STEPS = Object.keys(STATUS_STYLES);

  useEffect(() => {
    if (DEMO_MODE) {
      const found = MOCK_CASES.find(c => c._id === id);
      setCaseData(found || MOCK_CASES[0]);
      setDocs(MOCK_DOCUMENTS[id] || MOCK_DOCUMENTS['case001']);
      setLoading(false);
      return;
    }
    // --- REAL API ---
    const token = localStorage.getItem('token');
    const fetchCase = async () => {
      try {
        const [caseRes, docsRes] = await Promise.all([
          API.get(`/cases/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          API.get(`/documents/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCaseData(caseRes.data.case);
        setDocs(docsRes.data.documents || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchCase();
  }, [id]);

  const handleUpload = async () => {
    if (!fileToUpload) return;
    if (DEMO_MODE) {
      const newDoc = {
        _id: `demo_${Date.now()}`,
        originalName: fileToUpload.name,
        docType,
        fileSize: fileToUpload.size,
        filePath: '',
      };
      setDocs(prev => [...prev, newDoc]);
      setFileToUpload(null);
      alert(`✅ "${fileToUpload.name}" uploaded successfully! (Demo mode)`);
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('docType', docType);

    try {
      const res = await API.post(`/documents/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        setDocs(prev => [res.data.document, ...prev]);
        setFileToUpload(null);
        alert(`✅ "${fileToUpload.name}" uploaded successfully!`);
      } else {
        alert(`❌ Upload failed: ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert(`❌ Error uploading file: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (DEMO_MODE) {
      setCaseData(prev => ({ ...prev, status: newStatus }));
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await API.put(`/cases/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCaseData(prev => ({ ...prev, status: newStatus }));
        alert(`✅ Case status updated to ${STATUS_STYLES[newStatus].label}`);
      } else {
        alert(`❌ Failed to update status: ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert(`❌ Error updating status: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div style={{ padding: 40, color: 'var(--muted)' }}>Loading...</div>;
  if (!caseData) return <div style={{ padding: 40 }}>Case not found</div>;

  const currentStepIndex = STATUS_STEPS.indexOf(caseData.status);

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '0 auto' }}>

      {/* Header Bar */}
      <div style={{ background: 'white', borderRadius: 12, padding: '24px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{caseData.caseId}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <StatusBadge status={caseData.status} />
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>•</span>
            <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14 }}>{caseData.bank}</span>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>•</span>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>Created: {new Date(caseData.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        {role === 'admin' && (
          <select value={caseData.status} onChange={handleStatusChange}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', outline: 'none', background: 'var(--bg)', fontWeight: 600 }}>
            {STATUS_STEPS.map(s => <option key={s} value={s}>{STATUS_STYLES[s].label}</option>)}
          </select>
        )}
      </div>

      {/* Status Timeline */}
      <div style={{ background: 'white', borderRadius: 12, padding: '24px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', minWidth: 600 }}>
          <div style={{ position: 'absolute', top: 12, left: 20, right: 20, height: 2, background: 'var(--border)', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: 12, left: 20, width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`, height: 2, background: 'var(--navy)', transition: 'width 0.3s ease', zIndex: 0 }} />
          {STATUS_STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1, width: 80 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: i <= currentStepIndex ? 'var(--navy)' : '#fff', border: `2px solid ${i <= currentStepIndex ? 'var(--navy)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i <= currentStepIndex && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
              </div>
              <div style={{ fontSize: 11, fontWeight: i <= currentStepIndex ? 600 : 400, color: i <= currentStepIndex ? 'var(--navy)' : 'var(--muted)', textAlign: 'center', lineHeight: 1.2 }}>
                {STATUS_STYLES[s].label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Left: Client & Property */}
        <div style={{ flex: '6', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: 0, marginBottom: 16, color: 'var(--navy)', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Client Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Name</div><div style={{ fontWeight: 600 }}>{caseData.clientId?.name}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Phone</div><div>{caseData.clientId?.phone}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Email</div><div>{caseData.clientId?.email || '—'}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Address</div><div>{caseData.clientId?.address || '—'}</div></div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: 0, marginBottom: 16, color: 'var(--navy)', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Property Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1/-1' }}><div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Address</div><div style={{ fontWeight: 600 }}>{caseData.propertyId?.address}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Survey No.</div><div>{caseData.propertyId?.surveyNo || '—'}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Village</div><div>{caseData.propertyId?.village || '—'}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Taluka</div><div>{caseData.propertyId?.taluka || '—'}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>District</div><div>{caseData.propertyId?.district || '—'}</div></div>
            </div>
          </div>
        </div>

        {/* Right: Documents */}
        <div style={{ flex: '4', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: 0, marginBottom: 16, color: 'var(--navy)', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Documents</h3>

            <div style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: '20px', textAlign: 'center', marginBottom: 20, background: 'var(--bg)' }}>
              <select value={docType} onChange={e => setDocType(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '8px', borderRadius: 4, border: '1px solid var(--border)' }}>
                {['Sale Deed', 'Agreement', 'Search Receipt', 'Tax Receipt', 'OC', 'GRAS Challan', 'General'].map(t => <option key={t}>{t}</option>)}
              </select>
              <input type="file" id="file-upload" onChange={e => setFileToUpload(e.target.files[0])} style={{ display: 'none' }} />
              <label htmlFor="file-upload" style={{ display: 'inline-block', padding: '8px 16px', background: 'white', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>
                {fileToUpload ? fileToUpload.name : 'Choose file to upload'}
              </label>
              {fileToUpload && (
                <button onClick={handleUpload} style={{ display: 'block', width: '100%', marginTop: 12, padding: '8px', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                  Upload
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {docs.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>No documents uploaded</div>}
              {docs.map(d => (
                <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{d.originalName}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                      <span style={{ background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>{d.docType}</span> • {(d.fileSize / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5555'}/uploads/${d.filePath.split('/').pop().split('\\').pop()}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Download</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
        {(role === 'staff' || role === 'senior' || role === 'admin') && (
          <button onClick={() => navigate(`/tsr/${id}`)} style={{ background: 'var(--navy)', color: 'var(--gold)', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Playfair Display' }}>
            ✨ View / Generate TSR
          </button>
        )}
        {role === 'senior' && caseData.status === 'under_review' && (
          <button onClick={() => navigate('/approvals')} style={{ background: 'var(--gold)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Go to Approvals
          </button>
        )}
      </div>
    </div>
  );
}
