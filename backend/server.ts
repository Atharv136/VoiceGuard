import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { analyzeAudio, mapAuriginScoreToPercentage, type AuriginPrediction } from "./auriginClient.ts";

type AuriginSegment = AuriginPrediction["segments"][number];
import { transcribeAudio } from "./assemblyClient.ts";
import { detectScamKeywords, determineRiskLevel } from "./scamKeywords.ts";
import {
  saveReport,
  getReport,
  getLatestReports,
  getStatistics,
} from "./storage.ts";

const app = express();
const PORT = 3001;

app.use(cors({ origin: true }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const AURIGIN_API_KEY = process.env.AURIGIN_API_KEY || "";
const ASSEMBLY_API_KEY = process.env.ASSEMBLY_API_KEY || "";

// ─── POST /api/analyze ───────────────────────────────────────────────────────
app.post("/api/analyze", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No audio file provided" });
      return;
    }

    if (!AURIGIN_API_KEY) {
      res.status(500).json({ error: "AURIGIN_API_KEY not configured" });
      return;
    }

    const audioBuffer = req.file.buffer;
    const fileName = req.file.originalname || "recording.wav";
    const mimeType = req.file.mimetype || "audio/wav";

    // Run Aurigin deepfake detection + AssemblyAI transcription in parallel
    const [auriginResult, assemblyResult] = await Promise.allSettled([
      analyzeAudio(audioBuffer, fileName, mimeType, AURIGIN_API_KEY),
      ASSEMBLY_API_KEY
        ? transcribeAudio(audioBuffer, fileName, ASSEMBLY_API_KEY)
        : Promise.reject(new Error("ASSEMBLY_API_KEY not configured")),
    ]);

    // ── Aurigin results ──
    let auriginScore = 0;
    let auriginResultType = "bonafide";
    let auriginConfidence = 0;
    let auriginSegments: AuriginSegment[] = [];
    let auriginModel = "";
    let auriginPredictionId: string | undefined;
    let audioDuration = 0;
    let processingTime = 0;
    let auriginWarnings: string[] = [];

    if (auriginResult.status === "fulfilled") {
      const r = auriginResult.value;
      auriginScore = mapAuriginScoreToPercentage(r.global.score ?? 0);
      auriginResultType = r.global.result ?? "bonafide";
      auriginConfidence = r.global.confidence ?? 0;
      auriginSegments = r.segments ?? [];
      auriginModel = r.model ?? "";
      auriginPredictionId = r.prediction_id;
      audioDuration = r.audio_duration;
      processingTime = r.processing_time;
      auriginWarnings = r.warnings ?? [];
    } else {
      console.error("Aurigin error:", auriginResult.reason);
    }

    // ── AssemblyAI transcript ──
    let transcript = "";
    if (assemblyResult.status === "fulfilled") {
      transcript = assemblyResult.value.text || "";
    } else {
      console.error("AssemblyAI error:", assemblyResult.reason);
    }

    // If no transcript from AssemblyAI, fall back to Aurigin segment data
    if (!transcript && auriginResult.status === "fulfilled") {
      const segs = auriginResult.value.segments;
      const segLines = segs.length > 0
        ? segs.map((seg) =>
            `[${seg.start.toFixed(1)}s - ${seg.end.toFixed(1)}s] ${seg.result} (confidence: ${(seg.confidence * 100).toFixed(1)}%)`
          ).join("\n")
        : "No speech segments detected — audio may be silent or too short.";
      transcript = `[Aurigin AI analysis — ${auriginResultType}]\n${segLines}`;
    }

    // ── Scam keyword detection on the real transcript ──
    const { detected, score: keywordScore } = detectScamKeywords(transcript);
    const riskLevel = determineRiskLevel(auriginScore, keywordScore);

    // ── Generate report ──
    const reportId = uuidv4().slice(0, 8);
    const slug = `report_${reportId}`;

    const report = {
      id: slug,
      created_at: new Date().toISOString(),
      risk_level: riskLevel,
      aurigin_score: auriginScore,
      aurigin_result: auriginResultType,
      aurigin_confidence: auriginConfidence,
      aurigin_segments: auriginSegments,
      aurigin_model: auriginModel,
      keyword_score: keywordScore,
      detected_keywords: detected,
      transcript,
      shared_report_slug: slug,
      aurigin_prediction_id: auriginPredictionId,
      audio_duration: audioDuration,
      processing_time: processingTime,
      aurigin_warnings: auriginWarnings,
    };

    await saveReport(report);

    res.json({
      riskLevel,
      auriginScore,
      auriginResult: auriginResultType,
      auriginConfidence,
      auriginSegments,
      auriginModel,
      keywordScore,
      detectedKeywords: detected,
      transcript,
      sharedReportSlug: slug,
      auriginPredictionId,
      audioDuration,
      processingTime,
      auriginWarnings,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({
      error: "analysis_failed",
      message: (err as Error).message || "Analysis failed",
    });
  }
});

// ─── GET /api/reports/history ────────────────────────────────────────────────
app.get("/api/reports/history", async (_req, res) => {
  try {
    const reports = await getLatestReports();
    res.json(reports);
  } catch {
    res.json([]);
  }
});

// ─── GET /api/reports/:id ────────────────────────────────────────────────────
app.get("/api/reports/:id", async (req, res) => {
  try {
    const report = await getReport(req.params.id);
    if (!report) {
      res.status(404).json({ error: "Report not found" });
      return;
    }
    res.json(report);
  } catch (err) {
    console.error("Get report error:", err);
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

// ─── GET /api/phone/check ────────────────────────────────────────────────────
app.get("/api/phone/check", (_req, res) => {
  res.json({
    reported: false,
    carrier: "Unknown",
    lineType: "mobile",
    circle: "All India",
    disclaimer: "Phone check database is being populated.",
  });
});

// ─── POST /api/complaints/generate ───────────────────────────────────────────
app.post("/api/complaints/generate", (req, res) => {
  const { incidentType, callerNumber, date, time, amountLost, description, name, address, contactNumber } = req.body || {};
  const id = uuidv4().slice(0, 8);
  const complaintText = [
    `COMPLAINT REFERENCE: CMP/${id}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `To,`,
    `The Station House Officer`,
    `Cyber Crime Police Station`,
    ``,
    `Subject: Complaint regarding ${incidentType || "suspicious call"} from ${callerNumber || "unknown number"}`,
    ``,
    `Respected Sir/Madam,`,
    ``,
    `I, ${name || "the complainant"}, wish to lodge a complaint regarding a ${incidentType || "fraudulent"} incident.`,
    ``,
    `Details of the incident:`,
    `- Caller Number: ${callerNumber || "N/A"}`,
    `- Date & Time: ${date || "N/A"} at ${time || "N/A"}`,
    `- Amount Lost: ${amountLost || "N/A"}`,
    `- Description: ${description || "N/A"}`,
    ``,
    `Complainant Details:`,
    `- Name: ${name || "N/A"}`,
    `- Address: ${address || "N/A"}`,
    `- Contact: ${contactNumber || "N/A"}`,
    ``,
    `I request you to take appropriate legal action against the perpetrators at the earliest.`,
    ``,
    `Thanking you,`,
    `Yours sincerely,`,
    `${name || "Complainant"}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
  ].join("\n");

  res.json({ id, complaintText });
});

// ─── GET /api/statistics ─────────────────────────────────────────────────────
app.get("/api/statistics", async (_req, res) => {
  try {
    const stats = await getStatistics();
    res.json(stats);
  } catch {
    res.json({
      totalAnalyzed: 0,
      dangerousCount: 0,
      suspiciousCount: 0,
      safeCount: 0,
      familiesAlerted: 0,
      topKeywords: [],
      weeklyTrend: [],
      scamTypeBreakdown: [],
    });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  VoiceGuard API running on http://localhost:${PORT}`);
  console.log(`  Aurigin API key : ${AURIGIN_API_KEY ? "configured ✅" : "NOT SET ❌"}`);
  console.log(`  AssemblyAI key  : ${ASSEMBLY_API_KEY ? "configured ✅" : "NOT SET ❌"}\n`);
});
