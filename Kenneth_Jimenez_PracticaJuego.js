const pantalla = document.getElementById('pantalla');

const pantallaMenu = document.getElementById('pantallaMenu');

function imprimirPantalla(template) {
    pantalla.innerHTML = '';
    pantalla.appendChild(template.content.cloneNode(true));
}

imprimirPantalla(pantallaMenu);
asignarVariablesBotonesMenu()
//una vez imprimido el menu se crean las variables

function asignarVariablesBotonesMenu() {
    const jugarBtn = document.getElementById('jugar');
    jugarBtn.addEventListener('click', function () {
        imprimirPantalla(document.getElementById('pantallaJuego1'));
        tiempo = 0;
        const jugador = {
            leftPos: 10,
            topPos: 780,
            enElAire: true,
            saltando: false,
            movimientoBloqueado: false,
            id: "personaje1"
        };
        nivelpantalla = 1;
        start(jugador, nivelpantalla);
    });
    const dificultadBtn = document.getElementById('dificultad');
    dificultadBtn.addEventListener('click', function () {
        imprimirPantalla(document.getElementById('pantallaDificultad'));
        const dificultadForm = document.getElementById("dificultad-form");

        dificultadForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Evita el envío del formulario

            const radios = dificultadForm.elements["dificultad"];

            for (let i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    dificultad = radios[i].value;
                    break;
                }
            }

            console.log("Dificultad seleccionada:", dificultad);
            // Aquí puedes realizar las acciones necesarias con la dificultad seleccionada
        });
        volverMenuBtn = document.getElementById('volverMenuBtn');
                volverMenuBtn.addEventListener('click', function () {
                    imprimirPantalla(pantallaMenu);
                    asignarVariablesBotonesMenu();
                });
    });
    const controlesBtn = document.getElementById('controles');
    controlesBtn.addEventListener('click', function () {
        imprimirPantalla(document.getElementById('pantallaControles'));
        volverMenuBtn = document.getElementById('volverMenuBtn');
                volverMenuBtn.addEventListener('click', function () {
                    imprimirPantalla(pantallaMenu);
                    asignarVariablesBotonesMenu();
                });
    });
    const tutorialBtn = document.getElementById('tutorial');
    tutorialBtn.addEventListener('click', function () {
        imprimirPantalla(document.getElementById('pantallaTutorial'));
        volverMenuBtn = document.getElementById('volverMenuBtn');
                volverMenuBtn.addEventListener('click', function () {
                    imprimirPantalla(pantallaMenu);
                    asignarVariablesBotonesMenu();
                });
    });
    const puntuajeBtn = document.getElementById('puntuaje');
    puntuajeBtn.addEventListener('click', function () {
        imprimirPantalla(document.getElementById('pantallaPuntuaje'));
        volverMenuBtn = document.getElementById('volverMenuBtn');
        imprimirPuntuaje();
                volverMenuBtn.addEventListener('click', function () {
                    imprimirPantalla(pantallaMenu);
                    asignarVariablesBotonesMenu();
                });
    });
}

let tiempo
let dificultad = "facil"; // Variable para almacenar la dificultad seleccionada facil predeterminado

