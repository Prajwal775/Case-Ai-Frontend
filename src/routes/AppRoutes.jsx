import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Dashboard from '../pages/Dashboard';
import Signup from '../components/auth/Signup';
import Cases from '../pages/cases/Cases';
import CreateCase from '../pages/cases/CreateCase';
import CaseDetails from '../pages/cases/CaseDetails';

// const ProtectedRoute = ({ children }) => {
//   if (!localStorage.getItem('authToken')) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' replace />} />

      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />

      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/cases' element={<Cases />} />
      <Route path='/cases/create' element={<CreateCase />} />
      <Route path='/cases/:id' element={<CaseDetails />} />

      {/* default fallback */}
      {/* <Route path='*' element={<Navigate to='/login' />} /> */}
    </Routes>
  );
};

export default AppRoutes;
