import { useState, useEffect, useRef } from 'react'
import SpriteAnimation from './SpriteAnimation'

const MirrorHero = ({ heroState }) => {
  const [slicePositions, setSlicePositions] = useState({ headSlice: null, handSlice: null })
  const [isChanging, setIsChanging] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 }) // 初始位置（百分比）
  const [isMoving, setIsMoving] = useState(false)
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 })
  const animationRef = useRef(null)

  // 监听状态变化，添加变化动画
  useEffect(() => {
    setIsChanging(true)
    const timer = setTimeout(() => setIsChanging(false), 500)
    return () => clearTimeout(timer)
  }, [heroState.currentHero, heroState.currentHat, heroState.currentGlove])

  // slice位置更新回调
  const handleSliceUpdate = (positions) => {
    setSlicePositions(positions)
  }

  // 平滑移动动画函数
  const animateMovement = (startPos, endPos, duration = 1000) => {
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 使用缓动函数 (easeInOutCubic)
      const easeProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      
      const currentX = startPos.x + (endPos.x - startPos.x) * easeProgress
      const currentY = startPos.y + (endPos.y - startPos.y) * easeProgress
      
      setPosition({ x: currentX, y: currentY })
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsMoving(false)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }

  // 处理页面点击事件
  const handlePageClick = (event) => {
    // 阻止在控制卡片上的点击
    if (event.target.closest('.hero-control-card')) {
      return
    }
    
    // 获取页面尺寸
    const pageWidth = window.innerWidth
    const pageHeight = window.innerHeight
    
    // 计算点击位置的百分比
    const clickX = (event.clientX / pageWidth) * 100
    const clickY = (event.clientY / pageHeight) * 100
    
    // 边界限制
    const boundedX = Math.max(5, Math.min(95, clickX))
    const boundedY = Math.max(5, Math.min(95, clickY))
    
    // 设置移动状态和目标位置
    setIsMoving(true)
    setTargetPosition({ x: boundedX, y: boundedY })
    
    // 取消之前的动画
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    // 开始平滑移动动画
    animateMovement(position, { x: boundedX, y: boundedY }, 1200)
  }

  // 添加页面点击监听器
  useEffect(() => {
    document.addEventListener('click', handlePageClick)
    return () => {
      document.removeEventListener('click', handlePageClick)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [position])

  return (
    <>
      {/* 小尺寸可移动角色 */}
      <div 
        className={`fixed z-50 pointer-events-none transition-transform duration-300 ease-out ${isMoving ? 'scale-110' : 'scale-100'}`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
          width: '64px',
          height: '64px'
        }}
      >
        {/* 动态背景粒子 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-white/40 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-0.5 h-0.5 bg-white/20 rounded-full animate-ping delay-2000"></div>
        </div>
        
        {/* 底部小阴影 */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black/20 rounded-full blur-sm"></div>
        
        {/* 角色精灵图 */}
        <div className={`transition-all duration-500 ${isChanging ? 'scale-110 rotate-1' : 'scale-100 rotate-0'}`}>
          <SpriteAnimation 
            heroName={heroState.currentHero} 
            className="w-full h-full transition-all duration-500 ease-in-out"
            onSliceUpdate={handleSliceUpdate}
          />
        </div>
        
        {/* 头饰装备 */}
        {slicePositions.headSlice && (
          <img
            src={`/assets/world/hat/${heroState.currentHat}`}
            alt="头饰"
            className={`absolute pointer-events-none transition-all duration-500 ease-in-out ${isChanging ? 'scale-110 rotate-1' : 'scale-100 rotate-0'}`}
            style={{
              left: `${(slicePositions.headSlice.x / 256) * 100}%`,
              top: `${(slicePositions.headSlice.y / 256) * 100}%`,
              width: `${(slicePositions.headSlice.w / 256) * 100}%`,
              height: `${(slicePositions.headSlice.h / 256) * 100}%`,
            }}
          />
        )}
        
        {/* 手提物装备 */}
        {slicePositions.handSlice && (
          <img
            src={`/assets/world/gloves/${heroState.currentGlove}`}
            alt="手提物"
            className={`absolute pointer-events-none transition-all duration-500 ease-in-out ${isChanging ? 'scale-110 rotate-1' : 'scale-100 rotate-0'}`}
            style={{
              left: `${(slicePositions.handSlice.x / 256) * 100}%`,
              top: `${(slicePositions.handSlice.y / 256) * 100}%`,
              width: `${(slicePositions.handSlice.w / 256) * 100}%`,
              height: `${(slicePositions.handSlice.h / 256) * 100}%`,
            }}
          />
        )}
        
        {/* 移动时的光效 */}
        {isMoving && (
          <>
            <div className="absolute inset-0 rounded-full border border-white/50 animate-ping"></div>
            <div className="absolute top-1 left-1 w-2 h-2 bg-white/20 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/30 rounded-full blur-sm animate-pulse delay-500"></div>
            {/* 移动轨迹效果 */}
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
          </>
        )}
        
        {/* 环绕光环效果 */}
        <div className="absolute -inset-2 rounded-full border border-white/10 animate-spin-slow"></div>
        <div className="absolute -inset-3 rounded-full border border-white/5 animate-spin-slow-reverse"></div>
      </div>

      {/* 角色信息展示 - 保持在原位置，添加控制卡片类名 */}
      <div className="mt-4 text-center hero-control-card">
        <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20 transition-all duration-500 ${isChanging ? 'bg-white/20 border-white/40' : ''}`}>
          <h2 className="text-xl font-bold text-white mb-1 transition-all duration-300">{heroState.currentHero}</h2>
          <div className="flex items-center justify-center space-x-4 text-sm text-white/80">
            <div className="flex items-center space-x-1 transition-all duration-300 hover:text-white">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span>{heroState.currentHat.replace('.png', '')}</span>
            </div>
            <div className="flex items-center space-x-1 transition-all duration-300 hover:text-white">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse delay-500"></div>
              <span>{heroState.currentGlove.replace('.png', '')}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-white/60">
            点击页面任意位置移动角色
          </div>
          {isMoving && (
            <div className="mt-1 text-xs text-yellow-300 animate-pulse">
              角色移动中...
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MirrorHero