import './App.css';
import Footer from './components/Footer';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Campousu from './components/Campousu';
import Admin from './components/Admin';
import Cadastrar from './components/Cadastrar';
import Esqueceuasenha from './components/pages/Esqueceuasenha';
import Sobre from './components/pages/Sobre';
import { useState } from 'react';

function App() {
  const [tela, setTela] = useState('login');

  return (
    <div className="App">
      <header className="app-header">
        <Navbar onSobre={() => setTela('sobre')} />
      </header>

      <main className="app-main">
        {tela === 'login' && (
          <Login
            onLogin={(tipo) => setTela(tipo)}
            onCadastrar={() => setTela('cadastrar')}
            onRecuperarsenha={() => setTela('esqueceuasenha')}
          />
        )}
        {tela === 'cadastrar' && (
          <Cadastrar
            onVoltar={() => setTela('login')}
            onCadastrado={() => setTela('usuario')}
          />
        )}
        {tela === 'usuario' && <Campousu />}
        {tela === 'admin' && <Admin />}
        {tela === 'esqueceuasenha' && (
          <Esqueceuasenha onVoltar={() => setTela('login')} />
        )}
        {tela === 'sobre' && <Sobre onVoltar={() => setTela('login')} />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
