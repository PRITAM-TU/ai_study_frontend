import { useState, useEffect } from 'react'
import api, { API_BASE_URL } from '../api/client.js'
import AudioPlayer from '../components/AudioPlayer.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import './LazyMode.css'

export default function LazyMode() {
  const [docs, setDocs] = useState([])
  const [selectedDoc, setSelectedDoc] = useState('')
  const [script, setScript] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ttsLoading, setTtsLoading] = useState(false)

  useEffect(() => {
    api.get('/documents/').then(res => setDocs(res.data.documents.filter(d => d.status === 'ready'))).catch(() => {})
  }, [])

  const generateScript = async () => {
    if (!selectedDoc) return
    setLoading(true)
    setScript(null)
    setAudioUrl(null)
    try {
      const res = await api.post('/ai/lazy-mode', { doc_id: parseInt(selectedDoc) })
      setScript(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to generate script')
    } finally {
      setLoading(false)
    }
  }

  const generateAudio = async () => {
    if (!script?.full_script) return
    setTtsLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${API_BASE_URL}/audio/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text: script.full_script }),
      })
      if (!res.ok) throw new Error('TTS failed')
      const blob = await res.blob()
      setAudioUrl(URL.createObjectURL(blob))
    } catch (err) {
      alert('Audio generation failed: ' + err.message)
    } finally {
      setTtsLoading(false)
    }
  }

  return (
    <div className="lazy-page animate-fadeIn" id="lazy-mode-page">
      <div className="page-header">
        <h1 className="page-title">🎧 Lazy Mode</h1>
        <p className="page-subtitle">Convert your study materials to audio — learn while relaxing</p>
      </div>

      <div className="lazy-controls glass-card">
        <select className="input-field" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)} style={{maxWidth: 300}}>
          <option value="">Select a document</option>
          {docs.map(d => <option key={d.id} value={d.id}>{d.original_name}</option>)}
        </select>
        <button className="btn btn-primary" onClick={generateScript} disabled={!selectedDoc || loading}>
          {loading ? 'Generating Script...' : '📝 Generate Script'}
        </button>
      </div>

      {loading && <LoadingSpinner text="Creating your audio script..." />}

      {script && (
        <div className="lazy-content">
          <div className="lazy-header glass-card">
            <h2>{script.title}</h2>
            <p>Est. duration: ~{script.estimated_duration_minutes} min</p>
            <button className="btn btn-primary" onClick={generateAudio} disabled={ttsLoading} style={{marginTop: '1rem'}}>
              {ttsLoading ? 'Converting to Audio...' : '🔊 Convert to Audio'}
            </button>
          </div>

          {ttsLoading && <LoadingSpinner text="Generating audio with edge-tts..." />}

          {audioUrl && (
            <div className="lazy-audio">
              <AudioPlayer src={audioUrl} title={script.title} />
            </div>
          )}

          <div className="lazy-sections">
            {script.sections?.map((s, i) => (
              <div key={i} className="lazy-section glass-card animate-fadeInUp" style={{animationDelay: `${i * 0.1}s`}}>
                <h3>📖 {s.title}</h3>
                <p className="lazy-script-text">{s.script}</p>
                {s.key_takeaways?.length > 0 && (
                  <div className="lazy-takeaways">
                    <h4>Key Takeaways</h4>
                    <ul>{s.key_takeaways.map((t, ti) => <li key={ti}>{t}</li>)}</ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
