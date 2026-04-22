import { useState, useRef, useEffect } from 'react'
import { HiPaperAirplane } from 'react-icons/hi2'
import api from '../api/client.js'
import ChatMessage from '../components/ChatMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import './Chat.css'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [docs, setDocs] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    api.get('/documents/').then(res => {
      setDocs(res.data.documents.filter(d => d.status === 'ready'))
    }).catch(() => {})
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const question = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setLoading(true)

    try {
      const res = await api.post('/rag/ask', {
        question,
        doc_id: selectedDoc,
        top_k: 5,
      })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.response?.data?.detail || 'Failed to get answer'}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-page animate-fadeIn" id="chat-page">
      <div className="page-header">
        <h1 className="page-title">💬 Chat Q&A</h1>
        <p className="page-subtitle">Ask questions about your study materials</p>
      </div>

      {/* Document selector */}
      <div className="chat-doc-select">
        <select className="input-field" value={selectedDoc || ''} onChange={e => setSelectedDoc(e.target.value ? parseInt(e.target.value) : null)} id="doc-selector">
          <option value="">All documents</option>
          {docs.map(d => (
            <option key={d.id} value={d.id}>{d.original_name}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <span className="chat-empty-icon">🧠</span>
            <h3>Start a conversation</h3>
            <p>Ask any question about your uploaded study materials</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && <LoadingSpinner text="Thinking..." />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="chat-input-bar glass-card" onSubmit={sendMessage}>
        <input ref={inputRef} type="text" className="chat-input" placeholder="Ask a question..." value={input} onChange={e => setInput(e.target.value)} disabled={loading} id="chat-input" />
        <button type="submit" className="btn btn-primary btn-icon" disabled={loading || !input.trim()} id="chat-send">
          <HiPaperAirplane size={18} />
        </button>
      </form>
    </div>
  )
}
