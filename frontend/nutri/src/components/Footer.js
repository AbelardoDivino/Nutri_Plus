import { useState } from "react"
import {FaFacebook,FaInstagram} from 'react-icons/fa'
function Footer(){
    return(
        <div>
        <p id="footer">&copy; 2026 - Todos os direitos reservados.</p>
        <FaFacebook></FaFacebook>
        <FaInstagram></FaInstagram>
        </div>
    )
}

export default Footer