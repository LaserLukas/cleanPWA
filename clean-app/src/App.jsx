import './App.scss'
import StartingPage from './pages/home'

function App() {

  console.log(`started in ${import.meta.env.MODE} mode`)
  return (
    <>
      <StartingPage />
    </>
  )
}

export default App
