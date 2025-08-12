import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import SpriteAnimation from './SpriteAnimation'

const HeroCard = () => {
  const [currentHero, setCurrentHero] = useState(0)
  const [currentHat, setCurrentHat] = useState(0)
  const [currentGlove, setCurrentGlove] = useState(0)
  const [slicePositions, setSlicePositions] = useState({ headSlice: null, handSlice: null })

  // 镜像角色位置
  const [mirrorX, setMirrorX] = useState(1500) // 初始X位置
  const [mirrorY, setMirrorY] = useState(500) // 初始Y位置
  const mirrorScale = 0.3 // <<< 调整镜像角色大小 (0.4 = 40%)

  // 角色列表
  const heroes = ['Mush', 'Rishi', 'Fluf']
  
  // 帽子列表
  const hats = [
    'birdnest.png', 'brownhat.png', 'buckethat.png', 'cap.png', 'cowboy_hat.png',
    'crown.png', 'crystal crown.png', 'glasses.png', 'hawaii flower.png', 'hawaii orange.png',
    'navy hat.png', 'navycap.png', 'ninja headband.png', 'pan.png', 'pancake.png',
    'pinkbow.png', 'redbow.png', 'yellow hat.png'
  ]
  
  // 武器列表
  const gloves = [
    'Fries.png', 'banana.png', 'boba.png', 'bottle of wine.png', 'broom.png',
    'bunch flower.png', 'carrot.png', 'chainsow.png', 'headphone.png', 'icecream.png',
    'mc bag.png', 'mc box.png', 'microphone.png', 'onion.png', 'openbook.png',
    'sushi.png', 'totebag.png', 'trophy.png'
  ]

  // 切换函数
  const switchHero = (direction) => {
    setCurrentHero(prev => {
      if (direction === 'next') {
        return (prev + 1) % heroes.length
      } else {
        return prev === 0 ? heroes.length - 1 : prev - 1
      }
    })
  }

  const switchHat = (direction) => {
    setCurrentHat(prev => {
      if (direction === 'next') {
        return (prev + 1) % hats.length
      } else {
        return prev === 0 ? hats.length - 1 : prev - 1
      }
    })
  }

  const switchGlove = (direction) => {
    setCurrentGlove(prev => {
      if (direction === 'next') {
        return (prev + 1) % gloves.length
      } else {
        return prev === 0 ? gloves.length - 1 : prev - 1
      }
    })
  }

  // slice位置更新回调
  const handleSliceUpdate = (positions) => {
    setSlicePositions(positions)
  }

  // 监听键盘控制镜像角色
  useEffect(() => {
    const handleKeyDown = (e) => {
      const step = 10
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') setMirrorY(prev => prev - step)
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') setMirrorY(prev => prev + step)
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') setMirrorX(prev => prev - step)
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') setMirrorX(prev => prev + step)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className="relative flex items-start justify-start min-h-screen p-4 overflow-hidden"
      style={{
        paddingTop: '5%',
        paddingLeft: '5%'
      }}
    >
      {/* 背景视频 */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-auto h-auto min-w-screen min-h-screen"
          style={{
            transform: 'translate(12%, 24%)'
          }}
        >
          <source src="/assets/world/bg.webm" type="video/webm" />
        </video>
      </div>

      {/* 卡片内容 */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm aspect-square"
        style={{
          transform: 'scale(0.6)',
          transformOrigin: 'top left'
        }}
      >
        {/* 标题 */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">英雄角色展示</h1>
          <p className="text-sm text-gray-600">点击箭头切换角色和装备</p>
        </div>
        
        {/* 角色展示区域 */}
        <div className="relative flex items-center justify-center h-64">
          {/* 主角色 */}
          <div className="relative w-64 h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-inner border-2 border-gray-200">
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-600 opacity-30 rounded-full blur-sm"></div>
            
            <SpriteAnimation 
              heroName={heroes[currentHero]} 
              className="w-full h-full transition-all duration-300"
              onSliceUpdate={handleSliceUpdate}
            />
            
            {/* 帽子装备 */}
            {slicePositions.headSlice && (
              <img
                src={`/assets/world/hat/${hats[currentHat]}`}
                alt="帽子"
                className="absolute pointer-events-none transition-all duration-300 ease-in-out"
                style={{
                  left: `${(slicePositions.headSlice.x / 256) * 100}%`,
                  top: `${(slicePositions.headSlice.y / 256) * 100}%`,
                  width: `${(slicePositions.headSlice.w / 256) * 100}%`,
                  height: `${(slicePositions.headSlice.h / 256) * 100}%`,
                }}
              />
            )}
            
            {/* 武器装备 */}
            {slicePositions.handSlice && (
              <img
                src={`/assets/world/gloves/${gloves[currentGlove]}`}
                alt="武器"
                className="absolute pointer-events-none transition-all duration-300 ease-in-out"
                style={{
                  left: `${(slicePositions.handSlice.x / 256) * 100}%`,
                  top: `${(slicePositions.handSlice.y / 256) * 100}%`,
                  width: `${(slicePositions.handSlice.w / 256) * 100}%`,
                  height: `${(slicePositions.handSlice.h / 256) * 100}%`,
                }}
              />
            )}
          </div>

          {/* 镜像可控角色 */}
<div 
  className="absolute"
  style={{
    transform: `translate(${mirrorX}px, ${mirrorY}px) scale(${mirrorScale}) scaleX(-1)`,
    transformOrigin: 'top left', // 让缩放以左上角为基准
    top: '0',
    left: '0',
    width: '256px', // 原始角色宽度
    height: '256px' // 原始角色高度
  }}
>
  <SpriteAnimation 
    heroName={heroes[currentHero]} 
    className="w-full h-full"
    onSliceUpdate={() => {}}
  />
  {slicePositions.headSlice && (
    <img
      src={`/assets/world/hat/${hats[currentHat]}`}
      alt="帽子"
      className="absolute pointer-events-none"
      style={{
        left: `${(slicePositions.headSlice.x / 256) * 100}%`,
        top: `${(slicePositions.headSlice.y / 256) * 100}%`,
        width: `${(slicePositions.headSlice.w / 256) * 100}%`,
        height: `${(slicePositions.headSlice.h / 256) * 100}%`,
      }}
    />
  )}
  {slicePositions.handSlice && (
    <img
      src={`/assets/world/gloves/${gloves[currentGlove]}`}
      alt="武器"
      className="absolute pointer-events-none"
      style={{
        left: `${(slicePositions.handSlice.x / 256) * 100}%`,
        top: `${(slicePositions.handSlice.y / 256) * 100}%`,
        width: `${(slicePositions.handSlice.w / 256) * 100}%`,
        height: `${(slicePositions.handSlice.h / 256) * 100}%`,
      }}
    />
  )}
</div>
          
          {/* 左侧箭头组 */}
          <div className="absolute left-2 flex flex-col space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchHero('prev')}
              className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
              title="切换角色"
            >
              <ChevronLeft className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchHat('prev')}
              className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
              title="切换帽子"
            >
              <ChevronLeft className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchGlove('prev')}
              className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
              title="切换武器"
            >
              <ChevronLeft className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
            </Button>
          </div>
          
          {/* 右侧箭头组 */}
          <div className="absolute right-2 flex flex-col space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchHero('next')}
              className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
              title="切换角色"
            >
              <ChevronRight className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchHat('next')}
              className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
              title="切换帽子"
            >
              <ChevronRight className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchGlove('next')}
              className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
              title="切换武器"
            >
              <ChevronRight className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
            </Button>
          </div>
        </div>
        
        {/* 状态显示 */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-700">角色:</span>
            <span className="text-sm font-bold text-purple-600">{heroes[currentHero]}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-700">帽子:</span>
            <span className="text-sm font-bold text-blue-600">{hats[currentHat].replace('.png', '')}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-700">武器:</span>
            <span className="text-sm font-bold text-orange-600">{gloves[currentGlove].replace('.png', '')}</span>
          </div>
        </div>
        
        {/* 操作说明 */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-purple-200"></div>
              <span>角色</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-200"></div>
              <span>帽子</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-orange-200"></div>
              <span>武器</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCard
