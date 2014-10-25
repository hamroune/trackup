
function do_something(msg) {
    document.body.innerHTML = "</br> <span>"+JSON.stringify(msg)+"</span>"; // Stupid example, PoC
}
document.documentElement.onclick = function() {
	//alert('nother stupid example SENT')
    // No need to check for the existence of `respond`, because
    // the panel can only be clicked when it's visible...
    respond('Another stupid example!');
};
