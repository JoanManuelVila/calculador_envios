const listaEnvios = document.querySelector('#lista-envios');
const formulario = document.querySelector('#formulario');
const calculatorButton = document.querySelector('#calculator');
let envios = [];

formulario.addEventListener('submit', agregarEnvio);
listaEnvios.addEventListener('click', borrarEnvio);
calculatorButton.addEventListener('click', calcularTotal);
document.addEventListener('DOMContentLoaded', () => {
    envios = JSON.parse(localStorage.getItem('envios')) || []
    renderHTML()
})

function agregarEnvio(evt) {
    evt.preventDefault()
	const ciudad = document.querySelector('#city').value
    const distancia = document.querySelector('#distance').value
    if (ciudad === "" || distancia === "") {
        mostrarError("No admite vacios");
        return;
    }
    const envioObj = {
        id: Date.now(),
        ciudad,
        distancia
    }
	envios.push(envioObj)
	renderHTML()
	formulario.reset();
}

function renderHTML() {
    limpiarHTML()
    if (envios.length > 0) {
        for (let envio of envios) {
            const btnBorrar = document.createElement('a');
            btnBorrar.classList = 'borrar-envio';
            btnBorrar.innerText = ' ❎ ';
			const li = document.createElement('li');
            li.textContent = `${envio.ciudad}, ${envio.distancia}`;
			li.appendChild(btnBorrar);
			li.dataset.envioId = envio.id;
			listaEnvios.appendChild(li);
        }
    }
    sincronizarStorage()
}

function sincronizarStorage() {
    localStorage.setItem('envios', JSON.stringify(envios));
}

function borrarEnvio(evt) {
    evt.preventDefault();
    const id = evt.target.parentElement.dataset.envioId;
    envios = envios.filter(envio => envio.id != id);
    renderHTML()
}

function limpiarHTML() {
    while (listaEnvios.firstChild) {
        listaEnvios.removeChild(listaEnvios.firstChild)
    }
}

function mostrarError() {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Oops...',
        text: 'Ingrese localidades y distacia para calcular los costos!',
        timer: 3500
      })
}

function mostrarTotal(totalPrice) {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: `El precio total de sus pedidos es de $${totalPrice}`,
        showConfirmButton: false,
        timer: 3500
      })
}

function calcularTotal(){
    let totalPrice = 0;
    console.log (envios)
    for (let i = 0; i < envios.length; i++) {
        totalPrice = totalPrice + calculatePrice(envios[i].distancia);
    }
    (totalPrice > 0) ? mostrarTotal(totalPrice) : mostrarError();
}

const calculatePrice = (distance) => {
    switch (true) {
        case distance < 10:
            return 100;
        case distance >= 10 && distance < 40:
            return 200
        case distance >= 40 && distance < 70:
            return 300
        case distance >= 70 && distance < 100:
            return 400
        default:
            return 500
    };
}