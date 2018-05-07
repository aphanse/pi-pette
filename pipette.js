
// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// Holds steps associated with each protocol
var protocols = {"qPCR":[["Take cells", "0:45", "0:15"], ["Freeze cells", "0:30", "1:00"]],
				 "Cloning":[["Grow cells", "1:30", "0:10"], ["Add culture to cells", "0:45", "1:00"], ["Party with cells", "0:50", "0:00"]],
				 "DNA Sequencing":[["Step 1", "0:45", "0:15"]],
				 "Gel Electrophoresis":[["Step 1", "0:25", "0:15"]],};

var contacts = {"Alice P. Hacker":"alice@mit.edu", "Ben Bitdiddle": "ben.bitdiddle@mit.edu", "Eve L.": "eve@mit.edu"}
const DEFAULT_MSG = "Here is a protocol I would like to share.";

Protocol_In_Edit=null;
var signedIn = false;
var logOut = document.getElementById("Logout");
logOut.style.display = "none"

var qPCR = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&ctz=America%2FNew_York";
var cloning = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=ep5ndnb68jt4vihfdv0p4prk48%40group.calendar.google.com&color=%23182C57&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&ctz=America%2FNew_York";
var DNA_Seq = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=ep5ndnb68jt4vihfdv0p4prk48%40group.calendar.google.com&color=%23182C57&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&src=n5oddugkag5qp8jdm7vcdtuo28%40group.calendar.google.com&color=%235229A3&ctz=America%2FNew_York";
var Gel_Electro = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=ep5ndnb68jt4vihfdv0p4prk48%40group.calendar.google.com&color=%23182C57&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&src=mi0e8rqpipopcqbcfr3bfsv6gc%40group.calendar.google.com&color=%238C500B&src=n5oddugkag5qp8jdm7vcdtuo28%40group.calendar.google.com&color=%235229A3&ctz=America%2FNew_York";
var allProtocols = [['qPCRmode_edit', qPCR], ['Cloningmode_edit', cloning], ['DNA Sequencingmode_edit', DNA_Seq], ['Gel Electrophoresismode_edit', Gel_Electro]]
var prot = null;
var x = null;
var y = null;

