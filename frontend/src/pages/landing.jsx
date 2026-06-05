import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getColleges, registerUser, loginUser, getCompanies } from '../api/api'
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
  const [alert, setAlert] = useState(null)
  const [alertVisible, setAlertVisible] = useState(false)
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    getCompanies().then(res => setCompanies(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (companies.length === 0) return
    const showAlert = () => {
      const company = companies[Math.floor(Math.random() * companies.length)]
      setAlert(company)
      setAlertVisible(true)
      setTimeout(() => setAlertVisible(false), 5000)
    }
    const timer = setTimeout(showAlert, 3000)
    const interval = setInterval(showAlert, 15000)
    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [companies])

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
    { icon: '🎯', title: 'Placement Predictor', desc: 'Know your chances before you apply. Scored on CGPA, skills & alumni history.', tag: '✨ AI-powered', border: 'hover:border-pink-300/50', shadow: 'hover:shadow-[0_12px_40px_rgba(249,168,212,0.15)]', iconBg: 'bg-pink-300/10 border-pink-300/25', iconGlow: 'group-hover:shadow-[0_0_18px_rgba(249,168,212,0.5)]', tagColor: 'text-pink-200 bg-pink-300/10' },
    { icon: '📄', title: 'Resume Checker', desc: 'Instant feedback on weak phrases, missing sections & skill gaps.', tag: '⚡ Instant feedback', border: 'hover:border-green-300/50', shadow: 'hover:shadow-[0_12px_40px_rgba(134,239,172,0.15)]', iconBg: 'bg-green-300/10 border-green-300/25', iconGlow: 'group-hover:shadow-[0_0_18px_rgba(134,239,172,0.5)]', tagColor: 'text-green-200 bg-green-300/10' },
    { icon: '🗓️', title: '30/60/90 Day Plan', desc: 'A personalized prep roadmap based on your profile & target company.', tag: '🎯 Personalized', border: 'hover:border-orange-300/50', shadow: 'hover:shadow-[0_12px_40px_rgba(253,186,116,0.15)]', iconBg: 'bg-orange-300/10 border-orange-300/25', iconGlow: 'group-hover:shadow-[0_0_18px_rgba(253,186,116,0.5)]', tagColor: 'text-orange-200 bg-orange-300/10' },
    { icon: '⚖️', title: 'Compare Companies', desc: 'Side-by-side salary, culture, growth & pros/cons for top recruiters.', tag: '📊 Data-driven', border: 'hover:border-purple-300/50', shadow: 'hover:shadow-[0_12px_40px_rgba(192,132,252,0.15)]', iconBg: 'bg-purple-300/10 border-purple-300/25', iconGlow: 'group-hover:shadow-[0_0_18px_rgba(192,132,252,0.5)]', tagColor: 'text-purple-200 bg-purple-300/10' },
    { icon: '📊', title: 'Placement Dashboard', desc: "Live stats, trends & KPIs for your college's placement history.", tag: '🔥 Real data', border: 'hover:border-sky-300/50', shadow: 'hover:shadow-[0_12px_40px_rgba(125,211,252,0.15)]', iconBg: 'bg-sky-300/10 border-sky-300/25', iconGlow: 'group-hover:shadow-[0_0_18px_rgba(125,211,252,0.5)]', tagColor: 'text-sky-200 bg-sky-300/10' },
    { icon: '🔖', title: 'Bookmarks & Feed', desc: 'Save companies, track alumni stories & stay updated on placement news.', tag: '💫 Stay informed', border: 'hover:border-yellow-300/50', shadow: 'hover:shadow-[0_12px_40px_rgba(253,224,71,0.15)]', iconBg: 'bg-yellow-300/10 border-yellow-300/25', iconGlow: 'group-hover:shadow-[0_0_18px_rgba(253,224,71,0.5)]', tagColor: 'text-yellow-200 bg-yellow-300/10' },
  ]

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white overflow-x-hidden">

      <style>{`
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
        @keyframes bounce-in { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes pulse-soft { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes slide-in { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes slide-out { from{transform:translateX(0);opacity:1} to{transform:translateX(120%);opacity:0} }
        .shimmer-text { background: linear-gradient(135deg, #f9a8d4, #c084fc, #86efac, #7dd3fc); background-size: 300% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 4s linear infinite; }
        .float-emoji { animation: float 3s ease-in-out infinite; }
        .float-emoji-delay { animation: float 3s ease-in-out infinite; animation-delay: 0.5s; }
        .bounce-hero { animation: bounce-in 0.6s ease both; }
        .group:hover .wiggle-on-hover { animation: wiggle 0.5s ease; }
        .alert-in { animation: slide-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .alert-out { animation: slide-out 0.3s ease-in both; }
      `}</style>

      {/* Hero */}
      <div className="bounce-hero text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-purple-300/10 border border-purple-300/30 text-purple-200 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" style={{ animation: 'pulse-soft 2s infinite' }} />
          ✨ Now live — placement intelligence
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          <span className="text-white">Your career starts</span><br />
          <span className="shimmer-text">with CareerLens ✦</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed mb-12">
          Track placements, compare companies, predict your chances — all in one place. 🚀
        </p>

        {/* Quick Tools */}
        <div className="flex gap-3 justify-center flex-wrap mb-5">
          {[
            { label: '🎯 Placement Predictor', hover: 'hover:bg-pink-300/10 hover:border-pink-300/40 hover:text-pink-200 hover:shadow-[0_4px_20px_rgba(249,168,212,0.2)]', path: '/predictor' },
            { label: '📄 Resume Checker', hover: 'hover:bg-green-300/10 hover:border-green-300/40 hover:text-green-200 hover:shadow-[0_4px_20px_rgba(134,239,172,0.2)]', path: '/resume-checker' },
            { label: '⚖️ Compare Companies', hover: 'hover:bg-yellow-300/10 hover:border-yellow-300/40 hover:text-yellow-200 hover:shadow-[0_4px_20px_rgba(253,224,71,0.2)]', path: '/compare' },
          ].map(btn => (
            <button key={btn.label}
              onClick={() => isLoggedIn ? navigate(btn.path) : setShowAuth(true)}
              className={`flex items-center gap-2 bg-white/[0.04] border border-white/10 text-slate-300 px-4 py-2.5 rounded-full text-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] ${btn.hover}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Auth */}
        <div className="mt-5 mb-16">
          {isLoggedIn ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-slate-400 text-sm">👋 Welcome back, {user.name}!</span>
              <button onClick={logout} className="text-slate-500 hover:text-white text-sm underline transition">Logout</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full text-sm font-bold transition-all hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(192,132,252,0.4)]"
              style={{ boxShadow: '0 4px 24px rgba(192,132,252,0.25)' }}
            >
              ✨ Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="text-center mb-6">
        <p className="text-slate-600 text-xs font-semibold tracking-widest uppercase">✦ what you can do ✦</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-6 mb-16">
        {features.map((f) => (
          <div key={f.title}
            className={`group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] ${f.border} ${f.shadow}`}
          >
            <div className={`wiggle-on-hover w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-2xl mb-4 border transition-all duration-300 ${f.iconBg} ${f.iconGlow}`}>
              {f.icon}
            </div>
            <div className="text-[15px] font-bold text-slate-100 mb-2">{f.title}</div>
            <div className="text-[12.5px] text-slate-500 leading-relaxed">{f.desc}</div>
            <span className={`inline-block mt-3 text-[11px] px-2.5 py-1 rounded-full font-medium ${f.tagColor}`}>
              {f.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Campus Select */}
      {!mode && (
        <>
          <div className="text-center mb-6">
            <p className="text-slate-600 text-xs font-semibold tracking-widest uppercase">✦ choose your path ✦</p>
          </div>
          <div className="flex gap-4 justify-center px-6 mb-16">
            <button
              onClick={() => handleModeSelect('on_campus')}
              className="group flex-1 max-w-[220px] bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-sky-300/50 hover:shadow-[0_12px_40px_rgba(125,211,252,0.15)]"
            >
              <span className="float-emoji text-4xl mb-4 block">🏫</span>
              <div className="text-base font-bold text-slate-100 mb-2">On Campus</div>
              <div className="text-sm text-slate-500">College placement drives</div>
            </button>
            <button
              onClick={() => handleModeSelect('off_campus')}
              className="group flex-1 max-w-[220px] bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-purple-300/50 hover:shadow-[0_12px_40px_rgba(192,132,252,0.15)]"
            >
              <span className="float-emoji-delay text-4xl mb-4 block">💼</span>
              <div className="text-base font-bold text-slate-100 mb-2">Off Campus</div>
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
            <h2 className="text-xl font-bold">
              {mode === 'on_campus' ? '🏫 On Campus' : '💼 Off Campus'} Colleges
            </h2>
          </div>
          <input type="text" placeholder="Search your college..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 mb-4"
          />
          {loading && <p className="text-slate-400 text-center">Loading...</p>}
          <div className="flex flex-col gap-3">
            {filtered.map(college => (
              <div key={college.id} className="flex gap-2 items-stretch">
                <button onClick={() => navigate('/dashboard/' + college.id)}
                  className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-4 text-left hover:border-sky-300/40 hover:bg-white/[0.05] transition-all">
                  <div className="font-bold text-white">{college.name}</div>
                  <div className="text-slate-400 text-sm mt-1">📍 {college.location}</div>
                </button>
                <button onClick={() => toggleCompare(college.id)}
                  className={'px-3 rounded-2xl border transition text-xs font-medium ' + (
                    compareList.includes(college.id)
                      ? 'bg-purple-400/20 border-purple-400/50 text-purple-200'
                      : 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:border-purple-400/40'
                  )}>
                  {compareList.includes(college.id) ? '✓' : '+'}
                </button>
              </div>
            ))}
            {compareList.length === 2 && (
              <button onClick={() => navigate('/college-compare?ids=' + compareList.join(','))}
                className="w-full mt-2 bg-purple-400/10 border border-purple-400/30 hover:bg-purple-400/20 text-purple-300 px-4 py-3 rounded-2xl text-sm font-medium transition">
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
        <p className="text-slate-600 text-xs font-semibold tracking-widest uppercase">✦ by the numbers ✦</p>
      </div>
      <div className="flex gap-8 justify-center px-6 pb-16 flex-wrap items-center">
        {[
          { num: '6+', label: 'Companies tracked', gradient: 'from-pink-300 to-purple-300' },
          { num: '3', label: 'Colleges indexed', gradient: 'from-green-300 to-sky-300' },
          { num: '9', label: 'Powerful features', gradient: 'from-yellow-300 to-orange-300' },
          { num: '100%', label: 'Free to use', gradient: 'from-purple-300 to-sky-300' },
        ].map((s, i) => (
          <>
            <div key={s.label} className="text-center">
              <div className={`text-3xl font-extrabold bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{s.num}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
            {i < 3 && <div key={i} className="w-px h-10 bg-white/[0.07]" />}
          </>
        ))}
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#111118] border border-white/10 rounded-3xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {authMode === 'login' ? '👋 Welcome Back' : '✨ Create Account'}
              </h2>
              <button onClick={() => { setShowAuth(false); setAuthError('') }}
                className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="flex bg-white/5 rounded-2xl p-1 mb-6">
              <button onClick={() => { setAuthMode('login'); setAuthError('') }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${authMode === 'login' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white' : 'text-slate-400'}`}>
                Login
              </button>
              <button onClick={() => { setAuthMode('signup'); setAuthError('') }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${authMode === 'signup' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white' : 'text-slate-400'}`}>
                Sign Up
              </button>
            </div>
            <div className="space-y-3">
              {authMode === 'signup' && (
                <input type="text" placeholder="Full Name" value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50" />
              )}
              <input type="email" placeholder="Email" value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50" />
              <input type="password" placeholder="Password" value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50" />
            </div>
            {authError && <p className="text-red-400 text-sm mt-3">{authError}</p>}
            <button onClick={handleAuth} disabled={authLoading}
              className="w-full mt-4 bg-gradient-to-r from-pink-400 to-purple-400 disabled:opacity-50 text-white py-3 rounded-2xl font-bold transition-all hover:shadow-[0_8px_24px_rgba(192,132,252,0.35)]">
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </div>
        </div>
      )}

      {/* Hiring Alert Popup */}
      {alert && (
        <div className={`fixed bottom-6 right-6 z-50 max-w-[300px] ${alertVisible ? 'alert-in' : 'alert-out'}`}>
          <div className="bg-[#111118] border border-purple-400/30 rounded-2xl p-4 shadow-[0_8px_32px_rgba(192,132,252,0.2)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔥</span>
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Live Hiring Alert</span>
              </div>
              <button onClick={() => setAlertVisible(false)}
                className="text-slate-500 hover:text-white text-lg leading-none transition flex-shrink-0">×</button>
            </div>
            <p className="text-white font-bold text-sm mb-1">{alert.name} is actively hiring!</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Avg package <span className="text-green-300 font-semibold">{alert.avg_package_lpa} LPA</span> · {alert.roles_offered}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Drive open now</span>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}