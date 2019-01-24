//*************
//S: Utilidades

function getParametro_url(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

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

function uiCalcular(){
    var precio = document.getElementById("valor").value;
    var anoIn = document.getElementById("inicial").value;
    var anoFin = document.getElementById("final").value;

    console.log("uiCalcular0", precio, anoIn, anoFin);
    calculadora(precio, anoIn, anoFin);
}

async function iniciarEnBrowser(){
    await tomarDatos(); //A: Esperamos qe termine antes de segir
	var uiBtn = document.getElementById("button");
    var inicio = document.getElementById("inicial");
    inicio.max= moment().format('YYYY-MM-DD');
    var final = document.getElementById("final");
    final.max = moment().format('YYYY-MM-DD');
    final.value = moment().format('YYYY-MM-DD');
    var precio = document.getElementById("valor");
    
    var precio_el= getParametro_url("p");
    var fechaInicial= getParametro_url("i");
    var fechaFinal= getParametro_url("f");
    
    if(precio_el != null){
        precio.value= precio_el;
    }
    
    if(fechaInicial != null){
        inicio.value= fechaInicial;
    }
    if(fechaFinal != null){
        final.value= fechaFinal;
    }
    
	uiBtn.onclick = uiCalcular;
    
    if(fechaInicial && fechaFinal){//A: Si ya tengo las dos fechas
        uiCalcular();
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
        
        var cerAntes_el= document.getElementById("cerAntes");
        var cerDespues_el= document.getElementById("cerDespues");
        cerAntes_el.innerHTML= "<i> CER = " + datos[desde] + "</i>";
        cerDespues_el.innerHTML= "<i> CER = " + datos[hasta] + "</i>";
        
        var respuesta = document.getElementById("respuesta");
		respuesta.innerHTML = "Lo qe en " + desde + " costaba $<strong>" + precioOrig + "</strong>, en " + hasta + " cuesta: $<strong>" + precioNuevo + "</strong>";
	} else {
		alert("Fijate qe las fechas estén en el orden correcto (el año inicial tiene qe ser menor qe el año final)");
	};
}