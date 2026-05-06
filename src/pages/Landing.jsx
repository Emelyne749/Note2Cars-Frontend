import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Landing() {
  const [noteFile, setNoteFile] = useState(null)
  const [pastedNotes, setPastedNotes] = useState('')
  const [pastPaper, setPastPaper] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()
  const navigate = useNavigate()

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setNoteFile(file)
  }

  const handleSubmit = async () => {
    if (!title) return alert('Please enter a title for your notes!')
    if (!noteFile && !pastedNotes) return alert('Please upload a file or paste your notes!')
    setLoading(true)

    try {
      let noteId

      if (noteFile) {
        const formData = new FormData()
        formData.append('file', noteFile)
        formData.append('title', title)
        const res = await axios.post('http://localhost:8080/api/notes/upload', formData)
        noteId = res.data.id

        if (pastPaper) {
          await axios.put(`http://localhost:8080/api/notes/${noteId}/pastpaper`,
            { pastPaper }, { headers: { 'Content-Type': 'application/json' } })
        }
      } else {
        const res = await axios.post('http://localhost:8080/api/notes', {
          title,
          content: pastedNotes,
          pastPaper,
        })
        noteId = res.data.id
      }

      navigate(`/generating/${noteId}`)
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Make sure the backend is running!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-violet-900/20 via-gray-950 to-gray-950" />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700/50 rounded-full px-4 py-1.5 text-violet-300 text-sm mb-6">
            🤖 AI-Powered Flashcard Generator
          </div>
          <h1 className="text-6xl font-black text-white mb-4 leading-tight">
            Turn Your Notes Into<br />
            <span className="text-transparent bg-clip-text bg-linear-to-br from-violet-400 to-fuchsia-400">
              Smart Flashcards
            </span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Upload your study materials, add past exam papers for context,
            and let AI generate exam-ready flashcards tailored to your syllabus.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-6">

        {/* Title */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <label className="text-sm font-semibold text-violet-400 uppercase tracking-wider">
            📚 Session Title
          </label>
          <input
            type="text"
            placeholder="e.g. Biology Chapter 5 - Cell Division"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-3 w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition text-lg"
          />
        </div>

        {/* Upload or Paste Notes */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <label className="text-sm font-semibold text-violet-400 uppercase tracking-wider">
            📄 Study Notes
          </label>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
              ${dragOver ? 'border-violet-500 bg-violet-900/20' : 'border-gray-700 hover:border-violet-600 hover:bg-gray-800/50'}
              ${noteFile ? 'border-green-500 bg-green-900/10' : ''}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setNoteFile(e.target.files[0])}
            />
            {noteFile ? (
              <div className="space-y-2">
                <div className="text-4xl">✅</div>
                <p className="text-green-400 font-semibold">{noteFile.name}</p>
                <p className="text-gray-500 text-sm">Click to change file</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">📁</div>
                <p className="text-white font-semibold">Drop your PDF or DOCX here</p>
                <p className="text-gray-500 text-sm">or click to browse</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-500 text-sm">or paste notes below</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <textarea
            placeholder="Paste your study notes, lecture slides, or any reference material here..."
            value={pastedNotes}
            onChange={(e) => setPastedNotes(e.target.value)}
            rows={6}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition resize-none"
          />
        </div>

        {/* Past Papers */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-violet-400 uppercase tracking-wider">
              📝 Past Exam Papers
            </label>
            <p className="text-gray-500 text-sm mt-1">
              Optional — paste past exam questions so AI can match the exam format and style
            </p>
          </div>
          <textarea
            placeholder="Paste past exam questions here... AI will use these to style your flashcards like real exam questions."
            value={pastPaper}
            onChange={(e) => setPastPaper(e.target.value)}
            rows={5}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-5 bg-linear-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-700 disabled:to-gray-700 text-white text-xl font-black rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/25 disabled:scale-100"
        >
          {loading ? '⏳ Preparing your flashcards...' : '✨ Create Flashcards'}
        </button>

        {/* Contact Us Button */}
        <button
          onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-4 bg-gray-900 border-2 border-gray-700 hover:border-violet-500 text-white text-lg font-bold rounded-2xl transition-all duration-200"
        >
          📬 Contact Us
        </button>
      </div>

      {/* How It Works */}
      <div className="bg-gray-900/50 border-t border-gray-800 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '📄', title: 'Upload Notes', desc: 'Upload your PDF or DOCX study materials or paste them directly' },
              { step: '02', icon: '📝', title: 'Add Past Papers', desc: 'Optionally add past exam papers so AI matches the question format' },
              { step: '03', icon: '🤖', title: 'AI Generates', desc: 'Our AI creates detailed exam-style flashcards from your content' },
              { step: '04', icon: '🧠', title: 'Study & Ace', desc: 'Flip through interactive cards and master your exam topics' },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="text-4xl">{item.icon}</div>
                <div className="text-violet-400 text-xs font-bold tracking-widest">STEP {item.step}</div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-gray-950 border-t border-gray-800 py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-xl font-black text-violet-400">Note2Card</h3>
            <p className="text-gray-500 text-sm">
              AI-powered flashcard generation for students who want to study smarter.
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-bold text-white">📖 Instructions</h3>
            <ul className="text-gray-500 text-sm space-y-2">
              <li>1. Upload a PDF or DOCX file of your notes</li>
              <li>2. Optionally paste past exam papers</li>
              <li>3. Click "Create Flashcards"</li>
              <li>4. Wait for AI to generate your deck</li>
              <li>5. Study with interactive flip cards</li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact-info" className="space-y-3">
            <h3 className="font-bold text-white">📬 Contact Us</h3>
            <ul className="text-gray-500 text-sm space-y-2">
              <li>✉️ support@note2card.com</li>
              <li>🐙 github.com/Emelyne749/Note2Card</li>
              <li>🕐 Response within 24 hours</li>
            </ul>
          </div>

        </div>
        <div className="text-center text-gray-700 text-sm mt-10">
          © 2026 Note2Card. Built with ❤️ for students.
        </div>
      </footer>
    </div>
  )
}