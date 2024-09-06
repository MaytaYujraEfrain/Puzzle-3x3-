const estadoInicial = [
    [1, 3, 5],
    [4, 2, 6],
    [null, 7, 8] // null representa el espacio vacío
];

const estadoObjetivo = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null]
];

let estadoActual;
let pasosSolucion = [];
let nodosExplorados = [];

function reiniciarPuzzle() {
    estadoActual = JSON.parse(JSON.stringify(estadoInicial));
    renderizarPuzzle();
    pasosSolucion = [];
    nodosExplorados = [];
    document.getElementById('explorados-log').innerHTML = '';
    document.getElementById('solucion-log').innerHTML = '';
}

function renderizarPuzzle() {
    const contenedorPuzzle = document.getElementById('puzzle');
    contenedorPuzzle.innerHTML = '';
    estadoActual.forEach(fila => {
        fila.forEach(tile => {
            const elementoTile = document.createElement('div');
            elementoTile.className = 'tile';
            if (tile === null) {
                elementoTile.classList.add('empty');
            } else {
                elementoTile.textContent = tile;
            }
            contenedorPuzzle.appendChild(elementoTile);
        });
    });
}

function encontrarTile(tile, estado) {
    for (let fila = 0; fila < 3; fila++) {
        for (let col = 0; col < 3; col++) {
            if (estado[fila][col] === tile) {
                return [fila, col];
            }
        }
    }
}

function pruebaObjetivo(estado) {
    for (let fila = 0; fila < 3; fila++) {
        for (let col = 0; col < 3; col++) {
            if (estado[fila][col] !== estadoObjetivo[fila][col]) {
                return false;
            }
        }
    }
    return true;
}

function ACCIONES(s) {
    const [filaVacia, colVacia] = encontrarTile(null, s);
    const acciones = [];
    if (filaVacia > 0) acciones.push([filaVacia - 1, colVacia]); // Mover hacia abajo
    if (filaVacia < 2) acciones.push([filaVacia + 1, colVacia]); // Mover hacia arriba
    if (colVacia > 0) acciones.push([filaVacia, colVacia - 1]); // Mover a la derecha
    if (colVacia < 2) acciones.push([filaVacia, colVacia + 1]); // Mover a la izquierda
    return acciones;
}

function RESULTADO(s, a) {
    const nuevoEstado = JSON.parse(JSON.stringify(s));
    const [filaVacia, colVacia] = encontrarTile(null, nuevoEstado);
    const [filaDestino, colDestino] = a;
    nuevoEstado[filaVacia][colVacia] = nuevoEstado[filaDestino][colDestino];
    nuevoEstado[filaDestino][colDestino] = null;
    return nuevoEstado;
}

function bfs(estado) {
    const cola = [{ estado: estado, ruta: [] }];
    const explorados = new Set();
    nodosExplorados = [];

    while (cola.length > 0) {
        const nodo = cola.shift();
        const estadoActual = nodo.estado;
        const rutaActual = nodo.ruta;

        registrarNodoExplorado(estadoActual, nodosExplorados.length + 1);

        if (pruebaObjetivo(estadoActual)) {
            return rutaActual;
        }

        const estadoActualString = JSON.stringify(estadoActual);
        if (!explorados.has(estadoActualString)) {
            explorados.add(estadoActualString);
            const acciones = ACCIONES(estadoActual);
            acciones.forEach(accion => {
                const nuevoEstado = RESULTADO(estadoActual, accion);
                const nuevaRuta = rutaActual.concat([accion]);
                cola.push({ estado: nuevoEstado, ruta: nuevaRuta });
            });
        }
    }
    return null;
}

function registrarNodoExplorado(estado, indice) {
    nodosExplorados.push(estado);
    const logElemento = document.createElement('div');
    logElemento.className = 'log';
    
    const logHeader = document.createElement('div');
    logHeader.className = 'log-header';
    logHeader.textContent = `Nodo ${indice}`;
    logElemento.appendChild(logHeader);

    const logBody = document.createElement('div');
    logBody.className = 'log-body';
    estado.forEach(fila => {
        fila.forEach(tile => {
            const elementoTile = document.createElement('div');
            if (tile === null) {
                elementoTile.className = 'empty';
            } else {
                elementoTile.textContent = tile;
            }
            logBody.appendChild(elementoTile);
        });
    });
    logElemento.appendChild(logBody);
    document.getElementById('explorados-log').appendChild(logElemento);
}

function registrarRutaSolucion(ruta) {
    const solucionLog = document.getElementById('solucion-log');
    solucionLog.innerHTML = '';
    
    let estado = JSON.parse(JSON.stringify(estadoInicial));

    ruta.forEach((paso, indice) => {
        estado = RESULTADO(estado, paso);
        const logElemento = document.createElement('div');
        logElemento.className = 'log';

        const logHeader = document.createElement('div');
        logHeader.className = 'log-header';
        logHeader.textContent = `Paso ${indice + 1}`;
        logElemento.appendChild(logHeader);

        const logBody = document.createElement('div');
        logBody.className = 'log-body';

        estado.forEach(fila => {
            fila.forEach(tile => {
                const elementoTile = document.createElement('div');
                if (tile === null) {
                    elementoTile.className = 'empty';
                } else {
                    elementoTile.textContent = tile;
                }
                logBody.appendChild(elementoTile);
            });
        });

        logElemento.appendChild(logBody);
        solucionLog.appendChild(logElemento);
    });
}

function resolverPuzzle() {
    pasosSolucion = bfs(estadoActual);
    if (pasosSolucion.length > 0) {
        registrarRutaSolucion(pasosSolucion);
        animarSolucion();
    }
}

function animarSolucion() {
    if (pasosSolucion.length > 0) {
        const siguientePaso = pasosSolucion.shift();
        estadoActual = RESULTADO(estadoActual, siguientePaso);
        renderizarPuzzle();
        setTimeout(animarSolucion, 1000);
    }
}

reiniciarPuzzle();