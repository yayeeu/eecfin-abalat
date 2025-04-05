
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';

// Mock data for development mode
const mockContactStats = {
  thisWeek: {
    total: 23,
    byType: {
      'Phone Call': 8,
      'Text Message': 6,
      'In Person': 5,
      'Email': 4
    }
  },
  lastWeek: {
    total: 18,
    byType: {
      'Phone Call': 6,
      'Text Message': 5,
      'In Person': 4,
      'Email': 3
    }
  }
};

const mockMyContactStats = {
  thisWeek: {
    total: 7,
    byType: {
      'Phone Call': 3,
      'Text Message': 2,
      'In Person': 1,
      'Email': 1
    }
  },
  lastWeek: {
    total: 5,
    byType: {
      'Phone Call': 2,
      'Text Message': 1,
      'In Person': 1,
      'Email': 1
    }
  }
};

// Helper function to get the date ranges for this week and last week
const getDateRanges = () => {
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 0 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 0 });
  
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });
  
  return {
    thisWeek: {
      start: format(thisWeekStart, 'yyyy-MM-dd'),
      end: format(thisWeekEnd, 'yyyy-MM-dd')
    },
    lastWeek: {
      start: format(lastWeekStart, 'yyyy-MM-dd'),
      end: format(lastWeekEnd, 'yyyy-MM-dd')
    }
  };
};

// Get contact statistics for all elders
export const getContactStats = async () => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for contact stats');
    return Promise.resolve(mockContactStats);
  }
  
  const dateRanges = getDateRanges();
  
  // Fetch this week's stats
  const { data: thisWeekData, error: thisWeekError } = await supabase!
    .from('contact_log')
    .select('contact_type, count')
    .gte('created_at', dateRanges.thisWeek.start)
    .lte('created_at', dateRanges.thisWeek.end)
    .group('contact_type');
  
  if (thisWeekError) {
    console.error('Error fetching this week contact stats:', thisWeekError);
    throw thisWeekError;
  }
  
  // Fetch last week's stats
  const { data: lastWeekData, error: lastWeekError } = await supabase!
    .from('contact_log')
    .select('contact_type, count')
    .gte('created_at', dateRanges.lastWeek.start)
    .lte('created_at', dateRanges.lastWeek.end)
    .group('contact_type');
  
  if (lastWeekError) {
    console.error('Error fetching last week contact stats:', lastWeekError);
    throw lastWeekError;
  }
  
  // Process the data
  const thisWeekStats = {
    total: thisWeekData.reduce((sum, item) => sum + parseInt(item.count), 0),
    byType: Object.fromEntries(
      thisWeekData.map(item => [item.contact_type, parseInt(item.count)])
    )
  };
  
  const lastWeekStats = {
    total: lastWeekData.reduce((sum, item) => sum + parseInt(item.count), 0),
    byType: Object.fromEntries(
      lastWeekData.map(item => [item.contact_type, parseInt(item.count)])
    )
  };
  
  return {
    thisWeek: thisWeekStats,
    lastWeek: lastWeekStats
  };
};

// Get contact statistics for a specific elder
export const getElderContactStats = async (elderId: string) => {
  // If no elder ID provided, return null
  if (!elderId) {
    return null;
  }
  
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for elder contact stats');
    return Promise.resolve(mockMyContactStats);
  }
  
  const dateRanges = getDateRanges();
  
  // Fetch this week's stats for the elder
  const { data: thisWeekData, error: thisWeekError } = await supabase!
    .from('contact_log')
    .select('contact_type, count')
    .eq('elder_id', elderId)
    .gte('created_at', dateRanges.thisWeek.start)
    .lte('created_at', dateRanges.thisWeek.end)
    .group('contact_type');
  
  if (thisWeekError) {
    console.error('Error fetching this week elder contact stats:', thisWeekError);
    throw thisWeekError;
  }
  
  // Fetch last week's stats for the elder
  const { data: lastWeekData, error: lastWeekError } = await supabase!
    .from('contact_log')
    .select('contact_type, count')
    .eq('elder_id', elderId)
    .gte('created_at', dateRanges.lastWeek.start)
    .lte('created_at', dateRanges.lastWeek.end)
    .group('contact_type');
  
  if (lastWeekError) {
    console.error('Error fetching last week elder contact stats:', lastWeekError);
    throw lastWeekError;
  }
  
  // Process the data
  const thisWeekStats = {
    total: thisWeekData.reduce((sum, item) => sum + parseInt(item.count), 0),
    byType: Object.fromEntries(
      thisWeekData.map(item => [item.contact_type, parseInt(item.count)])
    )
  };
  
  const lastWeekStats = {
    total: lastWeekData.reduce((sum, item) => sum + parseInt(item.count), 0),
    byType: Object.fromEntries(
      lastWeekData.map(item => [item.contact_type, parseInt(item.count)])
    )
  };
  
  return {
    thisWeek: thisWeekStats,
    lastWeek: lastWeekStats
  };
};

// Wrapper for getting the current user's contact stats (for use with the hook)
export const getMyContactStats = async () => {
  // Since we can't access the auth context directly from this service,
  // we'll return mock data for now and handle the actual implementation in the hook
  if (!isSupabaseConfigured()) {
    return Promise.resolve(mockMyContactStats);
  }
  
  // This will be handled by the hook, which will pass the current user ID
  return null;
};
