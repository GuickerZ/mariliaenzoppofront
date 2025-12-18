import api from "./api";

export interface MyStats {
  totalPosts: number;
  totalCommunities: number;
  consecutiveDaysStreak: number;
}

export async function getMyStats(): Promise<MyStats> {
  const res = await api.get("/me/stats");
  return res.data as MyStats;
}

export interface WeeklyActivityItem {
  day: string; // e.g. 'Segunda', '2025-11-10'
  posts: number;
}

export interface MyInsights {
  totalPosts: number;
  totalDiscussions: number;
  communitiesJoined: number;
  averageReadTime: number; // in minutes
  feedbacksGiven?: number;
  feedbackQualityAvg?: number; // 0..100
  discussionsStarted?: number;
}

export async function getMyWeeklyActivity(): Promise<WeeklyActivityItem[]> {
  const res = await api.get("/me/activity/weekly");
  return res.data as WeeklyActivityItem[];
}

export async function getMyInsights(): Promise<MyInsights> {
  const res = await api.get("/me/insights");
  return res.data as MyInsights;
}
