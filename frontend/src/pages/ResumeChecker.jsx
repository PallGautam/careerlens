import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkResume } from '../api/api'

export default function ResumeChecker() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [targetRole, setTargetRole] = useState('software')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!text.trim() || text.trim().split(' ').length < 20) {
      alert('Please paste at least a few lines of your resume text')
      return
    }
    setLoading(true)
    try {
      const res = await checkResume({ text, target_role: targetRole })
      setResult(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const colorMap = {
    green:  { bar: 'bg-green-500',  text: 'text-green-400',  badge: 'bg-green-900 text-green-300'   },
    blue:   { bar: 'bg-blue-500',   text: 'text-blue-400',   badge: 'bg-blue-900 text-blue-300'     },
    yellow: { bar: 'bg-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-900 text-yellow-300' },
    red:    { bar: 'bg-red-500',    text: 'text-red-400',    badge: 'bg-red-900 text-red-300'       }
  }

  const typeStyles = {
    success: { border: 'border-green-800',  icon: '✓', iconColor: 'text-green-400',  label: 'bg-green-900 text-green-300'   },
    warning: { border: 'border-yellow-800', icon: '!', iconColor: 'text-yellow-400', label: 'bg-yellow-900 text-yellow-300' },
    error:   { border: 'border-red-800',    icon: '✕', iconColor: 'text-red-400',    label: 'bg-red-900 text-red-300'       }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">Resume Score Checker</h1>
          <p className="text-gray-400 text-sm mt-1">Paste your resume and get instant feedback</p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

        {/* Role Selector */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Target Role</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'software', label: 'Software Dev' },
              { value: 'data',     label: 'Data / ML'    },
              { value: 'devops',   label: 'DevOps'       },
              { value: 'general',  label: 'General'      }
            ].map(role => (
              <button
                key={role.value}
                onClick={() => setTargetRole(role.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition
                  ${targetRole === role.value
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">
            Paste Your Resume Text
            <span className="text-gray-600 ml-2">(copy-paste from your Word/PDF resume)</span>
          </label>
          <textarea
            rows={12}
            placeholder={`Paste your resume text here...\n\nExample:\nJohn Doe | john@email.com | github.com/johndoe\n\nEducation\nB.Tech Computer Science, XYZ University, 2024 | CGPA: 8.2\n\nSkills\nPython, React, SQL, DSA, Git, Docker\n\nProjects\nE-Commerce Platform | Built a full-stack app using React and FastAPI...\n- Reduced load time by 40% through lazy loading\n- Deployed on AWS with CI/CD pipeline`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm font-mono resize-none"
          />
          <p className="text-gray-600 text-xs mt-1">
            {text.trim() ? `${text.trim().split(/\s+/).length} words` : '0 words'} — aim for 400–600 words
          </p>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-3 rounded-lg font-medium transition"
        >
          {loading ? 'Analyzing...' : 'Check My Resume'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">

          {/* Score Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Score</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorMap[result.color].badge}`}>
                {result.rating}
              </span>
            </div>

            {/* Score Bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Overall Resume Score</span>
                <span className={`font-bold text-2xl ${colorMap[result.color].text}`}>
                  {result.score}/100
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${colorMap[result.color].bar}`}
                  style={{ width: result.score + '%' }}
                />
              </div>
            </div>

            {/* Summary */}
            <p className="text-gray-300 text-sm">{result.summary}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-xs mb-1">Word Count</div>
                <div className="text-blue-400 font-bold">{result.word_count}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-xs mb-1">Sections Found</div>
                <div className="text-green-400 font-bold">{result.sections_found.length}/6</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-xs mb-1">Skills Matched</div>
                <div className="text-purple-400 font-bold">{result.matched_skills.length}</div>
              </div>
            </div>
          </div>

          {/* Feedback Items */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Detailed Feedback</h3>
            <div className="space-y-3">
              {result.feedback.map((item, i) => {
                const style = typeStyles[item.type]
                return (
                  <div key={i} className={`border ${style.border} rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      <span className={`font-bold text-sm mt-0.5 ${style.iconColor}`}>
                        {style.icon}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.label}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{item.message}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sections Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Sections Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.keys({
                education: '', experience: '', projects: '',
                skills: '', achievements: '', contact: ''
              }).map(section => {
                const found = result.sections_found.includes(section)
                return (
                  <div
                    key={section}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                      ${found
                        ? 'bg-green-900/30 border border-green-800 text-green-300'
                        : 'bg-red-900/30 border border-red-800 text-red-300'
                      }`}
                  >
                    <span>{found ? '✓' : '✕'}</span>
                    <span className="capitalize">{section}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}