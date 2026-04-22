import { HiOutlineUser, HiOutlineCpuChip } from 'react-icons/hi2'
import './ChatMessage.css'

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user'

  return (
    <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-ai'} animate-fadeInUp`}>
      <div className="chat-avatar">
        {isUser ? <HiOutlineUser size={18} /> : <HiOutlineCpuChip size={18} />}
      </div>
      <div className="chat-bubble">
        <div className="chat-role">{isUser ? 'You' : 'StudyAI'}</div>
        <div className="chat-content">{content}</div>
      </div>
    </div>
  )
}
