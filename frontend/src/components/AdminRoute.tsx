import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../services/supabase';

export const AdminRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center">
        {/* Loading Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-blue-400 animate-spin-slow"></div>
        </div>
        <p className="mt-4 text-purple-300/80 text-sm font-semibold tracking-widest animate-pulse">
          VERIFYING SESSION...
        </p>
      </div>
    );
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
export default AdminRoute;
