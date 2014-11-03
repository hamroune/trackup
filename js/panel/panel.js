
function do_something(msg) {
    document.body.innerHTML = document.body.innerHTML + "</br> <span>"+JSON.stringify(msg)+"</span>"; // Stupid example, PoC
}
document.documentElement.onclick = function() {
	//alert('nother stupid example SENT')
    // No need to check for the existence of `respond`, because
    // the panel can only be clicked when it's visible...
    respond('Another stupid example!');
};


function disable(){
	var p = document.createElement("style");
	
	// l'ajoute à la fin du corps du document
	document.body.appendChild(p);
	var t = document.getElementsByTagName("style");
	
	t[t.length-1].innerHTML='* { pointer-events: none; cursor: default; } ';
	alert("disable");
}  

  
function enable(){
t = document.getElementsByTagName("style");
t[t.length-1].innerHTML = "";	
alert("enable");
} 