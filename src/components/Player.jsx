import { useState } from 'react'
import './Player.css'
const MUSIC_URL =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const handleClick = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div
      className="player"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img
        src={
          isPlaying
            ? '/assets/player/playing.webp'
            : '/assets/player/pausing.webp'
        }
        alt={isPlaying ? 'Playing' : 'Paused'}
        className={isHovered ? 'hovered' : ''}
      />
    </div>
  )
}
