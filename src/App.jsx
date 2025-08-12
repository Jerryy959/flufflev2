import HeroCard from './components/HeroCard'
import Player from './components/Player'
import './App.css'

function App() {
  return (
    <div>
      <HeroCard />
      <Player />
      {/* <DayNightProvider>
        <BackgroundToggle
          toggleBackground={(isDay) => console.log('背景切换', isDay)}
        />
      </DayNightProvider> */}
    </div>
  )
}

export default App
