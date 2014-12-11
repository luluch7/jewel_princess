jewel.screens["main-menu"] = (function() {
	var dom = jewel.dom,
	firstRun = true;

	function setup() {
		dom.bind("#main-menu ul.menu", "click", function(e) {
			if (e.target.nodeName.toLowerCase() === "button") {
				var action = e.target.getAttribute("name");
				jewel.showScreen(action);
			}//end of if statement
		});//end of dom.bind
	} //end of setup()

	function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		} //end of if(firstRun)
	}//end of run()
	
	return {
		run: run
	};
})(); //end of jewel.screens