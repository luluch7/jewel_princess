var jewel = (function() {

	//defining the board settings
	var settings = {
		rows: 8,
		cols: 8,
		baseScore: 100, //number of points awarded per jewel combo (number changes depending on combo)
		baseLevelScore: 1500, 
		baseLevelExp: 1.05, 
		baseLevelTimer: 60000, //p.259 (will slowly count down until game over)
							   //6000 = time in milliseconds for 1st level (it gets faster as player levels up)
		numJewelTypes: 7, // different jewel types (sprites)

		//p 213
		//by using keywords for the controls, it's easy to adjust the game for different platforms without having to adjust the code itself
		//bind() will be used to attach handler functions to game actions
		//trigger() is an empty function that will, later on, do the function calling. If trigger is called with additional arguments,
			//they are passed on to the handler functions
		controls: {
			//keyboard
			KEY_UP: "moveUp",
			KEY_LEFT: "moveLeft",
			KEY_DOWN: "moveDown",
			KEY_RIGHT: "moveRight",
			KEY_ENTER: "getHeart",
			KEY_SPACE: "getHeart",

			//mouse + touch
			CLICK: "getHeart",
			TOUCH: "getHeart",

			//gamepad
			BUTTON_A: "getHeart",
			LEFT_STICK_UP: "moveUp",
			LEFT_STICK_DOWN: "moveLeft",
			LEFT_STICK_RIGHT: "moveRight"
		}//end of controls
	};

	var scriptQueue = [],
		numResourcesLoaded = 0,
		numResources = 0,
		executeRunning = false;

	function executeScriptQueue() {
		var next = scriptQueue[0],
		first, script;

		if(next && next.loaded) {
			executeRunning = true;
			//remove the first element in the queue
			scriptQueue.shift();
			first = document.getElementsByTagName("script")[0];
			script= document.createElement("script");
		
			script.onload = function() {
				if(next.callback) {
					next.callback();
				} //end of if(next.callback)
				//try to execute more scripts
				executeScriptQueue();
			}; //end of script.onload()

		script.src = next.src;
		first.parentNode.insertBefore(script, first);
		//end of if(next && next.loaded)
	} else { 
		executeRunning = false;
		}
	} //end of executeScriptQueue()

function load(src, callback) {
		var image, queueEntry;
		numResources++;

		//add this resource to the execution queue
		queueEntry = {
			src: src,
			callback: callback,
			loaded: false
		}; //end of queueEntry

		scriptQueue.push(queueEntry);
		image = new Image();
		
		image.onload = image.onerror = function() {
			numResourcesLoaded++;
			queueEntry.loaded = true;
			if (!executeRunning) {
				executeScriptQueue();
			} //end of if statement
		}; //end of image.onload
		
		image.src = src;
	} //end of load()

	//determines how much of the game has loaded at any given time
	//this will help creating the loading bar
	function getLoadProgress() {
		//will return the loading progress as a value between 0 and 1
		console.log(numResourcesLoaded / numResources);
		return numResourcesLoaded / numResources;
	} //end of getLoadProgress()
	
	

	//hides active screen and shows screen with specified ID
	function showScreen(screenId){
		var dom = jewel.dom,
		$ = dom.$,
		activeScreen = $("#game .screen.active")[0],
		screen = $("#" + screenId)[0];
		if(!jewel.screens[screenId]) {
			alert("This module is not implemented yet!");
			return;
		}//end of if(!jewel.screens[screenId])

		if(activeScreen) {
			dom.removeClass(activeScreen, "active");
		} //end of if(activeScreen)

		dom.addClass(screen, "active");
		//run the screen module
		jewel.screens[screenId].run();
	} //end of showScreen()

	// isStandalone() examines the window.navigator object for a property named standalone
	// if the property is true, the page was launched from the homescreen in web app mode and
	// an install screen will show up instead of the splash screen
	function isStandalone() {
		//to test on the desktop use:
		//standalone==false instead of standalone!==false
		return (window.navigator.standalone !== false);
	}



	function setup() {
		//hides address bar on Android devices
		if(/Android/.test(navigator.userAgent)) {
			jewel.dom.$("html")[0].style.height = "200%";
			setTimeout(function() {
				window.scrollTo(0,1);
			}, 0); 
		}

		//disable native touchmove to prevent overscroll
		jewel.dom.bind(document, "touchmove", function(event) {
			event.preventDefault();
		});

		if (isStandalone()) {
			showScreen("splash-screen");
		} else {
			showScreen("install-screen");
		}

		//console.log("Success!");
	} //end of setup()





	return {
		isStandalone: isStandalone,
		load: load,
		setup: setup,
		showScreen: showScreen,
		screens: {},
		settings: settings,
		getLoadProgress: getLoadProgress
	};

 }) ();
	
	