import useRubberBand from '../hooks/useRubberBand.js';

export default function Archive({ archive }) {
  const rubberRef = useRubberBand();

  return (
    <section id="graveyard-section" className="dashboard-section">
      <div className="container glass-card rubber" ref={rubberRef}>
        <h3 className="neon-title">TASK ARCHIVE</h3>
        <p className="sub-text">History of conquered data strings...</p>

        <ul className="archive-list">
          {archive.length === 0 ? (
            <li className="empty-hint">No completed tasks yet.</li>
          ) : (
            archive.map((item) => (
              <li key={item.id}>
                <span>✔ {item.text}</span>
                <span className="archive-time">{item.time}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
