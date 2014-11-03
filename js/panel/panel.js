function do_something(msg) {
//document.getElementById("disable").addEventListener.("click", handler);
document.getElementById('msg').innerHTML = "</br> <span>"+JSON.stringify(msg)+"</span>"; // Stupid example, PoC
//alert('test1')

var disable = document.getElementById('disable');
disable.onclick = function() {
	  respond({ type: "disable", body: {} })
};

var enable = document.getElementById('enable');
enable.onclick = function() {
    respond({ type: "enable", body: {} })
};

}