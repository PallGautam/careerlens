import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompany, getCompanyAlumni } from '../api/api'

export default function Company() {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, alumniRes] = await Promise.all([
          getCompany(companyId),
          getCompanyAlumni(companyId)
        ])
        setCompany(companyRes.data)
        setAlumni(alumniRes.data.alumni)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchData()
  }, [companyId])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('careerlens_bookmarks') || '[]')
    setBookmarked(saved.some(b => b.id === parseInt(companyId)))
  }, [companyId])

  const toggleBookmark = () => {
    const saved = JSON.parse(localStorage.getItem('careerlens_bookmarks') || '[]')
    if (bookmarked) {
      const updated = saved.filter(b => b.id !== parseInt(companyId))
      localStorage.setItem('careerlens_bookmarks', JSON.stringify(updated))
      setBookmarked(false)
    } else {
      saved.push({
        id: parseInt(companyId),
        name: company.name,
        sector: company.sector,
        avg_package_lpa: company.avg_package_lpa,
        roles_offered: company.roles_offered
      })
      localStorage.setItem('careerlens_bookmarks', JSON.stringify(saved))
      setBookmarked(true)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-gray-400 text-lg">Loading company...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 max-w-5xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          Back
        </button>
        <h1 className="text-2xl font-bold flex-1">{company?.name}</h1>
        <button
          onClick={toggleBookmark}
          className={"px-4 py-2 rounded-lg text-sm font-medium transition border " +
            (bookmarked
              ? "bg-yellow-900 border-yellow-700 text-yellow-300"
              : "bg-gray-900 border-gray-700 text-gray-400 hover:border-yellow-700 hover:text-yellow-300")}
        >
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-gray-400 text-sm mb-1">Sector</div>
            <div className="font-semibold text-blue-400">{company?.sector}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Avg Package</div>
            <div className="font-semibold text-green-400">{company?.avg_package_lpa} LPA</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Roles Offered</div>
            <div className="font-semibold text-white text-sm">{company?.roles_offered}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Website</div>
            <div className="font-semibold text-purple-400 text-sm">{company?.website}</div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/company/" + companyId + "/roadmap")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            View Placement Roadmap
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Alumni at {company?.name}
          <span className="text-gray-400 text-sm font-normal ml-2">({alumni.length} people)</span>
        </h2>
        {alumni.length === 0 ? (
          <div className="text-gray-500 text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
            No alumni data available yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumni.map(person => (
              <div key={person.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{person.name}</div>
                    <div className="text-gray-400 text-xs">Batch of {person.batch_year}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Current:</span>
                    <span className="text-blue-400 text-xs">{person.current_role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Role here:</span>
                    <span className="text-green-400 text-xs">{person.role_at_company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Joined:</span>
                    <span className="text-white text-xs">{person.year_joined}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}