import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkResume } from '../api/api'

export default function ResumeChecker() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [targetRole, setTargetRole] = useState('software')
  const [result, setResult] = useState(null)
  const [aiFeedback, setAiFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const handleCheck = async () => {
    if (!text.trim() || text.trim().split(' ').length < 20) {
      alert('Please paste at least a few lines of your resume text')
      return
    }
    setLoading(true)
    setAiFeedback(null)
    try {
      const res = await checkResume({ text, target_role: targetRole })
      setResult(res.data)
      // Auto-trigger AI feedback after ATS score
      generateAIFeedback(res.data.score)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const generateAIFeedback = async (atsScore) => {
    setAiLoading(true)
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an expert career coach and resume reviewer. Analyze this resume for a ${targetRole} role.

The automated ATS system gave this resume a score of ${atsScore}/100.

Resume text:
${text}

Provide feedback in this EXACT JSON format (no markdown, no backticks, just raw JSON):
{
  "overall_impression": "2-3 sentence honest overall assessment",
  "top_strengths": ["strength 1", "strength 2", "strength 3"],
  "critical_improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "ats_tips": ["specific ATS optimization tip 1", "specific ATS optimization tip 2"],
  "interview_readiness": "Low/Medium/High",
  "one_liner": "One punchy sentence summary of what this candidate needs to focus on most"
}`
          }]
        })
      })
      const data = await response.json()
      const rawText = data.content[0].text
      const clean = rawText.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setAiFeedback(parsed)
    } catch (err) {
      console.error('AI feedback error:', err)
      setAiFeedback({ error: true })
    }
    setAiLoading(false)
  }

  const colorMap = {
    green:  { bar: 'bg-green-500',  text: 'text-green-400',  badge: 'bg-green-900/50 text-green-300 border border-green-700' },
    blue:   { bar: 'bg-blue-500',   text: 'text-blue-400',   badge: 'bg-blue-900/50 text-blue-300 border border-blue-700' },
    yellow: { bar: 'bg-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' },
    red:    { bar: 'bg-red-500',    text: 'text-red-400',    badge: 'bg-red-900/50 text-red-300 border border-red-700' }
  }

  const typeStyles = {
    success: { border: 'border-green-800/50',  icon: '✓', iconColor: 'text-green-400',  label: 'bg-green-900/30 text-green-300' },
    warning: { border: 'border-yellow-800/50', icon: '!', iconColor: 'text-yellow-400', label: 'bg-yellow-900/30 text-yellow-300' },
    error:   { border: 'border-red-800/50',    icon: '✕', iconColor: 'text-red-400',    label: 'bg-red-900/30 text-red-300' }
  }

  const readinessColor = {
    'High': 'text-green-400 bg-green-900/30 border-green-700',
    'Medium': 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
    'Low': 'text-red-400 bg-red-900/30 border-red-700'
  }

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white px-6 py-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition">← Back</button>
        <div>
          <h1 className="text-2xl font-extrabold">📄 Resume Score Checker</h1>
          <p className="text-slate-400 text-sm mt-1">ATS scoring + AI-powered feedback</p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">Target Role</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'software', label: 'Software Dev' },
              { value: 'data',     label: 'Data / ML'    },
              { value: 'devops',   label: 'DevOps'       },
              { value: 'general',  label: 'General'      }
            ].map(role => (
              <button key={role.value}
                onClick={() => setTargetRole(role.value)}
                className={`py-2 px-3 rounded-xl text-sm font-medium border transition ${
                  targetRole === role.value
                    ? 'bg-purple-400/20 border-purple-400/50 text-purple-200'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:border-white/20'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">
            Paste Your Resume Text
          </label>
          <textarea rows={12}
            placeholder="Paste your resume text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-400/50 text-sm font-mono resize-none"
          />
          <p className="text-slate-600 text-xs mt-1">
            {text.trim() ? `${text.trim().split(/\s+/).length} words` : '0 words'} — aim for 400–600 words
          </p>
        </div>

        <button onClick={handleCheck} disabled={loading}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all hover:shadow-[0_8px_24px_rgba(192,132,252,0.35)]">
          {loading ? 'Analyzing...' : '✨ Check My Resume'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">

          {/* ATS Score Card */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">ATS Score</h2>
                <p className="text-slate-500 text-xs mt-0.5">How well your resume passes automated screening</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorMap[result.color].badge}`}>
                {result.rating}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400 text-sm">Overall ATS Score</span>
                <span className={`font-extrabold text-2xl ${colorMap[result.color].text}`}>{result.score}/100</span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${colorMap[result.color].bar}`}
                  style={{ width: result.score + '%' }} />
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">{result.summary}</p>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs mb-1">Word Count</div>
                <div className="text-blue-400 font-bold">{result.word_count}</div>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs mb-1">Sections</div>
                <div className="text-green-400 font-bold">{result.sections_found.length}/6</div>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs mb-1">Skills Matched</div>
                <div className="text-purple-400 font-bold">{result.matched_skills.length}</div>
              </div>
            </div>
          </div>

          {/* ATS Detailed Feedback */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-300">ATS Breakdown</h3>
            <div className="space-y-3">
              {result.feedback.map((item, i) => {
                const style = typeStyles[item.type]
                return (
                  <div key={i} className={`border ${style.border} rounded-xl p-4`}>
                    <div className="flex items-start gap-3">
                      <span className={`font-bold text-sm mt-0.5 ${style.iconColor}`}>{style.icon}</span>
                      <div className="flex-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.label}`}>{item.category}</span>
                        <p className="text-slate-300 text-sm mt-1">{item.message}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sections Breakdown */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-300">Sections Detected</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['education', 'experience', 'projects', 'skills', 'achievements', 'contact'].map(section => {
                const found = result.sections_found.includes(section)
                return (
                  <div key={section}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border ${
                      found ? 'bg-green-900/20 border-green-800/50 text-green-300' : 'bg-red-900/20 border-red-800/50 text-red-300'
                    }`}>
                    <span>{found ? '✓' : '✕'}</span>
                    <span className="capitalize">{section}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Feedback */}
          <div className="bg-white/[0.03] border border-purple-400/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✨</span>
              <h3 className="font-bold text-sm uppercase tracking-wider text-purple-300">AI Career Coach Feedback</h3>
            </div>

            {aiLoading && (
              <div className="flex items-center gap-3 text-slate-400 py-4">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Generating personalised AI feedback...</span>
              </div>
            )}

            {aiFeedback && !aiFeedback.error && (
              <div className="space-y-4">

                {/* One-liner */}
                <div className="bg-purple-400/10 border border-purple-400/20 rounded-xl p-4">
                  <p className="text-purple-200 font-medium text-sm italic">"{aiFeedback.one_liner}"</p>
                </div>

                {/* Interview Readiness */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm">Interview Readiness:</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full border ${readinessColor[aiFeedback.interview_readiness] || 'text-slate-400 bg-white/5 border-white/10'}`}>
                    {aiFeedback.interview_readiness}
                  </span>
                </div>

                {/* Overall Impression */}
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Overall Impression</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{aiFeedback.overall_impression}</p>
                </div>

                {/* Strengths */}
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Top Strengths</p>
                  <div className="space-y-2">
                    {aiFeedback.top_strengths?.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span className="text-slate-300 text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Improvements */}
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Critical Improvements</p>
                  <div className="space-y-2">
                    {aiFeedback.critical_improvements?.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">→</span>
                        <span className="text-slate-300 text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ATS Tips */}
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">ATS Optimization Tips</p>
                  <div className="space-y-2">
                    {aiFeedback.ats_tips?.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">⚡</span>
                        <span className="text-slate-300 text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {aiFeedback?.error && (
              <p className="text-slate-500 text-sm">AI feedback unavailable right now. Your ATS score above is still accurate.</p>
            )}
          </div>

        </div>
      )}
    </div>
  )
}