import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, RotateCcw, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { PaperCard, Button } from './ui';

/**
 * Reusable iframe sandbox for interactive 3D/web STEM simulations wrapped in dark slate workbench chrome.
 */
export default function ExternalSimulationFrame({
  src = 'https://iamtechartist.com/Apps/heart-and-circulatory-system/',
  title = 'Human Heart & Circulatory System 3D Simulation',
  attributionText = 'Interactive simulation powered by iamtechartist.com',
  attributionUrl = 'https://iamtechartist.com/Apps/heart-and-circulatory-system/',
  minHeight = '480px',
  defaultHeight = '620px',
}) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return undefined;
    const timer = setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 20000);
    return () => clearTimeout(timer);
  }, [isLoading, reloadKey]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current?.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle request was prevented:', err);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <PaperCard
      as="div"
      variant="dark"
      flat
      style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          background: 'var(--slate-950)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Top Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'var(--slate-900)',
            borderBottom: '1px solid var(--slate-700)',
            gap: 'var(--sp-2)',
            flexWrap: 'wrap',
          }}
        >
          <span className="type-label" style={{ color: 'var(--on-desk)' }}>
            {title}
          </span>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
            <Button variant="dark" size="sm" onClick={handleRetry} aria-label="Reload simulation">
              <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
              Reload
            </Button>
            <Button variant="dark" size="sm" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
              {isFullscreen ? <Minimize2 size={14} strokeWidth={2} /> : <Maximize2 size={14} strokeWidth={2} />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
          </div>
        </div>

        {/* Viewport */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isFullscreen ? 'calc(100vh - 96px)' : defaultHeight,
            minHeight,
          }}
        >
          {isLoading && !hasError ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--sp-2)',
                color: 'var(--on-desk)',
                background: 'var(--slate-950)',
              }}
            >
              <Loader2 size={28} aria-hidden="true" />
              <span className="type-small" style={{ color: 'var(--on-desk-muted)' }}>
                Loading interactive simulation...
              </span>
            </div>
          ) : null}

          {hasError ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--sp-5)',
                textAlign: 'center',
                gap: 'var(--sp-3)',
                color: 'var(--on-desk)',
              }}
            >
              <AlertCircle size={32} style={{ color: 'var(--amber-400)' }} aria-hidden="true" />
              <h3 className="type-h3" style={{ color: 'var(--on-desk)' }}>
                Simulation Unavailable Offline
              </h3>
              <p className="type-small" style={{ color: 'var(--on-desk-muted)', maxWidth: '42ch' }}>
                This interactive 3D module needs network access or could not embed cleanly.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                <Button variant="kraft" size="sm" onClick={handleRetry}>
                  <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
                  Retry Loading
                </Button>
                <Button variant="primary" size="sm" href={attributionUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              key={reloadKey}
              src={src}
              title={title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              onLoad={() => {
                setIsLoading(false);
                setHasError(false);
              }}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              style={{
                width: '100%',
                height: '100%',
                border: 0,
                display: 'block',
              }}
            />
          )}
        </div>

        {/* Attribution */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            background: 'var(--slate-900)',
            borderTop: '1px solid var(--slate-700)',
            fontSize: '0.75rem',
            color: 'var(--on-desk-muted)',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <div>
            <span>{attributionText} · </span>
            <a
              href={attributionUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--amber-300)', textDecoration: 'underline' }}
            >
              Visit source
            </a>
          </div>
          <span>Curriculum aligned · EduNova STEM</span>
        </div>
      </div>
    </PaperCard>
  );
}
