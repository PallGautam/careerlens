import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeed } from '../api/api'

export default function Feed() {
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getFeed()
      .then(res => setExperiences(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const companies = ['All', ...new Set(experiences.map(e => e.company_name))]

  const filtered = experiences.filter(exp => {
    const matchesCompany = filter === 'All' || exp.company_name === filter
    const matchesSearch = exp.alumni_name.toLowerCase().includes(search.toLowerCase()) ||
      exp.description.toLowerCase().includes(search.toLowerCase()) ||
      exp.company_name.toLowerCase().includes(search.toLowerCase())
    return matchesCompany && matchesSearch
  })

  const outcomeColor = (outcome) => {
    if (outcome === 'Selected') return 'bg-green-900 text-green-300'
    if (outcome === 'Cleared') return 'bg-blue-900 text-blue-300'
    return 'bg-red-900 text-red-300'
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-gray-400 text-lg">Loading feed...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 max-w-4xl mx-auto">

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">Interview Experience Feed</h1>
          <p className="text-gray-400 text-sm mt-1">Real experiences from alumni</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name, company or keyword..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
      />

      <div className="flex gap-2 flex-wrap mb-6">
        {companies.map(company => (
          <button
            key={company}
            onClick={() => setFilter(company)}
            className={"px-3 py-1.5 rounded-full text-xs font-medium transition border " + (
              filter === company
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-gray-900 border-gray-700 text-gray-400 hover:border-blue-500"
            )}
          >
            {company}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No experiences found</div>
        ) : (
          filtered.map(exp => (
            <div key={exp.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {exp.alumni_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{exp.alumni_name}</div>
                    <div className="text-gray-400 text-xs">Batch {exp.batch_year} · {exp.company_name}</div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{exp.stage}</span>
                  <span className={"text-xs px-2 py-1 rounded-full " + outcomeColor(exp.outcome)}>
                    {exp.outcome}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-3">{exp.description}</p>

              {exp.tips && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-yellow-400 text-xs font-medium">Tip: </span>
                  <span className="text-gray-300 text-xs">{exp.tips}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}