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
    const cuadrado = document.getElementById('personaje1'); // lo que controle al jugador
    const jugador = { //temporal que este aquí
        leftPos: 0,
        topPos: 500,
        vidas: 0,
        enElAire: true,
        saltando: false
    };
    // Colisiones de estructuras
    let objetosRect = [];
    const objetosColision = document.querySelectorAll('.estructura');
    objetosColision.forEach(objeto => {
        objetosRect.push(objeto.getBoundingClientRect());
    });

    //Eventos de teclas (de momento solo se desplaza de izq a derch y salta)
    const movimientoJugador = { dx: 0, dy: 0 };

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key === 'a') {
            movimientoJugador.dx = -10;
        } else if (key === 'd') {
            movimientoJugador.dx = 10;
        } else if (key === 'w') {
            //movimientoJugador.dy = -10;
            // saltar(); //test
        } else if (key === 's') {
            //movimientoJugador.dy = 10;
        } else if (key === ' ') {
            if (!jugador.enElAire && !jugador.saltando) {
                saltar();
            }
        } else if (key == 'z') {
            console.log("En el aire? " + jugador.enElAire); //test
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
    const gravedad = 500; // Valor de gravedad en píxeles por segundo al cuadrado
    const intervaloUpdate = 16;  //milisegundos
    function update() {
        moverJugador();
        detectarColision();
        aplicarGravedad();
    }
    setInterval(update, intervaloUpdate);
    /*******************************************************/


    function detectarColision() {

        // Obtener la posición y dimensiones del jugador
        const jugadorRect = cuadrado.getBoundingClientRect();

        for (let i = 0; i < objetosRect.length; i++) {
            const objetoRect = objetosRect[i];
            if (jugadorRect.right > objetoRect.left &&
                jugadorRect.left < objetoRect.right &&
                jugadorRect.bottom > objetoRect.top &&
                jugadorRect.top < objetoRect.bottom) {
                jugador.enElAire = false;
                console.log("colisionando");
                break;
            } else {// Si no hay colisión con ningún objeto, el jugador está en el aire
                jugador.enElAire = true;
                console.log("enelaire");
            }
        }

    };

    function aplicarGravedad() {
        if (jugador.enElAire) {
            jugador.topPos += gravedad * intervaloUpdate / 1000; // Aumentar la posición vertical en función del valor de gravedad y el tiempo desde la última actualización
            cuadrado.style.top = jugador.topPos + 'px';
        }
    }

    function moverJugador() {
        jugador.leftPos += movimientoJugador.dx;
        jugador.topPos += movimientoJugador.dy;
        cuadrado.style.left = jugador.leftPos + 'px';
        cuadrado.style.top = jugador.topPos + 'px';
    }

    function saltar() {
        jugador.saltando = true;
        let alturaSalto = 200; // La altura del salto en píxeles
        let duracionSalto = 1000; // La duración del salto en milisegundos
        let posicionInicial = jugador.topPos; // La posición vertical inicial del jugador
        let tiempo = 0;
        let intervalo = setInterval(function () {
            if (tiempo >= duracionSalto / 2) {
                clearInterval(intervalo);
                jugador.saltando = false;
                console.log("fin salto");
                return;
            }
            tiempo += intervaloUpdate;
            let alturaActual = alturaSalto * Math.sin(Math.PI * tiempo / duracionSalto);
            alturaActual -= 0.5 * gravedad * Math.pow(tiempo / 1000, 2); // Fórmula ajustada para la gravedad
            jugador.topPos = posicionInicial - alturaActual;
            cuadrado.style.top = jugador.topPos + 'px';

        }, intervaloUpdate);
    }



}