const CAL_COLORS = [
	"plum",
	"mediumseagreen",
	"orange",
	"cornflowerblue",
	"salmon"];

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
		drawProtocols();
		drawCalendar();
	},

	// Keyboard events arrive here
	"keydown": function(evt) {
		if (evt.target.className == "protocal-input") {
			evt.target.style.backgroundColor = "white";
		}
	},

	// Click events arrive here
	"click": function(evt) {
		if (evt.target.localName === "td") {
			selectItemsforCal()
			selectProtocol();
			clickedCell = evt.target;
		}
	},
	
	"mousedown": function(event) {

		// DRAGGING PROTOCOLS FROM LIST
		if (event.target.className == "protocol") {
			var protocol = event.target;
			var offsetX = event.clientX - protocol.offsetLeft;
		    var offsetY = event.clientY - protocol.offsetTop;

	    	// Mouse up event listener
	    	var dropFunc = function(event) {
	    		if (event.target.className != "edit material-icons") {
	    			document.removeEventListener("mousemove", dragFunc);
		    		protocol.style.position = "relative";
		    		protocol.style.left = "";
		    		protocol.style.top = "";
		    		protocol.style.zIndex = 1;
		    		prot = protocol.textContent;
		    		clickedCell = document.elementFromPoint(x, y);
		    		addProtocolToCal(prot.substring(0, prot.length - 9));
	    		}	
    		};

	    	var dragFunc = function(event){
	    		protocol.style.position = "absolute";
	    		// Account for offset between mouse and img corner
	    		protocol.style.left = (event.clientX-offsetX) + "px";
	    		protocol.style.top = (event.clientY-offsetY) + "px";
	    		protocol.style.zIndex = 1;
	    		x = event.clientX
	    		y = event.clientY
	    	};

	    	// Actual mousedown event 
	    	document.addEventListener("mousemove", dragFunc);
	    	protocol.onmouseup = dropFunc;
	    	protocol.style.zIndex = 1;
		}

		// DRAGGING CALENDAR EVENTS
		else if (event.target.className == "calendar-step") {
			var protocol = event.target;
			var offsetX = event.clientX - protocol.offsetLeft;
		    var offsetY = event.clientY - protocol.offsetTop;

	    	// Mouse up event listener
	    	var dropFunc = function(event) {
	    		var pos = Util.offset(clickedCell);
	    		document.removeEventListener("mousemove", dragFunc);
	    		var left = parseInt(protocol.style.left);
	    		var leftError = (left - pos.left - 5) % (100);
	    		if (leftError < 50) {
	    			left = left - leftError - 2;
	    		} else {
	    			left = left - leftError + 98;
	    		}
	    		var top = parseInt(protocol.style.top);
	    		var topError = (top - pos.top) % (21);
	    		if (topError < 10) {
	    			top = top - topError;
	    		} else {
	    			top = top - topError + 21;
	    		}
	    		protocol.style.left = left + "px";
	    		protocol.style.top = top + "px";

	    		var protName = protocol.id.substring(0, protocol.id.length-2);
	    		var stepNum = parseInt(protocol.id.substring(protocol.id.length-1));
	    		// FOR NEXT STEPS
	    		while (document.getElementById(protName + "-" + (stepNum+1))) {
	    			var nextProt = document.getElementById(protName + "-" + (stepNum+1));
	    			if (nextProt.offsetLeft < left) {
	    				top += 70;
		    			nextProt.style.left = left + "px";
		    			nextProt.style.top = top + "px";
	    			}
	    			stepNum ++;
	    		}
	    		// FOR PREVIOUS STEPS
	    		stepNum = parseInt(protocol.id.substring(protocol.id.length-1));
	    		while (document.getElementById(protName + "-" + (stepNum-1))) {
	    			var prevProt = document.getElementById(protName + "-" + (stepNum-1));
	    			if (prevProt.offsetLeft > left) {
	    				top -= 70;
		    			prevProt.style.left = left + "px";
		    			prevProt.style.top = top + "px";
	    			}
	    			stepNum --;
	    		}
    		};

	    	var dragFunc = function(event){
	    		protocol.style.position = "absolute";
	    		// Account for offset between mouse and img corner
	    		protocol.style.left = (event.clientX-offsetX) + "px";
	    		protocol.style.top = (event.clientY-offsetY) + "px";
	    		protocol.style.zIndex = 1;
	    		x = event.clientX
	    		y = event.clientY
	    	};

	    	// Actual mousedown event 
	    	document.addEventListener("mousemove", dragFunc);
	    	protocol.onmouseup = dropFunc;
	    	protocol.style.zIndex = 0;
		}
	},
});

function drawProtocols() {
	var names = Object.keys(protocols);
	var html = document.createElement("ul");
	html.setAttribute("class", "protocol-list");
	for (var i = 0; i < names.length; i++) {
		var protocolElem = document.createElement("li");
		protocolElem.setAttribute("class", "protocol");
		protocolElem.setAttribute("id", names[i].replace(/ /g, ""));
		protocolElem.innerText = names[i];
		protocolElem.style.borderBottom = "3px solid " + CAL_COLORS[i%CAL_COLORS.length];
		var edit = document.createElement("i");
		edit.setAttribute("class", "edit material-icons")
		edit.setAttribute("onClick", "editPopUp(\'" + names[i] + "\')");
		edit.innerText = "mode_edit";
		protocolElem.appendChild(edit);
		html.appendChild(protocolElem);
	}
	document.getElementById("protocol-container").appendChild(html);
}

