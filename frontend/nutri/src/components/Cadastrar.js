import { useState } from "react"
function Cadastrar(){
return(
    <div class="cadastrarnoapp">

<div>
    
        <label>Nome:
        <input type="text" minLength={10} maxLength={40} placeholder="digite seu nome"></input>
        </label>
</div>

<div>
    <label>Senha:
    <input type="password" minLength={12} maxLength={60} placeholder="min 12 caracters">
    <input type="password" minLength={12} maxLength={60}  placeholder="digite a senha novamente"></input>
    </input>
    </label>
</div>

<div>
    <label>Email:
    <input type="email" placeholder="email@gmail.com"></input>
    </label>
</div>

<div>
    <label>Telefone
    <input type="tel" placeholder="99-99999-9999"></input>
    </label>
</div>

{/* por ultimo login com google ou facebook */}

    </div>
)
}

export default Cadastrar