function start(jugador, nivelpantalla) {
    console.log("Dificultad seleccionada:", dificultad);
    cuentaAtras = 0;
    switch (dificultad) {
        case "facil": cuentaAtras = 120000;
            break;
        case "normal": cuentaAtras = 60000;
            break;
        case "dificil": cuentaAtras = 25000;
    }
    iniciarTemporizador(cuentaAtras);

    let cuadrado = document.getElementById(jugador.id); // lo que controle al jugador
    let leftPosInicial = jugador.leftPos;
    let topPosInicial = jugador.topPos;
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
        } else if (key === ' ') {
            if (!jugador.enElAire && !jugador.saltando && !jugador.movimientoBloqueado) {
                saltar();
            }
        } 
    });
    document.addEventListener('keyup', (event) => {
        const key = event.key;
        if (key === 'a' || key === 'd') {
            movimientoJugador.dx = 0;
        } 
    });

    //Funcion para actualizar y comprobar el estado del juego
    const gravedad = 500; // Valor de gravedad en píxeles por segundo al cuadrado
    const intervaloUpdate = 16;  //milisegundos 16
    function update() {
        tiempo += intervaloUpdate;
        if (!jugador.movimientoBloqueado) {
            moverJugador();
        }
        detectarColision();
        if (!jugador.movimientoBloqueado) {
            aplicarGravedad();
        }

    }
    let intervaloJuego;
    function iniciarIntervalo() {
        intervaloJuego = setInterval(update, intervaloUpdate);
    }

    // Función para detener el intervalo de actualización del juego
    function detenerIntervalo() {
        clearInterval(intervaloJuego);
    }
    iniciarIntervalo();
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
                break;
            } else {// Si no hay colisión con ningún objeto, el jugador está en el aire
                jugador.enElAire = true;
                //console.log("enelaire");
            }
        }
        // Comprobar colisión con trampas
        for (let i = 0; i < trampasRect.length; i++) {
            const trampaRect = trampasRect[i];
            if (jugadorRect.right > trampaRect.left &&
                jugadorRect.left < trampaRect.right &&
                jugadorRect.bottom > trampaRect.top &&
                jugadorRect.top < trampaRect.bottom) {
                muerte();
                break;
            }
        }

        // Comprobar colisión con estrellas y eliminarlas si hay colisión
        const estrellas = document.querySelectorAll('.estrella');
        if (estrellas.length === 0) {
            completarPantalla();
        }

        estrellas.forEach(estrella => {
            const estrellaRect = estrella.getBoundingClientRect();

            if (jugadorRect.right > estrellaRect.left &&
                jugadorRect.left < estrellaRect.right &&
                jugadorRect.bottom > estrellaRect.top &&
                jugadorRect.top < estrellaRect.bottom) {
                // colisión con estrella
                // Eliminar la estrella
                estrella.remove();
            }
        });
    }

    function muerte() {
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
                jugador.movimientoBloqueado = false;
                jugador.leftPos = leftPosInicial;
                jugador.topPos = topPosInicial;
            }, 1000);
        }
    }

    function aplicarGravedad() {
        if (jugador.enElAire) {
            jugador.topPos += gravedad * intervaloUpdate / 1000; 
            cuadrado.style.top = jugador.topPos + 'px';
        }
    }

    function moverJugador() {
        if (jugador.topPos >= 1200) muerte(); // si se cae muere
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

    function completarPantalla() {
        jugador.movimientoBloqueado = true;
        detenerIntervalo();
        switch (nivelpantalla) {
            case 1:
                imprimirPantalla(document.getElementById('pantallaJuego2'));
                jugador = {
                    leftPos: 10,
                    topPos: 50,
                    enElAire: true,
                    saltando: false,
                    movimientoBloqueado: false,
                    id: "personaje2"
                };
                nivelpantalla = 2;
                start(jugador, nivelpantalla);
                break;
            case 2:
                detenerTemporizador();
                console.log(tiempo);
                let mult;
                if (dificultad == "facil") mult = 1;
                if (dificultad == "normal") mult = 20;
                if (dificultad == "dificil") mult = 100;
                let puntuacion = ((cuentaAtras - tiempo) * mult) / 1000;
                imprimirPantalla(document.getElementById('pantallaJuegoFin'));
                document.getElementById('segundos').innerHTML = (tiempo / 1000).toFixed(2);
                document.getElementById('puntuacionObtenida').innerHTML = puntuacion;
                comentario = document.getElementById('comentario');
                if (puntuacion>0){
                    comentario.innerHTML = "¡Juego superado! Puntuacion registrada"
                }else{
                    comentario.innerHTML = "Has superado el juego fuera del tiempo limite, puntuacion no válida"
                }
                if (cuentaAtras > tiempo){
                    registrarPuntuaje(puntuacion);
                }
                volverMenuBtn = document.getElementById('volverMenuBtn');
                volverMenuBtn.addEventListener('click', function () {
                    imprimirPantalla(pantallaMenu);
                    asignarVariablesBotonesMenu();
                });
                break;
        }
    }
}

let temporizador;

function iniciarTemporizador(cuentaAtras) {
    temporizador = setTimeout(() => {
        console.log("Tiempo agotado");
    }, cuentaAtras);
}

function detenerTemporizador() {
    clearTimeout(temporizador);
    console.log("Temporizador detenido");
}

function obtenerPuntuajes() {
    return new Promise((resolve, reject) => {
      const puntuajes = JSON.parse(localStorage.getItem("puntuajes")) || [];
      if (puntuajes) {
        resolve(puntuajes);
      } else {
        reject("No se pudo obtener los puntuajes");
      }
    });
  }
  
  function registrarPuntuaje(puntuacion) {
    obtenerPuntuajes()
      .then((puntuajes) => {
        puntuajes.push(puntuacion + "-" + dificultad);
        localStorage.setItem("puntuajes", JSON.stringify(puntuajes));
        console.log("Puntaje registrado exitosamente");
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  function imprimirPuntuaje() {
    const tabla = document.createElement('table');
    const encabezado = document.createElement('tr');
    const posicionEncabezado = document.createElement('th');
    posicionEncabezado.textContent = 'Posición';
    const puntosEncabezado = document.createElement('th');
    puntosEncabezado.textContent = 'Puntos';
    const dificultadEncabezado = document.createElement('th');
    dificultadEncabezado.textContent = 'Dificultad';
  
    encabezado.appendChild(posicionEncabezado);
    encabezado.appendChild(puntosEncabezado);
    encabezado.appendChild(dificultadEncabezado);
    tabla.appendChild(encabezado);
  
    obtenerPuntuajes()
      .then((puntuajes) => {
        puntuajes.forEach((puntuaje, index) => {
          const fila = document.createElement('tr');
          const posicion = document.createElement('td');
          posicion.textContent = index + 1;
  
          // Extraer la puntuación y la dificultad
          const [puntuacion, dificultad] = puntuaje.split('-');
  
          const puntos = document.createElement('td');
          puntos.textContent = puntuacion;
          const dificultadCelda = document.createElement('td');
          dificultadCelda.textContent = dificultad;
  
          fila.appendChild(posicion);
          fila.appendChild(puntos);
          fila.appendChild(dificultadCelda);
          tabla.appendChild(fila);
        });
  
        const tablaContainer = document.getElementById('tablaContainer');
        tablaContainer.innerHTML = '';
        tablaContainer.appendChild(tabla);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  
  

