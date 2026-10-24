/** Presentation only. Values arrive from the existing reporting engine in LKR cents. */
export function ComparisonChart({
  rows,
}: {
  rows: { date: string; orderValue: number; collected: number }[];
}) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.orderValue, r.collected]));
  const power = 10 ** Math.floor(Math.log10(max / 4));
  const step = Math.ceil(max / 4 / power) * power;
  const top = step * 4;
  const chart = { left: 54, width: 560, baseline: 161, height: 140 };
  const pitch = chart.width / Math.max(1, rows.length);
  const bar = Math.min(18, pitch / 3);
  return (
    <svg viewBox="0 0 640 198" className="comparison-chart" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((n) => {
        const y = chart.baseline - (n / 4) * chart.height;
        return (
          <g key={n}>
            <line
              x1={chart.left}
              x2={chart.left + chart.width}
              y1={y}
              y2={y}
              className="chart-gridline"
            />
            <text
              x={chart.left - 10}
              y={y + 4}
              textAnchor="end"
              className="chart-tick"
            >
              {new Intl.NumberFormat("en-LK", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format((n * step) / 100)}
            </text>
          </g>
        );
      })}
      {rows.map((r, i) => {
        const center = chart.left + (i + 0.5) * pitch;
        return (
          <g key={r.date}>
            <rect
              x={center - bar - 2}
              y={chart.baseline - (r.orderValue / top) * chart.height}
              width={bar}
              height={(r.orderValue / top) * chart.height}
              rx="2"
              className="comparison-value"
            />
            <rect
              x={center + 2}
              y={chart.baseline - (r.collected / top) * chart.height}
              width={bar}
              height={(r.collected / top) * chart.height}
              rx="2"
              className="comparison-collected"
            />
            <text x={center} y="184" textAnchor="middle" className="chart-tick">
              {r.date.slice(8)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
