import { useState } from 'react'
import { useDayNight } from './DayNightContext' // 使用全局状态

export default function BackgroundToggle({ toggleBackground }) {
  const { isDay, toggleDayNight } = useDayNight()
  const [animating, setAnimating] = useState(false)

  const handleClick = () => {
    if (animating) return

    setAnimating(true)

    // 先让当前图标滑出
    setTimeout(() => {
      toggleDayNight() // 切换白天/夜晚状态
      toggleBackground(isDay) // 通知父组件背景切换
    }, 300) // 图标滑出后再切换背景

    // 动画结束后解锁点击
    setTimeout(() => {
      setAnimating(false)
    }, 800)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '160px',
        right: '30px',
        width: '60px',
        height: '25px',
        borderRadius: '15px',
        backgroundColor: isDay ? '#fff' : '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'background-color 0.6s ease',
      }}
    >
      {/* 小太阳 */}
      {isDay && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            right: '5px',
            transform: animating ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
          }}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}

      {/* 小云朵 */}
      {!isDay && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDay ? '#000' : '#fff'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            left: '-20px',
            transform: animating ? 'translateX(120%)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d="M20.39 15.61A4.992 4.992 0 0019 10a5 5 0 00-9.4-3.39A5.003 5.003 0 003 12a5 5 0 0010 0c0 1.09.45 2.08 1.18 2.82 1.35-.48 2.82-.82 4.21-.58.39-.32.61-.72.61-1.14-.01-.75-.56-1.39-1.4-1.49z" />
        </svg>
      )}
    </div>
  )
}
