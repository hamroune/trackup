/*
* Inject cssviewer.js/cssviewer.css into the current page
*/
var ports = [];

chrome.browserAction.onClicked.addListener(function(tab) {
    //alert('created Yeappp ==>'+tab.id)

    chrome.tabs.executeScript(tab.id, {file:'js/cssviewer.js'});
    chrome.tabs.insertCSS(tab.id, {file:'css/cssviewer.css'});
    
});


chrome.runtime.onConnect.addListener(function(port) {
        alert('onConnect')
        if (port.name !== "devtools") return;
        ports.push(port);
        // Remove port when destroyed (eg when devtools instance is closed)
        port.onDisconnect.addListener(function() {
            var i = ports.indexOf(port);
            if (i !== -1) ports.splice(i, 1);
        });
        port.onMessage.addListener(function(msg) {
            // Received message from devtools. Do something:
            console.log('Received message from devtools page', msg);
            if (msg.type==="disable") chrome.tabs.insertCSS(null, {file:'css/desactivateClick.css'});
            if (msg.type==="enable")  chrome.tabs.insertCSS(null, {file:'css/activateClick.css'});
            //alert('Received message from devtools page ==>'+JSON.stringify(msg))
        });


        notifyDevtools("message envoyé");

});

//From CssViewer
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    notifyDevtools(message)
});

// Function to send a message to all devtools.html views:
function notifyDevtools(msg) {
    ports.forEach(function(port) {
        port.postMessage(msg);
    });
}