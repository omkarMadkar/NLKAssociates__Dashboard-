import { useState, useEffect } from 'react';
import API from '../../../api/axios';

const STATUS_STYLES = {
  initiated:   { bg: '#dbeafe', color: '#1d4ed8', label: 'Initiated' },
  in_progress: { bg: '#fef3c7', color: '#d97706', label: 'In Progress' },
  completed:   { bg: '#dcfce7', color: '#16a34a', label: 'Completed' },
  cancelled:   { bg: '#fee2e2', color: '#dc2626', label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.initiated;
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
}

const INITIAL = {
  author: 'Narayan',
  appId: '',
  refNo: '',
  branch: 'Main',
  initiationDate: '',
  applicant: '',
  coApplicant: '',
  existingOwner: '',
  transactionType: '',
  bankBranch: 'Hadapsar Branch, Pune',
  municipalPropertyNo: '',
  rccConstructionArea: '',
  village: '',
  taluka: '',
  district: '',
  municipalCouncil: '',
  surveyNoDetails: '',
  boundaryEast: '',
  boundaryWest: '',
  boundarySouth: '',
  boundaryNorth: '',
  executiveMobile: '',
  executiveEmail: '',
};

export default function TSRInitiation() {
  const [form, setForm] = useState(INITIAL);
  const [records, setRecords] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  
  // OCR states
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [fileUploadedName, setFileUploadedName] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Fetch initial records
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await API.get('/tsr-initiation/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (data.success) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch TSR Initiations', err);
    }
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;

    setFileUploadedName(file.name);
    setOcrScanning(true);
    setOcrStatus('Uploading and analyzing document...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await API.post('/tsr-initiation/upload-extract', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      if (data.success) {
        // Merge extracted fields into the current form state
        // This ensures progressive filling (we don't overwrite manual entries with blanks)
        setForm(prev => {
          const newForm = { ...prev };
          Object.keys(data.extractedFields).forEach(key => {
            // Only update if the extracted field has a value
            if (data.extractedFields[key]) {
              newForm[key] = data.extractedFields[key];
            }
          });
          return newForm;
        });
        
        alert(`✅ Analysis Complete!\n\nDetected: ${data.documentType}\n${data.message}`);
      }
    } catch (err) {
      console.error('OCR Extraction Error', err);
      if (err.response?.status === 401) {
        alert('Authentication Error: Your session has expired or is invalid. Please log out and log in again.');
      } else {
        alert('Failed to extract document: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setOcrScanning(false);
    }
  };

  const inp = { border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', background: 'white' };
  const lbl = { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' };

  const validate = () => {
    const e = {};
    if (!form.appId.trim()) e.appId = 'Required';
    if (!form.applicant.trim()) e.applicant = 'Required';
    if (!form.initiationDate) e.initiationDate = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    
    try {
      const { data } = await API.post('/tsr-initiation/create', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (data.success) {
        alert('📋 TSR Initialized Successfully! Go to the "TSR Drafting" tab to draft and compile this case.');
        setForm(INITIAL);
        fetchRecords(); // Refresh table
      }
    } catch (err) {
      console.error('Failed to create TSR Initiation', err);
      alert('Failed to save TSR initiation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this TSR Initiation record?')) return;
    try {
      await API.delete(`/tsr-initiation/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchRecords();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };


  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: 28, color: 'var(--navy)', margin: 0 }}>TSR Scrutiny & Initiation</h1>
          <p style={{ color: 'var(--muted)', margin: '6px 0 0', fontSize: 14 }}>Start a new Title Search Report using advanced legal details or AI OCR scan</p>
        </div>
        <span style={{ background: 'var(--navy)', color: 'var(--gold)', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>📋 BUSINESS LEGAL</span>
      </div>

      {/* OCR Drag-Drop Upload Area */}
      <div 
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleFileDrop}
        style={{
          background: 'white', border: dragActive ? '2px dashed var(--gold)' : '2px dashed var(--border)',
          borderRadius: 16, padding: '32px 20px', textAlign: 'center', position: 'relative',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', overflow: 'hidden'
        }}
      >
        {ocrScanning ? (
          <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, border: '4px solid #f1f5f9', borderTop: '4px solid var(--navy)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontFamily: 'Playfair Display', fontSize: 18, color: 'var(--navy)', fontWeight: 600 }}>{ocrStatus}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Processing file: <strong>{fileUploadedName}</strong></div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: 18, color: 'var(--navy)', margin: '0 0 6px 0' }}>AI Legal Document OCR Uploader</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 16px 0', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.4 }}>
              Drag & drop title deeds, e-search receipt GRAS PDFs, or 7/12 extracts. AI OCR will scan and extract all boundaries & details instantly!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <input type="file" id="fileInp" onChange={handleFileDrop} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.jpg,.png" />
              <label htmlFor="fileInp" style={{ background: 'var(--navy)', color: 'white', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-block' }}>
                Browse Files
              </label>

            </div>
          </div>
        )}
      </div>

      {/* Tabbed Form Panel */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ background: 'var(--navy)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'white', fontFamily: 'Playfair Display', fontSize: 20, margin: 0 }}>Start New TSR</h2>
          <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', color: 'var(--gold)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>20+ ADVANCED LEGAL FIELDS</span>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
          {[
            { id: 'basic', label: '📝 Basic Info & SRO' },
            { id: 'property', label: '🏡 Property & Boundaries' }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: '14px 20px', border: 'none', background: activeTab === t.id ? 'white' : 'transparent',
                borderBottom: activeTab === t.id ? '2px solid var(--gold)' : 'none',
                color: activeTab === t.id ? 'var(--navy)' : 'var(--muted)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s ease',
                borderRight: '1px solid #e2e8f0'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 28 }}>
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div>
                  <label style={lbl}>Author</label>
                  <select name="author" value={form.author} onChange={handleChange} style={inp}>
                    {['Narayan','Priya Kulkarni','Arun Patil','Rohan Sane'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Application ID <span style={{ color:'red' }}>*</span></label>
                  <input name="appId" value={form.appId} onChange={handleChange} placeholder="e.g. 77000244168" style={{ ...inp, borderColor: errors.appId ? '#dc2626':'var(--border)' }} />
                  {errors.appId && <span style={{ color:'#dc2626', fontSize:11, display:'block', marginTop:4 }}>{errors.appId}</span>}
                </div>
                <div>
                  <label style={lbl}>Ref. No.</label>
                  <input name="refNo" value={form.refNo} onChange={handleChange} placeholder="e.g. IHFC/TSR/691/2026" style={inp} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div>
                  <label style={lbl}>Initiation Date <span style={{ color:'red' }}>*</span></label>
                  <input type="date" name="initiationDate" value={form.initiationDate} onChange={handleChange} style={{ ...inp, borderColor: errors.initiationDate ? '#dc2626':'var(--border)' }} />
                  {errors.initiationDate && <span style={{ color:'#dc2626', fontSize:11, display:'block', marginTop:4 }}>{errors.initiationDate}</span>}
                </div>
                <div>
                  <label style={lbl}>Applicant <span style={{ color:'red' }}>*</span></label>
                  <input name="applicant" value={form.applicant} onChange={handleChange} placeholder="Primary applicant name" style={{ ...inp, borderColor: errors.applicant ? '#dc2626':'var(--border)' }} />
                  {errors.applicant && <span style={{ color:'#dc2626', fontSize:11, display:'block', marginTop:4 }}>{errors.applicant}</span>}
                </div>
                <div>
                  <label style={lbl}>Co-Applicant</label>
                  <input name="coApplicant" value={form.coApplicant} onChange={handleChange} placeholder="e.g. Mr. Subhash Ganpat Sarak" style={inp} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div>
                  <label style={lbl}>Existing Owner (Title Holder)</label>
                  <input name="existingOwner" value={form.existingOwner} onChange={handleChange} placeholder="e.g. Mr. Subhash Ganpat Sarak" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Transaction Type</label>
                  <input name="transactionType" value={form.transactionType} onChange={handleChange} placeholder="e.g. LAP or Home Loan" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Bank Branch Office</label>
                  <input name="bankBranch" value={form.bankBranch} onChange={handleChange} placeholder="e.g. Hadapsar Branch, Pune" style={inp} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div>
                  <label style={lbl}>Branch Office</label>
                  <select name="branch" value={form.branch} onChange={handleChange} style={inp}>
                    {['Main','Pune','Mumbai','Nashik','Nagpur'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Executive Mobile</label>
                  <input name="executiveMobile" value={form.executiveMobile} onChange={handleChange} placeholder="10-digit mobile" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Executive Email</label>
                  <input type="email" name="executiveEmail" value={form.executiveEmail} onChange={handleChange} placeholder="exec@company.com" style={inp} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTY & BOUNDARIES */}
          {activeTab === 'property' && (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div>
                  <label style={lbl}>Municipal Property No.</label>
                  <input name="municipalPropertyNo" value={form.municipalPropertyNo} onChange={handleChange} placeholder="e.g. P/M/83/01239000" style={inp} />
                </div>
                <div>
                  <label style={lbl}>RCC Construction standing area</label>
                  <input name="rccConstructionArea" value={form.rccConstructionArea} onChange={handleChange} placeholder="e.g. 750 sq. ft." style={inp} />
                </div>
                <div>
                  <label style={lbl}>Municipal Council Limits</label>
                  <input name="municipalCouncil" value={form.municipalCouncil} onChange={handleChange} placeholder="e.g. Fursungi-Uruli Devachi Municipal Council" style={inp} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div>
                  <label style={lbl}>Village</label>
                  <input name="village" value={form.village} onChange={handleChange} placeholder="e.g. Uruli Devachi" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Taluka</label>
                  <input name="taluka" value={form.taluka} onChange={handleChange} placeholder="e.g. Haveli" style={inp} />
                </div>
                <div>
                  <label style={lbl}>District</label>
                  <input name="district" value={form.district} onChange={handleChange} placeholder="e.g. Pune" style={inp} />
                </div>
              </div>

              <div>
                <label style={lbl}>Detailed Survey / Hissa No descriptions</label>
                <textarea name="surveyNoDetails" value={form.surveyNoDetails} onChange={handleChange} placeholder="E.g. Survey No. 237, Hissa No. 2A/43 admeasuring 00 H 01 R..." rows={2} style={{ ...inp, resize: 'vertical' }} />
              </div>

              {/* BOUNDARIES BOX */}
              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 16px 0', fontFamily: 'Playfair Display', color: 'var(--navy)', fontSize: 15 }}>🧭 Physical Boundaries (Legal descriptions)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={lbl}>Boundary East</label>
                    <input name="boundaryEast" value={form.boundaryEast} onChange={handleChange} placeholder="On or towards East" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Boundary West</label>
                    <input name="boundaryWest" value={form.boundaryWest} onChange={handleChange} placeholder="On or towards West" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Boundary South</label>
                    <input name="boundarySouth" value={form.boundarySouth} onChange={handleChange} placeholder="On or towards South" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Boundary North</label>
                    <input name="boundaryNorth" value={form.boundaryNorth} onChange={handleChange} placeholder="On or towards North" style={inp} />
                  </div>
                </div>
              </div>
            </div>
          )}



          <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
            {activeTab !== 'property' ? (
              <button 
                type="button" 
                onClick={() => setActiveTab('property')}
                style={{ background: 'white', color: 'var(--navy)', border: '1px solid var(--navy)', padding: '13px 40px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Playfair Display' }}
              >
                Next Section ➔
              </button>
            ) : (
              <button type="submit" disabled={submitting} style={{ background:'var(--navy)', color:'white', border:'none', padding:'13px 40px', borderRadius:8, fontSize:15, fontWeight:700, cursor: submitting ? 'not-allowed':'pointer', opacity: submitting ? 0.7:1, fontFamily:'Playfair Display' }}>
                {submitting ? '⏳ Initiating...' : '📋 Initiate TSR Report'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Records Table */}
      <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>
        <div style={{ padding:'20px 28px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontFamily:'Playfair Display', fontSize:20, color:'var(--navy)', margin:0 }}>TSR Initiation Records</h2>
          <span style={{ background:'#f1f5f9', color:'var(--muted)', padding:'4px 12px', borderRadius:12, fontSize:13, fontWeight:600 }}>{records.length} records</span>
        </div>
        {records.length === 0 ? (
          <div style={{ padding:48, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
            <div style={{ fontFamily:'Playfair Display', fontSize:18, color:'var(--navy)' }}>No records yet</div>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#f8fafc' }}>
                  {['ID','App ID','Applicant','Branch','Initiation Date','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', fontSize:11, letterSpacing:0.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r._id} style={{ borderTop:'1px solid var(--border)', animation:`fadeSlideUp 0.3s ease forwards`, animationDelay:`${i*0.04}s`, opacity:0 }}>
                    <td style={{ padding:'14px 16px', fontFamily:'monospace', fontWeight:700, color:'var(--navy)', fontSize:12 }}>INIT-{String(i+1).padStart(3,'0')}</td>
                    <td style={{ padding:'14px 16px', fontFamily:'monospace', fontSize:12 }}>{r.appId}</td>
                    <td style={{ padding:'14px 16px', fontWeight:600 }}>
                      {r.applicant}
                      {r.coApplicant && <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>+ {r.coApplicant}</div>}
                    </td>
                    <td style={{ padding:'14px 16px', color:'var(--muted)' }}>{r.branch}</td>
                    <td style={{ padding:'14px 16px', color:'var(--muted)' }}>{r.initiationDate}</td>
                    <td style={{ padding:'14px 16px' }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => {
                          alert(`App ID: ${r.appId}\nApplicant: ${r.applicant}\nBoundaries:\n- East: ${r.boundaryEast || 'N/A'}\n- West: ${r.boundaryWest || 'N/A'}\n- South: ${r.boundarySouth || 'N/A'}\n- North: ${r.boundaryNorth || 'N/A'}`);
                        }} style={{ background:'#f1f5f9', border:'none', padding:'6px 10px', borderRadius:6, cursor:'pointer' }} title="View Details">👁</button>
                        <button onClick={() => alert('Edit — Phase 2 feature')} style={{ background:'#fef3c7', border:'none', padding:'6px 10px', borderRadius:6, cursor:'pointer' }} title="Edit">✏️</button>
                        <button onClick={() => handleDelete(r._id)} style={{ background:'#fee2e2', border:'none', padding:'6px 10px', borderRadius:6, cursor:'pointer' }} title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
