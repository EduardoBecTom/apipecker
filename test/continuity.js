const { run } = require("../index.js");

const CONCURRENT_USERS = 3;
const MAX_ITERATIONS = 50; 
const DELAY = 50;
const min_iterations = 10;
const ITERATIONS_CUTOFF = 20;

const _RESET = '\x1b[0m';
const _CYAN = '\x1b[36m';
const _GREEN = '\x1b[32m';
const _MAGENTA = '\x1b[35m';
const _RED = '\x1b[31m';



function myUrlBuilder(user, iteration) {
    const jitter = Math.floor(Math.random() * 15);
    return `http://localhost:3000/api/v1/stress/${100 + jitter}`;
}


n_iter = 0;
function myContinuityHandler(lotResult) {
    n_iter ++;


    if (n_iter < min_iterations) return true;

    console.log(`${_CYAN}[Continuity]${_RESET} Lote: ${lotResult.id} | Numero de iteración: ${n_iter} | Objetivo: ${ITERATIONS_CUTOFF}`);


    return !(n_iter == ITERATIONS_CUTOFF) ;
}

function myResultsHandler(results) {
    console.log(`${_MAGENTA} Hey, I'm the resultsHandler, and I'm handling the results:\n ${JSON.stringify(results,null,2)}${_RESET}`);    
    


    console.log(`${_CYAN}\n--- RESUMEN FINAL ---${_RESET}`);
    console.log(`Lotes ejecutados: ${results.lotStats.length} / ${MAX_ITERATIONS}`);
    
    if (results.lotStats.length < MAX_ITERATIONS) {
        console.log(`${_GREEN}NUMERO DE ITERACIONES ALCANZADO:${_RESET} debió parar en ${ITERATIONS_CUTOFF} y paró en ${results.lotStats.length}.`);
    } else {
        console.log(`${_RED}LÍMITE ALCANZADO:${_RESET} Se agotaron las iteraciones y el script no paró automáticamente.`);
    }
    process.exit(0);
}


run({
    concurrentUsers: CONCURRENT_USERS,
    iterations: MAX_ITERATIONS,
    delay: DELAY,
    verbose: false,
    consoleLogging: true,
    urlBuilder: myUrlBuilder,
    resultsHandler: myResultsHandler,
    continuityHandler: myContinuityHandler
});