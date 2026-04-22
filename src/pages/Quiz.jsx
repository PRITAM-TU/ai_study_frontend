import { useState, useEffect } from 'react'
import api from '../api/client.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import './Quiz.css'

export default function Quiz() {
  const [docs, setDocs] = useState([])
  const [selectedDoc, setSelectedDoc] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [numQuestions, setNumQuestions] = useState(10)
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/documents/').then(res => {
      setDocs(res.data.documents.filter(d => d.status === 'ready'))
    }).catch(() => {})
  }, [])

  const generateQuiz = async () => {
    if (!selectedDoc) return
    setLoading(true)
    setQuiz(null)
    setResult(null)
    setAnswers({})
    try {
      const res = await api.post('/ai/quiz', { doc_id: parseInt(selectedDoc), num_questions: numQuestions, difficulty })
      setQuiz(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Quiz generation failed')
    } finally {
      setLoading(false)
    }
  }

  const submitQuiz = async () => {
    try {
      const res = await api.post('/ai/quiz/score', { quiz, answers })
      setResult(res.data)
    } catch (err) {
      alert('Scoring failed')
    }
  }

  return (
    <div className="quiz-page animate-fadeIn" id="quiz-page">
      <div className="page-header">
        <h1 className="page-title">📝 Quiz Generator</h1>
        <p className="page-subtitle">Test your knowledge with AI-generated quizzes</p>
      </div>

      {/* Controls */}
      <div className="quiz-controls glass-card">
        <div className="quiz-control-row">
          <div className="input-group" style={{marginBottom: 0, flex: 1}}>
            <label className="input-label">Document</label>
            <select className="input-field" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)} id="quiz-doc-select">
              <option value="">Select a document</option>
              {docs.map(d => <option key={d.id} value={d.id}>{d.original_name}</option>)}
            </select>
          </div>
          <div className="input-group" style={{marginBottom: 0}}>
            <label className="input-label">Difficulty</label>
            <select className="input-field" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="input-group" style={{marginBottom: 0}}>
            <label className="input-label">Questions</label>
            <input type="number" className="input-field" value={numQuestions} onChange={e => setNumQuestions(parseInt(e.target.value))} min={3} max={30} />
          </div>
          <button className="btn btn-primary" onClick={generateQuiz} disabled={!selectedDoc || loading} id="generate-quiz">
            {loading ? 'Generating...' : 'Generate Quiz'}
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner text="Creating your quiz..." />}

      {/* Quiz */}
      {quiz && !result && (
        <div className="quiz-questions">
          <h2 className="quiz-title">{quiz.quiz_title}</h2>
          {quiz.questions.map((q, i) => (
            <div key={q.id} className="quiz-question glass-card animate-fadeInUp" style={{animationDelay: `${i * 0.05}s`}}>
              <div className="quiz-q-header">
                <span className="quiz-q-number">Q{i + 1}</span>
                <span className="badge badge-accent">{q.type.toUpperCase()}</span>
              </div>
              <p className="quiz-q-text">{q.question}</p>
              {q.options && q.options.length > 0 ? (
                <div className="quiz-options">
                  {q.options.map((opt, oi) => {
                    const key = opt.charAt(0)
                    return (
                      <label key={oi} className={`quiz-option ${answers[String(q.id)] === key ? 'quiz-option-selected' : ''}`}>
                        <input type="radio" name={`q-${q.id}`} value={key} checked={answers[String(q.id)] === key} onChange={() => setAnswers(prev => ({...prev, [String(q.id)]: key}))} />
                        <span>{opt}</span>
                      </label>
                    )
                  })}
                </div>
              ) : (
                <div className="quiz-options">
                  {['True', 'False'].map(v => (
                    <label key={v} className={`quiz-option ${answers[String(q.id)] === v.toUpperCase() ? 'quiz-option-selected' : ''}`}>
                      <input type="radio" name={`q-${q.id}`} value={v.toUpperCase()} checked={answers[String(q.id)] === v.toUpperCase()} onChange={() => setAnswers(prev => ({...prev, [String(q.id)]: v.toUpperCase()}))} />
                      <span>{v}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button className="btn btn-primary btn-lg" onClick={submitQuiz} id="submit-quiz" style={{marginTop: '1rem'}}>
            Submit Quiz
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="quiz-results animate-scaleIn">
          <div className="quiz-score-card glass-card">
            <h2>Quiz Results</h2>
            <div className="quiz-score-big gradient-text">{result.score_percentage}%</div>
            <p>{result.correct} / {result.total_questions} correct</p>
          </div>
          {result.results.map((r, i) => (
            <div key={i} className={`quiz-result-item glass-card ${r.is_correct ? 'result-correct' : 'result-wrong'}`}>
              <p className="quiz-q-text"><strong>Q{i+1}:</strong> {r.question}</p>
              <p>Your answer: <strong>{r.user_answer || '(none)'}</strong> | Correct: <strong>{r.correct_answer}</strong></p>
              <p className="quiz-explanation">{r.explanation}</p>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={() => { setQuiz(null); setResult(null); setAnswers({}) }}>
            Take Another Quiz
          </button>
        </div>
      )}
    </div>
  )
}
