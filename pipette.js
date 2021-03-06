
// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// Holds steps associated with each protocol
var protocols = {"qPCR":[["Take cells", "0:45", "0:30"], ["Freeze cells", "0:30", "0:00"]],
				 "Cloning":[["Grow cells", "1:30", "0:35"], ["Add culture to cells", "0:45", "1:00"], ["Party with cells", "0:50", "0:00"]],
				 "DNA Sequencing":[["Step 1", "0:45", "0:15"]],
				 "Gel Electrophoresis":[["Step 1", "0:25", "0:15"]],};

var contacts = {"Alice P. Hacker":"alice@mit.edu", "Ben Bitdiddle": "ben.bitdiddle@mit.edu", "Eve L.": "eve@mit.edu"}
const DEFAULT_MSG = "Here is a protocol I would like to share.";

var eventCount = 0;
var qPCR = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&ctz=America%2FNew_York";
var cloning = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=ep5ndnb68jt4vihfdv0p4prk48%40group.calendar.google.com&color=%23182C57&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&ctz=America%2FNew_York";
var DNA_Seq = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=ep5ndnb68jt4vihfdv0p4prk48%40group.calendar.google.com&color=%23182C57&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&src=n5oddugkag5qp8jdm7vcdtuo28%40group.calendar.google.com&color=%235229A3&ctz=America%2FNew_York";
var Gel_Electro = "https://calendar.google.com/calendar/embed?mode=WEEK&amp&src=nhb3ul253iih305evek6dukth8%40group.calendar.google.com&color=%232F6309&src=ep5ndnb68jt4vihfdv0p4prk48%40group.calendar.google.com&color=%23182C57&src=13rt5s11dte8459l5n7jdp35ck%40group.calendar.google.com&color=%230F4B38&src=mi0e8rqpipopcqbcfr3bfsv6gc%40group.calendar.google.com&color=%238C500B&src=n5oddugkag5qp8jdm7vcdtuo28%40group.calendar.google.com&color=%235229A3&ctz=America%2FNew_York";
var allProtocols = [['qPCRmode_edit', qPCR], ['Cloningmode_edit', cloning], ['DNA Sequencingmode_edit', DNA_Seq], ['Gel Electrophoresismode_edit', Gel_Electro]]
var prot = null;
var x = null;
var y = null;
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
		if (evt.target.localName === "td" && !evt.target.id.substring(3).split("-").includes("0")) {
			selectItemsforCal();
			clickedCell = evt.target;
			selectProtocol(clickedCell);
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
		    		if (clickedCell.nodeName === "TD" && !clickedCell.id.substring(3).split("-").includes("0")) {
		    			addProtocolToCal(prot.substring(0, prot.length - 9));
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
	    		var top = parseInt(protocol.style.top);
	    		if (Math.abs(Util.offset(protocol).top-startPos.top) < 4 && ((startPos.left && Math.abs(Util.offset(protocol).left-startPos.left) < 4) || !startPos.left)) {
	    			moreDetailsCal(protocol.id)
	    		}
	    		else {
		    		var leftError = (left - pos.left - 5) % (100);
		    		if (leftError < 50) {
		    			left = left - leftError - 2;
		    		} else {
		    			left = left - leftError + 98;
		    		}
		    		var topError = (top - pos.top) % (21);
		    		if (topError < 10) {
		    			top = top - topError;
		    		} else {
		    			top = top - topError + 21;
		    		}
		    		protocol.style.left = left + "px";
		    		protocol.style.top = top + "px";
		    		updateTime(protocol, left, top);

		    		var protName = protocol.id.split("-")[0];
		    		var stepNum = parseInt(protocol.id.split("-")[1]);
		    		var evtNum = parseInt(protocol.id.split("-")[2]);
		    		// FOR NEXT STEPS
		    		while (document.getElementById(protName + "-" + (stepNum+1) + "-" + (evtNum+1))) {
		    			var nextProt = document.getElementById(protName + "-" + (stepNum+1) + "-" + (evtNum+1));
		    			if (nextProt.offsetLeft < left) {
		    				top += 70;
			    			nextProt.style.left = left + "px";
			    			nextProt.style.top = top + "px";
			    			updateTime(nextProt, left, top)
		    			}
		    			stepNum ++;
		    			evtNum ++;
		    		}
		    		// FOR PREVIOUS STEPS
		    		stepNum = parseInt(protocol.id.split("-")[1]);
		    		evtNum = parseInt(protocol.id.split("-")[2]);
		    		while (document.getElementById(protName + "-" + (stepNum-1) + "-" + (evtNum-1))) {
		    			var prevProt = document.getElementById(protName + "-" + (stepNum-1) + "-" + (evtNum-1));
		    			if (prevProt.offsetLeft > left) {
		    				top -= 70;
			    			prevProt.style.left = left + "px";
			    			prevProt.style.top = top + "px";
			    			updateTime(prevProt, left, top)
		    			}
		    			stepNum --;
		    			evtNum --;
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
		    var startPos = Util.offset(event.target);
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
	html.setAttribute("id", "protocol-list");
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
		if (row%2==0) {
			tr.style.backgroundColor = "lavender";
		}
		calendar.appendChild(tr);
	}
}

function addProtocolToCal(title) {
	var protocol = document.getElementById("protocolSelectorCal");
	var protocol_name = title ? title : protocol.options[protocol.selectedIndex].innerHTML;
	var steps = protocols[protocol_name];
	var pos = Util.offset(clickedCell);
	var startTimeHour = parseInt(document.getElementById("selectTime").value.split(":")[0]);
	startTimeHour += document.getElementById("amOrPm").value == "am" ? 0 : 12;
	var startTimeMin = parseInt(document.getElementById("selectTime").value.split(":")[1]);
	var top = pos.top + 2;
	if (startTimeMin >= 15 && startTimeMin < 30) {
		top += Math.floor(30/4)
	}
	else if (startTimeMin >= 30 && startTimeMin < 45) {
		top += Math.floor(30/2)
	}
	else if (startTimeMin >= 45) {
		top += Math.floor(3*30/4)
	}
	if (title) {
		startTimeHour = parseInt(clickedCell.id.substring(3).split("-")[0]-1);
		startTimeMin = 0;
	}
	startTimeMin = startTimeMin < 10 ? "0" + startTimeMin : startTimeMin;
	for (var i = 0; i < steps.length; i +=1) {
        var del = document.createElement("button")
        del.innerHTML = "Delete Step"
        del.setAttribute("class", "delStep");
        del.id = "calendar-delete"+"-"+(i+1)+"-"+eventCount; 
        del.setAttribute("onClick", "delCal(event)");
        
		var box = document.createElement("div");
		var moreDetails = document.createElement("div");
		box.setAttribute("class", "calendar-step");
		box.style.top = top+"px";
		box.style.left = pos.left;
		var parsedTime = steps[i][1].split(":");
		var time = parseInt(parsedTime[0]) + parseInt(parsedTime[1])/60;
		var height = Math.round(time * 30)
		var endTimeHour = parseInt(startTimeHour) + parseInt(parsedTime[0]);
		var endTimeMin = (parseInt(startTimeMin) + parseInt(parsedTime[1])) % 60;
		endTimeMin = endTimeMin < 10? "0" + endTimeMin : endTimeMin;
		endTimeHour += Math.floor((parseInt(startTimeMin) + parseInt(parsedTime[1]))/ 60)==0 ? 0 : 1;
		box.style.height = Math.max(height, 15) + "px";
		box.style.backgroundColor = getCalColor(protocol_name);
		box.innerText = protocol_name.substring(0,4).trim() + ": Step " + (i+1);
		box.setAttribute("id", protocol_name.replace(/ /g, "") + "-" + (i+1) + "-" + eventCount);
		
		var timeText = document.createElement("small");
		timeText.id = "time-" + protocol_name.replace(/ /g, "") + "-" + (i+1) + "-" + eventCount
		var startTimeEnding = Math.floor(startTimeHour/12)==0 ? "am" : "pm";
		var endTimeEnding = Math.floor(endTimeHour/12)==0 ? "am" : "pm";
		var startTime = startTimeHour%12==0 ? 12 : startTimeHour%12;
		startTime += ":" + startTimeMin;
		var hours = endTimeHour%12==0? 12 : endTimeHour%12;
		var endTime = hours + ":" + endTimeMin;
		timeText.innerText = startTime + startTimeEnding + " - " + endTime + endTimeEnding;
		var span = document.createElement("span");
		span.setAttribute("class", "close");
		span.setAttribute("onClick","closeAddInfo('"+del.id+"')");
		span.innerHTML="&times;"
		moreDetails.appendChild(document.createElement("br"));
		moreDetails.innerText += protocol_name + ": Step " + (i+1);
		moreDetails.appendChild(document.createElement("br"));
		moreDetails.innerText += protocols[protocol_name][i][0];
		moreDetails.appendChild(span)
		clickedCell.appendChild(box);
		moreDetails.appendChild(document.createElement("br"));
		moreDetails.appendChild(timeText);
		moreDetails.appendChild(document.createElement("br"));
		moreDetails.appendChild(del);
		moreDetails.style.backgroundColor = getCalColor(protocol_name);
		moreDetails.style.visibility = "hidden";
		moreDetails.setAttribute("class", "moreDetails");
		box.appendChild(moreDetails)

		parsedTime = steps[i][2].split(":");
		time = parseInt(parsedTime[0]) + parseInt(parsedTime[1])/60;
		top = top + Math.round(time * 30) + height;
		startTimeHour = endTimeHour + parseInt(parsedTime[0])
		startTimeMin = (parseInt(endTimeMin) + parseInt(parsedTime[1])) % 60;
		startTimeMin = startTimeMin < 10 ? "0" + startTimeMin : startTimeMin;
		startTimeHour += Math.floor((parseInt(endTimeMin) + parseInt(parsedTime[1])) / 60) == 0 ? 0 : 1;
		eventCount += 1;
	}
}

function moreDetailsCal(id){
	var box = document.getElementById(id);
	var div = box.children[0]
	div.style.visibility = "visible"
	div.style.position = "absolute";
	var val = 105;//box.getBoundingClientRect().right + 2;
	div.style.left = val+ "px";
	div.style.top = 0 + "px";
	div.style.width = "200px";
	div.style.height = "100px";
}

function closeAddInfo(id){
	var button = document.getElementById(id);
	button.style.disable = true;
	button.parentElement.style.visibility = "hidden"
}

function selectProtocol(clickedCell) {
	var selectProtocol = document.getElementById("selectProtocol");
	var timeDefault = document.getElementById("selectTime");
	var hour = (clickedCell.id.substring(3).split("-")[0]-1)%12 
	hour = hour == 0 ? 12 : hour;
	timeDefault.value = hour+":00";
	document.getElementById("amOrPm").value = Math.floor((clickedCell.id.substring(3).split("-")[0]-1)/12) == 0 ? "am" : "pm"
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
    var steps = e.target.nextSibling;
    var timeAlloted = steps.nextSibling;
    var waitTime = timeAlloted.nextSibling;
    var modal = e.target.parentElement;
    modal.removeChild(e.target);
    modal.removeChild(steps);
    modal.removeChild(timeAlloted);
    modal.removeChild(waitTime);
}

function delCal(e){
	var step = e.target.parentElement.parentElement
	step.parentElement.removeChild(step)	
}

function addEditStep() {
	var stepsArea = document.getElementById("stepsEdit");
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
		cell.className = "protocal-input";
		div.appendChild(cell);
		stepsArea.appendChild(div);
	}
}

function addNewStep() {
	var stepsArea = document.getElementById("stepsAdd");
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
		}
		else if (inputs[i].value=="") {
			validInputs = false;
			inputs[i].style.backgroundColor = "lightpink";
		} 
		else {
			inputs[i].style.backgroundColor = "white";
		}
	}

	if (validInputs) {
		getEnteredEditProtocolData(stepsArea, protocol);
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
		removeFormFields(stepsArea);
		modal.close();
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
		}
		else if (inputs[i].value=="") {
			validInputs = false;
			inputs[i].style.backgroundColor = "lightpink";
		} 
		else {
			inputs[i].style.backgroundColor = "white";
		}
	}

	if (validInputs) {
		if (title) {
			getEnteredNewProtocolData(stepsArea, protocol);
			var titleBox = document.getElementById("titleNew");
			titleBox.value = "";
			protocols[title] = protocol;
			addProtocolToDisplayList(title);
		}
		removeFormFields(stepsArea);
		modal.close();
	}
}

