import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompanyRoadmap } from '../api/api'

export default function Roadmap() {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCompanyRoadmap(companyId)
        setRoadmap(res.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchData()
  }, [companyId])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-gray-400 text-lg">Loading roadmap...</div>
    </div>
  )

  const stageColors = {
    'DSA Preparation': 'blue',
    'Online Assessment': 'purple',
    'Technical Interview': 'amber',
    'Technical Interview 1': 'amber',
    'Technical Interview 2': 'orange',
    'Final Result': 'green',
  }

  const getColor = (stage) => stageColors[stage] || 'blue'

  const colorMap = {
    blue: { dot: 'bg-blue-500', border: 'border-blue-800', badge: 'bg-blue-900 text-blue-300' },
    purple: { dot: 'bg-purple-500', border: 'border-purple-800', badge: 'bg-purple-900 text-purple-300' },
    amber: { dot: 'bg-amber-500', border: 'border-amber-800', badge: 'bg-amber-900 text-amber-300' },
    orange: { dot: 'bg-orange-500', border: 'border-orange-800', badge: 'bg-orange-900 text-orange-300' },
    green: { dot: 'bg-green-500', border: 'border-green-800', badge: 'bg-green-900 text-green-300' },
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">{roadmap?.company} — Placement Roadmap</h1>
          <p className="text-gray-400 text-sm mt-1">Based on real experiences from alumni</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-10 relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>

        {roadmap?.roadmap.map((item, index) => {
          const color = getColor(item.stage)
          const colors = colorMap[color]
          return (
            <div key={index} className="relative pl-12 mb-10">
              {/* Dot */}
              <div className={"absolute left-2.5 top-1.5 w-4 h-4 rounded-full border-2 border-gray-950 " + colors.dot}></div>

              {/* Stage Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className={"text-xs font-medium px-3 py-1 rounded-full " + colors.badge}>
                  Step {index + 1}
                </span>
                <h3 className="text-lg font-semibold">{item.stage}</h3>
              </div>

              {/* Experience Cards */}
              {item.experiences.map((exp, i) => (
                <div key={i} className={"bg-gray-900 border rounded-xl p-5 mb-3 " + colors.border}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {exp.alumni_name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-300">{exp.alumni_name}</span>
                    <span className="text-gray-500 text-xs">· Batch {exp.batch_year}</span>
                    <span className={"ml-auto text-xs px-2 py-0.5 rounded-full " +
                      (exp.outcome === 'Selected' ? 'bg-green-900 text-green-300' :
                       exp.outcome === 'Cleared' ? 'bg-blue-900 text-blue-300' :
                       'bg-red-900 text-red-300')}>
                      {exp.outcome}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-3">{exp.description}</p>

                  {exp.tips && (
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-yellow-400 text-xs font-medium mb-1">💡 Tip</div>
                      <div className="text-gray-300 text-xs">{exp.tips}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}