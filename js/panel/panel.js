
function do_something(msg) {
    document.body.innerHTML = document.body.innerHTML + "</br> <span>"+JSON.stringify(msg)+"</span>"; // Stupid example, PoC
}
document.getElementsById("disable").onclick = function() {
	/*var p = document.createElement("style");
	console.log(p);
	// l'ajoute à la fin du corps du document
	document.body.appendChild(p);
	var t = document.getElementsByTagName("style");
	
	t[t.length-1].innerHTML='* { pointer-events: none; cursor: default; } ';*/
	alert("disable");
};


document.getElementsById("enable").onclick = function() {
	/*t = document.getElementsByTagName("style");
t[t.length-1].innerHTML = "";	*/
alert("enable");
};  

  
