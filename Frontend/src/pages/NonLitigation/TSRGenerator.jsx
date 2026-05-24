import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DEMO_MODE, MOCK_CASES, MOCK_DOCUMENTS, MOCK_TSR_BY_CASE } from '../../data/mockData';
import API from '../../api/axios';

const STATUS_STYLES = {
  draft:     { bg: '#f1f5f9', color: '#475569', label: 'Draft' },
  submitted: { bg: '#fef3c7', color: '#d97706', label: 'Submitted' },
  approved:  { bg: '#dcfce7', color: '#16a34a', label: 'Approved' },
  rejected:  { bg: '#fee2e2', color: '#dc2626', label: 'Changes Requested' },
};

export default function TSRGenerator() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [docs, setDocs] = useState([]);
  const [tsr, setTsr] = useState(null);
  const [draftContent, setDraftContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (DEMO_MODE) {
      const found = MOCK_CASES.find(c => c._id === caseId) || MOCK_CASES[0];
      setCaseData(found);
      setDocs(MOCK_DOCUMENTS[caseId] || []);
      const existingTsr = MOCK_TSR_BY_CASE[caseId];
      if (existingTsr) {
        setTsr(existingTsr);
        setDraftContent(existingTsr.draftContent);
      }
      return;
    }

    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const [caseRes, docsRes, tsrRes] = await Promise.all([
          API.get(`/cases/${caseId}`, { headers: { Authorization: `Bearer ${token}` } }),
          API.get(`/documents/${caseId}`, { headers: { Authorization: `Bearer ${token}` } }),
          API.get(`/tsr/${caseId}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCaseData(caseRes.data.case);
        setDocs(docsRes.data.documents || []);
        if (tsrRes.data.success && tsrRes.data.tsr) {
          setTsr(tsrRes.data.tsr);
          setDraftContent(tsrRes.data.tsr.draftContent);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [caseId]);

  const handleGenerate = async () => {
    setGenerating(true);
    if (DEMO_MODE) {
      setTimeout(() => {
        const mockDraft = `TITLE SEARCH REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. REPORT PARTICULARS
   Case ID         : ${caseData?.caseId}
   Client Name     : ${caseData?.clientId?.name}
   Bank            : ${caseData?.bank}
   Report Prepared By: NLK Associates
   Date of Report  : ${new Date().toLocaleDateString('en-IN')}

2. PROPERTY DESCRIPTION
   Survey No.      : ${caseData?.propertyId?.surveyNo || 'N/A'}
   Address         : ${caseData?.propertyId?.address || 'N/A'}
   Village         : ${caseData?.propertyId?.village || 'N/A'}
   Taluka          : ${caseData?.propertyId?.taluka || 'N/A'}
   District        : ${caseData?.propertyId?.district || 'N/A'}

3. OWNERSHIP HISTORY (Last 30 Years)
   • 1995 – Original registered owner (Sale Deed, Regn. No. 1001)
   • 2010 – Transferred via Gift Deed (Regn. No. 3452)
   • 2022 – Purchased by ${caseData?.clientId?.name} (Sale Deed)
   • No disputed ownership chain noted.

4. ENCUMBRANCES & CHARGES
   • No encumbrances found in search period.
   • Property is free from registered mortgages.
   • EC Certificate obtained for 30 years.

5. LEGAL OBSERVATIONS
   • Title documents are in order.
   • Mutation in revenue records is complete.
   • No stay or court attachment found.

6. TITLE OPINION
   The title of the subject property is CLEAR and MARKETABLE.
   It is hereby opined that the property is fit for mortgage
   purposes in favor of ${caseData?.bank}. All documents are in
   order and no legal impediment has been found.

Signed & Sealed,
NLK Associates — Advocates & Legal Consultants
`;
        const newTsr = { _id: `tsr_demo_${Date.now()}`, status: 'draft', version: 1, draftContent: mockDraft };
        setTsr(newTsr);
        setDraftContent(mockDraft);
        setGenerating(false);
      }, 2500);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await API.post(`/tsr/generate/${caseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.tsr) {
        setTsr(res.data.tsr);
        setDraftContent(res.data.tsr.draftContent);
        alert('✨ AI Draft generated successfully!');
      } else {
        alert(`❌ AI generation failed: ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert(`❌ Error generating AI draft: ${err.response?.data?.message || err.message}`);
    }
    setGenerating(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (DEMO_MODE) {
      setTimeout(() => {
        setTsr(prev => ({ ...prev, draftContent }));
        setSaving(false);
        alert('💾 Draft saved! (Demo mode)');
      }, 800);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await API.put(`/tsr/${tsr._id}`, { draftContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.tsr) {
        setTsr(res.data.tsr);
        alert('💾 Draft saved successfully!');
      } else {
        alert(`❌ Failed to save draft: ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert(`❌ Error saving draft: ${err.response?.data?.message || err.message}`);
    }
    setSaving(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    if (DEMO_MODE) {
      setTimeout(() => {
        setTsr(prev => ({ ...prev, status: 'submitted' }));
        setSubmitting(false);
        alert('📤 Submitted to NLK Sir successfully! (Demo mode)');
        navigate(`/cases/${caseId}`);
      }, 1000);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await API.post(`/tsr/${tsr._id}/submit`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.tsr) {
        setTsr(res.data.tsr);
        alert('📤 Submitted to NLK Sir successfully!');
        navigate(`/cases/${caseId}`);
      } else {
        alert(`❌ Failed to submit: ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert(`❌ Error submitting TSR: ${err.response?.data?.message || err.message}`);
    }
    setSubmitting(false);
  };

  if (!caseData) return <div style={{ padding: 40, color: 'var(--muted)' }}>Loading...</div>;

  const statusStyle = tsr ? (STATUS_STYLES[tsr.status] || STATUS_STYLES.draft) : STATUS_STYLES.draft;

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '0 auto' }}>

      {/* Top Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
        {/* Case Info */}
        <div style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: 22, color: 'var(--navy)', margin: '0 0 16px 0' }}>Title Search Report Generator</h2>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Case ID</div>
              <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>{caseData.caseId}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Client</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{caseData.clientId?.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Bank</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{caseData.bank}</div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Property</div>
            <div style={{ fontSize: 13, color: 'var(--text)' }}>{caseData.propertyId?.address}</div>
          </div>
        </div>

        {/* Docs Reference */}
        <div style={{ background: 'white', borderRadius: 12, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px 0' }}>Referenced Docs ({docs.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 140, overflowY: 'auto' }}>
            {docs.map(d => (
              <div key={d._id} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>📄</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.originalName}</span>
              </div>
            ))}
            {docs.length === 0 && <div style={{ fontSize: 12, color: 'var(--muted)' }}>No docs uploaded</div>}
          </div>
        </div>
      </div>

      {/* Main Draft Area */}
      <div style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={handleGenerate} disabled={generating}
              style={{ background: 'var(--gold)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer', fontFamily: 'Playfair Display' }}>
              {generating ? '🤖 Generating...' : '✨ Generate AI Draft'}
            </button>
            {generating && <span style={{ color: 'var(--muted)', fontSize: 14 }}>🤖 AI is analyzing documents...</span>}
          </div>
          {tsr && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', background: 'var(--bg)', padding: '4px 10px', borderRadius: 12 }}>Version {tsr.version}</span>
              <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                {statusStyle.label}
              </span>
            </div>
          )}
        </div>

        <textarea
          value={draftContent}
          onChange={(e) => setDraftContent(e.target.value)}
          placeholder="Click '✨ Generate AI Draft' to generate a TSR, or type manually..."
          style={{ width: '100%', minHeight: 500, padding: 20, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'monospace', fontSize: 14, lineHeight: 1.6, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
        />

        {tsr && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button onClick={handleSave} disabled={saving} style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button onClick={handleSubmit} disabled={submitting || tsr.status === 'submitted' || tsr.status === 'approved'}
              style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: (tsr.status === 'submitted' || tsr.status === 'approved') ? 0.5 : 1 }}>
              {submitting ? 'Submitting...' : '📤 Submit to NLK Sir'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
