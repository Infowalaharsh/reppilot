import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

export function LineTrend({ data, dataKey = "weight" }: { data: { date: string; weight: number }[]; dataKey?: string }) {
  if (data.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8">No data yet.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} tickFormatter={(v) => v.slice(5)} />
        <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} width={28} />
        <Tooltip contentStyle={{ background: "#181818", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
        <Line type="monotone" dataKey={dataKey} stroke="#4F8CFF" strokeWidth={2.5} dot={{ r: 3, fill: "#4F8CFF" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarWeeks({ data }: { data: { week: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} />
        <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} width={20} allowDecimals={false} />
        <Tooltip contentStyle={{ background: "#181818", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="count" fill="#4F8CFF" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}