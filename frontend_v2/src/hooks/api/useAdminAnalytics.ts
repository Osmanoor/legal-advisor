// File: src/hooks/api/useAdminAnalytics.ts
// @new
// Mock API hook to fetch data for the admin analytics dashboard.

import { useQuery } from '@tanstack/react-query';

// Define the shape of our analytics data
export interface AdminAnalyticsData {
  stats: {
    visits: { value: number; change: number };
    users: { value: number; change: number };
  };
  mostVisitedPage: string;
  actionsReport: {
    clicks: number;
    toolUsage: number;
    communication: number;
    feedback: number;
  };
  userTypes: {
    registered: number;
    guests: number;
  };
  weeklyVisits: { day: string; visits: number }[];
}

// Mock function to simulate fetching data from a backend
const fetchAdminAnalyticsData = async (): Promise<AdminAnalyticsData> => {
  console.log("Fetching mock admin analytics data...");
  await new Promise(res => setTimeout(res, 800)); // Simulate network delay

  return {
    stats: {
      visits: { value: 265, change: 21.6 },
      users: { value: 265, change: 21.6 },
    },
    mostVisitedPage: 'المساعد الذكي',
    actionsReport: {
      clicks: 250,
      toolUsage: 115,
      communication: 67,
      feedback: 164,
    },
    userTypes: {
      registered: 35,
      guests: 45,
    },
    weeklyVisits: [
      { day: 'Mon', visits: 120 },
      { day: 'Tue', visits: 190 },
      { day: 'Wed', visits: 150 },
      { day: 'Thu', visits: 220 },
      { day: 'Fri', visits: 300 },
      { day: 'Sat', visits: 250 },
      { day: 'Sun', visits: 200 },
    ],
  };
};

export function useAdminAnalytics() {
  return useQuery<AdminAnalyticsData, Error>({
    queryKey: ['admin', 'analytics'],
    queryFn: fetchAdminAnalyticsData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}