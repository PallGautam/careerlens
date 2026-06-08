import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCompanies, generatePrepPlan } from '../api/api'

export default function PrepPlan() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [form, setForm] = useState({
    cgpa: '',
    skills: '',
    college_id: '1',
    company_id: '',
    days_available: '60'
  })
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCompanies().then(res => setCompanies(res.data)).catch(() => {})
  }, [])

  const handleGenerate = async () => {
    if (!form.cgpa || !form.skills || !form.company_id) {
      setError('Please fill in all fields')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await generatePrepPlan({
        cgpa: parseFloat(form.cgpa),
        skills: form.skills.split(',').map(s => s.trim()),
        college_id: parseInt(form.college_id),
        company_id: parseInt(form.company_id)
      })
      setPlan(res.data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  const phaseColors = [
    { border: 'border-pink-300/30', badge: 'bg-pink-300/10 text-pink-200', goal: 'text-pink-300' },
    { border: 'border-purple-300/30', badge: 'bg-purple-300/10 text-purple-200', goal: 'text-purple-300' },
    { border: 'border-sky-300/30', badge: 'bg-sky-300/10 text-sky-200', goal: 'text-sky-300' },
  ]

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white px-6 py-8 max-w-3xl mx-auto">

      <style>{`
        @keyframes bounce-in { 0%{transform:scale(0.95);opacity:0} 60%{transform:scale(1.02)} 100%{transform:scale(1);opacity:1} }
        .card-in { animation: bounce-in 0.4s ease both; }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white transition text-sm">← Back</button>
        <div>
          <h1 className="text-2xl font-extrabold">🗓️ 30/60/90 Day Prep Plan</h1>
          <p className="text-slate-400 text-sm mt-1">Get a personalized roadmap to your target company</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Your Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">Your CGPA</label>
            <input
              type="number" step="0.1" min="0" max="10"
              placeholder="e.g. 7.5"
              value={form.cgpa}
              onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 text-sm"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">Target Company</label>
            <select
              value={form.company_id}
              onChange={(e) => setForm({ ...form, company_id: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400/50 text-sm"
            >
              <option value="">Select company</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-slate-400 text-xs mb-1.5 block">Your Skills</label>
            <input
              type="text"
              placeholder="e.g. Python, DSA, React, SQL"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 text-sm"
            />
            <p className="text-slate-600 text-xs mt-1">Separate with commas</p>
          </div>
        </div>

        {/* Duration Selector */}
        <div className="mb-5">
          <label className="text-slate-400 text-xs mb-2 block">How much time do you have?</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '30', label: '30 Days', desc: 'Final sprint' },
              { value: '60', label: '60 Days', desc: 'Focused prep' },
              { value: '90', label: '90 Days', desc: 'Full roadmap' },
            ].map(d => (
              <button key={d.value}
                onClick={() => setForm({ ...form, days_available: d.value })}
                className={`p-3 rounded-xl border text-center transition-all ${
                  form.days_available === d.value
                    ? 'bg-purple-400/15 border-purple-400/50 text-purple-200'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="font-bold text-sm">{d.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all hover:shadow-[0_8px_24px_rgba(192,132,252,0.35)]"
        >
          {loading ? 'Building your plan...' : '✨ Generate My Plan'}
        </button>
      </div>

      {/* Plan Result */}
      {plan && (
        <div className="card-in space-y-4">
          {/* Summary */}
          <div className="bg-white/[0.03] border border-purple-300/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-bold text-white">{plan.duration}-Day Prep Plan</div>
                <div className="text-slate-400 text-sm">{plan.summary}</div>
              </div>
            </div>
          </div>

          {/* Phases */}
          {plan.phases.map((phase, i) => {
            const colors = phaseColors[i % phaseColors.length]
            return (
              <div key={i} className={`bg-white/[0.03] border ${colors.border} rounded-2xl p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                    Phase {phase.phase}
                  </span>
                  <h3 className="font-bold text-white text-sm">{phase.label}</h3>
                </div>
                <p className={`text-sm italic mb-4 ${colors.goal}`}>{phase.goal}</p>
                <div className="space-y-2">
                  {phase.tasks.map((task, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5 text-sm flex-shrink-0">✓</span>
                      <span className="text-slate-300 text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}