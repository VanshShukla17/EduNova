import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import {
  getSubjects,
  getSubjectChapters,
  getAdminQuestions,
  createQuestion,
  deleteQuestion
} from '../../services/api';
import { Button, EmptyState, Field, Modal, PaperCard, SectionHeader, Skeleton, Tag } from '../../components/ui';

export default function AdminQuestionsPage() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [form, setForm] = useState({
    chapterId: '',
    questionText: '',
    questionTextHindi: '',
    options: ['', '', '', ''],
    optionsHindi: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    difficulty: 'medium',
    board: 'CBSE',
    classLevel: 10,
    language: 'en'
  });

  // Load initial subjects
  useEffect(() => {
    getSubjects().then((res) => {
      const list = Array.isArray(res) ? res : (res.subjects || []);
      setSubjects(list);
      if (list.length > 0) setSelectedSubjectId(list[0]._id);
    });
  }, []);

  // Load chapters for subject
  useEffect(() => {
    if (!selectedSubjectId) return;
    getSubjectChapters(selectedSubjectId).then((res) => {
      const list = Array.isArray(res) ? res : (res.chapters || []);
      setChapters(list);
      if (list.length > 0) setSelectedChapterId(list[0]._id);
      else {
        setSelectedChapterId('');
        setQuestions([]);
      }
    });
  }, [selectedSubjectId]);

  // Load questions for chapter
  useEffect(() => {
    if (!selectedChapterId) return;
    loadQuestions(selectedChapterId);
  }, [selectedChapterId]);

  const loadQuestions = async (chapId) => {
    try {
      setLoading(true);
      const res = await getAdminQuestions({ chapterId: chapId });
      setQuestions(res.questions || []);
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to load questions: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setForm({
      chapterId: selectedChapterId || (chapters[0]?._id ?? ''),
      questionText: '',
      questionTextHindi: '',
      options: ['', '', '', ''],
      optionsHindi: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      difficulty: 'medium',
      board: 'CBSE',
      classLevel: 10,
      language: 'en'
    });
    setShowModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (!form.questionText || !form.chapterId) {
        setAlertMsg({ type: 'error', text: 'Question text and chapter are required' });
        return;
      }
      if (form.options.some((opt) => !opt.trim())) {
        setAlertMsg({ type: 'error', text: 'All 4 options must be filled' });
        return;
      }

      await createQuestion(form);
      setAlertMsg({ type: 'success', text: 'New practice question added to question bank successfully!' });
      setShowModal(false);
      loadQuestions(form.chapterId);
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to create question: ' + err.message });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteQuestion(deleteTargetId);
      setAlertMsg({ type: 'success', text: 'Question deleted successfully.' });
      setDeleteTargetId(null);
      loadQuestions(selectedChapterId);
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to delete question: ' + err.message });
      setDeleteTargetId(null);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: 'var(--sp-8)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {/* Top Navigation */}
      <div>
        <Button as={Link} to="/admin" variant="ghost" size="sm">
          <ArrowLeft size={16} /> Back to Admin Dashboard
        </Button>
      </div>

      {/* Banner Alert */}
      {alertMsg && (
        <PaperCard
          flat
          role="status"
          style={{
            padding: 'var(--sp-3) var(--sp-4)',
            backgroundColor: alertMsg.type === 'success' ? 'var(--emerald-soft)' : 'var(--red-soft)',
            color: alertMsg.type === 'success' ? 'var(--emerald-800)' : 'var(--red-ink)',
            borderColor: alertMsg.type === 'success' ? 'var(--emerald-600)' : 'var(--red-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            fontSize: '0.88rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {alertMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{alertMsg.text}</span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setAlertMsg(null)} aria-label="Dismiss alert">
            <X size={16} />
          </Button>
        </PaperCard>
      )}

      {/* Header & Filter Controls */}
      <PaperCard flat style={{ padding: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div style={{ flex: '1 1 320px' }}>
            <SectionHeader kicker="QUESTION BANK" title="MCQ Practice Question Bank" />
            <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 'var(--sp-3)' }}>
              <div style={{ minWidth: '180px', flex: '1 1 180px' }}>
                <Field
                  as="select"
                  label="Subject"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </Field>
              </div>

              <div style={{ minWidth: '220px', flex: '2 1 240px' }}>
                <Field
                  as="select"
                  label="Chapter"
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                >
                  {chapters.map((chap) => (
                    <option key={chap._id} value={chap._id}>
                      Ch {chap.chapterNumber}: {chap.title}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
          </div>

          <Button type="button" variant="primary" size="md" onClick={handleOpenAddModal}>
            <Plus size={16} /> Add New MCQ
          </Button>
        </div>
      </PaperCard>

      {/* Questions List */}
      {loading ? (
        <PaperCard flat style={{ padding: 'var(--sp-5)' }}>
          <Skeleton lines={5} />
        </PaperCard>
      ) : questions.length === 0 ? (
        <PaperCard flat style={{ padding: 'var(--sp-5)' }}>
          <EmptyState
            title="No questions found for this chapter"
            description='Click "Add New MCQ" to author a board-style bilingual question.'
          />
        </PaperCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {questions.map((q, idx) => (
            <PaperCard key={q._id} flat style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-2)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <Tag tone="red">Question {idx + 1} • {q.difficulty || 'Medium'}</Tag>
                  </div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {q.questionText}
                  </div>
                  {q.questionTextHindi && (
                    <div style={{ fontSize: '0.88rem', color: 'var(--ink-muted)', marginTop: '4px' }}>
                      {q.questionTextHindi}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTargetId(q._id)}
                  title="Delete Question"
                  aria-label="Delete Question"
                  style={{ color: 'var(--red-600)' }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              {/* Options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-2)' }}>
                {q.options.map((opt, optIdx) => {
                  const isCorrect = q.correctIndex === optIdx;
                  return (
                    <div
                      key={optIdx}
                      className={`option-card${isCorrect ? ' option-card--selected' : ''}`}
                      style={{
                        padding: 'var(--sp-2) var(--sp-3)',
                        fontSize: '0.86rem',
                        justifyContent: 'space-between',
                        backgroundColor: isCorrect ? 'var(--emerald-soft)' : 'var(--paper-warm)',
                        borderColor: isCorrect ? 'var(--emerald-600)' : 'var(--paper-edge)',
                        color: isCorrect ? 'var(--emerald-800)' : 'var(--ink)'
                      }}
                    >
                      <span>{String.fromCharCode(65 + optIdx)}) {opt}</span>
                      {isCorrect && <Tag tone="emerald">Correct Key</Tag>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <PaperCard flat style={{ padding: 'var(--sp-2) var(--sp-3)', backgroundColor: 'var(--paper-warm)', fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
                  <strong>Explanation:</strong> {q.explanation}
                </PaperCard>
              )}
            </PaperCard>
          ))}
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add New MCQ"
        tapeTone="yellow"
        maxWidth="600px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)' }}>
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="admin-add-question-form" variant="primary" size="sm">
              Save Question
            </Button>
          </div>
        }
      >
        <form id="admin-add-question-form" onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <Field
            as="select"
            label="Target Chapter *"
            value={form.chapterId}
            onChange={(e) => setForm({ ...form, chapterId: e.target.value })}
            required
          >
            {chapters.map((chap) => (
              <option key={chap._id} value={chap._id}>
                Ch {chap.chapterNumber}: {chap.title}
              </option>
            ))}
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--sp-2)' }}>
            <Field
              as="select"
              label="Board"
              value={form.board}
              onChange={(e) => setForm({ ...form, board: e.target.value })}
            >
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
            </Field>

            <Field
              as="select"
              label="Class"
              value={form.classLevel}
              onChange={(e) => setForm({ ...form, classLevel: Number(e.target.value) })}
            >
              <option value={10}>Class 10</option>
              <option value={12}>Class 12</option>
            </Field>

            <Field
              as="select"
              label="Language"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </Field>
          </div>

          <Field
            as="textarea"
            label="Question Statement (English) *"
            rows={2}
            required
            value={form.questionText}
            onChange={(e) => setForm({ ...form, questionText: e.target.value })}
          />

          <Field
            as="textarea"
            label="Question Statement (Hindi)"
            rows={2}
            value={form.questionTextHindi}
            onChange={(e) => setForm({ ...form, questionTextHindi: e.target.value })}
          />

          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
              Options (A, B, C, D) &amp; Correct Key *
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {[0, 1, 2, 3].map((optIdx) => (
                <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <input
                    type="radio"
                    name="correctKey"
                    checked={form.correctIndex === optIdx}
                    onChange={() => setForm({ ...form, correctIndex: optIdx })}
                    title="Set as correct answer"
                    aria-label={`Set Option ${String.fromCharCode(65 + optIdx)} as correct answer`}
                    style={{ accentColor: 'var(--emerald-600)', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, width: '22px', fontFamily: 'var(--font-mono)' }}>
                    {String.fromCharCode(65 + optIdx)})
                  </span>
                  <div style={{ flex: 1 }}>
                    <Field
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      value={form.options[optIdx] || ''}
                      onChange={(e) => {
                        const newOpts = [...form.options];
                        newOpts[optIdx] = e.target.value;
                        setForm({ ...form, options: newOpts });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', display: 'block', marginTop: '4px' }}>
              Select the radio button next to the correct answer.
            </span>
          </div>

          <Field
            as="textarea"
            label="Step-by-step Physics / Science Explanation *"
            rows={2}
            required
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          />
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Practice Question"
        tapeTone="yellow"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)' }}>
            <Button type="button" variant="secondary" size="sm" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" size="sm" onClick={handleConfirmDelete}>
              Delete Question
            </Button>
          </div>
        }
      >
        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--ink-muted)' }}>
          Are you sure you want to delete this question from the question bank? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
