function Pesobasal(){
    return(
        <div>
            {/* calcular peso basal */}
            <input type="text" placeholder="Digite o seu nome" minLength={10} maxLength={40}></input>

            <input type="number"placeholder="Peso KG"> </input>

            <input type="number" placeholder="Altura CM"></input>

            <input type="radio">Genero</input>

            <input type="option">Sedentario(s)/(n)</input>

        </div>
    )
}
export default Pesobasal