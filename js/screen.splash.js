jewel.screens["splash-screen"] = (function() {
	var firstRun = true;

	//checks progress + updates progress bar
	function checkProgress() {
		var $ = jewel.dom.$,
		    p = jewel.getLoadProgress() * 100;
		    //progress bar returns value between 0 and 1
		    //multiply it by 100 to get the percentage value

		$("#splash-screen .indicator")[0].style.width = p+"%";
		
		if (p==100) {
			//if progress is 100%, run setup() function
			setup();
		} else {
			//otherwise, setTimeout schedules another check in 30milliseconds
			setTimeout(checkProgress,30);
			//(the CONTINUE link will only be shown once everything is loaded)
		} //end of else

	} //end of checkProgress()

	//setup() uses new helper function from DOM module
	function setup() {
		var dom = jewel.dom,
			  $ = dom.$,
	     screen = $("#splash-screen")[0];

	     //"continue" is hidden but it will become visible once everything loads
	     $(".continue", screen)[0].style.display = "block";  
		
		//dom.bind() takes a selector string, finds element and attaches handler function to the specific event 
		/*jewel.dom.bind("#splash-screen", "click", function() { //when on splash-screen, click will run this function
			jewel.showScreen("main-menu"); //this will show the main-menu screen
		}); //end of jewel.dom.bind */

		dom.bind(screen, "click", function() {
			jewel.showScreen("main-menu");
		});

	}//end of setup()

	//run() method calls the setup() function which sets up an event handler on the screen element that switches screens when the user clicks on something
	function run() {
	if (firstRun) { //firstRun is defined as true, so setup() will run
		
		//setup(); 
		checkProgress(); //ch. 7 - now run() calls checkProgress() instead of setup()

		//the checkProgress() function queries the jewel.getLoadPRogress() function and adjusts the width of the inner div of the progress bar accordingly

		firstRun = false; //after run() runs once, firstRun will become false so setup() won't run again
	
	    } //end of if statement
	} //end of run()

	return {
	run:run
	}; //end of return

})(); //end of jewel.screens 