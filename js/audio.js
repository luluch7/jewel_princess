/* audio.js */

jewel.audio = (function () {
	var extension,
		sounds, //p.301
		activeSounds; //p.303

	//p.300
	function initialize() {
		extension = formatTest();
		if (!extension) {
			return;
		} //end of IF

		sounds = {}; //p.302
		activeSounds = []; //p.303
	}//end of initialize()


	//p.301
	//formatTest() has loops that go through the different format types and returns
	//the first format for which the canPlayType() returns probably
	function formatTest() {
		var audio = new Audio(),
		    types = [
		    	["ogg", "audio/ogg; codecs='vorbis'"],
		    	["mp3", "audio/mpeg"]
		    ];

		for (var i=0; i<types.length; i++) {
			if (audio.canPlayType(types[i][1]) == "probably") {
				return types[i][0];
			} //end of IF
		} //end of FOR loop

		//if no "probably" audio formats are found, a loop for "maybe" runs
		//"maybe" means that the audio format might be supported, but something could still go wrong
		for (i=0; i<types.length; i++) {
			if (audio.canPlayType(types[i][1]) == "maybe") {
				return types[i][0];
			}//end of IF
		}//end of FOR loop
	}//end of formatTest()


	//p.302 
	//the parameter "name" is the name of the audio file minus its extension
	function createAudio(name) {
		var el = new Audio("sounds/" + name + "." + extension);

		jewel.dom.bind(el, "ended", cleanActive);
		
		//an array keeps track of each sound effect used, so those elements can
		//be reused after they're done playing (refer to getAudioElement())
		sounds[name] = sounds[name] || [];
		sounds[name].push(el);
		
		return el;
	} //end of createAudio()

	//p.302
	//function checks whether there's already an audio element that it can use
	//if not, a new element is created 
	function getAudioElement(name) {
		if (sounds[name]) {
			for (var i=0, n=sounds[name].length; i<n; i++) {
				if (sounds[name][i].ended) {
					return sounds[name][i];
				}//end of if
			}//end of FOR
		}//end of IF

		return createAudio(name);
	}//end of getAudioElement();

	//p.303
	//when play() plays a sound, it stores a reference to that sound in an activeSounds array
	function play(name) {
		var audio = getAudioElement(name);
			audio.play();
			activeSounds.push(audio);
	}//end of play()

	//stop() goes through the activeSounds array calls audio.stop() and empties the array 
	function stop() {
		for (var i=activeSounds.length-1; i >= 0; i--) {
			activeSounds[i].stop();
		}//end of FOR
		activeSounds.length = 0;
	}

	//p.304
	//cleanActive() removes audio elements from the activeSounds array by using "splice"
	//it only does that when the element has ended playing
	function cleanActive() {
		for (var i=0; i<activeSounds.length; i++) {
			if (activeSounds[i].ended) {
				activeSounds.splice(i, 1);
			}//end of IF
		}//end of FOR
	}//end of cleanActive()

	return {
		initialize: initialize, //p.303
		play: play, //p.303
		stop: stop //p.304
	};


})();//end of jewel.audio