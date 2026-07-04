import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { ParticleBackground } from '../components/ParticleBackground';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        navigate('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030014] flex items-center justify-center px-4 overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none z-0"></div>
      
      {/* Interactive Particles */}
      <ParticleBackground />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            ADMIN PORTAL
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            Sign in to manage your portfolio modules.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FiMail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="block w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to Public Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
