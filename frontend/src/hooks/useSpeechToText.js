import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for Browser Web Speech API SpeechRecognition (Voice-to-Text).
 * Features:
 * - Real-time streaming transcription with interim results
 * - Seamless appending to existing input text
 * - Auto-silence timeout with manual stop toggle
 * - Retro 8-bit audio cues on start and stop
 * - Graceful browser fallback and clear error reporting
 */
export function useSpeechToText({ onTextChange, lang = 'en-IN' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const baseTextRef = useRef('');
  const onTextChangeRef = useRef(onTextChange);

  useEffect(() => {
    onTextChangeRef.current = onTextChange;
  }, [onTextChange]);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    setIsSupported(Boolean(SpeechRecognition));
  }, []);

  const playChime = useCallback((type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'start') {
        // High cheery 8-bit double pip (C6 -> G6)
        osc.type = 'square';
        osc.frequency.setValueAtTime(1046.5, now);
        osc.frequency.setValueAtTime(1567.98, now + 0.08);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'stop') {
        // Soft descending completion pip (G6 -> E6)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1567.98, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch {
      // AudioContext might be blocked or restricted
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Safe catch
      }
    }
    isListeningRef.current = false;
    setIsListening(false);
  }, [clearSilenceTimer]);

  const startListening = useCallback(
    (currentInput = '', options = {}) => {
      const SpeechRecognition =
        typeof window !== 'undefined'
          ? window.SpeechRecognition || window.webkitSpeechRecognition
          : null;

      if (!SpeechRecognition) {
        setError('Voice-to-text requires Chrome, Edge, or Safari. Your current browser does not support Web Speech.');
        return;
      }

      setError(null);
      clearSilenceTimer();

      // Remember the text currently in the input to append cleanly
      baseTextRef.current = currentInput ? currentInput.trim() : '';

      // Clean up previous instance if any
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const effectiveLang =
        options.lang ||
        (lang && lang !== 'auto' ? lang : null) ||
        (typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-IN');

      recognition.lang = effectiveLang;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        playChime('start');

        // Initial silence timer (if user doesn't say anything for 6s)
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
        }, 6500);
      };

      recognition.onresult = (event) => {
        clearSilenceTimer();
        // Reset silence timer on every spoken phrase
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
        }, 4000);

        let fullSpoken = '';
        for (let i = 0; i < event.results.length; ++i) {
          const phrase = event.results[i][0]?.transcript || '';
          fullSpoken += (fullSpoken ? ' ' : '') + phrase.trim();
        }

        const combinedText = baseTextRef.current
          ? `${baseTextRef.current} ${fullSpoken}`
          : fullSpoken;

        if (onTextChangeRef.current) {
          onTextChangeRef.current(combinedText);
        }
      };

      recognition.onerror = (event) => {
        clearSilenceTimer();
        isListeningRef.current = false;
        setIsListening(false);

        if (event.error === 'not-allowed') {
          setError('Microphone permission was denied. Please allow microphone access in your browser.');
        } else if (event.error === 'no-speech') {
          // Softly end without alarming error unless repeated
          setError('No speech was heard. Click the mic to try again.');
        } else if (event.error === 'audio-capture') {
          setError('No microphone was detected on this device.');
        } else if (event.error !== 'aborted') {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        clearSilenceTimer();
        if (isListeningRef.current) {
          isListeningRef.current = false;
          setIsListening(false);
          playChime('stop');
        }
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch (err) {
        setError('Could not access microphone. Please check your browser permissions.');
        setIsListening(false);
        isListeningRef.current = false;
      }
    },
    [lang, playChime, clearSilenceTimer, stopListening]
  );

  const toggleListening = useCallback(
    (currentInput = '', options = {}) => {
      if (isListeningRef.current) {
        stopListening();
      } else {
        startListening(currentInput, options);
      }
    },
    [startListening, stopListening]
  );

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [clearSilenceTimer]);

  return {
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    setError,
  };
}
