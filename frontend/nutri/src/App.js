import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar>  </Navbar>
      </header>
      <Login></Login>
    </div>
  );
}

export default App;
