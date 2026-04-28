# 🧠 AI Study Companion — Full Setup Guide

> AI-powered SaaS for students: upload PDFs/PPTs/Notes → get quizzes, flashcards, summaries, exam predictions, and audio lessons — all powered by  AI (Groq).

---

## 📁 Project Structure

```
AI_WITH_PYTHON/
├── backend/                          # FastAPI + AI Pipeline
│   ├── app/
│   │   ├── main.py                   # FastAPI entry point
│   │   ├── config.py                 # Environment config
│   │   ├── database.py               # MongoDB
│   │   ├── auth/                     # JWT Authentication
│   │   ├── documents/                # PDF/PPTX upload & parsing
│   │   ├── rag/                      # RAG pipeline (chunk → embed → search)
│   │   ├── ai_features/              # Summary, Quiz, Flashcards, Exam Mode
│   │   ├── audio/                    # TTS (edge-tts) 
│   │   └── utils/                    # Custom exceptions
│   ├── requirements.txt
│   ├── .env
│   └── run.py                        # Server launcher
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── pages/                    # Landing, Login, Dashboard, Chat, Quiz, etc.
│   │   ├── components/               # Navbar, Sidebar, FileUpload, AudioPlayer, etc.
│   │   ├── context/                  # Auth + Theme providers
│   │   └── api/                      # Axios client with JWT
│   └── index.html
│
└── README.md
```

---

## ⚙️ Architecture

```
User → React Frontend → FastAPI Backend → Ollama (Local LLM)
                              │
                    ┌─────────┼──────────┐
                    ▼         ▼          ▼
               Document    FAISS      MongoDB
               Parser    Vectors    User Data
```

### Data Flow
```
PDF Upload → PyMuPDF Parse → Chunk (500 chars) → Embed (MiniLM) → FAISS Store
Question → Embed → FAISS Search (top 5) → Context + Prompt → Groq → Answer
```

---

## 🚀 How to Run

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Ollama** (for local LLM)

### Step 1: Install Groq & Pull Model
```bash
# Install Groq run with the help of API KEY

### Step 2: Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
python run.py
```
Backend runs at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

### Step 3: Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login (returns JWT) |
| `/auth/me` | GET | Get current user |
| `/documents/upload` | POST | Upload PDF/PPTX/TXT |
| `/documents/` | GET | List user documents |
| `/documents/{id}` | DELETE | Delete a document |
| `/rag/ask` | POST | Ask a question (RAG) |
| `/ai/summary` | POST | Generate summary |
| `/ai/quiz` | POST | Generate quiz |
| `/ai/quiz/score` | POST | Score a quiz |
| `/ai/flashcards` | POST | Generate flashcards |
| `/ai/exam-mode` | POST | Predict exam questions |
| `/ai/lazy-mode` | POST | Generate audio script |
| `/audio/tts` | POST | Text-to-speech |
| `/audio/voice-qa` | POST | Voice Q&A pipeline |
| `/audio/voices` | GET | List TTS voices |

---

## 🧠 AI Pipeline

| Feature | Pipeline |
|---------|----------|
| **Q&A** | Query → Embed → FAISS search → Top-5 chunks → Ollama → Answer |
| **Summary** | All chunks → Groq (summary prompt) → Structured JSON |
| **Quiz** | All chunks → groq (quiz prompt) → MCQ/TF + scoring |
| **Flashcards** | All chunks → groq (flashcard prompt) → Q/A pairs |
| **Exam Mode** | All chunks → groq (analysis prompt) → Predictions |
| **Lazy Mode** | All chunks → groq (script prompt) → edge-tts → MP3 |
| **Voice Q&A** | Audio → Whisper STT → RAG pipeline → edge-tts → Audio |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI, mongodb, Pydantic |
| Auth | JWT (PyJWT + bcrypt) |
| Database | mongoDB (async via aiosqlite) |
| LLM | groq |
| Embeddings | sentence-transformers (MiniLM-L6-v2) |
| Vector DB | FAISS (faiss-cpu) |
| Doc Parsing | PyMuPDF, python-pptx |
| TTS | edge-tts (Microsoft Edge voices) |
| STT | OpenAI Whisper (tiny model) |
| Frontend | React 19, Vite, React Router |
| Styling | Vanilla CSS (custom design system) |
| HTTP | Axios (JWT interceptors) |

---

## 📦 Future Improvements

- [ ] PostgreSQL migration for production
- [ ] Redis caching for LLM responses
- [ ] WebSocket for real-time chat streaming
- [ ] User study analytics and progress tracking
- [ ] Spaced repetition scheduling for flashcards
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] S3 file storage
- [ ] Docker + Docker Compose
- [ ] Rate limiting and API quotas
- [ ] Admin dashboard
- [ ] Social sharing of quizzes
