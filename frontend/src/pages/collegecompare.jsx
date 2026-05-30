import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { compareColleges } from '../api/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function CollegeCompare() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = searchParams.get('ids')
    if (!ids) return
    const idList = ids.split(',').map(Number)
    compareColleges(idList)
      .then(res => setData(res.data.comparison))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-gray-400 text-lg">Loading comparison...</div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-gray-400 text-lg">No data found</div>
    </div>
  )

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']

  const chartData = data[0].yearly_stats.map(stat => {
    const entry = { year: stat.year }
    data.forEach(college => {
      const match = college.yearly_stats.find(s => s.year === stat.year)
      if (match) entry[college.name] = match.placement_percent
    })
    return entry
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 max-w-6xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">College Comparison</h1>
          <p className="text-gray-400 text-sm mt-1">Head to head placement statistics</p>
        </div>
      </div>

      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(' + data.length + ', 1fr)' }}>
        {data.map((college, index) => (
          <div key={college.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-800" style={{ borderTop: '3px solid ' + COLORS[index] }}>
              <h2 className="text-lg font-bold mb-1">{college.name}</h2>
              <div className="text-gray-400 text-sm">📍 {college.location}</div>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-xs mb-1">Avg CTC</div>
                <div className="text-green-400 font-bold">{college.overall_avg_ctc} LPA</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-xs mb-1">Placement %</div>
                <div className="text-blue-400 font-bold">{college.overall_placement_percent}%</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center col-span-2">
                <div className="text-gray-400 text-xs mb-1">Best Year</div>
                <div className="text-purple-400 font-bold">{college.best_year}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-4">Placement % Trend Comparison</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <XAxis dataKey="year" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
            <Legend />
            {data.map((college, index) => (
              <Bar key={college.id} dataKey={college.name} fill={COLORS[index]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}