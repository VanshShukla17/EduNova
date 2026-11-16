import React from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Clock,
  Brain,
  Trash2,
  X,
  Camera,
  Paperclip as AttachmentIcon,
  Loader2,
  Plus,
  Pencil,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import FormattedMessage from '../../components/FormattedMessage';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useTextToSpeech, detectLanguage } from '../../hooks/useTextToSpeech';
import {
  PaperCard,
  StickyNote,
  Tag,
  Button,
  Field,
  Modal,
  ChotuMascot,
  Paperclip as NotePaperclip,
  Skeleton,
  EmptyState,
} from '../../components/ui';

export default function SaarthiPageView({
  user,
  mode,
  subject,
  setSubject,
  currentSessionTitle,
  currentSessionId,
  messages,
  inputText,
  setInputText,
  selectedImage,
  setSelectedImage,
  activeModuleContext,
  setActiveModuleContext,
  loading,
  samplePrompts,
  messagesEndRef,
  fileInputRef,
  cameraInputRef,
  showHistoryDrawer,
  setShowHistoryDrawer,
  sessionsList,
  loadingSessions,
  editingSessionId,
  setEditingSessionId,
  editingSessionTitle,
  setEditingSessionTitle,
  showMemoryModal,
  setShowMemoryModal,
  memories,
  loadingMemories,
  handleSwitchMode,
  handleStartNewChat,
  handleOpenMemoryModal,
  handleSend,
  handleImageFileSelect,
  handleLoadSession,
  handleDeleteSession,
  handleSaveRenameSession,
  deleteMemory,
  selectedLanguage: controlledLang = 'en',
  setSelectedLanguage: onLanguageChange,
}) {
  const currentLang = controlledLang || 'en';

  const {
    isListening,
    error: speechError,
    isSupported: speechSupported,
    toggleListening,
    stopListening,
  } = useSpeechToText({
    onTextChange: (text) => setInputText(text),
  });

  const {
    isSpeaking: isTTSActive,
    currentSpeakingId,
    toggle: toggleTTS,
    stop: stopTTS,
  } = useTextToSpeech(currentLang);

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {/* Top Mode & Session Bar */}
      <PaperCard flat style={{ padding: 'var(--sp-4)' }}>
        <div className="paper-grid paper-grid--2" style={{ gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
          <Button
            variant={mode === 'doubt' ? 'primary' : 'note'}
            onClick={() => handleSwitchMode('doubt')}
            style={{ justifyContent: 'flex-start', textAlign: 'left', height: 'auto', padding: '10px 14px' }}
          >
            <HelpCircle size={18} strokeWidth={2} aria-hidden="true" />
            <div>
              <div style={{ fontWeight: 700 }}>Doubt Solver (शंका समाधान)</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Step-by-step STEM solutions</div>
            </div>
          </Button>

          <Button
            variant={mode === 'mentor' ? 'primary' : 'note'}
            onClick={() => handleSwitchMode('mentor')}
            style={{ justifyContent: 'flex-start', textAlign: 'left', height: 'auto', padding: '10px 14px' }}
          >
            <GraduationCap size={18} strokeWidth={2} aria-hidden="true" />
            <div>
              <div style={{ fontWeight: 700 }}>AI Mentor (मार्गदर्शक)</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Guided revision & study coaching</div>
            </div>
          </Button>
        </div>

        {/* Language Selection: English / हिंदी / ಕನ್ನಡ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--sp-2)',
            padding: '8px 12px',
            background: 'var(--paper-dots)',
            borderRadius: 'var(--r-md)',
            border: '1.5px solid var(--paper-border-strong)',
            marginBottom: 'var(--sp-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink)' }}>
            <span>🌐</span>
            <span>Response & Voice Language:</span>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { code: 'en', label: 'English', sub: 'English' },
              { code: 'hi', label: 'हिंदी (Hindi)', sub: 'Hindi' },
              { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', sub: 'Kannada' },
            ].map((l) => {
              const active = currentLang.startsWith(l.code);
              return (
                <Button
                  key={l.code}
                  variant={active ? 'primary' : 'note'}
                  size="sm"
                  onClick={() => onLanguageChange?.(l.code)}
                  title={`Generate AI answers and voice audio in ${l.sub}`}
                  aria-label={`Select ${l.label} language`}
                  style={{
                    padding: '3px 10px',
                    fontSize: '0.8125rem',
                    fontWeight: active ? 700 : 500,
                    height: '28px',
                    boxShadow: active ? '0 0 6px rgba(5, 150, 105, 0.35)' : undefined,
                  }}
                >
                  {l.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--sp-3)',
            paddingBottom: 'var(--sp-3)',
            borderBottom: '1px solid var(--paper-border-warm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <ChotuMascot size={42} />
            <div>
              <h1 className="type-h3" style={{ color: 'var(--ink)' }}>
                Chotu {mode === 'doubt' ? 'Doubt Solver' : 'AI Mentor'}
              </h1>
              <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
                Class {user?.classLevel || 10} · {currentSessionTitle}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            <Button variant="primary" size="sm" onClick={handleStartNewChat}>
              <Plus size={15} strokeWidth={2} aria-hidden="true" />
              New Chat
            </Button>
            <Button variant="note" size="sm" onClick={() => setShowHistoryDrawer(true)}>
              <Clock size={15} strokeWidth={2} aria-hidden="true" />
              History
            </Button>
            <Button variant="note" size="sm" onClick={handleOpenMemoryModal}>
              <Brain size={15} strokeWidth={2} aria-hidden="true" />
              Memory
            </Button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--sp-2)',
            paddingTop: 'var(--sp-3)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            {[
              { code: 'physics', label: 'Physics' },
              { code: 'chemistry', label: 'Chemistry' },
              { code: 'biology', label: 'Biology' },
              { code: 'mathematics', label: 'Maths' },
            ].map((s) => (
              <Button
                key={s.code}
                variant={subject === s.code ? 'primary' : 'note'}
                size="sm"
                onClick={() => setSubject(s.code)}
              >
                {s.label}
              </Button>
            ))}
          </div>

          <Button variant="kraft" size="sm" to="/notes">
            <BookOpen size={15} strokeWidth={2} aria-hidden="true" />
            My Notes
          </Button>
        </div>
      </PaperCard>

      {activeModuleContext ? (
        <StickyNote tone="green" body rotation="-0.2deg" style={{ maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-2)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={15} strokeWidth={2} aria-hidden="true" />
              <strong>Active Learning Context:</strong> {activeModuleContext} ({subject.toUpperCase()})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveModuleContext(null)}
              aria-label="Clear module context"
            >
              <X size={14} />
            </Button>
          </div>
        </StickyNote>
      ) : null}

      {/* Notebook Message Stream */}
      <PaperCard
        flat
        variant="ruled"
        style={{
          padding: 'var(--sp-5)',
          minHeight: '380px',
          maxHeight: '560px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-4)',
        }}
      >
        {messages.map((m, msgIdx) => {
          const imageAttachment = m.sources?.find((s) => s.type === 'image_attachment');
          const citations = (m.sources || []).filter((s) => s.type !== 'image_attachment');
          const isUser = m.role === 'user';

          return (
            <div
              key={m.id || msgIdx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: 'var(--sp-2)',
              }}
            >
              <StickyNote
                tone={isUser ? 'blue' : 'yellow'}
                body
                rotation={isUser ? '0.4deg' : '-0.3deg'}
                style={{ maxWidth: '88%', padding: '12px 16px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: !isUser ? 'var(--sp-2)' : 0,
                  }}
                >
                  {!isUser && msgIdx === 0 ? <NotePaperclip /> : <span />}
                  {!isUser ? (
                    <Button
                      type="button"
                      variant={currentSpeakingId === (m.id || msgIdx) ? 'primary' : 'note'}
                      size="sm"
                      onClick={() => toggleTTS(m.id || msgIdx, m.content, { lang: currentLang })}
                      title={
                        currentSpeakingId === (m.id || msgIdx)
                          ? 'Stop reading'
                          : `Read response aloud in ${currentLang === 'hi' ? 'Hindi' : currentLang === 'kn' ? 'Kannada' : 'English'}`
                      }
                      aria-label={
                        currentSpeakingId === (m.id || msgIdx)
                          ? 'Stop reading'
                          : 'Read response aloud'
                      }
                      style={
                        currentSpeakingId === (m.id || msgIdx)
                          ? {
                              padding: '2px 8px',
                              fontSize: '0.75rem',
                              height: '24px',
                              background: '#059669',
                              borderColor: '#047857',
                              color: '#ffffff',
                              boxShadow: '0 0 8px rgba(5, 150, 105, 0.45)',
                            }
                          : {
                              padding: '2px 8px',
                              fontSize: '0.75rem',
                              height: '24px',
                            }
                      }
                    >
                      {currentSpeakingId === (m.id || msgIdx) ? (
                        <>
                          <VolumeX size={13} strokeWidth={2} aria-hidden="true" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={13} strokeWidth={2} aria-hidden="true" />
                          <span>
                            {detectLanguage(m.content) === 'kn-IN'
                              ? 'Listen (ಕನ್ನಡ)'
                              : detectLanguage(m.content) === 'hi-IN'
                              ? 'Listen (हिंदी)'
                              : 'Listen'}
                          </span>
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
                {imageAttachment?.dataUrl ? (
                  <div style={{ marginBottom: 'var(--sp-2)' }}>
                    <img
                      src={imageAttachment.dataUrl}
                      alt="Question attached"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '240px',
                        borderRadius: 'var(--r-sm)',
                        border: '1px solid var(--paper-border-strong)',
                        display: 'block',
                        cursor: 'pointer',
                      }}
                      onClick={() => window.open(imageAttachment.dataUrl, '_blank')}
                    />
                  </div>
                ) : null}

                <FormattedMessage content={m.content} isUser={isUser} />
              </StickyNote>

              {citations.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                  {citations.map((s, idx) => (
                    <Tag key={idx} variant="paper">
                      <BookOpen size={12} strokeWidth={2} aria-hidden="true" />
                      {s.source || 'NCERT'} · Ch {s.chapter}
                    </Tag>
                  ))}
                </div>
              ) : null}

              {m.isError && m.lastQuery ? (
                <Button variant="danger" size="sm" onClick={() => handleSend(m.lastQuery)}>
                  Retry Question
                </Button>
              ) : null}
            </div>
          );
        })}

        {loading ? (
          <StickyNote tone="yellow" body rotation="0deg" style={{ maxWidth: '280px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--ink-muted)' }}>
              <Loader2 size={16} aria-hidden="true" />
              Chotu {mode === 'doubt' ? 'Doubt Solver' : 'AI Mentor'} is thinking...
            </span>
          </StickyNote>
        ) : null}

        <div ref={messagesEndRef} />
      </PaperCard>

      {/* Suggested Question Chips + Composer */}
      <PaperCard flat style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          {samplePrompts.map((p, i) => (
            <Button key={i} variant="note" size="sm" onClick={() => handleSend(p)}>
              {p}
            </Button>
          ))}
        </div>

        {selectedImage ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--sp-3)',
              padding: 'var(--sp-2) var(--sp-3)',
              borderRadius: 'var(--r-md)',
              background: 'var(--paper-warm)',
              border: '1px solid var(--paper-border-warm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <img
                src={selectedImage.dataUrl}
                alt="Attached preview"
                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--r-sm)' }}
              />
              <div>
                <div className="type-small" style={{ fontWeight: 700, color: 'var(--ink)' }}>
                  Image Attached for Analysis
                </div>
                <div className="type-small" style={{ color: 'var(--ink-muted)' }}>
                  {selectedImage.name || 'Question image'}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
              aria-label="Remove image attachment"
            >
              <X size={16} />
            </Button>
          </div>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isListening) stopListening();
            stopTTS();
            handleSend();
          }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', alignItems: 'center' }}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg,image/webp,image/heic"
            onChange={handleImageFileSelect}
            style={{ display: 'none' }}
          />
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleImageFileSelect}
            style={{ display: 'none' }}
          />

          <Button
            variant="note"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            title="Upload question or diagram image"
            aria-label="Upload image"
          >
            <AttachmentIcon size={16} strokeWidth={2} aria-hidden="true" />
          </Button>

          <Button
            variant="note"
            size="sm"
            onClick={() => cameraInputRef.current?.click()}
            title="Snap textbook photo"
            aria-label="Take photo"
          >
            <Camera size={16} strokeWidth={2} aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="note"
            size="sm"
            onClick={() => {
              const order = ['en', 'hi', 'kn'];
              const nextIdx = (order.indexOf(currentLang) + 1) % order.length;
              onLanguageChange?.(order[nextIdx]);
            }}
            title={`Current Language: ${currentLang === 'hi' ? 'Hindi (हिंदी)' : currentLang === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'} · Click to switch`}
            aria-label={`Language: ${currentLang}`}
            style={{ fontWeight: 700, fontSize: '0.75rem', minWidth: '48px' }}
          >
            {currentLang === 'hi' ? 'हिंदी' : currentLang === 'kn' ? 'ಕನ್ನಡ' : 'EN'}
          </Button>

          <Button
            type="button"
            variant={isListening ? "primary" : "note"}
            size="sm"
            onClick={() =>
              toggleListening(inputText, {
                lang: currentLang === 'hi' ? 'hi-IN' : currentLang === 'kn' ? 'kn-IN' : 'en-IN',
              })
            }
            title={
              !speechSupported
                ? 'Voice input not supported in this browser'
                : isListening
                ? 'Listening... Click to stop recording'
                : `Voice to text (${currentLang === 'hi' ? 'Hindi' : currentLang === 'kn' ? 'Kannada' : 'English'}): Click to speak`
            }
            aria-label={isListening ? 'Stop listening' : 'Start voice to text'}
            style={
              isListening
                ? {
                    background: '#ef4444',
                    borderColor: '#dc2626',
                    color: '#ffffff',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.65)',
                    animation: 'chotu-mic-pulse 1.2s infinite ease-in-out',
                  }
                : undefined
            }
          >
            {isListening ? (
              <MicOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Mic size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </Button>

          <div style={{ flex: '1 1 220px' }}>
            <Field
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? currentLang === 'hi'
                    ? 'सुन रहा हूँ... अब अपना प्रश्न बोलें 🎙️'
                    : currentLang === 'kn'
                    ? 'ಕೇಳುತ್ತಿದ್ದೇನೆ... ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಮಾತನಾಡಿ 🎙️'
                    : 'Listening... speak your question now 🎙️'
                  : selectedImage
                  ? 'Add optional notes or tap Send...'
                  : currentLang === 'hi'
                  ? 'कोई भी विज्ञान या गणित का प्रश्न पूछें... (उदा: न्यूटन का तीसरा नियम)'
                  : currentLang === 'kn'
                  ? 'ವಿಜ್ಞಾನ ಅಥವಾ ಗಣಿತದ ಪ್ರಶ್ನೆ ಕೇಳಿ... (ಉದಾ: ನ್ಯೂಟನ್ ನಿಯಮ)'
                  : mode === 'doubt'
                  ? 'Ask any STEM doubt or problem...'
                  : 'Ask for guided revision or study plans...'
              }
              aria-label="Ask Chotu question"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={(!inputText.trim() && !selectedImage) || loading}
          >
            <Send size={16} strokeWidth={2} aria-hidden="true" />
            Send
          </Button>
        </form>
        {speechError ? (
          <div
            style={{
              marginTop: 'var(--sp-2)',
              fontSize: '0.8125rem',
              color: '#b91c1c',
              background: '#fef2f2',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #fecaca',
            }}
          >
            {speechError}
          </div>
        ) : null}
      </PaperCard>

      {/* Session History Modal */}
      <Modal
        open={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        title={mode === 'doubt' ? 'Doubt Solver History' : 'AI Mentor History'}
        tapeTone="yellow"
        footer={
          <Button variant="primary" size="sm" onClick={handleStartNewChat}>
            <Plus size={15} strokeWidth={2} aria-hidden="true" />
            New Conversation
          </Button>
        }
      >
        <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
          Showing {mode === 'doubt' ? 'Doubt Solver' : 'AI Mentor'} notebook sessions.
        </p>

        {loadingSessions ? (
          <Skeleton card={false} lines={3} />
        ) : sessionsList.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No Saved Conversations"
            description="Start a question above to save it to your study history."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', maxHeight: '360px', overflowY: 'auto' }}>
            {sessionsList.map((sess) => {
              const isCurrent = currentSessionId === sess.id;
              const isEditing = editingSessionId === sess.id;
              return (
                <PaperCard
                  key={sess.id}
                  flat
                  onClick={() => handleLoadSession(sess)}
                  style={{
                    padding: 'var(--sp-3)',
                    background: isCurrent ? 'var(--emerald-soft)' : 'var(--paper-warm)',
                    borderColor: isCurrent ? 'var(--emerald-700)' : 'var(--paper-border-warm)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-2)' }}>
                    <Tag variant="paper">{sess.subject || 'STEM'}</Tag>
                    <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSessionId(sess.id);
                          setEditingSessionTitle(sess.title);
                        }}
                        aria-label="Rename conversation"
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        aria-label="Delete conversation"
                        style={{ color: 'var(--red-600)' }}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div
                      style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ flex: 1 }}>
                        <Field
                          value={editingSessionTitle}
                          onChange={(e) => setEditingSessionTitle(e.target.value)}
                          aria-label="Session title"
                        />
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => handleSaveRenameSession(sess.id, e)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="type-body" style={{ fontWeight: 700, color: 'var(--ink)', marginTop: '6px' }}>
                      {sess.title}
                    </div>
                  )}

                  <div className="type-small" style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
                    {new Date(sess.updated_at || sess.created_at).toLocaleDateString()}
                  </div>
                </PaperCard>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Memory Modal */}
      <Modal
        open={showMemoryModal}
        onClose={() => setShowMemoryModal(false)}
        title="Chotu Learning Memory"
        tapeTone="green"
        footer={
          <Button variant="primary" size="sm" onClick={() => setShowMemoryModal(false)}>
            Done
          </Button>
        }
      >
        <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
          Chotu remembers weak topics and goals to tailor explanations to your class level.
        </p>

        {loadingMemories ? (
          <Skeleton card={false} lines={3} />
        ) : memories.length === 0 ? (
          <EmptyState
            icon={Bot}
            title="No Memories Recorded Yet"
            description="As you solve problems, Chotu notes key concepts to revisit."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', maxHeight: '340px', overflowY: 'auto' }}>
            {memories.map((m) => (
              <PaperCard
                key={m.id}
                flat
                style={{
                  padding: 'var(--sp-3)',
                  background: 'var(--paper-warm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                }}
              >
                <div>
                  <Tag variant={m.type === 'weakness' ? 'paper' : 'verified'}>{m.type}</Tag>
                  <p className="type-small" style={{ color: 'var(--ink)', marginTop: '4px' }}>
                    {m.text}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMemory(m.id)}
                  aria-label="Forget this memory"
                  style={{ color: 'var(--red-600)' }}
                >
                  <Trash2 size={14} />
                </Button>
              </PaperCard>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
