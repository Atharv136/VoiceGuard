import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { statisticsService, type StatisticsData } from "@/services/statisticsService";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/statistics")({
  head: () => ({ meta: [{ title: "Statistics — VoiceGuard" }] }),
  component: Stats,
});

const fmt = (n: number) => n.toLocaleString("en-IN");

const COLORS = ["#1A56DB", "#E02424", "#F59E0B", "#10B981"];

function Stats() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statisticsService.get().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { k: "Total analyzed", v: fmt(data?.totalAnalyzed || 0) },
    { k: "Dangerous flagged", v: fmt(data?.dangerousCount || 0) },
    { k: "Families alerted", v: fmt(data?.familiesAlerted || 0) },
    { k: "Safe results", v: fmt(data?.safeCount || 0) },
  ];

  const riskDistribution = [
    { name: "Safe", value: data?.safeCount || 0, color: "#10B981" },
    { name: "Suspicious", value: data?.suspiciousCount || 0, color: "#F59E0B" },
    { name: "Dangerous", value: data?.dangerousCount || 0, color: "#E02424" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">VoiceGuard protection stats</h1>
      <p className="mt-2 text-muted-foreground">Community-wide safety data and fraud trends.</p>
      
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.k} className="rounded-[14px] border bg-card p-5 shadow-sm">
            <p className="font-display text-3xl font-extrabold tabular-nums md:text-4xl">{c.v}</p>
            <p className="mt-1 text-xs font-bold text-muted-foreground uppercase tracking-tight">{c.k}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Risk distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {riskDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top scam phrases detected">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data?.topKeywords || []} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="keyword" stroke="#6B7280" fontSize={11} width={130} />
              <Tooltip />
              <Bar dataKey="count" fill="#1A56DB" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Analysis volume trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data?.weeklyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total Calls" stroke="#1A56DB" strokeWidth={3} />
              <Line type="monotone" dataKey="dangerous" name="Dangerous" stroke="#E02424" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Scam categories breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data?.scamTypeBreakdown || []} dataKey="count" nameKey="type" outerRadius={100} label>
                {(data?.scamTypeBreakdown || []).map((d, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border bg-card p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
