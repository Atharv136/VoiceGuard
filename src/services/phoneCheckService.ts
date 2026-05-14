import { apiCall } from "./_base";
import { reportedNumbers } from "@/data/mock";
export const phoneCheckService = {
  check: async (number: string) => {
    const local = reportedNumbers.find((r) => r.number.replace(/\D/g, "").endsWith(number.replace(/\D/g, "").slice(-4)));
    return apiCall(`/phone/check?n=${encodeURIComponent(number)}`, undefined, {
      reported: !!local,
      details: local ?? null,
      carrier: "Reliance Jio",
      circle: "Maharashtra",
    });
  },
};
