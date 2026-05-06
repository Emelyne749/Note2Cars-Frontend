import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Generating from './pages/Generating'
import Deck from './pages/Deck'
import Study from './pages/Study'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/generating/:noteId" element={<Generating />} />
        <Route path="/deck/:noteId" element={<Deck />} />
        <Route path="/study/:noteId" element={<Study />} />
      </Routes>
    </Router>
  )
}

export default App