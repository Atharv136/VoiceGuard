export type Risk = "safe" | "suspicious" | "dangerous";

export type AnalysisRecord = {
  id: string;
  date: string;
  risk: Risk;
  voiceScore: number;
  languageScore: number;
  combinedScore: number;
  keywords: string[];
  transcript: string;
  preview: string;
  callerNumber?: string;
};

export const seededAnalyses: AnalysisRecord[] = [
  {
    id: "rec_001",
    date: "2025-05-12 09:14",
    risk: "dangerous",
    voiceScore: 18,
    languageScore: 12,
    combinedScore: 14,
    keywords: ["digital arrest", "RBI safe account", "do not disconnect", "Aadhaar misused"],
    callerNumber: "+91 70xxxx2391",
    transcript:
      "Ma'am this is officer Verma from CBI Mumbai. Your Aadhaar is being used in a money laundering case. You are under digital arrest until verification is done. Do not disconnect this call. Transfer twenty thousand rupees to a safe RBI account in the next ten minutes for verification or police will be at your home.",
    preview: "CBI officer claims digital arrest, asks transfer to RBI account...",
  },
  {
    id: "rec_002",
    date: "2025-05-11 18:42",
    risk: "suspicious",
    voiceScore: 64,
    languageScore: 41,
    combinedScore: 52,
    keywords: ["KYC expiring today", "share OTP"],
    callerNumber: "+91 88xxxx1027",
    transcript:
      "Hello sir I am calling from your bank. Your KYC is expiring today by 6 PM. Please share the six digit OTP you just received so we can update the records and your account does not get blocked.",
    preview: "Bank KYC expiry pressure, asked for OTP...",
  },
  {
    id: "rec_003",
    date: "2025-05-10 11:05",
    risk: "safe",
    voiceScore: 92,
    languageScore: 88,
    combinedScore: 90,
    keywords: [],
    callerNumber: "+91 98xxxx4471",
    transcript:
      "Hi mom, just calling to say I will reach Bangalore by evening. The flight is on time. Tell papa I will call once I land. Love you, bye.",
    preview: "Family check-in call, no risk indicators...",
  },
  {
    id: "rec_004",
    date: "2025-05-08 15:31",
    risk: "dangerous",
    voiceScore: 22,
    languageScore: 9,
    combinedScore: 15,
    keywords: ["mummy please send money fast", "I had an accident", "do not tell papa"],
    callerNumber: "+91 76xxxx9920",
    transcript:
      "Mummy please send money fast I am in trouble. I had an accident, do not tell papa. My phone is broken so I am calling from this number. Just transfer twenty five thousand to this UPI, I will explain later.",
    preview: "Possible voice clone family emergency scam...",
  },
  {
    id: "rec_005",
    date: "2025-05-06 10:12",
    risk: "suspicious",
    voiceScore: 58,
    languageScore: 47,
    combinedScore: 53,
    keywords: ["pay processing fee", "lottery"],
    callerNumber: "+91 91xxxx5512",
    transcript:
      "Congratulations, you have won a KBC lottery of twenty five lakh rupees. Pay processing fee of three thousand and we will release the prize money to your account immediately.",
    preview: "Lottery prize claim with upfront fee...",
  },
];

export const reportedNumbers = [
  { number: "+91 70xxxx2391", scam: "Fake CBI Digital Arrest", reports: 184, last: "2 hours ago" },
  { number: "+91 88xxxx1027", scam: "Bank KYC OTP Theft", reports: 97, last: "5 hours ago" },
  { number: "+91 76xxxx9920", scam: "Voice Clone Family Emergency", reports: 63, last: "Yesterday" },
  { number: "+91 91xxxx5512", scam: "KBC Lottery Prize", reports: 211, last: "Today" },
  { number: "+91 80xxxx6648", scam: "Fake Electricity Disconnection", reports: 142, last: "1 day ago" },
  { number: "+91 99xxxx3380", scam: "Fake Customs Parcel", reports: 56, last: "3 days ago" },
  { number: "+91 73xxxx0014", scam: "Fake Court Summons", reports: 38, last: "2 days ago" },
  { number: "+91 95xxxx7782", scam: "Fake Job Offer", reports: 109, last: "Today" },
  { number: "+91 84xxxx2210", scam: "SIM Block Threat", reports: 71, last: "Yesterday" },
];

export const stats = {
  totalAnalyzed: 142_318,
  dangerousFlagged: 28_447,
  familiesAlerted: 9_812,
  scamPhrasesDetected: 187_902,
  complaintsFiled: 4_106,
};

export const weeklyTrend = [
  { week: "W1", analyzed: 12400, dangerous: 1830 },
  { week: "W2", analyzed: 13050, dangerous: 2110 },
  { week: "W3", analyzed: 14260, dangerous: 2640 },
  { week: "W4", analyzed: 15720, dangerous: 3120 },
  { week: "W5", analyzed: 16890, dangerous: 3470 },
  { week: "W6", analyzed: 18230, dangerous: 3905 },
  { week: "W7", analyzed: 20140, dangerous: 4480 },
  { week: "W8", analyzed: 22680, dangerous: 5210 },
];

export const topPhrases = [
  { phrase: "share the OTP", count: 8420 },
  { phrase: "digital arrest", count: 7110 },
  { phrase: "RBI safe account", count: 6580 },
  { phrase: "KYC expiring today", count: 5940 },
  { phrase: "Aadhaar misused", count: 5130 },
  { phrase: "do not disconnect", count: 4720 },
  { phrase: "install AnyDesk", count: 3980 },
  { phrase: "lottery winner", count: 3550 },
  { phrase: "courier parcel", count: 3120 },
  { phrase: "SIM will be blocked", count: 2890 },
];

export const riskDistribution = [
  { name: "Safe", value: 58, color: "var(--color-safe)" },
  { name: "Suspicious", value: 22, color: "var(--color-warning)" },
  { name: "Dangerous", value: 20, color: "var(--color-danger)" },
];

export const scamCategories = [
  { name: "Financial", value: 38, color: "var(--color-primary)" },
  { name: "Government", value: 31, color: "var(--color-danger)" },
  { name: "Family", value: 17, color: "var(--color-warning)" },
  { name: "Impersonation", value: 14, color: "var(--color-safe)" },
];

export const helplines = [
  { label: "Cyber Crime", number: "1930" },
  { label: "Senior Citizen", number: "14567" },
  { label: "Women Helpline", number: "1091" },
];
