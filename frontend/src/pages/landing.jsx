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
    if (!isLoggedIn) { setShowAuth(true); return }
    setMode(selectedMode)
    setLoading(true)
    try {
      const res = await getColleges()
      setColleges(res.data.filter(c => c.campus_type === selectedMode))
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleCompare = (id) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(i => i !== id)
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

  const features = [
    { icon: '🎯', title: 'Placement Predictor', desc: 'Know your chances before you apply. Scored on CGPA, skills, and alumni history.', tag: 'AI-powered', card: 'fc1', iconClass: 'i1', tagClass: 't1c' },
    { icon: '📄', title: 'Resume Checker', desc: 'Instant feedback on weak phrases, missing sections, and skill gaps.', tag: 'Instant feedback', card: 'fc2', iconClass: 'i2', tagClass: 't2c' },
    { icon: '🗓️', title: '30/60/90 Day Plan', desc: 'A personalized prep roadmap based on your profile and target company.', tag: 'Personalized', card: 'fc3', iconClass: 'i3', tagClass: 't3c' },
    { icon: '⚖️', title: 'Compare Companies', desc: 'Side-by-side salary, culture, growth, and pros/cons for top recruiters.', tag: 'Data-driven', card: 'fc4', iconClass: 'i4', tagClass: 't4c' },
    { icon: '📊', title: 'Placement Dashboard', desc: "Live stats, trends, and KPIs for your college's placement history.", tag: 'Real data', card: 'fc5', iconClass: 'i5', tagClass: 't5c' },
    { icon: '🔖', title: 'Bookmarks & Feed', desc: 'Save companies, track alumni stories, and stay updated on placement news.', tag: 'Stay informed', card: 'fc6', iconClass: 'i6', tagClass: 't6c' },
  ]

  const cardStyles = {
    fc1: 'hover:border-pink-500/40 hover:shadow-[0_0_32px_rgba(236,72,153,0.12)]',
    fc2: 'hover:border-emerald-500/40 hover:shadow-[0_0_32px_rgba(16,185,129,0.12)]',
    fc3: 'hover:border-amber-500/40 hover:shadow-[0_0_32px_rgba(245,158,11,0.12)]',
    fc4: 'hover:border-violet-500/40 hover:shadow-[0_0_32px_rgba(139,92,246,0.12)]',
    fc5: 'hover:border-cyan-500/40 hover:shadow-[0_0_32px_rgba(6,182,212,0.12)]',
    fc6: 'hover:border-orange-500/40 hover:shadow-[0_0_32px_rgba(249,115,22,0.12)]',
  }

  const iconStyles = {
    i1: { bg: 'bg-pink-500/10 border border-pink-500/25', glow: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5),0_0_40px_rgba(236,72,153,0.2)]' },
    i2: { bg: 'bg-emerald-500/10 border border-emerald-500/25', glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5),0_0_40px_rgba(16,185,129,0.2)]' },
    i3: { bg: 'bg-amber-500/10 border border-amber-500/25', glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5),0_0_40px_rgba(245,158,11,0.2)]' },
    i4: { bg: 'bg-violet-500/10 border border-violet-500/25', glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5),0_0_40px_rgba(139,92,246,0.2)]' },
    i5: { bg: 'bg-cyan-500/10 border border-cyan-500/25', glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(6,182,212,0.2)]' },
    i6: { bg: 'bg-orange-500/10 border border-orange-500/25', glow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.5),0_0_40px_rgba(249,115,22,0.2)]' },
  }

  const tagStyles = {
    t1c: 'text-pink-300 bg-pink-500/10',
    t2c: 'text-emerald-300 bg-emerald-500/10',
    t3c: 'text-amber-300 bg-amber-500/10',
    t4c: 'text-violet-300 bg-violet-500/10',
    t5c: 'text-cyan-300 bg-cyan-500/10',
    t6c: 'text-orange-300 bg-orange-500/10',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* Hero */}
      <div className="text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 text-pink-300 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
          Now live — placement intelligence
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
          <span className="text-white">Your career starts</span><br />
          <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            with CareerLens
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed mb-12">
          Track placements, compare companies, predict your chances — all in one place.
        </p>

        {/* Quick Tools */}
        <div className="flex gap-3 justify-center flex-wrap mb-4">
          <button
            onClick={() => isLoggedIn ? navigate('/predictor') : setShowAuth(true)}
            className="flex items-center gap-2 bg-white/4 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-pink-500/12 hover:border-pink-500/40 hover:text-pink-300 hover:-translate-y-0.5"
          >
            🎯 Placement Predictor
          </button>
          <button
            onClick={() => isLoggedIn ? navigate('/resume-checker') : setShowAuth(true)}
            className="flex items-center gap-2 bg-white/4 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-emerald-500/12 hover:border-emerald-500/40 hover:text-emerald-300 hover:-translate-y-0.5"
          >
            📄 Resume Checker
          </button>
          <button
            onClick={() => isLoggedIn ? navigate('/compare') : setShowAuth(true)}
            className="flex items-center gap-2 bg-white/4 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-amber-500/12 hover:border-amber-500/40 hover:text-amber-300 hover:-translate-y-0.5"
          >
            ⚖️ Compare Companies
          </button>
        </div>

        {/* Auth */}
        <div className="mt-4 mb-16">
          {isLoggedIn ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-slate-400 text-sm">👋 Welcome, {user.name}</span>
              <button onClick={logout} className="text-slate-500 hover:text-white text-sm underline transition">Logout</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(236,72,153,0.35)]"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="text-center mb-6">
        <p className="text-slate-600 text-xs font-medium tracking-widest uppercase">What you can do</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-6 mb-16">
        {features.map((f) => (
          <div
            key={f.title}
            className={`group bg-white/[0.03] border border-white/8 rounded-2xl p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${cardStyles[f.card]}`}
          >
            <div className={`w-13 h-13 rounded-xl flex items-center justify-center text-2xl mb-4 transition-all duration-300 ${iconStyles[f.iconClass].bg} ${iconStyles[f.iconClass].glow}`}
              style={{ width: '52px', height: '52px' }}>
              {f.icon}
            </div>
            <div className="text-[15px] font-semibold text-slate-100 mb-2">{f.title}</div>
            <div className="text-[13px] text-slate-500 leading-relaxed">{f.desc}</div>
            <span className={`inline-block mt-3 text-[11px] px-2.5 py-1 rounded-full ${tagStyles[f.tagClass]}`}>
              {f.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Campus Select */}
      {!mode && (
        <>
          <div className="text-center mb-6">
            <p className="text-slate-600 text-xs font-medium tracking-widest uppercase">Choose your path</p>
          </div>
          <div className="flex gap-4 justify-center px-6 mb-16">
            <button
              onClick={() => handleModeSelect('on_campus')}
              className="group flex-1 max-w-[240px] bg-white/[0.03] border border-white/8 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 hover:shadow-[0_0_32px_rgba(6,182,212,0.12)]"
            >
              <span className="text-4xl mb-4 block transition-all group-hover:[filter:drop-shadow(0_0_12px_rgba(6,182,212,0.6))]">🏫</span>
              <div className="text-base font-semibold text-slate-100 mb-2">On Campus</div>
              <div className="text-sm text-slate-500">College placement drives</div>
            </button>
            <button
              onClick={() => handleModeSelect('off_campus')}
              className="group flex-1 max-w-[240px] bg-white/[0.03] border border-white/8 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-[0_0_32px_rgba(139,92,246,0.12)]"
            >
              <span className="text-4xl mb-4 block transition-all group-hover:[filter:drop-shadow(0_0_12px_rgba(139,92,246,0.6))]">💼</span>
              <div className="text-base font-semibold text-slate-100 mb-2">Off Campus</div>
              <div className="text-sm text-slate-500">Independent applications</div>
            </button>
          </div>
        </>
      )}

      {/* College List */}
      {mode && (
        <div className="w-full max-w-md mx-auto px-6 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setMode(null); setColleges([]); setSearch(''); setCompareList([]) }}
              className="text-slate-400 hover:text-white transition">Back</button>
            <h2 className="text-xl font-semibold">
              {mode === 'on_campus' ? '🏫 On Campus' : '💼 Off Campus'} Colleges
            </h2>
          </div>
          <input
            type="text" placeholder="Search your college..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 mb-4"
          />
          {loading && <p className="text-slate-400 text-center">Loading...</p>}
          <div className="flex flex-col gap-3">
            {filtered.map(college => (
              <div key={college.id} className="flex gap-2 items-stretch">
                <button
                  onClick={() => navigate('/dashboard/' + college.id)}
                  className="flex-1 bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4 text-left hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all"
                >
                  <div className="font-semibold text-white">{college.name}</div>
                  <div className="text-slate-400 text-sm mt-1">📍 {college.location}</div>
                </button>
                <button
                  onClick={() => toggleCompare(college.id)}
                  className={'px-3 rounded-xl border transition text-xs font-medium ' + (
                    compareList.includes(college.id)
                      ? 'bg-violet-700 border-violet-600 text-white'
                      : 'bg-white/[0.03] border-white/8 text-slate-400 hover:border-violet-500/40'
                  )}
                >
                  {compareList.includes(college.id) ? '✓' : '+'}
                </button>
              </div>
            ))}
            {compareList.length === 2 && (
              <button
                onClick={() => navigate('/college-compare?ids=' + compareList.join(','))}
                className="w-full mt-2 bg-violet-900/50 border border-violet-700 hover:bg-violet-800/50 text-violet-300 px-4 py-3 rounded-xl text-sm font-medium transition"
              >
                Compare Selected Colleges →
              </button>
            )}
            {!loading && filtered.length === 0 && (
              <p className="text-slate-500 text-center mt-4">No colleges found</p>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="text-center mb-6">
        <p className="text-slate-600 text-xs font-medium tracking-widest uppercase">By the numbers</p>
      </div>
      <div className="flex gap-8 justify-center px-6 pb-16 flex-wrap items-center">
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">6+</div>
          <div className="text-xs text-slate-500 mt-1">Companies tracked</div>
        </div>
        <div className="w-px h-12 bg-white/8" />
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">3</div>
          <div className="text-xs text-slate-500 mt-1">Colleges indexed</div>
        </div>
        <div className="w-px h-12 bg-white/8" />
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">9</div>
          <div className="text-xs text-slate-500 mt-1">Powerful features</div>
        </div>
        <div className="w-px h-12 bg-white/8" />
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">100%</div>
          <div className="text-xs text-slate-500 mt-1">Free to use</div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button onClick={() => { setShowAuth(false); setAuthError('') }}
                className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setAuthMode('login'); setAuthError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${authMode === 'login' ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' : 'text-slate-400'}`}
              >Login</button>
              <button
                onClick={() => { setAuthMode('signup'); setAuthError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${authMode === 'signup' ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' : 'text-slate-400'}`}
              >Sign Up</button>
            </div>
            <div className="space-y-3">
              {authMode === 'signup' && (
                <input type="text" placeholder="Full Name" value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50" />
              )}
              <input type="email" placeholder="Email" value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50" />
              <input type="password" placeholder="Password" value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50" />
            </div>
            {authError && <p className="text-red-400 text-sm mt-3">{authError}</p>}
            <button onClick={handleAuth} disabled={authLoading}
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-violet-500 hover:shadow-[0_0_24px_rgba(236,72,153,0.3)] disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all">
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}