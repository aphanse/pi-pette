
// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// Holds steps associated with each protocol
var protocols = {"qPCR":[["Take cells", 5, 15], ["Freeze cells", 30, 60]]};
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
	    		protocol.style.zIndex = 1; 
	    	}

	    	var dragFunc = function(event){
	    		protocol.style.position = "absolute";
	    		// Account for offset between mouse and img corner
	    		protocol.style.left = (event.clientX-offsetX) + "px";
	    		protocol.style.top = (event.clientY-offsetY) + "px";
	    		protocol.style.zIndex = 4;
	    	};

	    	// Actual mousedown event 
	    	document.addEventListener("mousemove", dragFunc);
	    	protocol.onmouseup = dropFunc;
		}
		
	},
});

function editPopUp(title) {
	console.log("working")
	var modal = document.getElementById('editProtocolModal');
	console.log("modal")
	console.log(title)
	var form = document.getElementById("protocolText");
	var titleBox = document.getElementById("title");
	titleBox.value = title;
	var stepsArea = document.getElementById("stepsEdit");
	var steps = protocols[title];
	console.log(stepsArea.children.length)
	if (stepsArea.children.length < (steps.length + 1)*3) {
		for (var i = 0; i < steps.length; i++) {
			for (var j = 0; j < 3; j++) { 
				var div = document.createElement("div");
	    		var cell = document.createElement("input");
	    		cell.value = steps[i][j];
	    		div.appendChild(cell);
	    		stepsArea.appendChild(div);
	    	}
	    }
	}
	modal.style.display = "block";
}

function addStepEditProtocol() {
	var stepsArea = document.getElementById("stepsEdit");
	for (var j = 0; j < 3; j++) { 
		var div = document.createElement("div");
		var cell = document.createElement("input");
		div.appendChild(cell);
		stepsArea.appendChild(div);
	}
}

function addStepNewProtocol() {
	var stepsArea = document.getElementById("stepsAdd");
	for (var j = 0; j < 3; j++) { 
		var div = document.createElement("div");
		var cell = document.createElement("input");
		div.appendChild(cell);
		stepsArea.appendChild(div);
	}
}

function closeModalEditProtocol() {
	var modal = document.getElementById('editProtocolModal');
	modal.style.display = "none";
	console.log("HI")
	var stepsArea = document.getElementById("stepsEdit");
	var removeCells = []
	var title = document.getElementById("title").value
	var protocol = protocols[title];
	for (var j = 0; j < stepsArea.children.length; j++) {
		if (j > 2) {
			var input = stepsArea.children[j].children[0]
			if (!input.value) {
				removeCells.push(stepsArea.children[j])
				//remove from dictionary as well
			}
			else {
				console.log(protocol.length)
				if (Math.floor(j/3)-1 >= protocol.length) {
					console.log("here")
					protocol.push([0,0,0])
				}
				protocol[Math.floor(j/3)-1][j%3] = input.value
			}
		}
	}
	for (var j = 0; j < removeCells.length; j++) {
		stepsArea.removeChild(removeCells[j]);
	}
	console.log(protocol)
}

function closeModalNewProtocol() {
	var modal = document.getElementById('addProtocolModal');
	modal.style.display = "none";
	console.log("HI")
	var stepsArea = document.getElementById("stepsAdd");
	var removeCells = []
	var title = document.getElementById("title").value
	var protocol = protocols[title];
	for (var j = 0; j < stepsArea.children.length; j++) {
		if (j > 2) {
			var input = stepsArea.children[j].children[0]
			if (!input.value) {
				removeCells.push(stepsArea.children[j])
				//remove from dictionary as well
			}
			else {
				console.log(protocol.length)
				if (Math.floor(j/3)-1 >= protocol.length) {
					console.log("here")
					protocol.push([0,0,0])
				}
				protocol[Math.floor(j/3)-1][j%3] = input.value
			}
		}
	}
	for (var j = 0; j < removeCells.length; j++) {
		stepsArea.removeChild(removeCells[j]);
	}
	console.log(protocol)
}

function newProtocol() {
	var modal = document.getElementById('addProtocolModal');
	console.log("modal")
	var form = document.getElementById("protocolText");
	var titleBox = document.getElementById("titleNew");
	titleBox.value = "Procedure Name";
	var stepsArea = document.getElementById("stepsAdd");
	for (var j = 0; j < 3; j++) { 
		var div = document.createElement("div");
		var cell = document.createElement("input");
		div.appendChild(cell);
		stepsArea.appendChild(div);
	}
	modal.style.display = "block";
}

function shareItem() {
	var shareModal = Util.one("#shareItemModal");
	var cancelButton = Util.one("#cancel");
	var shareButton = Util.one("#shareItemButton");

	shareModal.showModal();

	// Form cancel button closes the dialog box
	cancelButton.addEventListener('click', function() {
		shareModal.close();
	});

};

function sendMessageToContacts() {
	alert("Message Sent!");
	document.getElementById('messageBox').value = "";
};
