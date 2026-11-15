import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Layers,
  BookOpen,
  FileText,
  X
} from 'lucide-react';
import {
  getSubjects,
  getSubjectChapters,
  getChapterLessons,
  createSubject,
  updateSubject,
  deleteSubject,
  createChapter,
  updateChapter,
  deleteChapter,
  createLesson,
  updateLesson,
  deleteLesson
} from '../../services/api';
import { Button, EmptyState, Field, Modal, PaperCard, SectionHeader, Tag } from '../../components/ui';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('chapters'); // 'chapters' | 'subjects' | 'lessons'

  // Master Data
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);

  // Selected Filters
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');

  // Loading & Message
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null); // { type: 'success'|'error', text: '' }

  // Modal State
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [chapterForm, setChapterForm] = useState({
    subjectId: '',
    title: '',
    titleHindi: '',
    chapterNumber: 1,
    description: '',
    descriptionHindi: ''
  });
  const [editingChapterId, setEditingChapterId] = useState(null);

  // Lesson Modal State
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    chapterId: '',
    title: '',
    titleHindi: '',
    lessonNumber: 1,
    summary: '',
    summaryHindi: '',
    textBlock: '',
    formulaBlock: ''
  });
  const [editingLessonId, setEditingLessonId] = useState(null);

  // Safe Deletion Confirmation Modal (Task 10.3)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null); // { type, id, title, warningText }

  // Initial Load: Fetch Subjects
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await getSubjects();
      const list = Array.isArray(res) ? res : (res.subjects || []);
      setSubjects(list);
      if (list.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(list[0]._id);
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to load subjects: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  // Load Chapters when selectedSubjectId changes
  useEffect(() => {
    if (!selectedSubjectId) return;
    loadChapters(selectedSubjectId);
  }, [selectedSubjectId]);

  const loadChapters = async (subId) => {
    try {
      setLoading(true);
      const res = await getSubjectChapters(subId);
      const list = Array.isArray(res) ? res : (res.chapters || []);
      setChapters(list);
      if (list.length > 0) {
        setSelectedChapterId(list[0]._id);
      } else {
        setSelectedChapterId('');
        setLessons([]);
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to load chapters: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  // Load Lessons when selectedChapterId changes
  useEffect(() => {
    if (!selectedChapterId) return;
    loadLessons(selectedChapterId);
  }, [selectedChapterId]);

  const loadLessons = async (chapId) => {
    try {
      setLoading(true);
      const res = await getChapterLessons(chapId);
      const list = Array.isArray(res) ? res : (res.lessons || []);
      setLessons(list);
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to load lessons: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // CHAPTER CRUD HANDLERS
  // -------------------------------------------------------------

  const handleOpenAddChapter = () => {
    setEditingChapterId(null);
    setChapterForm({
      subjectId: selectedSubjectId || (subjects[0]?._id ?? ''),
      title: '',
      titleHindi: '',
      chapterNumber: chapters.length + 1,
      description: '',
      descriptionHindi: ''
    });
    setShowChapterModal(true);
  };

  const handleOpenEditChapter = (chap) => {
    setEditingChapterId(chap._id);
    setChapterForm({
      subjectId: chap.subjectId?._id || chap.subjectId || selectedSubjectId,
      title: chap.title || '',
      titleHindi: chap.titleHindi || '',
      chapterNumber: chap.chapterNumber || 1,
      description: chap.description || '',
      descriptionHindi: chap.descriptionHindi || ''
    });
    setShowChapterModal(true);
  };

  const handleSaveChapter = async (e) => {
    e.preventDefault();
    try {
      if (!chapterForm.title || !chapterForm.subjectId) {
        setAlertMsg({ type: 'error', text: 'Chapter title and subject are required' });
        return;
      }

      if (editingChapterId) {
        await updateChapter(editingChapterId, chapterForm);
        setAlertMsg({ type: 'success', text: `Chapter "${chapterForm.title}" updated successfully!` });
      } else {
        await createChapter(chapterForm);
        setAlertMsg({ type: 'success', text: `New chapter "${chapterForm.title}" created successfully and is now live for students!` });
      }

      setShowChapterModal(false);
      loadChapters(chapterForm.subjectId);
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to save chapter: ' + err.message });
    }
  };

  const handleDeleteChapterClick = async (chap) => {
    try {
      // First attempt without force to check for student progress
      await deleteChapter(chap._id, false);
      setAlertMsg({ type: 'success', text: `Chapter "${chap.title}" deleted safely.` });
      loadChapters(selectedSubjectId);
    } catch (err) {
      // If 409 conflict: active progress detected
      if (err.status === 409 || err.message.includes('Warning') || err.message.includes('active student progress')) {
        setDeleteConfirmModal({
          type: 'chapter',
          id: chap._id,
          title: chap.title,
          warningText: err.message || 'This chapter has active student progress records. Deleting it will safely remove associated student records.'
        });
      } else {
        setAlertMsg({ type: 'error', text: 'Delete failed: ' + err.message });
      }
    }
  };

  // -------------------------------------------------------------
  // LESSON CRUD HANDLERS
  // -------------------------------------------------------------

  const handleOpenAddLesson = () => {
    setEditingLessonId(null);
    setLessonForm({
      chapterId: selectedChapterId || (chapters[0]?._id ?? ''),
      title: '',
      titleHindi: '',
      lessonNumber: lessons.length + 1,
      summary: '',
      summaryHindi: '',
      textBlock: '',
      formulaBlock: ''
    });
    setShowLessonModal(true);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    try {
      if (!lessonForm.title || !lessonForm.chapterId) {
        setAlertMsg({ type: 'error', text: 'Lesson title and chapter are required' });
        return;
      }

      const contentBlocks = [];
      if (lessonForm.textBlock) {
        contentBlocks.push({
          type: 'text',
          order: 1,
          content: lessonForm.textBlock
        });
      }
      if (lessonForm.formulaBlock) {
        contentBlocks.push({
          type: 'formula',
          order: 2,
          content: lessonForm.formulaBlock
        });
      }

      const payload = {
        chapterId: lessonForm.chapterId,
        title: lessonForm.title,
        titleHindi: lessonForm.titleHindi,
        lessonNumber: lessonForm.lessonNumber,
        summary: lessonForm.summary,
        summaryHindi: lessonForm.summaryHindi,
        contentBlocks
      };

      if (editingLessonId) {
        await updateLesson(editingLessonId, payload);
        setAlertMsg({ type: 'success', text: `Lesson "${lessonForm.title}" updated successfully!` });
      } else {
        await createLesson(payload);
        setAlertMsg({ type: 'success', text: `Lesson "${lessonForm.title}" created successfully and added to chapter!` });
      }

      setShowLessonModal(false);
      loadLessons(lessonForm.chapterId);
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to save lesson: ' + err.message });
    }
  };

  const handleDeleteLessonClick = async (lesson) => {
    try {
      await deleteLesson(lesson._id, false);
      setAlertMsg({ type: 'success', text: `Lesson "${lesson.title}" deleted safely.` });
      loadLessons(selectedChapterId);
    } catch (err) {
      if (err.status === 409 || err.message.includes('Warning') || err.message.includes('marked as completed')) {
        setDeleteConfirmModal({
          type: 'lesson',
          id: lesson._id,
          title: lesson.title,
          warningText: err.message || 'This lesson has been completed by students. Confirm deletion to safely update their progress percentages.'
        });
      } else {
        setAlertMsg({ type: 'error', text: 'Delete failed: ' + err.message });
      }
    }
  };

  // Safe Deletion Confirmation Handler (Task 10.3)
  const handleConfirmSafeDelete = async () => {
    if (!deleteConfirmModal) return;
    const { type, id } = deleteConfirmModal;
    try {
      if (type === 'chapter') {
        await deleteChapter(id, true);
        setAlertMsg({ type: 'success', text: 'Chapter and associated student records deleted safely and consistently.' });
        loadChapters(selectedSubjectId);
      } else if (type === 'lesson') {
        await deleteLesson(id, true);
        setAlertMsg({ type: 'success', text: 'Lesson deleted safely. Student completion percentages updated consistently.' });
        loadLessons(selectedChapterId);
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Confirmed deletion failed: ' + err.message });
    } finally {
      setDeleteConfirmModal(null);
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

      {/* Page Title & Tab Navigation */}
      <PaperCard flat style={{ padding: 'var(--sp-4)' }}>
        <SectionHeader kicker="CONTENT MANAGER" title="Curriculum Content Manager" />

        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', marginTop: 'var(--sp-3)' }}>
          <Button
            type="button"
            size="sm"
            variant={activeTab === 'chapters' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('chapters')}
          >
            <Layers size={16} /> Chapters (अध्याय)
          </Button>

          <Button
            type="button"
            size="sm"
            variant={activeTab === 'lessons' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('lessons')}
          >
            <FileText size={16} /> Lessons (पाठ)
          </Button>

          <Button
            type="button"
            size="sm"
            variant={activeTab === 'subjects' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('subjects')}
          >
            <BookOpen size={16} /> Subjects (विषय)
          </Button>
        </div>
      </PaperCard>

      {/* ========================================================= */}
      {/* TAB 1: CHAPTERS MANAGEMENT (Task 10.2 & 10.3) */}
      {/* ========================================================= */}
      {activeTab === 'chapters' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {/* Subject Filter & Add Chapter Action */}
          <PaperCard
            flat
            style={{
              padding: 'var(--sp-3) var(--sp-4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 'var(--sp-3)'
            }}
          >
            <div style={{ minWidth: '220px', flex: '1 1 240px' }}>
              <Field
                as="select"
                label="Filter by Subject"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.nameHindi})
                  </option>
                ))}
              </Field>
            </div>

            <Button type="button" variant="primary" size="md" onClick={handleOpenAddChapter}>
              <Plus size={16} /> Add New Chapter
            </Button>
          </PaperCard>

          {/* Chapters Table / List */}
          <PaperCard flat style={{ padding: 0, overflow: 'hidden' }}>
            {chapters.length === 0 ? (
              <div style={{ padding: 'var(--sp-5)' }}>
                <EmptyState
                  title="No chapters found for this subject"
                  description='Click "Add New Chapter" to create one.'
                />
              </div>
            ) : (
              <div className="paper-table-wrap">
                <table className="paper-table paper-table--stack">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>English Title</th>
                      <th>Hindi Title</th>
                      <th>Description</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chapters.map((chap) => (
                      <tr key={chap._id}>
                        <td data-label="#" style={{ fontWeight: 700, color: 'var(--physics-ink)', fontFamily: 'var(--font-mono)' }}>
                          Ch {chap.chapterNumber}
                        </td>
                        <td data-label="English Title" style={{ fontWeight: 700, color: 'var(--ink)' }}>
                          {chap.title}
                        </td>
                        <td data-label="Hindi Title" style={{ color: 'var(--ink-muted)' }}>
                          {chap.titleHindi || '-'}
                        </td>
                        <td data-label="Description" style={{ color: 'var(--ink-soft)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {chap.description}
                        </td>
                        <td data-label="Actions" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: '4px', justifyContent: 'flex-end' }}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditChapter(chap)}
                              title="Edit Chapter"
                              aria-label={`Edit ${chap.title}`}
                              style={{ color: 'var(--physics)' }}
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteChapterClick(chap)}
                              title="Delete Chapter Safely"
                              aria-label={`Delete ${chap.title}`}
                              style={{ color: 'var(--red-600)' }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </PaperCard>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LESSONS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'lessons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {/* Chapter Selector & Add Lesson */}
          <PaperCard
            flat
            style={{
              padding: 'var(--sp-3) var(--sp-4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 'var(--sp-3)'
            }}
          >
            <div style={{ minWidth: '220px', flex: '1 1 260px' }}>
              <Field
                as="select"
                label="Select Chapter"
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

            <Button type="button" variant="primary" size="md" onClick={handleOpenAddLesson}>
              <Plus size={16} /> Add New Lesson
            </Button>
          </PaperCard>

          {/* Lessons List */}
          <PaperCard flat style={{ padding: 0, overflow: 'hidden' }}>
            {lessons.length === 0 ? (
              <div style={{ padding: 'var(--sp-5)' }}>
                <EmptyState
                  title="No lessons found in this chapter"
                  description='Click "Add New Lesson" to create one.'
                />
              </div>
            ) : (
              <div className="paper-table-wrap">
                <table className="paper-table paper-table--stack">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Hindi Title</th>
                      <th>Content Blocks</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.map((les) => (
                      <tr key={les._id}>
                        <td data-label="#" style={{ fontWeight: 700, color: 'var(--maths-ink)', fontFamily: 'var(--font-mono)' }}>
                          Lesson {les.lessonNumber}
                        </td>
                        <td data-label="Title" style={{ fontWeight: 700, color: 'var(--ink)' }}>
                          {les.title}
                        </td>
                        <td data-label="Hindi Title" style={{ color: 'var(--ink-muted)' }}>
                          {les.titleHindi || '-'}
                        </td>
                        <td data-label="Content Blocks" style={{ color: 'var(--ink-soft)' }}>
                          {les.contentBlocks?.length || 0} blocks
                        </td>
                        <td data-label="Actions" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLessonClick(les)}
                            title="Delete Lesson Safely"
                            aria-label={`Delete ${les.title}`}
                            style={{ color: 'var(--red-600)' }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </PaperCard>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SUBJECTS OVERVIEW */}
      {/* ========================================================= */}
      {activeTab === 'subjects' && (
        <PaperCard flat style={{ padding: 0, overflow: 'hidden' }}>
          <div className="paper-table-wrap">
            <table className="paper-table paper-table--stack">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject Name</th>
                  <th>Hindi Name</th>
                  <th>Class / Board</th>
                  <th>Accent Color</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub) => (
                  <tr key={sub._id}>
                    <td data-label="Code" style={{ fontWeight: 700, textTransform: 'uppercase', color: sub.color || 'var(--physics)', fontFamily: 'var(--font-mono)' }}>
                      {sub.code}
                    </td>
                    <td data-label="Subject Name" style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {sub.name}
                    </td>
                    <td data-label="Hindi Name" style={{ color: 'var(--ink-muted)' }}>
                      {sub.nameHindi}
                    </td>
                    <td data-label="Class / Board" style={{ color: 'var(--ink-soft)' }}>
                      Class {sub.classLevel} • {sub.board}
                    </td>
                    <td data-label="Accent Color">
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: sub.color }} />
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{sub.color}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PaperCard>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT CHAPTER MODAL (Task 10.2) */}
      {/* ========================================================= */}
      <Modal
        open={showChapterModal}
        onClose={() => setShowChapterModal(false)}
        title={editingChapterId ? 'Edit Chapter' : 'Add New Chapter'}
        tapeTone="yellow"
        maxWidth="540px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)' }}>
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowChapterModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="admin-chapter-form" variant="primary" size="sm">
              {editingChapterId ? 'Update Chapter' : 'Create Chapter'}
            </Button>
          </div>
        }
      >
        <form id="admin-chapter-form" onSubmit={handleSaveChapter} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <Field
            as="select"
            label="Parent Subject"
            value={chapterForm.subjectId}
            onChange={(e) => setChapterForm({ ...chapterForm, subjectId: e.target.value })}
            required
          >
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name} ({sub.nameHindi})
              </option>
            ))}
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--sp-2)' }}>
            <Field
              as="select"
              label="Board"
              value={chapterForm.board || 'CBSE'}
              onChange={(e) => setChapterForm({ ...chapterForm, board: e.target.value })}
            >
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
            </Field>
            <Field
              as="select"
              label="Class"
              value={chapterForm.classLevel || 10}
              onChange={(e) => setChapterForm({ ...chapterForm, classLevel: Number(e.target.value) })}
            >
              <option value={10}>Class 10</option>
              <option value={12}>Class 12</option>
            </Field>
            <Field
              as="select"
              label="Language"
              value={chapterForm.language || 'en'}
              onChange={(e) => setChapterForm({ ...chapterForm, language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--sp-2)' }}>
            <Field
              type="text"
              label="Title (English) *"
              required
              value={chapterForm.title}
              onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
              placeholder="e.g. Electricity"
            />
            <Field
              type="text"
              label="Title (Hindi)"
              value={chapterForm.titleHindi}
              onChange={(e) => setChapterForm({ ...chapterForm, titleHindi: e.target.value })}
              placeholder="e.g. विद्युत"
            />
          </div>

          <Field
            type="number"
            label="Chapter Number *"
            required
            min="1"
            value={chapterForm.chapterNumber}
            onChange={(e) => setChapterForm({ ...chapterForm, chapterNumber: parseInt(e.target.value, 10) || 1 })}
          />

          <Field
            as="textarea"
            label="Description (English)"
            rows={2}
            value={chapterForm.description}
            onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
          />

          <Field
            as="textarea"
            label="Description (Hindi)"
            rows={2}
            value={chapterForm.descriptionHindi}
            onChange={(e) => setChapterForm({ ...chapterForm, descriptionHindi: e.target.value })}
          />
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* ADD / EDIT LESSON MODAL */}
      {/* ========================================================= */}
      <Modal
        open={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        title={editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
        tapeTone="yellow"
        maxWidth="540px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)' }}>
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowLessonModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="admin-lesson-form" variant="primary" size="sm">
              Save Lesson
            </Button>
          </div>
        }
      >
        <form id="admin-lesson-form" onSubmit={handleSaveLesson} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <Field
            as="select"
            label="Parent Chapter"
            value={lessonForm.chapterId}
            onChange={(e) => setLessonForm({ ...lessonForm, chapterId: e.target.value })}
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
              value={lessonForm.board || 'CBSE'}
              onChange={(e) => setLessonForm({ ...lessonForm, board: e.target.value })}
            >
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
            </Field>
            <Field
              as="select"
              label="Class"
              value={lessonForm.classLevel || 10}
              onChange={(e) => setLessonForm({ ...lessonForm, classLevel: Number(e.target.value) })}
            >
              <option value={10}>Class 10</option>
              <option value={12}>Class 12</option>
            </Field>
            <Field
              as="select"
              label="Language"
              value={lessonForm.language || 'en'}
              onChange={(e) => setLessonForm({ ...lessonForm, language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--sp-2)' }}>
            <Field
              type="text"
              label="Lesson Title (English) *"
              required
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              placeholder="e.g. Ohm's Law"
            />
            <Field
              type="text"
              label="Lesson Title (Hindi)"
              value={lessonForm.titleHindi}
              onChange={(e) => setLessonForm({ ...lessonForm, titleHindi: e.target.value })}
              placeholder="e.g. ओम का नियम"
            />
          </div>

          <Field
            type="number"
            label="Lesson Number *"
            required
            min="1"
            value={lessonForm.lessonNumber}
            onChange={(e) => setLessonForm({ ...lessonForm, lessonNumber: parseInt(e.target.value, 10) || 1 })}
          />

          <Field
            as="textarea"
            label="Text Block Content"
            rows={3}
            value={lessonForm.textBlock}
            onChange={(e) => setLessonForm({ ...lessonForm, textBlock: e.target.value })}
            placeholder="Core theoretical explanation for this lesson..."
          />

          <Field
            type="text"
            label="Formula Block Content (Optional)"
            value={lessonForm.formulaBlock}
            onChange={(e) => setLessonForm({ ...lessonForm, formulaBlock: e.target.value })}
            placeholder="e.g. V = I * R"
          />
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* SAFE DELETION CONFIRMATION MODAL (Task 10.3) */}
      {/* ========================================================= */}
      <Modal
        open={Boolean(deleteConfirmModal)}
        onClose={() => setDeleteConfirmModal(null)}
        title="Confirm Safe Deletion"
        tapeTone="yellow"
        maxWidth="440px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)' }}>
            <Button type="button" variant="secondary" size="sm" onClick={() => setDeleteConfirmModal(null)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" size="sm" onClick={handleConfirmSafeDelete}>
              Yes, Delete Safely
            </Button>
          </div>
        }
      >
        {deleteConfirmModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <Tag tone="red">
                <AlertTriangle size={14} /> WARNING
              </Tag>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
              <strong>Item:</strong> &ldquo;{deleteConfirmModal.title}&rdquo;
            </p>
            <PaperCard
              flat
              style={{
                padding: 'var(--sp-3)',
                backgroundColor: 'var(--red-soft)',
                borderColor: 'var(--red-border)',
                borderLeft: '4px solid var(--red-600)',
                fontSize: '0.84rem',
                color: 'var(--red-ink)',
                lineHeight: 1.5
              }}
            >
              {deleteConfirmModal.warningText}
            </PaperCard>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', margin: 0 }}>
              Deleting will safely update remaining completion percentages and maintain database consistency.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
