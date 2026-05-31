import { Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard/:collegeId" element={<Dashboard />} />
      <Route path="/company/:companyId" element={<Company />} />
      <Route path="/company/:companyId/roadmap" element={<Roadmap />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/college-compare" element={<CollegeCompare />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/predictor" element={<Predictor />} />
      <Route path="/resume-checker" element={<ResumeChecker />} />
    </Routes>
  )
}

export default App