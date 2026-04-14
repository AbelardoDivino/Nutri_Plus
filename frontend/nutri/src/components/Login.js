import { useState } from "react"
function Login(){
    return(
        <div className="divprincinpaldologin">
            <label>Nome:
                <div>
                    <input type="text" placeholder="Digite seu nome" minLength={8} maxLength={40}></input>
                </div>
                <label> Senha
                <div>
                    <input type="password"placeholder="min 8 caracters"></input>
                </div>
                </label>
            </label>
            <div id="botoesparaentrar">
            <button id="entrar">Entrar</button> 
            <button id="admin"> Admin</button>       
         </div>
        </div>
        
    )
}

export default Login