
// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// Holds steps associated with each protocol
var protocols = {"qPCR":[["Take cells", 5, 15], ["Freeze cells", 30, 60]],
				 "Cloning":[["Take cells", 5, 15], ["Freeze cells", 30, 60]],
				 "DNA Sequencing":[["Take cells", 5, 15], ["Freeze cells", 30, 60]],
				 "Gel Electrophoresis":[["Take cells", 5, 15], ["Freeze cells", 30, 60]],};
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
		drawProtocols();

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

function drawProtocols() {
	var protocols = ["qPCR", "Cloning", "DNA Sequencing", "Gel Electrophoresis"];
	var html = "<ul class=\"protocol-list\">";
	for (var i = 0; i < protocols.length; i++) {
		html += "<li class=\"protocol\">" +
					protocols[i] +
					"<i class=\"edit material-icons\" onClick=editPopUp(\"" + protocols[i] + "\")>mode_edit</i>" +
				"</li>";
	}
	document.getElementById("protocol-container").innerHTML = html;
}

function editPopUp(title) {
	console.log("edit");
	var modal = document.getElementById('editProtocolModal');
	var form = document.getElementById("protocolText");
	var titleBox = document.getElementById("title");
	titleBox.value = title;
	var stepsArea = document.getElementById("stepsEdit");
	var steps = protocols[title];
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
	var stepsArea = document.getElementById("stepsEdit");
	var removeCells = []
	var title = document.getElementById("title").value
	var protocol = protocols[title];
	for (var j = 0; j < stepsArea.children.length; j++) {
		if (j > 2) {
			var input = stepsArea.children[j].children[0]
			if (!input.value) {
				removeCells.push(stepsArea.children[j])
				if (Math.floor(j/3)-1 < protocol.length) {
					protocol.pop(Math.floor(j/3)-1)
				}
			}
		}
	}
	for (var j = 0; j < removeCells.length; j++) {
		stepsArea.removeChild(removeCells[j]);
	}
	for (var j = 0; j < stepsArea.children.length; j++) {
		if (j > 2) {
			var input = stepsArea.children[j].children[0]
			if (input.value) {
				if (Math.floor(j/3)-1 >= protocol.length) {
					protocol.push([0,0,0])
				}
				protocol[Math.floor(j/3)-1][j%3] = input.value
			}
		}
	}
}

function closeModalNewProtocol() {
	var modal = document.getElementById('addProtocolModal');
	modal.style.display = "none";
	var stepsArea = document.getElementById("stepsAdd");
	var removeCells = []
	var title = document.getElementById("titleNew").value;
	var protocol = [];
	if (title) {
		for (var j = 0; j < stepsArea.children.length; j++) {
			if (j > 2) {
				var input = stepsArea.children[j].children[0]
				if (!input.value) {
					removeCells.push(stepsArea.children[j])
				}
				else {
					if (Math.floor(j/3)-1 >= protocol.length) {
						protocol.push([0,0,0])
					}
					protocol[Math.floor(j/3)-1][j%3] = input.value
				}
			}
		}
		for (var j = 0; j < removeCells.length; j++) {
			stepsArea.removeChild(removeCells[j]);
		}
		protocols[title] = protocol;
		var listItem = document.createElement("li");
		listItem.setAttribute("class", "protocol");
		listItem.innerHTML = title;
		var editIcon = document.createElement("i");
		editIcon.setAttribute("class", "edit material-icons");
		editIcon.setAttribute("onClick", "editPopUp('"+ title +"')");
		editIcon.innerHTML = "mode_edit";
		listItem.appendChild(editIcon);
		var protocolList = document.getElementsByClassName("protocol-list")[0];
		protocolList.appendChild(listItem);
	}
}

function newProtocol() {
	var modal = document.getElementById('addProtocolModal');
	var form = document.getElementById("protocolText");
	var titleBox = document.getElementById("titleNew");
	titleBox.placeholder = "Procedure Name";
	var stepsArea = document.getElementById("stepsAdd");
	if (stepsArea.children.length !== 6) {
		for (var j = 0; j < 3; j++) { 
			var div = document.createElement("div");
			var cell = document.createElement("input");
			div.appendChild(cell);
			stepsArea.appendChild(div);
		}
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

function signIn() {
	var signIn = document.getElementById('signInModal');
	signIn.showModal();
}

function closeModalSignIn() {
	var signIn = document.getElementById('signInModal');
	signIn.close();
}

function sendMessageToContacts() {
	alert("Message Sent!");
	document.getElementById('messageBox').value = "";
};
