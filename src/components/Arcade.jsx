import { useEffect, useRef, useState } from 'react';
import useRubberBand from '../hooks/useRubberBand.js';

const pad = (n) => String(n).padStart(5, '0');

export default function Arcade() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const rubberRef = useRubberBand();
  const [score, setScore] = useState(0);
  const [buttonLabel, setButtonLabel] = useState('START ENGINE');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    // All mutable game state lives here so re-renders never disturb the loop.
    const state = {
      gameActive: false,
      animationFrameId: null,
      currentScore: 0,
      obstacles: [],
      gameSpeed: 2,
      lastTime: 0,
      lastSpawn: 0,
      keys: { Left: false, Right: false },
      car: { x: 190, y: 200, width: 30, height: 15, speed: 4 },
    };

    if (canvas) {
      state.car.x = canvas.width / 2;
      state.car.y = canvas.height - 40;
      canvas.setAttribute('tabindex', '0');
    }

    function updateArcadeScore(points) {
      state.currentScore += points;
      setScore(state.currentScore);
    }

    function spawnObstacle() {
      state.obstacles.push({
        perspectiveX: Math.random() * 2 - 1,
        progress: 0,
        size: 2,
        color: Math.random() > 0.5 ? '#00ffff' : '#ffff00',
      });
    }

    function runGameEngine(timestamp) {
      if (!state.gameActive || !canvas || !ctx) return;

      // --- DELTA TIME ---
      if (!state.lastTime) state.lastTime = timestamp;
      const delta = (timestamp - state.lastTime) / 16.67; // 1.0 at 60 Hz
      state.lastTime = timestamp;

      const { car, keys, obstacles } = state;

      // --- PLAYER MOVEMENT (delta-scaled) ---
      if (keys.Left) car.x -= car.speed * delta;
      if (keys.Right) car.x += car.speed * delta;

      const halfWidth = car.width / 2;
      if (car.x < halfWidth) car.x = halfWidth;
      if (car.x > canvas.width - halfWidth) car.x = canvas.width - halfWidth;

      // --- SPAWN TIMER (~750 ms) ---
      if (timestamp - state.lastSpawn > 750) {
        spawnObstacle();
        state.lastSpawn = timestamp;
        state.gameSpeed = Math.min(state.gameSpeed + 0.05, 8);
      }

      // --- UPDATE & COLLISION ---
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.progress += state.gameSpeed * 0.005 * delta;
        obs.size = Math.min(obs.progress * 25, 25);

        const currentX = (canvas.width / 2) + (obs.perspectiveX * (canvas.width / 2) * obs.progress * 0.8);
        const currentY = (canvas.height * 0.4) + ((canvas.height * 0.6) * obs.progress);

        if (
          Math.abs(currentX - car.x) < (car.width / 2 + obs.size / 2) &&
          Math.abs(currentY - (car.y + car.height / 2)) < (car.height / 2 + obs.size / 2)
        ) {
          endGameSequence('CRASH DETECTED');
          return;
        }

        if (obs.progress >= 1) {
          obstacles.splice(i, 1);
          updateArcadeScore(150);
        }
      }

      // --- RENDER ---
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 0, 127, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.4);
      ctx.lineTo(canvas.width, canvas.height * 0.4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height * 0.4);
      ctx.lineTo(10, canvas.height);
      ctx.moveTo(canvas.width / 2, canvas.height * 0.4);
      ctx.lineTo(canvas.width - 10, canvas.height);
      ctx.stroke();

      obstacles.forEach((obs) => {
        const drawX = (canvas.width / 2) + (obs.perspectiveX * (canvas.width / 2) * obs.progress * 0.8);
        const drawY = (canvas.height * 0.4) + ((canvas.height * 0.6) * obs.progress);

        ctx.shadowBlur = 8;
        ctx.shadowColor = obs.color;
        ctx.fillStyle = obs.color;
        ctx.fillRect(drawX - obs.size / 2, drawY - obs.size / 2, obs.size, obs.size);
      });

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ffff';
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.moveTo(car.x - car.width / 2, car.y + car.height);
      ctx.lineTo(car.x + car.width / 2, car.y + car.height);
      ctx.lineTo(car.x + car.width * 0.3, car.y);
      ctx.lineTo(car.x - car.width * 0.3, car.y);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      state.animationFrameId = requestAnimationFrame(runGameEngine);
    }

    function endGameSequence(message) {
      state.gameActive = false;

      if (state.animationFrameId !== null) {
        cancelAnimationFrame(state.animationFrameId);
        state.animationFrameId = null;
      }

      state.keys.Left = false;
      state.keys.Right = false;
      state.lastTime = 0;

      setButtonLabel('REIGNITE ENGINE');

      if (!canvas || !ctx) return;

      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ff007f';
      ctx.font = "20px 'Share Tech Mono'";
      ctx.textAlign = 'center';
      ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 10);

      ctx.fillStyle = '#00ffff';
      ctx.font = "12px 'Share Tech Mono'";
      ctx.fillText(
        `TOTAL SCORE STRINGS SEVERED: ${pad(state.currentScore)}`,
        canvas.width / 2,
        canvas.height / 2 + 15
      );

      ctx.textAlign = 'left';
    }

    function start() {
      if (!state.gameActive) {
        state.gameActive = true;
        state.obstacles = [];
        state.gameSpeed = 2.5;
        state.currentScore = 0;
        state.lastSpawn = performance.now();
        state.lastTime = 0;

        updateArcadeScore(0);

        if (canvas) {
          state.car.x = canvas.width / 2;
          state.car.y = canvas.height - 40;
          canvas.focus();
        }

        setButtonLabel('ABORT ENGINE');

        if (state.animationFrameId !== null) {
          cancelAnimationFrame(state.animationFrameId);
          state.animationFrameId = null;
        }

        state.animationFrameId = requestAnimationFrame(runGameEngine);
      } else {
        endGameSequence('SYSTEM TERMINATED');
      }
    }

    engineRef.current = { start };

    const handleKeyDown = (e) => {
      if (!state.gameActive) return;
      if (e.key === 'ArrowLeft') { state.keys.Left = true; e.preventDefault(); }
      if (e.key === 'ArrowRight') { state.keys.Right = true; e.preventDefault(); }
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') state.keys.Left = false;
      if (e.key === 'ArrowRight') state.keys.Right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (state.animationFrameId !== null) cancelAnimationFrame(state.animationFrameId);
      state.gameActive = false;
      engineRef.current = null;
    };
  }, []);

  const handleStartClick = () => engineRef.current?.start();

  return (
    <section id="arcade-section" className="dashboard-section">
      <div className="container glass-card rubber" ref={rubberRef}>
        <h3 className="neon-title">NEON OUTRUN</h3>

        <div className="score-panel">
          SCORE : <span id="arcadeScore">{pad(score)}</span>
        </div>

        <ol className="arcade-list">
          <li><span className="player">CYBER_USER</span><span className="score">{pad(score)}</span></li>
          <li><span className="player">NEON_COWBOY</span><span className="score">08500</span></li>
          <li><span className="player">VAPOR_WAVE</span><span className="score">04200</span></li>
        </ol>

        <div className="arcade-screen">
          <canvas ref={canvasRef} className="arcade-canvas" width={380} height={240} />
          <button className="retro-btn" onClick={handleStartClick}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
