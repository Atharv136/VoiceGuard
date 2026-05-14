import { apiCall } from "./_base";

export type PhoneCheckResult = {
  reported: boolean;
  scamType?: string;
  reportCount?: number;
  lastReported?: string;
  carrier: string;
  lineType: string;
  circle?: string;
  disclaimer: string;
};

export const phoneService = {
  check: (number: string) => {
    return apiCall<PhoneCheckResult>(`/api/phone/check?n=${encodeURIComponent(number)}`, {
      method: "GET"
    }, {
      reported: false,
      carrier: "Unknown",
      lineType: "mobile",
      disclaimer: "Offline mode: Backend unreachable."
    });
  }
};
