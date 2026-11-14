import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Clock,
  Brain,
  Trash2,
  ArrowRight,
  X,
  Camera,
  Image as ImageIcon,
  Paperclip,
  Loader2,
  Check,
  Plus,
  Pencil,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import FormattedMessage from '../../components/FormattedMessage';

export default function SaarthiPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Mode: 'doubt' | 'mentor'
  // Initialize from search param or location.state, defaulting to 'doubt'
  const initialMode =
    searchParams.get('mode') === 'mentor' || location.state?.mode === 'mentor'
      ? 'mentor'
      : 'doubt';
  const [mode, setMode] = useState(initialMode);

  // Subject and Context State
  const [subject, setSubject] = useState('physics');
  const [activeModuleContext, setActiveModuleContext] = useState(null);

  // Phase 15: COMPLETELY SEPARATE STATE FOR DOUBT SOLVER
  const [doubtSessionId, setDoubtSessionId] = useState(null);
  const [doubtSessionTitle, setDoubtSessionTitle] = useState('New Doubt Discussion');
  const [doubtMessages, setDoubtMessages] = useState([
    {
      id: 'doubt_init_1',
      role: 'assistant',
      content: `Namaste ${user?.name || 'Student'}! I am **Saarthi Doubt Solver** (शंका समाधान).\n\nAsk any concept question, homework problem, derivation, or formula verification in **Physics**, **Chemistry**, **Biology**, or **Mathematics**.\n\nYou can also click the paperclip or camera icon to upload textbook diagrams and question photos!`,
      sources: []
    }
  ]);
  const [doubtInputText, setDoubtInputText] = useState('');
  const [doubtSelectedImage, setDoubtSelectedImage] = useState(null);

  // Phase 15: COMPLETELY SEPARATE STATE FOR AI MENTOR
  const [mentorSessionId, setMentorSessionId] = useState(null);
  const [mentorSessionTitle, setMentorSessionTitle] = useState('New Mentorship Session');
  const [mentorMessages, setMentorMessages] = useState([
    {
      id: 'mentor_init_1',
      role: 'assistant',
      content: `Namaste ${user?.name || 'Student'}! I am **Saarthi AI Mentor** (मार्गदर्शक).\n\nI am here to guide your CBSE STEM learning journey, break down complex concepts into simple steps, diagnose knowledge gaps, and help you study effectively.\n\nWhat topic, revision strategy, or concept would you like to master today?`,
      sources: []
    }
  ]);
  const [mentorInputText, setMentorInputText] = useState('');
  const [mentorSelectedImage, setMentorSelectedImage] = useState(null);

  // Active Mode State Getters
  const currentSessionId = mode === 'doubt' ? doubtSessionId : mentorSessionId;
  const currentSessionTitle = mode === 'doubt' ? doubtSessionTitle : mentorSessionTitle;
  const messages = mode === 'doubt' ? doubtMessages : mentorMessages;
  const inputText = mode === 'doubt' ? doubtInputText : mentorInputText;
  const selectedImage = mode === 'doubt' ? doubtSelectedImage : mentorSelectedImage;

  // Active Mode Setters
  const setInputText = (val) => {
    if (mode === 'doubt') setDoubtInputText(val);
    else setMentorInputText(val);
  };

  const setSelectedImage = (img) => {
    if (mode === 'doubt') setDoubtSelectedImage(img);
    else setMentorSelectedImage(img);
  };

  // Chat History Drawer State (Phase 15: Filtered by active mode)
  const [sessionsList, setSessionsList] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingSessionTitle, setEditingSessionTitle] = useState('');

  // Memory Modal State
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [memories, setMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(false);

  // File & Camera Input Refs (Phase 14)
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Accent theme colors based on active mode
  const themeAccent = mode === 'doubt' ? '#7C3AED' : '#2563EB';
  const themeBgLight = mode === 'doubt' ? '#F5F3FF' : '#EFF6FF';
  const themeBorder = mode === 'doubt' ? '#DDD6FE' : '#BFDBFE';

  // Read location state for direct module transitions
  useEffect(() => {
    if (location.state?.prefill) {
      setInputText(location.state.prefill);
    }
    if (location.state?.subject) {
      setSubject(location.state.subject.toLowerCase());
    }
    if (location.state?.moduleTitle) {
      setActiveModuleContext(location.state.moduleTitle);
    } else if (location.state?.topic) {
      setActiveModuleContext(location.state.topic);
    }
    if (location.state?.mode && (location.state.mode === 'doubt' || location.state.mode === 'mentor')) {
      setMode(location.state.mode);
      setSearchParams({ mode: location.state.mode });
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Phase 15: Switch Mode strictly preserving existing state
  const handleSwitchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  // Phase 15: Fetch sessions strictly filtered by active mode
  const fetchSessions = async (targetMode = mode) => {
    try {
      setLoadingSessions(true);
      const token = localStorage.getItem('token');
      const url = `/api/mentor/sessions?mode=${targetMode}`;
      const res = await fetch(url, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      const data = await res.json();
      if (data.success) {
        setSessionsList(data.data || []);
      }
    } catch (err) {
      console.error('Fetch sessions error:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (showHistoryDrawer) {
      fetchSessions(mode);
    }
  }, [mode, showHistoryDrawer]);

  // Phase 15: Start a clean independent conversation for active mode
  const handleStartNewChat = () => {
    if (mode === 'doubt') {
      setDoubtSessionId(null);
      setDoubtSessionTitle('New Doubt Discussion');
      setDoubtSelectedImage(null);
      setDoubtInputText('');
      setDoubtMessages([
        {
          id: `doubt_new_${Date.now()}`,
          role: 'assistant',
          content: `Namaste ${user?.name || 'Student'}! Starting a fresh **Doubt Solver** conversation.\n\nAsk any concept question, formula verification, or upload a problem image to begin!`,
          sources: []
        }
      ]);
    } else {
      setMentorSessionId(null);
      setMentorSessionTitle('New Mentorship Session');
      setMentorSelectedImage(null);
      setMentorInputText('');
      setMentorMessages([
        {
          id: `mentor_new_${Date.now()}`,
          role: 'assistant',
          content: `Namaste ${user?.name || 'Student'}! Starting a fresh **AI Mentor** guidance session.\n\nWhat concept or study plan would you like to explore today?`,
          sources: []
        }
      ]);
    }
    setShowHistoryDrawer(false);
  };

  // Phase 15: Load an existing session into active mode's state
  const handleLoadSession = async (session) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/mentor/sessions/${session.id}`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      const data = await res.json();
      if (data.success) {
        const sessMode = session.mode || mode;
        const loadedMsgs = (data.messages || []).map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          sources: m.sources || []
        }));

        const finalMsgs =
          loadedMsgs.length > 0
            ? loadedMsgs
            : [
                {
                  id: `empty_${session.id}`,
                  role: 'assistant',
                  content: `Continuing conversation: **${session.title}**. What would you like to ask?`,
                  sources: []
                }
              ];

        if (sessMode === 'mentor') {
          setMentorSessionId(session.id);
          setMentorSessionTitle(session.title);
          setMentorMessages(finalMsgs);
          if (mode !== 'mentor') {
            setMode('mentor');
            setSearchParams({ mode: 'mentor' });
          }
        } else {
          setDoubtSessionId(session.id);
          setDoubtSessionTitle(session.title);
          setDoubtMessages(finalMsgs);
          if (mode !== 'doubt') {
            setMode('doubt');
            setSearchParams({ mode: 'doubt' });
          }
        }

        if (session.subject) setSubject(session.subject);
        setShowHistoryDrawer(false);
      }
    } catch (err) {
      console.error('Load session error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Phase 13.3 & 15: Delete a session with confirmation
  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/mentor/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      const data = await res.json();
      if (data.success) {
        setSessionsList((prev) => prev.filter((s) => s.id !== sessionId));
        if (mode === 'doubt' && doubtSessionId === sessionId) {
          handleStartNewChat();
        } else if (mode === 'mentor' && mentorSessionId === sessionId) {
          handleStartNewChat();
        }
      }
    } catch (err) {
      console.error('Delete session error:', err);
    }
  };

  // Phase 13.3 & 15: Rename a session
  const handleSaveRenameSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!editingSessionTitle.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/mentor/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ title: editingSessionTitle.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSessionsList((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, title: editingSessionTitle.trim() } : s))
        );
        if (mode === 'doubt' && doubtSessionId === sessionId) {
          setDoubtSessionTitle(editingSessionTitle.trim());
        } else if (mode === 'mentor' && mentorSessionId === sessionId) {
          setMentorSessionTitle(editingSessionTitle.trim());
        }
        setEditingSessionId(null);
        setEditingSessionTitle('');
      }
    } catch (err) {
      console.error('Rename session error:', err);
    }
  };

  // Student Persistent Memory
  const fetchMemories = async () => {
    try {
      setLoadingMemories(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/mentor/memories', {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      const data = await res.json();
      if (data.success) {
        setMemories(data.data || []);
      }
    } catch (err) {
      console.error('Fetch memories error:', err);
    } finally {
      setLoadingMemories(false);
    }
  };

  const deleteMemory = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/mentor/memories/${id}`, {
        method: 'DELETE',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Delete memory error:', err);
    }
  };

  const handleOpenMemoryModal = () => {
    setShowMemoryModal(true);
    fetchMemories();
  };

  // Multimodal Image Attachment Handler (Phase 14.1)
  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPEG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage({
        dataUrl: ev.target.result,
        mimeType: file.type || 'image/jpeg',
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Send message or multimodal image query (Phase 14 & 15)
  const handleSend = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if ((!query && !selectedImage) || loading) return;

    const attachedImg = selectedImage;
    const activeSessionId = currentSessionId;
    const currentActiveMode = mode;

    setInputText('');
    setSelectedImage(null);

    // Create user message in active mode's state
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: query || (attachedImg ? '[Attached Question Image]' : ''),
      sources: attachedImg
        ? [
            {
              type: 'image_attachment',
              dataUrl: attachedImg.dataUrl,
              mimeType: attachedImg.mimeType,
              name: attachedImg.name
            }
          ]
        : []
    };

    if (currentActiveMode === 'doubt') {
      setDoubtMessages((prev) => [...prev, userMsg]);
    } else {
      setMentorMessages((prev) => [...prev, userMsg]);
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          message: query,
          image: attachedImg?.dataUrl || null,
          mimeType: attachedImg?.mimeType || null,
          sessionId: activeSessionId,
          newChat: !activeSessionId,
          mode: currentActiveMode,
          subject,
          moduleTitle: activeModuleContext || null,
          board: user?.board || 'CBSE',
          classLevel: user?.classLevel || 10,
          language: user?.preferredLanguage || user?.language || 'en'
        })
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.message || 'Saarthi service returned error');
      }

      const data = await response.json();

      // If a new session was created on the backend, update active mode's sessionId
      if (data.sessionId && !activeSessionId) {
        if (currentActiveMode === 'doubt') {
          setDoubtSessionId(data.sessionId);
        } else {
          setMentorSessionId(data.sessionId);
        }
        fetchSessions(currentActiveMode);
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.content || data.message?.content,
        sources: data.sources || []
      };

      if (currentActiveMode === 'doubt') {
        setDoubtMessages((prev) => [...prev, botMsg]);
      } else {
        setMentorMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error('Saarthi query error:', err);
      const fallbackReply = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        isError: true,
        lastQuery: query,
        content: `⚠️ **Connection Notice**: Unable to reach Saarthi AI (${err.message || 'Network failure'}).\n\nPlease check your internet connection or tap retry below.`,
        sources: []
      };
      if (currentActiveMode === 'doubt') {
        setDoubtMessages((prev) => [...prev, fallbackReply]);
      } else {
        setMentorMessages((prev) => [...prev, fallbackReply]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Dynamic sample prompts based on active subject and mode
  const getSamplePrompts = () => {
    if (mode === 'mentor') {
      return [
        'How should I plan my CBSE Class 10/12 revision for upcoming exams?',
        'Can you test my understanding of this chapter with 3 diagnostic questions?',
        'Give me a step-by-step revision strategy for numerical derivations',
        'Explain the most common mistakes students make in board exam questions'
      ];
    }

    if (subject === 'biology') {
      return [
        'How does double circulation prevent mixing of oxygenated & deoxygenated blood?',
        'Explain the mechanism of pulmonary ventilation and alveolar gas exchange',
        'Compare concentric vs eccentric vs isometric muscle contraction with a table'
      ];
    }

    if (subject === 'physics') {
      return [
        'Explain resistivity with formula $\\rho = \\frac{RA}{l}$ and compare conductors vs insulators with a table',
        'Why does a convex lens have positive focal length while concave is negative?',
        "Prove that the minimum distance to hear an echo in air at 20°C is 17.2 meters",
        "Explain Newton's third law and why action-reaction pairs don't cancel each other"
      ];
    }

    if (subject === 'chemistry') {
      return [
        'Why is the bond angle in $\\text{H}_2\\text{O}$ 104.5° instead of tetrahedral 109.5° in VSEPR theory?',
        'Explain the difference between sigma (σ) and pi (π) covalent bonds with a comparison table',
        'What is the structural formula and chemical bonding in benzene ($\\text{C}_6\\text{H}_6$)?'
      ];
    }

    if (subject === 'mathematics') {
      return [
        'Explain the ASTC rule for signs of trigonometric functions across all 4 quadrants',
        'Prove the Pythagorean identity $\\sin^2\\theta + \\cos^2\\theta = 1$ on the unit circle',
        'How does cone cutting angle $\\beta$ vs semi-vertical angle $\\alpha$ determine circle, ellipse, parabola, and hyperbola?'
      ];
    }

    return [
      'Explain the key principles of this topic with step-by-step formulas',
      'What are the standard board exam formulas for this chapter?',
      'Walk me through a step-by-step numerical calculation with SI units'
    ];
  };

  const samplePrompts = getSamplePrompts();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '0 8px',
        position: 'relative'
      }}
    >
      {/* PHASE 15: HIGH-VISIBILITY MODE SELECTOR TABS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '8px'
        }}
      >
        {/* Doubt Solver Tab */}
        <button
          type="button"
          onClick={() => handleSwitchMode('doubt')}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            border: mode === 'doubt' ? '2px solid #7C3AED' : '1px solid #E2E8F0',
            backgroundColor: mode === 'doubt' ? '#F5F3FF' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: mode === 'doubt' ? '0 2px 8px rgba(124, 58, 237, 0.12)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: mode === 'doubt' ? '#7C3AED' : '#F1F5F9',
              color: mode === 'doubt' ? '#FFFFFF' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <HelpCircle size={18} />
          </div>
          <div style={{ textAlign: 'left', overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: '800',
                color: mode === 'doubt' ? '#6D28D9' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Doubt Solver
              {mode === 'doubt' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    backgroundColor: '#EDE9FE',
                    color: '#6D28D9',
                    padding: '1px 6px',
                    borderRadius: '4px'
                  }}
                >
                  Active
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: mode === 'doubt' ? '#7C3AED' : '#64748B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Step-by-step solutions & concept clarity
            </div>
          </div>
        </button>

        {/* AI Mentor Tab */}
        <button
          type="button"
          onClick={() => handleSwitchMode('mentor')}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            border: mode === 'mentor' ? '2px solid #2563EB' : '1px solid #E2E8F0',
            backgroundColor: mode === 'mentor' ? '#EFF6FF' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: mode === 'mentor' ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: mode === 'mentor' ? '#2563EB' : '#F1F5F9',
              color: mode === 'mentor' ? '#FFFFFF' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <GraduationCap size={18} />
          </div>
          <div style={{ textAlign: 'left', overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: '800',
                color: mode === 'mentor' ? '#1D4ED8' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              AI Mentor
              {mode === 'mentor' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    backgroundColor: '#DBEAFE',
                    color: '#1E40AF',
                    padding: '1px 6px',
                    borderRadius: '4px'
                  }}
                >
                  Active
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: mode === 'mentor' ? '#2563EB' : '#64748B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Personalized guidance & study coaching
            </div>
          </div>
        </button>
      </div>

      {/* Top Header Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          marginBottom: '8px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              backgroundColor: themeAccent,
              color: '#FFFFFF',
              padding: '8px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mode === 'doubt' ? <Bot size={20} /> : <Sparkles size={20} />}
          </div>
          <div>
            <h2
              style={{
                fontSize: '1.02rem',
                fontWeight: '800',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#0F172A'
              }}
            >
              Saarthi {mode === 'doubt' ? 'Doubt Solver' : 'AI Mentor'}
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: themeBgLight,
                  color: themeAccent
                }}
              >
                {mode === 'doubt' ? 'शंका समाधान' : 'मार्गदर्शक'}
              </span>
            </h2>
            <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0 }}>
              CBSE Class {user?.classLevel || 10} • {currentSessionTitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* New Chat Button (Independent per mode) */}
          <button
            type="button"
            onClick={handleStartNewChat}
            title={`Start a new ${mode === 'doubt' ? 'Doubt Solver' : 'AI Mentor'} conversation`}
            style={{
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '8px',
              border: `1px solid ${themeBorder}`,
              backgroundColor: themeBgLight,
              color: themeAccent,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={15} /> New {mode === 'doubt' ? 'Doubt' : 'Mentor'} Chat
          </button>

          {/* Chat History Button (Filtered strictly by mode) */}
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(true)}
            title={`View previous ${mode === 'doubt' ? 'Doubt' : 'Mentor'} conversations`}
            style={{
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Clock size={15} color="#64748B" /> {mode === 'doubt' ? 'Doubt History' : 'Mentor History'}
          </button>

          {/* Memory Modal Button */}
          <button
            type="button"
            onClick={handleOpenMemoryModal}
            title="What Saarthi remembers about your learning curve"
            style={{
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Brain size={15} color={themeAccent} /> Memory
          </button>
        </div>
      </div>

      {/* Subject Selector Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          padding: '2px 4px 8px 4px'
        }}
      >
        {[
          { code: 'physics', label: 'Physics' },
          { code: 'chemistry', label: 'Chemistry' },
          { code: 'biology', label: 'Biology' },
          { code: 'mathematics', label: 'Maths' }
        ].map((s) => (
          <button
            key={s.code}
            type="button"
            onClick={() => setSubject(s.code)}
            style={{
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '999px',
              border: subject === s.code ? `1px solid ${themeAccent}` : '1px solid #E2E8F0',
              backgroundColor: subject === s.code ? themeBgLight : '#FFFFFF',
              color: subject === s.code ? themeAccent : '#475569',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {s.label}
          </button>
        ))}

        <Link
          to="/notes"
          style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: themeAccent,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            padding: '4px 8px'
          }}
        >
          <BookOpen size={14} /> My Notes
        </Link>
      </div>

      {/* Active Lab Learning Context Banner */}
      {activeModuleContext && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#EEF2FF',
            border: '1px solid #C7D2FE',
            borderRadius: '10px',
            padding: '7px 12px',
            marginBottom: '8px',
            fontSize: '0.8rem',
            color: '#3730A3'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#4F46E5" />
            <span>
              <strong>Active Learning Context:</strong> {activeModuleContext} ({subject.toUpperCase()})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveModuleContext(null)}
            title="Clear module context"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#6366F1'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((m) => {
          const imageAttachment = m.sources?.find((s) => s.type === 'image_attachment');
          return (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div
                style={{
                  backgroundColor: m.role === 'user' ? themeAccent : '#FFFFFF',
                  color: m.role === 'user' ? '#FFFFFF' : '#1E293B',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  borderBottomRightRadius: m.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '16px',
                  border: m.role === 'assistant' ? '1px solid #E2E8F0' : 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  fontSize: '0.92rem',
                  lineHeight: 1.55
                }}
              >
                {/* Render Attached Image Thumbnail inside user bubble (Phase 14) */}
                {imageAttachment && imageAttachment.dataUrl && (
                  <div style={{ marginBottom: '10px' }}>
                    <img
                      src={imageAttachment.dataUrl}
                      alt="Question attached"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '260px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'block',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(imageAttachment.dataUrl, '_blank')}
                      title="Click to view full image"
                    />
                  </div>
                )}

                {/* PHASE 16: Render formatted Markdown, LaTeX equations, code blocks & tables */}
                <FormattedMessage content={m.content} isUser={m.role === 'user'} />
              </div>

              {/* Citations & Sources */}
              {m.sources && m.sources.filter((s) => s.type !== 'image_attachment').length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                  {m.sources
                    .filter((s) => s.type !== 'image_attachment')
                    .map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <BookOpen size={12} /> {s.source || 'NCERT'} • Ch {s.chapter}
                      </span>
                    ))}
                </div>
              )}

              {/* Error Retry Option */}
              {m.isError && m.lastQuery && (
                <div style={{ marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleSend(m.lastQuery)}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#DC2626',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Retry Question
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '10px 16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#64748B',
              fontSize: '0.85rem'
            }}
          >
            <Sparkles size={16} className="animate-spin" color={themeAccent} />
            Saarthi {mode === 'doubt' ? 'Doubt Solver' : 'AI Mentor'} is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Pills */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '6px 4px',
          marginBottom: '8px'
        }}
      >
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(p)}
            style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Multimodal Image Preview Card (Phase 14.1) */}
      {selectedImage && (
        <div
          style={{
            backgroundColor: themeBgLight,
            border: `1.5px solid ${themeBorder}`,
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={selectedImage.dataUrl}
              alt="Attached preview"
              style={{
                width: '52px',
                height: '52px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #CBD5E1'
              }}
            />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: themeAccent }}>
                Image Attached for Analysis
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                {selectedImage.name || 'Image'} • Gemini 3.5 Multimodal Vision Ready
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            title="Remove image attachment"
            style={{
              backgroundColor: '#FFFFFF',
              border: `1px solid ${themeBorder}`,
              borderRadius: '999px',
              padding: '6px',
              cursor: 'pointer',
              color: themeAccent,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Input Box with Attachment Triggers (Phase 14 & 15) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: 'flex',
          gap: '8px',
          padding: '6px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          alignItems: 'center'
        }}
      >
        {/* Hidden File Input for Device Upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png,image/jpeg,image/webp,image/heic"
          onChange={handleImageFileSelect}
          style={{ display: 'none' }}
        />

        {/* Hidden Camera Input for Mobile Snapshot */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleImageFileSelect}
          style={{ display: 'none' }}
        />

        {/* Upload from device button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload image containing questions, formulas, or diagrams"
          style={{
            backgroundColor: selectedImage ? themeBgLight : '#F8FAFC',
            color: themeAccent,
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '8px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Paperclip size={16} />
        </button>

        {/* Camera snapshot button */}
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          title="Snap a photo of textbook question or diagram"
          style={{
            backgroundColor: '#F8FAFC',
            color: themeAccent,
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '8px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Camera size={16} />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            selectedImage
              ? 'Add optional notes or tap Send for Saarthi to solve...'
              : mode === 'doubt'
              ? `Ask any ${subject.toUpperCase()} doubt or problem...`
              : 'Ask for guided lessons, weak areas, or revision plans...'
          }
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            padding: '8px 12px',
            fontSize: '0.9rem'
          }}
        />

        <button
          type="submit"
          disabled={(!inputText.trim() && !selectedImage) || loading}
          style={{
            backgroundColor: themeAccent,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: (!inputText.trim() && !selectedImage) || loading ? 0.6 : 1
          }}
        >
          <Send size={16} />
        </button>
      </form>

      {/* PHASE 15: History Slide-over Drawer (Filtered strictly by active mode) */}
      {showHistoryDrawer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setShowHistoryDrawer(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '380px',
              height: '100%',
              boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color={themeAccent} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: '#1E293B' }}>
                  {mode === 'doubt' ? 'Doubt Solver History' : 'AI Mentor History'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryDrawer(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Indicator Badge inside Drawer */}
            <div
              style={{
                backgroundColor: themeBgLight,
                border: `1px solid ${themeBorder}`,
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '14px',
                fontSize: '0.78rem',
                color: themeAccent,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {mode === 'doubt' ? <HelpCircle size={15} /> : <GraduationCap size={15} />}
              <span>
                Showing only <strong>{mode === 'doubt' ? 'Doubt Solver' : 'AI Mentor'}</strong> conversations.
              </span>
            </div>

            {/* New Chat Action inside Drawer */}
            <button
              type="button"
              onClick={handleStartNewChat}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: themeAccent,
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '16px'
              }}
            >
              <Plus size={15} /> New {mode === 'doubt' ? 'Doubt' : 'Mentor'} Conversation
            </button>

            {/* Sessions List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {loadingSessions ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontSize: '0.85rem' }}>
                  Loading {mode === 'doubt' ? 'Doubt' : 'Mentor'} conversations...
                </div>
              ) : sessionsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94A3B8', fontSize: '0.85rem' }}>
                  <MessageSquare
                    size={32}
                    style={{ margin: '0 auto 8px auto', display: 'block', color: '#CBD5E1' }}
                  />
                  No previous {mode === 'doubt' ? 'Doubt Solver' : 'AI Mentor'} conversations found.
                </div>
              ) : (
                sessionsList.map((sess) => {
                  const isCurrent = currentSessionId === sess.id;
                  const isEditing = editingSessionId === sess.id;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => handleLoadSession(sess)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: isCurrent ? `1.5px solid ${themeAccent}` : '1px solid #E2E8F0',
                        backgroundColor: isCurrent ? themeBgLight : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: sess.mode === 'mentor' ? '#DBEAFE' : '#F3E8FF',
                            color: sess.mode === 'mentor' ? '#1E40AF' : '#7E22CE'
                          }}
                        >
                          {sess.mode || 'doubt'} • {(sess.subject || 'STEM').toUpperCase()}
                        </span>

                        {/* Action buttons (Rename & Delete) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSessionId(sess.id);
                              setEditingSessionTitle(sess.title);
                            }}
                            title="Rename conversation"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              color: '#64748B',
                              padding: '2px'
                            }}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSession(sess.id, e)}
                            title="Delete conversation"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              color: '#EF4444',
                              padding: '2px'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div
                          style={{ display: 'flex', gap: '4px', marginTop: '4px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editingSessionTitle}
                            onChange={(e) => setEditingSessionTitle(e.target.value)}
                            style={{
                              flex: 1,
                              fontSize: '0.8rem',
                              padding: '3px 6px',
                              borderRadius: '4px',
                              border: `1px solid ${themeAccent}`
                            }}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={(e) => handleSaveRenameSession(sess.id, e)}
                            style={{
                              backgroundColor: themeAccent,
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '0.72rem',
                              cursor: 'pointer'
                            }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: '0.86rem',
                            fontWeight: '700',
                            color: '#1E293B',
                            lineHeight: '1.3'
                          }}
                        >
                          {sess.title}
                        </div>
                      )}

                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                        {new Date(sess.updated_at || sess.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Memory Modal */}
      {showMemoryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowMemoryModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={20} color={themeAccent} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
                  Saarthi Memory Store
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMemoryModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Saarthi remembers key conceptual weaknesses, goals, and recurring topics to tailor future
              guidance specifically to your learning curve.
            </p>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {loadingMemories ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontSize: '0.85rem' }}>
                  Loading memories...
                </div>
              ) : memories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '0.85rem' }}>
                  No learning memories recorded yet. As you ask questions, Saarthi automatically identifies topics to revisit!
                </div>
              ) : (
                memories.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: m.type === 'weakness' ? '#FEE2E2' : '#EFF6FF',
                          color: m.type === 'weakness' ? '#DC2626' : '#2563EB',
                          marginRight: '6px'
                        }}
                      >
                        {m.type}
                      </span>
                      <span style={{ fontSize: '0.84rem', color: '#1E293B' }}>{m.text}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteMemory(m.id)}
                      title="Forget this memory"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#94A3B8',
                        padding: '4px'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
