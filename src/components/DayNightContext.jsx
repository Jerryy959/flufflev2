import React, { createContext, useContext, useState } from 'react'

// 创建一个 Context
export const DayNightContext = createContext(null)

export const useDayNight = () => {
  const context = useContext(DayNightContext)
  if (!context) {
    throw new Error('useDayNight 必须在 DayNightProvider 中使用')
  }
  return context
}

// 提供者组件
export default DayNightProvider = ({ children }) => {
  const [isDay, setIsDay] = useState(true) // 默认白天

  const toggleDayNight = () => {
    setIsDay((prev) => !prev)
  }

  return (
    <DayNightContext.Provider value={{ isDay, toggleDayNight }}>
      {children}
    </DayNightContext.Provider>
  )
}
