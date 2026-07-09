import { useRef, useState } from 'react';
import useRubberBand from '../hooks/useRubberBand.js';

const TRACK_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function RadioPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const rubberRef = useRubberBand();

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const wheelClass = `wheel spin-animation${playing ? ' playing' : ''}`;

  return (
    <section id="music-section" className="dashboard-section">
      <div className="container glass-card rubber" ref={rubberRef}>
        <h3 className="neon-title">SYNTH RADIO</h3>
        <div className="cassette-player">
          <div className="cassette-body">
            <div className={wheelClass} />
            <div className={wheelClass} />
          </div>
          <div className="audio-controls">
            <button className="retro-btn" onClick={togglePlay}>
              {playing ? 'PAUSE' : 'PLAY'}
            </button>
            <span className="track-title">MIAMI_VIBES.MP3</span>
          </div>
          <audio ref={audioRef} src={TRACK_SRC} loop />
        </div>
      </div>
    </section>
  );
}
