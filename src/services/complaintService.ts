import { apiCall } from "./_base";

export type ComplaintPayload = {
  incidentType: string;
  callerNumber: string;
  date: string;
  time: string;
  amountLost: string;
  description: string;
  name: string;
  address: string;
  contactNumber: string;
};

export const complaintService = {
  generate: (payload: ComplaintPayload) => {
    return apiCall<{ id: string; complaintText: string }>("/api/complaints/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }, {
      id: "fallback",
      complaintText: "Error: Unable to connect to complaint generation service."
    });
  }
};
