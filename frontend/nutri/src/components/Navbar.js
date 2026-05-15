import App from "../App"
function Navbar({onSobre}){
    return(
        <div className="classenavbar">
            <a href="App"><img src='/imagens/imagenlogo.png' alt="logo" id="fotologo"></img></a>
            <a onClick={onSobre} style={{cursor:'pointer'}}>sobre</a>
            <a href="#" id="nava_mais">mais</a>
            <a href="#" id="nava_entrar">Entrar</a>
        </div>
    )
}

export default Navbar