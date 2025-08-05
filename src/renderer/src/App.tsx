
import Clipboard from './components/Clipboard';
import Footer from './components/Footer';
import { Header } from './components/Header';


const App = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 overflow-auto">
        <Clipboard />
      </div>
      <Footer/>
    </div>
  )

};

export default App;