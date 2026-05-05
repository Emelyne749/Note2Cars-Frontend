import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Notes from './pages/Notes'
import Flashcards from './pages/Flashcards'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white font-mono">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/flashcards/:noteId" element={<Flashcards />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App