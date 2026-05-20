import { useState } from 'react';
import { MOCK_TSR_INITIATIONS } from '../../../data/mockData';

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

const INITIAL = { author: 'Narayan', appId: '', branch: 'Main', initiationDate: '', applicant: '', coApplicant: '', transactionType: '', propertyDetails: '', executiveMobile: '', executiveEmail: '' };

export default function TSRInitiation() {
  const [form, setForm] = useState(INITIAL);
  const [records, setRecords] = useState(MOCK_TSR_INITIATIONS);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setRecords(p => [{ _id: `init_${Date.now()}`, ...form, status: 'initiated', createdAt: new Date().toISOString() }, ...p]);
      setForm(INITIAL);
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: 28, color: 'var(--navy)', margin: 0 }}>TSR Initiation</h1>
          <p style={{ color: 'var(--muted)', margin: '6px 0 0', fontSize: 14 }}>Start a new Title Search Report for a client application</p>
        </div>
        <span style={{ background: 'var(--navy)', color: 'var(--gold)', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>📋 BUSINESS LEGAL</span>
      </div>

      {/* Form */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ background: 'var(--navy)', padding: '20px 28px' }}>
          <h2 style={{ color: 'white', fontFamily: 'Playfair Display', fontSize: 20, margin: 0 }}>Start New TSR</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={lbl}>Author</label>
              <select name="author" value={form.author} onChange={handleChange} style={inp}>
                {['Narayan','Priya Kulkarni','Arun Patil','Rohan Sane'].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Application ID <span style={{ color:'red' }}>*</span></label>
              <input name="appId" value={form.appId} onChange={handleChange} placeholder="e.g. 77000234182" style={{ ...inp, borderColor: errors.appId ? '#dc2626':'var(--border)' }} />
              {errors.appId && <span style={{ color:'#dc2626', fontSize:11, display:'block', marginTop:4 }}>{errors.appId}</span>}
            </div>
            <div>
              <label style={lbl}>Branch</label>
              <select name="branch" value={form.branch} onChange={handleChange} style={inp}>
                {['Main','Pune','Mumbai','Nashik','Nagpur'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
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
              <input name="coApplicant" value={form.coApplicant} onChange={handleChange} placeholder="Optional" style={inp} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
            <div>
              <label style={lbl}>Transaction Type</label>
              <input name="transactionType" value={form.transactionType} onChange={handleChange} placeholder="e.g. Home Loan" style={inp} />
            </div>
            <div>
              <label style={lbl}>Property Details</label>
              <textarea name="propertyDetails" value={form.propertyDetails} onChange={handleChange} placeholder="Address, area..." rows={3} style={{ ...inp, resize:'vertical' }} />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
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

          <button type="submit" disabled={submitting} style={{ background:'var(--navy)', color:'white', border:'none', padding:'13px 40px', borderRadius:8, fontSize:15, fontWeight:700, cursor: submitting ? 'not-allowed':'pointer', opacity: submitting ? 0.7:1, fontFamily:'Playfair Display' }}>
            {submitting ? '⏳ Initiating...' : '📋 Initiate TSR'}
          </button>
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
                        <button onClick={() => alert(`App ID: ${r.appId}\nApplicant: ${r.applicant}\nProperty: ${r.propertyDetails}`)} style={{ background:'#f1f5f9', border:'none', padding:'6px 10px', borderRadius:6, cursor:'pointer' }} title="View">👁</button>
                        <button onClick={() => alert('Edit — Phase 2 feature')} style={{ background:'#fef3c7', border:'none', padding:'6px 10px', borderRadius:6, cursor:'pointer' }} title="Edit">✏️</button>
                        <button onClick={() => setRecords(p => p.filter(x => x._id !== r._id))} style={{ background:'#fee2e2', border:'none', padding:'6px 10px', borderRadius:6, cursor:'pointer' }} title="Delete">🗑</button>
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
