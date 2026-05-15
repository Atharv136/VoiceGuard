const ASSEMBLY_BASE = "https://api.assemblyai.com/v2";

export interface AssemblyTranscript {
  id: string;
  status: "queued" | "processing" | "completed" | "error";
  text: string;
  words?: { text: string; start: number; end: number; confidence: number }[];
  error?: string;
}

export async function transcribeAudio(
  audioBuffer: Buffer,
  fileName: string,
  apiKey: string,
): Promise<AssemblyTranscript> {
  // 1. Upload the audio file
  const uploadUrl = await uploadAudio(audioBuffer, fileName, apiKey);

  // 2. Request transcription
  const transcript = await requestTranscript(uploadUrl, apiKey);

  // 3. Poll until complete
  return await pollTranscript(transcript.id, apiKey);
}

async function uploadAudio(
  audioBuffer: Buffer,
  _fileName: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch(`${ASSEMBLY_BASE}/upload`, {
    method: "POST",
    headers: {
      "authorization": apiKey,
      "Content-Type": "application/octet-stream",
    },
    body: audioBuffer as unknown as BodyInit,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AssemblyAI upload failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as { upload_url: string };
  return data.upload_url;
}

async function requestTranscript(
  audioUrl: string,
  apiKey: string,
): Promise<{ id: string }> {
  const response = await fetch(`${ASSEMBLY_BASE}/transcript`, {
    method: "POST",
    headers: {
      "authorization": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      speech_model: "universal-2",
      language_detection: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AssemblyAI transcript request failed (${response.status}): ${text}`);
  }

  return (await response.json()) as { id: string };
}

async function pollTranscript(
  transcriptId: string,
  apiKey: string,
  maxRetries = 60,
): Promise<AssemblyTranscript> {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(`${ASSEMBLY_BASE}/transcript/${transcriptId}`, {
      headers: { authorization: apiKey },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AssemblyAI poll failed (${response.status}): ${text}`);
    }

    const data = (await response.json()) as AssemblyTranscript;

    if (data.status === "completed") {
      return data;
    }
    if (data.status === "error") {
      throw new Error(`AssemblyAI transcription error: ${data.error || "Unknown error"}`);
    }

    // Wait 1 second before polling again
    await new Promise((r) => setTimeout(r, 1000));
  }

  throw new Error("AssemblyAI transcription timed out");
}
