// Script executed every time the devtools are opened.

// custom panel
chrome.devtools.panels.create("UserTrack", "img/panel.png", "panel.html", function(extensionPanel) {
    
    extensionPanel.onShown.addListener(function tmp(panelWindow) {
    	//alert('onShown...?'+JSON.stringify(data))
        //extensionPanel.onShown.removeListener(tmp); // Run once only

        //c'est la window du panel
        _window = panelWindow;


        //on écoute les messages qui arrive
        var data = [];
	    var port = chrome.runtime.connect({name: 'devtools'});
	    //Message du Background --> Panel
	    port.onMessage.addListener(function(msg) {
	    	//alert('port addListener msg received =>'+msg);
	    	// Write information to the panel, if exists.
	        // If we don't have a panel reference (yet), queue the data.
	        if (_window) {
	        	//alert('do_something...1')
	            _window.do_something(msg);
	        } else {
	            data.push(msg);
	        }

	        //Réponse
	        // Release queued data
	        var msg;
	        while (msg = data.shift()) 
	            _window.do_something(msg);
	        // Just to show that it's easy to talk to pass a message back:
	        _window.respond = function(msg) {
	        	//alert('Reponse')
	            port.postMessage(msg);
	        };

	    });

        
    });
});




