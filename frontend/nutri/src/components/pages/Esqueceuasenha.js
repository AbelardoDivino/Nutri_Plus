import { useState } from "react"

function Esqueceuasenha({onVoltar}){
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false)

    async function handleRecuperar() {
        if (!email.includes('@')) {
            alert("Email inválido")
            return
        }
        if (senha.length < 8) {
            alert("Senha deve ter no mínimo 8 caracteres")
            return
        }
        if (senha !== confirmarSenha) {
            alert("Senhas não coincidem")
            return
        }

        try {
            const resposta = await fetch('http://localhost:3001/api/usuario/recuperar-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            })
            const dados = await resposta.json()
            if (dados.sucesso) {
                alert("Senha alterada com sucesso!")
                onVoltar()
            } else {
                alert(dados.erro)
            }
        } catch (erro) {
            alert("Erro ao conectar com o servidor")
        }
    }

    return(
        <div>
            <h1>Recuperar Senha</h1>
            <div>
                <label>Email:</label>
                <input type="email" placeholder="seuemail@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Nova Senha:</label>
                <div className="password-container">
                    <input type={mostrarSenha ? "text" : "password"} placeholder="min 8 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} />
                    <span className="toggle-password" onClick={() => setMostrarSenha(!mostrarSenha)}>
                        {mostrarSenha ? '🙈' : '👁️'}
                    </span>
                </div>
            </div>
            <div>
                <label>Confirmar Nova Senha:</label>
                <div className="password-container">
                    <input type={mostrarConfirmar ? "text" : "password"} placeholder="repita a senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
                    <span className="toggle-password" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
                        {mostrarConfirmar ? '🙈' : '👁️'}
                    </span>
                </div>
            </div>
            <button onClick={handleRecuperar}>Alterar Senha</button>
            <button onClick={onVoltar}>Voltar para Login</button>
        </div>
    )
}

export default Esqueceuasenha