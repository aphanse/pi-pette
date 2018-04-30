
// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// Holds steps associated with each protocol
var protocols = {"qPCR":[["Take cells", 5, 15], ["Freeze cells", 30, 60]],
				 "Cloning":[["Grow cells", 10, 10], ["Add culture to cells", 30, 60], ["Party with cells", 50, 0]],
				 "DNA Sequencing":[["Step 1", 5, 15]],
				 "Gel Electrophoresis":[["Step 1", 5, 15]],};
const DEFAULT_MSG = "Here is a protocol I would like to share.";


var qPCR = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&ctz=America%2FNew_York";
var cloning = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=ep5ndnb68jt4vihfdv0p4prk48%40group.calendar.google.com&color=%23182C57&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&ctz=America%2FNew_York";
var DNA_Seq = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=ep5ndnb68jt4vihfdv0p4prk48%40group.calendar.google.com&color=%23182C57&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&src=n5oddugkag5qp8jdm7vcdtuo28%40group.calendar.google.com&color=%235229A3&ctz=America%2FNew_York";
var Gel_Electro = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=ep5ndnb68jt4vihfdv0p4prk48%40group.calendar.google.com&color=%23182C57&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&src=mi0e8rqpipopcqbcfr3bfsv6gc%40group.calendar.google.com&color=%238C500B&src=n5oddugkag5qp8jdm7vcdtuo28%40group.calendar.google.com&color=%235229A3&ctz=America%2FNew_York";
var allProtocols = [['qPCRmode_edit', qPCR], ['Cloningmode_edit', cloning], ['DNA Sequencingmode_edit', DNA_Seq], ['Gel Electrophoresismode_edit', Gel_Electro]]
var prot = null;
var x = null;
var y = null;
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
	},

	// Click events arrive here
	"click": function(evt) {
		console.log("all clicks")
		if (evt.target.localName === "td") {
			console.log("calendar")
			selectProtocol();
			clickedCell = evt.target;
		}
	},
	
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
	    		prot = protocol.textContent;
	    		if (x>510 & y>157 & x<1223 & y<519){
	    			for (i=0; i<allProtocols.length; i++){
						if (allProtocols[i][0]==prot){
							// don't update if clicking edit
							if (event.path[0].className != "edit material-icons") {
								document.getElementById('myCalendar').src =allProtocols[i][1]
							}	
						}
					}
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
	var html = "<ul class=\"protocol-list\">";
	for (var i = 0; i < names.length; i++) {
		html += "<li class=\"protocol\">" +
					names[i] +
					"<i class=\"edit material-icons\" onClick=editPopUp(\"" + names[i] + "\")>mode_edit</i>" +
				"</li>";
	}
	document.getElementById("protocol-container").innerHTML = html;
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
			if (row===0 && col > 0) {
				cell.innerText = week[col-1];
				cell.style.fontWeight="bold";
			}
			if (col === 0 && row > 0) {
				cell.innerText = hours[(row-1)%12] + ending;
			}
			tr.appendChild(cell);
		}
		calendar.appendChild(tr);
	}
}

function addProtocolToCal() {
	console.log(clickedCell)
	var protocol = document.getElementById("protocolSelectorCal");
	console.log(protocol.value)
	var steps = protocols[protocol.value];
	console.log(steps)
	var pos = Util.offset(clickedCell);
	var top = pos.top + 2;
	for (var i = 0; i < steps.length; i +=1) {
		var box = document.createElement("div");
		box.setAttribute("class", "calendar-step")
		box.style.top = top+"px";
		box.style.left = pos.left;
		box.style.height = "50px";
		box.style.backgroundColor = "var(--sky-blue)";
		box.innerText = protocol.value + ": Step " + (i+1);
		var time = document.createElement("small");
		time.innerText ="1pm - 2pm";
		clickedCell.appendChild(box);
		box.appendChild(document.createElement("br"));
		box.appendChild(time);
		top = top + 70;
	}
}

function selectProtocol() {
	var selectProtocol = document.getElementById("selectProtocol");
	selectProtocol.style.display = "block";
}

function addModal() {
	var selectProtocol = document.getElementById("selectProtocol");
	console.log("pie")
	selectProtocol.style.display = "none";
	addProtocolToCal();
}

function closeModal() {
	var selectProtocol = document.getElementById("selectProtocol");
	console.log("WOO")
	selectProtocol.style.display = "none";
}

function editPopUp(title) {
	var modal = document.getElementById('editProtocolModal');
	var form = document.getElementById("protocolText");
	var titleBox = document.getElementById("title");
	titleBox.value = title;
	var stepsArea = document.getElementById("stepsEdit");
	var steps = protocols[title];
	removeFormFields(stepsArea);
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
	Util.one("#shareItemModal").close();
};

function signIn() {
	var signIn = document.getElementById('signInModal');
	document.getElementById("error-msg").innerHTML = "&nbsp;";
	signIn.showModal();
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
		closeModalCreateAccount();
	} if(username.length==0){
		console.log("username invalid");
		document.getElementById("error-msg1").innerHTML = "Please enter valid username.";
		document.getElementById("error-msg1").style.color = "red";
	} if(password.length==0){
		console.log("password invalid");
		document.getElementById("error-msg2").innerHTML = "Please enter valid password.";
		document.getElementById("error-msg2").style.color = "red";
	}  if(confirmedPass != password){
		console.log("password confirmation invalid");
		document.getElementById("error-msg3").innerHTML = "Confirm Password Does not Match.";
		document.getElementById("error-msg3").style.color = "red";	
	} if(email.indexOf('@')==-1){
		console.log("Email invalid");
		document.getElementById("error-msg4").innerHTML = "Please enter valid Email Address.";
		document.getElementById("error-msg4").style.color = "red";		
	}

}

function showAccount(){
		var username = document.getElementById("username").value;
		if (username.length > 0) {
		// Currently a canned response
		var account = document.getElementById("account");
		account.innerHTML = "Welcome, " + username;
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