import { useState, useRef, useEffect, useCallback } from 'react';

export const TTS_LANGUAGES = [
  { code: 'auto', label: 'Auto (English / हिंदी / ಕನ್ನಡ)', shortLabel: 'AUTO' },
  { code: 'en-IN', label: 'English (India)', shortLabel: 'EN' },
  { code: 'hi-IN', label: 'Hindi (हिंदी)', shortLabel: 'HI' },
  { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)', shortLabel: 'KN' },
];

/**
 * Detects whether the text is Kannada, Hindi (Devanagari), or English/Latin.
 */
export function detectLanguage(text) {
  if (!text) return 'en-IN';
  // Kannada Unicode block: U+0C80 - U+0CFF
  if (/[\u0C80-\u0CFF]/.test(text)) {
    return 'kn-IN';
  }
  // Devanagari (Hindi) Unicode block: U+0900 - U+097F
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi-IN';
  }
  return 'en-IN';
}

/**
 * Strips markdown symbols, math syntax, and URLs to produce
 * smooth, natural, and articulate spoken audio across English, Hindi, and Kannada.
 */
export function cleanTextForSpeech(text) {
  if (!text) return '';
  let cleaned = String(text);

  // Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ' Code snippet omitted. ');
  // Inline code
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Math equations: replace common LaTeX commands with readable words
  cleaned = cleaned.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 divided by $2');
  cleaned = cleaned.replace(/\\text\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\mathbf\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\cdot/g, ' times ');
  cleaned = cleaned.replace(/\\times/g, ' times ');
  cleaned = cleaned.replace(/\\le(?!a)/g, ' less than or equal to ');
  cleaned = cleaned.replace(/\\ge/g, ' greater than or equal to ');
  cleaned = cleaned.replace(/\\neq/g, ' not equal to ');
  cleaned = cleaned.replace(/\\approx/g, ' approximately ');
  cleaned = cleaned.replace(/\\sqrt\{([^}]+)\}/g, ' square root of $1 ');
  cleaned = cleaned.replace(/\\pm/g, ' plus or minus ');
  cleaned = cleaned.replace(/\\degree/g, ' degrees ');
  cleaned = cleaned.replace(/\\pi/g, ' pi ');
  cleaned = cleaned.replace(/\\theta/g, ' theta ');
  cleaned = cleaned.replace(/\\alpha/g, ' alpha ');
  cleaned = cleaned.replace(/\\beta/g, ' beta ');
  cleaned = cleaned.replace(/\\Delta/g, ' delta ');
  cleaned = cleaned.replace(/\\rightarrow/g, ' yields ');
  cleaned = cleaned.replace(/\\leftarrow/g, ' comes from ');
  cleaned = cleaned.replace(/\\Rightarrow/g, ' implies ');

  // Superscript & subscript basic clean
  cleaned = cleaned.replace(/\^([0-9]+)/g, ' to the power of $1');
  cleaned = cleaned.replace(/\^\{([^}]+)\}/g, ' to the power of $1');
  cleaned = cleaned.replace(/_([0-9a-zA-Z]+)/g, ' $1');
  cleaned = cleaned.replace(/_\{([^}]+)\}/g, ' $1');

  // Remove math delimiters
  cleaned = cleaned.replace(/\$\$([\s\S]*?)\$\$/g, ' $1 ');
  cleaned = cleaned.replace(/\$([^$]+)\$/g, ' $1 ');

  // Markdown headers, lists, blockquotes
  cleaned = cleaned.replace(/^[#]{1,6}\s+/gm, '');
  cleaned = cleaned.replace(/^[\*\-\+]\s+/gm, '');
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '');
  cleaned = cleaned.replace(/^>\s+/gm, '');

  // Bold / italic
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');

  // Links: [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Collapse extra spaces and linebreaks
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Custom hook for Browser Web Speech Synthesis (Text-to-Speech).
 * Features:
 * - Multilingual support: English (India), Hindi (हिंदी), Kannada (ಕನ್ನಡ)
 * - Auto-detection of language script from response text
 * - Preferred voice matching with cloud/OS fallback
 * - Natural text cleaning (handles STEM formulas, markdown, code blocks)
 * - Per-message speaking tracking (tracks active message ID)
 * - Seamless cancel, toggle, and auto-cleanup
 */
export function useTextToSpeech(defaultLang = 'auto') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLang);
  const [activeSpeakingLang, setActiveSpeakingLang] = useState('en-IN');
  const [isSupported, setIsSupported] = useState(false);

  const utteranceRef = useRef(null);
  const keepAliveTimerRef = useRef(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const loadVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const getBestVoice = useCallback((targetLang = 'auto', text = '') => {
    const voices = voicesRef.current.length > 0
      ? voicesRef.current
      : typeof window !== 'undefined' && window.speechSynthesis
      ? window.speechSynthesis.getVoices()
      : [];

    const effectiveLang = (targetLang && targetLang !== 'auto')
      ? targetLang
      : detectLanguage(text);

    // 1. Kannada (kn-IN / kn)
    if (effectiveLang.startsWith('kn')) {
      const kannadaVoice = voices.find(
        (v) =>
          v.lang?.toLowerCase().startsWith('kn') ||
          v.lang?.toLowerCase().includes('kn-in') ||
          v.lang?.toLowerCase().includes('kn_in') ||
          v.name?.toLowerCase().includes('kannada') ||
          v.name?.includes('ಕನ್ನಡ')
      );
      if (kannadaVoice) return { voice: kannadaVoice, lang: 'kn-IN' };
      // Fallback: null voice with kn-IN lang lets Chrome/OS use cloud Kannada synthesizer
      return { voice: null, lang: 'kn-IN' };
    }

    // 2. Hindi (hi-IN / hi)
    if (effectiveLang.startsWith('hi')) {
      const hindiVoice = voices.find(
        (v) =>
          v.lang?.toLowerCase().startsWith('hi') ||
          v.lang?.toLowerCase().includes('hi-in') ||
          v.lang?.toLowerCase().includes('hi_in') ||
          v.name?.toLowerCase().includes('hindi') ||
          v.name?.includes('हिन्दी') ||
          v.name?.toLowerCase().includes('lekha') ||
          v.name?.toLowerCase().includes('kalpana') ||
          v.name?.toLowerCase().includes('hemant')
      );
      if (hindiVoice) return { voice: hindiVoice, lang: 'hi-IN' };
      return { voice: null, lang: 'hi-IN' };
    }

    // 3. English (India)
    const indianVoice = voices.find(
      (v) =>
        v.lang?.toLowerCase().startsWith('en-in') ||
        v.lang?.toLowerCase().startsWith('en_in') ||
        v.name?.toLowerCase().includes('india') ||
        v.name?.toLowerCase().includes('rishi') ||
        v.name?.toLowerCase().includes('sangeeta')
    );
    if (indianVoice) return { voice: indianVoice, lang: 'en-IN' };

    const naturalVoice = voices.find(
      (v) =>
        v.lang?.toLowerCase().startsWith('en') &&
        (v.name?.toLowerCase().includes('natural') ||
          v.name?.toLowerCase().includes('google') ||
          v.name?.toLowerCase().includes('siri') ||
          v.name?.toLowerCase().includes('samantha'))
    );
    if (naturalVoice) return { voice: naturalVoice, lang: 'en-IN' };

    const englishVoice = voices.find((v) => v.lang?.toLowerCase().startsWith('en'));
    if (englishVoice) return { voice: englishVoice, lang: 'en-IN' };

    return { voice: voices[0] || null, lang: effectiveLang };
  }, []);

  const stop = useCallback(() => {
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
    setCurrentSpeakingId(null);
  }, []);

  const speak = useCallback(
    (text, { id = null, lang = null, onStart, onEnd } = {}) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      stop();

      const cleaned = cleanTextForSpeech(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      const langChoice = lang || selectedLanguage || 'auto';
      const { voice, lang: resolvedLang } = getBestVoice(langChoice, cleaned);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || resolvedLang;
      } else {
        utterance.lang = resolvedLang || 'en-IN';
      }

      // Slightly adjust speech rate for clear, natural regional Indian enunciation
      if (resolvedLang.startsWith('hi') || resolvedLang.startsWith('kn')) {
        utterance.rate = 0.94;
        utterance.pitch = 1.0;
      } else {
        utterance.rate = 0.98;
        utterance.pitch = 1.02;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSpeakingId(id);
        setActiveSpeakingLang(resolvedLang);
        onStart?.();

        // Chrome keep-alive: prevent speech from getting paused midway on long texts
        if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
        keepAliveTimerRef.current = setInterval(() => {
          if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 8000);
      };

      utterance.onend = () => {
        if (keepAliveTimerRef.current) {
          clearInterval(keepAliveTimerRef.current);
          keepAliveTimerRef.current = null;
        }
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
        utteranceRef.current = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        if (keepAliveTimerRef.current) {
          clearInterval(keepAliveTimerRef.current);
          keepAliveTimerRef.current = null;
        }
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
        utteranceRef.current = null;
        onEnd?.();
      };

      utteranceRef.current = utterance;

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
      }
    },
    [getBestVoice, selectedLanguage, stop]
  );

  const toggle = useCallback(
    (id, text, options = {}) => {
      if (isSpeaking && currentSpeakingId === id) {
        stop();
      } else {
        speak(text, { id, ...options });
      }
    },
    [isSpeaking, currentSpeakingId, stop, speak]
  );

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isSpeaking,
    currentSpeakingId,
    selectedLanguage,
    setSelectedLanguage,
    activeSpeakingLang,
    isSupported,
    speak,
    stop,
    toggle,
    availableLanguages: TTS_LANGUAGES,
  };
}
