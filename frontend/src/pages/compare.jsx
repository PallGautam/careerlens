import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { compareCompanies } from '../api/api'

export default function Compare() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = searchParams.get('ids')
    if (!ids) {
      setLoading(false)
      return
    }
    const idList = ids.split(',').map(Number)
    compareCompanies(idList)
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
      <div className="text-center">
        <p className="text-gray-400 text-lg mb-4">No companies selected for comparison.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Go to Landing
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 max-w-6xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">Company Comparison</h1>
          <p className="text-gray-400 text-sm mt-1">Side by side analysis to help you decide</p>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(' + data.length + ', 1fr)' }}>
        {data.map((company) => (
          <div key={company.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-5 border-b border-gray-800">
              <h2 className="text-xl font-bold mb-1">{company.name}</h2>
              <div className="text-blue-300 text-sm">{company.sector}</div>
            </div>

            <div className="p-5 border-b border-gray-800">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-gray-400 text-xs mb-1">Avg Package</div>
                  <div className="text-green-400 font-bold">{company.avg_package_lpa} LPA</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-gray-400 text-xs mb-1">Alumni</div>
                  <div className="text-blue-400 font-bold">{company.alumni_count}</div>
                </div>
              </div>
              <div className="mt-3 bg-gray-800 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1">Roles</div>
                <div className="text-white text-xs">{company.roles_offered}</div>
              </div>
            </div>

            <div className="p-5 border-b border-gray-800">
              <h3 className="text-green-400 font-semibold text-sm mb-3">Pros</h3>
              <div className="space-y-2">
                {company.pros.map((pro, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">+</span>
                    <div>
                      <div className="text-gray-300 text-xs">{pro.point}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{pro.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-red-400 font-semibold text-sm mb-3">Cons</h3>
              <div className="space-y-2">
                {company.cons.map((con, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">-</span>
                    <div>
                      <div className="text-gray-300 text-xs">{con.point}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{con.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}