function drawCalendar() {
	var calendar = document.getElementById("calTable");
	console.log(calendar)
	var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var hours = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
	for (var row = 0; row < 25; row += 1) {
		var tr = document.createElement("tr");
		var ending = row < 13 ? "am" : "pm";
		for (var col = 0; col < 8; col += 1) {
			var cell = document.createElement("td");
			cell.id = "cal" + row + "-" + col;
			if (row===0 && col > 0) {
				cell.innerText = week[col-1];
				cell.style.fontWeight="bold";
			}
			// Showing every other time slot
			if (col === 0 && row > 0 && row%2==1) {
				cell.innerText = hours[(row-1)%12] + ending;
			}
			tr.appendChild(cell);
		}
		calendar.appendChild(tr);
	}
}

// this function makes me sad :( but I wrote it :(
function addProtocolToCal(title) {
	var protocol = document.getElementById("protocolSelectorCal");
	var protocol_name = title ? title : protocol.options[protocol.selectedIndex].innerHTML;
	var steps = protocols[protocol_name];
	var pos = Util.offset(clickedCell);
	var startTimeHour = parseInt(clickedCell.id.substring(3).split("-")[0]-1);
	var startTimeMin = "00";
	var top = pos.top + 2;
	for (var i = 0; i < steps.length; i +=1) {
		var box = document.createElement("div");
		box.setAttribute("class", "calendar-step");
		box.style.top = top+"px";
		box.style.left = pos.left;
		var parsedTime = steps[i][1].split(":");
		var time = parseInt(parsedTime[0]) + parseInt(parsedTime[1])/60;
		var height = Math.round(time * 30)
		var hours = parseInt(startTimeHour) + parseInt(parsedTime[0]);
		var mins = (parseInt(startTimeMin) + parseInt(parsedTime[1])) % 60;
		mins = mins < 10? "0" + mins : mins
		hours += Math.floor(parseInt(startTimeMin) + parseInt(parsedTime[1]) / 60)==0 ? 0 : 1;
		box.style.height = height + "px";
		box.style.backgroundColor = getCalColor(protocol_name);
		box.innerText = protocol_name + ": Step " + (i+1);
		var timeText = document.createElement("small");
		var startTimeEnding = Math.floor(startTimeHour/12)==0 ? "am" : "pm";
		var endTimeEnding = Math.floor(hours/12)==0 ? "am" : "pm";
		console.log("time", hours/12==0)
		var startTime = startTimeHour%12==0 ? 12 : startTimeHour%12;
		startTime += ":" + startTimeMin;
		hours = hours%12;
		hours = hours==0 ? 12 : hours
		var endTime = hours + ":" + mins;
		timeText.innerText = startTime + startTimeEnding + " - " + endTime + endTimeEnding;
		box.id = protocol_name + "-" + (i+1);
		clickedCell.appendChild(box);
		box.appendChild(document.createElement("br"));
		box.appendChild(timeText);
		parsedTime = steps[i][2].split(":");
		time = parseInt(parsedTime[0]) + parseInt(parsedTime[1])/60;
		top = top + Math.round(time * 30) + height;
		startTimeHour = hours + parseInt(parsedTime[0])
		startTimeMin = (parseInt(mins) + parseInt(parsedTime[1])) % 60;
		startTimeMin = startTimeMin < 10 ? "0" + startTimeMin : startTimeMin;
		startTimeHour += (parseInt(mins) + parseInt(parsedTime[1])) / 60 ? 0 : 1; 
	}
}

function selectProtocol() {
	var selectProtocol = document.getElementById("selectProtocol");
	selectProtocol.showModal();
}

function addModal() {
	var selectProtocol = document.getElementById("selectProtocol");
	selectProtocol.close();
	addProtocolToCal();
}

function closeModal() {
	var selectProtocol = document.getElementById("selectProtocol");
	selectProtocol.close();
}

