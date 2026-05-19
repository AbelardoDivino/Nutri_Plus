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
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  function handleLogin(tipo, usuario) {
    setUsuarioLogado(usuario || null);
    setTela(tipo);
  }

  return (
    <div className="App">
      <header className="app-header">
        <Navbar onSobre={() => setTela('sobre')} />
      </header>

      <main className="app-main">
        {tela === 'login' && (
          <Login
            onLogin={handleLogin}
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
        {tela === 'usuario' && <Campousu usuario={usuarioLogado} />}
        {tela === 'admin' && <Admin onVoltar={() => setTela('login')} />}
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
