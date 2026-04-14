import { useState } from "react"
function Login(){
    return(
        <div>
            <label>Nome:
                <div>
                    <input type="text" placeholder="Digite seu nome" minLength={8} maxLength={40}></input>
                </div>
            </label>
        </div>
        
    )
}

export default Login