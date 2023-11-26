/**ESTE COMPONENTE SE ENCARGA DE MOSTRAR EL DETALLE DE UN PRODUCTO */
import { productosServices } from "../../../servicios/productos-servicios.js";
import { ventasServices } from "../../../servicios/ventas-servicios.js";
import { getUsuarioAutenticado } from "../login/login.js";

export async function vistaProducto(){
    /**1-En esta función se deben capturar los elementos html: .carrusel, .seccionProducto, .seccionLogin. Para luego 
     * blanquear su contenido. 
     * 2-Se deberá capturar el elemento .vistaProducto.
     * 3-Se deberá llamar a la función leerParametro para recuperar de la url el idProducto. 
     * 4-Luego se deberán leer los datos del producto indentificado con el idProducto recuperado.
     * 5-Llamar a la función htmlVistaProducto.
     * 6-El resultado de la función deberá asignarse al elemento .vistaProducto capturado previamente.
     * 7-Se deberá capturar el elemento html correspondiente al anchor btnComprar y enlazar el evento click a la función registrarCompra.  
    */
    let d = document;
    let res;
    let carrusel = d.querySelector(".carrusel");
    let seccionProductos = d.querySelector(".seccionProductos");
    let vistaProducto = d.querySelector(".vistaProducto");
    carrusel.innerHTML = "";
    let seccionLogin = d.querySelector(".seccionLogin");
    seccionLogin.innerHTML("");
    seccionProductos.innerHTML="";
    let idProducto=leerParametro();
 
    res=await productosServices.listar(idProducto);
    vistaProducto.innerHTML= htmlVistaProducto(res.id,res.nombre,res.descripcion,res.precio)
    let btnComprar=document.getElementById("btnComprar")
    btnComprar.addEventListener("click",registrarCompra);
    
}

function htmlVistaProducto(id, nombre, descripcion, precio, imagen) {
    let cad =
    `
    <div class="imagen">
        <img src="${imagen}" alt="producto">
    </div>
    <div class="texto">
        <p id="nameProducto" data-idProducto=${id}>${nombre}</p>

        <p id="descripcionProducto">${descripcion}</p>

        <p id="precioProducto">${precio}</p>

        <div class="form-group">
            <label for="cantidadProducto">Cantidad</label>
            <input type="number" step="1" min ="1" value="1" id="cantidadProducto">
        </div>

        <a id="btnComprar" >Comprar</a>
    </div>
    `;

    return cad

    
}
function leerParametro(){
    // Captura el idProducto de la dirección URL enviada por la página que llama
    const words = new URLSearchParams(window.location.search);
    let cad = words.get("idProducto");
    if (!cad) return null;
    return cad.trim();
}


function registrarCompra(){
    /**1-Esta función es la encargada de procesar el evento click del anchor btnComprar.
     * 2-Luego deberá recuperar con la función getUsuarioAutenticado presente en el módulo login.js el objeto session
     * 3-Si la propiedad autenticado del objeto session es falso, el usuario no ha iniciado sesión, y se deberá emitir 
     *   una alerta que comunique al usuario que antes de realizar una compra debe haber iniciado sesión y salir de la 
     * ejecución de la función.
     * 4-Si la propiedad autenticado es true la ejecución continua.
     * 5-En este punto se deben almacenar los datos necesario para registrar la venta.
     * 5-Necesitamos idUsuario, emailUsuario, idProducto, nameProducto, cantidad y fecha.
     * 6-Los dos primeros los extraemos del objeto session.
     * 7-El resto de los datos los capturamos desde el objeto document utilizando los id: nameProducto, cantidadProducto. 
     *   El idProducto lo recuperamos desde el atributo data-idproducto y a fecha la obtenemos desde la fecha del sistema con
     *   el objeto Date() de javascript.
     * 8-Una vez reunido todos los datos necesarios llamamos a la función ventasServices.crear pasando lo parámetros obtenidos. 
     * 9-Luego de registrar la venta utilizando el objeto location.replace("tienda.html") renderizamos nuevamente la página 
     *   dejando el sitio en el estado inicial.
     * 10-Finalmente emitimos una alerta con la leyenda "Compra finalizada."
     *     
     */
    
    let session = getUsuarioAutenticado();
    if(!session.autenticado){
      alert("Antes de comprar debe iniciar sesión")
      return;
    }
    let cantidad = document.getElementById("cantidadProducto").value;
    let idUsuario = session.idUsuario
    let emailUsuario = session.email;
    let nameProducto = document.getElementById("nameProducto");
    let idProducto = nameProducto.getAttribute("data-...")
    const fecha = new Date();
    ventasServices.crear(idUsuario,idProducto,nameProducto.textContent,emailUsuario,cantidad,fecha,0);
    location.replace("tienda.html");
    alert('compra realizada');
}