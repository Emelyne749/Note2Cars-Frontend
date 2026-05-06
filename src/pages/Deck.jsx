import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Deck() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [flashcards, setFlashcards] = useState([])
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:8080/api/flashcards/note/${noteId}`)
      .then((res) => setFlashcards(res.data))
  }, [noteId])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-lg mx-auto">
        {!opened ? (
          <>
            {/* Deck Visual */}
            <div className="relative w-64 h-40 mx-auto">
              {[...Array(Math.min(5, flashcards.length))].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 bg-linear-to-r from-violet-800 to-fuchsia-800 rounded-2xl border border-violet-600 shadow-xl"
                  style={{
                    transform: `rotate(${(i - 2) * 3}deg) translateY(${i * 2}px)`,
                    zIndex: i,
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-2xl border border-violet-400 shadow-2xl flex items-center justify-center z-10">
                <span className="text-white font-black text-4xl">🃏</span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black text-white">Your Deck is Ready!</h1>
              <p className="text-gray-400 text-lg">
                <span className="text-violet-400 font-bold">{flashcards.length} flashcards</span> generated from your notes
              </p>
              <p className="text-gray-600 text-sm">Click below to open your deck and start studying</p>
            </div>

            <button
              onClick={() => setOpened(true)}
              className="w-full py-5 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xl font-black rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/25"
            >
              🃏 Open Your Deck & Start Learning
            </button>

            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-white text-sm transition"
            >
              ← Create another deck
            </button>
          </>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white">Ready to Study? 🧠</h2>
            <p className="text-gray-400">You have {flashcards.length} cards to go through.</p>
            <button
              onClick={() => navigate(`/study/${noteId}`)}
              className="w-full py-5 bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-xl font-black rounded-2xl transition-all hover:scale-[1.02]"
            >
              🚀 Start Studying
            </button>
          </div>
        )}
      </div>
    </div>
  )
}