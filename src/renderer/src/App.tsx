import Clipboard from './components/Clipboard'
import Footer from './components/Footer'
import { Header } from './components/Header'
import { useTheme } from './hooks/useTheme'

const App = () => {
  useTheme()

  return (
    <div className="flex flex-col h-screen overflow-hidden
      bg-white/90 dark:bg-gray-900/90
      text-gray-900 dark:text-gray-100">
      <Header />
      <Clipboard />
      <Footer />
    </div>
  )
}

export default App