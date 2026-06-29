import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCollegeStats, getCompanies } from '../api/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

export default function Dashboard() {
  const { collegeId } = useParams()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [compareList, setCompareList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, companiesRes] = await Promise.all([
          getCollegeStats(collegeId),
          getCompanies()
        ])
        setStats(statsRes.data)
        setCompanies(companiesRes.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchData()
  }, [collegeId])

  const toggleCompare = (companyId) => {
    setCompareList(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    )
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-gray-400 text-lg">Loading dashboard...</div>
    </div>
  )

  const sectorData = companies.reduce((acc, company) => {
    const existing = acc.find(item => item.name === company.sector)
    if (existing) existing.value++
    else acc.push({ name: company.sector, value: 1 })
    return acc
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition">
          Back
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{stats?.college}</h1>
          <p className="text-gray-400 text-sm">📍 {stats?.location} · {stats?.campus_type === 'on_campus' ? 'On Campus' : 'Off Campus'}</p>
        </div>
        <button
          onClick={() => navigate('/predictor')}
          className="text-gray-400 hover:text-green-300 border border-gray-700 px-3 py-2 rounded-lg text-sm transition"
        >
          Predictor
        </button>
        <button
          onClick={() => navigate('/feed')}
          className="text-gray-400 hover:text-blue-300 border border-gray-700 px-3 py-2 rounded-lg text-sm transition"
        >
          Experience Feed
        </button>
        <button
          onClick={() => navigate('/bookmarks')}
          className="text-gray-400 hover:text-yellow-300 border border-gray-700 px-3 py-2 rounded-lg text-sm transition"
        >
          Bookmarks
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Avg CTC</div>
          <div className="text-2xl font-bold text-blue-400">{stats?.overall_avg_ctc} LPA</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Placement %</div>
          <div className="text-2xl font-bold text-green-400">{stats?.overall_placement_percent}%</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Best Year</div>
          <div className="text-2xl font-bold text-purple-400">{stats?.best_year}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Companies</div>
          <div className="text-2xl font-bold text-amber-400">{companies.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Year-wise Placements</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.yearly_stats}>
              <XAxis dataKey="year" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
              <Bar dataKey="placed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Placed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Companies by Sector</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sectorData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                {sectorData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Top Recruiters</h2>
          {compareList.length >= 2 && (
            <button
              onClick={() => navigate("/compare?ids=" + compareList.join(','))}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Compare {compareList.length} Companies
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left py-2 pr-4">Company</th>
                <th className="text-left py-2 pr-4">Sector</th>
                <th className="text-left py-2 pr-4">Avg Package</th>
                <th className="text-left py-2 pr-4">Roles</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="py-3 pr-4 font-medium">
                    <div>{company.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{company.alumni_count} alumni</div>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{company.sector}</td>
                  <td className="py-3 pr-4 text-green-400 font-medium">{company.avg_package_lpa} LPA</td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">{company.roles_offered}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate("/company/" + company.id)}
                        className="text-blue-400 hover:text-blue-300 text-xs border border-blue-800 px-2 py-1 rounded transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => toggleCompare(company.id)}
                        className={"text-xs px-2 py-1 rounded transition border " + (
                          compareList.includes(company.id)
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "text-purple-400 border-purple-800 hover:text-purple-300"
                        )}
                      >
                        {compareList.includes(company.id) ? "Added" : "+ Compare"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}