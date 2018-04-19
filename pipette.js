
// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// Holds steps associated with each protocol
var protocols = {"qPCR":[["Take cells", 5, 15], ["Freeze cells", 30, 60]], 
				"Cloning":[["Grow cells", 10, 10], ["Add culture to cells", 30, 60], ["Party with cells", 50, 0]]
			};

const DEFAULT_MSG = "Here is a protocol I would like to share.";
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
		document.getElementById('messageBox').value = DEFAULT_MSG;
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
	    	protocol.style.zIndex = 0;
		}
		
	},
});

function editPopUp(title) {
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

function addStep(elementId) {
	var stepsArea = document.getElementById(elementId);
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
	var title = document.getElementById("title").value
	var protocol = protocols[title] ? protocols[title] : [];
	getEnteredProtocolData(stepsArea, protocol);
	if (!protocols[title]) {
		addProtocolToDisplayList(title);
	}
	protocols[title] = protocol;
	removeFormFields(stepsArea);
}

function closeModalNewProtocol() {
	var modal = document.getElementById('addProtocolModal');
	modal.style.display = "none";
	var stepsArea = document.getElementById("stepsAdd");
	var title = document.getElementById("titleNew").value;
	var protocol = [];
	if (title) {
		getEnteredProtocolData(stepsArea, protocol);
		var titleBox = document.getElementById("titleNew");
		titleBox.value = "";
		protocols[title] = protocol;
		addProtocolToDisplayList(title);
	}
	removeFormFields(stepsArea);
}

function getEnteredProtocolData(stepsArea, protocol) {
	var stepNumber = -1;
	for (var j = 3; j < stepsArea.children.length; j++) {
		var input = stepsArea.children[j].children[0];
		// if the step name is empty -> delete entry
		// if either field after is empty, set to 0
		if (j%3 === 0) {
			if (!input.value) { //steps field is blank
				j = j + 2; // skip all of the fields in that row
				if (Math.floor(j/3)-1 < protocol.length)  {
					protocol.pop(Math.floor(j/3)-1)
				}
			}
			else {
				if (Math.floor(j/3)-1 >= protocol.length) {
					protocol.push([input.value,0,0])
				}
				stepNumber += 1;
			}
		}
		else {
			protocol[stepNumber][j%3] = input.value ? input.value : "0"
		}
	}
}

function addProtocolToDisplayList(title) {
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

function removeFormFields(parentContainingFields) {
	while (parentContainingFields.children.length > 3) {
		parentContainingFields.removeChild(parentContainingFields.children[parentContainingFields.children.length-1]);
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
		document.getElementById('messageBox').value = DEFAULT_MSG;
	});

};

function sendMessageToContacts() {
	alert("Message Sent!");
	document.getElementById('messageBox').value = DEFAULT_MSG;
};

function signIn() {
	var signIn = document.getElementById('signInModal');
	signIn.showModal();
}

function closeModalSignIn() {
	var signIn = document.getElementById('signInModal');
	signIn.close();
}
