const container = document.querySelector(".contenedorForm");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarClima);
})

function buscarClima(e){
    e.preventDefault();
    
    //Validar Formulario
    const ciudad = document.querySelector("#ciudad").value;
    const pais = document.querySelector("#pais").value;

    if(ciudad === "" || pais === ""){
        //Hubo un error
        mostrarError("Ambos campos son obligatorios");
        return;
    };

    //Consultar la API
    consultarAPI(ciudad, pais)
}

function mostrarError(mensaje){
    const alerta = document.querySelector("alerta");
    
    if(!alerta){
        //Crear un alerta
        const alerta = document.createElement("div");
        alerta.classList.add("alerta");
        alerta.innerHTML = `
            <strong class="bold">Error!</strong>
            <span class="block"> ${mensaje}</span>
        `;

        container.appendChild(alerta);

        //Se elimine la alerta despues de 5 segundos
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    } 
}

function consultarAPI(ciudad, pais){
    
    const appId = "23cdca7a83d2b1085e307e3eab355a31";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    
    Spinner(); //Muesta un Spinner al cargar

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {
            limpiarHML() //Limpia el HTML previo
            if(datos.cod === "404"){
                mostrarError("Ciudad no encontrada");
                return;
            }

            //Imprimir la respuesta en el HTML
            mostrarClima(datos)
        })
}

function mostrarClima(datos){
    const { name, main: { temp, temp_max, temp_min }} = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement("p");
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add("textoResultado")

    const actual= document.createElement("p");
    actual.innerHTML = `
        ${centigrados} &#8451;
    `;
    actual.classList.add("textoResultado", "actual");

    const tempMaxima = document.createElement("p");
    tempMaxima.innerHTML = `Max: ${max} &#8451`;
    tempMaxima.classList.add("textoResultado");

    const tempMinima = document.createElement("p");
    tempMinima.innerHTML = `Min: ${min} &#8451`;
    tempMinima.classList.add("textoResultado")

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("resultadoInfo");

    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultadoDiv.appendChild(nombreCiudad);
    resultado.appendChild(resultadoDiv)
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner(){
    limpiarHML()

    const divSpinner = document.createElement("div");
    divSpinner.classList.add("sk-fading-circle");

    divSpinner.innerHTML = `
    <div class="sk-fading-circle">
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    </div>
    `;
    resultado.appendChild(divSpinner)
}