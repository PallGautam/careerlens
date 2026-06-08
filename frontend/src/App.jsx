import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/landing'
import Dashboard from './pages/dashboard'
import Company from './pages/company'
import Roadmap from './pages/roadmap'
import Compare from './pages/compare'
import Bookmarks from './pages/bookmarks'
import CollegeCompare from './pages/collegecompare'
import Feed from './pages/feed'
import Predictor from './pages/predictor'
import ResumeChecker from './pages/ResumeChecker'
import PrepPlan from './pages/PrepPlan'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard/:collegeId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/company/:companyId" element={<ProtectedRoute><Company /></ProtectedRoute>} />
      <Route path="/company/:companyId/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
      <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
      <Route path="/college-compare" element={<ProtectedRoute><CollegeCompare /></ProtectedRoute>} />
      <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/predictor" element={<ProtectedRoute><Predictor /></ProtectedRoute>} />
      <Route path="/resume-checker" element={<ProtectedRoute><ResumeChecker /></ProtectedRoute>} />
      <Route path="/prep-plan" element={<ProtectedRoute><PrepPlan /></ProtectedRoute>} />
    </Routes>
  )
}

export default App