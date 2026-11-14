import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, RotateCcw, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

/**
 * ExternalSimulationFrame
 * 
 * Reusable, isolated iframe component for embedding third-party interactive simulations.
 * Features:
 *  - Responsive container with rounded corners and border
 *  - Loading skeleton / spinner with graceful timeout
 *  - Browser Fullscreen API toggle
 *  - Offline / error fallback with retry and direct link
 *  - Strict origin isolation (no cross-origin DOM access)
 *  - Clear attribution bar
 */
export default function ExternalSimulationFrame({
  src = 'https://iamtechartist.com/Apps/heart-and-circulatory-system/',
  title = 'Human Heart & Circulatory System 3D Simulation',
  attributionText = 'Interactive simulation powered by iamtechartist.com',
  attributionUrl = 'https://iamtechartist.com/Apps/heart-and-circulatory-system/',
  minHeight = '480px',
  defaultHeight = '620px'
}) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Monitor fullscreen change events (ESC key, F11, etc.)
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

  // Safety timeout: if iframe does not load within 20s, offer fallback
  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      if (isLoading) {
        // We do not force error immediately, but if still loading, set error state
        setHasError(true);
        setIsLoading(false);
      }
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

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#0F172A',
        borderRadius: isFullscreen ? '0px' : 'var(--radius-md, 12px)',
        border: isFullscreen ? 'none' : '1px solid var(--color-border, #E2E8F0)',
        boxShadow: isFullscreen ? 'none' : 'var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1))',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-radius 0.2s ease'
      }}
    >
      {/* Top Utility Bar inside simulation container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: '#1E293B',
          color: '#F8FAFC',
          fontSize: '0.8rem',
          borderBottom: '1px solid #334155'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isLoading ? '#F59E0B' : hasError ? '#EF4444' : '#10B981',
              display: 'inline-block'
            }}
          />
          <span style={{ color: '#E2E8F0' }}>{title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleRetry}
            title="Reload simulation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#E2E8F0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
            <span style={{ display: 'none', '@media (min-width: 480px)': { display: 'inline' } }}>Reload</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: isFullscreen ? 'var(--color-primary, #2563EB)' : 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? (
              <>
                <Minimize2 size={13} /> Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 size={13} /> Fullscreen
              </>
            )}
          </button>
        </div>
      </div>

      {/* Frame Viewport */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isFullscreen ? 'calc(100vh - 80px)' : defaultHeight,
          minHeight: minHeight,
          backgroundColor: '#0F172A'
        }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backgroundColor: '#0F172A',
              color: '#E2E8F0',
              zIndex: 10
            }}
          >
            <Loader2 className="animate-spin" size={36} color="var(--color-primary, #2563EB)" />
            <div style={{ fontSize: '0.92rem', fontWeight: '600' }}>Loading {title || '3D Simulation'}...</div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Streaming interactive 3D assets & WebGL shaders</div>
          </div>
        )}

        {/* Error / Fallback State */}
        {hasError ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              padding: '24px',
              backgroundColor: '#0F172A',
              color: '#F8FAFC',
              textAlign: 'center',
              zIndex: 15
            }}
          >
            <AlertCircle size={40} color="#F87171" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Unable to load external simulation</h3>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
              The interactive simulation could not be rendered inside the frame. This may occur if your connection is offline or if third-party content is blocked by browser shield settings.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleRetry}
                className="btn btn-secondary"
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <RotateCcw size={14} /> Retry Loading
              </button>
              <a
                href={attributionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}
              >
                <ExternalLink size={14} /> Open in New Tab
              </a>
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
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
          />
        )}
      </div>

      {/* Attribution Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: '#0B1120',
          borderTop: '1px solid #1E293B',
          fontSize: '0.74rem',
          color: '#94A3B8',
          flexWrap: 'wrap',
          gap: '6px'
        }}
      >
        <div>
          <span>{attributionText} • </span>
          <a
            href={attributionUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#60A5FA', textDecoration: 'underline' }}
          >
            Visit source
          </a>
        </div>
        <div>
          <span>Curriculum alignment by CBSE STEM Edu</span>
        </div>
      </div>
    </div>
  );
}

