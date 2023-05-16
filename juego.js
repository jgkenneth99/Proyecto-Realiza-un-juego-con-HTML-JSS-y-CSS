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
        leftPos: 10,
        topPos: 780,
        vidas: 0,
        enElAire: true,
        saltando: false,
        movimientoBloqueado: false
    };
    // Colisiones de estructuras
    let objetosRect = [];
    const objetosColision = document.querySelectorAll('.estructura');
    objetosColision.forEach(objeto => {
        objetosRect.push(objeto.getBoundingClientRect());
    });

    let trampasRect = [];
    const trampasColision = document.querySelectorAll('.trampa');
    trampasColision.forEach(trampa => {
        trampasRect.push(trampa.getBoundingClientRect());
    });

    //Eventos de teclas (de momento solo se desplaza de izq a derch y salta)
    const movimientoJugador = { dx: 0, dy: 0 };

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key === 'a') {
            movimientoJugador.dx = -5;
        } else if (key === 'd') {
            movimientoJugador.dx = 5;
        } else if (key === 'w') {
            //movimientoJugador.dy = -10;
            // saltar(); //test
        } else if (key === 's') {
            //movimientoJugador.dy = 10;
        } else if (key === ' ') {
            if (!jugador.enElAire && !jugador.saltando && !jugador.movimientoBloqueado) {
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
        if (!jugador.movimientoBloqueado) {
            moverJugador();
            aplicarGravedad();
        }

        detectarColision();

    }
    setInterval(update, intervaloUpdate);
    /*******************************************************/


    function detectarColision() {

        // Obtener la posición y dimensiones del jugador
        const jugadorRect = cuadrado.getBoundingClientRect();

        // Comprobar colision con estructuras
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
        // Comprobar colisión con trampas
        for (let i = 0; i < trampasRect.length; i++) {
            const trampaRect = trampasRect[i];
            if (jugadorRect.right > trampaRect.left &&
                jugadorRect.left < trampaRect.right &&
                jugadorRect.bottom > trampaRect.top &&
                jugadorRect.top < trampaRect.bottom) {

                // Ejecutar animación de explosión (muerte)
                if (!jugador.movimientoBloqueado) {
                    jugador.movimientoBloqueado = true;
                    // Ejecutar animación de explosión
                    const explosion = document.createElement('div');
                    explosion.classList.add('explosion');
                    explosion.style.left = jugador.leftPos + 'px';
                    explosion.style.top = jugador.topPos + 'px';
                    const contenedorExplosiones = document.getElementById('contenedor-explosion');
                    contenedorExplosiones.appendChild(explosion);


                    setTimeout(() => {
                        // Código a ejecutar después de la animación de explosión
                        explosion.remove();
                        console.log('Animación de explosión completada');
                        jugador.movimientoBloqueado = false;
                        jugador.leftPos = 10;
                        jugador.topPos = 780;
                    }, 1000);

                    console.log("Colisionando con trampa");
                    break;
                }
            }
        }
        // Comprobar colisión con estrellas y eliminarlas si hay colisión
        const estrellas = document.querySelectorAll('.estrella');
        if (estrellas.length === 0) {
            console.log("No quedan estrellas");
            // Aquí puedes agregar el código adicional que deseas ejecutar cuando no quedan estrellas
          }

        estrellas.forEach(estrella => {
            const estrellaRect = estrella.getBoundingClientRect();

            if (jugadorRect.right > estrellaRect.left &&
                jugadorRect.left < estrellaRect.right &&
                jugadorRect.bottom > estrellaRect.top &&
                jugadorRect.top < estrellaRect.bottom) {
                // Ejecutar lógica de colisión con estrella
                console.log("Colisionando con estrella");

                // Eliminar la estrella

                estrella.remove();
            }
        });




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
        let alturaSalto = 250; // La altura del salto en píxeles
        let duracionSalto = 1200; // La duración del salto en milisegundos
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
            if (!jugador.movimientoBloqueado) {
                cuadrado.style.top = jugador.topPos + 'px';
            }

        }, intervaloUpdate);
    }



}



