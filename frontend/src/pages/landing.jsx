import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getColleges, registerUser, loginUser } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const navigate = useNavigate()
  const { login, isLoggedIn, user, logout } = useAuth()
  const [mode, setMode] = useState(null)
  const [colleges, setColleges] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [compareList, setCompareList] = useState([])
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const handleModeSelect = async (selectedMode) => {
    if (!isLoggedIn) {
      setShowAuth(true)
      return
    }
    setMode(selectedMode)
    setLoading(true)
    try {
      const res = await getColleges()
      const filtered = res.data.filter(c => c.campus_type === selectedMode)
      setColleges(filtered)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleCompare = (id) => {
    setCompareList(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 2 ? [...prev, id] : prev
    )
  }

  const handleAuth = async () => {
    setAuthError('')
    setAuthLoading(true)
    try {
      let res
      if (authMode === 'signup') {
        res = await registerUser(authForm)
        login(res.data.access_token, res.data.user)
      } else {
        const params = new URLSearchParams()
        params.append('username', authForm.email)
        params.append('password', authForm.password)
        res = await loginUser(params)
        login(res.data.access_token, res.data.user)
      }
      setShowAuth(false)
      setAuthForm({ name: '', email: '', password: '' })
    } catch (err) {
      setAuthError(err.response?.data?.detail || 'Something went wrong')
    }
    setAuthLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-3">
          Career<span className="text-blue-400">Lens</span>
        </h1>
        <p className="text-gray-400 text-lg mb-6">Your placement intelligence platform</p>

        {/* Quick Tools */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => isLoggedIn ? navigate('/predictor') : setShowAuth(true)}
            className="bg-gray-900 border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm transition"
          >
            🎯 Placement Predictor
          </button>
          <button
            onClick={() => isLoggedIn ? navigate('/resume-checker') : setShowAuth(true)}
            className="bg-gray-900 border border-gray-700 hover:border-green-500 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm transition"
          >
            📄 Resume Checker
          </button>
          <button
            onClick={() => isLoggedIn ? navigate('/compare') : setShowAuth(true)}
            className="bg-gray-900 border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm transition"
          >
            ⚖️ Compare Companies
          </button>
        </div>

        {/* Auth Button */}
        <div className="mt-4">
          {isLoggedIn ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-gray-400 text-sm">👋 Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-white text-sm underline transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Mode Select */}
      {!mode && (
        <div className="flex gap-6 mb-8">
          <button
            onClick={() => handleModeSelect('on_campus')}
            className="w-52 h-40 bg-gray-900 border border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-gray-800 transition-all cursor-pointer"
          >
            <span className="text-4xl">🏫</span>
            <span className="text-lg font-semibold">On Campus</span>
            <span className="text-gray-400 text-sm text-center px-4">College placement drives</span>
          </button>

          <button
            onClick={() => handleModeSelect('off_campus')}
            className="w-52 h-40 bg-gray-900 border border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-purple-500 hover:bg-gray-800 transition-all cursor-pointer"
          >
            <span className="text-4xl">💼</span>
            <span className="text-lg font-semibold">Off Campus</span>
            <span className="text-gray-400 text-sm text-center px-4">Independent applications</span>
          </button>
        </div>
      )}

      {/* College List */}
      {mode && (
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => { setMode(null); setColleges([]); setSearch(''); setCompareList([]) }}
              className="text-gray-400 hover:text-white transition"
            >
              Back
            </button>
            <h2 className="text-xl font-semibold">
              {mode === 'on_campus' ? '🏫 On Campus' : '💼 Off Campus'} Colleges
            </h2>
          </div>

          <input
            type="text"
            placeholder="Search your college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
          />

          {loading && <p className="text-gray-400 text-center">Loading...</p>}

          <div className="flex flex-col gap-3">
            {filtered.map(college => (
              <div key={college.id} className="flex gap-2 items-stretch">
                <button
                  onClick={() => navigate("/dashboard/" + college.id)}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-left hover:border-blue-500 hover:bg-gray-800 transition-all"
                >
                  <div className="font-semibold text-white">{college.name}</div>
                  <div className="text-gray-400 text-sm mt-1">📍 {college.location}</div>
                </button>
                <button
                  onClick={() => toggleCompare(college.id)}
                  className={"px-3 rounded-xl border transition text-xs font-medium " + (
                    compareList.includes(college.id)
                      ? "bg-purple-700 border-purple-600 text-white"
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:border-purple-500"
                  )}
                >
                  {compareList.includes(college.id) ? "✓" : "+"}
                </button>
              </div>
            ))}

            {compareList.length === 2 && (
              <button
                onClick={() => navigate("/college-compare?ids=" + compareList.join(','))}
                className="w-full mt-2 bg-purple-900 border border-purple-700 hover:bg-purple-800 text-purple-300 px-4 py-3 rounded-xl text-sm font-medium transition"
              >
                Compare Selected Colleges →
              </button>
            )}

            {!loading && filtered.length === 0 && mode && (
              <p className="text-gray-500 text-center mt-4">No colleges found</p>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button
                onClick={() => { setShowAuth(false); setAuthError('') }}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
              <button
                onClick={() => { setAuthMode('login'); setAuthError('') }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${authMode === 'login' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
              >
                Login
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setAuthError('') }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${authMode === 'signup' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Error */}
            {authError && (
              <p className="text-red-400 text-sm mt-3">{authError}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleAuth}
              disabled={authLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-3 rounded-lg font-medium transition"
            >
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}