import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import { generateEnglishTSR, generateMarathiTSR } from '../../../utils/tsrTemplateEngine';

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

export default function TSRDrafting() {
  const [initiations, setInitiations] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [templateType, setTemplateType] = useState('TSR Draft (English)');
  const [draftContent, setDraftContent] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [waitingReport, setWaitingReport] = useState({
    chalanNo: '',
    date: '',
    reportSrNo: '',
    documents: [
      { id: Date.now() + 1, srNo: 1, name: 'Sale Deed', available: 'No', remarks: '' },
      { id: Date.now() + 2, srNo: 2, name: 'Index II', available: 'No', remarks: '' },
      { id: Date.now() + 3, srNo: 3, name: '7/12 Extract', available: 'No', remarks: '' },
      { id: Date.now() + 4, srNo: 4, name: 'Property Card', available: 'No', remarks: '' },
      { id: Date.now() + 5, srNo: 5, name: 'Tax Receipt', available: 'No', remarks: '' }
    ]
  });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitiations();
    // fetchDrafts(); // In a real app we'd fetch saved drafts too
  }, []);

  const fetchInitiations = async () => {
    try {
      const { data } = await API.get('/tsr-initiation/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (data.success) {
        setInitiations(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch TSR Initiations', err);
    }
  };

  const selectedOpt = initiations.find(i => i._id === selectedCase);
  const refNo = selectedOpt?.refNo || 'Auto-generated';

  const handleAddDoc = () => {
    setWaitingReport(prev => ({
      ...prev,
      documents: [...prev.documents, { id: Date.now(), srNo: prev.documents.length + 1, name: '', available: 'No', remarks: '' }]
    }));
  };
  
  const handleDocChange = (index, field, value) => {
    setWaitingReport(prev => {
      const docs = [...prev.documents];
      docs[index][field] = value;
      return { ...prev, documents: docs };
    });
  };
  
  const handleRemoveDoc = (index) => {
    setWaitingReport(prev => {
      const docs = prev.documents.filter((_, i) => i !== index).map((d, i) => ({...d, srNo: i + 1}));
      return { ...prev, documents: docs };
    });
  };

  const handleGenerate = () => {
    if (!selectedCase) { alert('Please select an initialized TSR first.'); return; }
    setGenerating(true);
    
    setTimeout(() => {
      let content = '';
      if (templateType === 'TSR Draft (English)') {
        content = generateEnglishTSR(selectedOpt);
      } else {
        content = generateMarathiTSR(selectedOpt);
      }
      setDraftContent(content);
      setGenerating(false);
    }, 800);
  };

  const handleSave = () => {
    const isWaiting = templateType === 'Waiting Draft' || templateType === 'Pending Report';
    const contentToSave = isWaiting ? JSON.stringify(waitingReport) : draftContent;
    if (!contentToSave.trim() || contentToSave === '""') { alert('Draft content is empty.'); return; }
    setSaving(true);
    setTimeout(() => {
      const newDraft = {
        _id: `draft_${Date.now()}`,
        tsrRefNo: refNo,
        appId: selectedOpt?.appId || 'Manual',
        applicant: selectedOpt?.applicant || 'Manual Entry',
        templateType,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: contentToSave,
      };
      setDrafts(p => [newDraft, ...p]);
      setSaving(false);
      alert('✅ Draft saved successfully!');
    }, 800);
  };

  const handleSubmit = () => {
    const isWaiting = templateType === 'Waiting Draft' || templateType === 'Pending Report';
    const contentToSave = isWaiting ? JSON.stringify(waitingReport) : draftContent;
    if (!contentToSave.trim() || contentToSave === '""') { alert('Draft content is empty.'); return; }
    setSubmitting(true);
    setTimeout(() => {
      const newDraft = {
        _id: `draft_${Date.now()}`,
        tsrRefNo: refNo,
        appId: selectedOpt?.appId || 'Manual',
        applicant: selectedOpt?.applicant || 'Manual Entry',
        templateType,
        status: 'submitted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: contentToSave,
      };
      setDrafts(p => [newDraft, ...p]);
      setDraftContent('');
      setSelectedCase('');
      setSubmitting(false);
      alert('📤 Submitted for Approval successfully!');
    }, 1000);
  };

  const handleDeleteDraft = (id) => {
    if (window.confirm('Delete this draft?')) setDrafts(p => p.filter(d => d._id !== id));
  };

  const handleExportPDF = (contentToExport) => {
    const text = contentToExport || draftContent;
    if (!text.trim()) {
      alert('No content to export.');
      return;
    }
    
    // In Phase 2 we use window.print to export PDF, later we can add server-side PDF generation.
    
    let htmlBody = text;
    const isWaiting = text.trim().startsWith('{') && text.includes('chalanNo');
    
    if (isWaiting) {
      try {
        const data = JSON.parse(text);
        htmlBody = `
          <h2 style="text-align: center; text-decoration: underline;">${data.reportSrNo ? 'Waiting Report / Pending Report' : 'Waiting Report'}</h2>
          <table style="width:100%; margin-bottom: 20px;">
            <tr>
              <td><strong>Chalan No:</strong> ${data.chalanNo || 'N/A'}</td>
              <td style="text-align: right;"><strong>Date:</strong> ${data.date || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Report Sr No:</strong> ${data.reportSrNo || 'N/A'}</td>
              <td></td>
            </tr>
          </table>
          <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 20px;">
            <tr style="background: #f1f5f9;">
              <th style="width: 50px;">Sr. No</th>
              <th>Document Name / No.</th>
              <th style="width: 80px;">Available</th>
              <th>Remarks</th>
            </tr>
            ${data.documents.map(d => `
              <tr>
                <td style="text-align: center;">${d.srNo}</td>
                <td>${d.name || '-'}</td>
                <td style="text-align: center;">${d.available}</td>
                <td>${d.remarks || '-'}</td>
              </tr>
            `).join('')}
          </table>
        `;
      } catch(e) { console.error('Failed to parse waiting report JSON for PDF', e); }
    }

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head>
        <title>TSR Scrutiny Report - ${refNo}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Montserrat:wght@400;500;700&display=swap');
          
          body { 
            font-family: 'Times New Roman', serif; 
            padding: 40px; 
            line-height: 1.5; 
            color: #000; 
            background: #fff;
          }
          
          .letterhead {
            border-bottom: 3px double #1e3c72;
            padding-bottom: 12px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .crest-container {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .advocate-crest {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid #1e3c72;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: #1e3c72;
            font-weight: 700;
          }
          .title-section h1 {
            font-family: 'Cinzel', serif;
            font-size: 20px;
            font-weight: 800;
            color: #1e3c72;
            margin: 0;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }
          .title-section h2 {
            font-style: italic;
            font-size: 13px;
            font-weight: normal;
            color: #334155;
            margin: 2px 0 0 0;
          }
          .contacts {
            text-align: right;
            font-size: 10px;
            color: #475569;
            font-family: 'Montserrat', sans-serif;
            line-height: 1.4;
          }

          .content { 
            white-space: pre-wrap; 
            font-size: 13px; 
            text-align: justify;
          }
          
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="letterhead">
          <div class="crest-container">
            <div class="advocate-crest">⚖</div>
            <div class="title-section">
              <h1>NARAYAN L. KHAMKAR</h1>
              <h2>B.S.L., LL.B.(Spl.) Advocate & Notary</h2>
              <div style="font-size: 9px; font-weight: bold; color: #1e3c72; margin-top: 3px;">GOVERNMENT OF INDIA</div>
            </div>
          </div>
          <div class="contacts">
            <strong>Hadapsar Office:</strong><br>
            Hadapsar S.O., Pune - 411028<br>
            Cell: +91 98224 56789 | Email: nlk@gmail.com<br>
            <strong>License No:</strong> NOT-MH-6543/2020
          </div>
        </div>

        <div class="content">${htmlBody}</div>

        <div class="no-print" style="text-align: center; margin-top: 30px; position: sticky; bottom: 20px;">
          <button onclick="window.print()" style="padding: 12px 30px; background: #1e3c72; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
        </div>
      </body>
      </html>
    `);
    win.document.close();
  };

  const inputStyle = { border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', width: '100%', boxSizing: 'border-box' };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: 28, color: 'var(--navy)', margin: 0 }}>TSR Legal Scrutiny Drafting</h1>
          <p style={{ color: 'var(--muted)', margin: '6px 0 0', fontSize: 14 }}>Create, edit, and export high-fidelity Advocate Scrutiny Reports</p>
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
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Select Case / Initialized TSR</label>
              <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)} style={inputStyle}>
                <option value="">-- Select TSR Init --</option>
                {initiations.map(o => <option key={o._id} value={o._id}>📋 TSR Init: {o.appId} — {o.applicant}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>TSR Reference No.</label>
              <input readOnly value={refNo} style={{ ...inputStyle, background: '#f8fafc', color: 'var(--muted)', cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Format Type</label>
              <select value={templateType} onChange={e => setTemplateType(e.target.value)} style={inputStyle}>
                <option>TSR Draft (English)</option>
                <option>TSR Draft (Marathi)</option>
                <option>Waiting Draft</option>
                <option>Pending Report</option>
              </select>
            </div>
          </div>

          {/* Draft Textarea or Waiting Report Form */}
          <div style={{ marginBottom: 20 }}>
            {(templateType === 'Waiting Draft' || templateType === 'Pending Report') ? (
              <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 24, background: '#f8fafc' }}>
                <h3 style={{ marginTop: 0, color: 'var(--navy)', fontFamily: 'Playfair Display' }}>Waiting Report Details</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Chalan No.</label>
                    <input style={inputStyle} value={waitingReport.chalanNo} onChange={e => setWaitingReport({...waitingReport, chalanNo: e.target.value})} placeholder="e.g. CH-1029" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Date</label>
                    <input type="date" style={inputStyle} value={waitingReport.date} onChange={e => setWaitingReport({...waitingReport, date: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Report Sr No.</label>
                    <input style={inputStyle} value={waitingReport.reportSrNo} onChange={e => setWaitingReport({...waitingReport, reportSrNo: e.target.value})} placeholder="e.g. SR-2026/05" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>Documents Checklist</label>
                  <button onClick={handleAddDoc} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>+ Add Row</button>
                </div>

                <div style={{ overflowX: 'auto', background: 'white', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '10px', textAlign: 'center', width: 60 }}>Sr. No</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Document No. / Name</th>
                        <th style={{ padding: '10px', textAlign: 'center', width: 100 }}>Available</th>
                        <th style={{ padding: '10px', textAlign: 'center', width: 120 }}>Upload</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Remarks</th>
                        <th style={{ padding: '10px', textAlign: 'center', width: 60 }}>Act</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitingReport.documents.map((doc, index) => (
                        <tr key={doc.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', textAlign: 'center' }}>{doc.srNo}</td>
                          <td style={{ padding: '8px' }}><input style={{...inputStyle, padding: '6px 10px'}} value={doc.name} onChange={e => handleDocChange(index, 'name', e.target.value)} placeholder="Doc name..." /></td>
                          <td style={{ padding: '8px' }}>
                            <select style={{...inputStyle, padding: '6px 10px'}} value={doc.available} onChange={e => handleDocChange(index, 'available', e.target.value)}>
                              <option>Yes</option>
                              <option>No</option>
                            </select>
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}><input type="file" style={{ fontSize: 11, width: 90 }} /></td>
                          <td style={{ padding: '8px' }}><input style={{...inputStyle, padding: '6px 10px'}} value={doc.remarks} onChange={e => handleDocChange(index, 'remarks', e.target.value)} placeholder="Reason pending..." /></td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <button onClick={() => handleRemoveDoc(index)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>TSR Draft Content</label>
                  <span style={{ fontSize: 16 }}>📝</span>
                </div>
                <textarea value={draftContent} onChange={e => setDraftContent(e.target.value)}
                  placeholder="Click 'Generate Draft' to compile dynamically..."
                  rows={12} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.6, minHeight: 400 }} />
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={handleGenerate} disabled={generating || templateType === 'Waiting Draft' || templateType === 'Pending Report'}
              style={{ background: generating ? '#a5b4fc' : '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: (generating || templateType === 'Waiting Draft' || templateType === 'Pending Report') ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              🤖 {generating ? 'Generating Dynamic Draft...' : 'Generate Draft'}
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ background: saving ? '#86efac' : '#16a34a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              💾 {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              style={{ background: submitting ? '#fbbf24' : '#d97706', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              📤 {submitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
            <button onClick={() => handleExportPDF(draftContent)}
              style={{ background: '#0e7490', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              📄 Export Advocate PDF
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
                        <button onClick={() => { 
                          setTemplateType(d.templateType);
                          if (d.templateType === 'Waiting Draft' || d.templateType === 'Pending Report') {
                            try { setWaitingReport(JSON.parse(d.content)); } catch(e){}
                          } else {
                            setDraftContent(d.content); 
                          }
                          setSelectedCase(''); 
                        }} style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }} title="Edit">✏️</button>
                        <button onClick={() => alert("Previewing: " + d.tsrRefNo)} style={{ background: '#dbeafe', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }} title="Preview">👁</button>
                        <button onClick={() => handleExportPDF(d.content)} style={{ background: '#fef3c7', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }} title="Export PDF">📄</button>
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
