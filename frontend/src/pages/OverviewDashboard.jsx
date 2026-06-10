import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCompanies, getColleges } from '../api/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#f9a8d4', '#c084fc', '#86efac', '#7dd3fc', '#fcd34d', '#fb923c', '#a5b4fc', '#6ee7b7']

export default function OverviewDashboard() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState('All')

  useEffect(() => {
    Promise.all([getCompanies(), getColleges()])
      .then(([compRes, collRes]) => {
        setCompanies(compRes.data)
        setColleges(collRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const sectors = ['All', ...new Set(companies.map(c => c.sector))]

  const filteredCompanies = companies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchSector = sectorFilter === 'All' || c.sector === sectorFilter
    return matchSearch && matchSector
  })

  const sectorData = companies.reduce((acc, company) => {
    const existing = acc.find(item => item.name === company.sector)
    if (existing) existing.value++
    else acc.push({ name: company.sector, value: 1 })
    return acc
  }, [])

  const topCompanies = [...companies]
    .sort((a, b) => b.avg_package_lpa - a.avg_package_lpa)
    .slice(0, 8)
    .map(c => ({ name: c.name, package: c.avg_package_lpa }))

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d14] text-white flex items-center justify-center">
      <div className="text-slate-400">Loading dashboard...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white px-6 py-8 max-w-6xl mx-auto">

      <style>{`
        @keyframes fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fade-in 0.4s ease both; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition text-sm">← Back</button>
          <div>
            <h1 className="text-2xl font-extrabold">📊 Placement Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Overview across all colleges and companies</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => navigate('/predictor')}
            className="bg-white/[0.04] border border-white/10 hover:border-pink-300/40 hover:text-pink-200 text-slate-300 px-3 py-2 rounded-xl text-xs transition">
            🎯 Predictor
          </button>
          <button onClick={() => navigate('/compare')}
            className="bg-white/[0.04] border border-white/10 hover:border-purple-300/40 hover:text-purple-200 text-slate-300 px-3 py-2 rounded-xl text-xs transition">
            ⚖️ Compare
          </button>
          <button onClick={() => navigate('/resume-checker')}
            className="bg-white/[0.04] border border-white/10 hover:border-green-300/40 hover:text-green-200 text-slate-300 px-3 py-2 rounded-xl text-xs transition">
            📄 Resume
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 fade-in">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <div className="text-slate-400 text-xs mb-1">Total Companies</div>
          <div className="text-3xl font-extrabold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">{companies.length}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <div className="text-slate-400 text-xs mb-1">Colleges Indexed</div>
          <div className="text-3xl font-extrabold bg-gradient-to-r from-green-300 to-sky-300 bg-clip-text text-transparent">{colleges.length}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <div className="text-slate-400 text-xs mb-1">Highest Package</div>
          <div className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {Math.max(...companies.map(c => c.avg_package_lpa))} LPA
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <div className="text-slate-400 text-xs mb-1">Avg Package</div>
          <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-300 to-sky-300 bg-clip-text text-transparent">
            {(companies.reduce((s, c) => s + c.avg_package_lpa, 0) / companies.length).toFixed(1)} LPA
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">Top 8 Companies by Package</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topCompanies} layout="vertical">
              <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" stroke="#475569" tick={{ fontSize: 11 }} width={80} />
              <Tooltip
                contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                formatter={(val) => [`${val} LPA`, 'Avg Package']}
              />
              <Bar dataKey="package" radius={[0, 6, 6, 0]}>
                {topCompanies.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">Companies by Sector</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sectorData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {sectorData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* College Cards */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">Browse by College</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {colleges.slice(0, 9).map(college => (
            <button key={college.id}
              onClick={() => navigate(`/dashboard/${college.id}`)}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 text-left hover:border-purple-300/40 hover:bg-white/[0.05] transition-all hover:-translate-y-1"
            >
              <div className="font-bold text-white text-sm">{college.name}</div>
              <div className="text-slate-500 text-xs mt-1">📍 {college.location}</div>
              <div className="text-purple-300 text-xs mt-2 font-medium">
                {college.campus_type === 'on_campus' ? '🏫 On Campus' : '💼 Off Campus'}
              </div>
            </button>
          ))}
        </div>
        {colleges.length > 9 && (
          <button onClick={() => navigate('/')}
            className="mt-3 text-slate-400 hover:text-white text-sm underline transition">
            View all {colleges.length} colleges →
          </button>
        )}
      </div>

      {/* Companies Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">All Companies</h2>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text" placeholder="Search companies..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 text-xs"
            />
            <select
              value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-purple-400/50 text-xs"
            >
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-white/[0.07] text-xs uppercase tracking-wider">
                <th className="text-left py-2 pr-4">Company</th>
                <th className="text-left py-2 pr-4">Sector</th>
                <th className="text-left py-2 pr-4">Avg Package</th>
                <th className="text-left py-2 pr-4">Roles</th>
                <th className="text-left py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(company => (
                <tr key={company.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition">
                  <td className="py-3 pr-4 font-semibold text-white">{company.name}</td>
                  <td className="py-3 pr-4 text-slate-400 text-xs">{company.sector}</td>
                  <td className="py-3 pr-4">
                    <span className="text-green-300 font-bold">{company.avg_package_lpa} LPA</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-400 text-xs max-w-[180px] truncate">{company.roles_offered}</td>
                  <td className="py-3">
                    <button onClick={() => navigate(`/company/${company.id}`)}
                      className="text-purple-300 hover:text-purple-200 border border-purple-300/30 hover:border-purple-300/50 px-2 py-1 rounded-lg text-xs transition">
                      View →
                    </button>
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