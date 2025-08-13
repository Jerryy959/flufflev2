import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import SpriteAnimation from './SpriteAnimation'

const HeroCard = () => {
  // 当前选择
  const [currentHero, setCurrentHero] = useState(0)
  const [currentHat, setCurrentHat] = useState(0)
  const [currentGlove, setCurrentGlove] = useState(0)

  // 角色列表
  const heroes = ['Mush', 'Rishi', 'Fluf']
  const hats = [
    'birdnest.png',
    'brownhat.png',
    'buckethat.png',
    'cap.png',
    'cowboy_hat.png',
    'crown.png',
    'crystal crown.png',
    'glasses.png',
    'hawaii flower.png',
    'hawaii orange.png',
    'navy hat.png',
    'navycap.png',
    'ninja headband.png',
    'pan.png',
    'pancake.png',
    'pinkbow.png',
    'redbow.png',
    'yellow hat.png',
  ]
  const gloves = [
    'Fries.png',
    'banana.png',
    'boba.png',
    'bottle of wine.png',
    'broom.png',
    'bunch flower.png',
    'carrot.png',
    'chainsow.png',
    'headphone.png',
    'icecream.png',
    'mc bag.png',
    'mc box.png',
    'microphone.png',
    'onion.png',
    'openbook.png',
    'sushi.png',
    'totebag.png',
    'trophy.png',
  ]

  // slice位置
  const [slicePositions, setSlicePositions] = useState({
    headSlice: null,
    handSlice: null,
  })

  // 镜像角色位置
  const [mirrorPos, setMirrorPos] = useState({ x: 1500, y: 500 })
  const mirrorScale = 0.3

  // 整体缩放比例
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / 1920
      const scaleY = window.innerHeight / 1080
      setScale(Math.min(scaleX, scaleY))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // 切换函数
  const switchHero = (direction) => {
    setCurrentHero((prev) =>
      direction === 'next'
        ? (prev + 1) % heroes.length
        : prev === 0
        ? heroes.length - 1
        : prev - 1
    )
  }
  const switchHat = (direction) => {
    setCurrentHat((prev) =>
      direction === 'next'
        ? (prev + 1) % hats.length
        : prev === 0
        ? hats.length - 1
        : prev - 1
    )
  }
  const switchGlove = (direction) => {
    setCurrentGlove((prev) =>
      direction === 'next'
        ? (prev + 1) % gloves.length
        : prev === 0
        ? gloves.length - 1
        : prev - 1
    )
  }

  // slice位置更新回调
  const handleSliceUpdate = (positions) => setSlicePositions(positions)

  // 点击背景移动镜像角色
  const handleBackgroundClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    const heroWidth = 256 * mirrorScale
    const heroHeight = 256 * mirrorScale

    setMirrorPos({
      x: Math.min(
        Math.max(clickX - heroWidth / 2, 0),
        window.innerWidth - heroWidth
      ),
      y: Math.min(
        Math.max(clickY - heroHeight / 2, 0),
        window.innerHeight - heroHeight
      ),
    })
  }

  // 键盘控制镜像角色
  useEffect(() => {
    const handleKeyDown = (e) => {
      const step = 10
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w')
        setMirrorPos((prev) => ({ ...prev, y: prev.y - step }))
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's')
        setMirrorPos((prev) => ({ ...prev, y: prev.y + step }))
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a')
        setMirrorPos((prev) => ({ ...prev, x: prev.x - step }))
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd')
        setMirrorPos((prev) => ({ ...prev, x: prev.x + step }))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {/* 背景视频 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-w-full min-h-full"
        style={{ right: '-12%', bottom: '-24%', objectFit: 'cover' }}
      >
        <source src="/assets/world/bg.webm" type="video/webm" />
      </video>

      {/* 整个 HeroCard + 镜像角色容器 */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* 卡片内容 */}
        <div
          className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm aspect-square m-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题 */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">英雄角色展示</h1>
            <p className="text-sm text-gray-600">点击箭头切换角色和装备</p>
          </div>

          {/* 角色展示区域 */}
          <div className="relative flex items-center justify-center h-64">
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

            {/* 镜像角色 */}
            <div
              className="absolute"
              style={{
                left: `${mirrorPos.x}px`,
                top: `${mirrorPos.y}px`,
                width: '256px',
                height: '256px',
                transform: `scale(${mirrorScale}) scaleX(-1)`,
                transformOrigin: 'top left',
                transition: 'left 0.3s ease-out, top 0.3s ease-out',
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

            {/* 左右箭头 */}
            <div className="absolute left-2 flex flex-col space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchHero('prev')}
              >
                {' '}
                <ChevronLeft />{' '}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchHat('prev')}
              >
                {' '}
                <ChevronLeft />{' '}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchGlove('prev')}
              >
                {' '}
                <ChevronLeft />{' '}
              </Button>
            </div>
            <div className="absolute right-2 flex flex-col space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchHero('next')}
              >
                {' '}
                <ChevronRight />{' '}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchHat('next')}
              >
                {' '}
                <ChevronRight />{' '}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchGlove('next')}
              >
                {' '}
                <ChevronRight />{' '}
              </Button>
            </div>
          </div>

          {/* 状态显示 */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-medium text-gray-700">角色:</span>
              <span className="text-sm font-bold text-purple-600">
                {heroes[currentHero]}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-medium text-gray-700">帽子:</span>
              <span className="text-sm font-bold text-blue-600">
                {hats[currentHat].replace('.png', '')}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-medium text-gray-700">武器:</span>
              <span className="text-sm font-bold text-orange-600">
                {gloves[currentGlove].replace('.png', '')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCard
