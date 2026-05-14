import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "..", "data");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");

export interface StoredReport {
  id: string;
  created_at: string;
  risk_level: "Safe" | "Suspicious" | "Dangerous";
  aurigin_score: number;
  keyword_score: number;
  detected_keywords: string[];
  transcript: string;
  shared_report_slug: string;
  aurigin_prediction_id?: string;
  audio_duration?: number;
  processing_time?: number;
}

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readReports(): Promise<StoredReport[]> {
  await ensureDataDir();
  if (!existsSync(REPORTS_FILE)) {
    return [];
  }
  const content = await readFile(REPORTS_FILE, "utf-8");
  return JSON.parse(content) as StoredReport[];
}

async function writeReports(reports: StoredReport[]) {
  await ensureDataDir();
  await writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf-8");
}

export async function saveReport(report: StoredReport): Promise<void> {
  const reports = await readReports();
  reports.unshift(report);
  await writeReports(reports);
}

export async function getReport(id: string): Promise<StoredReport | null> {
  const reports = await readReports();
  return reports.find((r) => r.id === id) || null;
}

export async function getLatestReports(limit = 50): Promise<StoredReport[]> {
  const reports = await readReports();
  return reports.slice(0, limit);
}

export async function getStatistics() {
  const reports = await readReports();
  const totalAnalyzed = reports.length;
  const dangerousCount = reports.filter((r) => r.risk_level === "Dangerous").length;
  const suspiciousCount = reports.filter((r) => r.risk_level === "Suspicious").length;
  const safeCount = reports.filter((r) => r.risk_level === "Safe").length;
  const familiesAlerted = dangerousCount;

  // Top keywords
  const keywordCounts = new Map<string, number>();
  for (const r of reports) {
    for (const kw of r.detected_keywords) {
      keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
    }
  }
  const topKeywords = [...keywordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));

  return {
    totalAnalyzed,
    dangerousCount,
    suspiciousCount,
    safeCount,
    familiesAlerted,
    topKeywords,
    weeklyTrend: [] as { date: string; total: number; dangerous: number }[],
    scamTypeBreakdown: [] as { type: string; count: number }[],
  };
}
