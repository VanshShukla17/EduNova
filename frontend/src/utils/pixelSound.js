/**
 * Retro 16-Bit Pixel Button Sound System
 * Plays the custom pixel button sound on physical clicks for pixelated buttons,
 * strictly excluding back buttons and normal/standard UI buttons.
 */

const AUDIO_SRC = '/audio/pixel-button.mp3';

let audioContext = null;
let audioBuffer = null;
let isLoading = false;
let isLoaded = false;

// HTML5 Audio fallback pool for instant multi-press playback
const POOL_SIZE = 4;
let audioPool = [];
let poolIndex = 0;

/**
 * Initializes or resumes the AudioContext
 */
function getAudioContext() {
  if (!audioContext && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

/**
 * Preload and decode the audio file into memory for 0ms latency playback
 */
export function preloadPixelSound() {
  if (typeof window === 'undefined' || isLoaded || isLoading) return;
  isLoading = true;

  // Initialize fallback pool
  try {
    for (let i = 0; i < POOL_SIZE; i++) {
      const a = new Audio(AUDIO_SRC);
      a.preload = 'auto';
      audioPool.push(a);
    }
  } catch (err) {
    // Ignore pool initialization error in restricted environments
  }

  // Pre-fetch and decode into Web Audio API buffer
  try {
    fetch(AUDIO_SRC)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        const ctx = getAudioContext();
        if (!ctx) throw new Error('Web Audio not supported');
        return ctx.decodeAudioData(arrayBuffer);
      })
      .then((decoded) => {
        audioBuffer = decoded;
        isLoaded = true;
        isLoading = false;
      })
      .catch(() => {
        isLoading = false;
        // Fallback Audio pool will be used
      });
  } catch (err) {
    isLoading = false;
  }
}

/**
 * Determines whether a button element is an explicit "Back" button
 * which should be excluded from playing the pixel sound.
 */
export function isBackButton(element) {
  if (!element || typeof element.getAttribute !== 'function') return false;

  // 1. Explicit data attributes or classes
  if (
    element.matches?.(
      '.back-btn, .btn--back, .btn-back, [data-back], [data-no-sound], [data-action="back"]'
    ) ||
    element.closest?.(
      '.back-btn, .btn--back, .btn-back, [data-back], [data-no-sound], [data-action="back"]'
    )
  ) {
    return true;
  }

  // 2. Check aria-label or title
  const ariaLabel = (
    element.getAttribute('aria-label') ||
    element.getAttribute('title') ||
    ''
  ).toLowerCase();
  if (ariaLabel.includes('back') || ariaLabel.includes('go back')) {
    return true;
  }

  // 3. Check button text content
  const text = (element.innerText || element.textContent || '')
    .trim()
    .toLowerCase();

  // If text starts with or is "back", "go back", "back to...", "← back"
  if (
    /^(\s*|.*?[←\u2190-\u2193]\s*)(back|go back)\b/i.test(text) ||
    text === 'back' ||
    text === 'go back' ||
    text.startsWith('back to')
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if the element qualifies as a pixelated button
 */
export function isPixelButton(element) {
  if (!element || typeof element.closest !== 'function') return false;

  // If it's a back button, it must NOT play
  if (isBackButton(element)) return false;

  // Matches pixelated button classes and attributes
  const isPixel = element.closest(
    '.pixel-btn, .nav-sky__pill-item, .arena-option-btn, [data-pixel-btn], .pixel-button'
  );

  return Boolean(isPixel);
}

/**
 * Plays the retro pixel button sound effect
 */
export function playPixelSound(event) {
  // Prevent duplicate playback on the same event
  if (event && event.__pixelSoundPlayed) return;

  // If triggered by an event, verify the target is not a back button
  if (event && event.currentTarget) {
    if (isBackButton(event.currentTarget)) return;
  } else if (event && event.target) {
    const btn = event.target.closest?.('button, a, [role="button"]');
    if (btn && isBackButton(btn)) return;
  }

  if (event) {
    event.__pixelSoundPlayed = true;
  }

  try {
    const ctx = getAudioContext();

    if (ctx && audioBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;

      // Optional slight gain control for crisp, comfortable volume
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.85;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
      return;
    }

    // Fallback: Audio pool
    if (audioPool.length > 0) {
      const audio = audioPool[poolIndex];
      poolIndex = (poolIndex + 1) % audioPool.length;
      audio.currentTime = 0;
      audio.volume = 0.85;
      const playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {});
      }
      return;
    }

    // Direct single-instance fallback
    const singleAudio = new Audio(AUDIO_SRC);
    singleAudio.volume = 0.85;
    singleAudio.play().catch(() => {});
  } catch (err) {
    // Non-blocking catch to prevent any interruption of user clicks
  }
}

/**
 * Attaches global delegated listener on window so all pixelated buttons play
 * sound on physical click, without needing manual handlers everywhere.
 */
export function setupGlobalPixelSoundListener() {
  if (typeof window === 'undefined') return () => {};

  preloadPixelSound();

  const handleGlobalClick = (e) => {
    // If sound already triggered by component handler, skip
    if (e.__pixelSoundPlayed) return;

    const target = e.target;
    if (!target || typeof target.closest !== 'function') return;

    // Check if clicked element or its parent is a pixel button
    const btn = target.closest(
      '.pixel-btn, .nav-sky__pill-item, .arena-option-btn, [data-pixel-btn], .pixel-button'
    );

    if (btn && !isBackButton(btn)) {
      playPixelSound(e);
    }
  };

  // Capture phase listener ensures physical feel before route or modal transitions
  window.addEventListener('click', handleGlobalClick, true);

  return () => {
    window.removeEventListener('click', handleGlobalClick, true);
  };
}
