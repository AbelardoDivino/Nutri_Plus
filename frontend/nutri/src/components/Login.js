import {Link} from  'react-router-dom'
import { useState } from "react"
function Login({onLogin, onCadastrar}){
    const [name,setName] = useState("")
    const [senha,setSenha] = useState("")

    async function handlelogin(tipo) {
        if (senha.length < 8) {
            alert("Senha inválida mínimo 8 caracteres")
            return
        }

        try {
            const resposta = await fetch('http://localhost:3001/api/usuario/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: name, senha: senha })
            })
            
            const dados = await resposta.json()
            
            if (dados.sucesso) {
                onLogin(tipo)
            } else {
                alert(dados.erro || "Credenciais inválidas")
            }
        } catch (erro) {
            alert("Erro ao conectar com o servidor")
        }
    }

    return(
        <div className="divprincinpaldologin">
            <label>Nome:
                <div>
                    <input type="text" placeholder="Digite seu nome" minLength={8} maxLength={40} value={name} 
                    onChange={(e)=>setName(e.target.value)}
                    ></input>
                </div>
                <label> Senha
                <div>
                    <input type="password"placeholder="min 8 caracters"
                    value={senha}
                    onChange={(e)=> setSenha(e.target.value)}
                    ></input>
                </div>
                </label>
            </label>
            <div id="botoesparaentrar">
            <button id="entrar" onClick={()=> handlelogin('usuario')}>Entrar</button> 
            <button id="admin" onClick={()=> handlelogin('admin')}> Admin</button>  
            <button id="cadastrar" onClick={onCadastrar}>Cadastrar</button>       
         </div>
        </div>
        
    )
}

export default Login