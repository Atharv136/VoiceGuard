import { apiCall } from "./_base";
export const alertService = {
  notifyFamily: (recordId: string) =>
    apiCall(`/alerts/family`, { method: "POST", body: JSON.stringify({ recordId }) }, { sent: true }),
};
