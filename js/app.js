// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var music = document.getElementById('radio'); // id for audio element
var duration; // Duration of audio clip
var pButton = document.getElementById('pButton'); // play button

var mButton = document.getElementById('mButton'); // mute button

var playhead = document.getElementById('playhead'); // playhead

var timeline = document.getElementById('timeline'); // timeline
// timeline width adjusted for playhead
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

// timeupdate event listener
music.addEventListener("timeupdate", timeUpdate, false);

//Makes timeline clickable
timeline.addEventListener("click", function (event) {
	moveplayhead(event);
	music.currentTime = duration * clickPercent(event);
}, false);

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(e) {
	return (e.pageX - timeline.offsetLeft) / timelineWidth;
}

// Makes playhead draggable
playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that mouse is moved on mouseUp only when the playhead is released
var onplayhead = false;
// mouseDown EventListener
function mouseDown() {
	onplayhead = true;
	window.addEventListener('mousemove', moveplayhead, true);
	music.removeEventListener('timeupdate', timeUpdate, false);
}
// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(e) {
	if (onplayhead == true) {
		moveplayhead(e);
		window.removeEventListener('mousemove', moveplayhead, true);
		// change current time
		music.currentTime = duration * clickPercent(e);
		music.addEventListener('timeupdate', timeUpdate, false);
	}
	onplayhead = false;
}
// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(e) {
	var newMargLeft = e.pageX - timeline.offsetLeft;
	if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
		playhead.style.marginLeft = newMargLeft + "px";
	}
	if (newMargLeft < 0) {
		playhead.style.marginLeft = "0px";
	}
	if (newMargLeft > timelineWidth) {
		playhead.style.marginLeft = timelineWidth + "px";
	}
}

// timeUpdate
// Synchronizes playhead position with current point in audio
function timeUpdate() {
	var playPercent = timelineWidth * (music.currentTime / duration);
	playhead.style.marginLeft = playPercent + "px";
	if (music.currentTime == duration) {
		pButton.className = "";
		pButton.className = "play";
	}
}

//Play and Pause
function play() {
	// start music
	if (music.paused) {
		music.play();
		// remove play, add pause
		pButton.className = "";
		pButton.className = "pause";
	} else { // pause music
		music.pause();
		// remove pause, add play
		pButton.className = "";
		pButton.className = "play";
	}
}
//mute
function mute() {
	// start music
	if (music.volume==1) {
		music.volume=0;
		// remove play, add pause
		mButton.className = "";
		mButton.className = "unmute";
	} else { // pause music
		music.volume=1;
		// remove pause, add play
		mButton.className = "";
		mButton.className = "mute";
	}
}

// Gets audio file duration
music.addEventListener("canplaythrough", function () {
	duration = music.duration;
}, false);

//Now Playing Text

var latestSongOnAir = "Cloudstaff Radio - Let's Rock!";

function updateLatestSongOnAir() {
       $.ajax({
           url: "../now_playing/now_playing.txt",
           cache: false,
           success: function(data) {
                   latestSongOnAir = data;
                   $('#streamTitle').html(data);
               }
        });

  };
    updateLatestSongOnAir();
  setInterval("updateLatestSongOnAir()", 15000);