function editPopUp(title) {
	Protocol_In_Edit = title;
	var modal = document.getElementById('editProtocolModal');
	var form = document.getElementById("protocolText");
	var titleBox = document.getElementById("title");
	titleBox.value = title;
	var stepsArea = document.getElementById("stepsEdit");
	var steps = protocols[title];
	removeFormFields(stepsArea);

	var div = document.createElement("div");
	stepsArea.insertBefore(div, stepsArea.childNodes[0]);
	var doneButton = document.getElementById("editProtDone");
	doneButton.setAttribute("onClick", "closeModalEditProtocol('" + title + "')");

	if (stepsArea.children.length < Math.max((steps.length + 1)*3,6)) {
		for (var i = 0; i < Math.max(steps.length,1); i++) {
            var del = document.createElement("button")
            del.innerHTML = "X"
            del.id = "step-delete"
            del.setAttribute("onClick", "delStep(event)");
            stepsArea.appendChild(del);			

			for (var j = 0; j < 3; j++) { 
				var div = document.createElement("div");
	    		var cell = document.createElement("input");
	    		if (j!=0) {
	    			cell.pattern = "hrs:mins";
	    			cell.placeholder = "hrs:mins";
	    		}
	    		else {
	    			cell.pattern = "Instruction";
	    			cell.placeholder = "Instruction"
	    		}
	    		if (steps.length > 0) {
	    			cell.value = steps[i][j];
	    		}
	    		cell.className = "protocal-input";
	    		div.appendChild(cell);
	    		stepsArea.appendChild(div);
	    	}
	    }
	}
	modal.showModal();
}

function delStep(e) {
    console.log(e.target.parentElement);
    var steps = e.target.nextSibling;
    console.log(steps.nextSibling)
    var timeAlloted = steps.nextSibling;
    var waitTime = timeAlloted.nextSibling;
    var modal = e.target.parentElement;
    modal.removeChild(e.target);
    modal.removeChild(steps);
    modal.removeChild(timeAlloted);
    modal.removeChild(waitTime);
}

function addStep(elementId) {
	var stepsArea = document.getElementById(elementId);
	for (var j = 0; j < 3; j++) { 
		var div = document.createElement("div");
		var cell = document.createElement("input");
		if (j!=0) {
			cell.pattern = "hrs:mins";
			cell.placeholder = "hrs:mins";
		}
		else {
			cell.pattern = "Instruction";
			cell.placeholder = "Instruction"
		}
	    cell.className = "protocal-input";
		div.appendChild(cell);
		stepsArea.appendChild(div);
	}
}

function closeModalEditProtocol(orignalTitle) {
	var modal = document.getElementById('editProtocolModal');
	var stepsArea = document.getElementById("stepsEdit");
	var title = document.getElementById("title").value;
	var protocol = protocols[title] ? protocols[title] : [];
	var validInputs = true;
	var pattern = /^([0-9]*:[0-9][0-9])$/;

	var inputs = document.getElementsByClassName("protocal-input");
	for (var i=0; i<inputs.length; i++) {
		if (inputs[i].pattern == "hrs:mins" && !pattern.test(inputs[i].value) && inputs[i].value!="") {
			validInputs = false;
			inputs[i].style.backgroundColor = "lightpink";
		} else {
			inputs[i].style.backgroundColor = "white";
		}
	}

	if (validInputs) {
		modal.close();
		getEnteredProtocolData(stepsArea, protocol);
		if (!protocols[title]) {
			delete protocols[orignalTitle];
			var protocolBar = document.getElementById(orignalTitle.replace(/ /g, ""));
			protocolBar.innerText = title;
			var edit = document.createElement("i");
			edit.setAttribute("class", "edit material-icons")
			edit.setAttribute("onClick", "editPopUp(\'" + title + "\')");
			edit.innerText = "mode_edit";
			protocolBar.appendChild(edit);
		}
		protocols[title] = protocol;
		console.log(protocols, orignalTitle)
		removeFormFields(stepsArea);
	}
}

