import { useState } from "react"

function Cadastrar({onVoltar}){
    const [nome, setNome] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [email, setEmail] = useState("")
    const [telefone, setTelefone] = useState("")

    async function handleCadastro() {
        if (nome.length < 10 || nome.length > 40) {
            alert("Nome deve ter entre 10 e 40 caracteres")
            return
        }
        if (senha.length < 12 || senha.length > 60) {
            alert("Senha deve ter entre 12 e 60 caracteres")
            return
        }
        if (senha !== confirmarSenha) {
            alert("Senhas não coincidem")
            return
        }
        if (!email.includes('@')) {
            alert("Email inválido")
            return
        }

        try {
            const resposta = await fetch('http://localhost:3001/api/usuario/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, senha, email, telefone })
            })
            
            const dados = await resposta.json()
            
            if (dados.sucesso) {
                alert("Cadastro realizado com sucesso!")
                onVoltar()
            } else {
                alert(dados.erro || "Erro no cadastro")
            }
        } catch (erro) {
            alert("Erro ao conectar com o servidor")
        }
    }

    return(
        <div className="cadastrarnoapp">
            <div>
                <label>Nome:</label>
                <input type="text" minLength={10} maxLength={40} placeholder="digite seu nome" value={nome} onChange={(e) => setNome(e.target.value)}></input>
            </div>

            <div>
                <label>Senha:</label>
                <input type="password" minLength={12} maxLength={60} placeholder="min 12 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)}></input>
                <input type="password" minLength={12} maxLength={60} placeholder="digite a senha novamente" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}></input>
            </div>

            <div>
                <label>Email:</label>
                <input type="email" placeholder="email@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </div>

            <div>
                <label>Telefone:</label>
                <input type="tel" placeholder="99-99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)}></input>
            </div>

            <button onClick={handleCadastro}>Cadastrar</button>
            <button onClick={onVoltar}>Voltar para Login</button>
        </div>
    )
}

export default Cadastrar