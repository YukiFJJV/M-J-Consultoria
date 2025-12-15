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
                setTimeout(Exoneracion, 10);
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
        if (edadCalc !== null) Exoneracion();
    }

    //Año de nacimiento usuario
    const fechaInput = document.getElementById('fechaNacimiento');
    const errorFecha = document.getElementById('errorFecha');
    const edad = document.getElementById('edad');
    const actualYear = new Date().getFullYear();

    let edadCalc = null; // edad anual para ISR, accesible globalmente

    // Quitar foco con Enter
    fechaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fechaInput.blur();
        }
    });

    // Formato + validación
    fechaInput.addEventListener('input', () => {
        let numeros = fechaInput.value.replace(/\D/g, '').slice(0, 8);
        let resultado = '';

        if (numeros.length >= 1) resultado = numeros.slice(0, 2);
        if (numeros.length >= 3) resultado = numeros.slice(0, 2) + '/' + numeros.slice(2, 4);
        if (numeros.length >= 5) resultado = numeros.slice(0, 2) + '/' + numeros.slice(2, 4) + '/' + numeros.slice(4, 8);

        fechaInput.value = resultado;

        // Limpiar edad y errores mientras no esté completa
        errorFecha.textContent = '';
        edad.textContent = '';
        edadCalc = null;

        if (numeros.length === 8) {
            const dia = parseInt(numeros.slice(0, 2));
            const mes = parseInt(numeros.slice(2, 4));
            const yearInput = parseInt(numeros.slice(4, 8));

            // Validaciones básicas
            if (yearInput > actualYear || mes < 1 || mes > 12) {
                errorFecha.textContent = 'Fecha no válida';
                return;
            }

            const diasPorMes = [
                31,
                (yearInput % 4 === 0 && (yearInput % 100 !== 0 || yearInput % 400 === 0)) ? 29 : 28,
                31, 30, 31, 30, 31, 31, 30, 31, 30, 31
            ];
            if (dia < 1 || dia > diasPorMes[mes - 1]) {
                errorFecha.textContent = 'Fecha no válida';
                return;
            }

            // Calcular edad anual para ISR
            edadCalc = actualYear - yearInput;

            if (edadCalc < 18) {
                errorFecha.textContent = 'Fecha no válida (Menor de edad)';
                edadCalc = null;
                return;
            }

            // Mostrar edad anual
            edad.textContent = `${edadCalc} años`;
            const totUtilidades = parseFloat(document.getElementById('total_utilidades').textContent.replace(/,/g, '')) || 0;
            if (totUtilidades) Exoneracion();
        }
    });
    function Exoneracion() {
        const celdaBaseImponible = document.getElementById('baseImponible');
        const celdaExoneracion = document.getElementById('exoneraciones');
        const celdaGastosMedicos = document.getElementById('gastosMedicos');
        const utilidadesCelda = document.getElementById('total_utilidades');

        // Convertir a número válido
        let total_utilidades = parseFloat(utilidadesCelda.textContent.replace(/,/g, ''));
        if (isNaN(total_utilidades)) total_utilidades = 0;

        if (edadCalc === null) return; // si no hay edad, no hacer nada

        let baseImponible = 0;
        let exoneracion = 0;
        let gastosMedicos = 0;

        if (edadCalc < 60) {
            gastosMedicos = 40000;
            baseImponible = total_utilidades - gastosMedicos;
        } else if (edadCalc >= 60 && edadCalc < 65) {
            gastosMedicos = 70000;
            baseImponible = total_utilidades - gastosMedicos;
        } else {
            exoneracion = 350000;
            gastosMedicos = 110000;
            baseImponible = total_utilidades - exoneracion - gastosMedicos;
        }

        celdaExoneracion.textContent = exoneracion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        celdaGastosMedicos.textContent = gastosMedicos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        celdaBaseImponible.textContent = baseImponible.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
});