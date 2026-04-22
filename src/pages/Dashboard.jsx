import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineDocument, HiOutlineTrash, HiOutlineChatBubbleLeftRight, HiOutlineAcademicCap, HiOutlineRectangleStack, HiOutlineClipboardDocumentCheck, HiOutlineMusicalNote } from 'react-icons/hi2'
import api from '../api/client.js'
import FileUpload from '../components/FileUpload.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import './Dashboard.css'

const quickActions = [
  { path: '/chat', icon: HiOutlineChatBubbleLeftRight, label: 'Chat Q&A', color: '#6c63ff' },
  { path: '/quiz', icon: HiOutlineAcademicCap, label: 'Quiz', color: '#10b981' },
  { path: '/flashcards', icon: HiOutlineRectangleStack, label: 'Flashcards', color: '#f59e0b' },
  { path: '/exam-mode', icon: HiOutlineClipboardDocumentCheck, label: 'Exam Mode', color: '#ef4444' },
  { path: '/lazy-mode', icon: HiOutlineMusicalNote, label: 'Lazy Mode', color: '#a855f7' },
]

export default function Dashboard() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDocs = async () => {
    try {
      const res = await api.get('/documents/')
      setDocuments(res.data.documents)
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDocs() }, [])

  const handleUploadSuccess = (doc) => {
    setDocuments(prev => [doc, ...prev])
  }

  const handleDelete = async (docId) => {
    if (!confirm('Delete this document?')) return
    try {
      await api.delete(`/documents/${docId}`)
      setDocuments(prev => prev.filter(d => d.id !== docId))
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="dashboard animate-fadeIn" id="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Upload study materials and explore AI features</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((a) => (
          <Link key={a.path} to={a.path} className="quick-action-card glass-card" id={`quick-${a.path.slice(1)}`}>
            <div className="quick-action-icon" style={{ background: `${a.color}15`, color: a.color }}>
              <a.icon size={22} />
            </div>
            <span className="quick-action-label">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Upload */}
      <section className="dashboard-section">
        <h2 className="section-heading">Upload Material</h2>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </section>

      {/* Documents */}
      <section className="dashboard-section">
        <h2 className="section-heading">Your Documents ({documents.length})</h2>
        {loading ? (
          <LoadingSpinner text="Loading documents..." />
        ) : documents.length === 0 ? (
          <div className="empty-state glass-card">
            <HiOutlineDocument size={48} />
            <p>No documents yet. Upload your first study material!</p>
          </div>
        ) : (
          <div className="doc-grid">
            {documents.map((doc) => (
              <div key={doc.id} className="doc-card glass-card">
                <div className="doc-card-header">
                  <div className="doc-icon">
                    <HiOutlineDocument size={20} />
                  </div>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(doc.id)} title="Delete">
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
                <h4 className="doc-name">{doc.original_name}</h4>
                <div className="doc-meta">
                  <span className={`badge ${doc.status === 'ready' ? 'badge-success' : doc.status === 'failed' ? 'badge-error' : 'badge-warning'}`}>
                    {doc.status}
                  </span>
                  <span>{formatSize(doc.file_size)}</span>
                  <span>{doc.chunk_count} chunks</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
