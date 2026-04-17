import { useState } from "react"
function Login({onLogin}){
    const [name,setName] = useState("")
    const [senha,setSenha] = useState("")

    function handlelogin(tipo){
        if (senha.length >=8) {
            onLogin(tipo)
        }
        else{
            alert("Senha invalida minimo 8 caracters")
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
         </div>
        </div>
        
    )
}

export default Login