function closeModalNewProtocol() {
	var modal = document.getElementById('addProtocolModal');
	var stepsArea = document.getElementById("stepsAdd");
	var title = document.getElementById("titleNew").value;
	var protocol = [];
	var validInputs = true;
	var pattern = /^([0-9]*:[0-9][0-9])$/;

	var inputs = document.getElementsByClassName("protocal-input");
	for (var i=0; i<inputs.length; i++) {
		if (inputs[i].pattern == "hrs:mins" && !pattern.test(inputs[i].value) && inputs[i].value!="") {
			validInputs = false;
			inputs[i].style.backgroundColor = "lightpink";
		} else {
			inputs[i].style.backgroundColor = "white";
		}
	}

	console.log("qq");
	if (validInputs) {
		modal.close();
		if (title) {
			getEnteredProtocolData(stepsArea, protocol);
			var titleBox = document.getElementById("titleNew");
			titleBox.value = "";
			protocols[title] = protocol;
			addProtocolToDisplayList(title);
		}
		removeFormFields(stepsArea);
	}
}

function getEnteredProtocolData(stepsArea, protocol) {
	var stepNumber = -1;
	for (var j = 3; j < stepsArea.children.length; j++) {
		var input = stepsArea.children[j];
		// if the step name is empty -> delete entry
		// if either field after is empty, set to ""
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
			protocol[stepNumber][j%3] = input.value ? input.value : ""
		}
	}
}

function addProtocolToDisplayList(title) {
	var listItem = document.createElement("li");
	listItem.setAttribute("class", "protocol");
	listItem.setAttribute("id", title.replace(/ /g, ""));
	listItem.innerHTML = title;
	var editIcon = document.createElement("i");
	editIcon.setAttribute("class", "edit material-icons");
	editIcon.setAttribute("onClick", "editPopUp('"+ title +"')");
	editIcon.innerHTML = "mode_edit";
	listItem.appendChild(editIcon);
	var protocolList = document.getElementById("protocol-container");
	protocolList.appendChild(listItem);
	listItem.style.borderBottom = "3px solid " + getCalColor(title);
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
	titleBox.placeholder = "Protocol Name";
	var stepsArea = document.getElementById("stepsAdd");
	if (stepsArea.children.length !== 6) {
		for (var j = 0; j < 3; j++) { 
			var div = document.createElement("div");
			var cell = document.createElement("input");
    		if (j!=0) {
				cell.pattern = "hrs:mins";
				cell.placeholder = "hrs:mins";
			}
			else {
				cell.pattern = "Instruction";
				cell.placeholder = "Instruction"
			}
			cell.className = "protocal-input";
			div.appendChild(cell);
			stepsArea.appendChild(div);
		}
	}
	modal.style.display = "block";
	titleBox.focus();
	modal.showModal();

}

function shareItem() {
	var shareModal = Util.one("#shareItemModal");
	var cancelButton = Util.one("#cancel");
	var shareButton = Util.one("#shareItemButton");

	var protocolSelector = Util.one("#protocolSelector");
	var contactSelector = Util.one("#contactSelector");

	protocolSelector.innerHTML = createShareProtocolDropdown();
	contactSelector.innerHTML = createShareContactsMenu();

	shareModal.showModal();

	// Form cancel button closes the dialog box
	cancelButton.addEventListener('click', function() {
		shareModal.close();
		document.getElementById('messageBox').value = DEFAULT_MSG;
	});

};

function createShareProtocolDropdown() {
	var str = ""
	for(i = 0; i < Object.keys(protocols).length; i++) {
		str += "<option value=\"protocol" + i + "\">" + Object.keys(protocols)[i] + "</option>";
	}
	return str
};

