import { createFileRoute } from "@tanstack/react-router";
import { stats, weeklyTrend, topPhrases, riskDistribution, scamCategories } from "@/data/mock";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

export const Route = createFileRoute("/_app/statistics")({
  head: () => ({ meta: [{ title: "Statistics — VoiceGuard" }] }),
  component: Stats,
});

const fmt = (n: number) => n.toLocaleString("en-IN");

function Stats() {
  const cards = [
    { k: "Total analyzed", v: fmt(stats.totalAnalyzed) },
    { k: "Dangerous flagged", v: fmt(stats.dangerousFlagged) },
    { k: "Families alerted", v: fmt(stats.familiesAlerted) },
    { k: "Complaints filed", v: fmt(stats.complaintsFiled) },
  ];
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">VoiceGuard protection stats</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.k} className="rounded-[14px] border bg-card p-5">
            <p className="font-display text-3xl font-extrabold tabular-nums md:text-4xl">{c.v}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{c.k}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Risk level distribution">
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
            <BarChart data={topPhrases} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis type="category" dataKey="phrase" stroke="var(--color-muted-foreground)" fontSize={11} width={130} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Weekly analysis trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="analyzed" stroke="var(--color-primary)" strokeWidth={2} />
              <Line type="monotone" dataKey="dangerous" stroke="var(--color-danger)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Scam type categories">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={scamCategories} dataKey="value" outerRadius={100} label>
                {scamCategories.map((d, i) => <Cell key={i} fill={d.color} />)}
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
    <div className="rounded-[14px] border bg-card p-5">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
