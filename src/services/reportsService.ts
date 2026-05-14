import { apiCall } from "./_base";
import { seededAnalyses, stats } from "@/data/mock";
export const reportsService = {
  history: () => apiCall(`/reports/history`, undefined, seededAnalyses),
  stats: () => apiCall(`/reports/stats`, undefined, stats),
  byId: (id: string) => apiCall(`/reports/${id}`, undefined, seededAnalyses.find((r) => r.id === id) ?? seededAnalyses[0]),
};
