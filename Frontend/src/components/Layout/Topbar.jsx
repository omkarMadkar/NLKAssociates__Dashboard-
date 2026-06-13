import { useLocation } from 'react-router-dom';

const BREADCRUMBS = {
  '/dashboard': ['Dashboard'],
  '/cases': ['Cases', 'All Cases'],
  '/cases/new': ['Cases', 'New Case'],
  '/search': ['Search'],
  '/approvals': ['Approvals'],
  '/reports': ['Reports'],
};

const ROLE_COLORS = {
  admin: { bg: '#f1f5f9', color: '#334155', label: 'Admin' },
  staff: { bg: '#f8fafc', color: '#475569', label: 'Staff' },
  senior: { bg: '#000000', color: '#ffffff', label: 'NLK Sir' },
};

export default function Topbar() {
  const location = useLocation();
  const role = localStorage.getItem('role') || 'staff';
  const crumbs = BREADCRUMBS[location.pathname] || ['Dashboard'];
  const rc = ROLE_COLORS[role] || ROLE_COLORS.staff;

  return (
    <div style={{ height: 60, background: 'white', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <span style={{ color: 'var(--muted)' }}>›</span>}
            <span style={{ color: i === crumbs.length - 1 ? 'var(--text)' : 'var(--muted)', fontSize: 14, fontWeight: i === crumbs.length - 1 ? 600 : 400 }}>{c}</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ 
          padding: '4px 12px', 
          borderRadius: 20, 
          background: rc.bg, 
          color: rc.color, 
          fontSize: 12, 
          fontWeight: 600,
          border: rc.bg === '#000000' ? 'none' : '1px solid #e2e8f0'
        }}>
          {rc.label}
        </span>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--navy)',
          color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14, fontFamily: 'Playfair Display' }}>
          {role[0].toUpperCase()}
        </div>
      </div>
    </div>
  );
}
