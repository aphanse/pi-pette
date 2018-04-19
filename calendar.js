var year = 2018;
var month = 4;
var day = 20;
var hour = 13;
var min = 0;

document.getElementById('date').valueAsDate = new Date();

class experiment {
//durations should be a list of length 2 lists [hr,min] which specifies duration of step 1, wait time for step 1, 
//duration of step 2, wait time of step 2 etc.  for all the steps in the protocol.  Duration.length = 2*numSteps-1
  constructor(name, steps, durations) {
  	this.name = name
  	this.steps = steps
  	this.durations = durations
  }
  numSteps(){
  	return this.steps;
  }
  getName(){
  	return this.name;
  }
  getStepTime(step){
  	return this.durations[step*2-2]

  }
  getWaitTime(step){
  	return this.durations[step*2-1]
  }
}

class eventTime {
  constructor(year, month, day, hour, min) {

    this.year = year
    this.month = month
    this.day = day
    this.hour = hour
    this.min = min
  }

  toString() {
  	var minString = this.min.toString();
  	var dayString = this.day.toString();
  	var monthString = this.month.toString();
  	var hourString = this.hour.toString();
  	if (this.min <10){
  		minString = "0"+ minString;
  	}
   	if (this.hour <10){
  		minString = "0"+ hourString;
  	}
  	if (this.day <10){
  		dayString = "0"+ dayString;
  	}
  	if (this.month <10){
  		monthString = "0" + monthString;
  	}
    return this.year+"-"+monthString+"-"+dayString+"T"+hourString+":"+minString+":00-04:00";
  }

  add(h,m){
    this.min = this.min+m
    this.hour = this.hour+h

    if (this.min>60){
      this.min = (this.min)%60
      this.hour = this.hour + Math.floor((this.min)/60)
    }
    if (this.hour>24){
      this.hour = (this.hour)%24
      this.day = this.day+Math.floor((this.hour)/24)
    }
    if ([4,6,9,11].includes(this.month) & this.day>30){
      this.day = 1
      this.month = this.month+1
    }else if ([1,3,5,6,7,10,12].includes(this.month) & this.day>31){
      this.day = 1
      this.month = this.month+1
    }else if (this.month == 2 & this.day>28){
      this.day = 1
      this.month = this.month+1
    }
    if (this.month>12){
      this.month = 1
      this.year = this.year+1
    }



  }
 
}

var dateTime = new eventTime(year, month, day, hour, min);

var qPCR = new experiment("qPCR", 3, [[1,0],[1,0],[1,0],[1,0],[1,0]])
var cloning = new experiment("cloning", 3, [[1,0],[1,0],[1,0],[1,0],[1,0]])

var exp = qPCR

// Loads the client library and the auth2 library together for efficiency.
// Loading the auth2 library is optional here since `gapi.client.init` function will load
// it if not already loaded. Loading it upfront can save one network request.
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

  function initClient() {
    // Initialize the client with API key and People API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    gapi.client.init({
        apiKey: "AIzaSyCVSSJlCUb070XPAEoksp53OwLK1DnvFV8",
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        clientId: '600712725767-qofq7cgibk1rab9of1jlmqktve6unk8o.apps.googleusercontent.com',
        scope: "https://www.googleapis.com/auth/calendar"
    }).then(function () {
    	for (i=1; i<=exp.numSteps(); i++){
    		var stepLength = exp.getStepTime(i);
    		makeApiCall(dateTime, stepLength, exp.getName()+": step "+i.toString())
    		if (i < exp.numSteps()){
    			dateTime.add(exp.getWaitTime(i)[0], exp.getWaitTime(i)[1]);
    		}
    	}

    });
  }
  //creates event in google calendar
  //length is a list in the form [hr,min] specifying how long the step is
  function makeApiCall(dateTime, length, summary) {
  		var startTime = dateTime.toString()
  		dateTime.add(length[0], length[1])
  		var endTime =  dateTime.toString()
		var event = {
		  "end": {
		    "dateTime": endTime
		  },
		  "start": {
		    "dateTime": startTime
		  },
		  "summary":summary
		};
    // Make an API call to the People API, and print the user's given name.
    var request = gapi.client.calendar.events.insert({
	  'calendarId': "13rt5s11dte8459l5n7jdp35ck@group.calendar.google.com",
	  'resource': event
	});
	request.execute(function(event) {
	 event.htmlLink;
	});
	}

function openpopup(){
	myWindow = window.open('addToCalendar.html', '_blank', 'height = 400,width=400');
}


function addProtocol(){
  
	var date = document.getElementById("date").value;
	var time = document.getElementById("time").value;
	var protocol = document.getElementById("select").value;
  a = date.split("-")[0]
  b=date.split("-")[1]
  c = date.split("-")[2]
	year = parseInt(a)
	month = parseInt(b)
	day = parseInt(c)
	b = time.split(":");
	hour = parseInt(time[0])
	min = parseInt(time[1])
	DateTime = new eventTime(year, month, day, hour, min)
	if (protocol == "cloning"){
		exp = cloning;
	}
	if (protocol == "qPCR"){
		exp = qPCR;
	}
  handleClientLoad();
	setTimeout(function(){ 
    document.location.reload(true)
     }, 1000);
  //myWindow.close();
}