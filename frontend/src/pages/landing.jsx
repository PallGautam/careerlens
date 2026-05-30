import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getColleges } from '../api/api'

export default function Landing() {
  const [mode, setMode] = useState(null)
  const [colleges, setColleges] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [compareList, setCompareList] = useState([])
  const navigate = useNavigate()

  const handleModeSelect = async (selectedMode) => {
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

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">

      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-3">
          Career<span className="text-blue-400">Lens</span>
        </h1>
        <p className="text-gray-400 text-lg">Your placement intelligence platform</p>
      </div>

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
    </div>
  )
}