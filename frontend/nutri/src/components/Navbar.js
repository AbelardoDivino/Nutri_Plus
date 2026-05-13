function Navbar({onSobre}){
    return(
        <div className="classenavbar">
            <img src='/imagens/imagenlogo.png' alt="logo" id="fotologo"></img>
            <a onClick={onSobre} style={{cursor:'pointer'}}>sobre</a>
            <a href="#" id="nava_mais">mais</a>
            <a href="#" id="nava_entrar">Entrar</a>
        </div>
    )
}

export default Navbar