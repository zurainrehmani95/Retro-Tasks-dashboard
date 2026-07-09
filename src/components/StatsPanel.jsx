import { useEffect, useState } from 'react';
import DonutChart from './DonutChart.jsx';
import useRubberBand from '../hooks/useRubberBand.js';

function useClock() {
  const [time, setTime] = useState(() => new Date().toTimeString().split(' ')[0]);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function StatsPanel({ completed, pending, total }) {
  const [chartOpen, setChartOpen] = useState(false);
  const clock = useClock();
  const rubberRef = useRubberBand();

  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const productivity = Math.min(20 + completed * 15, 100);

  return (
    <section id="stats-section" className="dashboard-section">
      <div className="container glass-card rubber" ref={rubberRef}>
        <h3 className="neon-title">SYSTEM STATS</h3>

        <div className="clock-widget">
          <div id="digitalClock">{clock}</div>
        </div>

        <div className="stat-row">
          <span>TASKS COMPLETION RATE</span>
          <span className="stat-value">{completionRate}%</span>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="stat-row">
          <span>PRODUCTIVITY LEVEL</span>
          <span className="stat-value">{productivity}%</span>
          <div className="progress-bar-container">
            <div className="progress-bar level-two" style={{ width: `${productivity}%` }} />
          </div>
        </div>

        <button
          className={`stats-dropdown-btn${chartOpen ? ' open' : ''}`}
          onClick={() => setChartOpen((prev) => !prev)}
          aria-expanded={chartOpen}
        >
          <span>DATA VISUAL</span>
          <span className="arrow-icon">▼</span>
        </button>

        <div className={`stats-chart-panel${chartOpen ? '' : ' hidden'}`}>
          <DonutChart completed={completed} pending={pending} total={total} />
          <div className="chart-legend">
            <div className="legend-row">
              <span className="legend-dot dot-pink" />
              <span>COMPLETED</span>
              <b>{completed}</b>
            </div>
            <div className="legend-row">
              <span className="legend-dot dot-cyan" />
              <span>PENDING</span>
              <b>{pending}</b>
            </div>
            <div className="legend-row legend-total">
              <span>TOTAL</span>
              <b>{total}</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
