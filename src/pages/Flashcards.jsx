import { useState, useEffect } from 'react'
import { HiArrowPath } from 'react-icons/hi2'
import api from '../api/client.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import './Flashcards.css'

export default function Flashcards() {
  const [docs, setDocs] = useState([])
  const [selectedDoc, setSelectedDoc] = useState('')
  const [cards, setCards] = useState(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/documents/').then(res => setDocs(res.data.documents.filter(d => d.status === 'ready'))).catch(() => {})
  }, [])

  const generateCards = async () => {
    if (!selectedDoc) return
    setLoading(true)
    setCards(null)
    setCurrentIdx(0)
    setFlipped(false)
    try {
      const res = await api.post('/ai/flashcards', { doc_id: parseInt(selectedDoc), num_cards: 15 })
      setCards(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to generate flashcards')
    } finally {
      setLoading(false)
    }
  }

  const next = () => { setFlipped(false); setCurrentIdx(prev => Math.min(prev + 1, (cards?.flashcards?.length || 1) - 1)) }
  const prev = () => { setFlipped(false); setCurrentIdx(prev => Math.max(prev - 1, 0)) }
  const card = cards?.flashcards?.[currentIdx]

  return (
    <div className="flashcards-page animate-fadeIn" id="flashcards-page">
      <div className="page-header">
        <h1 className="page-title">🃏 Flashcards</h1>
        <p className="page-subtitle">AI-generated flashcards for effective memorization</p>
      </div>

      <div className="fc-controls glass-card">
        <select className="input-field" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)} style={{maxWidth: 300}}>
          <option value="">Select a document</option>
          {docs.map(d => <option key={d.id} value={d.id}>{d.original_name}</option>)}
        </select>
        <button className="btn btn-primary" onClick={generateCards} disabled={!selectedDoc || loading}>
          {loading ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </div>

      {loading && <LoadingSpinner text="Creating flashcards..." />}

      {card && (
        <div className="fc-viewer">
          <div className="fc-progress">
            <span>{currentIdx + 1} / {cards.flashcards.length}</span>
            <span className={`badge badge-${card.difficulty === 'easy' ? 'success' : card.difficulty === 'hard' ? 'error' : 'warning'}`}>
              {card.difficulty}
            </span>
            <span className="badge badge-accent">{card.category}</span>
          </div>

          <div className={`fc-card-container ${flipped ? 'fc-flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
            <div className="fc-card">
              <div className="fc-front glass-card">
                <div className="fc-label">QUESTION</div>
                <p className="fc-text">{card.front}</p>
                <p className="fc-hint">Click to flip</p>
              </div>
              <div className="fc-back glass-card">
                <div className="fc-label">ANSWER</div>
                <p className="fc-text">{card.back}</p>
                <HiArrowPath className="fc-flip-icon" size={20} />
              </div>
            </div>
          </div>

          <div className="fc-nav">
            <button className="btn btn-secondary" onClick={prev} disabled={currentIdx === 0}>← Previous</button>
            <button className="btn btn-secondary" onClick={next} disabled={currentIdx >= cards.flashcards.length - 1}>Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}
