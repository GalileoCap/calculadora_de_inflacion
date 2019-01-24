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
    var fechaIn = document.getElementById("inicio").value;
    fechaIn = moment(fechaIn).format("DD/MM/YYYY");
    var fechaFin = document.getElementById("final").value;
    fechaFin = moment(fechaFin).format("DD/MM/YYYY");

    console.log("uiCalcular", precio, fechaIn, fechaFin);
    calculadora(precio, fechaIn, fechaFin);
}

async function iniciarEnBrowser(){
    await tomarDatos(); //A: Esperamos qe termine antes de segir
	var uiBtn = document.getElementById("button");
    var uiInicio = document.getElementById("inicio");
    uiInicio.max= moment().format('YYYY-MM-DD');
    var uiFin = document.getElementById("final");
    final.max = moment().format('YYYY-MM-DD');
    final.value = moment().format('YYYY-MM-DD');
    var uiPrecio = document.getElementById("valor");
    
    var precioUrl= getParametro_url("p");
    var fechaInUrl= getParametro_url("i");
    var fechaFinUrl= getParametro_url("f");
    
    if(precioUrl != null){
        uiPrecio.value= precioUrl;
    }
    
    if(fechaInUrl != null){
        uiInicio.value= fechaInUrl;
    }
    if(fechaFinUrl != null){
        uiFin.value= fechaFinUrl;
    }
    
	uiBtn.onclick = uiCalcular;
    
    if(fechaInUrl && fechaFinUrl){//A: Si ya tengo las dos fechas
        uiCalcular();
    }
}

//********************************************************
//S: Calculadora
function calculadora(precioOrig, desde, hasta){
	var precioNuevo = precioOrig;
    
	if(desde < hasta){
        precioNuevo = precioOrig*datos[hasta]/datos[desde];
        //console.log("PRECIO FINAL:", precioNuevo, "DESDE2", datos[desde], "HASTA2:", datos[hasta]);
        precioNuevo = parseFloat(precioNuevo).toFixed(2); //U: Redondea a dos decimales
        
        var cerAntes_el= document.getElementById("cerAntes");
        var cerDespues_el= document.getElementById("cerDespues");
        cerAntes_el.innerHTML= "<i> CER = " + datos[desde] + "</i>";
        cerDespues_el.innerHTML= "<i> CER = " + datos[hasta] + "</i>";
        
        var respuesta_el = document.getElementById("respuesta");
		respuesta_el.innerHTML = "Lo qe en " + desde + " costaba $<strong>" + precioOrig + "</strong>, en " + hasta + " cuesta: $<strong>" + precioNuevo + "</strong>";
	} else {
		alert("Fijate qe las fechas esten en el orden correcto (la fecha inicial tiene qe ser menor qe la fecha final)");
	};
}