//********************************************************
//S: "BASE DE DATOS"
CfgClaveCer = 3540;

datos = {}; //U: los que trajimos del BCRA

function tomarDatos() {
    datos = {};
	console.log("Datos tomados de http://www.bcra.gob.ar/Pdfs/PublicacionesEstadisticas/tas5_ser.txt");
    return fetch("https://cors-anywhere.herokuapp.com/http://www.bcra.gob.ar/Pdfs/PublicacionesEstadisticas/tas5_ser.txt")
        .then( res => { return res.text()})
        .then( t => {
            (t.split(/[\r\n]+/).map( l => { 
                var c= l.split(";");
                if(c[0] == CfgClaveCer){
                    datos[c[1]]= parseFloat(c[2]); 
                }
            }))                                             
            console.log("Largo de los datos (deberia ser 3181)", Object.keys(datos).length);
            return datos;   
        });
}

//********************************************************
//S: Interacción con la página
function iniciarEnBrowser(){
    tomarDatos();
	var uiBtn = document.getElementById("button");
    var final = document.getElementById("final");
    final.max = moment().format('YYYY-MM-DD');
    final.value = moment().format('YYYY-MM-DD');
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
        precioNuevo = parseFloat(precioNuevo).toFixed(2); //U: Redondea a dos decimales
        
        var respuesta = document.getElementById("respuesta");
		respuesta.innerHTML = "Lo qe en " + desde + " costaba $<strong>" + precioOrig + "</strong>, en " + hasta + " cuesta: $<strong>" + precioNuevo + "</strong>";
	} else {
		alert("Fijate qe las fechas estén en el orden correcto (el año inicial tiene qe ser menor qe el año final)");
	};
}