const pantalla = document.getElementById('pantalla');

const pantallaMenu = document.getElementById('pantallaMenu');

function imprimirPantalla(template) {
    pantalla.innerHTML = '';
    pantalla.appendChild(template.content.cloneNode(true));
}

imprimirPantalla(pantallaMenu);
//una vez imprimido el menu se crean las variables
const jugarBtn = document.getElementById('jugar');
jugarBtn.addEventListener('click', function () {
    imprimirPantalla(document.getElementById('pantallaJuego1'));
    start();
});
const dificultadBtn = document.getElementById('dificultad');
dificultadBtn.addEventListener('click', function () {
    imprimirPantalla(document.getElementById('pantallaDificultad'));
});
const controlesBtn = document.getElementById('controles');
controlesBtn.addEventListener('click', function () {
    imprimirPantalla(document.getElementById('pantallaControles'));
});
const tutorialBtn = document.getElementById('tutorial');
tutorialBtn.addEventListener('click', function () {
    imprimirPantalla(document.getElementById('pantallaTutorial'));
});
const puntuajeBtn = document.getElementById('puntuaje');
puntuajeBtn.addEventListener('click', function () {
    imprimirPantalla(document.getElementById('pantallaPuntuaje'));
});


function start(/*jugador, enemigos, trampas, estrellas*/) {
    const cuadrado = document.getElementById('cuadrado'); // lo que controle al jugador
    const jugador = { //temporal que este aquí
        leftPos: 0,
        topPos: 500,
        vidas: 0,
        salntando: false
    };

    //Eventos de teclas (de momento solo se desplaza de izq a derch y salta)
    const movimientoJugador = {dx: 0, dy: 0};

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key === 'a') {
            movimientoJugador.dx = -10;
        } else if (key === 'd') {
            movimientoJugador.dx = 10;
        } else if (key === 'w') {
            //movimientoJugador.dy = -10;
        } else if (key === 's') {
            //movimientoJugador.dy = 10;
        }else if (key === ' ') {
            saltar();
        }
    });
    document.addEventListener('keyup', (event) => {
        const key = event.key;
        if (key === 'a' || key === 'd') {
            movimientoJugador.dx = 0;
        } else if (key === 'w' || key === 's') {
            //movimientoJugador.dy = 0;
        }
    });

    //Funcion para actualizar y comprobar el estado del juego
    const intervaloUpdate = 16;  //milisegundos
    function update() {
        moverJugador();
    }
    setInterval(update, intervaloUpdate);
    /*******************************************************/

    function moverJugador(){
        jugador.leftPos += movimientoJugador.dx;
        jugador.topPos += movimientoJugador.dy;
        cuadrado.style.left = jugador.leftPos + 'px';
        cuadrado.style.top = jugador.topPos + 'px';
    }

    function saltar() {
        let alturaSalto = 120; // La altura del salto en píxeles
        let duracionSalto = 500; // La duración del salto en milisegundos
        let posicionInicial = jugador.topPos; // La posición vertical inicial del jugador
        let tiempo = 0;
        let intervalo = setInterval(function() {
            if (tiempo >= duracionSalto) {
                clearInterval(intervalo);
                return;
            }
            tiempo += intervaloUpdate;
            let alturaActual = alturaSalto * Math.sin(Math.PI * tiempo / duracionSalto);
            jugador.topPos = posicionInicial - alturaActual;
            cuadrado.style.top = jugador.topPos + 'px';
        }, intervaloUpdate);
    }
}





