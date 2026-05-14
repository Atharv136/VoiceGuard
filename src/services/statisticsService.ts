import { apiCall } from "./_base";

export type StatisticsData = {
  totalAnalyzed: number;
  dangerousCount: number;
  suspiciousCount: number;
  safeCount: number;
  familiesAlerted: number;
  topKeywords: { keyword: string; count: number }[];
  weeklyTrend: { date: string; total: number; dangerous: number }[];
  scamTypeBreakdown: { type: string; count: number }[];
};

export const statisticsService = {
  get: () => {
    return apiCall<StatisticsData>("/api/statistics", {
      method: "GET"
    }, {
      totalAnalyzed: 0,
      dangerousCount: 0,
      suspiciousCount: 0,
      safeCount: 0,
      familiesAlerted: 0,
      topKeywords: [],
      weeklyTrend: [],
      scamTypeBreakdown: []
    });
  }
};
