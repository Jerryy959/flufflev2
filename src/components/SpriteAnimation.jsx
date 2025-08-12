import { useState, useEffect, useRef } from 'react'

const SpriteAnimation = ({ heroName, className = '', onSliceUpdate }) => {
  const [animationData, setAnimationData] = useState(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const animationRef = useRef(null)

  // 加载动画数据
  useEffect(() => {
    const loadAnimationData = async () => {
      try {
        setIsLoaded(false)
        
        // 动态导入JSON文件
        const jsonModule = await import(`../assets/world/sprites/${heroName}/idle/${heroName}.json`)
        const data = jsonModule.default
        
        // 动态导入图片
        const imageModule = await import(`../assets/world/sprites/${heroName}/idle/${heroName}.png`)
        const imageSrc = imageModule.default
        
        setAnimationData(data)
        
        // 加载图片
        const img = new Image()
        img.onload = () => {
          imageRef.current = img
          setIsLoaded(true)
          setCurrentFrame(0)
        }
        img.src = imageSrc
        
      } catch (error) {
        console.error('Failed to load animation data:', error)
      }
    }

    if (heroName) {
      loadAnimationData()
    }
  }, [heroName])

  // 动画播放逻辑
  useEffect(() => {
    if (!animationData || !isLoaded) return

    const frames = Object.keys(animationData.frames)
    if (frames.length === 0) return

    const playAnimation = () => {
      const frameKey = frames[currentFrame]
      const frameData = animationData.frames[frameKey]
      const duration = frameData.duration || 100

      animationRef.current = setTimeout(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length)
      }, duration)
    }

    playAnimation()

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [animationData, currentFrame, isLoaded])

  // 绘制当前帧
  useEffect(() => {
    if (!animationData || !isLoaded || !imageRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const frames = Object.keys(animationData.frames)
    
    if (frames.length === 0) return

    const frameKey = frames[currentFrame]
    const frameData = animationData.frames[frameKey]
    const { x, y, w, h } = frameData.frame

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制当前帧
    ctx.drawImage(
      imageRef.current,
      x, y, w, h,  // 源图片的裁剪区域
      0, 0, canvas.width, canvas.height  // 目标画布的绘制区域
    )

    // 通知父组件slice位置更新
    if (onSliceUpdate) {
      const headSlice = getSlicePosition('head')
      const handSlice = getSlicePosition('hand')
      onSliceUpdate({ headSlice, handSlice })
    }
  }, [animationData, currentFrame, isLoaded, heroName, onSliceUpdate])

  // 获取头部和手部装备位置信息
  const getSlicePosition = (type) => {
    if (!animationData || !animationData.meta.slices) return null
    
    // 根据类型查找对应的slice
    const slice = animationData.meta.slices.find(s => {
      const sliceName = s.name.toLowerCase()
      if (type === 'head') {
        return sliceName.includes('head')
      } else if (type === 'hand') {
        return sliceName.includes('hand')
      }
      return false
    })
    
    if (!slice || !slice.keys) return null
    
    // 获取当前帧的位置信息
    const frameKey = slice.keys.find(key => key.frame === currentFrame)
    if (!frameKey) {
      // 如果当前帧没有位置信息，使用最近的帧
      const availableFrames = slice.keys.map(key => key.frame).sort((a, b) => a - b)
      if (availableFrames.length === 0) return null
      
      const closestFrame = availableFrames.reduce((prev, curr) => 
        Math.abs(curr - currentFrame) < Math.abs(prev - currentFrame) ? curr : prev
      )
      return slice.keys.find(key => key.frame === closestFrame)?.bounds || null
    }
    
    return frameKey.bounds
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={256}
        height={256}
        className="w-full h-full object-contain"
      />
    </div>
  )
}

export default SpriteAnimation
