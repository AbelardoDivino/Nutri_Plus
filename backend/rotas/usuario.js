import { useState } from "react"


function perguntas(){

    const perguntas = ['fazatividades','fazdieta','quantidadedecalorias','oquedesejasertipoperderpeso meter o chape etc']

}
// dcd ao carregar o capo usuario deve ter estas perguntas e depois encaminhalo para mandar msg no whatsap instagram e emaill
function Usuario(){
    return(
        <div>
            <div className="camponome">
                <label>Nome:</label>
                <input type="text"></input>
            </div>
            <div className="campopeso">
                <label>Peso:</label>
                <input type="number"></input>
            </div>
            <div className="capmpoperguntas">
        {/* adcascddv */}
            </div>
        </div>
    )
}


export default Usuário
