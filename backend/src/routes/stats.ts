import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Safe count helper
async function getCount(table: string, filter?: { field: string; value: any }): Promise<number> {
  try {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    if (filter) {
      query = query.eq(filter.field, filter.value);
    }
    const { count, error } = await query;
    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

// Safe select helper
async function getRecent(table: string, limit: number, orderBy: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: false }).limit(limit);
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

// GET all dashboard statistics (Admin only)
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    // 1. Fetch counts safely
    const [
      projects,
      skills,
      certs,
      unreadMessages,
      totalMessages,
      visitors
    ] = await Promise.all([
      getCount('projects'),
      getCount('skills'),
      getCount('certificates'),
      getCount('messages', { field: 'is_read', value: false }),
      getCount('messages'),
      getCount('visitor_logs')
    ]);

    // 2. Fetch logs safely
    const [messagesList, logsList] = await Promise.all([
      getRecent('messages', 5, 'created_at'),
      getRecent('visitor_logs', 10, 'visited_at')
    ]);

    // 3. Fetch visitor trends safely
    const trends: { [date: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      trends[dateStr] = 0;
    }

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: trendData } = await supabase
        .from('visitor_logs')
        .select('visited_at')
        .gte('visited_at', sevenDaysAgo.toISOString());

      trendData?.forEach(log => {
        const dateStr = log.visited_at.split('T')[0];
        if (trends[dateStr] !== undefined) {
          trends[dateStr]++;
        }
      });
    } catch {
      // Ignore missing logs table for trends
    }

    const formattedTrends = Object.keys(trends).map(date => ({
      date,
      count: trends[date]
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Compile recent activities array
    const recentActivities: any[] = [];
    
    messagesList.forEach(msg => {
      recentActivities.push({
        type: 'message',
        title: `Message from ${msg.name}`,
        detail: msg.subject || 'Inquiry',
        time: msg.created_at
      });
    });

    logsList.forEach(log => {
      recentActivities.push({
        type: 'visitor',
        title: `Page Visit: ${log.page_visited}`,
        detail: `User Agent: ${log.user_agent.substring(0, 40)}...`,
        time: log.visited_at
      });
    });

    recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return res.json({
      counts: {
        projects,
        skills,
        certificates: certs,
        visitors,
        unreadMessages,
        totalMessages
      },
      visitorTrends: formattedTrends,
      recentActivities: recentActivities.slice(0, 10)
    });
  } catch (err: any) {
    console.error('Fetch stats error:', err);
    return res.status(500).json({ error: 'Failed to compile statistics.' });
  }
});

export default router;
