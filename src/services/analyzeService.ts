import { apiCall } from "./_base";

export interface AuriginSegment {
  start: number;
  end: number;
  scores: number[];
  confidence: number;
  result: "bonafide" | "spoofed";
}

export interface AnalysisResponse {
  riskLevel: "Safe" | "Suspicious" | "Dangerous";
  auriginScore: number;
  auriginVerdict: string;
  auriginConfidence: number;
  auriginSegments: AuriginSegment[];
  auriginModel: string;
  audioDuration: number;
  processingTime: number;
  auriginWarnings: string[];
  auriginPredictionId: string;
  keywordScore: number;
  detectedKeywords: string[];
  transcript: string;
  sharedReportSlug: string;
}

export interface ChunkResponse {
  riskLevel: "Safe" | "Suspicious" | "Dangerous";
  auriginScore: number;
  keywordScore: number;
  detectedKeywords: string[];
}

export const analyzeService = {
  // Full audio upload
  analyze: (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    
    return apiCall<AnalysisResponse>("/api/analyze", {
      method: "POST",
      body: formData
    });
  },

  // Live chunk analysis
  analyzeChunk: (audioBlob: Blob, index: number) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, `chunk-${index}.wav`);
    formData.append("chunkIndex", index.toString());

    return apiCall<ChunkResponse>("/api/analyze/chunk", {
      method: "POST",
      body: formData
    });
  }
};
