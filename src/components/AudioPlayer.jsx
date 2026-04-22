import { useState, useRef, useEffect } from 'react'
import { HiPlay, HiPause, HiSpeakerWave } from 'react-icons/hi2'
import './AudioPlayer.css'

export default function AudioPlayer({ src, title = 'Audio' }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleTime = () => setCurrentTime(audio.currentTime)
    const handleDuration = () => setDuration(audio.duration)
    const handleEnded = () => setPlaying(false)
    audio.addEventListener('timeupdate', handleTime)
    audio.addEventListener('loadedmetadata', handleDuration)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', handleTime)
      audio.removeEventListener('loadedmetadata', handleDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [src])

  const togglePlay = () => {
    if (playing) { audioRef.current.pause() } else { audioRef.current.play() }
    setPlaying(!playing)
  }

  const handleSeek = (e) => {
    const time = (e.target.value / 100) * duration
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="audio-player glass-card" id="audio-player">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button className="audio-play-btn" onClick={togglePlay}>
        {playing ? <HiPause size={22} /> : <HiPlay size={22} />}
      </button>
      <div className="audio-info">
        <div className="audio-title"><HiSpeakerWave size={14} /><span>{title}</span></div>
        <div className="audio-progress-wrap">
          <input type="range" className="audio-progress" min="0" max="100" value={progress} onChange={handleSeek} />
        </div>
        <div className="audio-time"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
      </div>
    </div>
  )
}