function createShareContactsMenu() {
	var str = ""
	for(i = 0; i < Object.keys(contacts).length; i++) {
		var contact= Object.keys(contacts)[i];
		str += "<option value=\"contact" + i + "\">" + contacts[contact] + "</option>";
	}
	return str
};

function cancelSharing() {
	Util.one("#shareItemModal").close();
	document.getElementById('emailAdd').value = "";
	document.getElementById('messageBox').value = DEFAULT_MSG;
};

function sendMessageToContacts() {
	alert("Message Sent!");
	Util.one("#shareItemModal").close();
	document.getElementById('emailAdd').value = "";
	document.getElementById('messageBox').value = DEFAULT_MSG;
};

function addContact(event) {
	var button = Util.one("#addcontact");
	var form = document.getElementById('emailAdd').value.toLowerCase();
	var contactName = "contact_" + Object.keys(contacts).length;

	if (form.length <= 0) {
		alert("No email entered.");
	}
	else if (Object.values(contacts).indexOf(form) > -1)
		alert("You cannot add a repeated email.");
	else if (validEmail(form)) {
		contacts[contactName] = form;
		contactSelector.innerHTML = createShareContactsMenu();
	}
	else {
		alert("Invalid email entered.");
	}
	document.getElementById('emailAdd').value = "";
	Util.one("#shareItemModal").close();
	Util.one("#shareItemModal").showModal();
};

function validEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

function signIn() {
	if (signedIn == false){
		var signIn = document.getElementById('signInModal');
		document.getElementById("error-msg").innerHTML = "&nbsp;";
		signIn.showModal();
	}

}
function abc(){
	var account = document.getElementById("account");
	var username = document.getElementById("username");
	var newusername = document.getElementById("newUsername");
	username.value = ""
	newusername.value = ""
	account.innerHTML = "Sign In";
	logOut.style.display = "none"
	signedIn = false;
}


function selectItemsforCal() {
	var protocolSelector = Util.one("#protocolSelectorCal");
	protocolSelector.innerHTML = createShareProtocolDropdown();
}

function createAccount(){
	closeModalSignIn()
	var createAccount = document.getElementById('newAccountModal');
	createAccount.showModal();
}

function showAccountNew() {
	var username = document.getElementById("newUsername").value;
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	var confirmedPass = document.getElementById("confirmedPass").value;
	//&& password.length>0 && email.indexOf('@') > -1 && password==confirmedPass
	if (username.length > 0 ) {
		// Currently a canned response
		var account = document.getElementById("account");
		account.innerHTML = "Welcome, " + username;
		logOut.style.display = "block"
		closeModalCreateAccount();
	} 
}

function showAccount(){
		var username = document.getElementById("username").value;
		if (username.length > 0) {
		// Currently a canned response
		var account = document.getElementById("account");
		account.innerHTML = "Welcome, " + username;
		logOut.style.display = "block"
		signedIn = true; 
		closeModalSignIn();
	} else {
		console.log("username invalid");
		document.getElementById("error-msg").innerHTML = "Please enter valid username.";
		document.getElementById("error-msg").style.color = "red";
	}
}

function closeModalSignIn() {
	var signIn = document.getElementById('signInModal');
	signIn.close();
}

function closeModalCreateAccount() {
	var account = document.getElementById('newAccountModal');
	account.close();
}

// Helper function for protocol colors because life is difficult
function getCalColor(name) {
	var names = Object.keys(protocols);
	for (var i=0; i<names.length; i++) {
		if (name == names[i]) {
			return CAL_COLORS[i%CAL_COLORS.length];
		}
	}
	return "skyblue";
}

function deleteProtocol(e) {
	closeModalEditProtocol();
	var protocolName = e.parentElement.childNodes[1].value
	protocolName = Protocol_In_Edit.replace(/\s/g, '');
	var protocolList = document.getElementsByClassName("protocol-list")[0];
	var removeID = document.getElementById(protocolName);
	protocolList.removeChild(removeID);

	
}
