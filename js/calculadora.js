document.addEventListener('DOMContentLoaded', () => {

    const inputs = document.querySelectorAll('#calculator input');
    const numCols = 2; // número de columnas
    const numRows = inputs.length / numCols;

    inputs.forEach((input, index) => {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault(); // evitar que el formulario se envíe

                //redondear el valor a 2 decimales
                let valor = parseFloat(input.value) || 0;
                input.value = valor.toFixed(2);

                //mover el foco
                let currentRow = Math.floor(index / numCols);
                let currentCol = index % numCols;
                let nextIndex;

                if (currentRow + 1 < numRows) {
                    nextIndex = index + numCols; // fila siguiente, misma columna
                    inputs[nextIndex].focus();
                } else if (currentCol + 1 < numCols) {
                    nextIndex = currentCol + 1; // primera fila de la columna siguiente
                    inputs[nextIndex].focus();
                } else {
                    input.blur(); // última fila y columna → desenfocar
                }

                actualizarTotales();
                actualizarUtilidades();
            }
        });
    });
    function actualizarTotales() {
        // Totales de ingresos
        let totIngresos = 0;
        let hayIngresos = false;

        document.querySelectorAll('.ingresos').forEach(i => {
            let valor = parseFloat(i.value);
            if(valor < 0) valor = 0;
            i.value = valor.toFixed(2);

            if (!isNaN(valor)) {
                totIngresos += valor;
                hayIngresos = true;
            }
        });

        const celdaIngresos = document.getElementById('total_ingresos');
        celdaIngresos.textContent = hayIngresos ? totIngresos.toFixed(2) : '-';

        // Totales de deducciones
        let totDeducciones = 0;
        let hayDeducciones = false;

        document.querySelectorAll('.deducciones').forEach(i => {
            let valor = parseFloat(i.value);

            if(valor < 0) valor = 0;
            i.value = valor.toFixed(2);

            if (!isNaN(valor)) {
                totDeducciones += valor;
                hayDeducciones = true;
            }
        });

        const celdaDeducciones = document.getElementById('total_deducciones');
        celdaDeducciones.textContent = hayDeducciones ? totDeducciones.toFixed(2) : '-';

        let totUtilidades = document.getElementById('total_utilidades');
        let hayUtilidades = false;

        totUtilidades.textContent = ((totIngresos - totDeducciones) || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function actualizarUtilidades() {
        const filas = document.querySelectorAll('#calculator tbody tr');

        filas.forEach(fila => {
            const ingresoInput = fila.querySelector('.ingresos');
            const deduccionesInput = fila.querySelector('.deducciones');
            const utilidadesCelda = fila.querySelector('.utilidad');

            const ingreso = parseFloat(ingresoInput.value);
            const deducciones = parseFloat(deduccionesInput.value);

            if (isNaN(ingreso) && isNaN(deducciones)) {
                // Si ambos están vacíos, mostrar ''
                utilidadesCelda.textContent = '';
            } else {
                // Si hay algún valor, mostrar la resta redondeada
                const utilidad = (ingreso || 0) - (deducciones || 0);
                utilidadesCelda.textContent = utilidad === 0 && ingreso === 0 && deducciones === 0
                    ? ''
                : utilidad.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        });
    }

    //Año de nacimiento usuario
    const fechaInput = document.getElementById('fechaNacimiento');

    fechaInput.addEventListener('keydown', (e)=>{
        if(e.key==='Enter') e.preventDefault();

        let valor = fechaInput.value.replace(/\D/g, '') // Eliminamos no números
        if(valor.length>2) valor = valor.slice(0,2) + '/' + valor.slice(2);
        if(valor.length>5) valor = valor.slice(0,5) + '/' + valor.slice(5,8);
        fechaInput.value = valor;
    });
});


