var map;

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onstart = function() {
    recognizing = true;
  };
  recognition.onerror = function(event) {
    console.log(event);
    if (event.error == 'no-speech') {
        console.log('no-speech')
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
        console.log('no-mirophone')
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        console.log(event.timeStamp);
        console.log(start_timestamp);
        console.log('info-denied');
      } else {
        console.log('info_denied-notallowed');
      }
      ignore_onend = true;
    }
  };
  recognition.onend = function() {
    console.log("ending")
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      return;
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += "";
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    console.log(interim_transcript);
    if (interim_transcript.includes("mischief managed") ) {
        window.location.replace("./index.html");
    }
    if (final_transcript || interim_transcript) {
    }
  };
}


function upgrade() {
    alert('Please use a recent version of the Google Chrome browser with this webpage.\n\nOther browsers do not support the speech API used in this site')
    startRecord.disabled = true;
    stopRecord.disabled=true;
    header.innerHTML = "Your browser does not support the speech API! :("
}


var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

console.log('loaded')
final_transcript = '';
recognition.lang = 'en-US';
recognition.start();
ignore_onend = false;
start_timestamp = Math.floor(Date.now());

var start_recognize = setInterval(function(){
    if (!recognizing) {
        console.log('loaded')
        final_transcript = '';
        recognition.lang = 'en-US';
        recognition.start();
        ignore_onend = false;
        start_timestamp = Math.floor(Date.now());
    }
}, 10000)



////////////////////////// Map Script Items /////////////////////////////////

function script() {
    var verified = getCookie("verified");
    if (verified == "false") {
        window.location.replace("./index.html");
    }

	var secLat = 42.405892;
    var secLng = -71.116562;

    
    moveOn1();

    function moveOn1() {
    	var map;
    	cent = new google.maps.LatLng(secLat, secLng);
		var initOptions = {
	            zoom: 15,
	            center: cent,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
		map = new google.maps.Map(document.getElementById("map"), initOptions);
	}


    // API Key: d0835923-7f86-490f-a542-1f4ae031a374
	/// Get Class Data using HTTP "POST"
        var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://academic-ni.cloud.thingworx.com/Thingworx/Things/NIUtility/Services/CreateApplicationKey",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "accept": "application/json",
    "appkey": "712ce35d-2511-48da-9c15-a1d45a044f4f"
  },
  "processData": false,
  "data": "{\n\t\"appKeyName\":\"MyKey\",\n\t\"username\":\"ME184\"\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}