import { useRef } from 'react';
import useScrollTransition from '../hooks/useScrollTransition.js';

export default function VaporBackground({ children }) {
  const dimmerRef = useRef(null);
  const gridRef = useRef(null);

  useScrollTransition(dimmerRef, gridRef);

  return (
    <div className="crt-overlay">
      <div id="vaporwaveGrid" ref={gridRef}>
        <video autoPlay loop muted playsInline id="vaporwaveVideo">
          <source src="/vaporwave1.mp4" type="video/mp4" />
        </video>
        <div className="video-blend-mask" />
      </div>
      <div id="backgroundDimmer" ref={dimmerRef} />

      {children}
    </div>
  );
}
