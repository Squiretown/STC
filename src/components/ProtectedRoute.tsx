import React from 'react';
import { ShieldOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AdminAuth from './AdminAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminAuth />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldOff className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Access Denied</h2>
          <p className="text-slate-600 mb-6">
            Your account does not have administrator privileges. Contact the site owner to request access.
          </p>
          <button
            onClick={signOut}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
