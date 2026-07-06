import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiBriefcase, FiCpu, FiAward, FiEye, FiMail, FiActivity, FiArrowRight, FiFolder } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface DashboardStats {
  counts: {
    projects: number;
    skills: number;
    certificates: number;
    visitors: number;
    unreadMessages: number;
    totalMessages: number;
    experience?: number;
  };
  visitorTrends: { date: string; count: number }[];
  recentActivities: {
    type: 'message' | 'visitor';
    title: string;
    detail: string;
    time: string;
  }[];
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.stats.getSummary();
        setStats(data);
      } catch (err: any) {
        console.error('Failed to load stats:', err);
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl">
        <h4>Error loading dashboard metrics</h4>
        <p className="text-sm mt-1">{error || 'Please ensure your database migrations are fully applied.'}</p>
      </div>
    );
  }

  // Draw custom SVG Line Chart coordinates for 7 days
  const chartWidth = 500;
  const chartHeight = 150;
  const maxCount = Math.max(...stats.visitorTrends.map(t => t.count), 5); // Fallback to 5 to avoid division by zero
  
  const points = stats.visitorTrends.map((t, idx) => {
    const x = (idx / (stats.visitorTrends.length - 1)) * chartWidth;
    const y = chartHeight - (t.count / maxCount) * (chartHeight - 20) - 10;
    return { x, y, ...t };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : '';

  const statCards = [
    { title: 'Total Projects', value: stats.counts.projects, icon: FiFolder, color: 'from-blue-500/20 to-blue-600/10', textColor: 'text-blue-400', path: '/admin/projects' },
    { title: 'Experience', value: stats.counts.experience || 0, icon: FiBriefcase, color: 'from-purple-500/20 to-purple-600/10', textColor: 'text-purple-400', path: '/admin/experience' },
    { title: 'Total Skills', value: stats.counts.skills, icon: FiCpu, color: 'from-emerald-500/20 to-emerald-600/10', textColor: 'text-emerald-400', path: '/admin/skills' },
    { title: 'Certificates', value: stats.counts.certificates, icon: FiAward, color: 'from-amber-500/20 to-amber-600/10', textColor: 'text-amber-400', path: '/admin/certificates' },
    { title: 'Total Visitors', value: stats.counts.visitors, icon: FiEye, color: 'from-indigo-500/20 to-indigo-600/10', textColor: 'text-indigo-400', path: '#' },
    { title: 'Unread Messages', value: stats.counts.unreadMessages, icon: FiMail, color: 'from-pink-500/20 to-pink-600/10', textColor: 'text-pink-400', path: '/admin/messages', alert: stats.counts.unreadMessages > 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your portfolio site performance and logs.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.path}
              className={`relative overflow-hidden glass-panel p-6 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 group ${
                card.alert ? 'ring-1 ring-pink-500/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} ${card.textColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">{card.value}</span>
                {card.alert && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics & Activities Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Visitor Traffic Chart */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Visitor Traffic</h3>
              <p className="text-gray-400 text-xs mt-0.5">Logs recorded over the last 7 days</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Live Chart
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-[160px] mt-4 flex items-center justify-center">
            {points.length > 0 ? (
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* X-Grid lines */}
                {points.map((p, idx) => (
                  <line 
                    key={idx} 
                    x1={p.x} 
                    y1={0} 
                    x2={p.x} 
                    y2={chartHeight} 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeWidth="1"
                  />
                ))}

                {/* Gradient area */}
                <path d={areaPath} fill="url(#chartGradient)" />

                {/* Main line */}
                <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />

                {/* Circle nodes */}
                {points.map((p, idx) => (
                  <g key={idx} className="group/node">
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="4" 
                      fill="#030010" 
                      stroke="#60a5fa" 
                      strokeWidth="2.5" 
                      className="cursor-pointer hover:r-5 transition-all"
                    />
                    {/* Tooltip trigger */}
                    <circle cx={p.x} cy={p.y} r="12" fill="transparent" className="cursor-pointer" />
                  </g>
                ))}
              </svg>
            ) : (
              <div className="text-gray-500 text-sm">No visitor data captured in last 7 days.</div>
            )}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between mt-2 px-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            {stats.visitorTrends.map((t, idx) => {
              const dateObj = new Date(t.date);
              const day = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
              return <span key={idx}>{day}</span>;
            })}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FiActivity className="w-5 h-5 text-purple-400" />
              <span>Activity Log</span>
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">Recent page traffic and submissions</p>
          </div>

          <div className="flex-1 space-y-4 max-h-[220px] overflow-y-auto pr-1">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((act, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <div className={`mt-0.5 p-1 rounded-md ${
                    act.type === 'message' ? 'bg-pink-500/10 text-pink-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {act.type === 'message' ? <FiMail className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 font-semibold truncate">{act.title}</p>
                    <p className="text-gray-500 truncate text-[10px] mt-0.5">{act.detail}</p>
                    <span className="text-[9px] text-gray-600 block mt-0.5">
                      {new Date(act.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {new Date(act.time).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm py-8">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
