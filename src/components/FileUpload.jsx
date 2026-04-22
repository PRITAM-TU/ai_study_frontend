import { useState, useRef } from 'react'
import { HiOutlineCloudArrowUp, HiOutlineDocument } from 'react-icons/hi2'
import api from '../api/client.js'
import './FileUpload.css'

export default function FileUpload({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else {
      setDragActive(false)
    }
  }

  const handleUpload = async (file) => {
    if (!file) return
    setError(null)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (onUploadSuccess) onUploadSuccess(res.data.document)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    handleUpload(file)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    handleUpload(file)
  }

  return (
    <div
      className={`upload-zone glass-card ${dragActive ? 'upload-zone-active' : ''} ${uploading ? 'upload-zone-uploading' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      id="file-upload-zone"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.pptx,.txt"
        onChange={handleChange}
        style={{ display: 'none' }}
        id="file-input"
      />

      <div className="upload-icon">
        {uploading ? (
          <div className="spinner" style={{ width: 48, height: 48 }} />
        ) : (
          <HiOutlineCloudArrowUp size={48} />
        )}
      </div>

      <h3 className="upload-title">
        {uploading ? 'Processing your document...' : 'Drop your study material here'}
      </h3>

      <p className="upload-subtitle">
        {uploading ? 'Parsing, chunking, and embedding' : 'or click to browse — PDF, PPTX, TXT (max 50MB)'}
      </p>

      {error && <p className="upload-error">{error}</p>}

      <div className="upload-formats">
        <span className="upload-format-badge"><HiOutlineDocument size={14} /> PDF</span>
        <span className="upload-format-badge"><HiOutlineDocument size={14} /> PPTX</span>
        <span className="upload-format-badge"><HiOutlineDocument size={14} /> TXT</span>
      </div>
    </div>
  )
}
