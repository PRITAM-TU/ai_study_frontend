import { useState, useEffect } from 'react'
import api from '../api/client.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import './ExamMode.css'

export default function ExamMode() {
  const [docs, setDocs] = useState([])
  const [selectedDoc, setSelectedDoc] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('topics')

  useEffect(() => {
    api.get('/documents/').then(res => setDocs(res.data.documents.filter(d => d.status === 'ready'))).catch(() => {})
  }, [])

  const predict = async () => {
    if (!selectedDoc) return
    setLoading(true)
    setPrediction(null)
    try {
      const res = await api.post('/ai/exam-mode', { doc_id: parseInt(selectedDoc) })
      setPrediction(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Exam prediction failed')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { key: 'topics', label: '🎯 Important Topics' },
    { key: 'mcq', label: '📝 Predicted MCQs' },
    { key: 'subjective', label: '✍️ Subjective Questions' },
    { key: 'formulas', label: '📐 Key Formulas' },
  ]

  return (
    <div className="exam-page animate-fadeIn" id="exam-mode-page">
      <div className="page-header">
        <h1 className="page-title">🎓 Exam Mode</h1>
        <p className="page-subtitle">Predict important questions and prepare strategically</p>
      </div>

      <div className="exam-controls glass-card">
        <select className="input-field" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)} style={{maxWidth: 300}}>
          <option value="">Select a document</option>
          {docs.map(d => <option key={d.id} value={d.id}>{d.original_name}</option>)}
        </select>
        <button className="btn btn-primary" onClick={predict} disabled={!selectedDoc || loading}>
          {loading ? 'Analyzing...' : 'Predict Exam Questions'}
        </button>
      </div>

      {loading && <LoadingSpinner text="Analyzing your study material..." />}

      {prediction && (
        <div className="exam-results">
          {/* Repeated Topics */}
          {prediction.repeated_topics?.length > 0 && (
            <div className="exam-repeated glass-card">
              <h3>🔄 Repeated / High-Weight Topics</h3>
              <div className="exam-tags">
                {prediction.repeated_topics.map((t, i) => (
                  <span key={i} className="badge badge-warning">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="exam-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`exam-tab ${activeTab === t.key ? 'exam-tab-active' : ''}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Topics */}
          {activeTab === 'topics' && prediction.important_topics?.map((t, i) => (
            <div key={i} className="exam-item glass-card animate-fadeInUp" style={{animationDelay: `${i * 0.05}s`}}>
              <div className="exam-item-header">
                <span className="exam-rank">#{t.rank}</span>
                <span className={`badge ${t.importance === 'high' ? 'badge-error' : 'badge-warning'}`}>{t.importance}</span>
              </div>
              <h4>{t.topic}</h4>
              <p>{t.reason}</p>
            </div>
          ))}

          {/* MCQs */}
          {activeTab === 'mcq' && prediction.predicted_questions?.mcq?.map((q, i) => (
            <div key={i} className="exam-item glass-card">
              <p className="exam-q"><strong>Q{q.id}:</strong> {q.question}</p>
              <div className="exam-options">{q.options?.map((o, oi) => <div key={oi} className="exam-opt">{o}</div>)}</div>
              <p className="exam-answer">Answer: <strong>{q.correct_answer}</strong> — {q.explanation}</p>
            </div>
          ))}

          {/* Subjective */}
          {activeTab === 'subjective' && prediction.predicted_questions?.subjective?.map((q, i) => (
            <div key={i} className="exam-item glass-card">
              <p className="exam-q"><strong>Q{q.id}:</strong> {q.question} <span className="badge badge-accent">{q.marks} marks</span></p>
              <ul className="exam-keypoints">{q.key_points?.map((p, pi) => <li key={pi}>{p}</li>)}</ul>
            </div>
          ))}

          {/* Formulas */}
          {activeTab === 'formulas' && prediction.key_formulas?.map((f, i) => (
            <div key={i} className="exam-item glass-card">
              <h4>{f.name}</h4>
              <code className="exam-formula">{f.formula}</code>
              <p>{f.usage}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
