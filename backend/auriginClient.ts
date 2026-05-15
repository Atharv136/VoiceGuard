const AURIGIN_API_URL = "https://api.aurigin.ai/v1/predict";

export interface AuriginPrediction {
  prediction_id: string;
  global: {
    score: number;
    confidence: number;
    result: "bonafide" | "spoofed" | "partially_spoofed";
    reason: string | null;
  };
  segments: {
    start: number;
    end: number;
    scores: number[];
    confidence: number;
    result: "bonafide" | "spoofed";
  }[];
  model: string;
  processing_time: number;
  audio_duration: number;
  warnings: string[];
}

export interface AuriginError {
  error: string;
  message: string;
  status: number;
  correlation_id: string;
}

function buildMultipartBody(
  audioBuffer: Buffer,
  fileName: string,
  mimeType: string,
): { body: Buffer; boundary: string } {
  const boundary = `----AuriginBoundary${Date.now()}${Math.random().toString(36).slice(2, 10)}`;

  const parts: Buffer[] = [];

  // File part
  parts.push(Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
    `Content-Type: ${mimeType}\r\n` +
    `\r\n`
  ));
  parts.push(audioBuffer);
  parts.push(Buffer.from(`\r\n`));

  // device field
  parts.push(Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="device"\r\n` +
    `\r\n` +
    `api\r\n`
  ));

  // threshold field
  parts.push(Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="threshold"\r\n` +
    `\r\n` +
    `0.5\r\n`
  ));

  // End boundary
  parts.push(Buffer.from(`--${boundary}--\r\n`));

  return { body: Buffer.concat(parts), boundary };
}

export async function analyzeAudio(
  audioBuffer: Buffer,
  fileName: string,
  mimeType: string,
  apiKey: string,
): Promise<AuriginPrediction> {
  const { body, boundary } = buildMultipartBody(audioBuffer, fileName, mimeType);

  console.log(`\n  Aurigin request: ${fileName} (${(audioBuffer.length / 1024).toFixed(1)} KB, ${mimeType})`);

  const response = await fetch(AURIGIN_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": String(body.length),
    },
    body: body as unknown as BodyInit,
  });

  const responseBody = await response.text();

  if (!response.ok) {
    let errorMessage: string;
    try {
      const parsed = JSON.parse(responseBody) as AuriginError;
      errorMessage = parsed.message || parsed.error || `Aurigin API error (${response.status})`;
    } catch {
      errorMessage = `Aurigin API error (${response.status}): ${responseBody}`;
    }
    throw new Error(errorMessage);
  }

  const data = JSON.parse(responseBody) as AuriginPrediction;

  console.log(`  Aurigin result: ${data.global.result} (score: ${data.global.score}, segments: ${data.segments.length}, model: ${data.model})`);

  return data;
}

export function mapAuriginScoreToPercentage(score: number): number {
  return Math.round(score * 100);
}
