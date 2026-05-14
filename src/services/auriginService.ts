import { apiCall } from "./_base";
export const auriginService = {
  scoreVoice: (audioId: string) =>
    apiCall(`/aurigin/score`, { method: "POST", body: JSON.stringify({ audioId }) }, { score: 32, label: "likely_synthetic" as const }),
};
