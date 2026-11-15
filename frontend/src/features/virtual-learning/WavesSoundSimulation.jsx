import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button, PaperCard } from '../../components/ui';
import { resolveCssVar } from '../../components/ui/subjectUtils';

/**
 * Waves & Sound Simulation (P2-8.5)
 * CBSE Class 10 & 12 Physics: Wave equation v = f * lambda, transverse vs longitudinal waves,
 * harmonic superposition, and Web Audio API tone generator.
 */
export default function WavesSoundSimulation() {
  const [waveType, setWaveType] = useState('transverse'); // 'transverse' | 'longitudinal' | 'superposition'
  const [frequency, setFrequency] = useState(2); // Hz in simulation
  const [amplitude, setAmplitude] = useState(35); // pixels
  const [soundFreq, setSoundFreq] = useState(440); // Audible Hz (A4)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [volume, setVolume] = useState(0.2); // 0.0 to 1.0 safe default
  const [isAnimating, setIsAnimating] = useState(true);

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainNodeRef = useRef(null);
  const timeRef = useRef(0);
  const animFrameRef = useRef(null);

  // Web Audio API controls
  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(soundFreq, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start();
        oscRef.current = osc;
        gainNodeRef.current = gain;
        setIsPlayingAudio(true);
      } catch (err) {
        console.warn('AudioContext error:', err);
      }
    }
  };

  // Update audio frequency in real time
  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setTargetAtTime(soundFreq, audioCtxRef.current.currentTime, 0.05);
    }
  }, [soundFreq]);

  // Update audio volume in real time
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (_) {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (_) {}
      }
    };
  }, []);

  // Animation Loop on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const cGrid = resolveCssVar('--paper-edge');
    const cAxis = resolveCssVar('--ink-soft');
    const cPhysics = resolveCssVar('--physics');
    const cRed = resolveCssVar('--red-600');
    const cInk = resolveCssVar('--ink');
    const cMuted = resolveCssVar('--ink-muted');
    const cEmerald = resolveCssVar('--emerald-600');
    const cMaths = resolveCssVar('--maths');

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = cGrid;
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerY = height / 2;

      // Equilibrium baseline
      ctx.strokeStyle = cAxis;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      const t = timeRef.current;
      const k = 0.025; // wave number
      const omega = frequency * 2; // angular velocity

      if (waveType === 'transverse') {
        // Draw primary transverse sine wave
        ctx.beginPath();
        ctx.strokeStyle = cPhysics;
        ctx.lineWidth = 3;
        for (let x = 0; x < width; x++) {
          const y = centerY + amplitude * Math.sin(k * x - omega * t);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Particles moving vertically
        for (let x = 40; x < width; x += 60) {
          const y = centerY + amplitude * Math.sin(k * x - omega * t);
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = cRed;
          ctx.fill();

          // Particle velocity vector indicator
          const vy = -amplitude * omega * Math.cos(k * x - omega * t) * 0.15;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + vy);
          ctx.strokeStyle = cRed;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Labels
        ctx.fillStyle = cInk;
        ctx.font = '11px sans-serif';
        ctx.fillText('Crest (Max +A)', 10, centerY - amplitude - 8);
        ctx.fillText('Trough (Min -A)', 10, centerY + amplitude + 16);
      } else if (waveType === 'longitudinal') {
        // Draw Longitudinal Wave (Particles in air column compressing & rarefacting)
        const rows = 5;
        const cols = 50;
        const spacingX = width / cols;
        const spacingY = 24;

        for (let r = 0; r < rows; r++) {
          const py = centerY - ((rows - 1) * spacingY) / 2 + r * spacingY;
          for (let c = 0; c < cols; c++) {
            const baseX = c * spacingX;
            const dx = (amplitude * 0.6) * Math.cos(k * baseX - omega * t);
            const px = baseX + dx;

            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            const compression = -Math.sin(k * baseX - omega * t);
            if (compression > 0.4) {
              ctx.fillStyle = cRed; // Dense (Compression)
            } else if (compression < -0.4) {
              ctx.fillStyle = cPhysics; // Rare (Rarefaction)
            } else {
              ctx.fillStyle = cMuted;
            }
            ctx.fill();
          }
        }

        // Compression / Rarefaction annotations
        ctx.fillStyle = cRed;
        ctx.font = '12px sans-serif';
        ctx.fillText('Compression (High Pressure)', 30, centerY - 65);
        ctx.fillStyle = cPhysics;
        ctx.fillText('Rarefaction (Low Pressure)', width - 210, centerY - 65);
      } else if (waveType === 'superposition') {
        // Wave 1: Physics blue
        ctx.save();
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.strokeStyle = cPhysics;
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x++) {
          const y1 = centerY + (amplitude * 0.6) * Math.sin(k * x - omega * t);
          if (x === 0) ctx.moveTo(x, y1);
          else ctx.lineTo(x, y1);
        }
        ctx.stroke();

        // Wave 2: Emerald green (opposite direction, standing wave)
        ctx.beginPath();
        ctx.strokeStyle = cEmerald;
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x++) {
          const y2 = centerY + (amplitude * 0.6) * Math.sin(k * x + omega * t);
          if (x === 0) ctx.moveTo(x, y2);
          else ctx.lineTo(x, y2);
        }
        ctx.stroke();
        ctx.restore();

        // Resultant Superposition Wave: Maths purple
        ctx.beginPath();
        ctx.strokeStyle = cMaths;
        ctx.lineWidth = 3;
        for (let x = 0; x < width; x++) {
          const y1 = (amplitude * 0.6) * Math.sin(k * x - omega * t);
          const y2 = (amplitude * 0.6) * Math.sin(k * x + omega * t);
          const yResult = centerY + (y1 + y2);
          if (x === 0) ctx.moveTo(x, yResult);
          else ctx.lineTo(x, yResult);
        }
        ctx.stroke();

        ctx.fillStyle = cMaths;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Resultant Wave y = y₁ + y₂ (Standing Wave Interference)', 20, 25);
      }

      if (isAnimating) {
        timeRef.current += 0.025;
      }
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [waveType, frequency, amplitude, isAnimating]);

  const wavelength = Math.round(340 / (soundFreq || 1) * 100) / 100;

  return (
    <PaperCard flat style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {/* Top Controls Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          {[
            { id: 'transverse', label: 'Transverse Wave' },
            { id: 'longitudinal', label: 'Longitudinal Wave' },
            { id: 'superposition', label: 'Superposition' }
          ].map((m) => (
            <Button
              key={m.id}
              type="button"
              size="sm"
              variant={waveType === m.id ? 'primary' : 'secondary'}
              onClick={() => setWaveType(m.id)}
            >
              {m.label}
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? <Pause size={14} /> : <Play size={14} />}
            {isAnimating ? 'Pause' : 'Play'}
          </Button>

          <Button
            type="button"
            size="sm"
            variant={isPlayingAudio ? 'danger' : 'primary'}
            onClick={toggleAudio}
          >
            {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
            {isPlayingAudio ? 'Mute Tone' : 'Play Sound Tone'}
          </Button>
        </div>
      </div>

      {/* Main Wave Canvas */}
      <div style={{ width: '100%', height: '220px', backgroundColor: 'var(--paper-warm)', borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--paper-edge)', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={760}
          height={220}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Numerical Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--sp-2)' }}>
        <PaperCard flat style={{ padding: 'var(--sp-2) var(--sp-3)', backgroundColor: 'var(--physics-soft)', borderColor: 'var(--physics)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--physics-ink)', fontWeight: 700 }}>Wave Speed (v)</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>340 m/s</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--physics-ink)' }}>Speed of sound in dry air (20°C)</div>
        </PaperCard>

        <PaperCard flat style={{ padding: 'var(--sp-2) var(--sp-3)', backgroundColor: 'var(--maths-soft)', borderColor: 'var(--maths)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--maths-ink)', fontWeight: 700 }}>Frequency (f)</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{soundFreq} Hz</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--maths-ink)' }}>Pitch: {soundFreq > 800 ? 'High / Shrill' : 'Low / Bass'}</div>
        </PaperCard>

        <PaperCard flat style={{ padding: 'var(--sp-2) var(--sp-3)', backgroundColor: 'var(--emerald-soft)', borderColor: 'var(--emerald-600)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--emerald-800)', fontWeight: 700 }}>Wavelength (λ)</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--emerald-800)', fontFamily: 'var(--font-mono)' }}>{wavelength} m</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--emerald-700)' }}>λ = v / f</div>
        </PaperCard>

        <PaperCard flat style={{ padding: 'var(--sp-2) var(--sp-3)', backgroundColor: 'var(--amber-soft)', borderColor: 'var(--amber-500)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--amber-ink)', fontWeight: 700 }}>Amplitude (A)</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--amber-ink)', fontFamily: 'var(--font-mono)' }}>{amplitude} px</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--amber-ink)' }}>Loudness ∝ A²</div>
        </PaperCard>
      </div>

      {/* Interactive Controls Sliders */}
      <PaperCard flat style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-3)', padding: 'var(--sp-3)', backgroundColor: 'var(--paper-warm)' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
            <span>Visual Frequency:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{frequency} Hz</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            aria-label="Visual Frequency in Hz"
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--physics)' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
            <span>Wave Amplitude:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{amplitude} px</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="2"
            value={amplitude}
            onChange={(e) => setAmplitude(parseInt(e.target.value, 10))}
            aria-label="Wave Amplitude in pixels"
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--physics)' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
            <span>Audible Tone Frequency:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{soundFreq} Hz</span>
          </div>
          <input
            type="range"
            min="100"
            max="1200"
            step="10"
            value={soundFreq}
            onChange={(e) => setSoundFreq(parseInt(e.target.value, 10))}
            aria-label="Audible Tone Frequency in Hz"
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--maths)' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
            <span>Audio Volume (Mute safe):</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Audio Volume"
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--emerald-600)' }}
          />
        </div>
      </PaperCard>
    </PaperCard>
  );
}

