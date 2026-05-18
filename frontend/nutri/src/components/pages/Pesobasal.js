function Pesobasal(){
    return(
        <div>
            {/* calcular peso basal */}
            <input type="text" placeholder="Digite o seu nome" minLength={10} maxLength={40} />

            <input type="number" placeholder="Peso KG" />

            <input type="number" placeholder="Altura CM" />

            <label>
               Genero
               <select>
                <option value='M'>Masculino</option>
                <option value='F'>Feminino</option>
               </select>
            </label>

            <label>
                Sedentario(S)/(N)
                <select>
                    <option value="S">Sim</option>
                    <option value="N">Não</option>
                </select>
            </label>

        </div>
    )
}
export default Pesobasal