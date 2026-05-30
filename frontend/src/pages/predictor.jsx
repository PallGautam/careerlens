import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCompanies, getColleges, predictPlacement } from '../api/api'
import { useEffect } from 'react'

export default function Predictor() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [colleges, setColleges] = useState([])
  const [form, setForm] = useState({
    cgpa: '',
    skills: '',
    college_id: '',
    company_id: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCompanies().then(res => setCompanies(res.data))
    getColleges().then(res => setColleges(res.data))
  }, [])

  const handleSubmit = async () => {
    if (!form.cgpa || !form.skills || !form.college_id || !form.company_id) {
      alert('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      const res = await predictPlacement({
        cgpa: parseFloat(form.cgpa),
        skills: form.skills.split(',').map(s => s.trim()),
        college_id: parseInt(form.college_id),
        company_id: parseInt(form.company_id)
      })
      setResult(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const colorMap = {
    green: { bar: 'bg-green-500', text: 'text-green-400', badge: 'bg-green-900 text-green-300' },
    yellow: { bar: 'bg-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-900 text-yellow-300' },
    red: { bar: 'bg-red-500', text: 'text-red-400', badge: 'bg-red-900 text-red-300' }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 max-w-3xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">Placement Predictor</h1>
          <p className="text-gray-400 text-sm mt-1">Find out your chances at your target company</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Your CGPA</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 8.5"
              value={form.cgpa}
              onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Your College</label>
            <select
              value={form.college_id}
              onChange={(e) => setForm({ ...form, college_id: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select college</option>
              {colleges.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Target Company</label>
            <select
              value={form.company_id}
              onChange={(e) => setForm({ ...form, company_id: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select company</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Your Skills</label>
            <input
              type="text"
              placeholder="e.g. Python, DSA, React, SQL"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">Separate skills with commas</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-3 rounded-lg font-medium transition"
        >
          {loading ? 'Predicting...' : 'Predict My Chances'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Your Result</h2>
            <span className={"px-3 py-1 rounded-full text-sm font-medium " + colorMap[result.color].badge}>
              {result.rating} Chance
            </span>
          </div>

          {/* Score */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Overall Score</span>
              <span className={"font-bold text-2xl " + colorMap[result.color].text}>
                {result.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className={"h-3 rounded-full transition-all " + colorMap[result.color].bar}
                style={{ width: result.percentage + '%' }}
              ></div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">CGPA Score</div>
              <div className="text-blue-400 font-bold">{result.breakdown.cgpa_score}/40</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Skills Score</div>
              <div className="text-purple-400 font-bold">{result.breakdown.skills_score}/40</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">History Score</div>
              <div className="text-green-400 font-bold">{result.breakdown.history_score}/20</div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className={"font-medium mb-1 " + colorMap[result.color].text}>Analysis</p>
            <p className="text-gray-300 text-sm">{result.message}</p>
          </div>

          {/* Matched Skills */}
          {result.matched_skills.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">Matched Skills</p>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.map((skill, i) => (
                  <span key={i} className="bg-blue-900 text-blue-300 text-xs px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Recommendations</p>
            <div className="space-y-2">
              {result.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">→</span>
                  <span className="text-gray-300 text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}