import './App.css';
import Footer from './components/Footer';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Campousu from './components/Campousu';
import Admin from './components/Admin';
import Cadastrar from './components/Cadastrar';
import { useState } from 'react';
function App() {
  const [tela, setTela] = useState('login');

  return (
    <div className="App">
      <header className="App-header">
        <Navbar>  </Navbar>
      </header>
      {tela === 'login' && <Login onCadastrar={() => setTela('cadastrar')} />}
      {tela === 'cadastrar' && <Cadastrar onVoltar={() => setTela('login')} />}
      {tela === 'usuario' && <Campousu />}
      {tela === 'admin' && <Admin />}
      <Footer></Footer>
    </div>
  );
}

export default App;
