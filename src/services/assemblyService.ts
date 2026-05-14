import { apiCall } from "./_base";
export const assemblyService = {
  transcribe: (audioId: string) =>
    apiCall(`/assembly/transcribe`, { method: "POST", body: JSON.stringify({ audioId }) }, { transcript: "" }),
};
