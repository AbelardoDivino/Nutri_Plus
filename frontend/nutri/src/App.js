import './App.css';
import Footer from './components/Footer';
import Login from './components/Login';
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar>  </Navbar>
      </header>
      <Login></Login>
      <Footer></Footer>
    </div>
  );
}

export default App;
