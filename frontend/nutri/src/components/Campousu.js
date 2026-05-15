import styles from '../components/css/Campuusu.module.css'
import { useState } from "react"
import Caloriasdiarias from './pages/Caloriasdiarias'
import Pesobasal from './pages/Pesobasal'
function Campousu(){
    return(
        <div>


        {/* {let peso =  Number(alert("digite seu peso:"))} */}

        {/* 
        
        Tera area de peso basal 
        aba de

        peso altura objetivo

        

        */}

<p>Ola seja bem Vindo ao nutri plus</p>

        {/* 
        tera a aba do que terar de comer e fazer no dia a dia 
        */}

{/* com o resultado do peso basal sera redirecionado no whatsap com os dados da biopedancia/ imdb para melhor resultado */}

<Pesobasal></Pesobasal>


        </div>
    )
}

export default Campousu