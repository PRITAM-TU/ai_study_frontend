import './LoadingSpinner.css'

export default function LoadingSpinner({ fullPage = false, size = 40, text = '' }) {
  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        <div className="spinner" style={{ width: size, height: size }} />
        {text && <p className="spinner-text">{text}</p>}
      </div>
    )
  }

  return (
    <div className="spinner-inline">
      <div className="spinner" style={{ width: size, height: size }} />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  )
}
