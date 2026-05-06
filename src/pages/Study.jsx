import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Study() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [flashcards, setFlashcards] = useState([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:8080/api/flashcards/note/${noteId}`)
      .then((res) => setFlashcards(res.data))
  }, [noteId])

  const next = () => {
    if (current < flashcards.length - 1) {
      setFlipped(false)
      setTimeout(() => setCurrent((prev) => prev + 1), 150)
    } else {
      setCompleted(true)
    }
  }

  const prev = () => {
    if (current > 0) {
      setFlipped(false)
      setTimeout(() => setCurrent((prev) => prev - 1), 150)
    }
  }

  if (flashcards.length === 0) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-violet-400 animate-pulse text-xl">Loading cards...</div>
    </div>
  )

  if (completed) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <div className="text-7xl">🎉</div>
        <h1 className="text-4xl font-black text-white">Deck Complete!</h1>
        <p className="text-gray-400">You went through all {flashcards.length} flashcards.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => { setCurrent(0); setFlipped(false); setCompleted(false) }}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition"
          >
            🔄 Study Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition"
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  )

  const card = flashcards[current]

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-10">

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Card {current + 1} of {flashcards.length}</span>
          <span>{Math.round(((current + 1) / flashcards.length) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-linear-to-br from-violet-600 to-fuchsia-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="w-full max-w-2xl cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '320px',
          }}
        >
          {/* Front - Question */}
          <div
            className="absolute inset-0 bg-gray-900 border-2 border-gray-700 rounded-3xl p-10 flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Question</span>
              <span className="text-xs text-gray-600">Click to reveal answer</span>
            </div>
            <p className="text-white text-xl font-semibold leading-relaxed text-center">
              {card.question}
            </p>
            <div className="flex justify-center">
              <span className="text-gray-600 text-sm">👆 Click to flip</span>
            </div>
          </div>

          {/* Back - Answer */}
          <div
            className="absolute inset-0 bg-linear-to-br from-violet-900/50 to-fuchsia-900/50 border-2 border-violet-600 rounded-3xl p-10 flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-violet-400 font-bold uppercase tracking-widest">Answer</span>
              <span className="text-xs text-gray-500">Click to see question</span>
            </div>
            <p className="text-green-300 text-lg font-medium leading-relaxed text-center">
              {card.answer}
            </p>
            <div className="flex justify-center">
              <span className="text-gray-600 text-sm">👆 Click to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-10">
        <button
          onClick={prev}
          disabled={current === 0}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white font-bold rounded-xl transition"
        >
          ← Previous
        </button>
        <button
          onClick={() => setFlipped(!flipped)}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition"
        >
          🔄 Flip Card
        </button>
        <button
          onClick={next}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition"
        >
          {current === flashcards.length - 1 ? '🎉 Finish' : 'Next →'}
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-gray-700 text-xs mt-6">Click card to flip • Use buttons to navigate</p>
    </div>
  )
}