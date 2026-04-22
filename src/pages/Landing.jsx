import { Link } from 'react-router-dom'
import { HiOutlineChatBubbleLeftRight, HiOutlineAcademicCap, HiOutlineRectangleStack, HiOutlineMusicalNote, HiOutlineClipboardDocumentCheck, HiOutlineMicrophone } from 'react-icons/hi2'
import './Landing.css'

const features = [
  { icon: HiOutlineChatBubbleLeftRight, title: 'Smart Q&A', desc: 'Ask questions about your study materials and get instant, context-aware answers.' },
  { icon: HiOutlineAcademicCap, title: 'Quiz Generator', desc: 'Auto-generate quizzes with difficulty levels and instant scoring.' },
  { icon: HiOutlineRectangleStack, title: 'Flashcards', desc: 'AI-generated flashcards optimized for spaced repetition learning.' },
  { icon: HiOutlineClipboardDocumentCheck, title: 'Exam Mode', desc: 'Predict important questions and practice with MCQ + subjective questions.' },
  { icon: HiOutlineMusicalNote, title: 'Lazy Mode 🎧', desc: 'Convert your notes to audio — learn while relaxing.' },
  { icon: HiOutlineMicrophone, title: 'Voice Q&A', desc: 'Ask questions by voice and hear AI-generated answers.' },
]

export default function Landing() {
  return (
    <div className="landing" id="landing-page">
      <div className="landing-glow" />

      {/* Hero */}
      <header className="landing-hero animate-fadeIn">
        <div className="hero-badge badge badge-accent">🚀 AI-Powered Study Companion</div>
        <h1 className="hero-title">
          Study Smarter,<br />
          <span className="gradient-text">Not Harder</span>
        </h1>
        <p className="hero-subtitle">
          Upload your PDFs, notes, and presentations. Let AI generate quizzes, flashcards, summaries, and even audio lessons — all from your own study materials.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg" id="hero-get-started">
            Get Started Free
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg" id="hero-login">
            Sign In
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="landing-features">
        <h2 className="section-title">Everything You Need to <span className="gradient-text">Ace Your Exams</span></h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass-card animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon-wrap">
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta animate-fadeIn">
        <div className="cta-card glass-card">
          <h2>Ready to transform your study sessions?</h2>
          <p>Join thousands of students using AI to study more effectively.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Start Learning Now</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>🧠 StudyAI — Built with FastAPI + React + Ollama</p>
      </footer>
    </div>
  )
}
