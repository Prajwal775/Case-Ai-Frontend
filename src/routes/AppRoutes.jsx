import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import Cases from '../pages/cases/Cases';
import CreateCase from '../pages/cases/CreateCase';
import CaseDetails from '../pages/cases/CaseDetails';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
const AppRoutes = () => {
  return (
    <Routes>
      {/* Default */}
      <Route path='/' element={<Navigate to='/login' replace />} />

      {/* Public routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />

      {/* Protected routes */}

      {/* <Route path='/cases' element={<Cases />} />
      <Route path='/cases/create' element={<CreateCase />} />
      <Route path='/cases/:id' element={<CaseDetails />} /> */}

      <Route
        path='/cases'
        element={
          <ProtectedRoute>
            <Cases />
          </ProtectedRoute>
        }
      />

      <Route
        path='/cases/create'
        element={
          <ProtectedRoute>
            <CreateCase />
          </ProtectedRoute>
        }
      />

      <Route
        path='/cases/:id'
        element={
          <ProtectedRoute>
            <CaseDetails />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  );
};

export default AppRoutes;
