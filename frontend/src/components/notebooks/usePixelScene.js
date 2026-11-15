import { useEffect, useRef, useState, useCallback } from 'react';
import { createPixelBuffer, SCENE_W, SCENE_H } from './pixelEngine';

/**
 * Reusable canvas animation and hit-testing hook for procedural pixel-art scenes.
 *
 * Keeps animation state in refs so 60 FPS loops trigger zero React re-renders.
 * Pauses rendering offscreen via IntersectionObserver and honors prefers-reduced-motion.
 */
export function usePixelScene({
  isCardHovered = false,
  hitboxes = [],
  onDrawFrame,
  onObjectClick,
}) {
  const canvasRef = useRef(null);
  const drawFrameRef = useRef(onDrawFrame);
  drawFrameRef.current = onDrawFrame;

  const hitboxesRef = useRef(hitboxes);
  hitboxesRef.current = hitboxes;

  const onObjectClickRef = useRef(onObjectClick);
  onObjectClickRef.current = onObjectClick;

  const stateRef = useRef({
    isCardHovered: false,
    hoveredId: null,
    pointerX: -1,
    pointerY: -1,
    reducedMotion: false,
    isVisible: true,
    burstTimer: 0,
  });

  const [hoveredHitId, setHoveredHitId] = useState(null);

  useEffect(() => {
    stateRef.current.isCardHovered = isCardHovered;
  }, [isCardHovered]);

  const toLogicalCoords = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const lx = ((clientX - rect.left) / rect.width) * SCENE_W;
    const ly = ((clientY - rect.top) / rect.height) * SCENE_H;
    return { lx, ly };
  }, []);

  const findHitbox = useCallback((lx, ly) => {
    const list = hitboxesRef.current || [];
    for (let i = list.length - 1; i >= 0; i--) {
      const box = list[i];
      if (lx >= box.x && lx <= box.x + box.w && ly >= box.y && ly <= box.y + box.h) {
        return box;
      }
    }
    return null;
  }, []);

  const triggerSingleFrameRef = useRef(null);

  const handlePointerMove = useCallback(
    (e) => {
      const coords = toLogicalCoords(e.clientX, e.clientY);
      if (!coords) return;
      stateRef.current.pointerX = coords.lx;
      stateRef.current.pointerY = coords.ly;
      const hit = findHitbox(coords.lx, coords.ly);
      const nextId = hit ? hit.id : null;
      if (stateRef.current.hoveredId !== nextId) {
        stateRef.current.hoveredId = nextId;
        setHoveredHitId(nextId);
        if (stateRef.current.reducedMotion && triggerSingleFrameRef.current) {
          triggerSingleFrameRef.current();
        }
      }
    },
    [findHitbox, toLogicalCoords]
  );

  const handlePointerLeave = useCallback(() => {
    stateRef.current.pointerX = -1;
    stateRef.current.pointerY = -1;
    if (stateRef.current.hoveredId !== null) {
      stateRef.current.hoveredId = null;
      setHoveredHitId(null);
      if (stateRef.current.reducedMotion && triggerSingleFrameRef.current) {
        triggerSingleFrameRef.current();
      }
    }
  }, []);

  const handleCanvasClick = useCallback(
    (e) => {
      const coords = toLogicalCoords(e.clientX, e.clientY);
      if (!coords) return;
      const hit = findHitbox(coords.lx, coords.ly);
      if (!hit) return;

      e.preventDefault();
      e.stopPropagation();
      stateRef.current.hoveredId = hit.id;
      setHoveredHitId(hit.id);
      if (onObjectClickRef.current) {
        onObjectClickRef.current(hit, coords);
      }
      if (stateRef.current.reducedMotion && triggerSingleFrameRef.current) {
        triggerSingleFrameRef.current();
      }
    },
    [findHitbox, toLogicalCoords]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const offscreen = document.createElement('canvas');
    offscreen.width = SCENE_W;
    offscreen.height = SCENE_H;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return undefined;

    const pxBuf = createPixelBuffer(SCENE_W, SCENE_H);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const nextW = Math.max(SCENE_W, Math.round(rect.width * dpr));
      const nextH = Math.max(SCENE_H, Math.round(rect.height * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
    };

    resizeCanvas();

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', resizeCanvas);
    }

    const mq =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    const saveData = Boolean(
      typeof navigator !== 'undefined' &&
        navigator.connection &&
        navigator.connection.saveData
    );

    const updateReducedMotion = () => {
      stateRef.current.reducedMotion = saveData || Boolean(mq && mq.matches);
    };
    updateReducedMotion();

    let rafId = null;
    let lastNow = performance.now();
    let simTime = 0.8;

    const paintFrame = (t, dt) => {
      pxBuf.clear();
      if (drawFrameRef.current) {
        drawFrameRef.current(pxBuf, {
          t,
          dt,
          isCardHovered: stateRef.current.isCardHovered,
          hoveredId: stateRef.current.hoveredId,
          pointerX: stateRef.current.pointerX,
          pointerY: stateRef.current.pointerY,
          reducedMotion: stateRef.current.reducedMotion,
        });
      }
      offCtx.putImageData(pxBuf.imageData, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
    };

    triggerSingleFrameRef.current = () => {
      paintFrame(simTime, 0);
    };

    const startLoop = () => {
      if (rafId !== null) return;
      lastNow = performance.now();
      const tick = (now) => {
        if (!stateRef.current.isVisible || document.hidden || stateRef.current.reducedMotion) {
          rafId = null;
          if (stateRef.current.reducedMotion) {
            paintFrame(1.4, 0);
          }
          return;
        }
        const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) * 0.001));
        lastNow = now;
        simTime += dt;
        paintFrame(simTime, dt);
        rafId = window.requestAnimationFrame(tick);
      };
      rafId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    let intersectionObserver = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const visible = Boolean(entry && entry.isIntersecting);
          stateRef.current.isVisible = visible;
          if (visible && !stateRef.current.reducedMotion) {
            startLoop();
          } else if (!visible) {
            stopLoop();
          }
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(canvas);
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else if (stateRef.current.isVisible && !stateRef.current.reducedMotion) {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const handleMotionChange = () => {
      updateReducedMotion();
      if (stateRef.current.reducedMotion) {
        stopLoop();
        paintFrame(1.4, 0);
      } else if (stateRef.current.isVisible) {
        startLoop();
      }
    };
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', handleMotionChange);
    }

    // Initial render
    if (stateRef.current.reducedMotion) {
      paintFrame(1.4, 0);
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', resizeCanvas);
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      document.removeEventListener('visibilitychange', handleVisibility);
      if (mq && mq.removeEventListener) {
        mq.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  return {
    canvasRef,
    hoveredHitId,
    canvasProps: {
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onClick: handleCanvasClick,
      style: { cursor: hoveredHitId ? 'pointer' : 'inherit' },
    },
  };
}
