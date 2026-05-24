import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import BankCases from './pages/NonLitigation/BankCases';
import TSRGenerator from './pages/NonLitigation/TSRGenerator';
import CaseCreate from './pages/Cases/CaseCreate';
import CaseDetail from './pages/Cases/CaseDetail';
import CaseList from './pages/Cases/CaseList';
import Approvals from './pages/Approvals';
import SearchPage from './pages/SearchPage';
import Reports from './pages/Reports';
import Login from './pages/Login';
import TSRInitiation from './pages/NonLitigation/BusinessLegal/TSRInitiation';
import TSRDrafting from './pages/NonLitigation/BusinessLegal/TSRDrafting';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases" element={<CaseList />} />
          <Route path="/cases/new" element={<CaseCreate />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/non-litigation/:bank" element={<BankCases />} />
          <Route path="/tsr/:caseId" element={<TSRGenerator />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reports" element={<Reports />} />
          {/* Business Legal Routes */}
          <Route path="/non-litigation/business-legal/tsr-initiation" element={<TSRInitiation />} />
          <Route path="/non-litigation/business-legal/tsr-drafting" element={<TSRDrafting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;