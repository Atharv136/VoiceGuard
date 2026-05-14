export const SCAM_PHRASES = [
  { phrase: "digital arrest", severity: "high" },
  { phrase: "RBI safe account", severity: "high" },
  { phrase: "do not disconnect", severity: "high" },
  { phrase: "Aadhaar misused", severity: "high" },
  { phrase: "share the OTP", severity: "high" },
  { phrase: "share OTP", severity: "high" },
  { phrase: "KYC expiring today", severity: "high" },
  { phrase: "KYC expire", severity: "high" },
  { phrase: "money laundering", severity: "high" },
  { phrase: "send money fast", severity: "high" },
  { phrase: "I had an accident", severity: "medium" },
  { phrase: "do not tell papa", severity: "medium" },
  { phrase: "do not tell mom", severity: "medium" },
  { phrase: "processing fee", severity: "medium" },
  { phrase: "lottery winner", severity: "medium" },
  { phrase: "KBC lottery", severity: "high" },
  { phrase: "pay processing fee", severity: "high" },
  { phrase: "install AnyDesk", severity: "high" },
  { phrase: "install anydesk", severity: "high" },
  { phrase: "courier parcel", severity: "medium" },
  { phrase: "SIM will be blocked", severity: "high" },
  { phrase: "SIM block", severity: "high" },
  { phrase: "share the six digit OTP", severity: "high" },
  { phrase: "account blocked", severity: "medium" },
  { phrase: "transfer to safe account", severity: "high" },
  { phrase: "safe account", severity: "high" },
  { phrase: "police case", severity: "high" },
  { phrase: "FBI", severity: "medium" },
  { phrase: "CBI officer", severity: "high" },
  { phrase: "customs parcel", severity: "medium" },
  { phrase: "court summons", severity: "high" },
  { phrase: "digital arrest warrant", severity: "high" },
  { phrase: "prize money", severity: "medium" },
  { phrase: "claim your prize", severity: "medium" },
  { phrase: "you have won", severity: "medium" },
  { phrase: "congratulations you have won", severity: "medium" },
  { phrase: "credit card free", severity: "low" },
  { phrase: "loan approved", severity: "low" },
  { phrase: "zero interest", severity: "low" },
  { phrase: "work from home", severity: "low" },
  { phrase: "easy money", severity: "low" },
  { phrase: "part time job", severity: "low" },
  { phrase: "make money fast", severity: "low" },
  { phrase: "double your money", severity: "low" },
  { phrase: "click this link", severity: "medium" },
  { phrase: "verify now", severity: "medium" },
  { phrase: "update your account", severity: "medium" },
  { phrase: "confirm your details", severity: "medium" },
  { phrase: "government refund", severity: "medium" },
  { phrase: "tax refund", severity: "medium" },
  { phrase: "electricity bill overdue", severity: "medium" },
  { phrase: "disconnection notice", severity: "medium" },
  { phrase: "gas connection", severity: "low" },
];

export function detectScamKeywords(transcript: string): { detected: string[]; score: number } {
  const lower = transcript.toLowerCase();
  const detected: string[] = [];

  for (const { phrase } of SCAM_PHRASES) {
    if (lower.includes(phrase)) {
      detected.push(phrase);
    }
  }

  const uniqueDetected = [...new Set(detected)];

  // Score: 0-100 based on number and severity of matches
  const base = Math.min(uniqueDetected.length * 12, 60);
  const highCount = uniqueDetected.filter((p) => {
    const entry = SCAM_PHRASES.find((s) => s.phrase === p);
    return entry?.severity === "high";
  }).length;
  const bonus = Math.min(highCount * 8, 40);

  const score = Math.min(base + bonus, 100);

  return { detected: uniqueDetected, score };
}

export function determineRiskLevel(auriginScore: number, keywordScore: number): "Safe" | "Suspicious" | "Dangerous" {
  if (auriginScore >= 70 || keywordScore >= 70) return "Dangerous";
  if (auriginScore >= 40 || keywordScore >= 40) return "Suspicious";
  return "Safe";
}

export function getCombinedScore(auriginScore: number, keywordScore: number): number {
  return Math.max(auriginScore, keywordScore);
}
