import { apiCall } from "./_base";

export interface AnalysisRecord {
  id: string;
  created_at: string;
  risk_level: "Safe" | "Suspicious" | "Dangerous";
  aurigin_score: number;
  aurigin_verdict?: string;
  aurigin_segments?: any[];
  keyword_score: number;
  detected_keywords: string[];
  transcript: string;
  shared_report_slug: string;
}

export const historyService = {
  getLatest: () => {
    return apiCall<AnalysisRecord[]>("/api/reports/history", {
      method: "GET"
    }, []);
  },
  getOne: (id: string) => {
    return apiCall<AnalysisRecord>(`/api/reports/${id}`, {
      method: "GET"
    });
  }
};
