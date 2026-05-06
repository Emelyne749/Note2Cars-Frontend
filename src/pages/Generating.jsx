import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const steps = [
  'Reading your notes...',
  'Identifying key topics...',
  'Analyzing exam patterns...',
  'Crafting questions...',
  'Formatting answers...',
  'Finalizing your deck...',
]

export default function Generating() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 1500)

    axios.post(`http://localhost:8080/api/flashcards/generate/${noteId}`)
      .then(() => {
        clearInterval(interval)
        navigate(`/deck/${noteId}`)
      })
      .catch((err) => {
        clearInterval(interval)
        setError('Failed to generate flashcards. Please go back and try again.')
      })

    return () => clearInterval(interval)
  }, [noteId])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {error ? (
          <div className="space-y-4">
            <div className="text-5xl">❌</div>
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold"
            >
              ← Go Back
            </button>
          </div>
        ) : (
          <>
            {/* Spinner */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
              <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Generating Your Flashcards</h2>
              <p className="text-violet-400 font-medium animate-pulse">{steps[currentStep]}</p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-2 text-left">
              {steps.map((step, i) => (
                <div key={step} className={`flex items-center gap-3 text-sm transition-all duration-300
                  ${i < currentStep ? 'text-green-400' : i === currentStep ? 'text-violet-400' : 'text-gray-700'}`}
                >
                  <span>{i < currentStep ? '✅' : i === currentStep ? '⏳' : '○'}</span>
                  {step}
                </div>
              ))}
            </div>

            <p className="text-gray-600 text-xs">This may take 10-30 seconds depending on note length</p>
          </>
        )}
      </div>
    </div>
  )
}