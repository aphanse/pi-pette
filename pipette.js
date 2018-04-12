
// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

//////////////////////////////////////////////////////////////////////////////////////
// 			                 														//
// 			                  		Event Listeners									//
// 			                  														//
//////////////////////////////////////////////////////////////////////////////////////
// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {


	},

	// Keyboard events arrive here
	"keydown": function(evt) {},

	// Click events arrive here
	"click": function(evt) {},

	"mousedown": function(event) {
		if (event.target.className == "protocol") {
			var protocol = event.target;
			var offsetX = event.clientX - protocol.offsetLeft;
		    var offsetY = event.clientY - protocol.offsetTop;


	    	// Mouse up event listener
	    	var dropFunc = function(event) {
	    		document.removeEventListener("mousemove", dragFunc);
	    		protocol.style.position = "relative";
	    		protocol.style.left = "";
	    		protocol.style.top = "";
	    	}

	    	var dragFunc = function(event){
	    		protocol.style.position = "absolute";
	    		// Account for offset between mouse and img corner
	    		protocol.style.left = (event.clientX-offsetX) + "px";
	    		protocol.style.top = (event.clientY-offsetY) + "px";
	    	};

	    	// Actual mousedown event 
	    	document.addEventListener("mousemove", dragFunc);
	    	protocol.onmouseup = dropFunc;
		}
		
	},
});

