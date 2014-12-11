//requestAnimationFrame.js

//p. 238

/*This is a polyfill that creates a requestAnimationFrame() method on the window object if one doesn't already exist.*/
window.requestAnimationFrame = (function() {
	var startTime = Date.now(); //Date.now() returns the numeric value corresponding to the current time - the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
	return window.requestAnimationFrame ||
		   window.webkitRequestAnimationFrame ||
		   window.mozRequestAnimationFrame ||
		   //if no implementation is available, the functionality is simulated using a setTimeout() call
		   function(callback){
		   	return window.setTimeout(
		   		function() {
		   			callback(Date.now() - startTime);
		   		}, 1000/60 //60x per second
		   	);
		};
})(); 

window.cancelRequestAnimationFrame = (function() {
	return window.cancelRequestAnimationFrame ||
		   window.webkitCancelRequestAnimationFrame ||
		   window.mozCancelRequestAnimationFrame ||
		   window.clearTimeout;
})();