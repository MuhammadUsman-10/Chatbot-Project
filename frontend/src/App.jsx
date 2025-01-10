import Layout from "./components/Layout/layout"
import './App.css'
import { DarkModeProvider } from "./components/Context/DarkModeContext"
// import SpeechToText from "./components/UI/Audio"

function App() {
  return (
    <>
      <DarkModeProvider>
        <Layout />
      </DarkModeProvider>
    </>
  )
}

export default App
