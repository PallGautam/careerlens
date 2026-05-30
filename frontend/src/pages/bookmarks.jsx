import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Bookmarks() {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('careerlens_bookmarks') || '[]')
      setBookmarks(saved)
    } catch (e) {
      setBookmarks([])
    }
  }, [])

  const removeBookmark = (id) => {
    const updated = bookmarks.filter(b => b.id !== id)
    setBookmarks(updated)
    localStorage.setItem('careerlens_bookmarks', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">Bookmarked Companies</h1>
          <p className="text-gray-400 text-sm mt-1">{bookmarks.length} companies saved</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="text-4xl mb-4">🔖</div>
          <div className="text-gray-400">No bookmarks yet</div>
          <div className="text-gray-500 text-sm mt-2">Click Bookmark on any company page to save it</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map(company => (
            <div key={company.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white">{company.name}</h3>
                  <div className="text-blue-400 text-sm">{company.sector}</div>
                </div>
                <button
                  onClick={() => removeBookmark(company.id)}
                  className="text-yellow-400 hover:text-red-400 transition text-sm border border-gray-700 px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
              <div className="flex gap-3 text-sm mb-4">
                <span className="text-green-400 font-medium">{company.avg_package_lpa} LPA</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-400 text-xs">{company.roles_offered}</span>
              </div>
              <button
                onClick={() => navigate('/company/' + company.id)}
                className="w-full text-center text-xs text-blue-400 border border-blue-800 rounded-lg py-2 hover:bg-blue-900 transition"
              >
                View Company
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}