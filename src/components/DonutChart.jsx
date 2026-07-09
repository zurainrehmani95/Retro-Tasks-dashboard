import { useEffect, useRef } from 'react';

// Canvas donut: completed (pink) vs pending (cyan) with the rate in the middle.
export default function DonutChart({ completed, pending, total }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - 12;
    const ringWidth = 22;

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = ringWidth;

    if (total === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();
    } else {
      const segments = [
        { value: completed, color: '#ff007f' },
        { value: pending, color: '#00ffff' },
      ];
      let start = -Math.PI / 2;
      segments.forEach((seg) => {
        if (seg.value <= 0) return;
        const angle = (seg.value / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, start, start + angle);
        ctx.strokeStyle = seg.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = seg.color;
        ctx.stroke();
        start += angle;
      });
      ctx.shadowBlur = 0;
    }

    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "24px 'Share Tech Mono', monospace";
    ctx.fillText(`${rate}%`, cx, cy - 6);
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('DONE', cx, cy + 14);
  }, [completed, pending, total]);

  return <canvas ref={canvasRef} className="stats-chart" width={180} height={180} />;
}
