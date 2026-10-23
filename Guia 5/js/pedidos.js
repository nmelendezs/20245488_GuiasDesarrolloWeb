const pedidos = [];
let precioMaximo = null;

const productoInput = document.querySelector("#producto");
const precioInput = document.querySelector("#precio");
const cantidadInput = document.querySelector("#cantidad");
const precioMaximoInput = document.querySelector("#precioMaximo");
const mensaje = document.querySelector("#mensaje");
const cuerpoTabla = document.querySelector("#cuerpoTabla");
const totalUnidades = document.querySelector("#totalUnidades");
const montoTotal = document.querySelector("#montoTotal");

document.querySelector("#btnAgregar").addEventListener("click", agregarPedido);
document.querySelector("#btnFiltrar").addEventListener("click", filtrarProductos);
document.querySelector("#btnMostrar").addEventListener("click", mostrarTodos);
document.querySelector("#btnLimpiar").addEventListener("click", limpiarPedidos);

render();

function agregarPedido() {
    const pedido = leerPedido();
    const error = validarPedido(pedido);
    if (error) {
        mostrarMensaje(error);
        return;
    }
    pedidos.push(pedido);
    limpiarFormulario();
    mostrarMensaje("");
    render();
}

function leerPedido() {
    return {
        producto: productoInput.value.trim(),
        precio: Number(precioInput.value),
        cantidad: Number(cantidadInput.value)
    };
}

function validarPedido(pedido) {
    if (pedido.producto === "") {
        return "El nombre del producto es obligatorio.";
    }
    if (!Number.isFinite(pedido.precio) || pedido.precio <= 0) {
        return "El precio unitario debe ser mayor que cero.";
    }
    if (!Number.isInteger(pedido.cantidad) || pedido.cantidad <= 0) {
        return "La cantidad debe ser un número entero positivo.";
    }
    return "";
}

function filtrarProductos() {
    const valor = precioMaximoInput.value.trim();
    const limite = Number(valor);
    if (valor === "" || !Number.isFinite(limite) || limite < 0) {
        mostrarMensaje("Indica un precio máximo válido.");
        return;
    }
    precioMaximo = limite;
    mostrarMensaje("");
    render();
}

function mostrarTodos() {
    precioMaximo = null;
    precioMaximoInput.value = "";
    mostrarMensaje("");
    render();
}

function limpiarPedidos() {
    pedidos.length = 0;
    precioMaximo = null;
    precioMaximoInput.value = "";
    mostrarMensaje("");
    render();
}

function pedidosVisibles() {
    if (precioMaximo === null) {
        return pedidos;
    }
    return pedidos.filter((pedido) => pedido.precio <= precioMaximo);
}

function calcularTotales(lista) {
    return lista.reduce((acumulado, pedido) => {
        return {
            unidades: acumulado.unidades + pedido.cantidad,
            monto: acumulado.monto + pedido.precio * pedido.cantidad
        };
    }, { unidades: 0, monto: 0 });
}

function render() {
    const visibles = pedidosVisibles();
    renderTabla(visibles);
    renderTotales(calcularTotales(visibles));
}

function renderTabla(lista) {
    if (lista.length === 0) {
        const texto = pedidos.length === 0
            ? "No hay pedidos registrados."
            : "Ningún pedido tiene un precio menor o igual al indicado.";
        cuerpoTabla.innerHTML = `<tr><td colspan="4">${texto}</td></tr>`;
        return;
    }
    cuerpoTabla.innerHTML = lista.map((pedido) => {
        const subtotal = pedido.precio * pedido.cantidad;
        return `<tr>
            <td>${escapar(pedido.producto)}</td>
            <td>${pedido.precio.toFixed(2)}</td>
            <td>${pedido.cantidad}</td>
            <td>${subtotal.toFixed(2)}</td>
        </tr>`;
    }).join("");
}

function renderTotales(totales) {
    totalUnidades.textContent = String(totales.unidades);
    montoTotal.textContent = totales.monto.toFixed(2);
}

function mostrarMensaje(texto) {
    mensaje.textContent = texto;
    mensaje.hidden = texto === "";
}

function limpiarFormulario() {
    productoInput.value = "";
    precioInput.value = "";
    cantidadInput.value = "";
    productoInput.focus();
}

function escapar(texto) {
    return texto
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}
