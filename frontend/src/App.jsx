import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Security
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SubjectsPage from './pages/SubjectsPage';
import ChapterPage from './pages/ChapterPage';
import LessonReaderPage from './pages/LessonReaderPage';
import PracticeTestPage from './pages/PracticeTestPage';
import ResultsPage from './pages/ResultsPage';
import VirtualLabPage from './pages/VirtualLabPage';
import ProfilePage from './pages/ProfilePage';
import SaarthiPage from './features/mentor/SaarthiPage';
import NotesPage from './features/notes/NotesPage';
import VirtualLearningPage from './features/virtual-learning/VirtualLearningPage';
import TopicViewerPage from './features/virtual-learning/TopicViewerPage';
import DiagramsExplorerPage from './pages/DiagramsExplorerPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import CommunityPage from './pages/CommunityPage';
import PrivacyPage from './pages/PrivacyPage';
import HumanHeartPage from './pages/HumanHeartPage';

// Interactive STEM Learning Hub & Subject Modules
import LearnPortalPage from './pages/learn/LearnPortalPage';
import SubjectHubPage from './pages/learn/SubjectHubPage';
import MuscularSystemPage from './pages/learn/biology/MuscularSystemPage';
import RespirationPage from './pages/learn/biology/RespirationPage';
import LightOpticsPage from './pages/learn/physics/LightOpticsPage';
import WavesSoundPage from './pages/learn/physics/WavesSoundPage';
import NewtonsLawsPage from './pages/learn/physics/NewtonsLawsPage';
import MolecularExplorerPage from './pages/learn/chemistry/MolecularExplorerPage';
import TrigonometryLabPage from './pages/learn/mathematics/TrigonometryLabPage';
import ConicSectionsLabPage from './pages/learn/mathematics/ConicSectionsLabPage';

// Admin Pages (Phase 10)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Authenticated Student Pages with Persistent Mobile Bottom Navigation */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/subjects/:subjectId/chapters/:chapterId" element={<ChapterPage />} />
        <Route path="/lessons/:lessonId" element={<LessonReaderPage />} />
        <Route path="/practice/:chapterId" element={<PracticeTestPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/mentor" element={<SaarthiPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/virtual-learning" element={<VirtualLearningPage />} />
        <Route path="/virtual-learning/:topicSlug" element={<TopicViewerPage />} />

        {/* Master STEM Learning Portal & Subject Hubs */}
        <Route path="/learn" element={<LearnPortalPage />} />
        <Route path="/learn/:subjectId" element={<SubjectHubPage />} />

        {/* Biology Modules */}
        <Route path="/learn/biology/human-heart" element={<HumanHeartPage />} />
        <Route path="/learn/biology/muscular-system" element={<MuscularSystemPage />} />
        <Route path="/learn/biology/respiration" element={<RespirationPage />} />

        {/* Physics Modules */}
        <Route path="/learn/physics/light-and-optics" element={<LightOpticsPage />} />
        <Route path="/learn/physics/waves-and-sound" element={<WavesSoundPage />} />
        <Route path="/learn/physics/newtons-laws" element={<NewtonsLawsPage />} />

        {/* Chemistry Modules */}
        <Route path="/learn/chemistry/molecular-explorer" element={<MolecularExplorerPage />} />

        {/* Mathematics Modules */}
        <Route path="/learn/mathematics/trigonometry" element={<TrigonometryLabPage />} />
        <Route path="/learn/mathematics/conic-sections" element={<ConicSectionsLabPage />} />
        <Route path="/diagrams" element={<DiagramsExplorerPage />} />
        <Route path="/videos" element={<VideoPlayerPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/labs" element={<VirtualLabPage />} />
        <Route path="/labs/:labId" element={<VirtualLabPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Route>

      {/* Role-Gated Admin Pages (role: 'admin') */}
      <Route
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/content" element={<AdminContentPage />} />
        <Route path="/admin/questions" element={<AdminQuestionsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

