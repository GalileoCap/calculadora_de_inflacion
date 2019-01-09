//********************************************************
//S: "BASE DE DATOS"
var datos = [19.9, 17.6, 13.6, 13.1, 31, 15.6, 36.7, 38.8, 4, 3.8, 12.3, 13.4, 27.7, 22.5, 113.7, 27.3, 13.5, 28.1, 24, 22.2, 28.6, 31.9, 16.2, 7.6, 13.6, 34.7, 58.5, 60.3, 24.2, 182.8, 444.1, 176, 175.5, 159.5, 100.8, 164.7, 343.5, 433.7, 688, 385.4, 81.9, 174.8, 387.7, 3079.5, 2314, 84, 17.5, 7.4, 3.9, 1.6, 0.1, 0.3, 0.7, 1.1, -0.9, -1.1, 40.9, 13.4, 4.4, 9.8, 10.9, 8.5, 7.2, 7.7, 10.9, 9.5, 10.8, 10.9, 23.9, 0, 36.2, 24.8]; //Todos los datos desde 1945 hasta el 2017 tomados de https://es.wikipedia.org/wiki/Anexo:Evolución_del_Índice_de_Precios_al_Consumidor_en_Argentina

//********************************************************
//S: Interacción con la página
function iniciarEnBrowser(){
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
	var desde = anoIn - 1944;
	var hasta = anoFin - 1945;
	var precioNuevo = precioOrig;
	
	if(desde < hasta){
		for(var t = desde; t <= hasta; t++){
			precioNuevo += precioNuevo * datos[t];
		}
	} else {
		alert("Fijate qe las fechas estén en el orden correcto (el año inicial es menor o igual qe el año final)");
	}
	alert(["Lo qe en", anoIn, "valía", precioOrig, ", en", anoFin, "vale", precioNuevo]);
}