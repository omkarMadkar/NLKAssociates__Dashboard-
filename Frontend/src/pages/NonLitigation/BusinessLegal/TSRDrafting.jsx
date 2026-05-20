import { useState } from 'react';
import { MOCK_TSR_DRAFTS, MOCK_CASES } from '../../../data/mockData';

const STATUS_STYLES = {
  draft:     { bg: '#f1f5f9', color: '#475569', label: 'Draft' },
  submitted: { bg: '#fef3c7', color: '#d97706', label: 'Submitted' },
  approved:  { bg: '#dcfce7', color: '#16a34a', label: 'Approved' },
  rejected:  { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.draft;
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
}

const TEMPLATES = {
  standard: `TITLE SEARCH REPORT — STANDARD TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TSR Reference No : [Auto-Generated]
Application No   : [Select Case above]
Prepared By      : NLK Associates
Date             : ${new Date().toLocaleDateString('en-IN')}

1. PROPERTY DESCRIPTION
   Address         : 
   Survey No.      : 
   Village         : 
   Taluka          : 
   District        : 

2. OWNERSHIP HISTORY (Last 30 Years)
   • [Year] – [Owner Name] ([Deed Type])

3. ENCUMBRANCES & CHARGES
   • [None / Details]

4. LEGAL OBSERVATIONS
   • 

5. TITLE OPINION
   The title is CLEAR and MARKETABLE.

Signed & Sealed,
NLK Associates — Advocates & Legal Consultants`,

  residential: `TITLE SEARCH REPORT — RESIDENTIAL TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TSR Reference No : [Auto-Generated]
Applicant        : [Select Case above]
Property Type    : Residential
Date             : ${new Date().toLocaleDateString('en-IN')}

RESIDENTIAL PROPERTY DETAILS:
   Address        : 
   Built-up Area  : ___ Sq.Ft.
   Floor          : 
   Society Name   : 

OWNERSHIP CHAIN:
   • 

ENCUMBRANCES: None found.

LEGAL OPINION: CLEAR Title. Fit for residential mortgage.

NLK Associates — Advocates & Legal Consultants`,

  commercial: `TITLE SEARCH REPORT — COMMERCIAL TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TSR Reference No : [Auto-Generated]
Applicant        : [Select Case above]
Property Type    : Commercial
Date             : ${new Date().toLocaleDateString('en-IN')}

COMMERCIAL PROPERTY DETAILS:
   Address        : 
   Carpet Area    : ___ Sq.Ft.
   Usage          : Office / Shop / Warehouse
   Zone           : 

OWNERSHIP CHAIN:
   • 

ENCUMBRANCES: None found.

LEGAL OPINION: CLEAR Title. Fit for commercial mortgage.

NLK Associates — Advocates & Legal Consultants`,
};

export default function TSRDrafting() {
  const [selectedCase, setSelectedCase] = useState('');
  const [templateType, setTemplateType] = useState('Standard TSR Template');
  const [draftContent, setDraftContent] = useState('');
  const [drafts, setDrafts] = useState(MOCK_TSR_DRAFTS);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [counter, setCounter] = useState(drafts.length + 1);

  const caseObj = MOCK_CASES.find(c => c._id === selectedCase);
  const refNo = selectedCase ? `TSR${String(counter).padStart(3, '0')}` : '';

  const handleQuickTemplate = (type) => {
    setDraftContent(TEMPLATES[type]);
    setTemplateType(type === 'standard' ? 'Standard TSR Template' : type === 'residential' ? 'Residential TSR Template' : 'Commercial TSR Template');
  };

  const handleGenerate = () => {
    if (!selectedCase) { alert('Please select a case first.'); return; }
    setGenerating(true);
    setTimeout(() => {
      const ai = `TITLE SEARCH REPORT — AI GENERATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TSR Reference No : ${refNo}
Application No   : ${caseObj?.caseId}
Applicant Name   : ${caseObj?.clientId?.name}
Bank             : ${caseObj?.bank}
Prepared By      : NLK Associates — AI Assisted
Date             : ${new Date().toLocaleDateString('en-IN')}

1. PROPERTY DESCRIPTION
   Address         : ${caseObj?.propertyId?.address}
   Survey No.      : ${caseObj?.propertyId?.surveyNo}
   Village         : ${caseObj?.propertyId?.village}
   Taluka          : ${caseObj?.propertyId?.taluka}
   District        : ${caseObj?.propertyId?.district}

2. OWNERSHIP HISTORY (Last 30 Years)
   • 1998 – Original owner (Regn. No. 1001)
   • 2012 – Transferred via Gift Deed (Regn. No. 3452)
   • 2022 – Purchased by ${caseObj?.clientId?.name} (Sale Deed)

3. ENCUMBRANCES & CHARGES
   • No encumbrances found in the search period.
   • Property is free from any registered mortgages.

4. LEGAL OBSERVATIONS
   • Title documents are in order.
   • Mutation in Revenue records is complete.
   • No stay, injunction or court attachment found.

5. TITLE OPINION
   The title of the subject property is CLEAR and MARKETABLE.
   Property is fit for mortgage in favor of ${caseObj?.bank}.

Signed & Sealed,
NLK Associates — Advocates & Legal Consultants`;
      setDraftContent(ai);
      setGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    if (!draftContent.trim()) { alert('Draft content is empty.'); return; }
    setSaving(true);
    setTimeout(() => {
      const newDraft = {
        _id: `draft_${Date.now()}`,
        tsrRefNo: refNo || `TSR${String(counter).padStart(3, '0')}`,
        appId: caseObj?.caseId || 'Manual',
        applicant: caseObj?.clientId?.name || 'Manual Entry',
        templateType,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: draftContent,
      };
      setDrafts(p => [newDraft, ...p]);
      setCounter(c => c + 1);
      setSaving(false);
      alert('✅ Draft saved successfully!');
    }, 800);
  };

  const handleSubmit = () => {
    if (!draftContent.trim()) { alert('Draft content is empty.'); return; }
    setSubmitting(true);
    setTimeout(() => {
      setDrafts(p => [{ _id: `draft_${Date.now()}`, tsrRefNo: refNo, appId: caseObj?.caseId || 'Manual', applicant: caseObj?.clientId?.name || 'Manual Entry', templateType, status: 'submitted', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), content: draftContent }, ...p]);
      setDraftContent('');
      setSelectedCase('');
      setCounter(c => c + 1);
      setSubmitting(false);
      alert('📤 Submitted for Approval successfully!');
    }, 1000);
  };

  const handleDeleteDraft = (id) => {
    if (window.confirm('Delete this draft?')) setDrafts(p => p.filter(d => d._id !== id));
  };

  const inputStyle = { border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', width: '100%', boxSizing: 'border-box' };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: 28, color: 'var(--navy)', margin: 0 }}>TSR Drafting</h1>
          <p style={{ color: 'var(--muted)', margin: '6px 0 0', fontSize: 14 }}>Create, edit, and submit AI-assisted Title Search Report drafts</p>
        </div>
        <span style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>🤖 AI-Powered</span>
      </div>

      {/* Draft Editor Card */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ background: 'var(--navy)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'white', fontFamily: 'Playfair Display', fontSize: 20, margin: 0 }}>Create New TSR Draft</h2>
          <span style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', padding: '4px 14px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>🤖 AI-Powered</span>
        </div>

        <div style={{ padding: 28 }}>
          {/* Top Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Select Case</label>
              <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)} style={inputStyle}>
                <option value="">-- Select Case --</option>
                {MOCK_CASES.map(c => <option key={c._id} value={c._id}>{c.caseId} — {c.clientId?.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>TSR Reference No.</label>
              <input readOnly value={refNo || 'Auto-generated'} style={{ ...inputStyle, background: '#f8fafc', color: 'var(--muted)', cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Template Type</label>
              <select value={templateType} onChange={e => setTemplateType(e.target.value)} style={inputStyle}>
                <option>Standard TSR Template</option>
                <option>Residential TSR Template</option>
                <option>Commercial TSR Template</option>
              </select>
            </div>
          </div>

          {/* Quick Templates */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>Quick Templates:</span>
            {[['standard', 'Standard'], ['residential', 'Residential'], ['commercial', 'Commercial']].map(([k, l]) => (
              <button key={k} onClick={() => handleQuickTemplate(k)}
                style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}
                onMouseEnter={e => e.target.style.background = 'var(--navy)' && (e.target.style.color = 'white')}
                onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.color = 'var(--navy)'; }}>
                {l}
              </button>
            ))}
          </div>

          {/* Draft Textarea */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>TSR Draft Content</label>
              <span style={{ fontSize: 16 }}>📝</span>
            </div>
            <textarea value={draftContent} onChange={e => setDraftContent(e.target.value)}
              placeholder="Select a Quick Template above, or click 'Generate AI Draft' to auto-fill..."
              rows={16} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.7, minHeight: 320 }} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={handleGenerate} disabled={generating}
              style={{ background: generating ? '#a5b4fc' : '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              🤖 {generating ? 'Generating...' : 'Generate AI Draft'}
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ background: saving ? '#86efac' : '#16a34a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              💾 {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              style={{ background: submitting ? '#fbbf24' : '#d97706', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              📤 {submitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
            <button onClick={() => alert('📄 PDF Export is a Phase 2 feature.')}
              style={{ background: '#0e7490', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* All TSR Drafts Table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: 20, color: 'var(--navy)', margin: 0 }}>All TSR Drafts</h2>
          <span style={{ background: '#f1f5f9', color: 'var(--muted)', padding: '4px 12px', borderRadius: 12, fontSize: 13, fontWeight: 600 }}>{drafts.length} drafts</span>
        </div>
        {drafts.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✍️</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 18, color: 'var(--navy)' }}>No drafts yet</div>
            <div style={{ color: 'var(--muted)', marginTop: 8 }}>Create your first TSR draft above.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'App No.', 'Applicant', 'Status', 'Created', 'Updated', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drafts.map((d, i) => (
                  <tr key={d._id} style={{ borderTop: '1px solid var(--border)', animation: `fadeSlideUp 0.3s ease forwards`, animationDelay: `${i * 0.04}s`, opacity: 0 }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#4f46e5' }}>{d.tsrRefNo}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12 }}>{d.appId}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{d.applicant}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={d.status} /></td>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 12 }}>{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 12 }}>{new Date(d.updatedAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setDraftContent(d.content); setSelectedCase(''); }} style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }} title="Edit">✏️</button>
                        <button onClick={() => alert(d.content)} style={{ background: '#dbeafe', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }} title="Preview">👁</button>
                        <button onClick={() => alert('📄 PDF Export — Phase 2')} style={{ background: '#fef3c7', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }} title="Export PDF">📄</button>
                        <button onClick={() => handleDeleteDraft(d._id)} style={{ background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }} title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
