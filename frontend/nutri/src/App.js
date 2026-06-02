import './App.css';
import Footer from './components/Footer';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Campousu from './components/Campousu';
import Admin from './components/Admin';
import Cadastrar from './components/Cadastrar';
import EscolherCadastro from './components/EscolherCadastro';
import CompletarPerfil from './components/CompletarPerfil';
import Esqueceuasenha from './components/pages/Esqueceuasenha';
import Sobre from './components/pages/Sobre';
import { useState } from 'react';

function App() {
  const [tela, setTela] = useState('login');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  function handleLogin(tipo, usuario) {
    setUsuarioLogado(usuario || null);
    if (tipo === 'usuario' && usuario && !usuario.profissional_id) {
      setTela('completarperfil');
    } else {
      setTela(tipo);
    }
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
            onCadastrar={() => setTela('escolhercadastro')}
            onRecuperarsenha={() => setTela('esqueceuasenha')}
          />
        )}
        {tela === 'escolhercadastro' && (
          <EscolherCadastro
            onVoltar={() => setTela('login')}
            onCadastroUsuario={() => setTela('cadastrar')}
            onCadastroAdmin={() => setTela('cadastroadmin')}
          />
        )}
        {tela === 'cadastrar' && (
          <Cadastrar
            onVoltar={() => setTela('escolhercadastro')}
            onCadastrado={() => setTela('usuario')}
          />
        )}
        {tela === 'cadastroadmin' && (
          <Cadastrar
            tipo="admin"
            onVoltar={() => setTela('escolhercadastro')}
            onCadastrado={() => setTela('admin')}
          />
        )}
        {tela === 'completarperfil' && (
          <CompletarPerfil
            usuario={usuarioLogado}
            onCompletou={(userAtualizado) => {
              setUsuarioLogado(userAtualizado);
              setTela('usuario');
            }}
          />
        )}
        {tela === 'usuario' && <Campousu usuario={usuarioLogado} />}
        {tela === 'admin' && <Admin profissional={usuarioLogado} onVoltar={() => setTela('login')} />}
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
