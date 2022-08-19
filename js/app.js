//Variables
  //Selectors
    const formulario = document.querySelector('#formulario')
    const selectMoneda = document.querySelector('#moneda');
    const selectCrypto = document.querySelector('#criptomonedas');
    const resultado = document.querySelector('#resultado');

//Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  obtenerTopCryptos()//Al cargar el dom llama la funcion de consulta de las top 10 criptomonedas
  formulario.addEventListener('submit', validarFormulario)
})


//Funciones
function obtenerTopCryptos() { //Consulta en la api cuales son las 10 criptomonedas con mayor marketcap
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => llenarCryptos(datos.Data))

}

function llenarCryptos(datos) { //Recibe el objeto de las top 10 criptomonedas y llena el select de la interfaz con los datos
  datos.forEach(element => {
    const {FullName, Name} = element.CoinInfo; //Destructuring del objeto CoinInfo para extraer el FullName y Name
    const select = document.createElement('option')
    select.value = Name;
    select.textContent = FullName;
    selectCrypto.appendChild(select);
  })
}

function validarFormulario(e) { //Valida que ambos campos tengan una seleccion
  e.preventDefault()
  if(selectCrypto.value == '' || selectMoneda.value == '') {
    mostrarAlerta('Primero elige una criptomoneda y una moneda', 'error')
    return;
  }
  consultarCambio(selectCrypto.value, selectMoneda.value)
}

function mostrarAlerta(mensaje, tipo) { //Muestra un mensaje al ususario
  const alertExiste = document.querySelector('.error')
  if(alertExiste) {
    return;
  }
  const alert = document.createElement('div');
  alert.textContent = mensaje;
  if(tipo == 'error') {
    alert.classList.add('error');
  }
  resultado.append(alert);
  setTimeout(() => {
    alert.remove()
  }, 3000);
}

function consultarCambio(crypto, moneda) {//Consulta en la API la información de la criptomoneda seleccionada
  mostrarSpinner()
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${moneda}`
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => mostrarResultado(datos.DISPLAY[crypto][moneda], crypto, moneda))
}

function mostrarResultado(conversion, crypto) { //Muestra en interfaz los datos obtenidos de la API
  limpiarHTML()
  resultado.innerHTML = `
  <h3 class="text-white text-base md:text-lg lg:text-xl mb-3">El precio actual de ${crypto} es: <span class="font-bold text-lg lg:text-2xl">${conversion.PRICE}</span></h3>
  <p class="text-white text-sm md:text-base lg:text-lg mb-2">El precio más alto de hoy fue: <span class="font-bold">${conversion.HIGHDAY}</span></p>
  <p class="text-white text-sm md:text-base lg:text-lg mb-2">El precio más bajo de hoy fue: <span class="font-bold">${conversion.LOWDAY}</span></p>
  <p class="text-white text-sm md:text-base lg:text-lg mb-2">La variación de las ultimas 24 horas es: <span class="font-bold">${conversion.CHANGEPCT24HOUR}%</span></p>
  <p class="text-white text-sm md:text-base lg:text-lg mb-2">La ultima actualización fue: <span class="font-bold">${conversion.LASTUPDATE}</span></p>
  `
}

function limpiarHTML() {
  while(resultado.firstChild) {
    resultado.removeChild(resultado.firstChild)
  }
}

function mostrarSpinner() { //Muestra un spinner de carga 
  limpiarHTML();
  const spinner = document.createElement('div');
  spinner.classList.add('sk-fading-circle');

  spinner.innerHTML = `
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
  `
  resultado.append(spinner)
}