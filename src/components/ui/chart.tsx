"use client";

import { useState, useRef, useCallback } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
}

export function LineChart({
  data,
  height = 200,
  color = "var(--accent)",
  showGrid = true,
}: LineChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = 100; // percentage-based, SVG viewBox handles it
  const viewBoxWidth = 600;
  const viewBoxHeight = height;
  const innerWidth = viewBoxWidth - padding.left - padding.right;
  const innerHeight = viewBoxHeight - padding.top - padding.bottom;

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center border border-dashed border-[var(--border-primary)] rounded-lg"
        style={{ height }}
      >
        <p className="text-sm text-[var(--text-tertiary)]">No data to display</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = 0;
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * innerWidth,
    y: padding.top + innerHeight - ((d.value - minValue) / range) * innerHeight,
    label: d.label,
    value: d.value,
  }));

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Area polygon (fills under the line)
  const firstPoint = points[0]!;
  const lastPoint = points[points.length - 1]!;
  const areaPoints = [
    `${firstPoint.x},${padding.top + innerHeight}`,
    ...points.map((p) => `${p.x},${p.y}`),
    `${lastPoint.x},${padding.top + innerHeight}`,
  ].join(" ");

  // Y-axis grid lines (5 lines)
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const value = minValue + (range / 4) * i;
    const y = padding.top + innerHeight - ((value - minValue) / range) * innerHeight;
    return { y, label: Math.round(value).toString() };
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg || points.length === 0) return;

      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * viewBoxWidth;

      // Find closest point
      let closest = points[0]!;
      let closestDist = Math.abs(mouseX - closest.x);
      for (const p of points) {
        const dist = Math.abs(mouseX - p.x);
        if (dist < closestDist) {
          closest = p;
          closestDist = dist;
        }
      }

      setTooltip({
        x: closest.x,
        y: closest.y,
        label: closest.label,
        value: closest.value,
      });
    },
    [points]
  );

  const gradientId = `chart-gradient-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid &&
          gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={viewBoxWidth - padding.right}
                y2={line.y}
                stroke="var(--border-primary)"
                strokeWidth="0.5"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 6}
                y={line.y + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--text-tertiary)"
              >
                {line.label}
              </text>
            </g>
          ))}

        {/* Area fill */}
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />

        {/* Line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* X-axis labels (show max 8) */}
        {data.length > 0 &&
          data
            .filter((_, i) => {
              const step = Math.max(1, Math.floor(data.length / 8));
              return i % step === 0 || i === data.length - 1;
            })
            .map((d, _idx) => {
              const i = data.indexOf(d);
              const x = padding.left + (i / Math.max(data.length - 1, 1)) * innerWidth;
              return (
                <text
                  key={i}
                  x={x}
                  y={viewBoxHeight - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--text-tertiary)"
                >
                  {d.label.length > 5 ? d.label.slice(5) : d.label}
                </text>
              );
            })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <line
              x1={tooltip.x}
              y1={padding.top}
              x2={tooltip.x}
              y2={padding.top + innerHeight}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.5"
            />
            <circle cx={tooltip.x} cy={tooltip.y} r="4" fill={color} stroke="white" strokeWidth="2" />
            <rect
              x={tooltip.x - 35}
              y={tooltip.y - 28}
              width="70"
              height="20"
              rx="4"
              fill="var(--bg-inverse)"
              opacity="0.9"
            />
            <text
              x={tooltip.x}
              y={tooltip.y - 14}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--text-inverse)"
            >
              {tooltip.value.toLocaleString()}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
