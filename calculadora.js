//********************************************************
//S: "BASE DE DATOS"
datos = {}; //U: los que trajimos del BCRA

function tomarDatos() {
    datos = {};
	console.log("Datos tomados de http://www.bcra.gob.ar/Pdfs/PublicacionesEstadisticas/tas5_ser.txt");
    return fetch("https://cors-anywhere.herokuapp.com/http://www.bcra.gob.ar/Pdfs/PublicacionesEstadisticas/tas5_ser.txt")
        .then( res => { return res.text()})
        .then( t => {
            (t.split(/[\r\n]+/).map( l => { var c= l.split(";"); datos[c[1]]= parseFloat(c[2]); })) 
            return datos;   
        });
}
//XXX: Cuando pruebo con:
//var count= Object.keys(datos).length;
//me entero qe datos tiene 10188 elementos, cuando revisando en la lista del test.txt (haciendo "la cantidad de filas en total - desde cual me importan los datos") me entero qe tendría qe tener 33181
//********************************************************
//S: Interacción con la página
function iniciarEnBrowser(){
    tomarDatos();
	var uiBtn = document.getElementById("button");
	uiBtn.onclick = function(){
		var precio = document.getElementById("valor").value;
		var anoIn = document.getElementById("inicial").value;
		var anoFin = document.getElementById("final").value;

		calculadora(precio, anoIn, anoFin);
	}
}

//********************************************************
//S: Calculadora
function calculadora(precioOrig, anoIn, anoFin){
	var desde = moment(anoIn).format("DD/MM/YYYY");
	var hasta = moment(anoFin).format("DD/MM/YYYY");
	var precioNuevo = precioOrig;
	//console.log("CALCULO:", precioNuevo, "DESDE:", desde, "HASTA:", hasta);
    
	if(desde < hasta){
        precioNuevo = precioOrig*datos[hasta]/datos[desde];
        //console.log("PRECIO FINAL:", precioNuevo, "DESDE2", datos[desde], "HASTA2:", datos[hasta]);
        
        var respuesta = document.getElementById("respuesta");
		respuesta.innerHTML = "Lo qe en " + desde + " costaba $<strong>" + precioOrig + "</strong>, en " + hasta + " cuesta: $<strong>" + precioNuevo + "</strong>";
	} else {
		alert("Fijate qe las fechas estén en el orden correcto (el año inicial tiene qe ser menor qe el año final)");
	};
}