function noSaveCloseModal(stepsAreaId) {
	console.log(stepsAreaId)
	var stepsArea = document.getElementById(stepsAreaId);
	console.log(stepsArea)
	removeFormFields(stepsArea);
	console.log(stepsArea.parentElement)
	var modal = stepsArea.parentElement;
	modal.close();
}

function getEnteredNewProtocolData(stepsArea, protocol) {
	var stepNumber = -1
	for (var j = 4; j < stepsArea.children.length; j++) {
	 	var input = stepsArea.children[j];
	 	input = input.children[0];
	 	if (j%4 > 0) {
			protocol[stepNumber][(j%4)-1] = input.value ? input.value : ""
	 	}
	 	else {
	 		if (Math.floor(j/4) > protocol.length) {
	 			protocol.push(["step", "00:00", "00:00"])
	 		}
	 		stepNumber += 1
	 	}
	}
	while (Math.floor(j/4)-1 < protocol.length) {
		protocol.pop()
	}
}

function getEnteredEditProtocolData(stepsArea, protocol) {
	var stepNumber = -1
	for (var j = 4; j < stepsArea.children.length; j++) {
	 	var input = stepsArea.children[j];
	 	input = input.children[0];
	 	if (j%4 > 0) {
			protocol[stepNumber][(j%4)-1] = input.value ? input.value : ""
	 	}
	 	else {
	 		if (Math.floor(j/4) > protocol.length) {
	 			protocol.push(["step", "00:00", "00:00"])
	 		}
	 		stepNumber += 1
	 	}
	}
	while (Math.floor(j/4)-1 < protocol.length) {
		protocol.pop()
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
	var protocolList = document.getElementById("protocol-list");
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
	var div = document.createElement("div");
	stepsArea.insertBefore(div, stepsArea.childNodes[0]);
	if (stepsArea.children.length !== 6) {
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
			cell.className = "protocal-input";
			div.appendChild(cell);
			stepsArea.appendChild(div);
		}
	}
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

function updateTime(prot, left, top) {
	var tableCells = document.getElementById("calTable");
	for (var row = 1; row < tableCells.children.length; row += 1){
		for (var col = 1; col < tableCells.children[row].children.length; col += 1) {
			var cell = tableCells.children[row].children[col]
			var cellBox = cell.getBoundingClientRect();
			var protBox = prot.getBoundingClientRect();
			protBox.top += 2;
			if (cellBox.left <= protBox.left && protBox.left < cellBox.right) {
				if (cellBox.top <= protBox.top && protBox.top < cellBox.bottom) {
					var quarterCell = Math.floor(30/4);
					var startTimeHour = parseInt(cell.id.substring(3).split("-")[0]) - 1;
					var startTimeMin = "00"
					if (cellBox.top + quarterCell <=protBox.top && protBox.top < cellBox.top + quarterCell*2) {
						startTimeMin = "15";
					}
					if (cellBox.top + 2* quarterCell <=protBox.top && protBox.top < cellBox.top + quarterCell*3) {
						startTimeMin = "30";
					}
					if (cellBox.top +  3 * quarterCell <=protBox.top) {
						startTimeMin = "45";
					}
					var hour = startTimeHour%12 == 0? 12 : startTimeHour%12;
					var startTimeEnding = Math.floor(startTimeHour/12) == 0 ? "am" : "pm";
					var startTime = hour + ":" + startTimeMin + startTimeEnding;
					var protocolTitle = ""
					for (var i = 0; i < Object.keys(protocols).length; i +=1) {
						if (Object.keys(protocols)[i].replace(/\s/g, '') === prot.id.split("-")[0]) {
							protocolTitle = Object.keys(protocols)[i]
						}
					}
					var stepNumber = prot.id.split("-")[1] - 1
					var stepTime = protocols[protocolTitle][stepNumber][1].split(":");
					var endTimeHour = parseInt(startTimeHour) + parseInt(stepTime[0]);
					var endTimeMin = (parseInt(startTimeMin) + parseInt(stepTime[1])) % 60;
					endTimeMin = endTimeMin < 10? "0" + endTimeMin : endTimeMin;
					endTimeHour += Math.floor((parseInt(startTimeMin) + parseInt(stepTime[1]))/ 60)==0 ? 0 : 1;
					var endTimeEnding = Math.floor(endTimeHour/12)==0 ? "am" : "pm";
					var endHours = endTimeHour%12==0? 12 : endTimeHour%12;
					var endTime = endHours + ":" + endTimeMin+endTimeEnding;
					document.getElementById("time-"+prot.id).innerText = startTime+" - "+endTime;
				}
			}
		}
	}
}
