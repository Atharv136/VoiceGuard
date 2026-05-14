import { apiCall } from "./_base";
export const complaintService = {
  generate: (payload: unknown) =>
    apiCall(`/complaints/generate`, { method: "POST", body: JSON.stringify(payload) }, { id: "draft", text: "" }),
};
